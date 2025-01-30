import Image from "next/image"
import type { Testimonial } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"

const testimonials: Testimonial[] = [
  {
    name: "Lucas Oliveira",
    image: "/images/istockphoto-1200677760-612x612-removebg-preview.png",
    text: "A Ana tem um olhar único para a fotografia. Conseguiu captar exatamente o que eu queria transmitir!",
  },
  {
    name: "Mariana Souza",
    image: "/images/istockphoto-1289220545-612x612-removebg-preview.png",
    text: "Profissional incrível! As fotos ficaram além das minhas expectativas.",
  },
  {
    name: "Giovana Patrus",
    image: "/images/giovana.png",
    text: "Experiência maravilhosa! A Ana me deixou super à vontade durante todo o ensaio.",
  },
  {
    name: "Leonardo Andrade",
    image: "/images/Captura de tela 2025-01-28 104406.png",
    text: "Trabalho excepcional! Recomendo para todos que buscam fotos profissionais de qualidade.",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">O que dizem sobre mim</h2>
          <div className="w-24 h-1 bg-black mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover rounded-full border-4 border-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                      <QuoteIcon className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-gray-600 leading-relaxed">{testimonial.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

