import { hasFeedbackSubmitted } from '@/lib/actions/feedback'
import { getUserEntitlement } from '@/lib/actions/beta'
import { FeedbackForm } from './feedback-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Gift } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getRemainingTrialDays } from '@/lib/config/admin'

export default async function FeedbackPage() {
  const [alreadySubmitted, entitlement] = await Promise.all([
    hasFeedbackSubmitted(),
    getUserEntitlement(),
  ])

  const remainingDays = getRemainingTrialDays(entitlement?.trialEndsAt)

  if (alreadySubmitted) {
    return (
      <div className="p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start sm:items-center gap-3">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 shrink-0" />
                <div>
                  <CardTitle className="text-base sm:text-lg text-green-800">ご回答ありがとうございました！</CardTitle>
                  <CardDescription className="text-sm text-green-700">
                    7日間の無料期間が追加されました
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
              <p className="text-xs sm:text-sm text-green-700 mb-4">
                いただいたフィードバックはサービス改善に活用させていただきます。
                {remainingDays !== null && remainingDays > 0 && (
                  <>
                    <br />
                    現在の無料期間残り: <strong>{remainingDays}日</strong>
                  </>
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto">ダッシュボードに戻る</Button>
                </Link>
                <Link href="/invite" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Gift className="mr-2 h-4 w-4" />
                    友達を紹介
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">サービスへのご意見</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            回答すると<strong className="text-primary">+7日延長</strong>（約2分）
          </p>
        </div>

        <FeedbackForm />
      </div>
    </div>
  )
}
