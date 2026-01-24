import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  date,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table (synced with Clerk)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').notNull(),
  name: text('name'),
  plan: text('plan').default('free').notNull(), // free, standard
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
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
  type: text('type').default('general'), // general, experience, company
  interviewerType: text('interviewer_type').default('standard'), // standard, friendly, strict, logical
  companyName: text('company_name'),
  position: text('position'),
  experienceId: uuid('experience_id'), // 単一の経験を参照
  experienceIds: uuid('experience_ids').array(),
  esDocumentIds: uuid('es_document_ids').array(),
  status: text('status').default('in_progress').notNull(), // in_progress, completed
  feedback: text('feedback'), // セッション終了後のフィードバック
  rating: integer('rating'), // 1-5の評価
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

// ========================================
// Beta Campaign & Rewards System Tables
// ========================================

// User Entitlements table (権限・トライアル管理)
export const userEntitlements = pgTable('user_entitlements', {
  clerkId: text('clerk_id').primaryKey(), // Clerk user ID
  trialEndsAt: timestamp('trial_ends_at'), // トライアル終了日時
  trialSource: text('trial_source'), // 'beta' | 'referral' | 'survey' | 'manual'
  inviteCode: text('invite_code').unique().notNull(), // 8桁ランダム
  invitedByCode: text('invited_by_code'), // 誰の紹介で来たか
  surveyCompletedAt: timestamp('survey_completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Beta Campaigns table (キャンペーン設定)
export const betaCampaigns = pgTable('beta_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(), // 'beta_standard_300_30d'
  enabled: boolean('enabled').default(true).notNull(),
  maxSlots: integer('max_slots').notNull(), // 300
  claimedSlots: integer('claimed_slots').default(0).notNull(),
  startsAt: timestamp('starts_at'),
  endsAt: timestamp('ends_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Rewards Ledger table (報酬台帳 - 冪等性の要)
export const rewardsLedger = pgTable('rewards_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull(), // Clerk user ID
  rewardType: text('reward_type').notNull(), // 'beta_enroll' | 'survey_bonus' | 'referral_bonus'
  sourceId: text('source_id').notNull(), // campaign_key / feedback_id / referred_clerk_id
  days: integer('days').notNull(), // 30 / 7
  grantedAt: timestamp('granted_at').defaultNow().notNull(),
  notes: text('notes'),
}, (table) => [
  // 重複付与防止のユニーク制約
  uniqueIndex('rewards_ledger_unique_idx').on(table.clerkId, table.rewardType, table.sourceId),
  index('rewards_ledger_clerk_id_idx').on(table.clerkId),
])

// Referrals table (紹介管理)
export const referrals = pgTable('referrals', {
  id: uuid('id').primaryKey().defaultRandom(),
  inviterClerkId: text('inviter_clerk_id').notNull(), // 紹介者のClerk ID
  inviteCode: text('invite_code').notNull(), // 使用された招待コード
  referredClerkId: text('referred_clerk_id').unique(), // 被紹介者は1回まで
  status: text('status').default('pending').notNull(), // 'pending' | 'qualified' | 'rewarded' | 'blocked'
  qualifiedAt: timestamp('qualified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('referrals_inviter_idx').on(table.inviterClerkId),
  index('referrals_invite_code_idx').on(table.inviteCode),
])

// Feedback Submissions table (アンケート回答)
export const feedbackSubmissions = pgTable('feedback_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull(), // Clerk user ID
  nps: integer('nps'), // 0-10
  satisfaction: integer('satisfaction'), // 1-5
  bestFeature: text('best_feature'), // 最も良い機能
  goodText: text('good_text'), // 良かった点
  improveText: text('improve_text'), // 改善してほしい点
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  experiences: many(experiences),
  esDocuments: many(esDocuments),
  interviewSessions: many(interviewSessions),
}))

export const interviewSessionsRelations = relations(interviewSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [interviewSessions.userId],
    references: [users.id],
  }),
  turns: many(interviewTurns),
}))

export const interviewTurnsRelations = relations(interviewTurns, ({ one }) => ({
  session: one(interviewSessions, {
    fields: [interviewTurns.sessionId],
    references: [interviewSessions.id],
  }),
}))

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
export type UserEntitlement = typeof userEntitlements.$inferSelect
export type NewUserEntitlement = typeof userEntitlements.$inferInsert
export type BetaCampaign = typeof betaCampaigns.$inferSelect
export type NewBetaCampaign = typeof betaCampaigns.$inferInsert
export type RewardLedger = typeof rewardsLedger.$inferSelect
export type NewRewardLedger = typeof rewardsLedger.$inferInsert
export type Referral = typeof referrals.$inferSelect
export type NewReferral = typeof referrals.$inferInsert
export type FeedbackSubmission = typeof feedbackSubmissions.$inferSelect
export type NewFeedbackSubmission = typeof feedbackSubmissions.$inferInsert
