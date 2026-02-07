import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Database,
  FileText,
  Layers,
  MessageSquare,
  RefreshCw,
  Shield,
  Target,
} from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: Database,
    title: '貯める',
    subtitle: '経験DB（STAR形式）',
    description: (
      <>
        部活、バイト、研究...あなたの経験をSTAR形式で構造化。
        <strong className="text-foreground">
          一度登録すれば、何社でも使い回せる資産になる。
        </strong>
      </>
    ),
    highlighted: true,
  },
  {
    number: 2,
    icon: FileText,
    title: '作る',
    subtitle: 'ES自動生成',
    description: (
      <>
        経験DBから企業・設問に合わせたESを自動生成。
        <strong className="text-foreground">
          毎回ゼロから書く必要がなくなる。
        </strong>
      </>
    ),
    highlighted: false,
  },
  {
    number: 3,
    icon: MessageSquare,
    title: '話す',
    subtitle: 'AI面接練習',
    description: (
      <>
        経験DBを参照したAI面接官が深堀り質問。
        <strong className="text-foreground">
          本番さながらの練習で、答え方が身につく。
        </strong>
      </>
    ),
    highlighted: false,
  },
  {
    number: 4,
    icon: Shield,
    title: '守る',
    subtitle: '整合性チェック',
    description: (
      <>
        ESと面接回答の矛盾を自動検出。
        <strong className="text-foreground">
          一貫性のある回答で、信頼される就活生に。
        </strong>
      </>
    ),
    highlighted: false,
  },
] as const

const reasons = [
  {
    icon: Database,
    title: '経験が「資産」になる',
    description: (
      <>
        毎回ESを書き直すのは過去の話。一度経験を登録すれば、何社受けても使い回せる。
        <strong className="text-foreground">
          就活の効率が劇的に上がります。
        </strong>
      </>
    ),
  },
  {
    icon: Target,
    title: '深堀りされてもブレない',
    description: (
      <>
        ES・面接・経験DBがすべて連携。同じ経験から生成されるから、
        <strong className="text-foreground">
          面接で「ESと違いますね」と言われることがなくなります。
        </strong>
      </>
    ),
  },
  {
    icon: RefreshCw,
    title: 'STAR形式で言語化できる',
    description: (
      <>
        「自分の強みがわからない」を解決。STAR形式のフレームワークで、
        <strong className="text-foreground">
          漠然とした経験を論理的に整理・言語化できます。
        </strong>
      </>
    ),
  },
] as const

export function CoreValueSection() {
  return (
    <section className="border-t bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
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

        {/* 4-Step Flow */}
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/25">
                    {step.number}
                  </div>
                  {step.number < 4 && (
                    <div className="hidden h-1 flex-1 bg-gradient-to-r from-primary to-primary/30 md:block" />
                  )}
                </div>
                <div
                  className={
                    step.highlighted
                      ? 'rounded-xl border-2 border-primary/20 bg-primary/5 p-6'
                      : 'rounded-xl border bg-white p-6 shadow-sm'
                  }
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-primary">
                    {step.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <p className="text-xs text-primary/70 italic">
                    {step.number === 1 && 'なぜ重要か: 経験を資産化することで、毎回ゼロから書く無駄をなくせます'}
                    {step.number === 2 && 'なぜ重要か: 時間を大幅削減し、より多くの企業に応募できます'}
                    {step.number === 3 && 'なぜ重要か: 深堀り質問への準備ができ、本番で自信を持って話せます'}
                    {step.number === 4 && 'なぜ重要か: 矛盾のない一貫した回答が、面接官の信頼を得ます'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Why Choose Us - Merged into core value */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              ガクチカバンクAIが選ばれる3つの理由
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {reasons.map((reason) => {
              const Icon = reason.icon
              return (
                <Card
                  key={reason.title}
                  className="border-2 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-500 shadow-lg shadow-primary/25">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{reason.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {reason.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
