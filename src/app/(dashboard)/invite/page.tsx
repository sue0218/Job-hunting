import { getInviteStats } from '@/lib/actions/referral'
import { getUserEntitlement } from '@/lib/actions/beta'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift, Users, CheckCircle, Clock, Copy, Share2 } from 'lucide-react'
import { getRemainingTrialDays } from '@/lib/config/admin'
import { InviteShareCard } from './invite-share-card'

export default async function InvitePage() {
  const [stats, entitlement] = await Promise.all([
    getInviteStats(),
    getUserEntitlement(),
  ])

  const remainingDays = getRemainingTrialDays(entitlement?.trialEndsAt)

  if (!stats) {
    return (
      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                招待機能を利用するにはログインが必要です
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://gakuchika-bank.com'}/invite/${stats.inviteCode}`

  return (
    <div className="p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">友達を招待</h1>
          <p className="text-muted-foreground">
            招待した友達がマイルストーンを達成すると、
            <strong className="text-primary">あなたも友達も+7日間</strong>無料期間が延長されます
          </p>
        </div>

        {/* Invite Code Card */}
        <InviteShareCard inviteUrl={inviteUrl} inviteCode={stats.inviteCode} />

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                招待した友達
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReferrals}人</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                達成済み
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rewardedReferrals}人</div>
              <p className="text-xs text-muted-foreground">+{stats.rewardedReferrals * 7}日獲得</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Gift className="h-4 w-4" />
                残りボーナス枠
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.remainingBonusSlots}人</div>
              <p className="text-xs text-muted-foreground">最大5人まで</p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">紹介の仕組み</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                1
              </div>
              <div>
                <p className="font-medium">友達に招待リンクを共有</p>
                <p className="text-sm text-muted-foreground">
                  上のボタンからリンクをコピーして、LINEやTwitterで共有
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                2
              </div>
              <div>
                <p className="font-medium">友達が登録して使い始める</p>
                <p className="text-sm text-muted-foreground">
                  友達がリンクから登録すると、紹介として紐付けられます
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                3
              </div>
              <div>
                <p className="font-medium">マイルストーン達成で+7日</p>
                <p className="text-sm text-muted-foreground">
                  友達が経験1つ + ES1つを作成すると、両者に+7日付与されます
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current trial status */}
        {remainingDays !== null && remainingDays > 0 && (
          <div className="mt-6 rounded-lg border bg-gradient-to-r from-primary/5 to-blue-50 p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-medium">
                現在の無料期間残り: <strong className="text-primary">{remainingDays}日</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
