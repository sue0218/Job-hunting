import { loadEnvConfig } from '@next/env'
loadEnvConfig(process.cwd())

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

type Stats = Readonly<{
  period: { from: string; to: string; label: string }
  users: { totalAllTime: number; newThisWeek: number; activeThisWeek: number }
  esDocuments: {
    weeklyCount: number
    totalAllTime: number
    topCompaniesAllTime: readonly { name: string; count: number }[]
    charLimitDistribution: readonly { range: string; count: number }[]
  }
  experiences: {
    weeklyCount: number
    totalAllTime: number
    topCategoriesAllTime: readonly { category: string; count: number }[]
  }
  interviews: {
    weeklyCount: number
    totalAllTime: number
    byInterviewerType: readonly { type: string; count: number }[]
    byType: readonly { type: string; count: number }[]
  }
  feedback: {
    npsAverage: number | null
    satisfactionAverage: number | null
    responseCount: number
  }
}>

const K_ANONYMITY_MIN = 5

function applyKAnonymity<T extends { count: number }>(rows: readonly T[]): readonly T[] {
  return rows.filter((r) => r.count >= K_ANONYMITY_MIN)
}

function charLimitBucket(n: number | null): string {
  if (n === null) return 'unspecified'
  if (n <= 200) return '〜200字'
  if (n <= 400) return '201〜400字'
  if (n <= 600) return '401〜600字'
  if (n <= 800) return '601〜800字'
  return '801字〜'
}

async function aggregate(): Promise<Stats> {
  const { and, gte, lt, sql } = await import('drizzle-orm')
  const { db } = await import('../src/lib/db/client')
  const schema = await import('../src/lib/db/schema')
  const { users, esDocuments, experiences, interviewSessions, feedbackSubmissions } = schema

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const fromIso = weekAgo.toISOString()
  const toIso = now.toISOString()
  const label = `${weekAgo.toISOString().slice(0, 10)} 〜 ${now.toISOString().slice(0, 10)}`

  const [totalUsers] = await db.select({ c: sql<number>`count(*)::int` }).from(users)
  const [newUsers] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(users)
    .where(and(gte(users.createdAt, weekAgo), lt(users.createdAt, now)))

  const [esWeek] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(esDocuments)
    .where(and(gte(esDocuments.createdAt, weekAgo), lt(esDocuments.createdAt, now)))
  const [esTotal] = await db.select({ c: sql<number>`count(*)::int` }).from(esDocuments)

  const [activeUsers] = await db
    .select({ c: sql<number>`count(distinct ${esDocuments.userId})::int` })
    .from(esDocuments)
    .where(and(gte(esDocuments.createdAt, weekAgo), lt(esDocuments.createdAt, now)))

  const topCompaniesRaw = await db
    .select({
      name: esDocuments.companyName,
      count: sql<number>`count(*)::int`,
    })
    .from(esDocuments)
    .where(sql`${esDocuments.companyName} is not null and length(trim(${esDocuments.companyName})) > 0`)
    .groupBy(esDocuments.companyName)
    .orderBy(sql`count(*) desc`)
    .limit(10)

  const charLimitRaw = await db
    .select({
      limit: esDocuments.charLimit,
      count: sql<number>`count(*)::int`,
    })
    .from(esDocuments)
    .groupBy(esDocuments.charLimit)

  const charLimitMap = new Map<string, number>()
  for (const row of charLimitRaw) {
    const bucket = charLimitBucket(row.limit)
    charLimitMap.set(bucket, (charLimitMap.get(bucket) ?? 0) + row.count)
  }

  const [expWeek] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(experiences)
    .where(and(gte(experiences.createdAt, weekAgo), lt(experiences.createdAt, now)))
  const [expTotal] = await db.select({ c: sql<number>`count(*)::int` }).from(experiences)

  const topCategories = await db
    .select({
      category: experiences.category,
      count: sql<number>`count(*)::int`,
    })
    .from(experiences)
    .where(sql`${experiences.category} is not null`)
    .groupBy(experiences.category)
    .orderBy(sql`count(*) desc`)
    .limit(10)

  const [intWeek] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(interviewSessions)
    .where(and(gte(interviewSessions.createdAt, weekAgo), lt(interviewSessions.createdAt, now)))
  const [intTotal] = await db.select({ c: sql<number>`count(*)::int` }).from(interviewSessions)

  const byInterviewerType = await db
    .select({
      type: interviewSessions.interviewerType,
      count: sql<number>`count(*)::int`,
    })
    .from(interviewSessions)
    .where(sql`${interviewSessions.interviewerType} is not null`)
    .groupBy(interviewSessions.interviewerType)
    .orderBy(sql`count(*) desc`)

  const byType = await db
    .select({
      type: interviewSessions.type,
      count: sql<number>`count(*)::int`,
    })
    .from(interviewSessions)
    .where(sql`${interviewSessions.type} is not null`)
    .groupBy(interviewSessions.type)
    .orderBy(sql`count(*) desc`)

  const [feedback] = await db
    .select({
      nps: sql<number | null>`avg(${feedbackSubmissions.nps})`,
      sat: sql<number | null>`avg(${feedbackSubmissions.satisfaction})`,
      c: sql<number>`count(*)::int`,
    })
    .from(feedbackSubmissions)

  return {
    period: { from: fromIso, to: toIso, label },
    users: {
      totalAllTime: totalUsers?.c ?? 0,
      newThisWeek: newUsers?.c ?? 0,
      activeThisWeek: activeUsers?.c ?? 0,
    },
    esDocuments: {
      weeklyCount: esWeek?.c ?? 0,
      totalAllTime: esTotal?.c ?? 0,
      topCompaniesAllTime: applyKAnonymity(
        topCompaniesRaw
          .filter((r): r is { name: string; count: number } => r.name !== null)
          .map((r) => ({ name: r.name, count: r.count }))
      ),
      charLimitDistribution: applyKAnonymity(
        Array.from(charLimitMap.entries())
          .map(([range, count]) => ({ range, count }))
          .sort((a, b) => b.count - a.count)
      ),
    },
    experiences: {
      weeklyCount: expWeek?.c ?? 0,
      totalAllTime: expTotal?.c ?? 0,
      topCategoriesAllTime: applyKAnonymity(
        topCategories
          .filter((r): r is { category: string; count: number } => r.category !== null)
          .map((r) => ({ category: r.category, count: r.count }))
      ),
    },
    interviews: {
      weeklyCount: intWeek?.c ?? 0,
      totalAllTime: intTotal?.c ?? 0,
      byInterviewerType: applyKAnonymity(
        byInterviewerType
          .filter((r): r is { type: string; count: number } => r.type !== null)
          .map((r) => ({ type: r.type, count: r.count }))
      ),
      byType: applyKAnonymity(
        byType
          .filter((r): r is { type: string; count: number } => r.type !== null)
          .map((r) => ({ type: r.type, count: r.count }))
      ),
    },
    feedback: {
      npsAverage: feedback?.nps !== null && feedback?.nps !== undefined ? Number(feedback.nps) : null,
      satisfactionAverage: feedback?.sat !== null && feedback?.sat !== undefined ? Number(feedback.sat) : null,
      responseCount: feedback?.c ?? 0,
    },
  }
}

async function main() {
  const stats = await aggregate()
  const outDir = join(process.cwd(), 'output', 'service-stats')
  mkdirSync(outDir, { recursive: true })
  const dateStr = new Date().toISOString().slice(0, 10)
  const outPath = join(outDir, `${dateStr}.json`)
  writeFileSync(outPath, JSON.stringify(stats, null, 2))
  process.stdout.write(`Wrote: ${outPath}\n`)
  process.stdout.write(`  Users: ${stats.users.totalAllTime} (+${stats.users.newThisWeek} this week)\n`)
  process.stdout.write(`  ES: ${stats.esDocuments.totalAllTime} (+${stats.esDocuments.weeklyCount} this week)\n`)
  process.stdout.write(`  Experiences: ${stats.experiences.totalAllTime} (+${stats.experiences.weeklyCount})\n`)
  process.stdout.write(`  Interviews: ${stats.interviews.totalAllTime} (+${stats.interviews.weeklyCount})\n`)
  process.exit(0)
}

main().catch((err) => {
  process.stderr.write(`Error: ${err instanceof Error ? err.stack : String(err)}\n`)
  process.exit(1)
})
