export type EventType = "public" | "private"

export interface EventData {
  id: string
  name: string
  date: string
  type: EventType
  mainPhotos: {
    photo1: string
    photo2: string
    photo3: string
  }
  zipFileUrl: string
  createdAt: string
}

