import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "Nenhuma imagem fornecida" }, { status: 400 })
    }

    console.log("1. Iniciando upload para Imgur")
    console.log("2. Tamanho da imagem:", image.size)

    // Converter File para base64
    const buffer = await image.arrayBuffer()
    const base64String = Buffer.from(buffer).toString("base64")

    console.log("3. Imagem convertida para base64")

    // Upload para o Imgur
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64String,
        type: "base64",
      }),
    })

    console.log("4. Status da resposta Imgur:", response.status)

    const responseText = await response.text()
    console.log("5. Resposta do Imgur:", responseText)

    try {
      const responseData = JSON.parse(responseText)

      if (!response.ok || !responseData.data?.link) {
        throw new Error(responseData.data?.error || "Erro no upload para Imgur")
      }

      console.log("6. Upload concluído com sucesso")
      return NextResponse.json({ success: true, url: responseData.data.link })
    } catch (parseError) {
      console.error("7. Erro ao parsear resposta:", parseError)
      return NextResponse.json(
        {
          error: "Erro na resposta do Imgur",
          details: responseText,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("8. Erro detalhado:", error)
    return NextResponse.json(
      {
        error: "Falha ao fazer upload da imagem",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

