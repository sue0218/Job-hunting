import type { LLMProvider, LLMMessage, LLMCompletionOptions } from './types'
import { logger } from '@/lib/logger'

export * from './types'

/**
 * Wrapper provider that falls back to secondary provider on quota errors
 */
class FallbackLLMProvider implements LLMProvider {
  name = 'fallback'
  model: string
  private primaryProvider: LLMProvider | null = null
  private fallbackProvider: LLMProvider | null = null

  constructor() {
    const openaiKey = process.env.OPENAI_API_KEY
    const anthropicKey = process.env.ANTHROPIC_API_KEY

    // Initialize primary provider (OpenAI)
    if (openaiKey && openaiKey !== 'sk-xxxxx') {
      try {
        const { OpenAIProvider } = require('./openai-provider')
        this.primaryProvider = new OpenAIProvider() as LLMProvider
      } catch {
        logger.warn('Failed to initialize OpenAI provider')
      }
    }

    // Initialize fallback provider (Anthropic)
    if (anthropicKey && anthropicKey !== 'sk-ant-xxxxx') {
      try {
        const { AnthropicProvider } = require('./anthropic-provider')
        this.fallbackProvider = new AnthropicProvider() as LLMProvider
      } catch {
        logger.warn('Failed to initialize Anthropic provider')
      }
    }

    this.model = this.primaryProvider?.model || this.fallbackProvider?.model || 'unknown'
  }

  private isQuotaError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      return (
        message.includes('429') ||
        message.includes('quota') ||
        message.includes('rate limit') ||
        message.includes('exceeded')
      )
    }
    return false
  }

  async complete(messages: LLMMessage[], options?: LLMCompletionOptions): Promise<string> {
    // Try primary provider first
    if (this.primaryProvider) {
      try {
        return await this.primaryProvider.complete(messages, options)
      } catch (error) {
        if (this.isQuotaError(error) && this.fallbackProvider) {
          logger.warn('Primary provider quota exceeded, falling back to secondary', {
            primary: this.primaryProvider.name,
            fallback: this.fallbackProvider.name,
          })
        } else {
          throw error
        }
      }
    }

    // Try fallback provider
    if (this.fallbackProvider) {
      return await this.fallbackProvider.complete(messages, options)
    }

    throw new Error('No LLM provider available')
  }

  async *completeStream(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): AsyncIterable<string> {
    // Try primary provider first
    if (this.primaryProvider) {
      try {
        yield* this.primaryProvider.completeStream(messages, options)
        return
      } catch (error) {
        if (this.isQuotaError(error) && this.fallbackProvider) {
          logger.warn('Primary provider quota exceeded, falling back to secondary (stream)', {
            primary: this.primaryProvider.name,
            fallback: this.fallbackProvider.name,
          })
        } else {
          throw error
        }
      }
    }

    // Try fallback provider
    if (this.fallbackProvider) {
      yield* this.fallbackProvider.completeStream(messages, options)
      return
    }

    throw new Error('No LLM provider available')
  }

  hasProvider(): boolean {
    return this.primaryProvider !== null || this.fallbackProvider !== null
  }
}

let cachedProvider: FallbackLLMProvider | null = null

export function getLLMProvider(): LLMProvider {
  if (cachedProvider) {
    return cachedProvider
  }

  cachedProvider = new FallbackLLMProvider()

  if (!cachedProvider.hasProvider()) {
    throw new Error('No LLM provider configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY')
  }

  return cachedProvider
}

export function isLLMConfigured(): boolean {
  const openaiKey = process.env.OPENAI_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  return (
    (openaiKey !== undefined && openaiKey !== 'sk-xxxxx') ||
    (anthropicKey !== undefined && anthropicKey !== 'sk-ant-xxxxx')
  )
}

/**
 * Clear the cached provider (useful for testing or config changes)
 */
export function clearLLMProviderCache(): void {
  cachedProvider = null
}
