type ContentType = `${string}/${string}`

export default class ItemEnclosure {
    private _url: URL
    private _type: ContentType
    private _length: number

    constructor(data: string) {
        this.setURL(data)
        this.setType(data)
        this.setLength(data)
    }

    public get url(): URL {
        return this._url
    }

    public get type(): ContentType {
        return this._type
    }

    public get length(): number {
        return this._length
    }

    public toJSON(): {} {
        return {
            url: this.url.toString(),
            type: this.type
        }
    }

    private setURL(data: string) {
        const pattern = /url="(http[s]?:\/\/.+?)"/i
        const res = data.match(pattern)

        if (!res || res.length !== 2 || res[1].length === 0) {
            throw new Error('Enclosure: URL attribute is mandatory')
        }
        this._url = new URL(res[1])
    }

    private setType(data: string) {
        const pattern = /type="([\/-_a-z]+)"/i
        const res = data.match(pattern)

        if (!res || res.length !== 2 || res[1].length === 0) {
            throw new Error('Enclosure: Type attribute is mandatory')
        }
        this._type = res[1] as ContentType
    }

    private setLength(data: string) {
        const pattern = /length="([\d]+)"/i
        const res = data.match(pattern)

        if (!res || res.length == 1) {
            this._length = 0
        } else {
            this._length = parseInt(res[1])
        }
    }
}
