'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash2, Building2, Clock, FileText } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

interface EsCardProps {
  document: EsDocument
  onDelete: (id: string) => void
}

export function EsCard({ document, onDelete }: EsCardProps) {
  const charCount = document.content.length
  const charPercentage = Math.round((charCount / document.charLimit) * 100)

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 flex-1 min-w-0">
          <CardTitle className="text-lg font-semibold">
            <Link href={`/es/${document.id}`} className="hover:text-primary line-clamp-1">
              {document.companyName}
            </Link>
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant={document.status === 'completed' ? 'default' : 'secondary'}>
              {document.status === 'completed' ? '完成' : '下書き'}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(document.updatedAt).toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/es/${document.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                編集
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(document.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        {/* Question */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 line-clamp-2">
            {document.question}
          </p>
        </div>

        {/* Character Count */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>文字数</span>
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

        {/* Preview */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {document.content || '(内容がありません)'}
        </p>
      </CardContent>
    </Card>
  )
}
