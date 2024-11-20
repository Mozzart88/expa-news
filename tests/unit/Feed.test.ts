import assert from 'node:assert'
import { mock, describe, it } from 'node:test'
import Feed from './../../src/FeedParser/Feed.js'
import { readFile} from 'node:fs'


describe('Feed positive', async () => {
    it('constructor', async () => {
        Object.defineProperty(
            Feed.prototype,
            'getData',
            {
                'value': async (url: URL): Promise<string> => {
                    return new Promise((resolve, rejecte) => {
                        try {
                            readFile(url.toString(), {
                                encoding: 'utf-8'
                            }, (err, data) => {
                                if (err) {
                                    rejecte(err)
                                } else {
                                    resolve(data)
                                }
                            })
                        } catch (err) {
                            resolve(err)
                        }

                    })
                }
        }) 
        
        const path = {
            value: '/workspaces/expa-news/tests/provision/lapolitica.feed.xml',
            toString() {
                return this.value
            }
        }
        const url = path
        const feed = new Feed(url as unknown as URL)
        await feed.update()
    })
})

describe('Feed negative', () => {
    it.todo('constructor infvalid url')
    it.todo('constructor infvalid data')
    it.todo('constructor infvalid data')
})
