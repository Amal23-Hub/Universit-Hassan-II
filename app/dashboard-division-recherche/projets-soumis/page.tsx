"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { BookOpen, ArrowRight, FileText, Calendar, Users, Filter, Search, RefreshCw, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface Programme {
  id: string
  nom: string
  description: string
  dateOuverture: string
  dateLimite: string
  nombreProjets: number
  statut: "en_cours" | "termine" | "inactif"
  budgetTotal: number
}

interface AppelProjet {
  id: string
  titre: string
  programme: string
  description: string
  dateOuverture: string
  dateLimite: string
  nombreProjets: number
  statut: "ouvert" | "ferme" | "en_evaluation"
  budgetTotal: number
}

export default function ProjetsSoumisPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"appels" | "programmes">("appels")
  const [programmes, setProgrammes] = useState<Programme[]>([
    {
      id: "1",
      nom: "Programme National de Recherche en Intelligence Artificielle",
      description: "Développement de solutions innovantes en IA pour l'industrie et la société",
      dateOuverture: "2024-01-15",
      dateLimite: "2024-06-30",
      nombreProjets: 12,
      statut: "en_cours",
      budgetTotal: 5000000
    },
    {
      id: "2",
      nom: "Programme de Recherche en Énergies Renouvelables",
      description: "Innovation technologique dans le domaine des énergies vertes",
      dateOuverture: "2024-02-01",
      dateLimite: "2024-07-31",
      nombreProjets: 8,
      statut: "en_cours",
      budgetTotal: 3000000
    },
    {
      id: "3",
      nom: "Programme de Recherche en Santé Numérique",
      description: "Technologies numériques pour améliorer les soins de santé",
      dateOuverture: "2024-01-20",
      dateLimite: "2024-05-15",
      nombreProjets: 15,
      statut: "en_cours",
      budgetTotal: 4500000
    },
    {
      id: "4",
      nom: "Programme de Recherche en Agriculture Intelligente",
      description: "Intégration des technologies numériques dans l'agriculture",
      dateOuverture: "2024-03-01",
      dateLimite: "2024-08-31",
      nombreProjets: 6,
      statut: "en_cours",
      budgetTotal: 2000000
    },
    {
      id: "5",
      nom: "Programme de Recherche en Cybersécurité",
      description: "Protection des infrastructures critiques et des données",
      dateOuverture: "2024-02-15",
      dateLimite: "2024-07-15",
      nombreProjets: 10,
      statut: "en_cours",
      budgetTotal: 3500000
    },
    {
      id: "6",
      nom: "Programme de Recherche en Biotechnologie",
      description: "Innovations en biotechnologie pour la santé et l'environnement",
      dateOuverture: "2024-02-10",
      dateLimite: "2024-08-15",
      nombreProjets: 9,
      statut: "en_cours",
      budgetTotal: 2800000
    },
    {
      id: "7",
      nom: "Programme de Recherche en Transport et Mobilité",
      description: "Solutions innovantes pour les transports durables",
      dateOuverture: "2024-01-25",
      dateLimite: "2024-07-20",
      nombreProjets: 7,
      statut: "en_cours",
      budgetTotal: 2200000
    },
    {
      id: "8",
      nom: "Programme de Recherche en Économie Numérique",
      description: "Transformation digitale de l'économie marocaine",
      dateOuverture: "2024-03-05",
      dateLimite: "2024-09-30",
      nombreProjets: 11,
      statut: "en_cours",
      budgetTotal: 3800000
    },
    {
      id: "9",
      nom: "Programme de Recherche en Climat et Environnement",
      description: "Solutions pour l'adaptation au changement climatique",
      dateOuverture: "2024-02-20",
      dateLimite: "2024-08-25",
      nombreProjets: 13,
      statut: "en_cours",
      budgetTotal: 4200000
    },
    {
      id: "10",
      nom: "Programme de Recherche en Éducation et Formation",
      description: "Innovation pédagogique et technologies éducatives",
      dateOuverture: "2024-01-30",
      dateLimite: "2024-06-25",
      nombreProjets: 5,
      statut: "en_cours",
      budgetTotal: 1800000
    }
  ])

  const [appelsProjets, setAppelsProjets] = useState<AppelProjet[]>([
    {
      id: "AP001",
      titre: "IA pour la santé préventive",
      programme: "Programme National de Recherche en IA",
      description: "Développement d'algorithmes d'intelligence artificielle pour la prévention et le diagnostic précoce des maladies",
      dateOuverture: "2024-01-15",
      dateLimite: "2024-06-30",
      nombreProjets: 5,
      statut: "ouvert",
      budgetTotal: 800000
    },
    {
      id: "AP002",
      titre: "Changement climatique et agriculture",
      programme: "Programme de Recherche Environnementale",
      description: "Étude des impacts du changement climatique sur l'agriculture marocaine",
      dateOuverture: "2024-02-01",
      dateLimite: "2024-07-31",
      nombreProjets: 3,
      statut: "ouvert",
      budgetTotal: 600000
    },
    {
      id: "AP003",
      titre: "Optimisation énergétique des bâtiments",
      programme: "Programme Énergies Renouvelables",
      description: "Solutions innovantes pour l'optimisation énergétique des bâtiments",
      dateOuverture: "2024-03-15",
      dateLimite: "2024-08-31",
      nombreProjets: 4,
      statut: "ouvert",
      budgetTotal: 1000000
    },
    {
      id: "AP004",
      titre: "Cybersécurité des infrastructures critiques",
      programme: "Programme de Recherche en Cybersécurité",
      description: "Protection des systèmes critiques contre les cyberattaques",
      dateOuverture: "2024-02-15",
      dateLimite: "2024-07-15",
      nombreProjets: 6,
      statut: "ouvert",
      budgetTotal: 750000
    },
    {
      id: "AP005",
      titre: "Biotechnologie pour l'environnement",
      programme: "Programme de Recherche en Biotechnologie",
      description: "Applications biotechnologiques pour la protection environnementale",
      dateOuverture: "2024-02-10",
      dateLimite: "2024-08-15",
      nombreProjets: 4,
      statut: "ouvert",
      budgetTotal: 550000
    }
  ])

  const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([])
  const [filteredAppels, setFilteredAppels] = useState<AppelProjet[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [filterBudget, setFilterBudget] = useState<string>("all")
  const [filterProgramme, setFilterProgramme] = useState<string>("all")
  const [filterDate, setFilterDate] = useState<string>("all")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "termine":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      case "inactif":
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
      case "ouvert":
        return <Badge className="bg-green-100 text-green-800">Ouvert</Badge>
      case "ferme":
        return <Badge className="bg-red-100 text-red-800">Fermé</Badge>
      case "en_evaluation":
        return <Badge className="bg-yellow-100 text-yellow-800">En évaluation</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{statut}</Badge>
    }
  }

  const handleVoirProjets = (programmeId: string) => {
    router.push(`/dashboard-division-recherche/projets-soumis/${programmeId}`)
  }

  const getUniqueProgrammes = () => {
    const programmesList = activeTab === "appels" 
      ? appelsProjets.map(a => a.programme)
      : programmes.map(p => p.nom)
    return [...new Set(programmesList)]
  }

  const getUniqueStatuts = () => {
    const statuts = activeTab === "appels" 
      ? appelsProjets.map(a => a.statut)
      : programmes.map(p => p.statut)
    return [...new Set(statuts)]
  }

  const totalProjets = programmes.reduce((sum, programme) => sum + programme.nombreProjets, 0) + 
                      appelsProjets.reduce((sum, appel) => sum + appel.nombreProjets, 0)
  const totalBudget = programmes.reduce((sum, programme) => sum + programme.budgetTotal, 0) + 
                     appelsProjets.reduce((sum, appel) => sum + appel.budgetTotal, 0)

  // Appliquer les filtres
  useEffect(() => {
    if (activeTab === "appels") {
      let filtered = appelsProjets

      if (searchTerm) {
        filtered = filtered.filter(appel =>
          appel.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appel.programme.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (filterStatut !== "all") {
        filtered = filtered.filter(appel => appel.statut === filterStatut)
      }

      if (filterBudget !== "all") {
        const budgetRanges = {
          "small": (budget: number) => budget < 500000,
          "medium": (budget: number) => budget >= 500000 && budget < 1000000,
          "large": (budget: number) => budget >= 1000000
        }
        filtered = filtered.filter(appel => budgetRanges[filterBudget as keyof typeof budgetRanges](appel.budgetTotal))
      }

      if (filterProgramme !== "all") {
        filtered = filtered.filter(appel => appel.programme === filterProgramme)
      }

      if (filterDate !== "all") {
        const now = new Date()
        const dateRanges = {
          "recent": (date: string) => {
            const dateObj = new Date(date)
            const diffTime = Math.abs(now.getTime() - dateObj.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 30
          },
          "upcoming": (date: string) => {
            const dateObj = new Date(date)
            return dateObj > now
          },
          "expired": (date: string) => {
            const dateObj = new Date(date)
            return dateObj < now
          }
        }
        filtered = filtered.filter(appel => dateRanges[filterDate as keyof typeof dateRanges](appel.dateLimite))
      }

      setFilteredAppels(filtered)
    } else {
      let filtered = programmes

      if (searchTerm) {
        filtered = filtered.filter(programme =>
          programme.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          programme.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (filterStatut !== "all") {
        filtered = filtered.filter(programme => programme.statut === filterStatut)
      }

      if (filterBudget !== "all") {
        const budgetRanges = {
          "small": (budget: number) => budget < 2000000,
          "medium": (budget: number) => budget >= 2000000 && budget < 4000000,
          "large": (budget: number) => budget >= 4000000
        }
        filtered = filtered.filter(programme => budgetRanges[filterBudget as keyof typeof budgetRanges](programme.budgetTotal))
      }

      if (filterDate !== "all") {
        const now = new Date()
        const dateRanges = {
          "recent": (date: string) => {
            const dateObj = new Date(date)
            const diffTime = Math.abs(now.getTime() - dateObj.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 30
          },
          "upcoming": (date: string) => {
            const dateObj = new Date(date)
            return dateObj > now
          },
          "expired": (date: string) => {
            const dateObj = new Date(date)
            return dateObj < now
          }
        }
        filtered = filtered.filter(programme => dateRanges[filterDate as keyof typeof dateRanges](programme.dateLimite))
      }

      setFilteredProgrammes(filtered)
    }
  }, [programmes, appelsProjets, searchTerm, filterStatut, filterBudget, filterProgramme, filterDate, activeTab])

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-6 w-6 text-uh2c-blue" />
                <h1 className="text-2xl font-bold text-gray-900">Projets soumis</h1>
              </div>
            </div>

            {/* Filtres simplifiés */}
            <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Barre de recherche principale */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <Input
                    placeholder="Rechercher par nom ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Filtres de base */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Statut</Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {activeTab === "appels" ? (
                          <>
                            <SelectItem value="ouvert">Ouvert</SelectItem>
                            <SelectItem value="ferme">Fermé</SelectItem>
                            <SelectItem value="en_evaluation">En évaluation</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="termine">Terminé</SelectItem>
                            <SelectItem value="inactif">Inactif</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Budget</Label>
                    <Select value={filterBudget} onValueChange={setFilterBudget}>
                      <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Tous les budgets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les budgets</SelectItem>
                        {activeTab === "appels" ? (
                          <>
                            <SelectItem value="small">Petit budget (&lt; 500K MAD)</SelectItem>
                            <SelectItem value="medium">Budget moyen (500K-1M MAD)</SelectItem>
                            <SelectItem value="large">Gros budget (&gt; 1M MAD)</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="small">Petit budget (&lt; 2M MAD)</SelectItem>
                            <SelectItem value="medium">Budget moyen (2M-4M MAD)</SelectItem>
                            <SelectItem value="large">Gros budget (&gt; 4M MAD)</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {activeTab === "appels" && (
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700">Programme</Label>
                      <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                        <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                          <SelectValue placeholder="Tous les programmes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les programmes</SelectItem>
                          {getUniqueProgrammes().map((programme) => (
                            <SelectItem key={programme} value={programme}>
                              {programme}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Date limite</Label>
                    <Select value={filterDate} onValueChange={setFilterDate}>
                      <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Toutes les dates" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les dates</SelectItem>
                        <SelectItem value="recent">Récent (30 derniers jours)</SelectItem>
                        <SelectItem value="upcoming">À venir</SelectItem>
                        <SelectItem value="expired">Expiré</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Résultats de recherche */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-600">
                    {activeTab === "appels" 
                      ? `${filteredAppels.length} appel(s) à projets trouvé(s)`
                      : `${filteredProgrammes.length} programme(s) trouvé(s)`
                    }
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>Filtres actifs:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Recherche: "{searchTerm}"
                      </Badge>
                    )}
                    {filterStatut !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Statut: {filterStatut}
                      </Badge>
                    )}
                    {filterBudget !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Budget: {filterBudget}
                      </Badge>
                    )}
                    {filterProgramme !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Programme: {filterProgramme}
                      </Badge>
                    )}
                    {filterDate !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Date: {filterDate}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets pour les deux volets */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("appels")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "appels"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Appels à projets
                </button>
                <button
                  onClick={() => setActiveTab("programmes")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "programmes"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Programmes
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-l-4 border-l-uh2c-blue">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Total des projets</p>
                      <p className="text-xl font-bold text-gray-900">{totalProjets}</p>
                    </div>
                    <FileText className="h-6 w-6 text-uh2c-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        {activeTab === "appels" ? "Appels actifs" : "Programmes actifs"}
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {activeTab === "appels" 
                          ? appelsProjets.filter(a => a.statut === "ouvert").length
                          : programmes.filter(p => p.statut === "en_cours").length
                        }
                      </p>
                    </div>
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Budget total</p>
                      <p className="text-xl font-bold text-gray-900">{formatBudget(totalBudget)}</p>
                    </div>
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des éléments selon l'onglet actif */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {activeTab === "appels" ? "Appels à projets" : "Programmes de recherche"}
                </h2>
                <Badge variant="outline" className="text-xs">
                  {activeTab === "appels" 
                    ? `${filteredAppels.length} appel(s) à projets`
                    : `${filteredProgrammes.length} programme(s)`
                  }
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {activeTab === "appels" ? (
                  filteredAppels.map((appel) => (
                    <Card key={appel.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base font-semibold text-gray-900 mb-1">
                              {appel.titre}
                            </CardTitle>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {appel.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Ouvert: {formatDate(appel.dateOuverture)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Limite: {formatDate(appel.dateLimite)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <BookOpen className="h-3 w-3" />
                              <span>Programme: {appel.programme}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {getStatutBadge(appel.statut)}
                            <Badge variant="secondary" className="text-xs">
                              {formatBudget(appel.budgetTotal)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-600">
                              {appel.nombreProjets} projet(s) soumis
                            </span>
                          </div>
                          <Button
                            onClick={() => handleVoirProjets(appel.id)}
                            className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white text-xs"
                            size="sm"
                          >
                            Voir les projets
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  filteredProgrammes.map((programme) => (
                  <Card key={programme.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base font-semibold text-gray-900 mb-1">
                            {programme.nom}
                          </CardTitle>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {programme.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Ouvert: {formatDate(programme.dateOuverture)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Limite: {formatDate(programme.dateLimite)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatutBadge(programme.statut)}
                          <Badge variant="secondary" className="text-xs">
                            {formatBudget(programme.budgetTotal)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {programme.nombreProjets} projet(s) soumis
                          </span>
                        </div>
                        <Button
                          onClick={() => handleVoirProjets(programme.id)}
                          className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white text-xs"
                          size="sm"
                        >
                          Voir les projets
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 