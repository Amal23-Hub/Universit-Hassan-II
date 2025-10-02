"use client"

import * as React from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useClipboard } from "@/hooks/use-clipboard"
import { toast } from "@/hooks/use-toast"

interface CopyButtonProps {
  value: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export function CopyButton({ 
  value, 
  className, 
  variant = "outline", 
  size = "sm",
  children 
}: CopyButtonProps) {
  const { copied, copy, isSupported } = useClipboard({
    onSuccess: () => {
      toast({
        title: "Copié !",
        description: "Le contenu a été copié dans le presse-papiers.",
      })
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  if (!isSupported) {
    return null // Don't render the button if clipboard is not supported
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => copy(value)}
      disabled={copied}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {children && <span className="ml-2">{children}</span>}
    </Button>
  )
} 