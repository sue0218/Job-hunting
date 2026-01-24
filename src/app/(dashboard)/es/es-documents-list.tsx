'use client'

import { useState, useTransition } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Building2, Clock, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { getEffectivePlan, getPlanLimits } from '@/lib/config/admin'
import { deleteEsDocument } from '@/lib/actions/es-documents'
import type { EsDocument } from '@/lib/db/schema'

interface EsDocumentsListProps {
  initialDocuments: EsDocument[]
  trialEndsAt: Date | null
  dbPlan: 'free' | 'standard'
}

export function EsDocumentsList({ initialDocuments, trialEndsAt, dbPlan }: EsDocumentsListProps) {
  const { user } = useUser()
  const [esDocuments, setEsDocuments] = useState(initialDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const email = user?.primaryEmailAddress?.emailAddress
  const effectivePlan = getEffectivePlan(email, dbPlan, trialEndsAt)
  const limits = getPlanLimits(email, dbPlan, trialEndsAt)

  // Count this month's ES generations
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)
  const monthlyCount = esDocuments.filter(
    doc => new Date(doc.createdAt) >= thisMonth
  ).length
  const isLimitReached = effectivePlan === 'free' && monthlyCount >= limits.esGenerationsPerMonth

  const handleDelete = (id: string) => {
    if (!confirm('このESを削除しますか？')) return

    startTransition(async () => {
      const success = await deleteEsDocument(id)
      if (success) {
        setEsDocuments(prev => prev.filter(doc => doc.id !== id))
      }
    })
  }

  const filteredDocuments = esDocuments.filter(doc => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const content = doc.editedContent || doc.generatedContent || ''
    return (
      (doc.companyName?.toLowerCase().includes(query) || false) ||
      doc.question.toLowerCase().includes(query) ||
      content.toLowerCase().includes(query)
    )
  })

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ES作成</h1>
          <p className="text-gray-500">
            経験DBを基にESを自動生成 ・{' '}
            <span className={isLimitReached ? 'text-red-500 font-medium' : ''}>
              今月 {monthlyCount} / {limits.esGenerationsPerMonth} 回
            </span>
          </p>
        </div>
        <Link href="/es/new">
          <Button disabled={isLimitReached || isPending}>
            <Plus className="mr-2 h-4 w-4" />
            ES生成
          </Button>
        </Link>
      </div>

      {isLimitReached && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <p className="text-yellow-800">
              Freeプランの今月の上限（{limits.esGenerationsPerMonth}回）に達しました。
              <Link href="/billing" className="ml-2 underline font-medium">
                Standardプランにアップグレード
              </Link>
              すると月30回まで生成できます。
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      {esDocuments.length > 0 && (
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="ESを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* ES List */}
      {filteredDocuments.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <EsDocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
          ))}
        </div>
      ) : esDocuments.length > 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              「{searchQuery}」に一致するESが見つかりません
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>ESを作成しましょう</CardTitle>
            <CardDescription>
              企業名、設問、文字数を指定して、経験DBを基にESを自動生成できます。
              AIがあなたの経験から最適な内容を提案します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="text-6xl">📝</div>
              <p className="text-gray-500">まだESが作成されていません</p>
              <Link href="/es/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  最初のESを作成する
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EsDocumentCard({
  document,
  onDelete,
}: {
  document: EsDocument
  onDelete: (id: string) => void
}) {
  const content = document.editedContent || document.generatedContent || ''
  const charCount = content.length
  const charLimit = document.charLimit || 400
  const percentage = Math.round((charCount / charLimit) * 100)

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/es/${document.id}`} className="hover:text-primary">
              <CardTitle className="text-lg truncate">
                {document.companyName || document.title}
              </CardTitle>
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {document.question}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 text-red-500 shrink-0"
            onClick={() => onDelete(document.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant={document.status === 'final' ? 'default' : 'secondary'}>
              {document.status === 'final' ? '完成' : '下書き'}
            </Badge>
            {document.companyName && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {document.companyName}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{charCount} / {charLimit} 文字</span>
              <span>{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  percentage > 100 ? 'bg-red-500' :
                  percentage >= 80 ? 'bg-green-500' :
                  percentage >= 50 ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(document.updatedAt).toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
