'use server'

import { getLLMProvider, isLLMConfigured } from './index'
import { buildESGenerationPrompt } from './prompts'
import type { ESGenerationInput, LLMMessage } from './types'
import { getOrCreateUser } from '@/lib/actions/user'
import { getEffectivePlan } from '@/lib/config/admin'
import { checkRateLimit, ES_GENERATION_LIMIT, RateLimitError } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

const MAX_RETRIES = 2

/**
 * Clean up LLM output by removing metadata and formatting artifacts
 */
function cleanupESContent(content: string): string {
  let cleaned = content.trim()

  // Remove common metadata patterns at the beginning (be specific to avoid removing valid content)
  const metadataPatterns = [
    /^【調整後[のは]?文[字章]?】[（(][0-9]+文字[)）]?\s*\n?/,  // 【調整後の文章】（383文字）
    /^【?[0-9]+文字[】]?\s*\n/,                                  // 383文字 at start with newline
    /^文字数[：:]\s*[0-9]+\s*\n/,                               // 文字数：383
    /^以下[がは].*?[のな]文章です[。：:]\s*\n/,                  // 以下が調整後の文章です。
    /^調整後[のは].*?[：:]\s*\n/,                                // 調整後の文章：
    /^拡充後[のは].*?[：:]\s*\n/,                                // 拡充後の文章：
  ]

  for (const pattern of metadataPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }

  // Remove metadata at the end
  const endPatterns = [
    /\n[（(][0-9]+文字[)）]\s*$/,                               // (383文字) at end
    /\n【?[0-9]+文字】?\s*$/,                                    // 383文字 at end
  ]

  for (const pattern of endPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }

  return cleaned.trim()
}

export async function generateES(input: ESGenerationInput, plan?: 'free' | 'standard'): Promise<string> {
  // Get user info for rate limiting and plan resolution
  const user = await getOrCreateUser()
  const rateLimitKey = `es-gen:${user.id}`
  const rateLimitResult = checkRateLimit(rateLimitKey, ES_GENERATION_LIMIT)

  if (!rateLimitResult.success) {
    throw new RateLimitError(rateLimitResult.resetInMs)
  }

  if (!isLLMConfigured()) {
    return generateESFallback(input)
  }

  const effectivePlan = plan ?? getEffectivePlan(user.email, user.plan, user.trialEndsAt)

  try {
    const provider = getLLMProvider()
    const charLimit = input.charLimit
    const minChars = Math.floor(charLimit * 0.85)
    const targetChars = Math.floor(charLimit * 0.95)

    let bestContent = ''
    let attempt = 0

    while (attempt < MAX_RETRIES) {
      attempt++

      // Generate or regenerate content
      const messages = buildESGenerationPrompt(input)
      const rawDraft = await provider.complete(messages, {
        temperature: 0.7,
        maxTokens: 2000,
        plan: effectivePlan,
      })

      let content = cleanupESContent(rawDraft)

      logger.info('ES draft generated', {
        attempt,
        draftLength: content.length,
        charLimit,
        minChars,
      })

      // If within acceptable range, use it
      if (content.length >= minChars && content.length <= charLimit && hasProperEnding(content)) {
        return content
      }

      // If too long, trim it carefully
      if (content.length > charLimit) {
        content = await trimToLimit(provider, content, charLimit, targetChars, input.question, effectivePlan)

        if (content.length >= minChars && content.length <= charLimit) {
          return content
        }
      }

      // If too short, try to expand
      if (content.length < minChars) {
        content = await expandToTarget(provider, content, charLimit, targetChars, input.question, effectivePlan)

        if (content.length >= minChars && content.length <= charLimit) {
          return content
        }
      }

      // Track best attempt
      if (content.length > bestContent.length && content.length <= charLimit) {
        bestContent = content
      }

      logger.info('ES attempt not optimal, retrying', {
        attempt,
        contentLength: content.length,
        minChars,
        charLimit,
      })
    }

    // Return best attempt if we have one
    if (bestContent.length > 0) {
      logger.info('ES returning best attempt', {
        bestLength: bestContent.length,
        charLimit,
      })
      return bestContent
    }

    // Fallback
    return generateESFallback(input)
  } catch (error) {
    if (error instanceof RateLimitError) {
      throw error
    }
    logger.error('LLM ES generation failed', error)
    return generateESFallback(input)
  }
}

/**
 * Expand content to reach target length
 */
async function expandToTarget(
  provider: ReturnType<typeof getLLMProvider>,
  content: string,
  charLimit: number,
  targetChars: number,
  question: string,
  plan: 'free' | 'standard' = 'free'
): Promise<string> {
  const messages: LLMMessage[] = [
    {
      role: 'system',
      content: `あなたはES添削の専門家です。
短いESを、内容を深掘りして適切な長さに拡充します。
出力はES本文のみ。メタ情報（文字数など）は絶対に含めないでください。`,
    },
    {
      role: 'user',
      content: `以下のESを${targetChars}文字程度に拡充してください。

【設問】${question}

【現在のES】（${content.length}文字 → ${targetChars}文字に拡充）
${content}

【拡充のポイント】
- 「なぜその活動を始めたのか」の原体験・動機を詳しく
- 「なぜその方法を選んだのか」の思考プロセスを追加
- 具体的なエピソードや数字を補足
- 学びと今後への活かし方を充実させる

※ES本文のみを出力。「拡充後」「○○文字」などは書かない。`,
    },
  ]

  const rawExpanded = await provider.complete(messages, {
    temperature: 0.5,
    maxTokens: charLimit + 200,
    plan,
  })

  const expanded = cleanupESContent(rawExpanded)

  logger.info('ES expansion result', {
    originalLength: content.length,
    expandedLength: expanded.length,
    targetChars,
  })

  // Only use if actually longer and not over limit
  if (expanded.length > content.length && expanded.length <= charLimit) {
    return expanded
  }

  // If over limit, trim it
  if (expanded.length > charLimit) {
    return trimToLimit(provider, expanded, charLimit, targetChars, question, plan)
  }

  return content
}

/**
 * Trim content to fit within limit while maintaining quality
 */
async function trimToLimit(
  provider: ReturnType<typeof getLLMProvider>,
  content: string,
  charLimit: number,
  targetChars: number,
  question: string,
  plan: 'free' | 'standard' = 'free'
): Promise<string> {
  const messages: LLMMessage[] = [
    {
      role: 'system',
      content: `あなたはES添削の専門家です。
長すぎるESを、重要な要素を残しながら指定文字数に収めます。
出力はES本文のみ。メタ情報（文字数など）は絶対に含めないでください。`,
    },
    {
      role: 'user',
      content: `以下のESを${targetChars}文字程度に調整してください。

【設問】${question}

【現在のES】（${content.length}文字 → ${targetChars}文字に調整）
${content}

【調整時の優先順位】
1. 結論と学びは必ず残す
2. 具体的な数字・成果は残す
3. 冗長な表現を簡潔に
4. 重複する説明を削除

※ES本文のみを出力。「調整後」「○○文字」などは書かない。
※${charLimit}文字を超えないこと。`,
    },
  ]

  const rawResult = await provider.complete(messages, {
    temperature: 0.3,
    maxTokens: charLimit,
    plan,
  })

  const result = cleanupESContent(rawResult)

  logger.info('ES trim result', {
    originalLength: content.length,
    trimmedLength: result.length,
    targetChars,
    charLimit,
  })

  // Verify result is within limit
  if (result.length <= charLimit && hasProperEnding(result)) {
    return result
  }

  // Force truncate if still over
  if (result.length > charLimit) {
    return forceTruncateWithEnding(result, charLimit)
  }

  return result
}

/**
 * Check if content has proper ending
 */
function hasProperEnding(content: string): boolean {
  const trimmed = content.trim()
  return trimmed.endsWith('。') || trimmed.endsWith('！') || trimmed.endsWith('？')
}

/**
 * Force truncate and add generic ending
 */
function forceTruncateWithEnding(content: string, charLimit: number): string {
  const ending = 'この経験を今後に活かします。'
  const availableSpace = charLimit - ending.length - 1

  const truncated = content.slice(0, availableSpace)
  const lastPeriod = truncated.lastIndexOf('。')

  if (lastPeriod > availableSpace * 0.7) {
    return content.slice(0, lastPeriod + 1) + ending
  }

  return truncated + '。' + ending
}

function generateESFallback(input: ESGenerationInput): string {
  const mainExp = input.experiences[0]
  if (!mainExp) {
    return ''
  }

  const charLimit = input.charLimit
  let content = ''

  const intro = `私が学生時代に最も力を入れたことは${mainExp.title}です。`
  const conclusion = 'この経験を今後に活かしていきます。'

  content = intro + '\n\n'

  const remainingBudget = charLimit - intro.length - conclusion.length - 10

  if (mainExp.situation && content.length + mainExp.situation.length < remainingBudget * 0.3) {
    content += mainExp.situation + '\n\n'
  }

  if (mainExp.action && content.length + mainExp.action.length < remainingBudget * 0.7) {
    content += mainExp.action + '\n\n'
  }

  if (mainExp.result && content.length + mainExp.result.length < remainingBudget) {
    content += mainExp.result + '\n\n'
  }

  content += conclusion

  if (content.length > charLimit) {
    content = content.slice(0, charLimit - conclusion.length - 5) + '。\n\n' + conclusion
  }

  return content
}
