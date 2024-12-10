import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware" // middlware in the whoel page 
import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    // token se kha parr redirect karega yeh middleware
    const token = await getToken({req: request});
    const url = request.nextUrl;
    // condition
    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/signup') ||
        url.pathname.startsWith('/dashboard')
    )) {
        return NextResponse.redirect(new URL('/home', request.url))
    } else {
        
    }
  return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/path*' // all the path after the dashboard route
  ]

}