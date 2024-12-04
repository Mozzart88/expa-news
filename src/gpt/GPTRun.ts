import { GPTAssistantId } from "./GPTAssistant.js"
import GPTClient, { AnyJson } from "./GPTClient.js"
import { GPTRole } from "./GPTMessage.js"
import { GPTThreadId } from "./GPTThread.js"

const RunStates = [
    'queued',
    'in_progress',
    'requires_action',
    'cancelling',
    'cancelled',
    'failed',
    'completed',
    'incomplete',
    'expired'    
] as const
export type GPTRunStatus = typeof RunStates[number]

const RunErrors = [
    'server_error',
    'rate_limit_exceeded',
    'invalid_prompt'
] as const
export type GPTRunError = (typeof RunErrors)[keyof typeof RunErrors]

export type GPTRunId = `run_${string}`

export type GPTRunType = {
    id: GPTRunId,
    object: "thread.run",
    created_at?: number,
    assistant_id: GPTAssistantId,
    thread_id: GPTThreadId,
    status: GPTRunStatus,
    started_at?: number,
    expires_at?: number,
    cancelled_at?: number,
    failed_at?: number,
    completed_at?: number,
    last_error?: GPTRunError,
    model: string,
    instructions?: string,
    tools: {[key: string | symbol]: string}[],
    metadata: {},
    incomplete_details?: {},
    usage: {},
    temperature: number,
    top_p: number,
    max_prompt_tokens: number,
    max_completion_tokens: number,
    truncation_strategy: {},
    response_format: string | {},
    tool_choice: string | {},
    parallel_tool_calls: boolean
}

export type GPTRunOptions = {
    threadId: GPTThreadId
    data: {
        assistant_id: GPTAssistantId
        additional_messages: [
            {
                role: GPTRole
                content: string
            }
        ]
    }
}

export default class GPTRun {
    private readonly createOptions: GPTRunOptions
    private data: GPTRunType
    private updateInterval: number = 1000

    public get id(): GPTRunId {
        return this.data.id
    }

    constructor (assistant: GPTAssistantId, thread: GPTThreadId, content: string) {
        this.createOptions = {
            threadId: thread,
            data: {
                assistant_id: assistant,
                additional_messages: [
                    {
                        role: 'user',
                        content
                    }
                ]
            }
        }
    }

    public async waitForCompletion(): Promise<GPTRun> {
        this.data = await this.create()
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                this.data = await this.getRemoteState()
                const status = this.data.status
                switch (status) {
                    case 'cancelled':
                    case 'cancelling':
                    case 'expired':
                    case 'requires_action':
                    case 'failed':
                    case 'incomplete':
                        clearInterval(interval)
                        console.error(status, this)
                        reject(new Error(`GPT Run fails with status: ${status} => ${this}`))
                    case 'completed':
                        clearInterval(interval)
                        resolve(this)
                }
            }, this.updateInterval)

        })
    }

    
    public toString(): string {
        return JSON.stringify(this.data)
    }
    
    public toJSON(): GPTRunType | never {
        if (this.data) 
            return this.data
        throw new Error(`GPT Run: no data yet`)
    }
    
    private async getRemoteState(): Promise<GPTRunType> {
        return await this.sendRequest('get', undefined, [this.data!.id])
    }

    private async create(): Promise<GPTRunType> {
        return await this.sendRequest('post', this.createOptions.data)
    }    

    private async sendRequest(
        method: 'get' | 'post',
        data?: AnyJson,
        pathParams?: string[]
    ): Promise<GPTRunType> {
        const rootPath = `threads/${this.createOptions.threadId}/runs`.split('/')
        const path = rootPath.concat(pathParams ?? [])
        return await GPTClient.sendRequest({
            path,
            method,
            data
        })
    }
}
