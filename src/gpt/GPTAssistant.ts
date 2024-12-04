import https from 'node:https'
import GPTRun, { GPTRunType } from './GPTRun.js'
import GPTClient from './GPTClient.js'
import GPTThread, { GPTThreadId } from './GPTThread.js'

type GPTMessageType = {
    id: string,
    object: string,
    created_at: number,
    thread_id: string,
    role: "assistant" | "user",
    content: [
    ],
    assistant_id: string,
    run_id: string,
    attachments: [],
    metadata: {}
}

export type GPTAssistantId = `asst_${string}`

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
    private id: GPTAssistantId = 'asst_iFrsDw6waBvgHKfACGagvD9K'
    private _thread: string

    constructor( key: string ) {
        this._key = key
        GPTClient.key = key
    }

    public async translate(threadId: GPTThreadId, content: string): Promise<TranslateResponse | never> {
        try {
            const thread = new GPTThread(threadId)
            const run = await new GPTRun(this.id, threadId, content).waitForCompletion()
            
            const messages = await thread.listMessages({ run_id: run.id})
            if (messages.data.length === 0)
                throw new Error(`GPT Assistant: no messages in Run with id ${run.id}`)
            const message = messages.data[0]
            if (message.content.length != 1) {
                if (message.content.length === 0) {
                    throw new Error(`GPT Assistant: Empty content in response message with id ${message.id}`)
                } else {
                    for ( const ent of message.content ) {
                        console.error('Recieved content', ent)
                        throw new Error(`GPT Assistant: to many content items in message with id ${message.id}`)
                    }
                }
            }
            const text = message.content[0].text?.value
            if (text === undefined) {
                throw new Error('Text is empty')

            }
            return JSON.parse(text!) as TranslateResponse
        } catch (error) {
            console.error(error)
            throw error
        }
    }

}