import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")
  const adminSessionCheck = cookieStore.get("admin_session_check")

  console.log("Check admin session API - Cookie:", adminSession)
  console.log("Check admin session API - Check Cookie:", adminSessionCheck)

  if (!adminSession?.value) {
    return NextResponse.json({ isAdmin: false })
  }

  try {
    const sessionData = JSON.parse(adminSession.value)
    return NextResponse.json({
      isAdmin: sessionData.isAdmin,
      username: sessionData.username,
    })
  } catch (error) {
    console.error("Erro ao verificar sessão admin:", error)
    return NextResponse.json({ isAdmin: false })
  }
}

