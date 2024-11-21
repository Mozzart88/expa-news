import assert from 'node:assert'
import { mock as timeMock, describe, it, after } from 'node:test'
import Feed from './../../src/FeedParser/Feed.js'
import Mock from '../Mock/Mock.js'
import { secureHeapUsed } from 'node:crypto'


describe('Feed positive', async () => {
    const mock = new Mock(Feed.prototype)
    mock.method('getData', async (url: URL): Promise<string> => {
        return new Promise((resolve, reject) => {
            const now = new Date()
            const data = [
                crypto.randomUUID(),
                crypto.randomUUID(),
                crypto.randomUUID(),
                crypto.randomUUID(),
                crypto.randomUUID(),
                crypto.randomUUID(),
                crypto.randomUUID(),
                crypto.randomUUID(),
                crypto.randomUUID(),
                crypto.randomUUID(),
            ]
            let rss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
            <ttl>5</ttl>`
            for(const note of data) {
                rss += `
            <item>
                <title>${note}</title>
                <link>https://some.com/${note}</link>
                <guid isPermaLink="false">${note}</guid>
                <pubDate>${new Date(now.setMinutes(now.getMinutes() - 5)).toUTCString()}</pubDate>
                <description>Some description of ${note} note</description>
                <content>Some content of ${note} note></content>
            </item>`
            }
            rss += `
        </chennel>
    </rss>
`
            resolve(rss)
        })
    })

    it('initial update', async () => {
        
        const url = 'https://some.com/'
        const feed = new Feed(url)
        await feed.update()
    })

    it('iterator', async () => {
        const url = 'https://some.com/'
        const feed = await new Feed(url).update()
        const arr: unknown[] = []
        for(const item of feed) {
            arr.push(item)
        }
        assert.strictEqual(arr.length, 10)
    })

    it('latest', async () => {
        const url = 'https://some.com/'
        const feed = await new Feed(url).update()
        const latest = feed.latest
        let actual = latest
        for(const item of feed) {
            if (actual.timestamp < item.timestamp) {
                actual = item
            }
        }
        assert.deepStrictEqual(actual, latest)
    })

    it('update', async () => {
        timeMock.timers.enable({ apis: ['Date'], now: Date.now()})
        const feed = await new Feed('https://some.com/').update()
        const oldNote = feed.latest
        const newDate = new Date(new Date().setMinutes(new Date().getMinutes() + 25))
        timeMock.timers.setTime(newDate.getTime())
        await feed.update()
        const newNote = feed.latest
        assert.strictEqual(newNote.timestamp, newDate.setMinutes(newDate.getMinutes() - 5, newDate.getSeconds(), 0))
        assert.ok(oldNote.timestamp < newNote.timestamp)
        assert.strictEqual(new Date(newNote.timestamp - oldNote.timestamp).getMinutes(), 25)
        timeMock.reset()
    })

    it.skip('autoUpdate', async () => {
        timeMock.timers.enable({ apis: ['Date'], now: Date.now()})
        const feed = new Feed('https://some.com/')
        await feed.update()
        const interval = feed.autoUpdate((update) => {
            const oldNote = feed.latest
            const newNote = update.latest
            assert.strictEqual(newNote.timestamp, new Date().setMinutes(new Date().getMinutes() - 5))
            assert.ok(oldNote.timestamp < newNote.timestamp)
            assert.strictEqual(new Date(newNote.timestamp - oldNote.timestamp).getMinutes(), 25)
            clearInterval(interval)
        })
        const newDate = new Date().setMinutes(new Date().getMinutes() + 25)
        timeMock.timers.setTime(newDate)
        setTimeout(() => {}, 100)
    })
    after(() => {
        mock.resetAll()
    })
})

describe('Feed negative', () => {
    it('constructor infvalid url', () => {
        assert.rejects(async () => {
            await new Feed('some/url').update()            
        }, new TypeError('Invalid URL'))
    })

    it.todo('constructor infvalid data')
    it.todo('constructor infvalid data')
})
