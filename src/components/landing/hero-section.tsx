import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Clock, Shield } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" />
      <div className="absolute top-40 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:pb-24 sm:pt-20">
        {/* Urgency Banner */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 text-sm shadow-sm">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            <span className="font-medium text-amber-800">26卒 本選考シーズン開始</span>
          </div>
        </div>

        <div className="text-center">
          {/* Main Headline - Larger fonts */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            <span className="block">もうESを毎回</span>
            <span className="block">ゼロから</span>
            <span className="block mt-1">
              <span className="relative z-10 bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                書かなくていい
              </span>
            </span>
          </h1>

          {/* Sub-headline merged into main message */}
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground sm:text-2xl">
            経験を<strong className="text-foreground">1回登録</strong>すれば、
            <strong className="text-foreground">何十社</strong>でも対応
          </p>

          {/* Social Proof Numbers */}
          <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">500+</span>
              <span>名の就活生が利用</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">3,000+</span>
              <span>件のES生成実績</span>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="group relative h-14 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-blue-600 px-8 text-base font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
              >
                <span className="relative z-10 flex items-center gap-2">
                  無料で始める
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
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

          {/* Positive Beta Notice */}
          <div className="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
            <p className="text-sm font-medium text-primary">
              🚀 先行ユーザー1,000名限定で無料開放中
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              正式版リリース後も特別価格でご利用いただけます
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
