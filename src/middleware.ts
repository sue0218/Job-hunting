import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)'])
const publicPaths = ['/', '/sign-in', '/sign-up', '/api/webhooks']

function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  if (!key) return false
  return (key.startsWith('pk_test_') || key.startsWith('pk_live_')) && !key.includes('YOUR_')
}

// Create a configured Clerk middleware
const clerkAuth = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

// Conditional middleware - fail-secure if Clerk is not configured
export default function middleware(request: NextRequest) {
  if (!isClerkConfigured()) {
    // Fail-secure: only allow public routes when auth is not configured
    const pathname = request.nextUrl.pathname
    const isPublic = publicPaths.some(path =>
      pathname === path || pathname.startsWith(path + '/')
    )
    if (!isPublic) {
      // Redirect to home page for protected routes
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // If Clerk is configured, use clerkMiddleware
  return clerkAuth(request, {} as never)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
