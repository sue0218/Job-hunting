export type QuotaType = 'experience' | 'es_generation' | 'interview_session'

export interface QuotaCheckResult {
  allowed: boolean
  current: number
  limit: number
  remaining: number
  plan: 'free' | 'standard'
}

export class QuotaExceededError extends Error {
  constructor(
    public quotaType: QuotaType,
    public current: number,
    public limit: number
  ) {
    const typeNames: Record<QuotaType, string> = {
      experience: '経験DB',
      es_generation: 'ES生成',
      interview_session: '面接練習',
    }
    super(`${typeNames[quotaType]}の上限（${limit}件）に達しています`)
    this.name = 'QuotaExceededError'
  }
}
