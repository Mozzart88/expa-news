const FormatTypes = ['html', 'md', 'string'] as const
type FormatType = (typeof FormatTypes)[keyof typeof FormatTypes]

abstract class ItemFormattedString {
    protected data: string

    public get rawValue(): string {
        return this.data
    }

    public get text(): string {
        return this.formatted('string')
    }

    public get html(): string {
        return this.formatted('html')
    }

    public get md(): string {
        return this.formatted('md')
    }

    public formatted(format: FormatType): string | never {

        switch (format) {
            case 'html':
                throw new Error('Format not implemented yet')
            case 'md':
                throw new Error('Format not implemented yet')
            case 'string':
                let res = this.data.replaceAll(/<.*?>/g, '\n')
                res = res.replaceAll(/&[a-z]{2,5};>/g, '')
                res = res.replace(/<!\[CDATA\[/, '')
                res = res.replace(/\]\]>/, '')
                return res
            default:
                throw new Error('Invalid format')
        }
    }

    public toString(): string {
        return this.formatted('string')
    }
}

export class ItemTitle extends ItemFormattedString {
    constructor(data: string) {
        super()
        this.data = data
    }
}

export class ItemDescription extends ItemFormattedString {
    constructor(data: string) {
        super()
        this.data = data
    }
}

export class ItemContent extends ItemFormattedString {
    constructor(data: string) {
        super()
        this.data = data
    }
}
