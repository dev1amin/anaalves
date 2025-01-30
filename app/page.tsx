import { Navbar } from "@/components/navbar"
import { Carousel } from "@/components/carousel"
import { Services } from "@/components/services"
import { Testimonials } from "@/components/testimonials"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { MessageCircle } from "lucide-react"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Carousel className="mt-16" />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/ana-flavia.jpg"
                alt="Ana Flávia Alves"
                width={500}
                height={600}
                className="rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Sobre Mim</h2>
              <p className="text-gray-600 mb-4">
                Com 7 anos de experiência como fotógrafa autônoma, sou a CEO da Prisma Creative Hub. Meu trabalho
                abrange desde marcas e publicidade até retratos e eventos, sempre buscando capturar a essência única de
                cada momento.
              </p>
              <p className="text-gray-600">
                Baseada em Belo Horizonte, trago um olhar artístico e profissional para cada projeto, garantindo
                resultados que superam expectativas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Services />
      <Testimonials />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Localização</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.6544121410735!2d-43.9344911!3d-19.9167273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDU1JzAwLjIiUyA0M8KwNTYnMDQuMiJX!5e0!3m2!1spt-BR!2sbr!4v1629900000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <a
        href="https://wa.me/553171514298"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:bg-[#20BA5C] transition-colors"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="sr-only">Contato via WhatsApp</span>
      </a>

      <Footer />
    </main>
  )
}

