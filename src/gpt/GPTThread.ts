import GPTClient, { AnyJson, RequestOptions } from './GPTClient.js'
import { type GPTRunId } from './GPTRun.js'
import {
    type GPTMessage,
    type GPTMessageId,
    type GPTRole
} from './GPTMessage.js'


type Thread = {
    id: GPTThreadId
    object: "thread"
    created_at: number
    metadata: { [key: string | symbol ]: any }
    tool_resources?: {
        code_iterpreter?: [any]
        file_search?: [any]
    }
}

type ThreadDelete = {
    id: GPTThreadId
    object: 'thread.deleted'
    deleted: boolean
}

type ListMessagesOptions = {
    limit?: number
    order?: GPTRole
    after?: GPTMessageId
    before?: GPTMessageId
    run_id?: GPTRunId
}

type ListMessagesResult = {
    object: "list"
    data: GPTMessage[]
    first_id?: GPTMessageId
    last_id?: GPTMessageId
    has_more: boolean
}

export type GPTThreadId = `thread_${string}`

export default class GPTThread {
    private static readonly rootPath: string = 'threads'
    private _id: GPTThreadId

    constructor(id: GPTThreadId) {
        this._id = id
    }

    public static async create(): Promise<GPTThread> {
        const response = await GPTThread.sendRequest<Thread>({
            path: [GPTThread.rootPath],
            method: 'post'
        })
        return new GPTThread(response.id)
    }

    public static async delete(id: GPTThreadId): Promise<boolean> {
        const response = await GPTThread.sendRequest<ThreadDelete>({
            path: [GPTThread.rootPath],
            method: 'delete'
        })
        return response.deleted
    }

    public async listMessages(options: ListMessagesOptions): Promise<ListMessagesResult> {
        return await this.sendRequest<ListMessagesResult>('messages', 'get', undefined, options)
    }

    private static async sendRequest<T extends AnyJson>(options: RequestOptions): Promise<T> {
        return await GPTClient.sendRequest<T>(options)
    }

    private async sendRequest<T extends AnyJson>(
        method: string,
        httpMethod: string,
        data?: any,
        params?: {[key: string]: string | number}
    ): Promise<T> {
        const path = [GPTThread.rootPath, this._id, method]
        return await GPTClient.sendRequest<T>({
            path,
            method: httpMethod,
            data,
            params
        })
    }
}