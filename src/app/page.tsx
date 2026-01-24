import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Database,
  RefreshCw,
  AlertTriangle,
  X,
  Check,
  Layers,
  Target,
  Shield,
  Zap,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  Play,
  Star,
} from 'lucide-react'

export default function LandingPage() {
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
            <Link href="/sign-up">
              <Button className="shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                無料で始める
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero - 経験の資産化を強調 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
        <div className="absolute top-40 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
          {/* Urgency Banner */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 text-sm shadow-sm">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              <span className="font-medium text-amber-800">26卒 本選考シーズン開始</span>
              <span className="text-amber-600">— 今すぐ経験を整理しよう</span>
            </div>
          </div>

          <div className="text-center">
            {/* Pre-headline */}
            <p className="mb-4 text-sm font-medium tracking-wide text-primary uppercase">
              ES生成 × AI面接練習 × 整合性チェック
            </p>

            {/* Main Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">もうESを</span>
              <span className="block mt-1">
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                    毎回ゼロから
                  </span>
                </span>
                書かなくていい
              </span>
            </h1>

            {/* Sub-headline with specific benefit */}
            <p className="mx-auto mb-6 max-w-2xl text-xl text-muted-foreground sm:text-2xl">
              経験を<strong className="text-foreground">1回登録</strong>すれば、
              <strong className="text-foreground">何十社</strong>のESも面接も対応できる。
            </p>

            {/* Value Props - Scannable */}
            <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span>STAR形式で経験を構造化</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span>ES・面接の矛盾を自動検出</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span>深堀り対策で本番に強くなる</span>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="group relative h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-blue-600 px-8 text-base font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    無料で始める
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 w-full rounded-xl border-2 px-8 text-base font-semibold sm:w-auto"
                >
                  <Play className="mr-2 h-4 w-4" />
                  使い方を見る
                </Button>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="mb-12 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
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
                <span>データは暗号化して保護</span>
              </div>
            </div>

            {/* Social Proof Stats */}
            <div className="mx-auto max-w-4xl rounded-2xl border bg-white/80 p-6 shadow-lg backdrop-blur-sm sm:p-8">
              <div className="mb-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">すでに多くの就活生が活用中</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-foreground sm:text-4xl">500</span>
                    <span className="text-xl font-bold text-primary sm:text-2xl">+</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">登録ユーザー</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-foreground sm:text-4xl">2,000</span>
                    <span className="text-xl font-bold text-primary sm:text-2xl">+</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">登録された経験</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-foreground sm:text-4xl">5,000</span>
                    <span className="text-xl font-bold text-primary sm:text-2xl">+</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">生成されたES</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold text-foreground sm:text-4xl">98</span>
                    <span className="text-xl font-bold text-primary sm:text-2xl">%</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">満足度</p>
                </div>
              </div>

              {/* Quick Testimonial */}
              <div className="mt-6 border-t pt-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="flex -space-x-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-bold text-white">
                      K
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-green-600 text-sm font-bold text-white">
                      M
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600 text-sm font-bold text-white">
                      S
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="mb-1 flex items-center justify-center gap-1 sm:justify-start">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      「<span className="text-foreground">10社分のESを2日で作成</span>できた。面接でも矛盾なく答えられて内定獲得！」
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points - 就活生の悩み */}
      <section className="border-t bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-sm">
                <Image
                  src="/images/socost-students.svg"
                  alt="就活の悩みイメージ"
                  width={400}
                  height={300}
                  className="drop-shadow-lg"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl lg:text-left">
                こんな経験、ありませんか？
              </h2>

              <div className="grid gap-4">
                <div className="flex items-start gap-4 rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      ESを毎回ゼロから書き直している
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      企業ごとに同じガクチカを何度も書き直し。時間がかかるし、表現がバラバラになる…
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      面接で深堀りされると答えに詰まる
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ESに書いた内容と面接での回答が微妙に違って、面接官に突っ込まれる…
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      自分の経験をうまく言語化できない
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      「何をアピールすればいいかわからない」「強みが見つからない」と悩む日々…
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      ES添削AIと面接AIが別々で使いづらい
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ツールを使い分けるうちに、ESと面接の内容がズレてしまう…
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center lg:text-left">
                <p className="text-lg font-medium text-primary">
                  ガクチカバンクAIなら、これらの悩みをまとめて解決できます
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Value - 一気通貫のフロー */}
      <section className="border-t bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Layers className="h-4 w-4" />
              一気通貫の就活サポート
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              貯める → 作る → 話す → 守る
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              経験を一度登録すれば、ES生成から面接練習、整合性チェックまで。
              <br />
              すべてが繋がっているから、ブレない就活ができる。
            </p>
          </div>

          {/* Interview Illustration */}
          <div className="mx-auto mb-12 max-w-md">
            <Image
              src="/images/socost-interview.svg"
              alt="AI面接練習のイメージ"
              width={400}
              height={300}
              className="mx-auto drop-shadow-lg"
            />
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {/* Step 1 */}
            <div className="relative">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/25">
                  1
                </div>
                <div className="hidden h-1 flex-1 bg-gradient-to-r from-primary to-primary/30 md:block" />
              </div>
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">貯める</h3>
                <p className="mb-3 text-sm font-medium text-primary">経験DB（STAR形式）</p>
                <p className="text-sm text-muted-foreground">
                  部活、バイト、研究…あなたの経験をSTAR形式で構造化。
                  <strong className="text-foreground">
                    一度登録すれば、何社でも使い回せる資産になる。
                  </strong>
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/25">
                  2
                </div>
                <div className="hidden h-1 flex-1 bg-gradient-to-r from-primary to-primary/30 md:block" />
              </div>
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">作る</h3>
                <p className="mb-3 text-sm font-medium text-primary">ES自動生成</p>
                <p className="text-sm text-muted-foreground">
                  経験DBから企業・設問に合わせたESを自動生成。
                  <strong className="text-foreground">毎回ゼロから書く必要がなくなる。</strong>
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/25">
                  3
                </div>
                <div className="hidden h-1 flex-1 bg-gradient-to-r from-primary to-primary/30 md:block" />
              </div>
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">話す</h3>
                <p className="mb-3 text-sm font-medium text-primary">AI面接練習</p>
                <p className="text-sm text-muted-foreground">
                  経験DBを参照したAI面接官が深堀り質問。
                  <strong className="text-foreground">本番さながらの練習で、答え方が身につく。</strong>
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/25">
                  4
                </div>
              </div>
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">守る</h3>
                <p className="mb-3 text-sm font-medium text-primary">整合性チェック</p>
                <p className="text-sm text-muted-foreground">
                  ESと面接回答の矛盾を自動検出。
                  <strong className="text-foreground">一貫性のある回答で、信頼される就活生に。</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Difference - 他サービスとの違い */}
      <section id="difference" className="relative overflow-hidden border-t bg-slate-900 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-slate-900 to-slate-900" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm">
              <Layers className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">徹底比較</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              他の就活AIとの違い
            </h2>
            <p className="mx-auto max-w-2xl text-slate-400">
              多くの就活AIは「ES添削」や「ES生成」に特化しています。
              <br />
              ガクチカバンクAIは<strong className="text-white">「経験の資産化」</strong>
              から始まる、唯一の一気通貫サービスです。
            </p>
          </div>

          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-5 text-left text-sm font-semibold text-slate-300 sm:px-6">
                      機能
                    </th>
                    <th className="px-3 py-5 text-center sm:px-6">
                      <div className="flex flex-col items-center gap-1">
                        <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/30 sm:text-sm">
                          ガクチカバンクAI
                        </span>
                      </div>
                    </th>
                    <th className="px-3 py-5 text-center text-xs font-medium text-slate-400 sm:px-6 sm:text-sm">
                      ES生成AI
                      <div className="text-xs text-slate-500">（SmartES等）</div>
                    </th>
                    <th className="px-3 py-5 text-center text-xs font-medium text-slate-400 sm:px-6 sm:text-sm">
                      面接AI
                      <div className="text-xs text-slate-500">（面接練習アプリ）</div>
                    </th>
                    <th className="px-3 py-5 text-center text-xs font-medium text-slate-400 sm:px-6 sm:text-sm">
                      ChatGPT
                      <div className="text-xs text-slate-500">（汎用AI）</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr className="transition-colors hover:bg-slate-700/30">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="font-medium text-white">経験DB（資産化）</div>
                      <div className="text-xs text-slate-400 sm:text-sm">
                        一度登録すれば何社でも使える
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/30">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-slate-800/30 transition-colors hover:bg-slate-700/30">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="font-medium text-white">ES生成</div>
                      <div className="text-xs text-slate-400 sm:text-sm">AIによる自動生成</div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/30">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex items-center justify-center rounded-full bg-yellow-500/20 px-2 py-1">
                        <span className="text-xs font-medium text-yellow-400">要プロンプト</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-700/30">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="font-medium text-white">面接練習</div>
                      <div className="text-xs text-slate-400 sm:text-sm">経験に基づいた深堀り</div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/30">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex items-center justify-center rounded-full bg-yellow-500/20 px-2 py-1">
                        <span className="text-xs font-medium text-yellow-400">経験非連携</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex items-center justify-center rounded-full bg-yellow-500/20 px-2 py-1">
                        <span className="text-xs font-medium text-yellow-400">要プロンプト</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-slate-800/30 transition-colors hover:bg-slate-700/30">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="font-medium text-white">整合性チェック</div>
                      <div className="text-xs text-slate-400 sm:text-sm">ES・面接の矛盾を検出</div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/30">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-slate-700/30">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="font-medium text-white">STAR形式で構造化</div>
                      <div className="text-xs text-slate-400 sm:text-sm">経験を論理的に整理</div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/30">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex items-center justify-center rounded-full bg-yellow-500/20 px-2 py-1">
                        <span className="text-xs font-medium text-yellow-400">手動入力</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-primary/10 transition-colors hover:bg-primary/20">
                    <td className="px-4 py-4 sm:px-6">
                      <div className="font-bold text-primary">一気通貫</div>
                      <div className="text-xs text-primary/70 sm:text-sm">すべての機能が連携</div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500/30 ring-2 ring-green-400">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center sm:px-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                        <X className="h-5 w-5 text-red-400" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center backdrop-blur-sm">
              <div className="mb-3 text-3xl font-bold text-primary">6つ</div>
              <div className="text-sm text-slate-400">すべての機能が揃う<br />唯一のサービス</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center backdrop-blur-sm">
              <div className="mb-3 text-3xl font-bold text-primary">0回</div>
              <div className="text-sm text-slate-400">ツール間の<br />コピペ作業</div>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center backdrop-blur-sm">
              <div className="mb-3 text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-slate-400">ES・面接の<br />一貫性を担保</div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-primary/30 bg-primary/10 p-6 text-center backdrop-blur-sm">
            <p className="font-medium text-white">
              <span className="text-primary">ポイント：</span>
              他サービスは「ES生成だけ」「面接練習だけ」。
              <br className="hidden sm:block" />
              ガクチカバンクAIは、<strong className="text-primary">経験の登録から面接対策まで、すべてが繋がっている</strong>から矛盾が生まれない。
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us - 選ばれる理由 */}
      <section className="border-t bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              ガクチカバンクAIが選ばれる3つの理由
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-500 shadow-lg shadow-primary/25">
                  <Database className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">経験が「資産」になる</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  毎回ESを書き直すのは過去の話。一度経験を登録すれば、何社受けても使い回せる。
                  <strong className="text-foreground">就活の効率が劇的に上がります。</strong>
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-500 shadow-lg shadow-primary/25">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">深堀りされてもブレない</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  ES・面接・経験DBがすべて連携。同じ経験から生成されるから、
                  <strong className="text-foreground">
                    面接で「ESと違いますね」と言われることがなくなります。
                  </strong>
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-500 shadow-lg shadow-primary/25">
                  <RefreshCw className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">STAR形式で言語化できる</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  「自分の強みがわからない」を解決。STAR形式のフレームワークで、
                  <strong className="text-foreground">
                    漠然とした経験を論理的に整理・言語化できます。
                  </strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">料金プラン</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              まずは無料で経験を登録してみてください。
              <br />
              使い心地を確認してから、必要に応じてアップグレード。
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <Card className="relative border-2 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>まずは経験DBを試したい方に</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-foreground">¥0</span>
                  <span className="text-muted-foreground">/月</span>
                </div>
                <ul className="mb-8 space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    経験DB 3件まで
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    ES生成 3回/月
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    面接練習 5回/月
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    整合性チェック
                  </li>
                </ul>
                <Link href="/sign-up" className="block">
                  <Button variant="outline" className="w-full">
                    無料で始める
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="relative border-2 border-primary shadow-xl shadow-primary/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-to-r from-primary to-blue-500 px-4 py-1 text-sm font-medium text-white shadow-lg">
                  おすすめ
                </span>
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-2xl">Standard</CardTitle>
                <CardDescription>本選考シーズンを本気で乗り切りたい方に</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <span className="text-5xl font-bold text-foreground">¥1,980</span>
                  <span className="text-muted-foreground">/月</span>
                </div>
                <ul className="mb-8 space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    <span className="font-medium">経験DB 無制限</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    ES生成 30回/月
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    面接練習 60回/月
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    整合性チェック
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-3 w-3 text-primary" />
                    </div>
                    4種類の面接官タイプ
                  </li>
                </ul>
                <Link href="/sign-up" className="block">
                  <Button className="w-full shadow-lg shadow-primary/25">今すぐ始める</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-600 py-24 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Success Illustration */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-sm">
                <Image
                  src="/images/socost-success.svg"
                  alt="就活成功のイメージ"
                  width={400}
                  height={300}
                  className="drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Right: CTA Content */}
            <div className="text-center lg:text-left">
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
                ガクチカを「資産」に変える、
                <br />
                最初の一歩を。
              </h2>
              <p className="mb-4 text-lg text-white/90">
                経験を登録して、ESも面接もブレない就活を始めましょう。
              </p>
              <p className="mb-10 text-white/70">
                無料プランで今すぐ始められます。クレジットカード不要。
              </p>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-xl transition-all hover:scale-105"
                >
                  無料で経験を登録してみる
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
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
