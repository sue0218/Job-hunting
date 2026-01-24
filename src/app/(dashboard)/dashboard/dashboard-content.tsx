'use client'

import { useState, useTransition } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, FileText, MessageSquare, TrendingUp, Crown, Plus, ArrowRight, AlertTriangle, CheckCircle, Loader2, RefreshCw, Star, Clock, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { isAdminEmail, getEffectivePlan, getPlanLimits, isOnTrial } from '@/lib/config/admin'
import { runConsistencyCheck } from '@/lib/actions/consistency-checks'
import type { ConsistencyCheckResult } from '@/lib/llm/consistency-service'
import { TrialBanner } from '@/components/trial'

interface RecentInterview {
  id: string
  title: string | null
  rating: number | null
  status: string
  createdAt: Date
}

interface RecentEs {
  id: string
  title: string
  companyName: string | null
  status: string
  createdAt: Date
}

interface DashboardContentProps {
  experienceCount: number
  esCount: number
  interviewCount: number
  consistencyCheck: {
    result: ConsistencyCheckResult | null
    checkedAt: Date | null
  }
  averageRating: number | null
  completedInterviewCount: number
  recentInterviews: RecentInterview[]
  recentEs: RecentEs[]
  trialEndsAt: Date | null
  hasCompletedFeedback: boolean
  dbPlan: 'free' | 'standard'
}

export function DashboardContent({
  experienceCount,
  esCount,
  interviewCount,
  consistencyCheck,
  averageRating,
  completedInterviewCount,
  recentInterviews,
  recentEs,
  trialEndsAt,
  hasCompletedFeedback,
  dbPlan,
}: DashboardContentProps) {
  const { user, isLoaded } = useUser()
  const [isPending, startTransition] = useTransition()
  const [checkResult, setCheckResult] = useState(consistencyCheck.result)
  const [lastCheckedAt, setLastCheckedAt] = useState(consistencyCheck.checkedAt)

  const email = user?.primaryEmailAddress?.emailAddress
  const effectivePlan = getEffectivePlan(email, dbPlan, trialEndsAt)
  const isAdmin = isAdminEmail(email)
  const limits = getPlanLimits(email, dbPlan, trialEndsAt)
  const onTrial = isOnTrial(trialEndsAt)

  const handleRunCheck = () => {
    startTransition(async () => {
      const result = await runConsistencyCheck()
      setCheckResult(result)
      setLastCheckedAt(new Date())
    })
  }

  if (!isLoaded) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  const hasIssues = checkResult?.hasIssues || false
  const issueCount = checkResult?.issues?.length || 0

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          {effectivePlan === 'standard' && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
              <Crown className="mr-1 h-3 w-3" />
              Standard
            </Badge>
          )}
          {isAdmin && (
            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
              管理者
            </Badge>
          )}
        </div>
        <p className="text-gray-500">
          {user?.firstName ? `${user.firstName}さん、` : ''}就活の進捗状況を確認しましょう
        </p>
      </div>

      {/* Trial Banner */}
      {onTrial && (
        <div className="mb-6">
          <TrialBanner
            trialEndsAt={trialEndsAt}
            hasCompletedFeedback={hasCompletedFeedback}
          />
        </div>
      )}

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">経験DB</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {experienceCount} / {limits.experiences === Infinity ? '∞' : limits.experiences}
            </div>
            {limits.experiences !== Infinity && (
              <Progress
                value={(experienceCount / limits.experiences) * 100}
                className="mt-2 h-2"
              />
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {effectivePlan === 'standard' ? 'Standard: 無制限' : 'Freeプラン上限'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ES作成</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{esCount} / {limits.esGenerationsPerMonth}</div>
            <Progress
              value={(esCount / limits.esGenerationsPerMonth) * 100}
              className="mt-2 h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">今月の使用回数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">面接練習</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewCount} / {limits.interviewSessionsPerMonth}</div>
            <Progress
              value={(interviewCount / limits.interviewSessionsPerMonth) * 100}
              className="mt-2 h-2"
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">今月の使用回数</p>
              {averageRating !== null && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">平均</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">整合性</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {checkResult ? (
              <>
                <div className={`text-2xl font-bold ${hasIssues ? 'text-yellow-600' : 'text-green-600'}`}>
                  {hasIssues ? `${issueCount}件の指摘` : '良好'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {lastCheckedAt ? `最終チェック: ${new Date(lastCheckedAt).toLocaleDateString('ja-JP')}` : ''}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-gray-400">未チェック</div>
                <p className="text-xs text-muted-foreground">チェックを実行してください</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Consistency Check Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">整合性チェック</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRunCheck}
            disabled={isPending || experienceCount === 0}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                チェック中...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                チェック実行
              </>
            )}
          </Button>
        </div>

        {checkResult ? (
          hasIssues ? (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  {issueCount}件の整合性の問題が見つかりました
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checkResult.issues.map((issue, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={
                        issue.severity === 'high' ? 'destructive' :
                        issue.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {issue.severity === 'high' ? '重要' :
                         issue.severity === 'medium' ? '中' : '軽微'}
                      </Badge>
                      <span className="text-sm font-medium">
                        {issue.type === 'contradiction' ? '矛盾' :
                         issue.type === 'inconsistency' ? '不整合' :
                         issue.type === 'missing_detail' ? '詳細不足' : '誇張'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{issue.description}</p>
                    <p className="text-sm text-blue-600 mt-1">💡 {issue.suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">整合性に問題はありません</p>
                    <p className="text-sm text-green-600">
                      経験DB、ES、面接回答の間に矛盾は見つかりませんでした。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                {experienceCount === 0
                  ? '経験を登録すると整合性チェックを実行できます'
                  : '「チェック実行」ボタンを押すと、経験DB・ES・面接回答の整合性をAIがチェックします'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">今日のおすすめタスク</h2>
        {experienceCount === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>経験DBを作成しましょう</CardTitle>
              <CardDescription>
                まずは自分の経験を整理することから始めましょう。部活動、アルバイト、研究活動など、あなたの経験をSTAR形式で登録できます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/experiences/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  経験を登録する
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : experienceCount < 3 ? (
          <Card>
            <CardHeader>
              <CardTitle>もう少し経験を追加しましょう</CardTitle>
              <CardDescription>
                3つ以上の経験を登録すると、より効果的なES作成や面接対策ができます。現在{experienceCount}件の経験が登録されています。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href="/experiences/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  経験を追加
                </Button>
              </Link>
              <Link href="/experiences">
                <Button variant="outline">
                  一覧を見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>ESを作成してみましょう</CardTitle>
              <CardDescription>
                {experienceCount}件の経験が登録されています。AIを使って、あなたの経験をもとにESを自動生成してみましょう。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link href="/es/new">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  ES作成を始める
                </Button>
              </Link>
              <Link href="/experiences">
                <Button variant="outline">
                  経験を編集
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      {(recentInterviews.length > 0 || recentEs.length > 0) && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Interviews */}
          {recentInterviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4" />
                  最近の面接練習
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentInterviews.slice(0, 3).map((interview) => (
                  <Link
                    key={interview.id}
                    href={`/interview/${interview.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {interview.title || '面接練習'}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(interview.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {interview.status === 'completed' && interview.rating && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= interview.rating!
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <Badge variant={interview.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {interview.status === 'completed' ? '完了' : '進行中'}
                      </Badge>
                    </div>
                  </Link>
                ))}
                {recentInterviews.length > 3 && (
                  <Link href="/interview" className="block text-center text-sm text-primary hover:underline pt-2">
                    すべて見る →
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Recent ES */}
          {recentEs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  最近のES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentEs.slice(0, 3).map((es) => (
                  <Link
                    key={es.id}
                    href={`/es/${es.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{es.title}</p>
                      {es.companyName && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {es.companyName}
                        </p>
                      )}
                    </div>
                    <Badge variant={es.status === 'final' ? 'default' : 'secondary'} className="text-xs">
                      {es.status === 'final' ? '完成' : '下書き'}
                    </Badge>
                  </Link>
                ))}
                {recentEs.length > 3 && (
                  <Link href="/es" className="block text-center text-sm text-primary hover:underline pt-2">
                    すべて見る →
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
