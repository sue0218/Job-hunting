'use client'

import { useState, useTransition } from 'react'
import { useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, Crown, Loader2, ExternalLink, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { isAdminEmail, getEffectivePlan, getPlanLimits, getRemainingTrialDays } from '@/lib/config/admin'
import { createCheckoutSession, createPortalSession, syncSubscriptionFromStripe } from '@/lib/stripe/actions'

interface BillingContentProps {
  subscription: {
    plan: 'free' | 'standard'
    status?: string
    currentPeriodEnd?: Date
  }
  experienceCount: number
  monthlyEsCount: number
  monthlyInterviewCount: number
  trialEndsAt: Date | null
}

export function BillingContent({
  subscription,
  experienceCount,
  monthlyEsCount,
  monthlyInterviewCount,
  trialEndsAt,
}: BillingContentProps) {
  const { user, isLoaded } = useUser()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  const email = user?.primaryEmailAddress?.emailAddress
  const effectivePlan = getEffectivePlan(email, subscription.plan, trialEndsAt)
  const isAdmin = isAdminEmail(email)
  const limits = getPlanLimits(email, subscription.plan, trialEndsAt)
  const remainingTrialDays = getRemainingTrialDays(trialEndsAt)
  const isOnTrial = remainingTrialDays !== null && remainingTrialDays > 0 && subscription.plan === 'free'

  const handleUpgrade = () => {
    startTransition(async () => {
      const result = await createCheckoutSession()
      if (result.url) {
        window.location.href = result.url
      } else {
        alert(result.error || 'アップグレードに失敗しました')
      }
    })
  }

  const handleManageSubscription = () => {
    startTransition(async () => {
      const result = await createPortalSession()
      if (result.url) {
        window.location.href = result.url
      } else {
        alert(result.error || 'サブスクリプション管理画面を開けませんでした')
      }
    })
  }

  const handleSyncSubscription = () => {
    startTransition(async () => {
      const result = await syncSubscriptionFromStripe()
      if (result.success) {
        if (result.plan === 'standard') {
          alert('サブスクリプション情報を同期しました。ページを再読み込みします。')
          window.location.reload()
        } else {
          alert(result.message)
        }
      } else {
        alert('同期に失敗しました: ' + result.message)
      }
    })
  }

  if (!isLoaded) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">プラン・課金</h1>
        <p className="text-gray-500">現在のプランと利用状況</p>
      </div>

      {/* Success/Cancel Messages */}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            アップグレードが完了しました！Standardプランをご利用いただけます。
          </AlertDescription>
        </Alert>
      )}

      {canceled && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <XCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            アップグレードがキャンセルされました。いつでも再度お申し込みいただけます。
          </AlertDescription>
        </Alert>
      )}

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>現在のプラン</CardTitle>
            {effectivePlan === 'standard' ? (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Crown className="mr-1 h-3 w-3" />
                Standard
              </Badge>
            ) : (
              <Badge variant="secondary">Free</Badge>
            )}
            {isOnTrial && (
              <Badge variant="outline" className="border-green-500 text-green-600">
                トライアル中
              </Badge>
            )}
            {isAdmin && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                管理者
              </Badge>
            )}
          </div>
          <CardDescription>
            {effectivePlan === 'standard'
              ? isAdmin
                ? '管理者として全機能をご利用いただけます'
                : isOnTrial
                  ? `トライアル期間中（残り${remainingTrialDays}日）`
                  : subscription.currentPeriodEnd
                    ? `次回更新日: ${new Date(subscription.currentPeriodEnd).toLocaleDateString('ja-JP')}`
                    : 'Standardプランをご利用中です'
              : '無料プランをご利用中です'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">経験DB:</span> {experienceCount} / {limits.experiences === Infinity ? '無制限' : `${limits.experiences} 枚`}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">ES生成:</span> {monthlyEsCount} / {limits.esGenerationsPerMonth} 回（今月）
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">面接練習:</span> {monthlyInterviewCount} / {limits.interviewSessionsPerMonth} 回（今月）
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {effectivePlan === 'standard' && !isAdmin && !isOnTrial && (
              <Button
                variant="outline"
                onClick={handleManageSubscription}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="mr-2 h-4 w-4" />
                )}
                サブスクリプション管理
              </Button>
            )}
            {/* Sync button for users who might have webhook issues */}
            {effectivePlan === 'free' && !isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSyncSubscription}
                disabled={isPending}
                className="text-muted-foreground"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                課金状態を同期
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className={effectivePlan === 'free' ? 'border-primary' : ''}>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>就活を始めたばかりの方に</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">¥0</span>
              <span className="text-gray-500">/月</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                経験DB 3枚まで
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                ES生成 3回/月
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                面接練習 5回/月
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full" disabled={effectivePlan === 'free'}>
              {effectivePlan === 'free' ? '現在のプラン' : 'ダウングレード'}
            </Button>
          </CardContent>
        </Card>

        <Card className={effectivePlan === 'standard' ? 'border-primary ring-2 ring-primary' : ''}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Standard</CardTitle>
              <Badge>おすすめ</Badge>
            </div>
            <CardDescription>本格的に就活を進める方に</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <span className="text-3xl font-bold">¥1,980</span>
              <span className="text-gray-500">/月</span>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                経験DB 無制限
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                ES生成 30回/月
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                面接練習 60回/月
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                整合性チェック
              </li>
            </ul>
            {effectivePlan === 'standard' ? (
              <Button className="mt-4 w-full" disabled>
                {isAdmin ? '管理者特典で利用中' : '現在のプラン'}
              </Button>
            ) : (
              <Button
                className="mt-4 w-full"
                onClick={handleUpgrade}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    処理中...
                  </>
                ) : (
                  'アップグレード'
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
