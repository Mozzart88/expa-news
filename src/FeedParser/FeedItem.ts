import { ItemTitle, ItemDescription, ItemContent } from './ItemFormattedString.js'
import ItemEnclosure from './ItemEnclosure.js'
import ItemId from './ItemId.js'

export type JSONSchema = {
    title: string,
    description?: string,
    content?: string,
    link: string
}

export default class FeedItem {
    private _title: ItemTitle
    private _link: URL
    private _id: ItemId
    private _timestamp: number
    private _description?: ItemDescription
    private _content?: ItemContent
    private _enclosure?: ItemEnclosure

    constructor (data: string) {
        this.parse(data)
    }

    public get title(): ItemTitle {
        return this._title
    }

    public get link(): URL {
        return this._link
    }

    public get id(): ItemId {
        return this._id
    }

    public get timestamp(): number {
        return this._timestamp
    }

    public get description(): ItemDescription | undefined {
        return this._description
    }

    public get content(): ItemContent | undefined{
        return this._content
    }

    public get enclosure(): ItemEnclosure | undefined{
        return this._enclosure
    }

    public toString(debug?: boolean): string {
        if (debug) {
            return JSON.stringify({
                title: this._title,
                link: this._link,
                id: this._id,
                timestamp: this._timestamp,
                description: this._description,
                content: this._content,
                enclosure: this._enclosure,
                })
        }
        return `${this.title} at ${this.timestamp}\n${this.link}\n${this.description ?? ''}\n\n${this.content ?? ''}`
    }

    public toJSON(): JSONSchema {
        return {
            title: this.title.text,
            description: this.description?.text,
            content: this.content?.text,
            link: this.link.toString(),
        }
    }


    private parse(data: string) {
        this.setTitle(data)
        this.setLink(data)
        this.setDate(data)
        this.setGUID(data)
        this.setDescription(data)
        this.setContent(data)
        this.setEnclosure(data)
    }

    private setTitle(data: string) {
        const pattern = /<title>(.+?)<\/title>/s
        const res = data.match(pattern)

        if (!res || res.length !== 2 || res[1].length === 0) {
            throw new Error('Title is mandatory')
        }
        this._title = new ItemTitle(res[1])
    }

    private setLink(data: string) {
        const pattern = /<link>(.+?)<\/link>/s
        const res = data.match(pattern)

        if (!res || res.length !== 2 || res[1].length === 0) {
            throw new Error('Link is mandatory')
        }
        this._link = new URL(res[1].trim())
    }

    private setGUID(data: string) {
        const pattern = /<guid[a-zA-Z "=-_]*>.+?<\/guid>/s
        const res = data.match(pattern)

        if (!res || res[0].length === 0) {
            throw new Error('Id (guid) is mandatory')
        }
        this._id = new ItemId(res[0])
    }

    private setDate(data: string) {
        const pattern = /<pubdate>(.*?)<\/pubdate>/si
        const res = data.match(pattern)

        if (!res || res.length !== 2) {
            throw new Error('Date is mandatory')
        }
        let clean = res[1].replace(/^<!\[CDATA\[/, '')
        clean = clean.replace(/\]\]>$/, '')
        if (clean.length === 0) {
            throw new Error('Date can\'t be empty')
        }
        this._timestamp = Date.parse(clean)
    }

    private setDescription(data: string) {
        const pattern = /<description>(.*?)<\/description>/s
        const res = data.match(pattern)

        if (res && res[1] !== undefined) {
            this._description = new ItemDescription(res[1])
        }
    }
    
    private setContent(data: string) {
        const pattern = /<content[\s\w\d:]*?>(.*?)<\/content[\s\w\d:]*?>/s
        const res = data.match(pattern)
    
        if (res && res.length == 2 && res[1]) {
            this._content = new ItemContent(res[1])
        }
    }

    private setEnclosure(data: string) {
        const pattern = /<enclosure(.*?)\/[\s]*>/s
        const res = data.match(pattern)
    
        if (res && res.length == 2 && res[1]) {
            this._enclosure = new ItemEnclosure(res[1])
        }
    }
}