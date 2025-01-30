"use client"

import { Toaster } from "@/components/ui/toaster"
import type React from "react" // Import React

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

