import OpenAI from 'openai'
import type { LLMProvider, LLMMessage, LLMCompletionOptions } from './types'
import { PLAN_LIMITS } from '@/lib/config/admin'

export class OpenAIProvider implements LLMProvider {
  name = 'openai'
  model: string
  private client: OpenAI

  constructor(model = 'gpt-4o-mini') {
    this.model = model

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey === 'sk-xxxxx') {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    this.client = new OpenAI({ apiKey })
  }

  async complete(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string> {
    const planLimits = PLAN_LIMITS[options?.plan ?? 'standard']
    const effectiveMaxTokens = Math.min(
      options?.maxTokens ?? planLimits.maxTokensPerRequest,
      planLimits.maxTokensPerRequest
    )

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: effectiveMaxTokens,
    })

    return response.choices[0]?.message?.content || ''
  }

  async *completeStream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): AsyncIterable<string> {
    const planLimits = PLAN_LIMITS[options?.plan ?? 'standard']
    const effectiveMaxTokens = Math.min(
      options?.maxTokens ?? planLimits.maxTokensPerRequest,
      planLimits.maxTokensPerRequest
    )

    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: effectiveMaxTokens,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        yield content
      }
    }
  }
}
