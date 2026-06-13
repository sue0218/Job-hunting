'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Database,
  ArrowRight,
  CheckCircle,
  ClipboardCheck,
} from 'lucide-react'
import { DIAGNOSE_ITEMS, encodeState } from './_lib/diagnose-data'

export default function DiagnosePage() {
  const router = useRouter()
  const [checks, setChecks] = useState<boolean[]>(Array(8).fill(false))
  const score = checks.filter(Boolean).length

  function toggleCheck(index: number) {
    setChecks((prev) => prev.map((c, i) => (i === index ? !c : c)))
  }

  function handleSubmit() {
    router.push(`/diagnose/result?s=${encodeState(checks)}`)
  }

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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.2),transparent)]" />
        <div className="relative mx-auto max-w-2xl px-4 pb-8 pt-10 sm:pb-12 sm:pt-16">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">無料・登録不要</span>
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              ガクチカ完成度診断
            </h1>
            <p className="text-muted-foreground sm:text-lg">
              8つの項目をチェックして、あなたのガクチカの完成度を診断しましょう
            </p>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="mx-auto max-w-2xl px-3 pb-12 sm:px-4">
        {/* Progress */}
        <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <ClipboardCheck className="h-4 w-4 text-primary" />
              チェック済み
            </span>
            <span className="font-bold text-primary">{score} / 8</span>
          </div>
          <Progress value={(score / 8) * 100} className="h-2" />
        </div>

        {/* Items */}
        <div className="space-y-3">
          {DIAGNOSE_ITEMS.map((item, i) => (
            <Card
              key={item.id}
              className={`cursor-pointer transition-all ${
                checks[i]
                  ? 'border-primary/20 bg-primary/5'
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => toggleCheck(i)}
            >
              <CardContent className="flex items-start gap-3 p-3 sm:p-4">
                <Checkbox
                  checked={checks[i]}
                  onCheckedChange={() => toggleCheck(i)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground">{item.label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{item.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            className="group h-14 w-full max-w-sm rounded-xl bg-gradient-to-r from-primary to-blue-600 px-8 text-lg font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
          >
            <span className="flex items-center gap-2">
              診断結果を見る
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            結果はXでシェアできます
          </p>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'ガクチカ完成度診断',
            description: '8つのチェック項目であなたのガクチカの完成度を無料診断',
            url: 'https://gakuchika-bank.com/diagnose',
            applicationCategory: 'EducationalApplication',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
            operatingSystem: 'All',
          }),
        }}
      />

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
