import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  date,
} from 'drizzle-orm/pg-core'

// Users table (synced with Clerk)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').notNull(),
  name: text('name'),
  plan: text('plan').default('free').notNull(), // free, standard
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Experiences table (経験DB)
export const experiences = pgTable('experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  category: text('category'), // 部活、バイト、研究、ボランティア等
  periodStart: date('period_start'),
  periodEnd: date('period_end'),
  situation: text('situation'), // STAR: Situation
  task: text('task'), // STAR: Task
  action: text('action'), // STAR: Action
  result: text('result'), // STAR: Result
  skills: text('skills').array(), // タグ形式
  rawNotes: text('raw_notes'), // 自由記述メモ
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ES Documents table
export const esDocuments = pgTable('es_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  companyName: text('company_name'),
  question: text('question').notNull(),
  charLimit: integer('char_limit'),
  generatedContent: text('generated_content'),
  editedContent: text('edited_content'),
  experienceIds: uuid('experience_ids').array(), // 参照した経験
  promptVersion: text('prompt_version'),
  llmProvider: text('llm_provider'),
  llmModel: text('llm_model'),
  status: text('status').default('draft').notNull(), // draft, final
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Interview Sessions table
export const interviewSessions = pgTable('interview_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title'),
  companyName: text('company_name'),
  position: text('position'),
  experienceIds: uuid('experience_ids').array(),
  esDocumentIds: uuid('es_document_ids').array(),
  status: text('status').default('active').notNull(), // active, completed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Interview Turns table
export const interviewTurns = pgTable('interview_turns', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .references(() => interviewSessions.id, { onDelete: 'cascade' })
    .notNull(),
  turnNumber: integer('turn_number').notNull(),
  interviewerMessage: text('interviewer_message'),
  userResponse: text('user_response'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Consistency Checks table
export const consistencyChecks = pgTable('consistency_checks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  targetType: text('target_type'), // es, interview
  targetId: uuid('target_id'),
  issues: jsonb('issues'), // 検出された矛盾
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Quota Usage table (消費台帳)
export const quotaUsage = pgTable('quota_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  usageType: text('usage_type').notNull(), // es_generation, interview_session, experience_create
  usageDate: date('usage_date').notNull(),
  count: integer('count').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Generation Cache table
export const generationCache = pgTable('generation_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  cacheKey: text('cache_key').unique().notNull(),
  content: text('content').notNull(),
  promptVersion: text('prompt_version'),
  llmProvider: text('llm_provider'),
  llmModel: text('llm_model'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
})

// Event Logs table
export const eventLogs = pgTable('event_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  eventType: text('event_type').notNull(),
  eventData: jsonb('event_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Feature Flags table
export const featureFlags = pgTable('feature_flags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  enabled: boolean('enabled').default(false).notNull(),
  rules: jsonb('rules'), // ユーザーセグメント等
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Experience = typeof experiences.$inferSelect
export type NewExperience = typeof experiences.$inferInsert
export type EsDocument = typeof esDocuments.$inferSelect
export type NewEsDocument = typeof esDocuments.$inferInsert
export type InterviewSession = typeof interviewSessions.$inferSelect
export type NewInterviewSession = typeof interviewSessions.$inferInsert
export type InterviewTurn = typeof interviewTurns.$inferSelect
export type NewInterviewTurn = typeof interviewTurns.$inferInsert
export type ConsistencyCheck = typeof consistencyChecks.$inferSelect
export type NewConsistencyCheck = typeof consistencyChecks.$inferInsert
export type QuotaUsage = typeof quotaUsage.$inferSelect
export type NewQuotaUsage = typeof quotaUsage.$inferInsert
export type GenerationCache = typeof generationCache.$inferSelect
export type NewGenerationCache = typeof generationCache.$inferInsert
export type EventLog = typeof eventLogs.$inferSelect
export type NewEventLog = typeof eventLogs.$inferInsert
export type FeatureFlag = typeof featureFlags.$inferSelect
export type NewFeatureFlag = typeof featureFlags.$inferInsert
