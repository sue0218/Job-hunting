import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Database,
  ArrowRight,
  Check,
  X,
  RotateCcw,
} from 'lucide-react'
import {
  DIAGNOSE_ITEMS,
  decodeState,
  getScore,
  getScoreLevel,
  getShareText,
  getShareUrl,
} from '../_lib/diagnose-data'
import { ShareButton } from './share-button'

interface Props {
  searchParams: Promise<{ s?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const state = params.s ?? '00000000'
  const checks = decodeState(state)
  const score = getScore(checks)
  const level = getScoreLevel(score)

  const title = `ガクチカ完成度 ${score}/8（${level.label}）| ガクチカバンクAI`
  const description = `${level.emoji} ${level.description}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: getShareUrl(state),
      siteName: 'ガクチカバンクAI',
      images: [
        {
          url: `https://gakuchika-bank.com/api/og/diagnose?s=${state}`,
          width: 1200,
          height: 630,
          alt: `ガクチカ完成度 ${score}/8`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://gakuchika-bank.com/api/og/diagnose?s=${state}`],
    },
  }
}

const LEVEL_COLORS: Record<string, string> = {
  red: 'text-red-600',
  orange: 'text-orange-500',
  yellow: 'text-yellow-500',
  green: 'text-green-600',
}

const LEVEL_BG: Record<string, string> = {
  red: 'bg-red-50 border-red-200',
  orange: 'bg-orange-50 border-orange-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  green: 'bg-green-50 border-green-200',
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams
  const state = params.s ?? '00000000'
  const checks = decodeState(state)
  const score = getScore(checks)
  const level = getScoreLevel(score)
  const shareText = getShareText(score, level)
  const shareUrl = getShareUrl(state)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Database className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">ガクチカバンクAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                ログイン
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Score Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.2),transparent)]" />
        <div className="relative mx-auto max-w-2xl px-4 pb-8 pt-10 sm:pb-12 sm:pt-16">
          <div className="text-center">
            <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              診断結果
            </h1>

            {/* Score Card */}
            <div className={`mx-auto max-w-sm rounded-2xl border-2 p-6 shadow-lg ${LEVEL_BG[level.color]}`}>
              <div className="mb-1 text-4xl">{level.emoji}</div>
              <div className={`mb-2 text-6xl font-bold ${LEVEL_COLORS[level.color]}`}>
                {score}
                <span className="text-2xl text-muted-foreground">/8</span>
              </div>
              <div className={`mb-3 text-xl font-bold ${LEVEL_COLORS[level.color]}`}>
                {level.label}
              </div>
              <Progress value={(score / 8) * 100} className="mb-3 h-3" />
              <p className="text-sm text-muted-foreground">{level.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detail */}
      <section className="mx-auto max-w-2xl px-3 pb-8 sm:px-4">
        <h2 className="mb-4 text-lg font-bold text-foreground">チェック項目の詳細</h2>
        <div className="space-y-3">
          {DIAGNOSE_ITEMS.map((item, i) => (
            <Card
              key={item.id}
              className={checks[i] ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/30'}
            >
              <CardContent className="flex items-start gap-3 p-3 sm:p-4">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  checks[i] ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                }`}>
                  {checks[i] ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`font-medium ${checks[i] ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {item.label}
                  </div>
                  {!checks[i] && (
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.featureLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">で改善できます</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Share & Actions */}
      <section className="mx-auto max-w-2xl px-3 pb-8 sm:px-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <ShareButton text={shareText} url={shareUrl} />
          <Link href="/diagnose" className="flex-1">
            <Button variant="outline" size="lg" className="h-12 w-full rounded-xl">
              <RotateCcw className="mr-2 h-4 w-4" />
              もう一度診断する
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gradient-to-br from-primary via-primary to-blue-600 py-12 text-white">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            AIでガクチカを磨こう
          </h2>
          <p className="mb-6 text-white/80">
            経験DB・ES自動生成・AI面接練習で、あなたのガクチカを完成させましょう
          </p>
          <Link href="/sign-up">
            <Button size="lg" variant="secondary" className="shadow-xl transition-all hover:scale-105">
              無料で始める
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Database className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-foreground">ガクチカバンクAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2025 ガクチカバンクAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
