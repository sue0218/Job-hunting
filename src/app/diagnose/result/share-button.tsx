'use client'

import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  text: string
  url: string
}

export function ShareButton({ text, url }: ShareButtonProps) {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

  return (
    <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
      <Button
        size="lg"
        className="h-12 w-full rounded-xl bg-black text-white hover:bg-black/80"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        結果をXでシェア
      </Button>
    </a>
  )
}
