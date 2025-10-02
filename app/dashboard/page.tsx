// Copie du contenu original du dashboard-member/page.tsx ici pour restaurer le dashboard principal

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

export default function Dashboard() {
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

  const recentActivities = [
    {
      type: "publication",
      title: "Nouvelle publication acceptée",
      description: "Article sur l'IA dans IEEE Transactions",
      date: "il y a 2 jours",
      color: "blue",
    },
    {
      type: "project",
      title: "Projet financé approuvé",
      description: "Financement CNRST obtenu",
      date: "il y a 1 semaine",
      color: "green",
    },
    {
      type: "collaboration",
      title: "Nouvelle collaboration",
      description: "Partenariat avec Université de Rabat",
      date: "il y a 2 semaines",
      color: "purple",
    },
  ]

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
                    <p className="text-xs text-muted-foreground">Scopus</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pink-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Collaborations</CardTitle>
                    <Users className="h-4 w-4 text-pink-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-pink-600">{memberStats.collaborations}</div>
                    <p className="text-xs text-muted-foreground">Partenaires</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Current Team and Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Mon équipe actuelle</span>
                  </CardTitle>
                  <CardDescription>Équipe Intelligence Artificielle - MINDLab</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentTeam.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-xs">
                              {member.prenom.charAt(0)}{member.nom.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {member.prenom} {member.nom}
                              {member.isLeader && (
                                <Crown className="inline h-3 w-3 ml-1 text-yellow-500" />
                              )}
                            </p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        {member.isLeader && (
                          <Badge variant="secondary" className="text-xs">
                            Chef d'équipe
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Activités récentes</span>
                  </CardTitle>
                  <CardDescription>Vos dernières activités et accomplissements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 bg-${activity.color}-500`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Historical Affiliations */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="h-5 w-5" />
                    <span>Historique des affiliations</span>
                  </CardTitle>
                  <CardDescription>Votre parcours académique et professionnel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {historicalAffiliations.map((affiliation, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                            <span className="text-uh2c-blue font-medium text-sm">
                              {affiliation.period.split('-')[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{affiliation.laboratoire}</p>
                            <p className="text-sm text-gray-600">{affiliation.equipe}</p>
                            <p className="text-xs text-gray-500">{affiliation.role}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{affiliation.period}</Badge>
                      </div>
                    ))}
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
