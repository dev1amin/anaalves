"use server"

import { cookies } from "next/headers"

interface User {
  username: string
  password: string
  email: string
  name: string
}

export async function authenticate(prevState: any, formData: FormData) {
  try {
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    if (!username || !password) {
      console.log("Campos vazios detectados")
      return { error: "Usuário e senha são obrigatórios." }
    }

    console.log("Iniciando autenticação para:", username)

    const response = await fetch("https://api.github.com/repos/dev1amin/ana-flavia/contents/users.json", {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro na resposta do GitHub:", errorText)
      return { error: "Falha ao acessar dados de usuário." }
    }

    let users: User[]
    try {
      const content = await response.text()
      console.log("Conteúdo recebido:", content)
      users = JSON.parse(content)
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", parseError)
      return { error: "Erro ao processar dados de usuário." }
    }

    console.log("Total de usuários encontrados:", users.length)

    const user = users.find((u) => {
      console.log("Comparando com:", u.username)
      return u.username === username && u.password === password
    })

    if (!user) {
      console.log("Usuário não encontrado ou senha incorreta")
      return { error: "Usuário ou senha inválidos." }
    }

    console.log("Usuário encontrado, preparando sessão")

    try {
      // Criar objeto de sessão simplificado
      const session = {
        id: Date.now().toString(),
        username: user.username,
        name: user.name,
        email: user.email,
      }

      // Tentar definir o cookie
      const cookieStore = cookies()
      cookieStore.set({
        name: "session",
        value: JSON.stringify(session),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 semana
      })

      // Adicionar cookie não-httpOnly para acesso no cliente
      cookieStore.set({
        name: "userSessionPublic",
        value: JSON.stringify({
          name: user.name,
        }),
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })

      return { success: true, userData: { name: user.name } }
    } catch (cookieError) {
      console.error("Erro detalhado ao definir cookie:", cookieError)
      if (cookieError instanceof Error) {
        console.error("Mensagem:", cookieError.message)
        console.error("Stack:", cookieError.stack)
      }
      return { error: "Erro ao criar sessão. Por favor, tente novamente." }
    }
  } catch (error) {
    console.error("Erro durante autenticação:", error)
    if (error instanceof Error) {
      console.error("Detalhes do erro:", error.message)
      console.error("Stack trace:", error.stack)
    }
    return { error: "Ocorreu um erro durante a autenticação. Tente novamente." }
  }
}

