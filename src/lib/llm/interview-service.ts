'use server'

import { getLLMProvider, isLLMConfigured } from './index'
import type { LLMMessage } from './types'
import type { Experience, InterviewTurn } from '@/lib/db/schema'
import { logger } from '@/lib/logger'
import { getOrCreateUser } from '@/lib/actions/user'
import { getEffectivePlan } from '@/lib/config/admin'

export type InterviewerType = 'standard' | 'friendly' | 'strict' | 'logical'

export interface GenerateFollowUpInput {
  sessionType: 'general' | 'experience' | 'company'
  interviewerType?: InterviewerType | null
  experience?: Experience | null
  companyName?: string | null
  previousTurns: Pick<InterviewTurn, 'interviewerMessage' | 'userResponse'>[]
  userResponse: string
}

export interface GenerateFeedbackInput {
  sessionType: 'general' | 'experience' | 'company'
  interviewerType?: InterviewerType | null
  experience?: Experience | null
  companyName?: string | null
  turns: Pick<InterviewTurn, 'interviewerMessage' | 'userResponse'>[]
}

// 面接官タイプ別のペルソナ定義
const INTERVIEWER_PERSONAS: Record<InterviewerType, {
  name: string
  personality: string
  questionStyle: string
  feedbackStyle: string
}> = {
  standard: {
    name: '標準面接官',
    personality: 'バランスの取れた、プロフェッショナルな面接官です。',
    questionStyle: `【質問スタイル】
- 基本的な深掘り質問を行う
- 回答の曖昧な部分を確認する
- STAR形式での回答を促す`,
    feedbackStyle: '客観的でバランスの取れたフィードバックを提供してください。',
  },
  friendly: {
    name: '優しい面接官',
    personality: '温かく、学生の緊張をほぐしながら話を聞く面接官です。笑顔で頷きながら、学生の良いところを引き出します。',
    questionStyle: `【質問スタイル】
- 「素晴らしいですね」「なるほど」など共感を示しながら質問
- 学生が話しやすい雰囲気を作る
- 良い点を褒めてから深掘りする
- プレッシャーをかけず、自然に詳細を引き出す
- 「もう少し詳しく教えていただけますか？」のような柔らかい言い方`,
    feedbackStyle: '励ましを中心に、改善点も前向きな言い方で伝えてください。「〜すると、さらに良くなりますね」のような表現を使ってください。',
  },
  strict: {
    name: '厳しい面接官',
    personality: '圧迫面接気味の厳しい面接官です。学生の本質を見抜くため、鋭い質問を投げかけます。曖昧な回答は許しません。',
    questionStyle: `【質問スタイル】
- 回答の矛盾点や弱点を突く
- 「本当にそうですか？」「それで十分だと思いますか？」など厳しい切り返し
- 曖昧な回答には「具体的に」「数字で」と詰める
- 想定外の質問で臨機応変さを試す
- 沈黙を恐れず、学生に考えさせる
- ただし、人格否定はしない（質問の厳しさであって、態度は冷静）`,
    feedbackStyle: '厳しめですが的確なフィードバックを提供してください。改善点を明確に指摘し、「このままでは通用しない」という危機感を持たせつつ、具体的な改善方法を示してください。',
  },
  logical: {
    name: '論理的面接官',
    personality: '論理的一貫性を重視する面接官です。話の筋道、因果関係、数字の整合性を厳密にチェックします。',
    questionStyle: `【質問スタイル】
- 「なぜ？」を繰り返して思考の深さを確認
- 「AとBの関係は？」「その数字の根拠は？」など論理的整合性を問う
- 話の矛盾を指摘する
- 「他の選択肢は考えなかったのですか？」など意思決定プロセスを深掘り
- 結論と根拠の対応関係を確認
- 「つまり〜ということですか？」と要約して確認`,
    feedbackStyle: '論理的な構成、因果関係の明確さ、数字の具体性について重点的にフィードバックしてください。「論理の飛躍」「根拠不足」などを指摘してください。',
  },
}

/**
 * LLMを使って面接官の深掘り質問を生成
 */
export async function generateFollowUpQuestion(input: GenerateFollowUpInput, plan?: 'free' | 'standard'): Promise<string> {
  if (!isLLMConfigured()) {
    return getFallbackQuestion(input.sessionType)
  }

  try {
    let effectivePlan = plan
    if (!effectivePlan) {
      const user = await getOrCreateUser()
      effectivePlan = getEffectivePlan(user.email, user.plan, user.trialEndsAt)
    }

    const provider = getLLMProvider()
    const messages = buildFollowUpPrompt(input)

    const response = await provider.complete(messages, {
      temperature: 0.7,
      maxTokens: 300,
      plan: effectivePlan,
    })

    logger.info('Interview follow-up generated', {
      sessionType: input.sessionType,
      interviewerType: input.interviewerType,
      turnCount: input.previousTurns.length,
    })

    return response.trim()
  } catch (error) {
    logger.error('Failed to generate follow-up question', error)
    return getFallbackQuestion(input.sessionType)
  }
}

/**
 * LLMを使ってセッション終了時のフィードバックを生成
 */
export async function generateInterviewFeedback(input: GenerateFeedbackInput, plan?: 'free' | 'standard'): Promise<{
  feedback: string
  rating: number
}> {
  if (!isLLMConfigured()) {
    return getFallbackFeedback(input.turns.length)
  }

  try {
    let effectivePlan = plan
    if (!effectivePlan) {
      const user = await getOrCreateUser()
      effectivePlan = getEffectivePlan(user.email, user.plan, user.trialEndsAt)
    }

    const provider = getLLMProvider()
    const messages = buildFeedbackPrompt(input)

    const response = await provider.complete(messages, {
      temperature: 0.5,
      maxTokens: 1500,
      plan: effectivePlan,
    })

    logger.info('Interview feedback generated', {
      sessionType: input.sessionType,
      interviewerType: input.interviewerType,
      turnCount: input.turns.length,
    })

    // Extract rating from response
    const ratingMatch = response.match(/総合評価[：:]\s*(\d)点?/i) ||
                        response.match(/(\d)[点\/]/)
    const rating = ratingMatch ? Math.min(5, Math.max(1, parseInt(ratingMatch[1]))) : 3

    return {
      feedback: response.trim(),
      rating,
    }
  } catch (error) {
    logger.error('Failed to generate interview feedback', error)
    return getFallbackFeedback(input.turns.length)
  }
}

function buildFollowUpPrompt(input: GenerateFollowUpInput): LLMMessage[] {
  const interviewerType = input.interviewerType || 'standard'
  const persona = INTERVIEWER_PERSONAS[interviewerType]

  let systemContent = `あなたは日本企業の採用面接官です。学生の面接練習を手伝っています。

【あなたのキャラクター】${persona.name}
${persona.personality}

${persona.questionStyle}

【深掘りの観点】
- 「なぜそうしたのか」（動機・思考プロセス）
- 「具体的にどのように」（行動の詳細）
- 「その結果どうなったか」（成果・数字）
- 「そこから何を学んだか」（成長・気づき）
- 「チームでの役割は」（協調性・リーダーシップ）

【重要】
- 回答の曖昧な部分、具体性が足りない部分を掘り下げる
- 質問は1つだけ（複数の質問をしない）
- キャラクターに合った口調で
- 質問文のみを出力（説明やメタ情報は不要）`

  if (input.sessionType === 'company' && input.companyName) {
    systemContent += `

【想定企業】${input.companyName}
この企業の面接官として質問してください。`
  }

  if (input.sessionType === 'experience' && input.experience) {
    systemContent += `

【深掘り対象の経験】
タイトル: ${input.experience.title}
${input.experience.situation ? `状況: ${input.experience.situation}` : ''}
${input.experience.task ? `課題: ${input.experience.task}` : ''}
${input.experience.action ? `行動: ${input.experience.action}` : ''}
${input.experience.result ? `結果: ${input.experience.result}` : ''}

学生が登録したこの経験について深掘りしてください。`
  }

  const messages: LLMMessage[] = [
    { role: 'system', content: systemContent },
  ]

  // 過去の会話履歴を追加
  for (const turn of input.previousTurns) {
    if (turn.interviewerMessage) {
      messages.push({ role: 'assistant', content: turn.interviewerMessage })
    }
    if (turn.userResponse) {
      messages.push({ role: 'user', content: turn.userResponse })
    }
  }

  // 最新のユーザー回答
  messages.push({ role: 'user', content: input.userResponse })

  return messages
}

function buildFeedbackPrompt(input: GenerateFeedbackInput): LLMMessage[] {
  const interviewerType = input.interviewerType || 'standard'
  const persona = INTERVIEWER_PERSONAS[interviewerType]

  const conversationText = input.turns
    .map((turn, i) => {
      let text = `【ターン${i + 1}】\n`
      if (turn.interviewerMessage) text += `面接官: ${turn.interviewerMessage}\n`
      if (turn.userResponse) text += `学生: ${turn.userResponse}\n`
      return text
    })
    .join('\n')

  let contextInfo = ''
  if (input.sessionType === 'company' && input.companyName) {
    contextInfo = `\n【想定企業】${input.companyName}`
  }
  if (input.sessionType === 'experience' && input.experience) {
    contextInfo = `\n【深掘り対象】${input.experience.title}`
  }

  return [
    {
      role: 'system',
      content: `あなたはキャリアアドバイザーです。面接練習のフィードバックを提供します。

【フィードバックのスタイル】
${persona.feedbackStyle}

【評価の観点】
1. 結論ファースト: 結論から話せているか
2. 具体性: 数字や固有名詞を使えているか
3. 論理性: STAR形式（状況→課題→行動→結果）で整理されているか
4. 深掘り対応: 「なぜ」「どのように」に答えられているか
5. 熱意・人柄: 誠実さ、意欲が伝わるか

【出力形式】必ず以下の形式で出力してください：

総合評価: ○点/5点

【良かった点】
- （具体的な発言を引用して）
-

【改善点】
- （具体的な発言を引用して）
-

【次回への具体的アドバイス】
1.
2.
3.

【模範回答例】
（最も改善が必要な質問に対して）
質問「...」への模範回答:
「...」`,
    },
    {
      role: 'user',
      content: `以下の面接練習について、フィードバックをお願いします。${contextInfo}

${conversationText}`,
    },
  ]
}

function getFallbackQuestion(sessionType: string): string {
  const fallbackQuestions: Record<string, string[]> = {
    general: [
      'その経験で最も困難だったことは何ですか？',
      '具体的にどのような行動を取りましたか？',
      'その結果、どのような成果が得られましたか？',
      'その経験から学んだことを教えてください。',
      'もう一度同じ状況になったら、どうしますか？',
    ],
    experience: [
      'なぜその取り組みを始めようと思ったのですか？',
      'チームでの役割は何でしたか？',
      '周囲とどのように協力しましたか？',
      '数字で表せる成果はありますか？',
      'その経験を仕事にどう活かせますか？',
    ],
    company: [
      '当社のどのような点に魅力を感じていますか？',
      '入社後、具体的にどのような仕事をしたいですか？',
      '5年後、当社でどのようなキャリアを築きたいですか？',
      '他社ではなく当社を選ぶ理由は何ですか？',
    ],
  }

  const questions = fallbackQuestions[sessionType] || fallbackQuestions.general
  return questions[Math.floor(Math.random() * questions.length)]
}

function getFallbackFeedback(turnCount: number): { feedback: string; rating: number } {
  return {
    feedback: `総合評価: 3点/5点

【良かった点】
- 質問に対して回答しようとする姿勢が見られました
- 経験を踏まえた回答ができていました

【改善点】
- より具体的な数字やエピソードを入れるとよいでしょう
- 結論から先に話すことを意識してみてください
- 「なぜそうしたのか」という動機をもっと詳しく説明できるとよいです

【次回への具体的アドバイス】
1. STAR形式（状況→課題→行動→結果）を意識して話す
2. 数字を入れて具体性を出す（例：○人中○位、○%向上）
3. 「私は〜と考えたので、〜しました」と思考プロセスを説明する

【模範回答例】
どの質問に対しても、「結論→理由→具体例→学び」の順で答えることを心がけましょう。`,
    rating: 3,
  }
}
