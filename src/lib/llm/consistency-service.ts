'use server'

import { getLLMProvider, isLLMConfigured } from './index'
import type { LLMMessage } from './types'
import { logger } from '@/lib/logger'

export interface ConsistencyIssue {
  type: 'contradiction' | 'inconsistency' | 'missing_detail' | 'exaggeration'
  severity: 'high' | 'medium' | 'low'
  description: string
  suggestion: string
}

export interface ConsistencyCheckResult {
  hasIssues: boolean
  issues: ConsistencyIssue[]
  summary: string
}

interface ExperienceData {
  title: string
  situation?: string | null
  task?: string | null
  action?: string | null
  result?: string | null
  skills?: string[] | null
}

interface ESData {
  question: string
  content: string
}

interface InterviewData {
  turns: {
    interviewerMessage: string | null
    userResponse: string | null
  }[]
}

function buildConsistencyCheckPrompt(
  experiences: ExperienceData[],
  esDocuments: ESData[],
  interviewData?: InterviewData
): LLMMessage[] {
  const experiencesText = experiences
    .map((exp, i) => {
      let text = `【経験${i + 1}】${exp.title}\n`
      if (exp.situation) text += `状況: ${exp.situation}\n`
      if (exp.task) text += `課題: ${exp.task}\n`
      if (exp.action) text += `行動: ${exp.action}\n`
      if (exp.result) text += `結果: ${exp.result}\n`
      if (exp.skills?.length) text += `スキル: ${exp.skills.join(', ')}\n`
      return text
    })
    .join('\n')

  const esText = esDocuments
    .map((es, i) => `【ES${i + 1}】\n設問: ${es.question}\n回答: ${es.content}`)
    .join('\n\n')

  let interviewText = ''
  if (interviewData?.turns.length) {
    interviewText = '\n\n【面接回答】\n' + interviewData.turns
      .filter(t => t.userResponse)
      .map((t, i) => `Q${i + 1}: ${t.interviewerMessage}\nA${i + 1}: ${t.userResponse}`)
      .join('\n\n')
  }

  return [
    {
      role: 'system',
      content: `あなたは就職活動の整合性チェックを行う専門家です。
学生の経験DB、ES、面接回答の間に矛盾や不整合がないかを厳密にチェックします。

以下の観点でチェックしてください：
1. 数字の矛盾（期間、人数、成果の数値など）
2. 時系列の矛盾（開始・終了時期など）
3. 役割の矛盾（リーダー/メンバーなど）
4. 事実の矛盾（同じ経験で異なる内容を述べている）
5. 誇張の可能性（現実的でない成果など）

回答は必ず以下のJSON形式で返してください：
{
  "hasIssues": true/false,
  "issues": [
    {
      "type": "contradiction" | "inconsistency" | "missing_detail" | "exaggeration",
      "severity": "high" | "medium" | "low",
      "description": "問題の説明",
      "suggestion": "改善提案"
    }
  ],
  "summary": "全体の要約（1-2文）"
}

問題がない場合は hasIssues: false で空の issues 配列を返してください。`,
    },
    {
      role: 'user',
      content: `以下の内容について整合性をチェックしてください。

【経験DB】
${experiencesText}

【ES】
${esText}
${interviewText}

上記の内容に矛盾や不整合がないかチェックし、JSON形式で結果を返してください。`,
    },
  ]
}

export async function checkConsistency(
  experiences: ExperienceData[],
  esDocuments: ESData[],
  interviewData?: InterviewData
): Promise<ConsistencyCheckResult> {
  if (!isLLMConfigured()) {
    return {
      hasIssues: false,
      issues: [],
      summary: 'LLMが設定されていないため、整合性チェックをスキップしました。',
    }
  }

  if (experiences.length === 0 && esDocuments.length === 0) {
    return {
      hasIssues: false,
      issues: [],
      summary: 'チェック対象のデータがありません。',
    }
  }

  try {
    const provider = getLLMProvider()
    const messages = buildConsistencyCheckPrompt(experiences, esDocuments, interviewData)
    const response = await provider.complete(messages, {
      temperature: 0.3, // Lower temperature for more consistent analysis
      maxTokens: 1500,
    })

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]) as ConsistencyCheckResult
      return result
    }

    return {
      hasIssues: false,
      issues: [],
      summary: '整合性チェックの結果を解析できませんでした。',
    }
  } catch (error) {
    logger.error('Consistency check failed', error)
    return {
      hasIssues: false,
      issues: [],
      summary: '整合性チェック中にエラーが発生しました。',
    }
  }
}

export async function checkESConsistency(
  experiences: ExperienceData[],
  esContent: string,
  esQuestion: string
): Promise<ConsistencyCheckResult> {
  return checkConsistency(experiences, [{ question: esQuestion, content: esContent }])
}

export async function checkInterviewConsistency(
  experiences: ExperienceData[],
  esDocuments: ESData[],
  turns: { interviewerMessage: string | null; userResponse: string | null }[]
): Promise<ConsistencyCheckResult> {
  return checkConsistency(experiences, esDocuments, { turns })
}
