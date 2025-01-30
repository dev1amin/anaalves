"use server"

import { cookies } from "next/headers"

export async function authenticateAdmin(prevState: any, formData: FormData) {
  try {
    const username = formData.get("username")
    const password = formData.get("password")

    console.log("1. Tentando autenticar admin")

    if (!username || !password) {
      return { error: "Usuário e senha são obrigatórios." }
    }

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      console.log("2. Credenciais corretas")

      const sessionData = {
        isAdmin: true,
        username: username as string,
        timestamp: Date.now(),
      }

      console.log("3. Criando sessão:", sessionData)

      // Criar cookie público para acesso no cliente
      cookies().set({
        name: "admin_public",
        value: JSON.stringify({ isAdmin: true }),
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        httpOnly: false,
      })

      // Criar cookie seguro para validação no servidor
      cookies().set({
        name: "admin_session",
        value: JSON.stringify(sessionData),
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
      })

      console.log("4. Cookies definidos")

      return {
        success: true,
        sessionData,
        redirectTo: "/admin/eventos/adicionar",
      }
    }

    return { error: "Credenciais inválidas." }
  } catch (error) {
    console.error("Erro na autenticação:", error)
    return { error: "Ocorreu um erro durante a autenticação. Tente novamente." }
  }
}

