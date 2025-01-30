import { resizeImage } from "./image"

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 segundo

export async function uploadToImgur(file: File): Promise<string> {
  let lastError: Error | null = null

  // Primeiro redimensionar a imagem
  try {
    console.log("1. Redimensionando imagem:", file.name)
    const resizedBlob = await resizeImage(file)
    const resizedFile = new File([resizedBlob], file.name, { type: "image/jpeg" })
    console.log("2. Imagem redimensionada:", resizedFile.size)

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`3. Tentativa ${attempt} de upload para Imgur`)

        const formData = new FormData()
        formData.append("image", resizedFile)

        const response = await fetch("/api/upload/imgur", {
          method: "POST",
          body: formData,
        })

        console.log(`4. Status da resposta (tentativa ${attempt}):`, response.status)

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.details || responseData.error || "Falha no upload")
        }

        console.log("5. Upload concluído com sucesso:", responseData.url)
        return responseData.url
      } catch (error) {
        console.error(`6. Erro na tentativa ${attempt}:`, error)
        lastError = error instanceof Error ? error : new Error("Erro desconhecido")

        if (attempt < MAX_RETRIES) {
          console.log(`7. Aguardando ${RETRY_DELAY}ms antes da próxima tentativa`)
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
        }
      }
    }
  } catch (error) {
    console.error("8. Erro ao redimensionar imagem:", error)
    lastError = error instanceof Error ? error : new Error("Erro ao processar imagem")
  }

  throw lastError || new Error("Falha após todas as tentativas de upload")
}

