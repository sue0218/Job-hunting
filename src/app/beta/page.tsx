import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Database,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  Sparkles,
  Gift,
  Shield,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { getBetaCampaignStatus } from '@/lib/actions/beta'

export const revalidate = 60 // Revalidate every minute

export default async function BetaPage() {
  const campaign = await getBetaCampaignStatus()
  const isFull = campaign.remainingSlots <= 0 || !campaign.enabled

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
        <div className="absolute top-40 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 text-sm shadow-sm">
              <Gift className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-800">ベータユーザー限定キャンペーン</span>
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="block text-primary">先着{campaign.maxSlots}名</span>
              <span className="block mt-2">30日間無料でお試し</span>
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Standardプランの全機能を無料で体験。
              <br />
              クレジットカード不要、自動課金なし。
            </p>

            {/* Slots Counter */}
            {!isFull ? (
              <div className="mx-auto mb-8 max-w-sm">
                <div className="rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-lg">
                  <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>残り枠</span>
                  </div>
                  <div className="mb-2 text-5xl font-bold text-primary">
                    {campaign.remainingSlots}
                    <span className="text-xl text-muted-foreground">/{campaign.maxSlots}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500"
                      style={{
                        width: `${((campaign.maxSlots - campaign.remainingSlots) / campaign.maxSlots) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {campaign.claimedSlots}名が既に登録済み
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto mb-8 max-w-sm">
                <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-6">
                  <div className="mb-2 text-2xl font-bold text-slate-600">先着枠は終了しました</div>
                  <p className="text-sm text-muted-foreground">
                    友達を紹介すると、あなたも友達も+7日間無料！
                  </p>
                </div>
              </div>
            )}

            {/* CTA */}
            {!isFull ? (
              <Link href="/sign-up?ref=beta">
                <Button
                  size="lg"
                  className="group h-14 w-full max-w-sm rounded-xl bg-gradient-to-r from-primary to-blue-600 px-8 text-lg font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 sm:w-auto"
                >
                  <span className="flex items-center gap-2">
                    今すぐ無料で始める
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
            ) : (
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full max-w-sm rounded-xl px-8 text-lg font-semibold sm:w-auto"
                >
                  無料プランで始める
                </Button>
              </Link>
            )}

            {/* Trust Signals */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>クレジットカード不要</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>30秒で登録完了</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-primary" />
                <span>自動課金なし</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="border-t bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
              30日間で使える機能
            </h2>
            <p className="text-muted-foreground">
              Standardプラン（通常¥1,980/月）の全機能が無料で使えます
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">経験DB</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">無制限</strong>で経験を登録
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">ES生成</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">30回/月</strong>まで生成可能
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">面接練習</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">60回/月</strong>まで練習可能
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/10 bg-white">
              <CardHeader className="pb-3">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">4種の面接官</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  標準、優しい、厳しい、論理的
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="border-t bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
              さらに無料期間を延長する方法
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="relative overflow-hidden border-2">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-100 to-transparent px-4 py-1">
                <span className="text-xs font-medium text-amber-700">+7日</span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-amber-600" />
                  友達を紹介
                </CardTitle>
                <CardDescription>あなたの招待リンクから友達が登録</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  友達が経験1つ + ES1つを作成すると、
                  <strong className="text-foreground">あなたも友達も+7日間</strong>
                  無料期間が延長されます。
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-green-100 to-transparent px-4 py-1">
                <span className="text-xs font-medium text-green-700">+7日</span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  アンケートに回答
                </CardTitle>
                <CardDescription>サービス改善のためのフィードバック</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  簡単なアンケート（約2分）に回答すると、
                  <strong className="text-foreground">+7日間</strong>
                  無料期間が延長されます。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-gradient-to-br from-primary via-primary to-blue-600 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            {isFull ? '無料プランで始めよう' : '今すぐ無料で体験しよう'}
          </h2>
          <p className="mb-8 text-white/80">
            {isFull
              ? '無料プランでも経験3件、ES生成2回/月、面接練習1回/月が使えます'
              : `残り${campaign.remainingSlots}枠。お早めにどうぞ！`}
          </p>
          <Link href={isFull ? '/sign-up' : '/sign-up?ref=beta'}>
            <Button size="lg" variant="secondary" className="shadow-xl transition-all hover:scale-105">
              {isFull ? '無料プランで始める' : '30日間無料で始める'}
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
