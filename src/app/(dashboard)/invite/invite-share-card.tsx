'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check, Share2, Twitter, MessageCircle } from 'lucide-react'

interface InviteShareCardProps {
  inviteUrl: string
  inviteCode: string
}

export function InviteShareCard({ inviteUrl, inviteCode }: InviteShareCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input')
      input.value = inviteUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareText = `ガクチカバンクAIで就活準備中！経験をSTAR形式で整理して、ESも面接もブレずに対応できるよ。紹介リンクから登録すると+7日無料！`

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(inviteUrl)}`
    window.open(url, '_blank')
  }

  const handleLineShare = () => {
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(shareText + ' ' + inviteUrl)}`
    window.open(url, '_blank')
  }

  return (
    <Card className="mb-6 sm:mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-50">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          あなたの招待リンク
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
        {/* URL + Copy - スマホでは縦並び */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={inviteUrl}
            readOnly
            className="bg-white font-mono text-xs sm:text-sm"
          />
          <Button onClick={handleCopy} variant="outline" className="shrink-0 w-full sm:w-auto">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-600" />
                コピー済み
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                リンクをコピー
              </>
            )}
          </Button>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={handleTwitterShare} variant="outline" className="w-full">
            <Twitter className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">Twitter</span>
          </Button>
          <Button onClick={handleLineShare} variant="outline" className="w-full bg-[#00B900] text-white hover:bg-[#00A000] hover:text-white">
            <MessageCircle className="mr-2 h-4 w-4" />
            LINE
          </Button>
        </div>

        <p className="text-[10px] sm:text-xs text-muted-foreground text-center sm:text-left">
          招待コード: <code className="rounded bg-white px-1 sm:px-1.5 py-0.5 font-mono">{inviteCode}</code>
        </p>
      </CardContent>
    </Card>
  )
}
