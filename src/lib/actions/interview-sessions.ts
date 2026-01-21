'use server'

import { db } from '@/lib/db/client'
import {
  interviewSessions,
  interviewTurns,
  type InterviewSession,
  type InterviewTurn,
} from '@/lib/db/schema'
import { eq, desc, asc, and, gte } from 'drizzle-orm'
import { getCurrentUserId, getOrCreateUser } from './user'
import { revalidatePath } from 'next/cache'
import {
  createInterviewSessionSchema,
  updateInterviewSessionSchema,
  addInterviewTurnSchema,
  uuidSchema,
  type CreateInterviewSessionInput,
  type UpdateInterviewSessionInput,
  type AddInterviewTurnInput,
} from '@/lib/validations'
import { checkRateLimit, INTERVIEW_TURN_LIMIT, RateLimitError } from '@/lib/rate-limit'
import { enforceQuotaForUser } from '@/lib/quota/service'

export type InterviewSessionWithTurns = InterviewSession & {
  turns: InterviewTurn[]
}

export async function getInterviewSessions(): Promise<InterviewSessionWithTurns[]> {
  const userId = await getCurrentUserId()

  // Use eager loading with 'with' to avoid N+1 queries
  const sessions = await db.query.interviewSessions.findMany({
    where: eq(interviewSessions.userId, userId),
    orderBy: [desc(interviewSessions.updatedAt)],
    with: {
      turns: {
        orderBy: [asc(interviewTurns.turnNumber)],
      },
    },
  })

  return sessions
}

export async function getInterviewSession(
  id: string
): Promise<InterviewSessionWithTurns | null> {
  // Validate ID
  const validatedId = uuidSchema.safeParse(id)
  if (!validatedId.success) {
    return null
  }

  const userId = await getCurrentUserId()

  // Use eager loading with 'with' to avoid additional query
  const session = await db.query.interviewSessions.findFirst({
    where: eq(interviewSessions.id, validatedId.data),
    with: {
      turns: {
        orderBy: [asc(interviewTurns.turnNumber)],
      },
    },
  })

  if (!session || session.userId !== userId) {
    return null
  }

  return session
}

export async function createInterviewSession(
  data: CreateInterviewSessionInput
): Promise<InterviewSession> {
  // Validate input
  const validated = createInterviewSessionSchema.parse(data)

  // Get user and check quota before creating
  const user = await getOrCreateUser()
  await enforceQuotaForUser(user.id, user.email, user.plan, 'interview_session')

  const userId = user.id

  const [created] = await db.insert(interviewSessions).values({
    ...validated,
    userId,
  }).returning()

  revalidatePath('/interview')
  return created
}

export async function addInterviewTurn(
  sessionId: string,
  data: AddInterviewTurnInput
): Promise<InterviewTurn | null> {
  // Validate session ID
  const validatedSessionId = uuidSchema.safeParse(sessionId)
  if (!validatedSessionId.success) {
    return null
  }

  // Validate input
  const validated = addInterviewTurnSchema.parse(data)

  const userId = await getCurrentUserId()

  // Apply rate limiting
  const rateLimitKey = `interview-turn:${userId}`
  const rateLimitResult = checkRateLimit(rateLimitKey, INTERVIEW_TURN_LIMIT)
  if (!rateLimitResult.success) {
    throw new RateLimitError(rateLimitResult.resetInMs)
  }

  // Verify ownership
  const session = await db.query.interviewSessions.findFirst({
    where: eq(interviewSessions.id, validatedSessionId.data),
  })

  if (!session || session.userId !== userId) {
    return null
  }

  const [turn] = await db.insert(interviewTurns).values({
    ...validated,
    sessionId: validatedSessionId.data,
  }).returning()

  // Update session timestamp
  await db
    .update(interviewSessions)
    .set({ updatedAt: new Date() })
    .where(eq(interviewSessions.id, validatedSessionId.data))

  revalidatePath(`/interview/${validatedSessionId.data}`)
  return turn
}

export async function updateInterviewSession(
  id: string,
  data: UpdateInterviewSessionInput
): Promise<InterviewSession | null> {
  // Validate ID
  const validatedId = uuidSchema.safeParse(id)
  if (!validatedId.success) {
    return null
  }

  // Validate input
  const validated = updateInterviewSessionSchema.parse(data)

  const userId = await getCurrentUserId()

  // Verify ownership
  const existing = await db.query.interviewSessions.findFirst({
    where: eq(interviewSessions.id, validatedId.data),
  })

  if (!existing || existing.userId !== userId) {
    return null
  }

  const [updated] = await db
    .update(interviewSessions)
    .set({
      ...validated,
      updatedAt: new Date(),
    })
    .where(eq(interviewSessions.id, validatedId.data))
    .returning()

  revalidatePath('/interview')
  revalidatePath(`/interview/${validatedId.data}`)
  return updated
}

export async function deleteInterviewSession(id: string): Promise<boolean> {
  // Validate ID
  const validatedId = uuidSchema.safeParse(id)
  if (!validatedId.success) {
    return false
  }

  const userId = await getCurrentUserId()

  // Verify ownership
  const existing = await db.query.interviewSessions.findFirst({
    where: eq(interviewSessions.id, validatedId.data),
  })

  if (!existing || existing.userId !== userId) {
    return false
  }

  // Turns are deleted by cascade
  await db.delete(interviewSessions).where(eq(interviewSessions.id, validatedId.data))

  revalidatePath('/interview')
  return true
}

export async function getMonthlyInterviewCount(): Promise<number> {
  const userId = await getCurrentUserId()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const sessions = await db.query.interviewSessions.findMany({
    where: and(
      eq(interviewSessions.userId, userId),
      gte(interviewSessions.createdAt, startOfMonth)
    ),
  })

  return sessions.length
}
