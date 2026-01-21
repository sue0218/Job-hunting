'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, Loader2, Save } from 'lucide-react'
import Link from 'next/link'

interface EsDocument {
  id: string
  companyName: string
  question: string
  content: string
  charLimit: number
  experienceIds: string[]
  status: 'draft' | 'completed'
  createdAt: string
  updatedAt: string
}

interface Experience {
  id: string
  title: string
  category?: string
  situation?: string
  task?: string
  action?: string
  result?: string
  skills?: string[]
}

export default function EditEsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [formData, setFormData] = useState({
    companyName: '',
    question: '',
    charLimit: 400,
    content: '',
  })

  useEffect(() => {
    const storedDocs = localStorage.getItem('esDocuments')
    if (storedDocs) {
      const documents: EsDocument[] = JSON.parse(storedDocs)
      const found = documents.find(doc => doc.id === id)
      if (found) {
        setFormData({
          companyName: found.companyName,
          question: found.question,
          charLimit: found.charLimit,
          content: found.content,
        })
        setSelectedExperiences(found.experienceIds || [])
      }
    }

    const storedExps = localStorage.getItem('experiences')
    if (storedExps) {
      setExperiences(JSON.parse(storedExps))
    }

    setIsLoading(false)
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleExperience = (expId: string) => {
    setSelectedExperiences(prev =>
      prev.includes(expId) ? prev.filter(x => x !== expId) : [...prev, expId]
    )
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

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const selectedExps = experiences.filter(exp => selectedExperiences.includes(exp.id))
    const mainExp = selectedExps[0]

    let generatedContent = ''

    if (formData.question.includes('力を入れた') || formData.question.includes('ガクチカ')) {
      generatedContent = `私が学生時代に最も力を入れたことは${mainExp.title}です。\n\n`
      if (mainExp.situation) generatedContent += `${mainExp.situation}\n\n`
      if (mainExp.task) generatedContent += `そこで私は${mainExp.task}という課題に直面しました。\n\n`
      if (mainExp.action) generatedContent += `この課題に対して、${mainExp.action}\n\n`
      if (mainExp.result) generatedContent += `その結果、${mainExp.result}`
    } else if (formData.question.includes('自己PR') || formData.question.includes('強み')) {
      const skills = mainExp.skills?.join('、') || 'リーダーシップ'
      generatedContent = `私の強みは${skills}です。\n\n`
      generatedContent += `${mainExp.title}の経験を通じて、この強みを培いました。\n\n`
      if (mainExp.action) generatedContent += `具体的には、${mainExp.action}\n\n`
      if (mainExp.result) generatedContent += `この経験から、${mainExp.result}`
    } else {
      generatedContent = `${mainExp.title}の経験についてお話しします。\n\n`
      if (mainExp.situation) generatedContent += `${mainExp.situation}\n\n`
      if (mainExp.task) generatedContent += `${mainExp.task}\n\n`
      if (mainExp.action) generatedContent += `${mainExp.action}\n\n`
      if (mainExp.result) generatedContent += `${mainExp.result}`
    }

    if (generatedContent.length > formData.charLimit) {
      generatedContent = generatedContent.slice(0, formData.charLimit - 3) + '...'
    }

    setFormData(prev => ({ ...prev, content: generatedContent }))
    setIsGenerating(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const stored = localStorage.getItem('esDocuments')
      if (stored) {
        const documents: EsDocument[] = JSON.parse(stored)
        const updated = documents.map(doc => {
          if (doc.id === id) {
            return {
              ...doc,
              ...formData,
              charLimit: Number(formData.charLimit),
              experienceIds: selectedExperiences,
              status: formData.content.length > 0 ? 'completed' : 'draft',
              updatedAt: new Date().toISOString(),
            }
          }
          return doc
        })
        localStorage.setItem('esDocuments', JSON.stringify(updated))
      }
      router.push(`/es/${id}`)
    } catch (error) {
      console.error('Failed to update ES:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const charCount = formData.content.length
  const charPercentage = formData.charLimit > 0 ? Math.round((charCount / formData.charLimit) * 100) : 0

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href={`/es/${id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          詳細に戻る
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ESを編集</h1>
        <p className="text-gray-500">内容を編集してESを改善しましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>企業名と設問を編集できます</CardDescription>
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
                  >
                    <Checkbox
                      checked={selectedExperiences.includes(exp.id)}
                      onCheckedChange={() => toggleExperience(exp.id)}
                    />
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

        {/* Edit Content */}
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
                    AIで再生成
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              AIで再生成するか、直接編集できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              id="content"
              name="content"
              placeholder="ESの内容を入力..."
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
          <Link href={`/es/${id}`}>
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
                更新する
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
