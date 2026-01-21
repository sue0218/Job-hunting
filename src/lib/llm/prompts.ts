import type { ESGenerationInput, InterviewInput, LLMMessage } from './types'

/**
 * ES設問タイプを判定
 */
function detectQuestionType(question: string): 'gakuchika' | 'self_pr' | 'motivation' | 'setback' | 'strength_weakness' | 'other' {
  const q = question.toLowerCase()

  // ガクチカ
  if (q.includes('力を入れた') || q.includes('ガクチカ') || q.includes('学生時代') ||
      q.includes('頑張った') || q.includes('打ち込んだ') || q.includes('取り組んだ')) {
    return 'gakuchika'
  }

  // 自己PR
  if (q.includes('自己pr') || q.includes('自己ｐｒ') || q.includes('強み') ||
      q.includes('アピール') || q.includes('セールスポイント')) {
    return 'self_pr'
  }

  // 志望動機
  if (q.includes('志望動機') || q.includes('志望理由') || q.includes('なぜ当社') ||
      q.includes('入社したい') || q.includes('志望した')) {
    return 'motivation'
  }

  // 挫折経験
  if (q.includes('挫折') || q.includes('困難') || q.includes('失敗') ||
      q.includes('乗り越え') || q.includes('苦労') || q.includes('壁にぶつかった')) {
    return 'setback'
  }

  // 長所・短所
  if (q.includes('長所') || q.includes('短所') || q.includes('弱み')) {
    return 'strength_weakness'
  }

  return 'other'
}

/**
 * 設問タイプ別のプロンプト要件
 */
const QUESTION_TYPE_PROMPTS = {
  gakuchika: {
    name: 'ガクチカ（学生時代に力を入れたこと）',
    structure: `【必須構成】
1. 結論：何に力を入れ、何を得たか（1文）
2. 背景：なぜそれに取り組んだか
3. 目標/課題：具体的な目標や直面した課題
4. 行動：課題に対して自分が取った具体的な行動（なぜその行動を選んだかも）
5. 結果：数字で示せる成果・変化
6. 学び：経験から得た学びと、仕事への活かし方`,
    requirements: `【必須要素】
- 具体的な数字（人数、期間、成果など）
- 自分の役割と主体的な行動
- 行動の理由・思考プロセス
- 人間的成長のエピソード
- 入社後への活かし方`,
    checkPoints: '企業は「仕事への向き合い方」「課題発見力」「目標達成意欲」を見ています。',
    outputFormat: `1. 結論：何に力を入れ、何を得たか（1-2文）
2. きっかけ・動機：★重要★ なぜこの活動を始めたのか、原体験は何か（2-3文）
3. 課題：直面した具体的な課題・目標と、なぜそれを解決したいと思ったか（1-2文）
4. 行動：課題解決のために自分が取った行動と、なぜその方法を選んだか（3-4文）
5. 結果：具体的な数字を含む成果・変化（1-2文）
6. 学び：この経験から得た学びと、仕事でどう活かすか（1-2文）`
  },

  self_pr: {
    name: '自己PR',
    structure: `【必須構成】
1. 結論：自分の強みを一言で（1文）
2. 根拠エピソード：強みを発揮した具体的な経験
3. 行動と工夫：どのように強みを活かしたか
4. 成果：具体的な結果・周囲への影響
5. 再現性：入社後にどう活かせるか`,
    requirements: `【必須要素】
- 強みは1つに絞る
- 「再現性」のアピール（入社後も同じ強みが発揮できると示す）
- 具体的な数字や第三者からの評価
- 企業の求める人物像との関連付け`,
    checkPoints: '企業は「自社で活かせる能力か」「入社後も再現できるか」を見ています。',
    outputFormat: `1. 結論：私の強みは○○です（1文）
2. 強みの背景：★重要★ なぜこの強みが身についたのか、原体験（1-2文）
3. 発揮した経験：強みを発揮した具体的なエピソード（2-3文）
4. 工夫と成果：どのように強みを活かし、どんな成果を出したか（2-3文）
5. 再現性：入社後にこの強みをどう活かせるか（1-2文）`
  },

  motivation: {
    name: '志望動機',
    structure: `【必須構成】
1. 結論：なぜこの企業を志望するか（1文）
2. きっかけ：興味を持った経緯・原体験
3. 企業理解：企業の特徴・魅力への共感（具体的に）
4. マッチング：自分の経験・価値観との接点
5. ビジョン：入社後に実現したいこと・貢献したいこと`,
    requirements: `【必須要素】
- 「なぜこの業界か」「なぜこの企業か」の両方
- 企業研究に基づく具体的な魅力ポイント
- 自分の経験・価値観との結びつき
- 入社後の具体的なビジョン
- 比率：魅力2-3割、なぜか7-8割`,
    checkPoints: '企業は「志望度の高さ」「自社とのマッチ度」を見ています。',
    outputFormat: `1. 結論：貴社を志望する理由（1文）
2. きっかけ：★重要★ なぜこの業界・企業に興味を持ったのか、原体験（2-3文）
3. 企業の魅力：企業研究で感じた具体的な魅力ポイント（1-2文）
4. マッチング：自分の経験・価値観と企業の接点（2-3文）
5. 入社後のビジョン：実現したいこと、貢献したいこと（1-2文）`
  },

  setback: {
    name: '挫折経験・困難を乗り越えた経験',
    structure: `【必須構成（C-STAR形式）】
1. Challenge：挑戦した状況と目標
2. Setback：直面した挫折・困難（具体的に）
3. Trial & Action：乗り越えるための試行錯誤と行動
4. Result：結果と数値的な成果
5. Growth：得た学びと成長、今後への活かし方`,
    requirements: `【必須要素】
- 挫折前の目標と努力
- 挫折の具体的な内容と感情
- 乗り越えるための思考プロセスと行動
- 定量的な結果・変化
- 学びの仕事への応用`,
    checkPoints: '企業は「ストレス耐性」「課題解決力」「失敗から学ぶ姿勢」を見ています。',
    outputFormat: `1. 挑戦：何に挑戦し、どんな目標を持っていたか（1-2文）
2. 挫折：★重要★ どんな困難に直面し、なぜそれが辛かったのか（2-3文）
3. 向き合い方：なぜ諦めずに立ち向かおうと思ったのか（1-2文）
4. 行動：乗り越えるために取った具体的な行動（2-3文）
5. 結果と学び：どう乗り越え、何を学んだか、仕事にどう活かすか（1-2文）`
  },

  strength_weakness: {
    name: '長所・短所',
    structure: `【必須構成】
＜長所の場合＞
1. 結論：長所を一言で
2. エピソード：長所を発揮した具体例
3. 活用：仕事でどう活かせるか

＜短所の場合＞
1. 結論：短所を一言で
2. 具体例：短所が出た場面
3. 改善努力：克服のために取り組んでいること`,
    requirements: `【必須要素】
- 長所も短所も1つに絞る
- 具体的なエピソードで裏付け
- 長所は仕事への活かし方
- 短所は改善努力と成長意欲
- 短所は長所に言い換え可能なものを選ぶ`,
    checkPoints: '企業は「自己分析力」「成長意欲」を見ています。',
    outputFormat: `1. 結論：私の長所（または短所）は○○です（1文）
2. 背景：★重要★ なぜそう思うのか、自覚したきっかけ（1-2文）
3. 具体例：その特性が現れた具体的なエピソード（2-3文）
4. 仕事への活かし方（長所）/ 改善努力（短所）（2-3文）`
  },

  other: {
    name: '一般的な設問',
    structure: `【基本構成】
1. 結論：問いに対する答えを最初に
2. 理由：なぜそう考えるか
3. 具体例：根拠となるエピソード
4. まとめ：結論の再確認と展望`,
    requirements: `【必須要素】
- 設問に正面から回答
- 具体的なエピソード
- 自分の考え・価値観
- 論理的な構成`,
    checkPoints: '設問の意図を理解し、的確に回答することが重要です。',
    outputFormat: `1. 結論：設問に対する答え（1-2文）
2. 理由：★重要★ なぜそう考えるのか（2-3文）
3. 具体例：根拠となる経験やエピソード（2-3文）
4. まとめ：結論の再確認と今後への展望（1-2文）`
  }
}

export function buildESGenerationPrompt(input: ESGenerationInput): LLMMessage[] {
  const experiencesText = input.experiences
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

  const questionType = detectQuestionType(input.question)
  const typePrompt = QUESTION_TYPE_PROMPTS[questionType]

  // 文字数の95%を目標に（しっかり埋める）
  const targetChars = Math.floor(input.charLimit * 0.95)
  const minChars = Math.floor(input.charLimit * 0.85)

  // 追加コンテキストがある場合
  const additionalContextSection = input.additionalContext
    ? `\n【ユーザーからの追加指示】★必ず反映してください★\n${input.additionalContext}\n`
    : ''

  return [
    {
      role: 'system',
      content: `あなたは日本の就職活動に精通したESライターです。
文字数制限を最大限活用して、充実した内容のESを作成します。

【この設問のタイプ】${typePrompt.name}

${typePrompt.structure}

${typePrompt.requirements}

【採用担当者の視点】
${typePrompt.checkPoints}

【★最重要★ 「なぜ」を必ず含める】
採用担当者が最も知りたいのは「なぜその取り組みをしたのか」という動機・原体験です。
以下の「なぜ」を必ず文章に含めてください：
- なぜこの活動・経験を始めたのか（きっかけ・原体験）
- なぜその課題に取り組もうと思ったのか（問題意識・使命感）
- なぜその解決方法を選んだのか（思考プロセス）
「なぜ」の部分が薄いと、ESは不合格になります。`,
    },
    {
      role: 'user',
      content: `以下の経験を使って、設問に回答するESを作成してください。

【設問】
${input.question}

【使用する経験】
${experiencesText}
${additionalContextSection}
【文字数の指定】★重要★
- 最低${minChars}文字以上、${input.charLimit}文字以内
- 目標は${targetChars}文字程度
- 文字数が少なすぎると不合格になります

【出力形式】
以下の構成要素を自然な文章で繋げてください（見出しや番号は付けない）：

${typePrompt.outputFormat}

★「なぜ」の部分を厚めに書いてください。動機や思考プロセスが伝わることが重要です。

【出力に関する重要な注意】
- ES本文のみを出力してください
- 「調整後の文章」「○○文字」などのメタ情報は絶対に含めない
- 【】や番号付きの見出しは付けない
- 文字数カウントは出力しない
- 自然な段落で区切った文章として出力

全ての要素を含め、${targetChars}文字程度で完結させてください。`,
    },
  ]
}

export function buildInterviewPrompt(input: InterviewInput): LLMMessage[] {
  let systemPrompt = `あなたは日本企業の採用面接官です。
学生の面接練習を手伝います。

面接官として以下を心がけてください：
- 丁寧かつプロフェッショナルな態度
- 回答に対して深掘り質問をする
- 具体的なエピソードを引き出す
- STAR形式での回答を促す
- 回答への簡潔なフィードバックを含める`

  if (input.sessionType === 'company' && input.companyName) {
    systemPrompt += `\n\n想定企業: ${input.companyName}
この企業を志望する学生への面接を行っています。企業の特徴や求める人材像を意識した質問をしてください。`
  }

  if (input.sessionType === 'experience' && input.experience) {
    systemPrompt += `\n\n深掘り対象の経験:
タイトル: ${input.experience.title}
${input.experience.situation ? `状況: ${input.experience.situation}` : ''}
${input.experience.task ? `課題: ${input.experience.task}` : ''}
${input.experience.action ? `行動: ${input.experience.action}` : ''}
${input.experience.result ? `結果: ${input.experience.result}` : ''}

この経験について深掘りする質問をしてください。`
  }

  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
  ]

  // Add previous turns as conversation history
  if (input.previousTurns?.length) {
    for (const turn of input.previousTurns) {
      if (turn.interviewerMessage) {
        messages.push({ role: 'assistant', content: turn.interviewerMessage })
      }
      if (turn.userResponse) {
        messages.push({ role: 'user', content: turn.userResponse })
      }
    }
  }

  // Add current user message
  messages.push({ role: 'user', content: input.userMessage })

  return messages
}

export function buildInitialInterviewQuestion(
  sessionType: 'general' | 'experience' | 'company',
  experienceTitle?: string,
  companyName?: string
): string {
  if (sessionType === 'general') {
    const questions = [
      '自己PRをお願いします。',
      '学生時代に力を入れたことを教えてください。',
      'あなたの強みと弱みを教えてください。',
      '挫折経験とそれをどう乗り越えたか教えてください。',
      '5年後のキャリアプランを教えてください。',
    ]
    return questions[Math.floor(Math.random() * questions.length)]
  }

  if (sessionType === 'experience' && experienceTitle) {
    return `${experienceTitle}についてお聞きします。この経験を始めたきっかけは何ですか？`
  }

  if (sessionType === 'company' && companyName) {
    return `${companyName}への志望動機を教えてください。`
  }

  return '自己紹介をお願いします。'
}

export function buildInterviewFeedbackPrompt(
  turns: { interviewerMessage: string | null; userResponse: string | null }[]
): LLMMessage[] {
  const conversation = turns
    .map((turn, i) => {
      let text = `【ターン${i + 1}】\n`
      if (turn.interviewerMessage) text += `面接官: ${turn.interviewerMessage}\n`
      if (turn.userResponse) text += `学生: ${turn.userResponse}\n`
      return text
    })
    .join('\n')

  return [
    {
      role: 'system',
      content: `あなたはキャリアアドバイザーです。面接練習のフィードバックを行います。
以下の形式でフィードバックを提供してください：

1. 総合評価（5段階）
2. 良かった点（箇条書き）
3. 改善点（箇条書き）
4. 次回への具体的なアドバイス`,
    },
    {
      role: 'user',
      content: `以下の面接練習の内容について、フィードバックをお願いします。

${conversation}`,
    },
  ]
}
