'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { quickCreateExperience } from '@/lib/actions/experiences'
import { completeOnboarding } from '@/lib/actions/user'

const TOTAL_STEPS = 2

const CATEGORY_OPTIONS = [
  { value: '部活動', label: '部活動' },
  { value: 'アルバイト', label: 'アルバイト' },
  { value: '研究', label: '研究' },
  { value: 'ボランティア', label: 'ボランティア' },
  { value: 'その他', label: 'その他' },
] as const

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Step 1 state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [rawNotes, setRawNotes] = useState('')

  const progress = (currentStep / TOTAL_STEPS) * 100

  const handleCreateExperience = () => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await quickCreateExperience({ title, category, rawNotes })
        if ('error' in result) {
          setError(result.error)
          return
        }
        setCurrentStep(2)
      } catch (err) {
        setError(err instanceof Error ? err.message : '経験の登録に失敗しました')
      }
    })
  }

  const handleComplete = () => {
    startTransition(async () => {
      try {
        const result = await completeOnboarding()
        if (!result.success) {
          setError(result.error || 'オンボーディングの完了に失敗しました')
          return
        }
        router.push('/dashboard')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました')
      }
    })
  }

  const isStep1Valid = title.trim() !== '' && category !== '' && rawNotes.trim() !== ''

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} / {TOTAL_STEPS}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        {currentStep === 1 && (
          <StepQuickExperience
            title={title}
            category={category}
            rawNotes={rawNotes}
            onTitleChange={setTitle}
            onCategoryChange={setCategory}
            onRawNotesChange={setRawNotes}
          />
        )}
        {currentStep === 2 && <StepComplete />}

        {error && (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        )}

        <div className="mt-6 flex items-center justify-end">
          {currentStep === 1 && (
            <Button
              onClick={handleCreateExperience}
              disabled={!isStep1Valid || isPending}
            >
              {isPending ? '登録中...' : '経験を登録して次へ'}
            </Button>
          )}
          {currentStep === 2 && (
            <Button
              onClick={handleComplete}
              disabled={isPending}
            >
              {isPending ? '処理中...' : 'ダッシュボードへ'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function StepQuickExperience({
  title,
  category,
  rawNotes,
  onTitleChange,
  onCategoryChange,
  onRawNotesChange,
}: {
  title: string
  category: string
  rawNotes: string
  onTitleChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onRawNotesChange: (v: string) => void
}) {
  return (
    <div className="space-y-4">
      <CardTitle className="text-xl">経験をクイック登録</CardTitle>
      <CardDescription>
        一番自信のある経験を、まず1つ登録してみましょう。
      </CardDescription>

      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="experience-title">タイトル</Label>
          <Input
            id="experience-title"
            placeholder="例: サッカー部の部長"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            maxLength={200}
          />
        </div>

        <div className="space-y-2">
          <Label>カテゴリ</Label>
          <RadioGroup value={category} onValueChange={onCategoryChange} className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center">
                <RadioGroupItem
                  value={option.value}
                  id={`cat-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`cat-${option.value}`}
                  className="cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-accent"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience-notes">どんな経験か、簡単に教えてください</Label>
          <Textarea
            id="experience-notes"
            placeholder="例: 大学2年から4年までサッカー部の部長を務め、チームの練習メニューを改革して地区大会で優勝しました。"
            value={rawNotes}
            onChange={(e) => onRawNotesChange(e.target.value)}
            rows={5}
            maxLength={10000}
          />
        </div>
      </div>
    </div>
  )
}

function StepComplete() {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <CardTitle className="text-xl">経験が登録されました!</CardTitle>
      <CardDescription>
        ダッシュボードでES作成や面接練習を始めましょう。
      </CardDescription>
    </div>
  )
}
