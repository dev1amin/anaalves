import Image from "next/image"
import type { Service } from "@/types"

const services: Service[] = [
  {
    title: "Ensaios Pessoais",
    description: "Capturando momentos únicos e especiais da sua vida com sensibilidade e arte.",
    images: ["/images/ensaiopessoal1.JPG", "/images/ensaiopessoal3.JPG"],
  },
  {
    title: "Ensaios Corporativos",
    description: "Fortalecendo sua imagem profissional com fotos que transmitem confiança e competência.",
    images: ["/images/corporativo2.JPG", "/images/coporativo.JPG"],
  },
  {
    title: "Publicidade",
    description: "Criando conteúdo visual impactante para influenciadores e marcas.",
    images: ["/images/melissa.JPG", "/images/melissa2.JPG"],
  },
  {
    title: "Eventos",
    description: "Registrando cada momento especial do seu evento com atenção aos detalhes.",
    images: ["/images/eventos-1.JPG", "/images/eventos-2.JPG", "/images/eventos-3.JPG"],
  },
  {
    title: "Marcas",
    description: "Desenvolvendo lookbooks e editoriais que destacam a essência da sua marca.",
    images: ["/images/marcas1.JPG", "/images/marcas2.JPG"],
  },
  {
    title: "Presskit de Artistas",
    description: "Criando material fotográfico profissional para sua divulgação na mídia.",
    images: ["/images/artista1.JPG", "/images/artista-2.JPG"],
  },
]

export function Services() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Serviços</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.title} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image
                  src={service.images[0] || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

