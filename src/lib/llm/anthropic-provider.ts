import Anthropic from '@anthropic-ai/sdk'
import type { LLMProvider, LLMMessage, LLMCompletionOptions } from './types'
import { PLAN_LIMITS } from '@/lib/config/admin'

export class AnthropicProvider implements LLMProvider {
  name = 'anthropic'
  model: string
  private client: Anthropic

  constructor(model = 'claude-3-5-haiku-latest') {
    this.model = model

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'sk-ant-xxxxx') {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }

    this.client = new Anthropic({ apiKey })
  }

  async complete(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string> {
    const planLimits = PLAN_LIMITS[options?.plan ?? 'standard']
    const effectiveMaxTokens = Math.min(
      options?.maxTokens ?? planLimits.maxTokensPerRequest,
      planLimits.maxTokensPerRequest
    )

    // Extract system message
    const systemMessage = messages.find(m => m.role === 'system')?.content
    const chatMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: effectiveMaxTokens,
      system: systemMessage,
      messages: chatMessages,
    })

    const content = response.content[0]
    return content.type === 'text' ? content.text : ''
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

    // Extract system message
    const systemMessage = messages.find(m => m.role === 'system')?.content
    const chatMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    const stream = this.client.messages.stream({
      model: this.model,
      max_tokens: effectiveMaxTokens,
      system: systemMessage,
      messages: chatMessages,
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        const delta = event.delta
        if ('text' in delta) {
          yield delta.text
        }
      }
    }
  }
}
