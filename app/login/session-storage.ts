"use client"

export function setupUserSession(sessionData: string) {
  try {
    localStorage.setItem("userSession", sessionData)
  } catch (error) {
    console.error("Erro ao salvar sessão:", error)
  }
}

