import assert from 'node:assert'
import { after, before, describe, it } from 'node:test'
import { readFile } from 'node:fs/promises'
import https from 'node:https'
import Feed from '../../../src/FeedParser/Feed.js'

function delay(ms: number) {
    return new Promise((resolove) => {
        setTimeout(resolove, ms)
    })
}

describe('Feed integrating positive', async () => {
    const server = https.createServer({
        rejectUnauthorized: false,
        key: await readFile('tests/provision/certs/key.pem'),
        cert: await readFile('tests/provision/certs/cert.pem')
    }, async (request, result) => {
        console.log('New Connection')
        const data = await readFile('logs/p12.xml', 'utf-8')
        result.writeHead(200, {'content-type': 'application/xml'})
        result.end(data)
    })
    before(() => {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
        server.listen(8000, () => console.log('Server starte'))
    })
    after(() => {
        server.close()
    })
    it('Create Feed', async () => {
        const feed = new Feed({
            channels: ['@some'],
            last_access: 0,
            last_build: 0,
            publisher_name: 'Pagina 12',
            rss: 'https://127.0.0.1:8000',
            thread_id: 'thread_some'
        })
        await feed.update()
        assert.strictEqual(feed.length, 113)
    })
    await it('Create update with no updates', async () => {
        const feed = new Feed({
            channels: ['@some'],
            last_access: 0,
            last_build: 0,
            publisher_name: 'Pagina 12',
            rss: 'https://127.0.0.1:8000',
            thread_id: 'thread_some'
        })
        await feed.update()
        await delay(1000)
        await feed.update()
        assert.strictEqual(feed.length, 0)
    })
})
