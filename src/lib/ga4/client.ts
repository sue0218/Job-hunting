import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { OAuth2Client } from 'google-auth-library'

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID

function getAuthClient(): OAuth2Client {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth credentials not configured')
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret)
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  return oauth2Client
}

export interface GA4DailyMetrics {
  activeUsers: number
  sessions: number
  screenPageViews: number
  averageSessionDuration: number
  bounceRate: number
  newUsers: number
}

export interface GA4TopPage {
  path: string
  views: number
}

export async function fetchGA4DailyMetrics(
  date: string
): Promise<GA4DailyMetrics | null> {
  if (!GA4_PROPERTY_ID) return null

  const authClient = getAuthClient()
  const analyticsDataClient = new BetaAnalyticsDataClient({
    authClient,
  })

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: date, endDate: date }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'newUsers' },
    ],
  })

  const row = response.rows?.[0]
  if (!row?.metricValues) return null

  return {
    activeUsers: Number(row.metricValues[0]?.value ?? 0),
    sessions: Number(row.metricValues[1]?.value ?? 0),
    screenPageViews: Number(row.metricValues[2]?.value ?? 0),
    averageSessionDuration: Number(row.metricValues[3]?.value ?? 0),
    bounceRate: Number(row.metricValues[4]?.value ?? 0),
    newUsers: Number(row.metricValues[5]?.value ?? 0),
  }
}

export async function fetchGA4TopPages(
  date: string,
  limit: number = 5
): Promise<GA4TopPage[]> {
  if (!GA4_PROPERTY_ID) return []

  const authClient = getAuthClient()
  const analyticsDataClient = new BetaAnalyticsDataClient({
    authClient,
  })

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: date, endDate: date }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit,
  })

  return (response.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? '(unknown)',
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }))
}
