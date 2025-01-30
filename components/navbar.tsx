"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, User, Home, Globe, LogIn, Briefcase, ImageIcon, Phone, Instagram, LogOut, Lock } from "lucide-react"
import Image from "next/image"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const checkUserSession = () => {
      try {
        const sessionData = localStorage.getItem("userSession")
        if (sessionData) {
          const { name } = JSON.parse(sessionData)
          const firstName = name.split(" ")[0]
          setUserName(firstName)
        } else {
          setUserName(null)
        }
      } catch (error) {
        console.error("Erro ao ler sessão:", error)
        setUserName(null)
      }
    }

    checkUserSession()
    window.addEventListener("storage", checkUserSession)

    return () => {
      window.removeEventListener("storage", checkUserSession)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userSession")
    setUserName(null)
    router.push("/login")
  }

  const getLinkStyle = (path: string) => {
    const isActive = pathname === path
    return `flex items-center gap-2 px-2 py-1 ${isActive ? "text-gray-400" : "hover:bg-gray-100 rounded-md"}`
  }

  const getMobileLinkStyle = (path: string) => {
    const isActive = pathname === path
    return `flex items-center gap-2 ${isActive ? "text-gray-400" : "hover:text-gray-900"}`
  }

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/1-removebg-preview.png"
            alt="Ana Flávia Alves Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Conteúdo
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[200px]">
                    <NavigationMenuLink asChild>
                      <Link href="/" className={getLinkStyle("/")}>
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/eventos-publicos" className={getLinkStyle("/eventos-publicos")}>
                        <Globe className="w-4 h-4" />
                        <span>Eventos Públicos</span>
                      </Link>
                    </NavigationMenuLink>
                    {userName && (
                      <NavigationMenuLink asChild>
                        <Link href="/eventos-privados" className={getLinkStyle("/eventos-privados")}>
                          <Lock className="w-4 h-4" />
                          <span>Eventos Privados</span>
                        </Link>
                      </NavigationMenuLink>
                    )}
                    {!userName && (
                      <NavigationMenuLink asChild>
                        <Link href="/login" className={getLinkStyle("/login")}>
                          <LogIn className="w-4 h-4" />
                          <span>Login</span>
                        </Link>
                      </NavigationMenuLink>
                    )}
                    <NavigationMenuLink asChild>
                      <a
                        href="tel:+553171514298"
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-md"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Contato</span>
                      </a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a
                        href="https://www.behance.net/anaflvalves"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-md"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Portfolio</span>
                      </a>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <a
                        href="https://instagram.com/estudioprismaa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-md"
                      >
                        <Instagram className="w-4 h-4" />
                        <span>Instagram Prisma</span>
                      </a>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {userName && (
                <NavigationMenuItem>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <User className="w-4 h-4" />
                    <span>Bem vindo {userName}</span>
                  </div>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex flex-col gap-2">
            <a
              href="https://wa.me/553171514298"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Fazer Orçamento!
            </a>
            {userName && (
              <Button variant="destructive" className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Deslogar
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>

        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent
            side="left"
            className="w-[300px] overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <SheetHeader className="bg-transparent pb-4 pt-2">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-4">
              {userName && (
                <div className="flex items-center gap-2 px-4 py-2">
                  <User className="w-5 h-5" />
                  <span>Bem vindo {userName}</span>
                </div>
              )}
              <div className="px-4 py-2">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Conteúdo
                </h3>
                <div className="ml-7 flex flex-col gap-3">
                  <Link href="/" className={getMobileLinkStyle("/")} onClick={() => setIsMobileMenuOpen(false)}>
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                  <Link
                    href="/eventos-publicos"
                    className={getMobileLinkStyle("/eventos-publicos")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Globe className="w-4 h-4" />
                    Eventos Públicos
                  </Link>
                  {userName && (
                    <Link
                      href="/eventos-privados"
                      className={getMobileLinkStyle("/eventos-privados")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Lock className="w-4 h-4" />
                      Eventos Privados
                    </Link>
                  )}
                  {!userName && (
                    <Link
                      href="/login"
                      className={getMobileLinkStyle("/login")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                  )}
                  <a
                    href="https://www.behance.net/anaflvalves"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-gray-900"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Portfolio
                  </a>
                  <a
                    href="https://instagram.com/estudioprismaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-gray-900"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram Prisma
                  </a>
                </div>
              </div>
              <div className="px-4 py-2">
                <h3 className="font-semibold mb-2">Contato</h3>
                <div className="ml-7 flex flex-col gap-3">
                  <a
                    href="https://instagram.com/anaflvalves"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-gray-900"
                  >
                    <Instagram className="w-4 h-4" />
                    @anaflvalves
                  </a>
                  <a href="tel:+553171514298" className="flex items-center gap-2 hover:text-gray-900">
                    <Phone className="w-4 h-4" />
                    +55 31 7151-4298
                  </a>
                </div>
              </div>
              <div className="px-4 mt-4 flex flex-col gap-2 pb-4">
                <a
                  href="https://wa.me/553171514298"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors w-full inline-block text-center"
                >
                  Fazer Orçamento!
                </a>
                {userName && (
                  <Button variant="destructive" className="flex items-center gap-2 w-full" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Deslogar
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

