"use client"

import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { createEvent, deleteEvent, getEvents } from "@/app/actions/event"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Upload, Trash2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { EventData } from "@/types/event"

interface MainPhotoFile {
  preview: string
  file: File
}

interface DeleteDialogProps {
  event: EventData
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

function DeleteDialog({ event, isOpen, onClose, onConfirm }: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    await onConfirm()
    setIsDeleting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Você tem certeza?</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o evento "{event.name}" e todas as suas
            fotos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deletando...
              </>
            ) : (
              "Sim, deletar evento"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AddEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [state, formAction, isPending] = useActionState(createEvent, null)
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [mainPhotos, setMainPhotos] = useState<{
    photo1: MainPhotoFile | null
    photo2: MainPhotoFile | null
    photo3: MainPhotoFile | null
  }>({
    photo1: null,
    photo2: null,
    photo3: null,
  })
  const [events, setEvents] = useState<EventData[]>([])
  const [eventToDelete, setEventToDelete] = useState<EventData | null>(null)

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Evento criado com sucesso!",
        description: "O evento foi adicionado e já está disponível para visualização.",
        duration: 5000,
      })
      // Atualizar a lista de eventos
      const fetchEvents = async () => {
        const eventsList = await getEvents()
        setEvents(eventsList)
      }
      fetchEvents()
    }
  }, [state?.success, toast])

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsList = await getEvents()
      setEvents(eventsList)
    }
    fetchEvents()
  }, [])

  const handleZipFileChange = useCallback((file: File) => {
    if (file && (file.type === "application/zip" || file.type === "application/x-zip-compressed")) {
      setZipFile(file)
    }
  }, [])

  const handleMainPhotoChange = useCallback((photoNumber: 1 | 2 | 3, file: File) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file)
      setMainPhotos((prev) => ({
        ...prev,
        [`photo${photoNumber}`]: {
          preview: url,
          file: file,
        },
      }))
    }
  }, [])

  const action = async (formData: FormData) => {
    const newFormData = new FormData()

    newFormData.append("name", formData.get("name") as string)
    newFormData.append("date", formData.get("date") as string)
    newFormData.append("type", formData.get("type") as string)

    if (mainPhotos.photo1?.file) {
      newFormData.append("mainPhoto1", mainPhotos.photo1.file)
    }
    if (mainPhotos.photo2?.file) {
      newFormData.append("mainPhoto2", mainPhotos.photo2.file)
    }
    if (mainPhotos.photo3?.file) {
      newFormData.append("mainPhoto3", mainPhotos.photo3.file)
    }
    if (zipFile) {
      newFormData.append("zipFile", zipFile)
    }

    const result = await formAction(newFormData)

    if (result?.success) {
      // Reset form
      setZipFile(null)
      setMainPhotos({
        photo1: null,
        photo2: null,
        photo3: null,
      })
      // Reset form fields
      const form = document.querySelector("form") as HTMLFormElement
      if (form) form.reset()
    }

    return result
  }

  const handleDeleteClick = (event: EventData) => {
    setEventToDelete(event)
  }

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return

    const result = await deleteEvent(eventToDelete.id, eventToDelete.name)

    if (result.success) {
      toast({
        title: "Evento deletado",
        description: "O evento foi removido com sucesso.",
        duration: 5000,
      })
      setEvents((prev) => prev.filter((event) => event.id !== eventToDelete.id))
    } else {
      toast({
        title: "Erro ao deletar evento",
        description: result.error,
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle>Adicionar Novo Evento</CardTitle>
              <CardDescription>Preencha os detalhes do evento e faça upload das fotos</CardDescription>
            </CardHeader>
            <form action={action}>
              <CardContent className="space-y-6">
                {state?.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Evento</Label>
                  <Input id="name" name="name" required placeholder="Digite o nome do evento" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data do Evento</Label>
                  <Input id="date" name="date" type="date" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo do Evento</Label>
                  <Select name="type" required defaultValue="">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo do evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Público</SelectItem>
                      <SelectItem value="private">Privado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Fotos Principais</Label>
                  <p className="text-sm text-muted-foreground">
                    Selecione as 3 melhores fotos que serão exibidas na página do evento
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((number) => (
                      <div key={number} className="space-y-2">
                        <Label htmlFor={`mainPhoto${number}`}>Foto {number}</Label>
                        <label
                          htmlFor={`mainPhoto${number}`}
                          className={cn(
                            "block border-2 border-dashed rounded-lg p-6 cursor-pointer",
                            "transition-all duration-200 ease-in-out",
                            "hover:border-primary/50 hover:bg-gray-50",
                          )}
                        >
                          <Input
                            id={`mainPhoto${number}`}
                            name={`mainPhoto${number}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleMainPhotoChange(number as 1 | 2 | 3, file)
                              }
                            }}
                          />
                          <div className="flex flex-col items-center gap-2">
                            {mainPhotos[`photo${number}` as keyof typeof mainPhotos]?.preview ? (
                              <div className="relative w-full aspect-video">
                                <Image
                                  src={
                                    mainPhotos[`photo${number || "/placeholder.svg"}` as keyof typeof mainPhotos]
                                      ?.preview || "/placeholder.svg"
                                  }
                                  alt={`Foto principal ${number}`}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-gray-400" />
                                <span className="text-sm text-gray-600 text-center">Clique para adicionar</span>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="zipFile">Arquivo ZIP com todas as fotos</Label>
                  <label
                    htmlFor="zipFile"
                    className={cn(
                      "block border-2 border-dashed rounded-lg p-6 cursor-pointer",
                      "transition-all duration-200 ease-in-out",
                      "hover:border-primary/50 hover:bg-gray-50",
                    )}
                  >
                    <Input
                      id="zipFile"
                      name="zipFile"
                      type="file"
                      accept=".zip"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleZipFileChange(file)
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600 text-center">
                        {zipFile ? zipFile.name : "Clique para adicionar"}
                      </span>
                    </div>
                  </label>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending || !zipFile || !mainPhotos.photo1 || !mainPhotos.photo2 || !mainPhotos.photo3}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando evento...
                    </>
                  ) : (
                    "Criar Evento"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Eventos Cadastrados</CardTitle>
              <CardDescription>Lista de todos os eventos criados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground">Nenhum evento cadastrado</p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h3 className="font-medium">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 mt-1">
                          {event.type === "public" ? "Público" : "Privado"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(event)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {eventToDelete && (
        <DeleteDialog
          event={eventToDelete}
          isOpen={!!eventToDelete}
          onClose={() => setEventToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  )
}

