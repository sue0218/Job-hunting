import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowRight } from 'lucide-react'

const painPoints = [
  {
    title: 'ESを毎回ゼロから書き直している',
    description:
      '企業ごとに同じガクチカを何度も書き直し。時間がかかるし、表現がバラバラになる...',
  },
  {
    title: '面接で深堀りされると答えに詰まる',
    description:
      'ESに書いた内容と面接での回答が微妙に違って、面接官に突っ込まれる...',
  },
  {
    title: '自分の経験をうまく言語化できない',
    description:
      '「何をアピールすればいいかわからない」「強みが見つからない」と悩む日々...',
  },
  {
    title: 'ES添削AIと面接AIが別々で使いづらい',
    description:
      'ツールを使い分けるうちに、ESと面接の内容がズレてしまう...',
  },
] as const

export function PainPointsSection() {
  return (
    <section className="border-t bg-slate-50 py-20 sm:py-28">
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
              {painPoints.map((point) => (
                <div
                  key={point.title}
                  className="flex items-start gap-4 rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">
                      {point.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mid-page CTA */}
            <div className="mt-10 rounded-xl bg-primary/5 border-l-4 border-primary p-6 text-center">
              <p className="text-lg font-medium mb-4">
                これらの悩み、ガクチカバンクAIなら解決できます
              </p>
              <Link href="/sign-up">
                <Button className="shadow-lg shadow-primary/25">
                  無料で始める
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
