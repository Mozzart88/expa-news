import { GPTRunId } from "./GPTRun.js"
import { GPTThreadId } from "./GPTThread.js"
import { GPTAssistantId } from "./GPTAssistant.js"

export type GPTMessageId = `msg_${string}`

const Roles = [ 'user', 'assistant'] as const
export type GPTRole = typeof Roles[number]


export type GPTMessage = {
    id: GPTMessageId,
    object: "thread.message",
    created_at: number,
    thread_id: GPTThreadId,
    role: GPTRole,
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
    assistant_id: GPTAssistantId,
    run_id: GPTRunId,
    attachments: [any],
    metadata: { [key: string | symbol]: any}
  }
  