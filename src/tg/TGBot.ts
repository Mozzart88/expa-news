import https from 'node:https'

type RequestOptions = {
    method: string,
    data: {[key: string | symbol]: any}
}

type RequestResult = {
    ok: boolean,
    result: any
}

type TGMessage = {
    [key: string | number | symbol]: any
}

export default class TGBot {
    private _url: URL

    constructor(key: string) {
        const url = `https://api.telegram.org/bot${key}/`
        this._url = new URL(url)
    }

    public async sendMessage(chatId: string | number, content: string) {
        const opts: RequestOptions = {
            method: 'sendMessage',
            data: {
                parse_mode: 'Markdown',
                text: content,
                // text: content.replaceAll(/[_*\[\]\(\)~`>#+-=|\{\}\.!]/g, '\\\\$&'),
                chat_id: chatId
            }
        }
        try {
            const res = await this.sendRequest(opts)
            if (res.ok === false)
                throw new Error(`Fail to send message: ${res}`)
        } catch (err) {
            throw err
        }
    }

    private async sendRequest(options: RequestOptions): Promise<RequestResult | never> {
        const url = this._url
        url.pathname += options.method
        return new Promise((resolve, reject) => {
            const opts: https.RequestOptions = {
                'headers': {
                    "content-type": 'application/json'
                },
                method: 'post'
            }
            const request = https.request(url, opts, (res) => {
                let data: Buffer[] = []
                let hasError = false

                if (res.statusCode !== 200) {
                    console.error(`Network Error: ${res.statusCode} - ${res.statusMessage}`)
                    hasError = true
                }

                res.on('data', (chunk) => {
                    data.push(chunk)
                })

                res.on('end', () => {
                    const run = Buffer.concat(data).toString('utf-8')
                    if (hasError) {
                        reject(run)
                    } else {
                        resolve(JSON.parse(run) as RequestResult)
                    }
               })
            })
            request.on('error', (err) => {
                reject(err)
            })
            request.write(JSON.stringify(options.data))
            request.end()
        })
    }
}