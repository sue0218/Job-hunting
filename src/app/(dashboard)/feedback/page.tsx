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
      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <CardTitle className="text-green-800">ご回答ありがとうございました！</CardTitle>
                  <CardDescription className="text-green-700">
                    7日間の無料期間が追加されました
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-700 mb-4">
                いただいたフィードバックはサービス改善に活用させていただきます。
                {remainingDays !== null && remainingDays > 0 && (
                  <>
                    <br />
                    現在の無料期間残り: <strong>{remainingDays}日</strong>
                  </>
                )}
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <Button>ダッシュボードに戻る</Button>
                </Link>
                <Link href="/invite">
                  <Button variant="outline">
                    <Gift className="mr-2 h-4 w-4" />
                    友達を紹介してさらに延長
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
    <div className="p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">サービスへのご意見</h1>
          <p className="text-muted-foreground">
            回答すると<strong className="text-primary">無料期間が7日延長</strong>されます（約2分）
          </p>
        </div>

        <FeedbackForm />
      </div>
    </div>
  )
}
