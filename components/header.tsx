"use client"

import type React from "react"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, User, Menu, CheckCircle, XCircle, Eye, Clock, Calendar } from "lucide-react"

interface Notification {
  id: string
  projectId: string
  projectTitle: string
  action: "approved" | "rejected" | "under_review" | "pending"
  date: string
  comments?: string
  read: boolean
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const isAdminDashboard = pathname.startsWith("/dashboard-admin")
  const isExpertDashboard = pathname.startsWith("/dashboard-expert")
  const isMemberDashboard = pathname.startsWith("/dashboard-member")
  const isPoleRechercheDashboard = pathname.startsWith("/dashboard-polerecherche")
  const isDivisionRechercheDashboard = pathname.startsWith("/dashboard-division-recherche")

  // Mock notifications data
  const [notifications] = useState<Notification[]>([
    {
      id: "notif_001",
      projectId: "PR001",
      projectTitle: "Développement d'algorithmes d'IA pour l'éducation",
      action: "approved",
      date: "2024-01-15T10:30:00Z",
      comments: "Excellent projet, approuvé avec quelques modifications mineures.",
      read: false,
    },
    {
      id: "notif_002",
      projectId: "PR002",
      projectTitle: "Systèmes d'IA pour la santé préventive",
      action: "rejected",
      date: "2024-01-14T14:20:00Z",
      comments: "Le projet nécessite des clarifications sur la méthodologie.",
      read: true,
    },
    {
      id: "notif_003",
      projectId: "PR003",
      projectTitle: "IA pour l'optimisation énergétique",
      action: "under_review",
      date: "2024-01-13T09:15:00Z",
      comments: "Votre projet est en cours d'évaluation par le comité scientifique.",
      read: false,
    },
  ])

  // User info based on dashboard type
  const getUserInfo = () => {
    if (isAdminDashboard) {
      return {
        name: "Fatima Benali",
        role: "Directeur Adjoint",
        initials: "FB",
        avatar: "/placeholder.svg?height=32&width=32",
      }
    } else if (isExpertDashboard) {
      return {
        name: "Dr. Hassan Alami",
        role: "Expert Évaluateur",
        initials: "HA",
        avatar: "/placeholder.svg?height=32&width=32",
      }
    } else if (isPoleRechercheDashboard) {
      return {
        name: "Dr. Karim Alami",
        role: "Directeur du Pôle de Recherche",
        initials: "KA",
        avatar: "/placeholder.svg?height=32&width=32",
      }
    } else if (isDivisionRechercheDashboard) {
      return {
        name: "Division Recherche",
        role: "Division Recherche",
        initials: "DR",
        avatar: "/placeholder.svg?height=32&width=32",
      }
    } else if (isMemberDashboard) {
      return {
        name: "Prof. Mohamed Lahby",
        role: "Enseignant-Chercheur",
        initials: "YA",
        avatar: "/placeholder.svg?height=32&width=32",
      }
    } else {
      return {
        name: "Prof. Mohamed Lahby",
        role: "Enseignant chercheur",
        initials: "ML",
        avatar: "/placeholder.svg?height=32&width=32",
      }
    }
  }

  const userInfo = getUserInfo()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (action: Notification["action"]) => {
    const statusConfig = {
      approved: { label: "Approuvé", color: "bg-green-100 text-green-800 border-green-200" },
      rejected: { label: "Rejeté", color: "bg-red-100 text-red-800 border-red-200" },
      under_review: { label: "En révision", color: "bg-blue-100 text-blue-800 border-blue-200" },
      pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
    }
    const config = statusConfig[action]
    return (
      <Badge variant="outline" className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    )
  }

  const getActionIcon = (action: Notification["action"]) => {
    switch (action) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "under_review":
        return <Eye className="h-4 w-4 text-blue-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.action === "approved") {
      // Rediriger vers la page de complément d'informations
      router.push(`/dashboard-member/projet-approuve/${notification.projectId}`)
    } else {
      // Pour les autres types de notifications, on pourrait rediriger vers une page de détails
      console.log("Notification clicked:", notification)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Mobile menu button */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Right side - Notifications and User menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 max-h-80 overflow-y-auto shadow-md border border-gray-200">
              <DropdownMenuLabel className="flex items-center justify-between p-3 border-b bg-gray-50">
                <span className="text-sm font-semibold text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <div className="w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount}
                  </div>
                )}
              </DropdownMenuLabel>
              {notifications.length > 0 ? (
                <div className="p-1">
                  {notifications.map((notification, index) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className="p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="w-full">
                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-2 leading-tight">
                            {notification.projectTitle}
                          </p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                              notification.action === "approved" ? "bg-green-100 text-green-800 border border-green-200" :
                              notification.action === "rejected" ? "bg-red-100 text-red-800 border border-red-200" :
                              notification.action === "under_review" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                              "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}>
                              {notification.action === "approved" ? "Approuvé" :
                               notification.action === "rejected" ? "Rejeté" :
                               notification.action === "under_review" ? "En révision" :
                               "En attente"}
                            </span>
                            <span className="text-gray-400 font-medium">•</span>
                            <span className="text-gray-600 font-medium">{formatDate(notification.date)}</span>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Aucune notification</p>
                  <p className="text-xs text-gray-500 mt-1">Vous serez notifié ici des mises à jour</p>
                </div>
              )}
              {notifications.length > 0 && (
                <div className="p-2 border-t bg-gray-50">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full text-xs text-gray-700 hover:text-gray-900 hover:bg-white transition-colors"
                  >
                    Voir toutes
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userInfo.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{userInfo.initials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">{userInfo.name}</div>
                  <div className="text-xs text-gray-500">{userInfo.role}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
