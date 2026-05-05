import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // IMPORTANT: Create an initial response that forwards all incoming request
  // headers so that custom headers set upstream are not lost.
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // First, mutate the request cookies so getAll() returns the fresh values
          // to any later call within the same middleware invocation.
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Rebuild the response while forwarding the (now-updated) request headers.
          supabaseResponse = NextResponse.next({ request })
          // Then propagate the new Set-Cookie headers onto the response.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Always call getUser() — never getSession() — inside middleware.
  // getUser() contacts the Supabase Auth server to revalidate the token and
  // refresh cookies when they are close to expiry.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protect the /dashboard route: redirect unauthenticated visitors to /auth.
  if (!user && pathname.startsWith('/dashboard')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect already-authenticated visitors away from /auth to /dashboard.
  if (user && pathname.startsWith('/auth')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
