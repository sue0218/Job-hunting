'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, Loader2, Save, ChevronDown, ChevronUp, Lightbulb, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { createEsDocument } from '@/lib/actions/es-documents'
import { generateES } from '@/lib/llm/es-service'
import type { Experience } from '@/lib/db/schema'

interface NewEsFormProps {
  experiences: Experience[]
}

const COMMON_QUESTIONS = [
  '学生時代に力を入れたことを教えてください',
  '自己PRをしてください',
  'あなたの強みを教えてください',
  '挫折経験とそれをどう乗り越えたか教えてください',
  'チームで取り組んだ経験を教えてください',
  '志望動機を教えてください',
]

export function NewEsForm({ experiences }: NewEsFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [showCommonQuestions, setShowCommonQuestions] = useState(false)
  const [error, setError] = useState<{ message: string; isQuotaError: boolean } | null>(null)
  const [formData, setFormData] = useState({
    companyName: '',
    question: '',
    charLimit: 400,
    content: '',
    additionalContext: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleExperience = (id: string) => {
    setSelectedExperiences(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSelectQuestion = (question: string) => {
    setFormData(prev => ({ ...prev, question }))
    setShowCommonQuestions(false)
  }

  const handleGenerate = async () => {
    if (selectedExperiences.length === 0) {
      alert('経験を1つ以上選択してください')
      return
    }
    if (!formData.question) {
      alert('設問を入力してください')
      return
    }

    setIsGenerating(true)

    try {
      const selectedExps = experiences.filter(exp => selectedExperiences.includes(exp.id))

      const content = await generateES({
        question: formData.question,
        charLimit: formData.charLimit,
        experiences: selectedExps.map(exp => ({
          title: exp.title,
          situation: exp.situation,
          task: exp.task,
          action: exp.action,
          result: exp.result,
          skills: exp.skills,
        })),
        additionalContext: formData.additionalContext || undefined,
      })

      setFormData(prev => ({ ...prev, content }))
    } catch (error) {
      console.error('Failed to generate ES:', error)
      alert('ES生成に失敗しました。もう一度お試しください。')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await createEsDocument({
        title: `${formData.companyName} - ${formData.question.slice(0, 30)}...`,
        companyName: formData.companyName,
        question: formData.question,
        charLimit: Number(formData.charLimit),
        generatedContent: formData.content,
        editedContent: formData.content,
        experienceIds: selectedExperiences,
        status: formData.content.length > 0 ? 'final' : 'draft',
      })

      router.push('/es')
    } catch (err) {
      console.error('Failed to save ES:', err)
      const errorMessage = err instanceof Error ? err.message : '保存に失敗しました'
      const isQuotaError = errorMessage.includes('上限')
      setError({ message: errorMessage, isQuotaError })
    } finally {
      setIsSubmitting(false)
    }
  }

  const charCount = formData.content.length
  const charPercentage = formData.charLimit > 0 ? Math.round((charCount / formData.charLimit) * 100) : 0

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/es" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          ES一覧に戻る
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ES作成</h1>
        <p className="text-gray-500">経験DBを基にAIがESを自動生成します</p>
      </div>

      {error && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${error.isQuotaError ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
          <AlertCircle className={`h-5 w-5 mt-0.5 ${error.isQuotaError ? 'text-amber-600' : 'text-red-600'}`} />
          <div className="flex-1">
            <p className={`font-medium ${error.isQuotaError ? 'text-amber-800' : 'text-red-800'}`}>
              {error.message}
            </p>
            {error.isQuotaError && (
              <p className="mt-1 text-sm text-amber-700">
                Standardプランにアップグレードすると、より多くのESを生成できます。
                <Link href="/billing" className="ml-1 underline font-medium">
                  プランを確認する
                </Link>
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>企業名と設問を入力してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">企業名 *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="例: 株式会社○○"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">設問 *</Label>
              <Textarea
                id="question"
                name="question"
                placeholder="例: 学生時代に力を入れたことを教えてください"
                value={formData.question}
                onChange={handleChange}
                rows={2}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setShowCommonQuestions(!showCommonQuestions)}
              >
                {showCommonQuestions ? <ChevronUp className="mr-1 h-3 w-3" /> : <ChevronDown className="mr-1 h-3 w-3" />}
                よくある設問から選ぶ
              </Button>
              {showCommonQuestions && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {COMMON_QUESTIONS.map((q) => (
                    <Badge
                      key={q}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectQuestion(q)}
                    >
                      {q}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="charLimit">文字数上限</Label>
              <Input
                id="charLimit"
                name="charLimit"
                type="number"
                min={100}
                max={2000}
                value={formData.charLimit}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Experience Selection */}
        <Card>
          <CardHeader>
            <CardTitle>使用する経験</CardTitle>
            <CardDescription>
              ESに使用する経験を選択してください（複数選択可）
            </CardDescription>
          </CardHeader>
          <CardContent>
            {experiences.length > 0 ? (
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedExperiences.includes(exp.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleExperience(exp.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleExperience(exp.id)
                      }
                    }}
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-primary">
                      {selectedExperiences.includes(exp.id) && (
                        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{exp.title}</p>
                      {exp.category && (
                        <Badge variant="secondary" className="mt-1">
                          {exp.category}
                        </Badge>
                      )}
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exp.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">経験が登録されていません</p>
                <Link href="/experiences/new">
                  <Button variant="outline">経験を登録する</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              AIへの追加指示（任意）
            </CardTitle>
            <CardDescription>
              必ず含めたい要素や、強調したいポイントがあれば入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="additionalContext"
              name="additionalContext"
              placeholder="例：&#10;・なぜこの活動を始めたのか（原体験）を必ず入れてほしい&#10;・リーダーシップをアピールしたい&#10;・チームワークの観点を強調してほしい&#10;・具体的な数字「売上30%向上」を必ず含めてほしい"
              value={formData.additionalContext}
              onChange={handleChange}
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Generate & Edit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>ES本文</span>
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || selectedExperiences.length === 0}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AIで生成
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              AIで生成した後、自由に編集できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              id="content"
              name="content"
              placeholder="AIで生成するか、直接入力してください..."
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="font-mono"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {charCount} / {formData.charLimit}文字 ({charPercentage}%)
              </span>
              {charCount > formData.charLimit && (
                <span className="text-red-500 font-medium">
                  文字数オーバー！
                </span>
              )}
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  charPercentage > 100 ? 'bg-red-500' :
                  charPercentage >= 80 ? 'bg-green-500' :
                  charPercentage >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
                style={{ width: `${Math.min(charPercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/es">
            <Button variant="outline" type="button">キャンセル</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存する
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
