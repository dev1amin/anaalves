import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function AdminDashboard() {
  const cookieStore = cookies()
  const adminSessionCookie = cookieStore.get("admin_session")

  if (!adminSessionCookie?.value) {
    redirect("/admin")
  }

  let adminSession
  try {
    adminSession = JSON.parse(adminSessionCookie.value)
  } catch (error) {
    redirect("/admin")
  }

  if (!adminSession?.isAdmin) {
    redirect("/admin")
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <Link href="/admin/eventos/adicionar">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Evento
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Eventos</CardTitle>
                <CardDescription>Gerenciar eventos públicos e privados</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/admin/eventos/adicionar">Gerenciar Eventos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Gerenciar usuários do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Gerenciar Usuários</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Configurações do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Acessar Configurações</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

