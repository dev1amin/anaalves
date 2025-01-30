"use server"

export async function signUp(prevState: any, formData: FormData) {
  try {
    const userData = {
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
      name: formData.get("name"),
    }

    // Verificar se todos os campos estão preenchidos
    if (!userData.username || !userData.password || !userData.email || !userData.name) {
      return { error: "Todos os campos são obrigatórios." }
    }

    try {
      // Tentar buscar o arquivo existente
      const response = await fetch("https://api.github.com/repos/dev1amin/ana-flavia/contents/users.json", {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
        },
        cache: "no-store",
      })

      let existingUsers = []

      if (response.ok) {
        // Se o arquivo existe, carregar usuários existentes
        existingUsers = await response.json()

        // Verificar se o usuário já existe
        if (existingUsers.some((user: any) => user.username === userData.username)) {
          return { error: "Este nome de usuário já está em uso." }
        }
      } else if (response.status !== 404) {
        // Se o erro não for 404 (arquivo não encontrado), é um erro real
        console.error("Erro inesperado:", await response.text())
        return { error: "Erro ao acessar o repositório." }
      }

      // Adicionar novo usuário ao array
      const updatedUsers = [...existingUsers, userData]

      // Criar ou atualizar o arquivo
      const updateResponse = await fetch("https://api.github.com/repos/dev1amin/ana-flavia/contents/users.json", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: existingUsers.length === 0 ? "Create users.json" : "Add new user",
          content: Buffer.from(JSON.stringify(updatedUsers, null, 2)).toString("base64"),
          ...(response.ok && { sha: (await response.json()).sha }),
        }),
      })

      if (!updateResponse.ok) {
        console.error("Erro ao atualizar arquivo:", await updateResponse.text())
        return { error: "Erro ao criar usuário." }
      }

      return { success: true }
    } catch (error) {
      console.error("Erro durante o cadastro:", error)
      return { error: "Ocorreu um erro ao criar a conta. Tente novamente." }
    }
  } catch (error) {
    console.error("Erro geral:", error)
    return { error: "Ocorreu um erro inesperado. Tente novamente." }
  }
}

