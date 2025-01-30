"use server"

import type { EventData } from "@/types/event"
import { uploadToImgur } from "@/utils/imgur"
import type { EventType } from "@/types/event" // Import EventType

export async function createEvent(prevState: any, formData: FormData) {
  console.log("1. Iniciando createEvent")

  try {
    const name = formData.get("name") as string
    const date = formData.get("date") as string
    const type = formData.get("type") as EventType
    const zipFile = formData.get("zipFile") as File
    const mainPhoto1 = formData.get("mainPhoto1") as File
    const mainPhoto2 = formData.get("mainPhoto2") as File
    const mainPhoto3 = formData.get("mainPhoto3") as File

    if (!name || !date || !type || !zipFile || !mainPhoto1 || !mainPhoto2 || !mainPhoto3) {
      return { error: "Todos os campos são obrigatórios" }
    }

    try {
      console.log("2. Iniciando upload das imagens")

      // Upload das imagens principais para o Imgur
      const [photo1Url, photo2Url, photo3Url] = await Promise.all([
        uploadToImgur(mainPhoto1),
        uploadToImgur(mainPhoto2),
        uploadToImgur(mainPhoto3),
      ])

      console.log("4. URLs das imagens:", { photo1Url, photo2Url, photo3Url })

      // Upload do arquivo ZIP para o GitHub
      console.log("5. Iniciando upload do arquivo ZIP")
      const zipBuffer = await zipFile.arrayBuffer()
      const zipBase64 = Buffer.from(zipBuffer).toString("base64")
      const zipFileName = `${Date.now()}-${zipFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

      console.log("6. Preparando upload para GitHub:", {
        fileName: zipFileName,
        fileSize: zipBuffer.byteLength,
      })

      try {
        // Criar a pasta event-files se não existir
        const folderCheckResponse = await fetch(
          "https://api.github.com/repos/dev1amin/ana-flavia/contents/event-files",
          {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          },
        )

        if (!folderCheckResponse.ok && folderCheckResponse.status !== 404) {
          const folderError = await folderCheckResponse.text()
          throw new Error(`Erro ao verificar pasta: ${folderError}`)
        }

        // Salvar o arquivo ZIP no GitHub
        const zipUploadResponse = await fetch(
          `https://api.github.com/repos/dev1amin/ana-flavia/contents/event-files/${zipFileName}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Add ZIP file for event: ${name}`,
              content: zipBase64,
            }),
          },
        )

        const zipResponseText = await zipUploadResponse.text()
        console.log("7. Resposta do GitHub para upload do ZIP:", zipResponseText)

        if (!zipUploadResponse.ok) {
          throw new Error(`Erro ao fazer upload do arquivo ZIP (${zipUploadResponse.status}): ${zipResponseText}`)
        }

        // Parse da resposta para confirmar o upload
        const zipResponseData = JSON.parse(zipResponseText)
        if (!zipResponseData.content?.sha) {
          throw new Error("Resposta do GitHub não contém informações do arquivo")
        }

        // Construir a URL raw correta para download
        const zipFileUrl = `https://github.com/dev1amin/ana-flavia/raw/main/event-files/${zipFileName}`

        console.log("8. Criando objeto do evento")
        const eventData: EventData = {
          id: Date.now().toString(),
          name,
          date,
          type,
          mainPhotos: {
            photo1: photo1Url,
            photo2: photo2Url,
            photo3: photo3Url,
          },
          zipFileUrl,
          createdAt: new Date().toISOString(),
        }

        console.log("9. Buscando eventos existentes")
        const eventsResponse = await fetch("https://api.github.com/repos/dev1amin/ana-flavia/contents/events.json", {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
          cache: "no-store",
        })

        let events: EventData[] = []
        let existingSha: string | undefined

        if (eventsResponse.ok) {
          const responseData = await eventsResponse.json()
          console.log("10. Dados do arquivo events.json:", responseData)

          if (responseData.content) {
            const content = Buffer.from(responseData.content, "base64").toString()
            events = JSON.parse(content)
            existingSha = responseData.sha
          } else {
            events = responseData
          }
        } else if (eventsResponse.status !== 404) {
          const errorText = await eventsResponse.text()
          throw new Error(`Erro ao acessar eventos existentes: ${errorText}`)
        }

        console.log("11. Atualizando lista de eventos")
        const updatedEvents = [...events, eventData]

        console.log("12. Salvando arquivo atualizado no GitHub")
        const updateResponse = await fetch("https://api.github.com/repos/dev1amin/ana-flavia/contents/events.json", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Add event: ${name}`,
            content: Buffer.from(JSON.stringify(updatedEvents, null, 2)).toString("base64"),
            ...(existingSha && { sha: existingSha }),
          }),
        })

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text()
          throw new Error(`Erro ao salvar evento: ${errorText}`)
        }

        console.log("13. Evento criado com sucesso:", eventData)
        return { success: true, message: "Evento criado com sucesso!" }
      } catch (githubError) {
        console.error("Erro na interação com GitHub:", githubError)
        throw new Error(
          `Erro na operação com GitHub: ${githubError instanceof Error ? githubError.message : "Erro desconhecido"}`,
        )
      }
    } catch (uploadError) {
      console.error("Erro detalhado ao fazer upload:", uploadError)
      return {
        error:
          uploadError instanceof Error
            ? `Erro ao fazer upload: ${uploadError.message}`
            : "Erro ao fazer upload. Tente novamente.",
      }
    }
  } catch (error) {
    console.error("Erro geral:", error)
    return {
      error:
        error instanceof Error ? `Erro ao criar evento: ${error.message}` : "Erro ao criar evento. Tente novamente.",
    }
  }
}

export async function getEvents() {
  try {
    const response = await fetch("https://api.github.com/repos/dev1amin/ana-flavia/contents/events.json", {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
      next: { revalidate: 60 }, // Cache por 1 minuto
    })

    if (!response.ok) {
      if (response.status === 404) {
        return []
      }
      throw new Error("Erro ao buscar eventos")
    }

    const events: EventData[] = await response.json()
    return events
  } catch (error) {
    console.error("Erro ao buscar eventos:", error)
    return []
  }
}

export async function deleteEvent(eventId: string, eventName: string) {
  console.log("1. Iniciando exclusão do evento:", eventId, eventName)

  try {
    // Buscar eventos existentes
    const response = await fetch("https://api.github.com/repos/dev1amin/ana-flavia/contents/events.json", {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar eventos: ${await response.text()}`)
    }

    const data = await response.json()
    const events: EventData[] = JSON.parse(Buffer.from(data.content, "base64").toString())

    // Encontrar o evento para pegar a URL do arquivo ZIP
    const eventToDelete = events.find((event) => event.id === eventId)
    if (!eventToDelete) {
      throw new Error("Evento não encontrado")
    }

    // Extrair o nome do arquivo ZIP da URL
    const zipFileName = eventToDelete.zipFileUrl.split("/").pop()

    // Deletar o arquivo ZIP
    if (zipFileName) {
      console.log("2. Deletando arquivo ZIP:", zipFileName)

      // Primeiro, obter o SHA do arquivo ZIP
      const zipFileResponse = await fetch(
        `https://api.github.com/repos/dev1amin/ana-flavia/contents/event-files/${zipFileName}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      )

      if (zipFileResponse.ok) {
        const zipFileData = await zipFileResponse.json()

        // Deletar o arquivo ZIP usando o SHA
        const zipDeleteResponse = await fetch(
          `https://api.github.com/repos/dev1amin/ana-flavia/contents/event-files/${zipFileName}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Delete ZIP file for event: ${eventName}`,
              sha: zipFileData.sha,
            }),
          },
        )

        if (!zipDeleteResponse.ok) {
          console.error("Erro ao deletar ZIP:", await zipDeleteResponse.text())
        }
      }
    }

    // Atualizar a lista de eventos
    console.log("3. Atualizando lista de eventos")
    const updatedEvents = events.filter((event) => event.id !== eventId)

    const updateResponse = await fetch("https://api.github.com/repos/dev1amin/ana-flavia/contents/events.json", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Delete event: ${eventName}`,
        content: Buffer.from(JSON.stringify(updatedEvents, null, 2)).toString("base64"),
        sha: data.sha,
      }),
    })

    if (!updateResponse.ok) {
      throw new Error(`Erro ao atualizar lista de eventos: ${await updateResponse.text()}`)
    }

    console.log("4. Evento deletado com sucesso")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar evento:", error)
    return {
      error: error instanceof Error ? error.message : "Erro ao deletar evento",
    }
  }
}

