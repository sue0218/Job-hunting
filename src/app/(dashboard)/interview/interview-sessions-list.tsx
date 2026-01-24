'use client'

import { useState, useTransition } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MessageSquare, Clock, Star, Trash2, Play } from 'lucide-react'
import Link from 'next/link'
import { getEffectivePlan, getPlanLimits } from '@/lib/config/admin'
import { deleteInterviewSession, type InterviewSessionWithTurns } from '@/lib/actions/interview-sessions'

interface InterviewSessionsListProps {
  initialSessions: InterviewSessionWithTurns[]
  monthlyCount: number
  trialEndsAt: Date | null
  dbPlan: 'free' | 'standard'
}

export function InterviewSessionsList({ initialSessions, monthlyCount, trialEndsAt, dbPlan }: InterviewSessionsListProps) {
  const { user } = useUser()
  const [sessions, setSessions] = useState(initialSessions)
  const [isPending, startTransition] = useTransition()

  const email = user?.primaryEmailAddress?.emailAddress
  const effectivePlan = getEffectivePlan(email, dbPlan, trialEndsAt)
  const limits = getPlanLimits(email, dbPlan, trialEndsAt)
  const isLimitReached = effectivePlan === 'free' && monthlyCount >= limits.interviewSessionsPerMonth

  const handleDelete = (id: string) => {
    if (!confirm('このセッションを削除しますか？')) return

    startTransition(async () => {
      const success = await deleteInterviewSession(id)
      if (success) {
        setSessions(prev => prev.filter(s => s.id !== id))
      }
    })
  }

  const getSessionTypeLabel = (session: InterviewSessionWithTurns) => {
    if (session.companyName) return session.companyName
    if (session.title) return session.title
    return '面接練習'
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">面接練習</h1>
          <p className="text-gray-500">
            AIと面接練習 ・{' '}
            <span className={isLimitReached ? 'text-red-500 font-medium' : ''}>
              今月 {monthlyCount} / {limits.interviewSessionsPerMonth} 回
            </span>
          </p>
        </div>
        <Link href="/interview/new">
          <Button disabled={isLimitReached || isPending}>
            <Plus className="mr-2 h-4 w-4" />
            セッション開始
          </Button>
        </Link>
      </div>

      {isLimitReached && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-yellow-800">
              Freeプランの今月の上限（{limits.interviewSessionsPerMonth}回）に達しました。
              <Link href="/billing" className="ml-2 underline font-medium">
                Standardプランにアップグレード
              </Link>
              すると月60回まで練習できます。
            </p>
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      {sessions.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">セッション履歴</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <Card key={session.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        <Link href={`/interview/${session.id}`} className="hover:text-primary">
                          {getSessionTypeLabel(session)}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                          {session.status === 'completed' ? '完了' : '進行中'}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(session.createdAt).toLocaleDateString('ja-JP')}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 text-red-500"
                      onClick={() => handleDelete(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {session.turns.length}ターン
                    </span>
                  </div>

                  {session.status === 'in_progress' ? (
                    <Link href={`/interview/${session.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        続ける
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/interview/${session.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        詳細を見る
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>面接練習を始めましょう</CardTitle>
            <CardDescription>
              AIが面接官役となり、経験DBやESを基にした質問を投げかけます。回答に対するフィードバックも受けられます。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="text-6xl">🎤</div>
              <p className="text-gray-500">まだセッション履歴がありません</p>
              <Link href="/interview/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  最初のセッションを開始
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
