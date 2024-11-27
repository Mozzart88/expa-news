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
export type RunStatus = typeof RunStates[number]

const RunErrors = [
    'server_error',
    'rate_limit_exceeded',
    'invalid_prompt'
] as const
export type RunError = (typeof RunErrors)[keyof typeof RunErrors]

export type GPTRunType = {
    id: string,
    object: string,
    created_at?: number,
    assistant_id: string,
    thread_id: string,
    status: RunStatus,
    started_at?: number,
    expires_at?: number,
    cancelled_at?: number,
    failed_at?: number,
    completed_at?: number,
    last_error?: RunError,
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

type CreateOptions = {
    threadId: string,
    data: {
        additional_messages: [
            {
                role: 'user' | 'assistant',
                content: string
            }
        ]
    }
}

class GPTRun {
    private data: GPTRunType
    private updateInterval: number
    private handlers: {[key in  RunStatus]: Array<() => void>}

    public static async create(opts?: CreateOptions): Promise<GPTRun> {
        const data = await GPTRun.createRun(opts)
        return new GPTRun(data)
    }

    private static async createRun(opts?: CreateOptions): Promise<GPTRunType> {
        const data =  await GPTRun.sendRequest()       
        return new Promise((resolve, reject) => {

        })
    }

    private static async sendRequest(): Promise<string> {
        return new Promise((resolve, reject) => {

        })
    }
    
    private constructor(data: GPTRunType) {
        this.data = data
    }

    private async run() {

    }

    public async on(event: RunStatus, handler: Function): Promise<any> {
        
    }

}
