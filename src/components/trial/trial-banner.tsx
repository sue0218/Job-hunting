'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Gift, Clock, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getRemainingTrialDays } from '@/lib/config/admin'

interface TrialBannerProps {
  trialEndsAt: Date | null | undefined
  hasCompletedFeedback?: boolean
}

export function TrialBanner({ trialEndsAt, hasCompletedFeedback = false }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [remainingDays, setRemainingDays] = useState<number | null>(null)

  useEffect(() => {
    const days = getRemainingTrialDays(trialEndsAt)
    setRemainingDays(days)
  }, [trialEndsAt])

  // Don't show if no trial, dismissed, or trial expired
  if (!trialEndsAt || dismissed || remainingDays === null || remainingDays <= 0) {
    return null
  }

  const isUrgent = remainingDays <= 7
  const bgColor = isUrgent
    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
  const textColor = isUrgent ? 'text-amber-800' : 'text-blue-800'
  const iconColor = isUrgent ? 'text-amber-600' : 'text-blue-600'

  return (
    <div className={`relative rounded-lg border ${bgColor} p-3 sm:p-4`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600"
        aria-label="閉じる"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`rounded-full bg-white p-2 shadow-sm ${iconColor}`}>
            {isUrgent ? <Clock className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
          </div>
          <div>
            <p className={`font-medium ${textColor}`}>
              {isUrgent ? (
                <>
                  トライアル残り<span className="font-bold"> {remainingDays}日 </span>
                </>
              ) : (
                <>
                  無料トライアル中
                  <span className="ml-2 text-sm font-normal">
                    （残り{remainingDays}日）
                  </span>
                </>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {!hasCompletedFeedback
                ? 'アンケートに回答すると+7日延長できます'
                : '友達を紹介すると+7日延長できます'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-10 sm:pl-0">
          {!hasCompletedFeedback ? (
            <Link href="/feedback">
              <Button size="sm" variant={isUrgent ? 'default' : 'outline'} className="gap-1">
                アンケートに回答
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/invite">
              <Button size="sm" variant={isUrgent ? 'default' : 'outline'} className="gap-1">
                友達を紹介
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
