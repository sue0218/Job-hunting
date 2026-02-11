'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  esTitle: string
}

const SHARE_URL = 'https://gakuchika-bank.com'

export function ShareModal({ isOpen, onClose, esTitle }: ShareModalProps) {
  const [isCopied, setIsCopied] = useState(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const shareText = useMemo(() => {
    return `AIでES作ったら${esTitle}が5分で完成した。もう手書きには戻れない gakuchika-bank.com #就活 #ES`
  }, [esTitle])

  const xShareUrl = useMemo(() => {
    return `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  }, [shareText])

  const lineShareUrl = useMemo(() => {
    return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
      SHARE_URL
    )}`
  }, [])

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL)
      setIsCopied(true)
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
      resetTimerRef.current = setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch {
      setIsCopied(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            ES完成！お疲れさまでした。友達にもこの効率を教えてあげませんか？
          </DialogTitle>
          <DialogDescription>
            XやLINEでシェアして、仲間にも時短体験を届けましょう。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Button asChild className="w-full">
            <a href={xShareUrl} target="_blank" rel="noopener noreferrer">
              Xでシェアする
            </a>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <a href={lineShareUrl} target="_blank" rel="noopener noreferrer">
              LINEでシェアする
            </a>
          </Button>
        </div>

        <div className="grid gap-2">
          <div className="text-sm font-medium text-foreground">
            招待リンクをコピー
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input value={SHARE_URL} readOnly />
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="sm:w-40"
            >
              {isCopied ? 'コピーしました' : 'リンクをコピー'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
