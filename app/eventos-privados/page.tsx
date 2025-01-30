import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { getEvents } from "@/app/actions/event"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Download } from "lucide-react"

export default async function EventosPrivados() {
  const events = await getEvents()
  const privateEvents = events.filter((event) => event.type === "private")

  return (
    <main>
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Galeria de Fotos de Eventos Privados</h1>

          <div className="space-y-16">
            {privateEvents.map((event) => (
              <section key={event.id} className="bg-gray-50 rounded-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold">{event.name}</h2>
                  <p className="text-gray-600 mt-2">
                    {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.values(event.mainPhotos).map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Foto ${index + 1} do ${event.name}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-center">
                <a
                href={`https://github.com/dev1amin/ana-flavia/raw/refs/heads/main/event-files/${event.zipFileUrl.split("/").pop()}`}
                className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
                >
                <Download className="w-5 h-5" />
                Baixar Fotos
                </a>
                </div>
              </section>
            ))}

            {privateEvents.length === 0 && (
              <p className="text-center text-gray-500">Nenhum evento privado encontrado.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

