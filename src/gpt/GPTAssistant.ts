import https from 'node:https'
import { GPTRunType } from './GPTRun.js'

type GPTMessageType = {
    id: string,
    object: string,
    created_at: number,
    thread_id: string,
    role: "assistant" | "user",
    content: [
        {
            type: string,
            text?: {
                value: string,
                annotations: []
            },
            image_file?: {
                file_id: string,
                detail: string
            },
            image_url?: {
                type: string,
                image_url: {}
            },
            refusal?: {
                type: string,
                refusal: string
            }
        }
    ],
    assistant_id: string,
    run_id: string,
    attachments: [],
    metadata: {}
}
  
export type TranslateResponse = {
    title: string,
    content: string,
    categories: string[]
}


/**
 * @todo: Create Thread and Run
 * @todo: Delete Thread
 */

export default class GPTAssistatn {
    private _key: string
    private _thread: string
    private _assistant: string = 'asst_iFrsDw6waBvgHKfACGagvD9K'

    constructor(
        key: string,
        thred: string
    ) {
        this._key = key
        this._thread = thred
    }

    public async translate(content: string): Promise<TranslateResponse | never> {
        return new Promise( async (resolve, reject) => {
            const run = await this.createRun(content)
            const interval = setInterval(async () => {
               const update = await this.getRun(run.id)
                switch (update.status) {
                    case 'completed':
                        clearInterval(interval)
                        const messages = await this.getMessages(run.id)
                        if (messages.length === 0)
                            reject(new Error('Invalid messages set'))
                        const message = messages[0]
                        if (message.content.length != 1) {
                            if (message.content.length === 0) {
                                reject(new Error('Empty content'))
                            } else {
                                for ( const ent of message.content ) {
                                    console.error('Recieved content', ent)
                                }
                           }
                        }
                        const text = message.content[0].text?.value
                        if (text === undefined) {
                            reject(new Error('Text is empty'))

                        }
                        resolve(JSON.parse(text!) as TranslateResponse)
                        break
                    case 'incomplete':
                        clearInterval(interval)
                        reject(`GPTRun: ${update.status} - ${update.incomplete_details}`)
                        break
                    case 'cancelled':
                    case 'cancelling':
                    case 'expired':
                    case 'requires_action':
                        clearInterval(interval)
                        reject(`GPTRun: Ivalid state - ${update.status}`)
                        break
                    case 'failed':
                        console.error(update.status, update.last_error)
                        clearInterval(interval)
                        reject(`GPTRun: ${update.status} - ${update.last_error}`)
                }
             }, 1000)

        })
    }

    public async getMessages(runId: string): Promise<GPTMessageType[]> {
        const res = await this.sendRequest('messages', 'get', null, {'run_id': runId})
        const obj = JSON.parse(res) as {object: string, data: GPTMessageType[]}
        return obj.data
    }

    private async getRun(id: string): Promise<GPTRunType | never> {
        const res = await this.sendRequest(`runs/${id}`, 'get')
        return JSON.parse(res) as GPTRunType
    }

    private async createRun(content: string): Promise<GPTRunType | never> {
        const data = {
            assistant_id: this._assistant,
            max_completion_tokens: 1000,
            additional_messages: [
                {
                    role: 'user',
                    content
                }
            ]
        }
        const res = await this.sendRequest('runs', 'post', data)
        return JSON.parse(res) as GPTRunType
    }

    private async sendMessage(content: string): Promise<GPTMessageType | never> {
        const data = {
            role: 'user',
            content: content
        }
        const res = await this.sendRequest('messages', 'post', data)
        return JSON.parse(res) as GPTMessageType
    }

    private async sendRequest(method: string, httpMethod: string, postData?: any, params?: {[key: string]: string}): Promise<string> {
        return new Promise((resolve, reject) => {
            const url = new URL(`https://api.openai.com/v1/threads/${this._thread}/${method}`)
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
                method: httpMethod
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
                        resolve(run)
                    }
               })
            })

            request.on('error', (err) => {
                reject(err)
            })
            if (httpMethod != 'get') {
                request.write(JSON.stringify(postData))
            }
            request.end()
        })
    }
}