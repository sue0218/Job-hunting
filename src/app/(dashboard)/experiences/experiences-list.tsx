'use client'

import { useState, useTransition } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ExperienceCard } from '@/components/experiences/experience-card'
import { getEffectivePlan, getPlanLimits } from '@/lib/config/admin'
import { deleteExperience } from '@/lib/actions/experiences'
import type { Experience } from '@/lib/db/schema'

interface ExperiencesListProps {
  initialExperiences: Experience[]
}

export function ExperiencesList({ initialExperiences }: ExperiencesListProps) {
  const { user } = useUser()
  const [experiences, setExperiences] = useState(initialExperiences)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const email = user?.primaryEmailAddress?.emailAddress
  const effectivePlan = getEffectivePlan(email)
  const limits = getPlanLimits(email)
  const isLimitReached = effectivePlan === 'free' && experiences.length >= limits.experiences

  const handleDelete = async (id: string) => {
    if (!confirm('この経験を削除しますか？')) return

    startTransition(async () => {
      const success = await deleteExperience(id)
      if (success) {
        setExperiences(prev => prev.filter(exp => exp.id !== id))
      }
    })
  }

  const filteredExperiences = experiences.filter(exp => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      exp.title.toLowerCase().includes(query) ||
      exp.category?.toLowerCase().includes(query) ||
      exp.skills?.some(skill => skill.toLowerCase().includes(query)) ||
      exp.situation?.toLowerCase().includes(query) ||
      exp.task?.toLowerCase().includes(query) ||
      exp.action?.toLowerCase().includes(query) ||
      exp.result?.toLowerCase().includes(query)
    )
  })

  // Convert DB Experience to ExperienceCard format
  const formatExperience = (exp: Experience) => ({
    id: exp.id,
    title: exp.title,
    category: exp.category ?? undefined,
    periodStart: exp.periodStart ?? undefined,
    periodEnd: exp.periodEnd ?? undefined,
    situation: exp.situation ?? undefined,
    task: exp.task ?? undefined,
    action: exp.action ?? undefined,
    result: exp.result ?? undefined,
    skills: exp.skills ?? undefined,
    rawNotes: exp.rawNotes ?? undefined,
    createdAt: exp.createdAt.toISOString(),
    updatedAt: exp.updatedAt.toISOString(),
  })

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">経験DB</h1>
          <p className="text-gray-500">
            あなたの経験をSTAR形式で管理 ・{' '}
            <span className={isLimitReached ? 'text-red-500 font-medium' : ''}>
              {experiences.length} / {limits.experiences === Infinity ? '∞' : limits.experiences} 件
            </span>
          </p>
        </div>
        <Link href="/experiences/new">
          <Button disabled={isLimitReached || isPending}>
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </Link>
      </div>

      {isLimitReached && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-yellow-800">
              Freeプランの上限（{limits.experiences}件）に達しました。
              <Link href="/billing" className="ml-2 underline font-medium">
                Standardプランにアップグレード
              </Link>
              すると無制限に登録できます。
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      {experiences.length > 0 && (
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="経験を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Experience List */}
      {filteredExperiences.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExperiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={formatExperience(experience)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : experiences.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              「{searchQuery}」に一致する経験が見つかりません
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>経験を登録しましょう</CardTitle>
            <CardDescription>
              部活動、アルバイト、研究活動など、あなたの経験をSTAR形式（状況・課題・行動・結果）で整理できます。
              ESや面接で使える「自分の強み」を可視化しましょう。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="text-6xl">📝</div>
              <p className="text-gray-500">まだ経験が登録されていません</p>
              <Link href="/experiences/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  最初の経験を登録する
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
