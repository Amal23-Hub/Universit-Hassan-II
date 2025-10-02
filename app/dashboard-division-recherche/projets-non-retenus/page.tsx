"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Calendar, 
  User, 
  Building, 
  DollarSign, 
  Target, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw
} from "lucide-react"
import { Header } from "@/components/header"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"

interface ProjetNonRetenu {
  id: string
  titre: string
  coordonnateur: string
  organisme: string
  dateSoumission: string
  dateEvaluation: string
  budgetDemande: number
  duree: number
  statut: "refuse" | "en_attente" | "incomplet"
  motifRefus?: string
  programme: string
  thematique: string
  description: string
  score?: number
  commentaires?: string[]
  documents?: string[]
}

export default function ProjetsNonRetenusPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [filterAnnee, setFilterAnnee] = useState("all")
  const [selectedProjet, setSelectedProjet] = useState<ProjetNonRetenu | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  
  // Référence pour le timer de réinitialisation automatique
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [projetsNonRetenus, setProjetsNonRetenus] = useState<ProjetNonRetenu[]>([
    {
      id: "PNR001",
      titre: "Développement d'algorithmes d'IA pour la santé préventive",
      coordonnateur: "Dr. Ahmed BENALI",
      organisme: "Université Hassan II",
      dateSoumission: "2024-01-15",
      dateEvaluation: "2024-03-20",
      budgetDemande: 800000,
      duree: 24,
      statut: "refuse",
      motifRefus: "Budget trop élevé pour les objectifs proposés",
      programme: "Programme National de Recherche en IA",
      thematique: "Intelligence artificielle",
      description: "Développement d'algorithmes d'intelligence artificielle pour la prévention et le diagnostic précoce des maladies",
      score: 65,
      commentaires: [
        "Projet intéressant mais budget non justifié",
        "Méthodologie à améliorer",
        "Impact limité sur la santé publique"
      ],
      documents: ["Projet détaillé", "CV coordonnateur", "Budget détaillé"]
    },
    {
      id: "PNR002",
      titre: "Étude des impacts du changement climatique sur l'agriculture",
      coordonnateur: "Dr. Fatima ZAHRA",
      organisme: "Institut Agronomique",
      dateSoumission: "2024-02-01",
      dateEvaluation: "2024-04-15",
      budgetDemande: 600000,
      duree: 18,
      statut: "refuse",
      motifRefus: "Manque de partenariats avec le secteur privé",
      programme: "Programme de Recherche Environnementale",
      thematique: "Environnement",
      description: "Étude des impacts du changement climatique sur l'agriculture marocaine",
      score: 58,
      commentaires: [
        "Manque de partenariats industriels",
        "Méthodologie insuffisamment détaillée",
        "Impact économique limité"
      ],
      documents: ["Projet détaillé", "CV équipe", "Lettre de motivation"]
    },
    {
      id: "PNR003",
      titre: "Optimisation énergétique des bâtiments intelligents",
      coordonnateur: "Dr. Mohamed EL KADIRI",
      organisme: "École Nationale des Sciences Appliquées",
      dateSoumission: "2024-03-15",
      dateEvaluation: "2024-05-10",
      budgetDemande: 1200000,
      duree: 30,
      statut: "en_attente",
      programme: "Programme Énergies Renouvelables",
      thematique: "Énergies renouvelables",
      description: "Solutions innovantes pour l'optimisation énergétique des bâtiments",
      score: 72,
      commentaires: [
        "Projet prometteur mais budget à revoir",
        "Besoin de partenariats industriels",
        "Méthodologie à préciser"
      ],
      documents: ["Projet détaillé", "CV coordonnateur", "Budget détaillé"]
    },
    {
      id: "PNR004",
      titre: "Système de télémédecine pour zones rurales",
      coordonnateur: "Dr. Sara ALAOUI",
      organisme: "Faculté de Médecine",
      dateSoumission: "2024-01-20",
      dateEvaluation: "2024-03-25",
      budgetDemande: 450000,
      duree: 20,
      statut: "incomplet",
      motifRefus: "Dossier incomplet - documents manquants",
      programme: "Programme National de Recherche en IA",
      thematique: "Télémédecine",
      description: "Développement d'un système de télémédecine pour les zones rurales",
      score: 45,
      commentaires: [
        "Dossier incomplet",
        "Documents administratifs manquants",
        "Budget insuffisamment détaillé"
      ],
      documents: ["Projet détaillé"]
    }
  ])

  const programmes = [
    "Programme National de Recherche en IA",
    "Programme de Recherche Environnementale", 
    "Programme Énergies Renouvelables"
  ]

  const annees = ["2024", "2023", "2022"]

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' MAD'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "refuse":
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>
      case "en_attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "incomplet":
        return <Badge className="bg-orange-100 text-orange-800">Incomplet</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{statut}</Badge>
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const handleVoirDetails = (projet: ProjetNonRetenu) => {
    setSelectedProjet(projet)
    setShowDetailsModal(true)
  }

  const filteredProjets = projetsNonRetenus.filter(projet => {
    const matchesSearch = projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.coordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatut = filterStatut === "all" || projet.statut === filterStatut
    const matchesProgramme = filterProgramme === "all" || projet.programme === filterProgramme
    const matchesAnnee = filterAnnee === "all" || 
                        new Date(projet.dateSoumission).getFullYear().toString() === filterAnnee
    
    return matchesSearch && matchesStatut && matchesProgramme && matchesAnnee
  })

  const projetsRefuses = filteredProjets.filter(p => p.statut === "refuse")
  const projetsEnAttente = filteredProjets.filter(p => p.statut === "en_attente")
  const projetsIncomplets = filteredProjets.filter(p => p.statut === "incomplet")

  const resetFilters = () => {
    setSearchTerm("")
    setFilterStatut("all")
    setFilterProgramme("all")
    setFilterAnnee("all")
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
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Projets non retenus</h1>
              <p className="text-gray-600 mt-1">Gérez et consultez les projets qui n'ont pas été retenus</p>
            </div>

                         {/* Section de recherche et filtres améliorée - AVANT les statistiques */}
             <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 mb-3">
               <CardHeader className="pb-1">
                 <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                   <Filter className="h-3 w-3 text-blue-600" />
                   Recherche et filtres
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                 {/* Barre de recherche principale */}
                 <div className="relative">
                   <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                   <Input
                     placeholder="Rechercher un projet par titre, coordonnateur, description..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-8 h-8 text-xs border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                   />
                 </div>

                 {/* Filtres en grille */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                   <div className="space-y-0.5">
                     <Label className="text-xs font-medium text-gray-700">Statut</Label>
                     <Select value={filterStatut} onValueChange={setFilterStatut}>
                       <SelectTrigger className="h-7 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-xs">
                         <SelectValue placeholder="Tous les statuts" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">Tous les statuts ({filteredProjets.length})</SelectItem>
                         <SelectItem value="refuse">Refusés ({projetsRefuses.length})</SelectItem>
                         <SelectItem value="en_attente">En attente ({projetsEnAttente.length})</SelectItem>
                         <SelectItem value="incomplet">Incomplets ({projetsIncomplets.length})</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-0.5">
                     <Label className="text-xs font-medium text-gray-700">Programme</Label>
                     <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                       <SelectTrigger className="h-7 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-xs">
                         <SelectValue placeholder="Tous les programmes" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">Tous les programmes</SelectItem>
                         {programmes.map((programme) => (
                           <SelectItem key={programme} value={programme}>
                             {programme}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>

                   <div className="space-y-0.5">
                     <Label className="text-xs font-medium text-gray-700">Année</Label>
                     <Select value={filterAnnee} onValueChange={setFilterAnnee}>
                       <SelectTrigger className="h-7 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-xs">
                         <SelectValue placeholder="Toutes les années" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="all">Toutes les années</SelectItem>
                         {annees.map((annee) => (
                           <SelectItem key={annee} value={annee}>
                             {annee}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                 </div>

                 {/* Boutons d'action */}
                 <div className="flex items-center justify-between pt-0.5 border-t border-gray-200">
                   <div className="flex items-center gap-2 text-xs text-gray-600">
                     <span>{filteredProjets.length} projet(s) trouvé(s)</span>
                     {(searchTerm || filterStatut !== "all" || filterProgramme !== "all" || filterAnnee !== "all") && (
                       <Badge variant="outline" className="text-xs">
                         Filtres actifs
                       </Badge>
                     )}
                   </div>
                 </div>
               </CardContent>
             </Card>

                                                   {/* Statistiques */}
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                 <Card className="border-l-4 border-l-blue-900">
                   <CardContent className="p-3">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-xs font-medium text-gray-600">Total projets</p>
                         <p className="text-lg font-bold text-gray-900">{filteredProjets.length}</p>
                       </div>
                       <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                         <FileText className="h-4 w-4 text-gray-600" />
                       </div>
                     </div>
                   </CardContent>
                 </Card>
                 
                 <Card className="border-l-4 border-l-blue-900">
                   <CardContent className="p-3">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-xs font-medium text-gray-600">Projets refusés</p>
                         <p className="text-lg font-bold text-gray-900">{projetsRefuses.length}</p>
                       </div>
                       <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                         <XCircle className="h-4 w-4 text-gray-600" />
                       </div>
                     </div>
                   </CardContent>
                 </Card>
                 
                 <Card className="border-l-4 border-l-blue-900">
                   <CardContent className="p-3">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-xs font-medium text-gray-600">En attente</p>
                         <p className="text-lg font-bold text-gray-900">{projetsEnAttente.length}</p>
                       </div>
                       <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                         <Clock className="h-4 w-4 text-gray-600" />
                       </div>
                     </div>
                   </CardContent>
                 </Card>
                 
                 <Card className="border-l-4 border-l-blue-900">
                   <CardContent className="p-3">
                     <div className="flex items-center justify-between">
                       <div>
                         <p className="text-xs font-medium text-gray-600">Incomplets</p>
                         <p className="text-lg font-bold text-gray-900">{projetsIncomplets.length}</p>
                       </div>
                       <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
                         <AlertCircle className="h-4 w-4 text-gray-600" />
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               </div>

                                                   {/* Projets refusés */}
                             <div className="space-y-4">
                 {projetsRefuses.map((projet) => (
                   <Card key={projet.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-900">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                            {projet.titre}
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-600 mb-1">
                            {projet.programme}
                          </CardDescription>
                          <Badge variant="outline" className="text-xs">
                            {projet.thematique}
                          </Badge>
                        </div>
                        {getStatutBadge(projet.statut)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User className="h-3 w-3" />
                          <span className="font-medium">Coordonnateur:</span>
                          <span className="text-gray-900">{projet.coordonnateur}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Building className="h-3 w-3" />
                          <span className="font-medium">Établissement:</span>
                          <span className="text-gray-900">{projet.organisme}</span>
                        </div>
                        
                        {projet.score && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Target className="h-3 w-3" />
                            <span className="font-medium">Score:</span>
                            <span className={`font-semibold ${getScoreColor(projet.score)}`}>{projet.score}/100</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <DollarSign className="h-3 w-3" />
                          <span className="font-medium">Budget:</span>
                          <span className="font-bold text-green-600">{formatBudget(projet.budgetDemande)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">Soumis:</span>
                          <span className="text-gray-900">{formatDate(projet.dateSoumission)}</span>
                        </div>
                      </div>
                      
                      {projet.motifRefus && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3">
                          <strong>Motif de refus:</strong> {projet.motifRefus}
                        </div>
                      )}
                      
                                             <div className="flex justify-end gap-1">
                         <Button 
                           variant="outline" 
                           size="sm" 
                           onClick={() => handleVoirDetails(projet)}
                           className="h-7 px-2 text-xs"
                         >
                           <Eye className="h-3 w-3 mr-1" />
                           Détails
                         </Button>
                       </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

                         {/* Modal de détails */}
                           <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
                <DialogContent className="max-w-4xl max-h-[75vh] overflow-y-auto">
                                   <DialogHeader className="pb-2">
                    <div className="relative">
                      {/* Ceinture bleue à gauche */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-lg"></div>
                      
                      {/* Contenu principal avec fond bleu clair */}
                      <div className="ml-1 bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col items-center text-center flex-1">
                            {/* Icône circulaire */}
                            <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                              <FileText className="h-3 w-3 text-blue-600" />
                            </div>
                            
                            {/* Titre et description */}
                            <DialogTitle className="text-base font-bold text-blue-900 mb-0.5">
                              {selectedProjet?.titre}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-gray-600">
                              Détails complets du projet non retenu
                            </DialogDescription>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bouton de fermeture */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDetailsModal(false)}
                        className="absolute top-0.5 right-0.5 h-5 w-5 p-0 text-gray-500 hover:text-gray-700"
                      >
                        <XCircle className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </DialogHeader>
                 
                                   {selectedProjet && (
                    <div className="space-y-4 pt-3">
                      {/* En-tête avec statut et score */}
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-600">Statut:</span>
                            {getStatutBadge(selectedProjet.statut)}
                          </div>
                          {selectedProjet.score && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-600">Score:</span>
                              <span className={`text-xs font-semibold px-2 py-1 rounded ${getScoreColor(selectedProjet.score)} bg-white border`}>
                                {selectedProjet.score}/100
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Budget demandé</div>
                          <div className="text-sm font-bold text-gray-900">{formatBudget(selectedProjet.budgetDemande)}</div>
                        </div>
                      </div>

                      {/* Informations générales en grille compacte */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-3 w-3 text-blue-600" />
                            <Label className="text-xs font-semibold text-gray-900">Coordonnateur</Label>
                          </div>
                          <p className="text-xs text-gray-700">{selectedProjet.coordonnateur}</p>
                        </div>
                        
                        <div className="p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Building className="h-3 w-3 text-blue-600" />
                            <Label className="text-xs font-semibold text-gray-900">Organisme</Label>
                          </div>
                          <p className="text-xs text-gray-700">{selectedProjet.organisme}</p>
                        </div>
                        
                        <div className="p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-3 w-3 text-blue-600" />
                            <Label className="text-xs font-semibold text-gray-900">Programme</Label>
                          </div>
                          <p className="text-xs text-gray-700">{selectedProjet.programme}</p>
                        </div>
                        
                        <div className="p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="h-3 w-3 text-blue-600" />
                            <Label className="text-xs font-semibold text-gray-900">Thématique</Label>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {selectedProjet.thematique}
                          </Badge>
                        </div>
                        
                        <div className="p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-3 w-3 text-blue-600" />
                            <Label className="text-xs font-semibold text-gray-900">Soumission</Label>
                          </div>
                          <p className="text-xs text-gray-700">{formatDate(selectedProjet.dateSoumission)}</p>
                        </div>
                        
                        <div className="p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-3 w-3 text-blue-600" />
                            <Label className="text-xs font-semibold text-gray-900">Durée</Label>
                          </div>
                          <p className="text-xs text-gray-700">{selectedProjet.duree} mois</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-3 w-3 text-blue-600" />
                          <Label className="text-xs font-semibold text-gray-900">Description du projet</Label>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">{selectedProjet.description}</p>
                      </div>

                      {/* Motif de refus */}
                      {selectedProjet.motifRefus && (
                        <div className="p-3 border-l-3 border-l-red-500 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <XCircle className="h-3 w-3 text-red-600" />
                            <Label className="text-xs font-semibold text-red-900">Motif de refus</Label>
                          </div>
                          <p className="text-xs text-red-800">{selectedProjet.motifRefus}</p>
                        </div>
                      )}

                      {/* Commentaires */}
                      {selectedProjet.commentaires && selectedProjet.commentaires.length > 0 && (
                        <div className="p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-3 w-3 text-blue-600" />
                            <Label className="text-xs font-semibold text-gray-900">Commentaires d'évaluation</Label>
                          </div>
                          <ul className="space-y-1">
                            {selectedProjet.commentaires.map((commentaire, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                                <span className="text-blue-400 mt-0.5">•</span>
                                <span>{commentaire}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Documents */}
                      {selectedProjet.documents && selectedProjet.documents.length > 0 && (
                        <div className="p-3 border border-gray-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-2">
                            <Download className="h-3 w-3 text-blue-600" />
                            <Label className="text-xs font-semibold text-gray-900">Documents soumis</Label>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {selectedProjet.documents.map((document, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                                {document}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
               </DialogContent>
             </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
} 