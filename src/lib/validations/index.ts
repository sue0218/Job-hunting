import { z } from 'zod'

// Common schemas
export const uuidSchema = z.string().uuid('無効なID形式です')

export const dateSchema = z.string().regex(
  /^\d{4}-\d{2}(-\d{2})?$/,
  '日付はYYYY-MMまたはYYYY-MM-DD形式で入力してください'
).nullable().optional()

// Experience schemas
export const createExperienceSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  category: z.string().max(100, 'カテゴリは100文字以内で入力してください').nullable().optional(),
  periodStart: dateSchema,
  periodEnd: dateSchema,
  situation: z.string().max(5000, '状況は5000文字以内で入力してください').nullable().optional(),
  task: z.string().max(5000, '課題は5000文字以内で入力してください').nullable().optional(),
  action: z.string().max(5000, '行動は5000文字以内で入力してください').nullable().optional(),
  result: z.string().max(5000, '結果は5000文字以内で入力してください').nullable().optional(),
  skills: z.array(z.string().max(50)).max(20, 'スキルは20個以内で入力してください').nullable().optional(),
  rawNotes: z.string().max(10000, 'メモは10000文字以内で入力してください').nullable().optional(),
})

export const updateExperienceSchema = createExperienceSchema.partial()

// ES Document schemas
export const createEsDocumentSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  companyName: z.string().max(200, '企業名は200文字以内で入力してください').nullable().optional(),
  question: z.string().min(1, '設問は必須です').max(1000, '設問は1000文字以内で入力してください'),
  charLimit: z.number().int().min(1).max(10000).nullable().optional(),
  generatedContent: z.string().max(20000, '生成内容は20000文字以内で入力してください').nullable().optional(),
  editedContent: z.string().max(20000, '編集内容は20000文字以内で入力してください').nullable().optional(),
  experienceIds: z.array(uuidSchema).max(10, '経験は10個以内で選択してください').nullable().optional(),
  promptVersion: z.string().max(50).nullable().optional(),
  llmProvider: z.string().max(50).nullable().optional(),
  llmModel: z.string().max(100).nullable().optional(),
  status: z.enum(['draft', 'final']).optional(),
})

export const updateEsDocumentSchema = createEsDocumentSchema.partial()

// Interview Session schemas
export const createInterviewSessionSchema = z.object({
  title: z.string().max(200, 'タイトルは200文字以内で入力してください').nullable().optional(),
  type: z.enum(['general', 'experience', 'company']).optional(),
  interviewerType: z.enum(['standard', 'friendly', 'strict', 'logical']).optional(),
  companyName: z.string().max(200, '企業名は200文字以内で入力してください').nullable().optional(),
  position: z.string().max(200, '職種は200文字以内で入力してください').nullable().optional(),
  experienceId: uuidSchema.nullable().optional(),
  experienceIds: z.array(uuidSchema).max(10).nullable().optional(),
  esDocumentIds: z.array(uuidSchema).max(10).nullable().optional(),
})

export const updateInterviewSessionSchema = z.object({
  title: z.string().max(200).nullable().optional(),
  companyName: z.string().max(200).nullable().optional(),
  position: z.string().max(200).nullable().optional(),
  status: z.enum(['in_progress', 'completed']).optional(),
  feedback: z.string().max(10000, 'フィードバックは10000文字以内で入力してください').nullable().optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
})

export const addInterviewTurnSchema = z.object({
  turnNumber: z.number().int().min(1).max(1000),
  interviewerMessage: z.string().max(5000, '質問は5000文字以内で入力してください').nullable().optional(),
  userResponse: z.string().max(10000, '回答は10000文字以内で入力してください').nullable().optional(),
  feedback: z.string().max(5000).nullable().optional(),
})

// Types
export type CreateExperienceInput = z.infer<typeof createExperienceSchema>
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>
export type CreateEsDocumentInput = z.infer<typeof createEsDocumentSchema>
export type UpdateEsDocumentInput = z.infer<typeof updateEsDocumentSchema>
export type CreateInterviewSessionInput = z.infer<typeof createInterviewSessionSchema>
export type UpdateInterviewSessionInput = z.infer<typeof updateInterviewSessionSchema>
export type AddInterviewTurnInput = z.infer<typeof addInterviewTurnSchema>
