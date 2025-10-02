"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { LayoutDashboard, Users, UserCheck, AlertCircle, Building2, Search, UserPlus, CheckSquare } from "lucide-react"

interface Laboratory {
  id: string
  acronyme: string
  intitule: string
  directeur: string
  documents: {
    fr: boolean
    pa: boolean
    ri: boolean
    pv: boolean
    cvd: boolean
  }
}

export default function DashboardAdmin() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [laboratories] = useState<Laboratory[]>([
    {
      id: "73",
      acronyme: "LISFA",
      intitule: "Laboratoire Interdisciplinaire des Sciences Fondamentales et Appliquées",
      directeur: "Pr HOUSSINE AZEDDOUG",
      documents: { fr: true, pa: true, ri: true, pv: true, cvd: true },
    },
    {
      id: "75",
      acronyme: "MINDLab",
      intitule: "Mathématiques, Intelligence artificielle et apprentissage Digital",
      directeur: "Pr MOHAMED LAHBY",
      documents: { fr: true, pa: true, ri: true, pv: true, cvd: true },
    },
  ])

  // KPI data for admin dashboard
  const kpiData = {
    // Row 1
    totalUsers: 203,
    totalAccounts: 89,
    pendingValidations: 8,
    // Row 2
    totalLaboratories: 15,
    totalResearchers: 156,
    researchDomains: 12,
  }

  const handleConsulterDemande = (labId: string) => {
    console.log("Consulter demande pour laboratoire:", labId)
  }

  const handleConsulterPorteur = (labId: string) => {
    console.log("Consulter porteur de projets pour laboratoire:", labId)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
              <p className="text-gray-600 mt-2">Bienvenue, Fatima Benali - Directeur Adjoint</p>
            </div>

            {/* Admin Profile Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>FB</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Fatima Benali</CardTitle>
                    <CardDescription>Directeur Adjoint</CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      Administration UH2C
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Admin KPIs - Row 1 */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques générales</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{kpiData.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">Total système</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Comptes</CardTitle>
                    <UserCheck className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{kpiData.totalAccounts}</div>
                    <p className="text-xs text-muted-foreground">Créés</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Validations</CardTitle>
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{kpiData.pendingValidations}</div>
                    <p className="text-xs text-muted-foreground">En attente</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Admin KPIs - Row 2 */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques de recherche</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Laboratoires</CardTitle>
                    <Building2 className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{kpiData.totalLaboratories}</div>
                    <p className="text-xs text-muted-foreground">Total actifs</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-teal-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Chercheurs</CardTitle>
                    <Users className="h-4 w-4 text-teal-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-teal-600">{kpiData.totalResearchers}</div>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Domaines de recherche</CardTitle>
                    <Search className="h-4 w-4 text-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-600">{kpiData.researchDomains}</div>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="space-y-8">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Actions rapides
                  </CardTitle>
                  <CardDescription>Accès rapide aux fonctionnalités principales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-16 bg-green-600 hover:bg-green-700" asChild>
                      <a href="/dashboard-admin/users">
                        <div className="text-center">
                          <UserPlus className="h-6 w-6 mx-auto mb-2" />
                          <div>Demandes d'inscription</div>
                        </div>
                      </a>
                    </Button>
                    <Button className="h-16 bg-blue-600 hover:bg-blue-700" asChild>
                      <a href="/dashboard-admin/demandes">
                        <div className="text-center">
                          <CheckSquare className="h-6 w-6 mx-auto mb-2" />
                          <div>Validation laboratoire</div>
                        </div>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-l-4 border-l-gray-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-700">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Activités récentes
                  </CardTitle>
                  <CardDescription>Dernières actions et notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nouvelle demande d'inscription</p>
                        <p className="text-xs text-gray-500">Dr. ALAMI HASSAN - il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Validation laboratoire en attente</p>
                        <p className="text-xs text-gray-500">Laboratoire LISFA - il y a 4 heures</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Laboratoire validé</p>
                        <p className="text-xs text-gray-500">MINDLab - Validation complète - il y a 6 heures</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
