import https from 'node:https'
import FeedItem from "./FeedItem.js"

export default class Feed implements Iterable<FeedItem> {

    private _ttl: number = 15
    private _lastUpdate: number = 0
    private _feed: FeedItem[] = []
    private _url: URL

    constructor (url: URL) {
        this._url = url
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

    public get latest(): FeedItem {
        const lastIndex = this._feed.length - 1
        return this._feed.toSorted((a, b) => {
            return a.timestamp - b.timestamp
        })[lastIndex]
    }

    public async update(): Promise<Feed> {
        const data = await this.getData(this._url)
        const {ttl, feed} = this.parse(data)
        this._feed = feed.filter((item) => {
            if (item.timestamp > this._lastUpdate)
                return item
        })
        this._ttl = ttl
        this._lastUpdate = Date.now()
        return this
    }

    public autoUpdate(handler: (feed: Feed) => void): NodeJS.Timeout {
        return setInterval(() => {
            this.update()
            .then((feed) => {
                handler(feed)
            })
            .catch(err => {throw err})
        }, this._ttl * 60 * 1000)
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
            https.get(url, (res) => {
                if (res.statusCode != 200) {
                    throw new Error(`status code: ${res.statusCode}`)
                }
                res.on('data', (data) => {
                    resolve(data)
                })
            }).on('error', (error) => { reject(error) })
        })
    }

    private parse(data: string) {
        this.validate(data)
        const itemsRaw = data.matchAll(/<item>.*?<\/item>/gs)
        let feed: FeedItem[] = []
        for (const raw of itemsRaw) {
            feed.push(new FeedItem(raw[0]))
        }
        const ttlValue = data.match(/<ttl>[\d]+<\/ttl>/)
        const ttl = ttlValue ? parseInt(ttlValue[0]) : 15
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
}