'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Pencil, Trash2, Building2, Clock, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { deleteEsDocument } from '@/lib/actions/es-documents'
import type { EsDocument, Experience } from '@/lib/db/schema'

interface EsDetailContentProps {
  document: EsDocument
  experiences: Experience[]
}

export function EsDetailContent({ document, experiences }: EsDetailContentProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('このESを削除しますか？')) return
    setIsDeleting(true)
    try {
      await deleteEsDocument(document.id)
      router.push('/es')
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('削除に失敗しました')
      setIsDeleting(false)
    }
  }

  const handleCopy = async () => {
    const content = document.editedContent || document.generatedContent
    if (content) {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getLinkedExperiences = () => {
    if (!document.experienceIds) return []
    return experiences.filter(exp => document.experienceIds?.includes(exp.id))
  }

  const content = document.editedContent || document.generatedContent || ''
  const charCount = content.length
  const charPercentage = document.charLimit ? Math.round((charCount / document.charLimit) * 100) : 0

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/es" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="mr-1 h-4 w-4" />
          ES一覧に戻る
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">{document.companyName || document.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <Badge variant={document.status === 'final' ? 'default' : 'secondary'}>
              {document.status === 'final' ? '完成' : '下書き'}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              更新: {new Date(document.updatedAt).toLocaleString('ja-JP')}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/es/${document.id}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              編集
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? '削除中...' : '削除'}
          </Button>
        </div>
      </div>

      {/* Question */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">設問</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{document.question}</p>
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">回答</CardTitle>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  コピー済み
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  コピー
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-gray-700 mb-4">{content || '(内容がありません)'}</p>

          {/* Character Count */}
          {document.charLimit && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">文字数</span>
                <span className={charPercentage > 100 ? 'text-red-500 font-medium' : ''}>
                  {charCount} / {document.charLimit}文字 ({charPercentage}%)
                </span>
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Linked Experiences */}
      {getLinkedExperiences().length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">使用した経験</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getLinkedExperiences().map((exp) => (
                <Link key={exp.id} href={`/experiences/${exp.id}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                    {exp.title}
                    {exp.category && ` (${exp.category})`}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timestamps */}
      <div className="mt-8 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          作成: {new Date(document.createdAt).toLocaleString('ja-JP')}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          更新: {new Date(document.updatedAt).toLocaleString('ja-JP')}
        </span>
      </div>
    </div>
  )
}
