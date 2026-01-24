'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { submitFeedback, FeedbackInput } from '@/lib/actions/feedback'
import { Loader2, Send, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

const BEST_FEATURES = [
  { value: 'experience_db', label: '経験DB（STAR形式）' },
  { value: 'es_generation', label: 'ES自動生成' },
  { value: 'interview_practice', label: 'AI面接練習' },
  { value: 'consistency_check', label: '整合性チェック' },
  { value: 'other', label: 'その他' },
]

export function FeedbackForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [nps, setNps] = useState<number | null>(null)
  const [satisfaction, setSatisfaction] = useState<number | null>(null)
  const [bestFeature, setBestFeature] = useState<string | null>(null)
  const [goodText, setGoodText] = useState('')
  const [improveText, setImproveText] = useState('')

  const handleSubmit = () => {
    setError(null)

    if (nps === null || satisfaction === null) {
      setError('NPSと満足度は必須です')
      return
    }

    const input: FeedbackInput = {
      nps,
      satisfaction,
      bestFeature: bestFeature ?? undefined,
      goodText: goodText || undefined,
      improveText: improveText || undefined,
    }

    startTransition(async () => {
      const result = await submitFeedback(input)
      if (result.success) {
        router.refresh()
      } else {
        setError(result.error || 'エラーが発生しました')
      }
    })
  }

  const isValid = nps !== null && satisfaction !== null

  return (
    <div className="space-y-6">
      {/* NPS Score */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">友人にこのサービスを薦める可能性は？ <span className="text-red-500">*</span></CardTitle>
          <CardDescription>0〜10で評価してください</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setNps(score)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
                  nps === score
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white hover:border-primary hover:bg-primary/5'
                )}
              >
                {score}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>薦めない</span>
            <span>とても薦める</span>
          </div>
        </CardContent>
      </Card>

      {/* Satisfaction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">全体的な満足度 <span className="text-red-500">*</span></CardTitle>
          <CardDescription>1〜5で評価してください</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setSatisfaction(score)}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg border text-lg font-medium transition-colors',
                  satisfaction === score
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white hover:border-primary hover:bg-primary/5'
                )}
              >
                {score === 1 ? '😞' : score === 2 ? '😕' : score === 3 ? '😐' : score === 4 ? '😊' : '😍'}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>不満</span>
            <span>とても満足</span>
          </div>
        </CardContent>
      </Card>

      {/* Best Feature */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">一番良いと思った機能</CardTitle>
          <CardDescription>該当するものを選んでください（任意）</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={bestFeature || ''} onValueChange={setBestFeature}>
            <div className="grid gap-3 sm:grid-cols-2">
              {BEST_FEATURES.map((feature) => (
                <div key={feature.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={feature.value} id={feature.value} />
                  <Label htmlFor={feature.value} className="cursor-pointer">
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Good Points */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">良かった点</CardTitle>
          <CardDescription>自由に書いてください（任意）</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="例: 面接練習の深堀り質問がリアルで練習になりました"
            value={goodText}
            onChange={(e) => setGoodText(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Improvements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">改善してほしい点</CardTitle>
          <CardDescription>自由に書いてください（任意）</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="例: もっと多くの企業の質問パターンが欲しい"
            value={improveText}
            onChange={(e) => setImproveText(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border bg-gradient-to-r from-primary/5 to-blue-50 p-4">
        <div className="flex items-center gap-2 text-sm">
          <Gift className="h-5 w-5 text-primary" />
          <span>回答すると<strong className="text-primary">+7日間</strong>無料期間が延長されます</span>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !isValid}
          className="min-w-[120px]"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              送信中...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              送信する
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
