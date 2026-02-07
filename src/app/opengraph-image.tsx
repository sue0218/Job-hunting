import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ガクチカバンクAI - 経験を資産に、ESも面接もブレない就活'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
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
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            ガクチカバンクAI
          </div>
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            経験を資産に、ESも面接もブレない就活
          </div>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            {['ES自動生成', 'AI面接練習', '整合性チェック'].map((label) => (
              <div
                key={label}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '9999px',
                  padding: '12px 28px',
                  fontSize: '22px',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
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
    { ...size }
  )
}
