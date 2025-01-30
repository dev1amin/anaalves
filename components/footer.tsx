import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image
              src="/images/2-removebg-preview.png"
              alt="Ana Flávia Alves Logo"
              width={150}
              height={50}
              className="mb-4"
            />
            <p className="text-gray-400">
              Capturando momentos únicos e transformando-os em memórias eternas através das lentes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">Início</Link>
              </li>
              <li>
                <Link href="/sobre">Sobre</Link>
              </li>
              <li>
                <Link href="/servicos">Serviços</Link>
              </li>
              <li>
                <Link href="/contato">Contato</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Políticas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacidade">Política de Privacidade</Link>
              </li>
              <li>
                <Link href="/termos">Termos de Serviço</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>© 2024 Prisma - Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

