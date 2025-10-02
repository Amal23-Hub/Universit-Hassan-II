"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Send, Clock, CheckCircle, XCircle, Search, Filter, Eye, Edit, DollarSign, Calendar, TrendingUp, AlertTriangle, FileText, Users, ArrowUpDown, Download, Upload, FileCheck, RefreshCw, Settings, Info, X } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface ProjetSoumis {
  id: string
  titre: string
  description: string
  statut: "en_attente" | "en_evaluation" | "approuve" | "rejete"
  dateSoumission: string
  dateLimite: string
  programme: string
  budgetDemande: number
  duree: string
  commentaires?: string
  priorite?: "basse" | "moyenne" | "haute"
  membres?: number
  documents?: number
}

const projetsSoumis: ProjetSoumis[] = [
  {
    id: "PS001",
    titre: "Développement d'un système de surveillance environnementale intelligent",
    description: "Projet visant à créer un système IoT pour la surveillance en temps réel de la qualité de l'air et de l'eau",
    statut: "en_evaluation",
    dateSoumission: "2024-02-15",
    dateLimite: "2024-04-15",
    programme: "Programme National de Recherche en IA",
    budgetDemande: 180000,
    duree: "24 mois",
    commentaires: "Projet en cours d'évaluation par le comité scientifique",
    priorite: "haute",
    membres: 5,
    documents: 8
  },
  {
    id: "PS002",
    titre: "Étude comparative des méthodes d'enseignement en ligne",
    description: "Analyse comparative de l'efficacité des différentes plateformes d'enseignement à distance",
    statut: "en_attente",
    dateSoumission: "2024-03-01",
    dateLimite: "2024-05-01",
    programme: "Programme de Recherche en Éducation",
    budgetDemande: 95000,
    duree: "18 mois",
    priorite: "moyenne",
    membres: 3,
    documents: 5
  },
  {
    id: "PS003",
    titre: "Optimisation des algorithmes de machine learning pour la finance",
    description: "Développement d'algorithmes prédictifs pour l'analyse des marchés financiers",
    statut: "approuve",
    dateSoumission: "2024-01-10",
    dateLimite: "2024-03-10",
    programme: "Programme de Recherche en Finance",
    budgetDemande: 220000,
    duree: "30 mois",
    commentaires: "Projet approuvé avec modifications mineures",
    priorite: "haute",
    membres: 7,
    documents: 12
  }
]

export default function ProjetsSoumis() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [programmeFilter, setProgrammeFilter] = useState<string>("all")
  const [anneeFilter, setAnneeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("dateSoumission")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedProjet, setSelectedProjet] = useState<ProjetSoumis | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  
  // Référence pour le timer de réinitialisation automatique
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null)

  const getDaysRemaining = (dateLimite: string) => {
    const today = new Date()
    const limite = new Date(dateLimite)
    const diffTime = limite.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusInfo = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return { label: "En attente", color: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock }
      case "en_evaluation":
        return { label: "En évaluation", color: "bg-gray-100 text-gray-800 border-gray-200", icon: Send }
      case "approuve":
        return { label: "Approuvé", color: "bg-gray-100 text-gray-800 border-gray-200", icon: CheckCircle }
      case "rejete":
        return { label: "Rejeté", color: "bg-gray-100 text-gray-800 border-gray-200", icon: XCircle }
      default:
        return { label: "Inconnu", color: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock }
    }
  }

  const getPriorityInfo = (priorite?: string) => {
    switch (priorite) {
      case "haute":
        return { label: "Haute", color: "bg-gray-100 text-gray-800 border-gray-200" }
      case "moyenne":
        return { label: "Moyenne", color: "bg-gray-100 text-gray-800 border-gray-200" }
      case "basse":
        return { label: "Basse", color: "bg-gray-100 text-gray-800 border-gray-200" }
      default:
        return { label: "Non définie", color: "bg-gray-100 text-gray-800 border-gray-200" }
    }
  }

  // Statistiques
  const stats = {
    total: projetsSoumis.length,
    enAttente: projetsSoumis.filter(p => p.statut === "en_attente").length,
    enEvaluation: projetsSoumis.filter(p => p.statut === "en_evaluation").length,
    approuves: projetsSoumis.filter(p => p.statut === "approuve").length,
    rejetes: projetsSoumis.filter(p => p.statut === "rejete").length,
    budgetTotal: projetsSoumis.reduce((sum, p) => sum + p.budgetDemande, 0),
    urgent: projetsSoumis.filter(p => {
      const daysRemaining = getDaysRemaining(p.dateLimite)
      return (p.statut === "en_attente" || p.statut === "en_evaluation") && daysRemaining < 7
    }).length
  }

  const filteredProjets = projetsSoumis
    .filter(projet => {
      const matchesSearch = projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           projet.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || projet.statut === statusFilter
      const matchesProgramme = programmeFilter === "all" || projet.programme === programmeFilter
      const matchesAnnee = anneeFilter === "all" || new Date(projet.dateSoumission).getFullYear().toString() === anneeFilter
      
      return matchesSearch && matchesStatus && matchesProgramme && matchesAnnee
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof ProjetSoumis]
      let bValue: any = b[sortBy as keyof ProjetSoumis]
      
      if (sortBy === "dateSoumission" || sortBy === "dateLimite") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const programmes = [...new Set(projetsSoumis.map(p => p.programme))]
  const annees = [...new Set(projetsSoumis.map(p => new Date(p.dateSoumission).getFullYear()))].sort((a, b) => b - a)

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  // Fonction pour générer un PDF
  const handleGeneratePDF = (projet: ProjetSoumis) => {
    setSelectedProjet(projet)
    setShowPDFModal(true)
  }

  // Fonction pour télécharger le document signé
  const handleDownloadSigned = (projet: ProjetSoumis) => {
    console.log("Téléchargement du document signé pour le projet:", projet.titre)
    // Simulation de téléchargement du document signé
    const link = document.createElement('a')
    link.href = '/convention-signee-exemple.pdf' // Chemin vers le document signé
    link.download = `projet-${projet.id}-signe-${projet.titre.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Fonction pour uploader le document signé
  const handleUploadSigned = (projet: ProjetSoumis) => {
    setSelectedProjet(projet)
    setShowUploadModal(true)
  }

  // Fonction pour gérer la sélection de fichier
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  // Fonction pour confirmer l'upload
  const handleConfirmUpload = () => {
    if (uploadedFile && selectedProjet) {
      console.log("Fichier uploadé:", uploadedFile.name, "pour le projet:", selectedProjet.titre)
      // Ici vous pouvez envoyer le fichier au serveur
      alert(`Document signé uploadé avec succès pour le projet: ${selectedProjet.titre}`)
      setShowUploadModal(false)
      setUploadedFile(null)
      setSelectedProjet(null)
    }
  }

  // Fonction pour annuler l'upload
  const handleCancelUpload = () => {
    setShowUploadModal(false)
    setUploadedFile(null)
    setSelectedProjet(null)
  }

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = () => {
    if (selectedProjet) {
      console.log("Téléchargement du PDF pour le projet:", selectedProjet.titre)
      // Simulation de téléchargement du PDF
      const link = document.createElement('a')
      link.href = '/convention-exemple.pdf' // Chemin vers un PDF d'exemple
      link.download = `projet-${selectedProjet.id}-${selectedProjet.titre.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setShowPDFModal(false)
      setSelectedProjet(null)
    }
  }

  // Fonction pour annuler la génération PDF
  const handleCancelPDF = () => {
    setShowPDFModal(false)
    setSelectedProjet(null)
  }

  const handleVoirDetails = (projet: ProjetSoumis) => {
    setSelectedProjet(projet)
    setShowDetailsDialog(true)
  }

  // Fonction de réinitialisation des filtres
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setProgrammeFilter("all")
    setAnneeFilter("all")
    setSortBy("dateSoumission")
    setSortOrder("desc")
  }

  // Réinitialisation automatique après 5 minutes d'inactivité
  useEffect(() => {
    const handleUserActivity = () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
      
      // Démarrer un nouveau timer de 5 minutes
      resetTimerRef.current = setTimeout(() => {
        resetFilters()
      }, 5 * 60 * 1000) // 5 minutes
    }

    // Écouter les événements d'activité utilisateur
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true)
    })

    // Démarrer le timer initial
    handleUserActivity()

    // Nettoyage
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true)
      })
    }
  }, [])

  // Réinitialisation automatique quand l'utilisateur quitte la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      resetFilters()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="p-4 space-y-4">
            {/* Header simplifié */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mes projets soumis</h1>
                  <p className="text-gray-600 text-sm">Suivez l'état de vos soumissions de projets et gérez vos demandes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {stats.total} projet(s) soumis
                  </Badge>
                </div>
              </div>
            </div>

            {/* Section de recherche et filtres améliorée - AVANT les statistiques */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  Recherche et filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Barre de recherche principale */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un projet par titre, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                  />
                </div>

                {/* Filtres en grille */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Statut</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-sm">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts ({stats.total})</SelectItem>
                        <SelectItem value="en_attente">En attente ({stats.enAttente})</SelectItem>
                        <SelectItem value="en_evaluation">En évaluation ({stats.enEvaluation})</SelectItem>
                        <SelectItem value="approuve">Approuvé ({stats.approuves})</SelectItem>
                        <SelectItem value="rejete">Rejeté ({stats.rejetes})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Programme</Label>
                    <Select value={programmeFilter} onValueChange={setProgrammeFilter}>
                      <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-sm">
                        <SelectValue placeholder="Tous les programmes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les programmes</SelectItem>
                        {programmes.map(programme => (
                          <SelectItem key={programme} value={programme}>
                            {programme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Année</Label>
                    <Select value={anneeFilter} onValueChange={setAnneeFilter}>
                      <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-sm">
                        <SelectValue placeholder="Toutes les années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les années</SelectItem>
                        {annees.map(annee => (
                          <SelectItem key={annee} value={annee.toString()}>
                            {annee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{filteredProjets.length} projet(s) trouvé(s)</span>
                    {(searchTerm || statusFilter !== "all" || programmeFilter !== "all" || anneeFilter !== "all") && (
                      <Badge variant="outline" className="text-xs">
                        Filtres actifs
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <Card className="bg-white border-l-4 border-slate-900 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">En attente</p>
                      <p className="text-xl font-bold text-gray-900">{stats.enAttente}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-900/10 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-900" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-l-4 border-slate-900 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">En évaluation</p>
                      <p className="text-xl font-bold text-gray-900">{stats.enEvaluation}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-900/10 rounded-lg flex items-center justify-center">
                      <Send className="h-4 w-4 text-blue-900" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-l-4 border-slate-900 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Approuvés</p>
                      <p className="text-xl font-bold text-gray-900">{stats.approuves}</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-900/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-blue-900" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-l-4 border-slate-900 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Budget total</p>
                      <p className="text-xl font-bold text-gray-900">{stats.budgetTotal.toLocaleString()} MAD</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-900/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-blue-900" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des projets améliorée */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Projet
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Programme
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-uh2c-blue/10 transition-colors"
                            onClick={() => handleSort("budgetDemande")}>
                          Budget
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Durée
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-uh2c-blue/10 transition-colors"
                            onClick={() => handleSort("dateSoumission")}>
                          Date soumission
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-uh2c-blue/10 transition-colors"
                            onClick={() => handleSort("dateLimite")}>
                          Date limite
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Délai
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Générer PDF
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Upload
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProjets.map((projet) => {
                        const statusInfo = getStatusInfo(projet.statut)
                        const priorityInfo = getPriorityInfo(projet.priorite)
                        const StatusIcon = statusInfo.icon
                        const daysRemaining = getDaysRemaining(projet.dateLimite)
                        
                        return (
                          <tr key={projet.id}>
                            <td className="px-4 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {projet.titre}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {projet.programme}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3 text-gray-400" />
                                {projet.budgetDemande.toLocaleString()} MAD
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {projet.duree}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(projet.dateSoumission).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(projet.dateLimite).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-900">
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              {(projet.statut === "en_attente" || projet.statut === "en_evaluation") ? (
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  daysRemaining < 7 
                                    ? 'bg-red-100 text-red-800' 
                                    : daysRemaining < 30 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {daysRemaining > 0 ? `${daysRemaining} jour(s)` : 'Expiré'}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 w-full"
                                onClick={() => handleGeneratePDF(projet)}
                              >
                                <FileCheck className="h-3 w-3 mr-1" />
                                Générer PDF
                              </Button>
                            </td>
                            <td className="px-4 py-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2 text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 w-full"
                                onClick={() => handleUploadSigned(projet)}
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Upload
                              </Button>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div className="flex gap-1 justify-center">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleVoirDetails(projet)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                {(projet.statut === "en_attente" || projet.statut === "en_evaluation") && (
                                  <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* État vide amélioré */}
            {filteredProjets.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || statusFilter !== "all" || programmeFilter !== "all" || anneeFilter !== "all"
                      ? "Aucun projet ne correspond à vos critères de recherche."
                      : "Vous n'avez pas encore soumis de projets."}
                  </p>
                  {!searchTerm && statusFilter === "all" && programmeFilter === "all" && anneeFilter === "all" && (
                    <Button className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Soumettre votre premier projet
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Modal d'upload de document signé */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Upload className="h-4 w-4 text-blue-600" />
              Upload Document Signé
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Sélectionnez le document PDF signé pour le projet
            </DialogDescription>
          </DialogHeader>
          
          {selectedProjet && (
            <div className="space-y-3">
              {/* Informations du projet */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <h4 className="font-medium text-blue-800 text-xs mb-1">Projet sélectionné</h4>
                <p className="text-xs text-blue-700">{selectedProjet.titre}</p>
              </div>

              {/* Zone d'upload */}
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="text-xs font-medium text-gray-700">
                  Document signé (PDF)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  {!uploadedFile ? (
                    <>
                      <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600 mb-1">Cliquez pour sélectionner</p>
                      <p className="text-xs text-gray-500">PDF uniquement, max 10MB</p>
                      <input
                        type="file"
                        id="file-upload"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-1 text-xs"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Sélectionner un fichier
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <FileCheck className="mx-auto h-6 w-6 text-green-600" />
                      <p className="text-xs font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        Changer de fichier
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <div className="flex items-start gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 text-xs">Important</h4>
                    <p className="text-xs text-yellow-700 mt-0.5">
                      Document signé requis. PDF uniquement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancelUpload}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmUpload}
              disabled={!uploadedFile}
              className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Confirmer l'upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de génération PDF */}
      <Dialog open={showPDFModal} onOpenChange={setShowPDFModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-blue-600" />
              Générer PDF
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Téléchargez le document à signer
            </DialogDescription>
          </DialogHeader>
          
          {selectedProjet && (
            <div className="space-y-4">
              {/* Informations du projet */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-800 text-sm mb-1">Projet sélectionné</h4>
                <p className="text-sm text-blue-700">{selectedProjet.titre}</p>
              </div>

              {/* Aperçu du document */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileCheck className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Document à signer</span>
                </div>
                <p className="text-sm text-gray-600">
                  Convention de financement - {selectedProjet.programme}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Format: PDF • Taille: ~2.5 MB
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <div className="flex items-start gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 text-xs">Important</h4>
                    <p className="text-xs text-yellow-700 mt-0.5">
                      Signez le document puis uploadez-le via le bouton "Upload".
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={handleCancelPDF}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleDownloadPDF}
              className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal des détails du projet */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Info className="h-3 w-3 text-blue-600" />
              Détails du projet
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Informations complètes sur le projet soumis
            </DialogDescription>
          </DialogHeader>
          
          {selectedProjet && (
            <div className="space-y-3">
              {/* Informations principales du projet */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                <h3 className="font-semibold text-blue-900 text-xs mb-1">{selectedProjet.titre}</h3>
                <p className="text-blue-700 text-xs mb-1">{selectedProjet.description}</p>
                
                <div className="flex items-center gap-2 text-xs">
                  <Badge className={`${getStatusInfo(selectedProjet.statut).color} text-xs`}>
                    {(() => {
                      const StatusIcon = getStatusInfo(selectedProjet.statut).icon
                      return <StatusIcon className="h-3 w-3 mr-1" />
                    })()}
                    {getStatusInfo(selectedProjet.statut).label}
                  </Badge>
                  <span className="text-gray-600">
                    Soumis le {new Date(selectedProjet.dateSoumission).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Informations du projet */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 text-xs">Informations du projet</h4>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Programme:</span>
                      <span className="font-medium">{selectedProjet.programme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thématique:</span>
                      <span className="font-medium">Intelligence Artificielle</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Laboratoire:</span>
                      <span className="font-medium">Laboratoire de Bioinformatique et de Génomique</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée:</span>
                      <span className="font-medium">{selectedProjet.duree}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date limite:</span>
                      <span className="font-medium">{new Date(selectedProjet.dateLimite).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 text-xs">Statistiques</h4>
                  <div className="space-y-0.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Membres:</span>
                      <span className="font-medium">{selectedProjet.membres || 0} personne(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documents:</span>
                      <span className="font-medium">{selectedProjet.documents || 0} fichier(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priorité:</span>
                      <Badge className={`${getPriorityInfo(selectedProjet.priorite).color} text-xs`}>
                        {getPriorityInfo(selectedProjet.priorite).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget détaillé */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                <h4 className="font-semibold text-gray-900 text-xs mb-1">Budget demandé</h4>
                <div className="text-base font-bold text-gray-900">
                  {selectedProjet.budgetDemande.toLocaleString()} MAD
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Budget total demandé pour la durée du projet
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetailsDialog(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 