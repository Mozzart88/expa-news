import https from 'node:https'

export type AnyJson = { [key: string | symbol]: any }

const methods = ['get', 'post', 'delete']
type Mehod = typeof methods[number]

export type RequestOptions = {
    method: Mehod
    path: string[]
    params?: AnyJson
    data?: AnyJson
}

export default class GPTClient {
    private readonly _url: URL = new URL('https://api.openai.com/v1/')
    private readonly _key: string
    private static _instance: GPTClient

    public static init(key: string) {
        if (GPTClient._instance === undefined)
            GPTClient._instance = new GPTClient(key)
    }

    public static get instance(): GPTClient {
        return GPTClient._instance
    }

    public static set key(key: string) {
        GPTClient.init(key)
    }

    public static get url(): URL {
        return new URL(GPTClient._instance._url)
    }

    public static get key(): string {
        return GPTClient._instance._key
    }

    private constructor(key) {
        this._key = key
    }

    public async sendRequest<T extends AnyJson>(options: RequestOptions): Promise<T>{
        const {
            method,
            params,
            path,
            data
        } = options

        return new Promise((resolve, reject) => {
            const url = GPTClient.url
            url.pathname += path.join('/')
            if (params) {
                for(const p in params) {
                    url.searchParams.append(p, params[p])
                }
            }
            const opts: https.RequestOptions = {
                'headers': {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${this._key}`,
                    'OpenAI-Beta': 'assistants=v2'
                },
                method: method
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
                    const response = JSON.parse(Buffer.concat(data).toString('utf-8'))
                    if (hasError) {
                        reject({response, request})
                    } else {
                        resolve(response)
                    }
                })
            })

            request.on('error', (err) => {
                reject(err)
            })
            if (data) {
                request.write(JSON.stringify(data))
            }
            request.end()
        })
    }

    public static async sendRequest<T extends AnyJson>(options: RequestOptions): Promise<T>{
        return await this._instance.sendRequest<T>(options)   
    }
}