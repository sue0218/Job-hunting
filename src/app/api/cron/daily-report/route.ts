import { NextResponse } from 'next/server'
import { db } from '@/lib/db/client'
import {
  users,
  esDocuments,
  interviewSessions,
  feedbackSubmissions,
  betaCampaigns,
} from '@/lib/db/schema'
import { sql, count, avg, gte, eq, and } from 'drizzle-orm'
import {
  fetchGA4DailyMetrics,
  fetchGA4TopPages,
  type GA4DailyMetrics,
  type GA4TopPage,
} from '@/lib/ga4/client'

export const maxDuration = 30

interface SlackMessage {
  blocks: Array<{
    type: string
    text?: { type: string; text: string }
    fields?: Array<{ type: string; text: string }>
  }>
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Calculate JST today start
    const now = new Date()
    const jstOffset = 9 * 60 * 60 * 1000
    const jstNow = new Date(now.getTime() + jstOffset)
    const todayStart = new Date(
      Date.UTC(jstNow.getUTCFullYear(), jstNow.getUTCMonth(), jstNow.getUTCDate()) - jstOffset
    )

    // Last 30 days for NPS calculation
    const thirtyDaysAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Query new users today
    const [newUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, todayStart))

    // Query total users
    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(users)

    // Query users by plan
    const [freeUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.plan, 'free'))

    const [standardUsersResult] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.plan, 'standard'))

    // Query ES documents today
    const [esDocsResult] = await db
      .select({ count: count() })
      .from(esDocuments)
      .where(gte(esDocuments.createdAt, todayStart))

    // Query total ES documents
    const [totalEsDocsResult] = await db
      .select({ count: count() })
      .from(esDocuments)

    // Query interview sessions today
    const [interviewSessionsResult] = await db
      .select({ count: count() })
      .from(interviewSessions)
      .where(gte(interviewSessions.createdAt, todayStart))

    // Query total interview sessions
    const [totalInterviewSessionsResult] = await db
      .select({ count: count() })
      .from(interviewSessions)

    // Query average NPS (last 30 days)
    const [npsResult] = await db
      .select({ avgNps: avg(feedbackSubmissions.nps) })
      .from(feedbackSubmissions)
      .where(
        and(
          sql`${feedbackSubmissions.nps} IS NOT NULL`,
          gte(feedbackSubmissions.createdAt, thirtyDaysAgo)
        )
      )

    // Query beta campaign remaining slots
    const betaCampaignsList = await db
      .select({
        key: betaCampaigns.key,
        maxSlots: betaCampaigns.maxSlots,
        claimedSlots: betaCampaigns.claimedSlots,
      })
      .from(betaCampaigns)
      .where(eq(betaCampaigns.enabled, true))

    // Extract counts
    const newUsersToday = newUsersResult?.count ?? 0
    const totalUsers = totalUsersResult?.count ?? 0
    const freeUsers = freeUsersResult?.count ?? 0
    const standardUsers = standardUsersResult?.count ?? 0
    const esDocsToday = esDocsResult?.count ?? 0
    const totalEsDocs = totalEsDocsResult?.count ?? 0
    const interviewSessionsToday = interviewSessionsResult?.count ?? 0
    const totalInterviewSessions = totalInterviewSessionsResult?.count ?? 0
    const avgNps = npsResult?.avgNps ? Number(npsResult.avgNps).toFixed(1) : 'N/A'

    // Fetch GA4 metrics (yesterday, since today's data is incomplete)
    const yesterdayDate = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000)
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0]

    let ga4Metrics: GA4DailyMetrics | null = null
    let ga4TopPages: GA4TopPage[] = []
    try {
      ga4Metrics = await fetchGA4DailyMetrics(yesterdayStr)
      ga4TopPages = await fetchGA4TopPages(yesterdayStr, 5)
    } catch (error) {
      const ga4Error = error instanceof Error ? error.message : 'Unknown'
      console.error('GA4 fetch failed:', ga4Error)
    }

    // Format beta campaign info
    const betaCampaignInfo = betaCampaignsList
      .map((campaign) => {
        const remaining = (campaign.maxSlots ?? 0) - (campaign.claimedSlots ?? 0)
        return `${campaign.key}: ${remaining}/${campaign.maxSlots ?? 0}`
      })
      .join('\n')

    // Format date in JST
    const dateStr = jstNow.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })

    // Build Slack message
    const slackMessage: SlackMessage = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📊 ガクチカバンクAI デイリーレポート',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${dateStr}*`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*👤 新規ユーザー（今日）*\n${newUsersToday}人`,
            },
            {
              type: 'mrkdwn',
              text: `*👥 総ユーザー数*\n${totalUsers}人`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*🆓 フリープラン*\n${freeUsers}人`,
            },
            {
              type: 'mrkdwn',
              text: `*⭐ スタンダードプラン*\n${standardUsers}人`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*📝 ES生成（今日）*\n${esDocsToday}件`,
            },
            {
              type: 'mrkdwn',
              text: `*📄 総ES文書数*\n${totalEsDocs}件`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*🎤 面接セッション（今日）*\n${interviewSessionsToday}件`,
            },
            {
              type: 'mrkdwn',
              text: `*🗂️ 総面接セッション数*\n${totalInterviewSessions}件`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*📊 NPS平均（30日間）*\n${avgNps}`,
            },
            {
              type: 'mrkdwn',
              text: betaCampaignInfo
                ? `*🎁 ベータキャンペーン残枠*\n${betaCampaignInfo}`
                : '*🎁 ベータキャンペーン残枠*\nなし',
            },
          ],
        },
        ...(ga4Metrics
          ? [
              {
                type: 'divider' as const,
              },
              {
                type: 'section' as const,
                text: {
                  type: 'mrkdwn' as const,
                  text: `*🌐 サイトアクセス（${yesterdayStr}）*`,
                },
              },
              {
                type: 'section' as const,
                fields: [
                  {
                    type: 'mrkdwn' as const,
                    text: `*👁️ ページビュー*\n${ga4Metrics.screenPageViews.toLocaleString()}`,
                  },
                  {
                    type: 'mrkdwn' as const,
                    text: `*🔗 セッション数*\n${ga4Metrics.sessions.toLocaleString()}`,
                  },
                ],
              },
              {
                type: 'section' as const,
                fields: [
                  {
                    type: 'mrkdwn' as const,
                    text: `*👤 アクティブユーザー*\n${ga4Metrics.activeUsers.toLocaleString()}`,
                  },
                  {
                    type: 'mrkdwn' as const,
                    text: `*🆕 新規ユーザー（GA4）*\n${ga4Metrics.newUsers.toLocaleString()}`,
                  },
                ],
              },
              {
                type: 'section' as const,
                fields: [
                  {
                    type: 'mrkdwn' as const,
                    text: `*⏱️ 平均セッション時間*\n${Math.round(ga4Metrics.averageSessionDuration)}秒`,
                  },
                  {
                    type: 'mrkdwn' as const,
                    text: `*📉 直帰率*\n${(ga4Metrics.bounceRate * 100).toFixed(1)}%`,
                  },
                ],
              },
              ...(ga4TopPages.length > 0
                ? [
                    {
                      type: 'section' as const,
                      text: {
                        type: 'mrkdwn' as const,
                        text:
                          '*📊 人気ページ TOP5*\n' +
                          ga4TopPages
                            .map(
                              (p, i) =>
                                `${i + 1}. \`${p.path}\` - ${p.views}PV`
                            )
                            .join('\n'),
                      },
                    },
                  ]
                : []),
            ]
          : []),
      ],
    }

    // Send to Slack via Bot Token + chat.postMessage API
    if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID) {
      const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        },
        body: JSON.stringify({
          channel: process.env.SLACK_CHANNEL_ID,
          ...slackMessage,
        }),
      })

      const slackResult = await slackResponse.json() as { ok: boolean; error?: string }
      if (!slackResult.ok) {
        return NextResponse.json(
          {
            ok: false,
            error: 'Slack API failed',
            details: slackResult.error,
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      stats: {
        newUsersToday,
        totalUsers,
        freeUsers,
        standardUsers,
        esDocsToday,
        totalEsDocs,
        interviewSessionsToday,
        totalInterviewSessions,
        avgNps,
        betaCampaigns: betaCampaignsList,
        ga4: ga4Metrics,
        ga4TopPages,
      },
      slackSent: !!(process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to generate daily report',
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
