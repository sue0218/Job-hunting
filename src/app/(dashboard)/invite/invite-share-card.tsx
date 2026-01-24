'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check, Share2 } from 'lucide-react'

// X (Twitter) icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// LINE icon
function LineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  )
}

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
          <Button onClick={handleTwitterShare} variant="outline" className="w-full bg-black text-white hover:bg-gray-800 hover:text-white">
            <XIcon className="mr-2 h-4 w-4 shrink-0" />
            <span>X</span>
          </Button>
          <Button onClick={handleLineShare} variant="outline" className="w-full bg-[#06C755] text-white hover:bg-[#05B54C] hover:text-white">
            <LineIcon className="mr-2 h-4 w-4 shrink-0" />
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
