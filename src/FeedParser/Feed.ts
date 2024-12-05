import https from 'node:https'
import FeedItem from "./FeedItem.js"
import { randomUUID, UUID } from 'node:crypto'
import { GPTThreadId } from '../gpt/GPTThread.js'


export type FeedOptions = {
    id?: UUID
    publisher_name: string
    rss: string
    last_access: number
    last_build: number
    channels: string[]
    thread_id: GPTThreadId,
    ttl?: number
}

export default class Feed implements Iterable<FeedItem> {

    private _id: UUID
    private _publisher: string
    private _url: URL
    private _lastUpdate: number = 0
    private _lastBuild: number = 0
    private _channels: string[]
    private _threadId: GPTThreadId
    private _ttl: number
    private _feed: FeedItem[] = []

    constructor (config: FeedOptions) {
        this._id = config.id ?? randomUUID()
        this._publisher = config.publisher_name
        this._url = new URL(config.rss)
        this._lastUpdate = config.last_access
        this._lastBuild = config.last_build
        this._channels = config.channels
        this._threadId = config.thread_id
        this._ttl = config.ttl ?? 15
    }

    public [Symbol.iterator](): Iterator<FeedItem> {
        let index = 0
        const items = this._feed

        return {
            next(): IteratorResult<FeedItem> {
                if (index < items.length) {
                    return { value: items[index++], done: false}
                } else {
                    return { value: undefined, done: true}
                }
            }
        }
    }

    public get id(): UUID {
        return this._id
    }
    
    public get ttl(): number {
        return this._ttl
    }

    public get length(): number {
        return this._feed.length
    }

    public get latest(): FeedItem {
        const lastIndex = this._feed.length - 1
        return this._feed.toSorted((a, b) => {
            return a.timestamp - b.timestamp
        })[lastIndex]
    }

    public get publisher(): string {
        return this._publisher
    }

    public get channels(): string[] {
        return this._channels
    }

    public get thread(): GPTThreadId {
        return this._threadId
    }

    public async update(handler?: (feed: Feed) => void): Promise<Feed> {
        const data = await this.getData(this._url)
        const {ttl, feed} = this.parse(data)
        this._feed = feed.filter((item) => {
            if (this._feed.find((feedItem) => {
                return feedItem.id.value == item.id.value
            }) === undefined)
                return item
        })
        this._ttl = ttl
        this._lastUpdate = Date.now()
        if (handler)
            handler(this)
        return this
    }

    public autoUpdate(handler: (feed: Feed) => void): NodeJS.Timeout {
        this.update(handler)
        return setInterval(() => {
            this.update(handler)
        }, this._ttl * 60 * 1000)
    }

    public toJSON(): FeedOptions {
        return {
            id: this._id,
            publisher_name: this._publisher,
            rss: this._url.toString(),
            last_access: this._lastUpdate,
            last_build: this._lastBuild,
            channels: this._channels,
            thread_id: this._threadId,
            ttl: this._ttl
        }
    }

    /**
     * Not implemented
     */
    public getAfter(uid: string): FeedItem {
        throw new Error('Method is not implemented yet')
    }

    /**
     * Not implemented
     */
    public getBefore(uid: string): FeedItem {
        throw new Error('Method is not implemented yet')
    }
    
    private async getData(url: URL): Promise<string> {
        return new Promise((resolve, reject) => {
            https.get(url, {
                'headers': {
                    'user-agent': 'curl/7.68.0'
                }
            }, (res) => {
                let data: Buffer[] = []
                if (res.statusCode != 200) {
                    throw new Error(`status code: ${res.statusCode}`)
                }
                res.on('data', (chunk) => {
                    data.push(chunk)
                })
                res.on('end', () => {
                    const buff = Buffer.concat(data)
                    const res = buff.toString('utf-8')
                    resolve(res)
                })
            }).on('error', (error) => { reject(error) })
        })
    }

    private parse(data: string) {
        this.validate(data)
        const lastBuild = this.parseLastBuild(data)
        let feed: FeedItem[] = []
        if (this._lastBuild < lastBuild) {
            const itemsRaw = data.matchAll(/<item>.*?<\/item>/gs)
            for (const raw of itemsRaw) {
                try {
                    const newItem = new FeedItem(raw[0])
                    if (newItem.timestamp > this._lastUpdate && feed.find((item) => item.id.value == newItem.id.value) === undefined)
                        feed.push(newItem)
                } catch (err) {
                    console.error(`Fail to create FeedItem on ${this._publisher}: ${err.message}`)
                }
            }
            this._lastBuild = lastBuild
        }
        const ttlValue = data.match(/<ttl>([\d]+)<\/ttl>/)
        const ttl = ttlValue ? parseInt(ttlValue[1]) : 15
        return {ttl: ttl ? ttl : 15, feed: feed}
    }

    private validate(data: string) {
        if (!data.startsWith('<?xml')) {
            throw new Error('Invalid XML')
        }
        if (!data.includes('<rss')) {
            throw new Error('Invalid RSS')
        }
    }

    private parseLastBuild(data: string): number {
        const raw = data.match(/<lastBuildDate>(.*?)<\/lastBuildDate>/) ?? data.match(/<pubDate>(.*?)<\/pubDate>/i)
        if (raw === undefined || raw?.length === 1) {
            throw new Error('Fail to get lastBuildDate')
        }
        const date = raw![1].replace('<![CDATA[', '').replace(']]', '')
        if (date.length === 0)
            return Date.now()
        return Date.parse(date)
    }
}
