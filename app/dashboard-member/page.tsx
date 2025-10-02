"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { LayoutDashboard, Users, BookOpen, FileText, Award, TrendingUp, Clock, Crown, History } from "lucide-react"

interface TeamMember {
  id: string
  nom: string
  prenom: string
  role: string
  isLeader: boolean
  avatar?: string
}

interface HistoricalAffiliation {
  period: string
  laboratoire: string
  equipe: string
  role: string
}



export default function DashboardMember() {
  const [currentTeam] = useState<TeamMember[]>([
    {
      id: "1",
      nom: "LAHBY",
      prenom: "MOHAMED",
      role: "Chef d'équipe",
      isLeader: true,
    },
    {
      id: "2",
      nom: "ALAMI",
      prenom: "YOUSSEF",
      role: "Enseignant-Chercheur",
      isLeader: false,
    },
    {
      id: "3",
      nom: "BENALI",
      prenom: "SARA",
      role: "Doctorant",
      isLeader: false,
    },
    {
      id: "4",
      nom: "CHAKIR",
      prenom: "AHMED",
      role: "Post-doctorant",
      isLeader: false,
    },
  ])

  const [historicalAffiliations] = useState<HistoricalAffiliation[]>([
    {
      period: "2020-2024",
      laboratoire: "MINDLab",
      equipe: "Intelligence Artificielle",
      role: "Enseignant-Chercheur",
    },
    {
      period: "2018-2020",
      laboratoire: "LIIAN",
      equipe: "Réseaux et Sécurité",
      role: "Chercheur Associé",
    },
    {
      period: "2015-2018",
      laboratoire: "LISFA",
      equipe: "Systèmes Distribués",
      role: "Doctorant",
    },
  ])

  // Member-specific KPI data
  const memberStats = {
    publications: 23,
    communications: 15,
    projets: 8,
    citations: 156,
    hIndex: 12,
    collaborations: 34,
  }



  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Personnel</h1>
                              <p className="text-gray-600 mt-2">Bienvenue, Prof. Mohamed Lahby - Enseignant-Chercheur</p>
            </div>

            {/* Member Profile Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" />
                    <AvatarFallback>YA</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Prof. Mohamed Lahby</CardTitle>
                    <CardDescription>Enseignant-Chercheur</CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="bg-uh2c-blue/10 text-uh2c-blue">
                        MINDLab
                      </Badge>
                      <Badge variant="outline">Intelligence Artificielle</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Member Statistics */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mes statistiques</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Publications</CardTitle>
                    <BookOpen className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{memberStats.publications}</div>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Communications</CardTitle>
                    <FileText className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{memberStats.communications}</div>
                    <p className="text-xs text-muted-foreground">Présentées</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projets</CardTitle>
                    <Award className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{memberStats.projets}</div>
                    <p className="text-xs text-muted-foreground">Participés</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Citations</CardTitle>
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{memberStats.citations}</div>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-teal-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">H-Index</CardTitle>
                    <TrendingUp className="h-4 w-4 text-teal-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-teal-600">{memberStats.hIndex}</div>
                    <p className="text-xs text-muted-foreground">Impact</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-indigo-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
                    <Users className="h-4 w-4 text-indigo-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-600">{memberStats.collaborations}</div>
                    <p className="text-xs text-muted-foreground">Actives</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Current Team */}
            <Card className="border-l-4 border-l-uh2c-blue mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-uh2c-blue">
                  <Users className="h-5 w-5 mr-2" />
                  Mon équipe actuelle
                </CardTitle>
                <CardDescription>Équipe Intelligence Artificielle - MINDLab</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentTeam.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        member.isLeader
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.prenom.charAt(0)}
                          {member.nom.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">
                            {member.prenom} {member.nom}
                          </p>
                          {member.isLeader && <Crown className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historical Affiliations */}
            <Card className="border-l-4 border-l-gray-500 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-700">
                  <History className="h-5 w-5 mr-2" />
                  Historique des affiliations
                </CardTitle>
                <CardDescription>Vos précédentes affiliations laboratoires et équipes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historicalAffiliations.map((affiliation, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{affiliation.laboratoire}</h4>
                          <p className="text-sm text-gray-600">{affiliation.equipe}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {affiliation.role}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-uh2c-blue">{affiliation.period}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Actions rapides
                </CardTitle>
                <CardDescription>Accès rapide à vos fonctionnalités principales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="h-16 bg-blue-600 hover:bg-blue-700" asChild>
                    <a href="/publications">
                      <div className="text-center">
                        <BookOpen className="h-6 w-6 mx-auto mb-2" />
                        <div>Mes Publications</div>
                      </div>
                    </a>
                  </Button>
                  <Button className="h-16 bg-green-600 hover:bg-green-700" asChild>
                    <a href="/projets-contrats">
                      <div className="text-center">
                        <Award className="h-6 w-6 mx-auto mb-2" />
                        <div>Mes Projets</div>
                      </div>
                    </a>
                  </Button>
                  <Button className="h-16 bg-purple-600 hover:bg-purple-700" asChild>
                    <a href="/communications">
                      <div className="text-center">
                        <FileText className="h-6 w-6 mx-auto mb-2" />
                        <div>Communications</div>
                      </div>
                    </a>
                  </Button>
                  <Button className="h-16 bg-orange-600 hover:bg-orange-700" asChild>
                    <a href="/encadrement-theses">
                      <div className="text-center">
                        <Users className="h-6 w-6 mx-auto mb-2" />
                        <div>Encadrements</div>
                      </div>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
