'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Database,
  FileText,
  MessageSquare,
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Target,
  Zap,
  X,
} from 'lucide-react'
import { completeOnboarding } from '@/lib/actions/user'

interface OnboardingModalProps {
  defaultOpen?: boolean
}

export function OnboardingModal({ defaultOpen = true }: OnboardingModalProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const totalSteps = 4
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    startTransition(async () => {
      await completeOnboarding()
      setOpen(false)
      router.push('/experiences/new')
    })
  }

  const handleSkip = () => {
    startTransition(async () => {
      await completeOnboarding()
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden"
        onInteractOutside={(e) => {
          // Allow closing by clicking outside
          e.preventDefault()
          handleSkip()
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-100 transition-colors z-10"
          aria-label="閉じる"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
            <span>ステップ {currentStep + 1} / {totalSteps}</span>
            <button
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              スキップ
            </button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {currentStep === 0 && <StepWelcome />}
          {currentStep === 1 && <StepExperienceDB />}
          {currentStep === 2 && <StepWorkflow />}
          {currentStep === 3 && <StepGetStarted />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50">
          <div>
            {currentStep > 0 && (
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {currentStep < totalSteps - 1 ? (
              <Button onClick={handleNext} disabled={isPending}>
                次へ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isPending}
                >
                  あとで登録する
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={isPending}
                  className="bg-gradient-to-r from-primary to-blue-600"
                >
                  {isPending ? (
                    '処理中...'
                  ) : (
                    <>
                      最初の経験を登録する
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StepWelcome() {
  return (
    <div className="text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20">
        <Sparkles className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        ガクチカバンクAIへようこそ！
      </h2>
      <p className="mb-8 text-muted-foreground">
        経験を「資産」として管理する、新しい就活の形。
        <br />
        1分で使い方をご紹介します。
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 text-left">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="mb-1 font-semibold text-foreground">1回登録で何社でも</h3>
          <p className="text-sm text-muted-foreground">
            経験を一度登録すれば、何十社のESにも対応
          </p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-left">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="mb-1 font-semibold text-foreground">一貫性を保証</h3>
          <p className="text-sm text-muted-foreground">
            ES・面接で矛盾が生まれない仕組み
          </p>
        </div>
        <div className="rounded-xl border bg-white p-4 text-left">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <Zap className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="mb-1 font-semibold text-foreground">深堀り対策</h3>
          <p className="text-sm text-muted-foreground">
            AI面接で本番さながらの練習が可能
          </p>
        </div>
      </div>
    </div>
  )
}

function StepExperienceDB() {
  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Database className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          まずは「経験」を登録しよう
        </h2>
        <p className="text-muted-foreground">
          すべての機能は「経験DB」から始まります
        </p>
      </div>

      <div className="rounded-xl border bg-slate-50 p-6">
        <h3 className="mb-4 font-semibold text-foreground">STAR形式で経験を構造化</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg bg-white p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
              S
            </div>
            <div>
              <p className="font-medium text-foreground">Situation</p>
              <p className="text-sm text-muted-foreground">どんな状況だった？</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-white p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
              T
            </div>
            <div>
              <p className="font-medium text-foreground">Task</p>
              <p className="text-sm text-muted-foreground">何を達成しようとした？</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-white p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
              A
            </div>
            <div>
              <p className="font-medium text-foreground">Action</p>
              <p className="text-sm text-muted-foreground">どんな行動をとった？</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-white p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">
              R
            </div>
            <div>
              <p className="font-medium text-foreground">Result</p>
              <p className="text-sm text-muted-foreground">どんな結果が出た？</p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        部活、バイト、研究、ボランティア...どんな経験でもOK！
      </p>
    </div>
  )
}

function StepWorkflow() {
  const steps = [
    {
      icon: Database,
      title: '貯める',
      description: '経験をSTAR形式で登録',
      color: 'bg-blue-500',
    },
    {
      icon: FileText,
      title: '作る',
      description: 'AIがESを自動生成',
      color: 'bg-green-500',
    },
    {
      icon: MessageSquare,
      title: '話す',
      description: 'AI面接官と深堀り練習',
      color: 'bg-amber-500',
    },
    {
      icon: Shield,
      title: '守る',
      description: '整合性を自動チェック',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          4つのステップで就活を制する
        </h2>
        <p className="text-muted-foreground">
          すべてが繋がっているから、ブレない就活ができる
        </p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-1/2 top-8 bottom-8 w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-500 via-green-500 via-amber-500 to-purple-500 hidden sm:block" />

        <div className="grid gap-4 sm:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl ${step.color} text-white shadow-lg`}>
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border-2 border-primary/20 bg-primary/5 p-4 text-center">
        <p className="text-sm font-medium text-foreground">
          <span className="text-primary">ポイント：</span>
          経験DBに登録した内容が、ES生成・面接練習・整合性チェックすべてに活きる！
        </p>
      </div>
    </div>
  )
}

function StepGetStarted() {
  return (
    <div className="text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
        <Check className="h-10 w-10 text-white" />
      </div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        さあ、始めよう！
      </h2>
      <p className="mb-6 text-muted-foreground">
        まずは1つ、あなたの経験を登録してみましょう。
        <br />
        部活、バイト、研究...どんな経験でも大丈夫です。
      </p>

      <div className="rounded-xl border bg-slate-50 p-6">
        <h3 className="mb-4 font-semibold text-foreground">おすすめの始め方</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              1
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">一番自信のある経験</span>を1つ登録
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              2
            </div>
            <p className="text-sm text-muted-foreground">
              その経験を使って<span className="font-medium text-foreground">ESを1つ生成</span>してみる
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              3
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">AI面接官</span>と深堀り練習してみる
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        所要時間: 約5分
      </p>
    </div>
  )
}
