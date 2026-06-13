import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'
import { decodeState, getScore, getScoreLevel } from '@/app/diagnose/_lib/diagnose-data'

export const runtime = 'edge'

const COLORS: Record<string, string> = {
  red: '#dc2626',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#16a34a',
}

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get('s') ?? '00000000'
  const checks = decodeState(state)
  const score = getScore(checks)
  const level = getScoreLevel(score)
  const color = COLORS[level.color]

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '36px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '24px',
            fontWeight: 'bold',
          }}
        >
          ガクチカ完成度診断
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '120px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '48px',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            /8
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '9999px',
            padding: '12px 32px',
            marginBottom: '32px',
            border: `2px solid ${color}`,
          }}
        >
          <div style={{ display: 'flex', fontSize: '28px' }}>{level.emoji}</div>
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            {level.label}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '16px',
          }}
        >
          {checks.map((checked, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: checked ? color : 'rgba(255,255,255,0.2)',
                border: checked ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '40px',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          gakuchika-bank.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
