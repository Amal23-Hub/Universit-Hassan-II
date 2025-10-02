"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

const languages = [
  { 
    code: 'fr', 
    name: 'Français', 
    flag: (
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="8" height="16" fill="#002395"/>
        <rect x="8" width="8" height="16" fill="#FFFFFF"/>
        <rect x="16" width="8" height="16" fill="#ED2939"/>
      </svg>
    )
  },
  { 
    code: 'en', 
    name: 'English', 
    flag: (
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="16" fill="#012169"/>
        <path d="M0 0L24 16M24 0L0 16" stroke="#FFFFFF" strokeWidth="2"/>
        <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1"/>
        <path d="M12 0V16M0 8H24" stroke="#FFFFFF" strokeWidth="3"/>
        <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="1.5"/>
      </svg>
    )
  },
  { 
    code: 'ar', 
    name: 'العربية', 
    flag: (
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="16" fill="#C1272D"/>
        <path d="M12 3L13.5 6L12 9L10.5 6L12 3Z" fill="#006C35"/>
        <path d="M12 7L15 8.5L12 10L9 8.5L12 7Z" fill="#006C35"/>
        <path d="M12 11L13.5 14L12 17L10.5 14L12 11Z" fill="#006C35"/>
        <path d="M12 7L9 5.5L12 4L15 5.5L12 7Z" fill="#006C35"/>
        <path d="M12 7L9 11.5L12 13L15 11.5L12 7Z" fill="#006C35"/>
      </svg>
    )
  },
] as const

export function LanguageSelector() {
  const { language, setLanguage, t, dir } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="language-selector flex items-center gap-2 hover:bg-gray-100 transition-all duration-200 p-2 rounded-full"
          dir={dir}
        >
          <div className="w-6 h-4 overflow-hidden">
            {currentLanguage?.flag}
          </div>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-32 mt-1">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code)
              setIsOpen(false)
            }}
            className={`flex items-center justify-center gap-2 cursor-pointer p-2 hover:bg-gray-50 transition-colors duration-150 ${
              language === lang.code ? 'bg-blue-50 text-blue-700' : ''
            }`}
          >
            <div className="w-5 h-3 overflow-hidden">
              {lang.flag}
            </div>
            <span className="text-xs font-medium">{lang.name}</span>
            {language === lang.code && (
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
