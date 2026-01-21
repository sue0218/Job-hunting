'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pencil, Trash2, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { deleteExperience } from '@/lib/actions/experiences'
import type { Experience } from '@/lib/db/schema'

interface ExperienceDetailProps {
  experience: Experience
}

export function ExperienceDetail({ experience }: ExperienceDetailProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('この経験を削除しますか？')) return

    startTransition(async () => {
      const success = await deleteExperience(experience.id)
      if (success) {
        router.push('/experiences')
      }
    })
  }

  const formatPeriod = () => {
    if (!experience.periodStart && !experience.periodEnd) return null
    const start = experience.periodStart
      ? new Date(experience.periodStart).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
      : ''
    const end = experience.periodEnd
      ? new Date(experience.periodEnd).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
      : '現在'
    return `${start} 〜 ${end}`
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/experiences" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          経験一覧に戻る
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{experience.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            {experience.category && (
              <Badge variant="secondary">{experience.category}</Badge>
            )}
            {formatPeriod() && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatPeriod()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/experiences/${experience.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              編集
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            <Trash2 className="mr-2 h-4 w-4" />
            {isPending ? '削除中...' : '削除'}
          </Button>
        </div>
      </div>

      {/* Skills */}
      {experience.skills && experience.skills.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {experience.skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {/* STAR Content */}
      <div className="space-y-6">
        {experience.situation && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">S</span>
                状況 (Situation)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700">{experience.situation}</p>
            </CardContent>
          </Card>
        )}

        {experience.task && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">T</span>
                課題 (Task)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700">{experience.task}</p>
            </CardContent>
          </Card>
        )}

        {experience.action && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-sm font-bold text-yellow-600">A</span>
                行動 (Action)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700">{experience.action}</p>
            </CardContent>
          </Card>
        )}

        {experience.result && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">R</span>
                結果 (Result)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700">{experience.result}</p>
            </CardContent>
          </Card>
        )}

        {experience.rawNotes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">メモ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700">{experience.rawNotes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Timestamps */}
      <div className="mt-8 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          作成: {new Date(experience.createdAt).toLocaleString('ja-JP')}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          更新: {new Date(experience.updatedAt).toLocaleString('ja-JP')}
        </span>
      </div>
    </div>
  )
}
