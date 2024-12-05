export default class ItemId {
    private _isPermaLink: boolean
    private _value: string

    constructor(data: string) {
        this.setIsPermaLink(data)
        this.setValue(data)
    }

    public get isPermaLink(): boolean {
        return this._isPermaLink
    }

    public get value(): string {
        return this._value
    }

    public toString(): string {
        return this._value
    }

    private setIsPermaLink(data: string) {
        const pattern = /ispermalink(=["]?(true|false|0|1)["]?)?/i
        const res = data.match(pattern)

        if (!res) {
            this._isPermaLink = false
        } else if (res.length === 3) {
            this._isPermaLink = !['false', 'FALSE', '0'].includes(res[2])
        } else {
            this._isPermaLink = true
        }
    }

    private setValue(data: string) {
        const pattern = />(.*?)<\//s
        const res = data.match(pattern)

        if (!res || res.length !== 2 || res[1].length === 0) {
            throw new Error('ItemId: data should have value')
        }
        if (this._isPermaLink) {
            try {
                this._value = new URL(res[1]).toString()
            } catch (err) {
                throw new Error('ItemId: Value of PermaLink should be an URI')
            }

        } else {
            this._value = res[1]
        }
    }
}
