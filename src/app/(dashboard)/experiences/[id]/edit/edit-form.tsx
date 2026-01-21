'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { updateExperience } from '@/lib/actions/experiences'
import type { Experience } from '@/lib/db/schema'

const CATEGORIES = [
  '部活動・サークル',
  'アルバイト',
  'インターン',
  '研究・ゼミ',
  'ボランティア',
  '留学',
  '資格取得',
  'その他',
]

interface EditExperienceFormProps {
  experience: Experience
}

export function EditExperienceForm({ experience }: EditExperienceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    title: experience.title || '',
    category: experience.category || '',
    periodStart: experience.periodStart || '',
    periodEnd: experience.periodEnd || '',
    situation: experience.situation || '',
    task: experience.task || '',
    action: experience.action || '',
    result: experience.result || '',
    skills: experience.skills?.join(', ') || '',
    rawNotes: experience.rawNotes || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        await updateExperience(experience.id, {
          title: formData.title,
          category: formData.category || null,
          periodStart: formData.periodStart || null,
          periodEnd: formData.periodEnd || null,
          situation: formData.situation || null,
          task: formData.task || null,
          action: formData.action || null,
          result: formData.result || null,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : null,
          rawNotes: formData.rawNotes || null,
        })
        router.push(`/experiences/${experience.id}`)
      } catch (error) {
        console.error('Failed to update experience:', error)
        alert('経験の更新に失敗しました')
      }
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href={`/experiences/${experience.id}`} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          詳細に戻る
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">経験を編集</h1>
        <p className="text-gray-500">STAR形式であなたの経験を整理しましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>経験のタイトルとカテゴリを入力してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル *</Label>
              <Input
                id="title"
                name="title"
                placeholder="例: サッカー部での主将経験"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">カテゴリ</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">選択してください</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">スキル・キーワード</Label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="例: リーダーシップ, チームワーク, 問題解決"
                  value={formData.skills}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500">カンマ区切りで入力</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="periodStart">開始時期</Label>
                <Input
                  id="periodStart"
                  name="periodStart"
                  type="month"
                  value={formData.periodStart}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodEnd">終了時期</Label>
                <Input
                  id="periodEnd"
                  name="periodEnd"
                  type="month"
                  value={formData.periodEnd}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* STAR Format */}
        <Card>
          <CardHeader>
            <CardTitle>STAR形式で記述</CardTitle>
            <CardDescription>
              状況(Situation)→課題(Task)→行動(Action)→結果(Result)の流れで経験を整理します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="situation" className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">S</span>
                状況 (Situation)
              </Label>
              <Textarea
                id="situation"
                name="situation"
                placeholder="どのような状況・背景があったか？組織の規模、あなたの役割など"
                value={formData.situation}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task" className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">T</span>
                課題 (Task)
              </Label>
              <Textarea
                id="task"
                name="task"
                placeholder="どのような課題・目標があったか？具体的な数値目標があれば記載"
                value={formData.task}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action" className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-600">A</span>
                行動 (Action)
              </Label>
              <Textarea
                id="action"
                name="action"
                placeholder="課題に対してどのような行動を取ったか？具体的な工夫やアプローチを記載"
                value={formData.action}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="result" className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">R</span>
                結果 (Result)
              </Label>
              <Textarea
                id="result"
                name="result"
                placeholder="どのような結果・成果が得られたか？数値で示せる成果があれば記載"
                value={formData.result}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>メモ（任意）</CardTitle>
            <CardDescription>面接で話したいポイントなど、自由にメモを残せます</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="rawNotes"
              name="rawNotes"
              placeholder="面接で強調したいポイント、質問されそうな点など"
              value={formData.rawNotes}
              onChange={handleChange}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href={`/experiences/${experience.id}`}>
            <Button variant="outline" type="button">キャンセル</Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
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
