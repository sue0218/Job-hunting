export interface DiagnoseItem {
  id: number
  label: string
  description: string
  feature: string
  featureLabel: string
}

export const DIAGNOSE_ITEMS: DiagnoseItem[] = [
  {
    id: 0,
    label: '具体的な数字が入っている',
    description: '「売上20%向上」「メンバー8人」など定量的な表現がある',
    feature: 'experience-db',
    featureLabel: '経験DB（STAR形式）',
  },
  {
    id: 1,
    label: '自分の役割が明確',
    description: '「リーダーとして」「企画担当として」など立場が伝わる',
    feature: 'experience-db',
    featureLabel: '経験DB（Action項目）',
  },
  {
    id: 2,
    label: '困難→乗り越え方が説明できる',
    description: '課題に直面し、どう解決したかのストーリーがある',
    feature: 'experience-db',
    featureLabel: '経験DB（STAR形式）',
  },
  {
    id: 3,
    label: 'チームでの立ち位置が伝わる',
    description: '周囲との関わり方や貢献の仕方が具体的',
    feature: 'es-generation',
    featureLabel: 'ES生成AI',
  },
  {
    id: 4,
    label: '学びを別の場面にも活かせる',
    description: '経験から得た教訓が再現性のある形で言語化されている',
    feature: 'interview',
    featureLabel: 'AI面接練習',
  },
  {
    id: 5,
    label: '「なぜそれをやったか」が言える',
    description: '動機や価値観が伝わるWhy（原体験）がある',
    feature: 'experience-db',
    featureLabel: '経験DB',
  },
  {
    id: 6,
    label: '面接で深掘りされても詰まらない',
    description: '「なぜ？」「具体的には？」に3段階は答えられる',
    feature: 'interview',
    featureLabel: 'AI面接練習（厳しめ）',
  },
  {
    id: 7,
    label: '400字以内にまとまっている',
    description: '要点が整理され、簡潔に伝えられる文章量になっている',
    feature: 'es-generation',
    featureLabel: 'ES生成AI',
  },
]

export interface ScoreLevel {
  min: number
  max: number
  emoji: string
  label: string
  color: string
  description: string
}

export const SCORE_LEVELS: ScoreLevel[] = [
  {
    min: 0,
    max: 2,
    emoji: '🟥',
    label: '書き直し推奨',
    color: 'red',
    description: '基本的な要素が不足しています。経験DBにSTAR形式で整理するところから始めましょう。',
  },
  {
    min: 3,
    max: 4,
    emoji: '🟧',
    label: '磨けば光る',
    color: 'orange',
    description: '骨格はできています。具体性と深掘り耐性を強化すれば大きく伸びます。',
  },
  {
    min: 5,
    max: 6,
    emoji: '🟨',
    label: 'あと一押し',
    color: 'yellow',
    description: 'かなり良い水準です。未チェック項目を補強すれば完成度の高いガクチカになります。',
  },
  {
    min: 7,
    max: 8,
    emoji: '🟩',
    label: '即戦力',
    color: 'green',
    description: '素晴らしい完成度です！自信を持って選考に臨みましょう。',
  },
]

export function getScoreLevel(score: number): ScoreLevel {
  return SCORE_LEVELS.find((l) => score >= l.min && score <= l.max) ?? SCORE_LEVELS[0]
}

export function encodeState(checks: boolean[]): string {
  return checks.map((c) => (c ? '1' : '0')).join('')
}

export function decodeState(s: string): boolean[] {
  if (!/^[01]{8}$/.test(s)) return Array(8).fill(false) as boolean[]
  return s.split('').map((c) => c === '1')
}

export function getScore(checks: boolean[]): number {
  return checks.filter(Boolean).length
}

export function getShareText(score: number, level: ScoreLevel): string {
  return `ガクチカ完成度診断の結果は ${score}/8（${level.emoji} ${level.label}）でした！\n\n無料・登録不要で診断できます👇`
}

export function getShareUrl(state: string): string {
  return `https://gakuchika-bank.com/diagnose/result?s=${state}`
}
