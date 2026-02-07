export interface LLMMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LLMCompletionOptions {
  temperature?: number
  maxTokens?: number
  stream?: boolean
  plan?: 'free' | 'standard'
}

export interface LLMProvider {
  name: string
  model: string
  complete(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string>
  completeStream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): AsyncIterable<string>
}

export interface ESGenerationInput {
  question: string
  charLimit: number
  experiences: {
    title: string
    situation?: string | null
    task?: string | null
    action?: string | null
    result?: string | null
    skills?: string[] | null
  }[]
  /** ユーザーが追加で含めたい情報・強調したいポイント */
  additionalContext?: string
}

export interface InterviewInput {
  sessionType: 'general' | 'experience' | 'company'
  experience?: {
    title: string
    situation?: string | null
    task?: string | null
    action?: string | null
    result?: string | null
  }
  companyName?: string
  previousTurns?: {
    interviewerMessage: string | null
    userResponse: string | null
  }[]
  userMessage: string
}
