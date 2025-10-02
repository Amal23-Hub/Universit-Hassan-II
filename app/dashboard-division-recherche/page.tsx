"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { 
  BarChart3, 
  FileText, 
  Users, 
  Calendar,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  CheckSquare,
  XCircle,
  DollarSign,
  Target,
  PieChart,
  Activity
} from "lucide-react"

export default function DashboardDivisionRecherche() {
  const [stats] = useState({
    projetsRetenus: 45,
    projetsEnEvaluation: 23,
    projetsRejetes: 12,
    projetsApprouves: 34,
    budgetTotalAlloue: 8500000,
    budgetUtilise: 5200000,
    tauxValidation: 74,
    delaiMoyenEvaluation: 15
  })



  const [recentActivities] = useState([
    {
      id: 1,
      type: "validation",
      action: "Projet retenu",
      description: "IA pour la santé préventive - Dr. Ahmed Benali",
      time: "Il y a 2 heures",
      status: "approved",
      budget: 450000
    },
    {
      id: 2,
      type: "evaluation",
      action: "Projet en évaluation",
      description: "Cybersécurité avancée - Dr. Fatima El Mansouri",
      time: "Il y a 4 heures",
      status: "pending",
      budget: 320000
    },
    {
      id: 3,
      type: "rejection",
      action: "Projet rejeté",
      description: "Optimisation énergétique - Dr. Karim Alami",
      time: "Il y a 6 heures",
      status: "rejected",
      budget: 280000
    },
    {
      id: 4,
      type: "budget",
      action: "Budget alloué",
      description: "Programme Énergies Renouvelables",
      time: "Il y a 1 jour",
      status: "completed",
      budget: 1200000
    },
    {
      id: 5,
      type: "validation",
      action: "Projet approuvé",
      description: "Biotechnologie marine - Dr. Sara El Harti",
      time: "Il y a 2 jours",
      status: "approved",
      budget: 680000
    }
  ])

  const [quickActions] = useState([
    {
      title: "Évaluer nouveaux projets",
      description: "Examiner les projets soumis",
      icon: Eye,
      href: "/dashboard-division-recherche/projets-retenus",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Rapport mensuel",
      description: "Générer le rapport de validation",
      icon: FileText,
      href: "#",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Gestion budget",
      description: "Suivre l'allocation des fonds",
      icon: DollarSign,
      href: "#",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Statistiques",
      description: "Voir les métriques détaillées",
      icon: PieChart,
      href: "#",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "completed":
        return <CheckSquare className="h-4 w-4 text-blue-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé"
      case "pending":
        return "En évaluation"
      case "completed":
        return "Terminé"
      case "rejected":
        return "Rejeté"
      default:
        return "En attente"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord - UH2C</h1>
              <p className="text-gray-600 mt-2">Gestion et validation des projets de recherche</p>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {quickActions.map((action, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900">{action.title}</h3>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">projet de recherche</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.projetsRetenus}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckSquare className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-green-600">+8</span>
                      <span className="text-gray-500 ml-1">ce mois</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">En Évaluation</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.projetsEnEvaluation}</p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500">Délai moyen: {stats.delaiMoyenEvaluation} jours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taux de Validation</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.tauxValidation}%</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500">Projets approuvés</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Budget Alloué</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.budgetTotalAlloue)}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500">Utilisé: {formatCurrency(stats.budgetUtilise)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphique et activités récentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Graphique de répartition */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Répartition des Projets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">Approuvés</span>
                      </div>
                      <span className="text-sm font-medium">{stats.projetsApprouves}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm">En évaluation</span>
                      </div>
                      <span className="text-sm font-medium">{stats.projetsEnEvaluation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm">Rejetés</span>
                      </div>
                      <span className="text-sm font-medium">{stats.projetsRejetes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activités récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Activités Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center space-x-2">
                              <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                                {getStatusLabel(activity.status)}
                              </Badge>
                              <span className="text-xs text-gray-500">{activity.time}</span>
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {formatCurrency(activity.budget)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métriques de performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats.projetsApprouves}</div>
                    <p className="text-sm text-gray-600">Projets Approuvés</p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(stats.projetsApprouves / stats.projetsRetenus) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.delaiMoyenEvaluation}</div>
                    <p className="text-sm text-gray-600">Jours d'Évaluation Moyen</p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full" 
                          style={{ width: `${(stats.delaiMoyenEvaluation / 30) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stats.tauxValidation}%</div>
                    <p className="text-sm text-gray-600">Taux de Validation</p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${stats.tauxValidation}%` }}
                        ></div>
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