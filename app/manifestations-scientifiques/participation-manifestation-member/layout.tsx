"use client"

import React from "react"
import { ParticipationProvider } from "@/lib/participation-context"

export default function ParticipationManifestationMemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ParticipationProvider>{children}</ParticipationProvider>
}


