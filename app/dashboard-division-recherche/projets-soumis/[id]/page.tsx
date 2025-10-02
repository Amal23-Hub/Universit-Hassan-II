"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  User, 
  Building, 
  Calendar, 
  DollarSign, 
  Clock, 
  Send, 
  AlertTriangle,
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Download,
  Upload,
  Info,
  MessageSquare,
  Bookmark,
  Settings,
  X,
  BookOpen,
  Activity,
  MapPin,
  FileCheck
} from "lucide-react"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
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
  porteur?: {
    nom: string
    email: string
    telephone: string
    institution: string
    departement: string
  }
  thematique?: string
  laboratoire?: string
}

interface TrancheFinancement {
  numero: number
  montant: number
}

const projetsSoumis: ProjetSoumis[] = [
  {
    id: "PS001",
    titre: "Développement d'algorithmes d'IA pour l'éducation personnalisée",
    description: "Développement d'un système d'IA pour personnaliser l'apprentissage selon les besoins de chaque étudiant",
    statut: "en_attente",
    dateSoumission: "2024-02-15",
    dateLimite: "2024-04-15",
    programme: "Programme National de Recherche en Intelligence Artificielle",
    budgetDemande: 500000,
    duree: "24 mois",
    priorite: "haute",
    membres: 5,
    documents: 8,
    porteur: {
      nom: "Dr. Ahmed BENALI",
      email: "ahmed.benali@uh2c.ac.ma",
      telephone: "+212 6 12 34 56 78",
      institution: "Université Hassan II",
      departement: "Département d'Informatique"
    },
    thematique: "Intelligence Artificielle",
    laboratoire: "Laboratoire de Bioinformatique et de Génomique"
  },
  {
    id: "PS002",
    titre: "Système de surveillance environnementale intelligent",
    description: "Projet visant à créer un système IoT pour la surveillance en temps réel de la qualité de l'air et de l'eau",
    statut: "en_attente",
    dateSoumission: "2024-03-01",
    dateLimite: "2024-05-01",
    programme: "Programme National de Recherche en Intelligence Artificielle",
    budgetDemande: 750000,
    duree: "18 mois",
    priorite: "moyenne",
    membres: 3,
    documents: 5,
    porteur: {
      nom: "Dr. Fatima Zahra El Amrani",
      email: "fatima.elamrani@uh2c.ac.ma",
      telephone: "+212 6 98 76 54 32",
      institution: "Université Hassan II",
      departement: "Département des Sciences de l'Environnement"
    },
    thematique: "Intelligence Artificielle",
    laboratoire: "Laboratoire de Recherche en Environnement"
  },
  {
    id: "PS003",
    titre: "Optimisation des algorithmes de machine learning pour la finance",
    description: "Développement d'algorithmes prédictifs pour l'analyse des marchés financiers",
    statut: "en_attente",
    dateSoumission: "2024-01-10",
    dateLimite: "2024-03-10",
    programme: "Programme National de Recherche en Intelligence Artificielle",
    budgetDemande: 600000,
    duree: "30 mois",
    priorite: "haute",
    membres: 7,
    documents: 12,
    porteur: {
      nom: "Dr. Karim Mansouri",
      email: "karim.mansouri@uh2c.ac.ma",
      telephone: "+212 6 55 44 33 22",
      institution: "Université Hassan II",
      departement: "Département de Mathématiques"
    },
    thematique: "Intelligence Artificielle",
    laboratoire: "Laboratoire de Mathématiques Appliquées"
  }
]

export default function ProjetsSoumis() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [thematiqueFilter, setThematiqueFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [showTranchesDialog, setShowTranchesDialog] = useState(false)
  const [showConventionDialog, setShowConventionDialog] = useState(false)
  const [showChoiceDialog, setShowChoiceDialog] = useState(false)
  const [showRejetDialog, setShowRejetDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedProjet, setSelectedProjet] = useState<ProjetSoumis | null>(null)
  const [tranches, setTranches] = useState<TrancheFinancement[]>([
    { numero: 1, montant: 0 }
  ])
  const [commentaireRejet, setCommentaireRejet] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [projetsList, setProjetsList] = useState<ProjetSoumis[]>(projetsSoumis)
  const [selectedConvention, setSelectedConvention] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showConfirmRetenirDialog, setShowConfirmRetenirDialog] = useState(false)

  const getStatusInfo = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return { label: "En attente", color: "bg-yellow-100 text-yellow-800" }
      case "en_evaluation":
        return { label: "En évaluation", color: "bg-blue-100 text-blue-800" }
      case "approuve":
        return { label: "Approuvé", color: "bg-green-100 text-green-800" }
      case "rejete":
        return { label: "Rejeté", color: "bg-red-100 text-red-800" }
      default:
        return { label: "Inconnu", color: "bg-gray-100 text-gray-800" }
    }
  }

  const handleRetenir = (projetId: string) => {
    const projet = projetsSoumis.find(p => p.id === projetId)
    if (projet) {
      setSelectedProjet(projet)
      setShowConfirmRetenirDialog(true)
    }
  }

  const handleConfirmRetenir = () => {
    if (!selectedProjet) return

    // Marquer le projet comme retenu
    const updatedProjets = projetsList.map(p => 
      p.id === selectedProjet.id 
        ? { ...p, statut: "approuve" as const }
        : p
    )
    setProjetsList(updatedProjets)
    
    console.log("Projet retenu:", { 
      projet: selectedProjet, 
      dateRetention: new Date().toLocaleDateString(),
      heureRetention: new Date().toLocaleTimeString()
    })
    
    setShowConfirmRetenirDialog(false)
    setSelectedProjet(null)
  }

  const addTranche = () => {
    setTranches([...tranches, { 
      numero: tranches.length + 1, 
      montant: 0 
    }])
  }

  const removeTranche = (index: number) => {
    if (tranches.length > 1) {
      setTranches(tranches.filter((_, i) => i !== index))
    }
  }

  const updateTranche = (index: number, field: keyof TrancheFinancement, value: any) => {
    const updatedTranches = [...tranches]
    updatedTranches[index] = { ...updatedTranches[index], [field]: value }
    setTranches(updatedTranches)
  }

  const handleRejeter = (projetId: string) => {
    const projet = projetsSoumis.find(p => p.id === projetId)
    if (projet) {
      setSelectedProjet(projet)
      setShowRejetDialog(true)
    }
  }

  const handleConfirmRejet = () => {
    if (!selectedProjet) return

    // Marquer le projet comme rejeté
    const updatedProjets = projetsList.map(p => 
      p.id === selectedProjet.id 
        ? { ...p, statut: "rejete" as const }
        : p
    )
    setProjetsList(updatedProjets)
    
    console.log("Projet rejeté:", { 
      projet: selectedProjet, 
      dateRejet: new Date().toLocaleDateString(),
      heureRejet: new Date().toLocaleTimeString(),
      commentaire: commentaireRejet
    })
    
    setShowRejetDialog(false)
    setSelectedProjet(null)
    setCommentaireRejet("")
  }

  const handleVoirDetails = (projetId: string) => {
    const projet = projetsSoumis.find(p => p.id === projetId)
    if (projet) {
      setSelectedProjet(projet)
      setShowDetailsDialog(true)
    }
  }

  const handleSuivre = (projetId: string) => {
    const projet = projetsSoumis.find(p => p.id === projetId)
    if (projet) {
      setSelectedProjet(projet)
      setShowChoiceDialog(true)
    }
  }

  const handleGeneratePDF = (projet: ProjetSoumis) => {
    setSelectedProjet(projet)
    setShowPDFModal(true)
  }

  const handleUploadSigned = (projet: ProjetSoumis) => {
    setSelectedProjet(projet)
    setShowUploadModal(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleConfirmUpload = () => {
    if (uploadedFile) {
      console.log("Fichier uploadé:", uploadedFile.name)
      setShowUploadModal(false)
      setUploadedFile(null)
      setSelectedProjet(null)
    }
  }

  const handleCancelUpload = () => {
    setShowUploadModal(false)
    setUploadedFile(null)
    setSelectedProjet(null)
  }

  const handleDownloadPDF = () => {
    // Simulation du téléchargement
    console.log("Téléchargement du PDF...")
    setShowPDFModal(false)
    setSelectedProjet(null)
  }

  const handleCancelPDF = () => {
    setShowPDFModal(false)
    setSelectedProjet(null)
  }

  const handleChoiceConfigurer = () => {
    setShowChoiceDialog(false)
    setShowTranchesDialog(true)
  }

  const handleChoiceConvention = () => {
    setShowChoiceDialog(false)
    setShowConventionDialog(true)
  }

  const handleConfigurerTranches = () => {
    setShowTranchesDialog(false)
    // Logique pour configurer les tranches
    console.log("Configuration des tranches terminée")
  }

  // Filtrer les projets selon les critères
  const filteredProjets = projetsList.filter(projet => {
    const matchesSearch = searchTerm === "" || 
      projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.porteur?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.thematique?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || projet.statut === statusFilter
    const matchesThematique = thematiqueFilter === "all" || (projet.thematique && projet.thematique === thematiqueFilter)

    const matchesDate = dateFilter === "all" || (() => {
      const now = new Date()
      const projetDate = new Date(projet.dateSoumission)
      const diffTime = Math.abs(now.getTime() - projetDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      switch (dateFilter) {
        case "recent":
          return diffDays <= 30
        case "upcoming":
          return projetDate > now
        case "expired":
          return projetDate < now
        default:
          return true
      }
    })()

    return matchesSearch && matchesStatus && matchesThematique && matchesDate
  })

  const thematiques = [...new Set(projetsSoumis.map(p => p.thematique).filter((t): t is string => Boolean(t)))]

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

  return (
    <div className="flex h-screen bg-gray-100">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="p-6 space-y-6">
            {/* En-tête avec navigation et titre */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.history.back()}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Retour
                </Button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-2xl font-bold text-gray-900">Projets soumis</h1>
              </div>
            </div>

            {/* Message de succès simplifié */}
            {showSuccessMessage && (
              <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
                <div className="bg-white text-gray-900 rounded-lg shadow-lg p-4 max-w-md border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-1">Projet retenu avec succès</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{successMessage}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Approuvé le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Header du programme avec design moderne */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                      Programme National
                    </Badge>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                    Programme National de Recherche en Intelligence Artificielle
                  </h2>
                  <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                    Développement de solutions innovantes en IA pour l'industrie et la société
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Date d'ouverture</p>
                        <p className="text-sm font-semibold text-gray-900">15/01/2024</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100">
                      <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-3 w-3 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Date limite</p>
                        <p className="text-sm font-semibold text-gray-900">30/06/2024</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-blue-100">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-3 w-3 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Budget total</p>
                        <p className="text-sm font-semibold text-gray-900">5.000.000 MAD</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres et recherche */}
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
                    placeholder="Rechercher par titre, coordonnateur..."
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Statut</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="en_attente">En attente</SelectItem>
                        <SelectItem value="en_evaluation">En évaluation</SelectItem>
                        <SelectItem value="approuve">Approuvé</SelectItem>
                        <SelectItem value="rejete">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Thématique</Label>
                    <Select value={thematiqueFilter} onValueChange={setThematiqueFilter}>
                      <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Toutes les thématiques" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les thématiques</SelectItem>
                        {thematiques.map(thematique => (
                          <SelectItem key={thematique} value={thematique}>{thematique}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Date</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Toutes les dates" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les dates</SelectItem>
                        <SelectItem value="recent">Récentes (≤ 30 jours)</SelectItem>
                        <SelectItem value="upcoming">À venir (≥ 1 jour)</SelectItem>
                        <SelectItem value="expired">Expirées (≤ 0 jours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Résultats de recherche */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-600">
                    {filteredProjets.length} projet(s) trouvé(s)
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>Filtres actifs:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Recherche: "{searchTerm}"
                      </Badge>
                    )}
                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Statut: {statusFilter}
                      </Badge>
                    )}
                    {thematiqueFilter !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Thématique: {thematiqueFilter}
                      </Badge>
                    )}
                    {dateFilter !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Date: {dateFilter}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-l-4 border-l-uh2c-blue">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Total des projets</p>
                      <p className="text-xl font-bold text-gray-900">{filteredProjets.length}</p>
                    </div>
                    <FileText className="h-6 w-6 text-uh2c-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-uh2c-blue">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">En attente</p>
                      <p className="text-xl font-bold text-gray-900">
                        {filteredProjets.filter(p => p.statut === "en_attente").length}
                      </p>
                    </div>
                    <Clock className="h-6 w-6 text-uh2c-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-uh2c-blue">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">En évaluation</p>
                      <p className="text-xl font-bold text-gray-900">
                        {filteredProjets.filter(p => p.statut === "en_evaluation").length}
                      </p>
                    </div>
                    <Activity className="h-6 w-6 text-uh2c-blue" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-uh2c-blue">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Budget total</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatBudget(filteredProjets.reduce((sum, p) => sum + p.budgetDemande, 0))}
                      </p>
                    </div>
                    <DollarSign className="h-6 w-6 text-uh2c-blue" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des projets */}
            <div className="space-y-3">
              {filteredProjets.map((projet) => {
                const statusInfo = getStatusInfo(projet.statut)
                
                return (
                  <Card key={projet.id} className="border-l-4 border-uh2c-blue hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Titre du projet */}
                          <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                            {projet.titre}
                          </h3>
                          
                          {/* Informations principales en grille */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <User className="h-3 w-3 text-blue-600" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Porteur</p>
                                <p className="text-sm font-semibold text-gray-900">{projet.porteur?.nom}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Building className="h-3 w-3 text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Institution</p>
                                <p className="text-sm font-semibold text-gray-900">{projet.porteur?.institution}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <Calendar className="h-3 w-3 text-orange-600" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Date de soumission</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {new Date(projet.dateSoumission).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Description et informations secondaires */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {projet.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <BookOpen className="h-3 w-3" />
                                <span>{projet.thematique}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <Badge className={statusInfo.color}>
                                    {statusInfo.label}
                                  </Badge>
                                  {projet.titre === "Système de surveillance environnementale intelligent" && (
                                    <Badge
                                      className="bg-green-100 text-green-800 border-green-200"
                                      title="Convention prête et existante"
                                    >
                                      <FileCheck className="h-3 w-3 mr-1" />
                                      Convention prête
                                    </Badge>
                                  )}
                                  <span className="text-sm font-semibold text-gray-900">
                                    {formatBudget(projet.budgetDemande)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <MapPin className="h-3 w-3" />
                                  <span>{projet.laboratoire}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVoirDetails(projet.id)}
                              className="text-xs h-7"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Détails
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuivre(projet.id)}
                              className="text-xs h-7"
                            >
                              <Activity className="h-3 w-3 mr-1" />
                              Suivre
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetenir(projet.id)}
                              className="text-xs h-7 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Retenir
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejeter(projet.id)}
                              className="text-xs h-7 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* État vide */}
            {filteredProjets.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== "all" || thematiqueFilter !== "all" || dateFilter !== "all"
                      ? "Aucun projet ne correspond à vos critères de recherche."
                      : "Aucun projet en attente pour le moment."}
                  </p>
              </CardContent>
            </Card>
            )}
          </div>
        </main>
      </div>

            {/* Configuration simple des tranches */}
      <Dialog open={showTranchesDialog} onOpenChange={setShowTranchesDialog}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-uh2c-blue" />
              Configuration des tranches
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Définissez la répartition du financement
            </DialogDescription>
          </DialogHeader>
          
                    <div className="space-y-5">
            {/* Configuration des tranches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 text-sm">Tranches de financement</h3>
                  </div>
                <Button onClick={addTranche} variant="outline" size="sm" className="h-7 px-3 text-xs border-uh2c-blue/20 text-uh2c-blue hover:bg-uh2c-blue/10">
                  <Plus className="h-3 w-3 mr-1" />
                  Ajouter
                </Button>
              </div>
              
              <div className="space-y-3">
                {tranches.map((tranche, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-uh2c-blue/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-uh2c-blue/10 text-uh2c-blue rounded-md flex items-center justify-center text-sm font-semibold">
                          {tranche.numero}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">Tranche {tranche.numero}</h4>
                          <p className="text-xs text-gray-500">Montant du financement</p>
                        </div>
                      </div>
                      {tranches.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTranche(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="max-w-xs">
                      <Label htmlFor={`montant-${index}`} className="text-xs font-medium text-gray-700 mb-1 block">
                            Montant (MAD) <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id={`montant-${index}`}
                              type="number"
                              value={tranche.montant}
                              onChange={(e) => updateTranche(index, 'montant', parseInt(e.target.value) || 0)}
                              placeholder="0"
                          className="h-9 text-sm pl-8 border-gray-300 focus:border-uh2c-blue focus:ring-uh2c-blue"
                        />
                        <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Résumé */}
            <div className="bg-uh2c-blue/10 p-3 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2 text-sm">Résumé</h3>
              <div className="space-y-2 mb-2">
                {tranches.map((tranche, index) => (
                  <div key={index} className="border border-uh2c-blue/20 rounded-lg p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-uh2c-blue/20 text-uh2c-blue rounded-full flex items-center justify-center text-xs">
                          {tranche.numero}
                        </span>
                        <span className="text-sm font-medium">Tranche {tranche.numero}</span>
                      </span>
                      <span className="font-bold text-sm">{tranche.montant.toLocaleString()} MAD</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      {/* Informations simplifiées - seulement le montant */}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-uh2c-blue/20 pt-2 space-y-2">
                <div className="flex justify-between font-medium text-sm">
                  <span>Total:</span>
                  <span>{tranches.reduce((sum, t) => sum + t.montant, 0).toLocaleString()} MAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Budget alloué:</span>
                  <span>{selectedProjet?.budgetDemande.toLocaleString()} MAD</span>
                </div>
                {tranches.reduce((sum, t) => sum + t.montant, 0) !== (selectedProjet?.budgetDemande || 0) && (
                  <div className="text-amber-600 text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Ajustement nécessaire
                  </div>
                )}
                {tranches.reduce((sum, t) => sum + t.montant, 0) === (selectedProjet?.budgetDemande || 0) && (
                  <div className="text-green-600 text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Budget équilibré
                  </div>
                )}
              </div>
            </div>
          </div>



          <DialogFooter className="pt-3">
            <Button variant="outline" size="sm" onClick={() => setShowTranchesDialog(false)} className="h-8 px-4">
              Annuler
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setShowTranchesDialog(false)
              setShowChoiceDialog(true)
            }} className="h-8 px-4">
              Retour
            </Button>
            <Button 
              onClick={handleConfirmRetenir}
              className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white h-8 px-4"
              size="sm"
              disabled={tranches.length === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de choix d'action */}
      <Dialog open={showChoiceDialog} onOpenChange={setShowChoiceDialog}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-5 w-5 text-uh2c-blue" />
              Choisir une action
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Que souhaitez-vous faire avec ce projet ?
            </DialogDescription>
          </DialogHeader>
          
          {selectedProjet && (
            <div className="space-y-3">
              {/* Informations du projet */}
              <div className="bg-gradient-to-r from-uh2c-blue/10 to-indigo-50 border border-uh2c-blue/20 rounded-lg p-3">
                <h4 className="font-semibold text-uh2c-blue text-sm mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Projet sélectionné
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium min-w-[60px]">Titre:</span>
                    <span className="font-semibold text-gray-900 ml-2 flex-1 text-right leading-tight">
                      {selectedProjet.titre}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium min-w-[60px]">Porteur:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedProjet.porteur?.nom}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium min-w-[60px]">Budget:</span>
                    <span className="font-semibold text-green-600">
                      {formatBudget(selectedProjet.budgetDemande)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Options d'action */}
              <div className="grid grid-cols-1 gap-2">
                <Button
                  onClick={handleChoiceConfigurer}
                  variant="outline"
                  className="h-10 justify-start bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-900"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-7 h-7 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                      <Settings className="h-4 w-4 text-uh2c-blue" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm text-gray-900">Configurer les tranches</div>
                      <div className="text-xs text-gray-500">Définir la répartition du budget</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={handleChoiceConvention}
                  variant="outline"
                  className="h-10 justify-start bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-900"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-7 h-7 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                      <Upload className="h-4 w-4 text-uh2c-blue" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm text-gray-900">Upload convention</div>
                      <div className="text-xs text-gray-500">Télécharger le projet signé</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => {
                    setShowChoiceDialog(false)
                    handleGeneratePDF(selectedProjet!)
                  }}
                  variant="outline"
                  className="h-10 justify-start bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-900"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-7 h-7 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-uh2c-blue" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm text-gray-900">Générer PDF</div>
                      <div className="text-xs text-gray-500">Créer le document de convention</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => {
                    setShowChoiceDialog(false)
                    handleUploadSigned(selectedProjet!)
                  }}
                  variant="outline"
                  className="h-10 justify-start bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-900"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-7 h-7 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                      <Upload className="h-4 w-4 text-uh2c-blue" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm text-gray-900">Upload</div>
                      <div className="text-xs text-gray-500">Télécharger le projet signé</div>
                    </div>
                  </div>
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-2">
                <div className="flex items-start gap-2">
                  <Info className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 text-xs">Instructions</h4>
                    <p className="text-xs text-yellow-700">
                      Choisissez l'action appropriée selon l'étape de traitement du projet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowChoiceDialog(false)}
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowChoiceDialog(false)
                setShowConfirmRetenirDialog(false)
              }}
              size="sm"
              className="border-uh2c-blue/30 text-uh2c-blue hover:bg-uh2c-blue/10"
            >
              Retour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Convention */}
      <Dialog open={showConventionDialog} onOpenChange={setShowConventionDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-uh2c-blue" />
              Convention
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Gérer la convention du projet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5">
                                    {/* Gestion de la convention */}
            <div className="space-y-4">
            
                          <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Upload de la convention</Label>
                  {!selectedConvention ? (
                                          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-uh2c-blue/30 transition-colors">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Cliquez pour télécharger ou glissez-déposez</p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX jusqu'à 10MB</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="convention-upload-modal"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedConvention(e.target.files[0])
                            console.log('Convention sélectionnée:', e.target.files[0].name)
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => document.getElementById('convention-upload-modal')?.click()}
                      >
                        Sélectionner un fichier
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2 border-2 border-uh2c-blue/20 bg-uh2c-blue/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-uh2c-blue" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{selectedConvention.name}</p>
                            <p className="text-xs text-gray-500">{(selectedConvention.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedConvention(null)}
                          className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="h-4 w-4 text-uh2c-blue" />
                  <span>La convention sera automatiquement associée au projet lors de la confirmation</span>
                </div>
                </div>
              </div>
          </div>

          <DialogFooter className="pt-3">
            <Button variant="outline" size="sm" onClick={() => setShowConventionDialog(false)} className="h-8 px-4">
              Annuler
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              setShowConventionDialog(false)
              setShowChoiceDialog(true)
            }} className="h-8 px-4">
              Retour
            </Button>
            <Button 
              onClick={() => {
                setShowConventionDialog(false)
                // Ici vous pouvez ajouter la logique pour traiter la convention
                console.log('Convention confirmée pour le projet:', selectedProjet?.titre)
              }}
              className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white h-8 px-4"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de rejet avec commentaire */}
      <Dialog open={showRejetDialog} onOpenChange={setShowRejetDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600 flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter le projet
            </DialogTitle>
            <DialogDescription>
              Confirmez le rejet et ajoutez un commentaire optionnel
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Informations du projet */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="font-medium text-red-800 mb-2 text-sm">Projet à rejeter</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-red-700">Titre:</span>
                  <span className="font-medium truncate ml-2">{selectedProjet?.titre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Porteur:</span>
                  <span className="font-medium">{selectedProjet?.porteur?.nom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Budget:</span>
                  <span className="font-medium">{selectedProjet?.budgetDemande.toLocaleString()} MAD</span>
                </div>
              </div>
            </div>

            {/* Commentaire de rejet */}
            <div>
              <Label htmlFor="commentaire-rejet" className="text-sm font-medium text-gray-700">
                Commentaire (optionnel)
              </Label>
              <Textarea
                id="commentaire-rejet"
                placeholder="Raisons du rejet..."
                value={commentaireRejet}
                onChange={(e) => setCommentaireRejet(e.target.value)}
                className="mt-1 min-h-[80px] text-sm"
              />
            </div>

            {/* Avertissement */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 text-sm">Action irréversible</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Le statut du projet sera définitivement changé à "Rejeté".
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowRejetDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmRejet}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation pour retenir */}
      <Dialog open={showConfirmRetenirDialog} onOpenChange={setShowConfirmRetenirDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmer la rétention
            </DialogTitle>
            <DialogDescription>
              Confirmez que vous souhaitez retenir ce projet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Informations du projet */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h3 className="font-medium text-green-800 mb-2 text-sm">Projet à retenir</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-green-700">Titre:</span>
                  <span className="font-medium truncate ml-2">{selectedProjet?.titre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Porteur:</span>
                  <span className="font-medium">{selectedProjet?.porteur?.nom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Budget:</span>
                  <span className="font-medium">{selectedProjet?.budgetDemande.toLocaleString()} MAD</span>
                </div>
              </div>
            </div>

            {/* Avertissement */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 text-sm">Configuration requise</h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Vous devrez configurer les tranches de financement après confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowConfirmRetenirDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleConfigurerTranches}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurer les tranches
              </Button>
            </div>
            <Button 
              onClick={handleConfirmRetenir}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de détails du projet */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Détails du projet
            </DialogTitle>
          </DialogHeader>
          
          {selectedProjet && (
            <div className="space-y-4">
              {/* En-tête du projet */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{selectedProjet.titre}</h2>
                <p className="text-sm text-gray-600 mb-3">{selectedProjet.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusInfo(selectedProjet.statut).color}>
                      {getStatusInfo(selectedProjet.statut).label}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Soumis le {selectedProjet.dateSoumission}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {selectedProjet.budgetDemande.toLocaleString()} MAD
                    </div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-1 gap-4">
                {/* Informations du porteur */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-600" />
                    Porteur du projet
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Nom:</span>
                      <span className="font-medium ml-1">{selectedProjet.porteur?.nom}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium ml-1">{selectedProjet.porteur?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Téléphone:</span>
                      <span className="font-medium ml-1">{selectedProjet.porteur?.telephone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Institution:</span>
                      <span className="font-medium ml-1">{selectedProjet.porteur?.institution}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Département:</span>
                      <span className="font-medium ml-1">{selectedProjet.porteur?.departement}</span>
                    </div>
                  </div>
                </div>

                {/* Informations du projet */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                    <FileText className="h-4 w-4 text-green-600" />
                    Informations du projet
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Programme:</span>
                      <span className="font-medium ml-1">{selectedProjet.programme}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Thématique:</span>
                      <span className="font-medium ml-1">{selectedProjet.thematique}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Laboratoire:</span>
                      <span className="font-medium ml-1">{selectedProjet.laboratoire}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Durée:</span>
                      <span className="font-medium ml-1">{selectedProjet.duree}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date limite:</span>
                      <span className="font-medium ml-1">{selectedProjet.dateLimite}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Membres:</span>
                      <span className="font-medium ml-1">{selectedProjet.membres || 0} personne(s)</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Documents:</span>
                      <span className="font-medium ml-1">{selectedProjet.documents || 0} fichier(s)</span>
                    </div>
                  </div>
                </div>

                {/* Commentaires */}
                {selectedProjet.commentaires && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                      Commentaires
                    </h3>
                    <p className="text-xs text-gray-700">{selectedProjet.commentaires}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
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

      {/* Modal de génération PDF */}
      <Dialog open={showPDFModal} onOpenChange={setShowPDFModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-uh2c-blue" />
              Générer PDF
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Téléchargez le document à signer
            </DialogDescription>
          </DialogHeader>
          
          {selectedProjet && (
            <div className="space-y-4">
              {/* Informations du projet */}
              <div className="bg-uh2c-blue/10 border border-uh2c-blue/20 rounded-lg p-3">
                <h4 className="font-medium text-uh2c-blue text-sm mb-1">Projet sélectionné</h4>
                <p className="text-sm text-uh2c-blue/80">{selectedProjet.titre}</p>
              </div>

              {/* Aperçu du document */}
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-uh2c-blue" />
                  <span className="text-sm font-medium text-gray-900">Document à signer</span>
                </div>
                <p className="text-xs text-gray-600">
                  Convention de financement - {selectedProjet.programme}
                </p>
                <p className="text-xs text-gray-500 mt-1">
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
              size="sm"
            >
              Annuler
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPDFModal(false)
                setShowChoiceDialog(true)
              }}
              size="sm"
            >
              Retour
            </Button>
            <Button 
              onClick={handleDownloadPDF}
              className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'upload de document signé */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Upload className="h-4 w-4 text-uh2c-blue" />
              Upload Document Signé
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Sélectionnez le document PDF signé pour le projet
            </DialogDescription>
          </DialogHeader>
          
          {selectedProjet && (
            <div className="space-y-4">
              {/* Informations du projet */}
              <div className="bg-uh2c-blue/10 border border-uh2c-blue/20 rounded-lg p-3">
                <h4 className="font-medium text-uh2c-blue text-sm mb-1">Projet sélectionné</h4>
                <p className="text-sm text-uh2c-blue/80">{selectedProjet.titre}</p>
              </div>

              {/* Upload de fichier */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Document signé (PDF)</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Cliquez pour sélectionner PDF uniquement, max 10MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="upload-signed"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('upload-signed')?.click()}
                  >
                    Sélectionner un fichier
                  </Button>
                </div>
              </div>

              {/* Fichier sélectionné */}
              {uploadedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              )}

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
              size="sm"
            >
              Annuler
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowUploadModal(false)
                setShowChoiceDialog(true)
              }}
              size="sm"
            >
              Retour
            </Button>
            <Button 
              onClick={handleConfirmUpload}
              disabled={!uploadedFile}
              className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Confirmer l'upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 