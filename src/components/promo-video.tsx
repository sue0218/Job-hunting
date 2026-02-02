'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PromoVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border-2 border-primary/20 bg-slate-900 shadow-2xl shadow-primary/10">
      {/* Video Player */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src="/video/promo.mp4"
          muted={isMuted}
          loop
          playsInline
          poster="/video/poster.jpg"
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all hover:bg-black/40"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/50 transition-transform hover:scale-110">
              <Play className="h-10 w-10 text-white ml-1" fill="white" />
            </div>
          </button>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="text-white hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" fill="white" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-white hover:bg-white/20"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Caption */}
      <div className="bg-slate-800 px-4 py-3 text-center">
        <p className="text-sm text-slate-300">
          📹 サービス紹介動画（30秒）
        </p>
      </div>
    </div>
  )
}
