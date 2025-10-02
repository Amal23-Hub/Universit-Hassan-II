"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  BookOpen,
  MessageSquare,
  Award,
  Shield,
  GraduationCap,
  Calendar,
  UserPlus,
  CheckSquare,
  FlaskConical,
  Target,
  DollarSign,
  FileCheck,
  Calculator,
  List,
  CheckCircle,
  Send,
  XCircle,
  ChevronDown,
  UserCheck,
  CalendarPlus,
  Heart,
  Handshake,
} from "lucide-react"

interface NavigationItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  children?: NavigationItem[]
}

const memberNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-member",
    icon: BarChart3,
  },
  // {
  //   title: "Soumission Appel à Projet",
  //   href: "/dashboard-member/soumission-appel",
  //   icon: Target,
  // },
  {
    title: "Publications",
    href: "/publications",
    icon: BookOpen,
  },
  {
    title: "Distinctions & Prix",
    href: "/distinctions-prix",
    icon: Award,
  },
  {
    title: "Liste des programmes",
    href: "/appels-projets",
    icon: List,
  },
  {
    title: "Mes projets retenus",
    href: "/projets-contrats",
    icon: FileText,
  },
  {
    title: "Manifestations Scientifiques",
    icon: Calendar,
    children: [
      {
        title: "Mes manifestations",
        href: "/manifestations-scientifiques/mes-manifestations",
        icon: Calendar,
      },
      {
        title: "Participation à une manifestation",
        href: "/manifestations-scientifiques/participation-manifestation-member",
        icon: UserCheck,
      },
      {
        title: "Organisation d'une manifestation",
        href: "/manifestations-scientifiques/organisation-manifestation-member",
        icon: CalendarPlus,
      },
    ],
  },
  {
    title: "Soutien",
    href: "/soutien",
    icon: Handshake,
  },
  // {
  //   title: "Programme d'emploi",
  //   href: "/dashboard-member/programme-emploi",
  //   icon: Calculator,
  // },
]

const adminNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-admin",
    icon: BarChart3,
  },
  {
    title: "Demande d'inscription",
    href: "/dashboard-admin/users",
    icon: UserPlus,
    badge: "12",
  },
  {
    title: "Validation laboratoire",
    href: "/dashboard-admin/demandes",
    icon: CheckSquare,
    badge: "5",
  },
]

const expertNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-expert",
    icon: BarChart3,
  },
]

const poleRechercheNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-polerecherche",
    icon: BarChart3,
  },
  {
    title: "Programmes",
    href: "/dashboard-polerecherche/programmes",
    icon: FlaskConical,
  },
  {
    title: "Demandes de projets",
    href: "/dashboard-polerecherche/demandes",
    icon: FileText,
    badge: "5",
  },
]

const divisionRechercheNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-division-recherche",
    icon: BarChart3,
  },
  {
    title: "projet de recherche",
    href: "/dashboard-division-recherche/projets-retenus",
    icon: CheckSquare,
  },
  {
    title: "Conventions",
    href: "/dashboard-division-recherche/conventions",
    icon: FileText,
  },
  {
    title: "Gestion des Versements",
    href: "/dashboard-division-recherche/versements",
    icon: DollarSign,
  },
  {
    title: "État d'avancement",
    href: "/dashboard-division-recherche/avancement",
    icon: FileCheck,
  },
]

const memberDashboardNavigation: NavigationItem[] = [
  {
    title: "Tableau de bord",
    href: "/dashboard-member",
    icon: BarChart3,
  },
  {
    title: "Laboratoire de Recherche",
    href: "/laboratoire-recherche",
    icon: FlaskConical,
  },
  // {
  //   title: "Soumission Appel à Projet",
  //   href: "/dashboard-member/soumission-appel",
  //   icon: Target,
  // },
  {
    title: "Publications",
    href: "/publications",
    icon: BookOpen,
  },
  {
    title: "Distinctions & Prix",
    href: "/distinctions-prix",
    icon: Award,
  },
  {
    title: "Appels à projets",
    href: "/appels-projets",
    icon: List,
  },
  {
    title: "Mes projets",
    icon: FileText,
    children: [
      {
        title: "Projets retenus",
        href: "/mes-projets/projets-retenus",
        icon: CheckCircle,
      },
      {
        title: "Projets soumis",
        href: "/mes-projets/projets-soumis",
        icon: Send,
      },
      {
        title: "Projets non retenus",
        href: "/mes-projets/projets-non-retenus",
        icon: XCircle,
      },
    ],
  },
  {
    title: "Manifestations Scientifiques",
    icon: Calendar,
    children: [
      {
        title: "Mes manifestations",
        href: "/manifestations-scientifiques/mes-manifestations",
        icon: Calendar,
      },
      {
        title: "Participation à une manifestation",
        href: "/manifestations-scientifiques/participation-manifestation-member",
        icon: UserCheck,
      },
      {
        title: "Organisation d'une manifestation",
        href: "/manifestations-scientifiques/organisation-manifestation-member",
        icon: CalendarPlus,
      },
    ],
  },
  {
    title: "Soutien",
    href: "/soutien",
    icon: Handshake,
  },
  // {
  //   title: "Programme d'emploi",
  //   href: "/dashboard-member/programme-emploi",
  //   icon: Calculator,
  // },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const pathname = usePathname()

  // Determine which navigation to show based on current path
  const getNavigation = () => {
    if (pathname.startsWith("/dashboard-admin")) {
      return adminNavigation
    }
    if (pathname.startsWith("/dashboard-expert")) {
      return expertNavigation
    }
    if (pathname.startsWith("/dashboard-polerecherche")) {
      return poleRechercheNavigation
    }
    if (pathname.startsWith("/dashboard-division-recherche")) {
      return divisionRechercheNavigation
    }
    if (pathname.startsWith("/dashboard-member") || pathname === "/distinctions-prix" || pathname === "/publications" || pathname === "/projets-contrats" || pathname === "/teams" || pathname === "/laboratoire-recherche" || pathname.startsWith("/manifestations-scientifiques") || pathname === "/appels-projets" || pathname.startsWith("/mes-projets") || pathname === "/soutien") {
      return memberDashboardNavigation
    }
    return memberNavigation
  }

  const navigation = getNavigation()

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isMenuExpanded = (title: string) => expandedMenus.includes(title)
  const isChildActive = (children: NavigationItem[]) => {
    return children.some(child => child.href && pathname === child.href)
  }

  return (
    <div
      className={cn(
        "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-12" : "w-48",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="UH2C Logo" width={24} height={24} className="rounded" />
            <span className="font-semibold text-gray-900 text-sm">UH2C</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-6 w-6 p-0">
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1",
        isCollapsed ? "py-3 flex flex-col items-center space-y-1" : "p-3 space-y-1"
      )}>
        {navigation.map((item) => {
          const isActive = item.href ? pathname === item.href : false
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = isMenuExpanded(item.title)
          const isChildActiveState = hasChildren ? isChildActive(item.children!) : false

          if (hasChildren) {
            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    "flex items-center space-x-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors w-full",
                    (isActive || isChildActiveState) ? "bg-uh2c-blue text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    isCollapsed && "justify-center px-0 py-1.5"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronDown className={cn(
                        "h-3 w-3 transition-transform",
                        isExpanded ? "rotate-180" : ""
                      )} />
                    </>
                  )}
                </button>
                
                {!isCollapsed && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children!.map((child) => {
                      const isChildActive = pathname === child.href
                      return (
                        <Link key={child.href} href={child.href!}>
                          <div
                            className={cn(
                              "flex items-center space-x-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                              isChildActive ? "bg-uh2c-blue/20 text-uh2c-blue" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <child.icon className="h-3 w-3 flex-shrink-0" />
                            <span className="flex-1">{child.title}</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link key={item.href} href={item.href!}>
              <div
                className={cn(
                  "flex items-center space-x-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                  isActive ? "bg-uh2c-blue text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                  isCollapsed && "justify-center px-0 py-1.5"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-gray-200", isCollapsed ? "p-2" : "p-3") }>
        <Link href="/">
          <div
            className={cn(
              "flex items-center space-x-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
              "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              isCollapsed && "justify-center px-0 py-1.5"
            )}
          >
            <Home className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Accueil</span>}
          </div>
        </Link>
      </div>
    </div>
  )
}
