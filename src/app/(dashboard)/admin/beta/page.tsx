import { redirect } from 'next/navigation'
import { getAdminStats, isCurrentUserAdmin, getRecentFeedback, getRecentReferrals } from '@/lib/actions/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Gift,
  MessageSquare,
  Share2,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { BetaCampaignToggle } from './beta-campaign-toggle'

export default async function AdminBetaPage() {
  const isAdmin = await isCurrentUserAdmin()

  if (!isAdmin) {
    redirect('/dashboard')
  }

  const stats = await getAdminStats()
  const recentFeedback = await getRecentFeedback(10)
  const recentReferrals = await getRecentReferrals(10)

  if (!stats) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
        <p className="text-muted-foreground mt-2">統計情報の取得に失敗しました</p>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">ベータキャンペーン管理</h1>
        <p className="text-muted-foreground mt-1">
          先着300名キャンペーンの進捗と各種統計
        </p>
      </div>

      {/* Campaign Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Beta Slots */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">先着枠</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.campaign ? (
              <>
                <div className="text-2xl font-bold">
                  {stats.campaign.claimedSlots} / {stats.campaign.maxSlots}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <BetaCampaignToggle enabled={stats.campaign.enabled} />
                  <span className="text-xs text-muted-foreground">
                    残り {stats.campaign.remainingSlots} 枠
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${(stats.campaign.claimedSlots / stats.campaign.maxSlots) * 100}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">キャンペーン未設定</p>
            )}
          </CardContent>
        </Card>

        {/* Active Trials */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">トライアル中</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.entitlements.withTrial}</div>
            <p className="text-xs text-muted-foreground mt-1">
              登録者数: {stats.entitlements.total}
            </p>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">アンケート回答</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.feedback.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              平均NPS: {stats.feedback.avgNps?.toFixed(1) ?? '-'} / 満足度: {stats.feedback.avgSatisfaction?.toFixed(1) ?? '-'}
            </p>
          </CardContent>
        </Card>

        {/* Referrals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">紹介成立</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.referrals.rewarded}</div>
            <p className="text-xs text-muted-foreground mt-1">
              待機中: {stats.referrals.pending} / 達成済: {stats.referrals.qualified}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            報酬付与サマリ
          </CardTitle>
          <CardDescription>付与された報酬の内訳</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(stats.rewards).map(([type, data]) => (
              <div key={type} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{getRewardTypeLabel(type)}</p>
                  <p className="text-xs text-muted-foreground">
                    合計 {data.totalDays} 日付与
                  </p>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {data.count}
                </Badge>
              </div>
            ))}
            {Object.keys(stats.rewards).length === 0 && (
              <p className="text-muted-foreground col-span-3">まだ報酬の付与はありません</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            直近7日間のイベント
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4">
            {stats.recentEvents.map((event) => (
              <div key={event.eventType} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-mono">{event.eventType}</span>
                <Badge variant="outline">{event.count}</Badge>
              </div>
            ))}
            {stats.recentEvents.length === 0 && (
              <p className="text-muted-foreground col-span-4">イベントはまだ記録されていません</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            最新のフィードバック
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentFeedback.length > 0 ? (
            <div className="space-y-4">
              {recentFeedback.map((fb) => (
                <div key={fb.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-4">
                    <Badge variant={getNpsBadgeVariant(fb.nps)}>
                      NPS: {fb.nps ?? '-'}
                    </Badge>
                    <Badge variant="outline">
                      満足度: {fb.satisfaction ?? '-'}/5
                    </Badge>
                    {fb.bestFeature && (
                      <Badge variant="secondary">{fb.bestFeature}</Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatDate(fb.createdAt)}
                    </span>
                  </div>
                  {fb.goodText && (
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">良い点: </span>
                      {fb.goodText}
                    </div>
                  )}
                  {fb.improveText && (
                    <div className="text-sm">
                      <span className="text-orange-600 font-medium">改善点: </span>
                      {fb.improveText}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">フィードバックはまだありません</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            最新の紹介
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentReferrals.length > 0 ? (
            <div className="space-y-2">
              {recentReferrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {ref.status === 'rewarded' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : ref.status === 'qualified' ? (
                      <Clock className="h-4 w-4 text-blue-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <div>
                      <p className="text-sm font-mono">{ref.inviteCode}</p>
                      <p className="text-xs text-muted-foreground">
                        紹介者: {ref.inviterClerkId.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(ref.status)}>
                      {getStatusLabel(ref.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(ref.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">紹介はまだありません</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getRewardTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    beta_enroll: 'ベータ登録',
    survey_bonus: 'アンケートボーナス',
    referral_bonus: '紹介ボーナス',
  }
  return labels[type] || type
}

function getNpsBadgeVariant(nps: number | null): 'default' | 'secondary' | 'destructive' {
  if (nps === null) return 'secondary'
  if (nps >= 9) return 'default'
  if (nps >= 7) return 'secondary'
  return 'destructive'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: '待機中',
    qualified: '達成',
    rewarded: '報酬済',
    blocked: 'ブロック',
  }
  return labels[status] || status
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pending: 'outline',
    qualified: 'secondary',
    rewarded: 'default',
    blocked: 'destructive',
  }
  return variants[status] || 'outline'
}

function formatDate(date: Date | null): string {
  if (!date) return '-'
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
