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
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">友達を招待</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            招待した友達がマイルストーンを達成すると、
            <strong className="text-primary">あなたも友達も+7日間</strong>無料期間が延長されます
          </p>
        </div>

        {/* Invite Code Card */}
        <InviteShareCard inviteUrl={inviteUrl} inviteCode={stats.inviteCode} />

        {/* Stats */}
        <div className="mb-6 sm:mb-8 grid grid-cols-3 gap-2 sm:gap-4">
          <Card>
            <CardHeader className="p-3 sm:p-6 pb-1 sm:pb-2">
              <CardTitle className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">招待した友達</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalReferrals}人</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:p-6 pb-1 sm:pb-2">
              <CardTitle className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">達成済み</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.rewardedReferrals}人</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">+{stats.rewardedReferrals * 7}日獲得</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-3 sm:p-6 pb-1 sm:pb-2">
              <CardTitle className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
                <Gift className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">残り枠</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
              <div className="text-xl sm:text-2xl font-bold">{stats.remainingBonusSlots}人</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">最大5人</p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">紹介の仕組み</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs sm:text-sm font-bold text-white">
                1
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium">友達に招待リンクを共有</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  上のボタンからリンクをコピーして、LINEやTwitterで共有
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs sm:text-sm font-bold text-white">
                2
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium">友達が登録して使い始める</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  友達がリンクから登録すると、紹介として紐付けられます
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs sm:text-sm font-bold text-white">
                3
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-medium">マイルストーン達成で+7日</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  友達が経験1つ + ES1つを作成すると、両者に+7日付与されます
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current trial status */}
        {remainingDays !== null && remainingDays > 0 && (
          <div className="mt-4 sm:mt-6 rounded-lg border bg-gradient-to-r from-primary/5 to-blue-50 p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
              <span className="text-sm sm:text-base font-medium">
                無料期間残り: <strong className="text-primary">{remainingDays}日</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
