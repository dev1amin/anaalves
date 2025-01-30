import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("1. Middleware iniciado")

  const adminSession = request.cookies.get("admin_session")
  const adminPublic = request.cookies.get("admin_public")
  const path = request.nextUrl.pathname

  console.log("2. Rota:", path)
  console.log("3. Cookies presentes:", {
    adminSession: !!adminSession,
    adminPublic: !!adminPublic,
  })

  const isAdminRoute = path.startsWith("/admin")
  const isAdminLoginPage = path === "/admin"

  if (isAdminRoute && !isAdminLoginPage) {
    if (!adminSession?.value || !adminPublic?.value) {
      console.log("4. Redirecionando para login - cookies ausentes")
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    try {
      const sessionData = JSON.parse(adminSession.value)
      const publicData = JSON.parse(adminPublic.value)

      if (!sessionData.isAdmin || !publicData.isAdmin) {
        console.log("5. Redirecionando para login - não é admin")
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    } catch (error) {
      console.error("6. Erro ao verificar sessão:", error)
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  console.log("7. Middleware finalizado - permitindo acesso")
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

