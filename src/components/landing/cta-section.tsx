import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-600 py-20 text-white sm:py-28">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Success Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto w-full max-w-sm">
              <Image
                src="/images/socost-success.svg"
                alt="就活成功のイメージ"
                width={400}
                height={300}
                className="drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right: CTA Content */}
          <div className="text-center lg:text-left">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              ガクチカを「資産」に変える、
              <br />
              最初の一歩を。
            </h2>
            <p className="mb-4 text-lg text-white/90">
              経験を登録して、ESも面接もブレない就活を始めましょう。
            </p>
            <p className="mb-10 text-white/70">
              無料プランで今すぐ始められます。クレジットカード不要。
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="secondary"
                className="shadow-xl transition-all hover:scale-105"
              >
                無料で始める
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
