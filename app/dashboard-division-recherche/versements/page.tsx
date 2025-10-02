"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, DollarSign, Plus, Trash2, Filter, Download, ArrowLeft, Send, CheckCircle, Search, User, Building, Calendar, XCircle } from "lucide-react"
import { Header } from "@/components/header"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { useRouter } from "next/navigation"
import { Users, BarChart3, CreditCard, Send as SendIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProjetVersement {
  id: string
  programme: string
  projet: string
  nomCoordonnateur: string
  prenomCoordonnateur: string
  etablissement: string
  budgetAlloue: number
  tranches: Array<{
    id: string
    montant: number
    recu: boolean
    dateReception?: string
    montantRecu?: number
    sourceFinancement?: string
    sourcesFinancement?: Array<{
      source: string
      montant: number
      numeroTransaction: string
    }>
    envoye: boolean
    dateEnvoi?: string
    organismePartenaire?: string
    numeroTransaction?: string
  }>
}

export default function VersementsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [filterProjet, setFilterProjet] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showRecuModal, setShowRecuModal] = useState(false)
  const [showEnvoiModal, setShowEnvoiModal] = useState(false)
  const [selectedTranche, setSelectedTranche] = useState<{projetId: string, trancheId: string} | null>(null)
  const [recuData, setRecuData] = useState({
    dateReception: "",
    montantRecu: 0,
    numeroTransaction: "",
    sourceFinancement: "",
    sourceAutre: "",
    numeroTranche: "",
    sourcesMultiples: false,
    sourcesFinancement: [
      {
        source: "",
        sourceAutre: "",
        montant: 0,
        numeroTransaction: ""
      }
    ]
  })
  const [envoiData, setEnvoiData] = useState({
    numeroTranche: "",
    montantTranche: 0,
    dateEnvoi: "",
    organismePartenaire: "",
    organismeAutre: "",
    numeroTransaction: "",
    organismesMultiples: false,
    organismesPartenaires: [
      {
        organisme: "",
        organismeAutre: "",
        montant: 0,
        numeroTransaction: ""
      }
    ]
  })

  const [projets, setProjets] = useState<ProjetVersement[]>([
    {
      id: "1",
      programme: "Programme National de Recherche en IA",
      projet: "IA pour la santé préventive",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      budgetAlloue: 420000,
      tranches: [
        {
          id: "1",
          montant: 168000,
          recu: true,
          dateReception: "2024-02-20",
          envoye: true,
          dateEnvoi: "2024-02-18"
        },
        {
          id: "2",
          montant: 126000,
          recu: false,
          envoye: false
        },
        {
          id: "3",
          montant: 126000,
          recu: false,
          envoye: false
        }
      ]
    },
    {
      id: "2",
      programme: "Programme National de Recherche en IA",
      projet: "Cybersécurité avancée",
      nomCoordonnateur: "El Mansouri",
      prenomCoordonnateur: "Fatima",
      etablissement: "Université Mohammed V",
      budgetAlloue: 300000,
      tranches: [
        {
    id: "1",
          montant: 120000,
          recu: true,
          dateReception: "2024-02-22",
          envoye: true,
          dateEnvoi: "2024-02-19"
        },
        {
          id: "2",
          montant: 90000,
          recu: false,
          envoye: false
        },
        {
          id: "3",
          montant: 90000,
          recu: false,
          envoye: false
        }
      ]
    },
    {
      id: "3",
      programme: "Programme Energies Renouvelables",
      projet: "Optimisation des panneaux solaires",
      nomCoordonnateur: "Alami",
      prenomCoordonnateur: "Karim",
      etablissement: "Université Ibn Zohr",
      budgetAlloue: 650000,
      tranches: [
        {
        id: "1", 
          montant: 162500,
          recu: true,
          dateReception: "2024-03-25",
          envoye: true,
          dateEnvoi: "2024-03-22"
      },
      { 
        id: "2", 
          montant: 162500,
          recu: false,
          envoye: false
        },
        {
          id: "3",
          montant: 162500,
          recu: false,
          envoye: false
        }
      ]
    }
  ])

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const handleTrancheRecu = (projetId: string, trancheId: string, recu: boolean) => {
    setProjets(prev => prev.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.id === trancheId) {
              return {
                ...tranche,
                recu,
                dateReception: recu ? new Date().toISOString().split('T')[0] : undefined,
                montantRecu: recu ? tranche.montant : undefined
              }
            }
            return tranche
          })
        }
      }
      return projet
    }))
  }

  const handleTrancheRecuWithDetails = (projetId: string, trancheId: string) => {
    setSelectedTranche({ projetId, trancheId })
    setRecuData({
      dateReception: new Date().toISOString().split('T')[0],
      montantRecu: 0,
      numeroTransaction: "",
      sourceFinancement: "",
      sourceAutre: "",
      numeroTranche: trancheId,
      sourcesMultiples: false,
      sourcesFinancement: [
        {
          source: "",
          sourceAutre: "",
          montant: 0,
          numeroTransaction: ""
        }
      ]
    })
    setShowRecuModal(true)
  }

  const handleConfirmRecu = () => {
    if (!selectedTranche) return

    setProjets(prev => prev.map(projet => {
      if (projet.id === selectedTranche.projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.id === selectedTranche.trancheId) {
                              return {
                  ...tranche,
                  recu: true,
                  dateReception: recuData.dateReception,
                  montantRecu: recuData.sourcesMultiples 
                    ? recuData.sourcesFinancement.reduce((sum, source) => sum + source.montant, 0)
                    : recuData.montantRecu,
                  numeroTransaction: recuData.numeroTransaction,
                  sourceFinancement: recuData.sourceFinancement === "Autre" ? recuData.sourceAutre : recuData.sourceFinancement,
                  sourcesFinancement: recuData.sourcesMultiples ? recuData.sourcesFinancement : undefined
                }
            }
            return tranche
          })
        }
      }
      return projet
    }))

    setShowRecuModal(false)
    setSelectedTranche(null)
    setRecuData({
      dateReception: "",
      montantRecu: 0,
      numeroTransaction: "",
      sourceFinancement: "",
      sourceAutre: "",
      numeroTranche: "",
      sourcesMultiples: false,
      sourcesFinancement: [
        {
          source: "",
          sourceAutre: "",
          montant: 0,
          numeroTransaction: ""
        }
      ]
    })
  }

  const addSourceFinancement = () => {
    setRecuData(prev => ({
      ...prev,
      sourcesFinancement: [
        ...prev.sourcesFinancement,
        {
          source: "",
          sourceAutre: "",
          montant: 0,
          numeroTransaction: ""
        }
      ]
    }))
  }

  const removeSourceFinancement = (index: number) => {
    setRecuData(prev => ({
      ...prev,
      sourcesFinancement: prev.sourcesFinancement.filter((_, i) => i !== index)
    }))
  }

  const updateSourceFinancement = (index: number, field: string, value: string | number) => {
    setRecuData(prev => ({
      ...prev,
      sourcesFinancement: prev.sourcesFinancement.map((source, i) => 
        i === index ? { ...source, [field]: value } : source
      )
    }))
  }

  const addOrganismePartenaire = () => {
    setEnvoiData(prev => ({
      ...prev,
      organismesPartenaires: [
        ...prev.organismesPartenaires,
        {
          organisme: "",
          organismeAutre: "",
          montant: 0,
          numeroTransaction: ""
        }
      ]
    }))
  }

  const removeOrganismePartenaire = (index: number) => {
    setEnvoiData(prev => ({
      ...prev,
      organismesPartenaires: prev.organismesPartenaires.filter((_, i) => i !== index)
    }))
  }

  const updateOrganismePartenaire = (index: number, field: string, value: string | number) => {
    setEnvoiData(prev => ({
      ...prev,
      organismesPartenaires: prev.organismesPartenaires.map((organisme, i) => 
        i === index ? { ...organisme, [field]: value } : organisme
      )
    }))
  }

  const handleTrancheEnvoye = (projetId: string, trancheId: string, envoye: boolean) => {
    // Trouver le projet et la tranche pour pré-remplir les données
    const projet = projets.find(p => p.id === projetId)
    const tranche = projet?.tranches.find(t => t.id === trancheId)
    
    if (projet && tranche) {
      setSelectedTranche({ projetId, trancheId })
          setEnvoiData({
        numeroTranche: trancheId,
      montantTranche: tranche.montant,
      dateEnvoi: new Date().toISOString().split('T')[0],
      organismePartenaire: "",
      organismeAutre: "",
      numeroTransaction: "",
      organismesMultiples: false,
      organismesPartenaires: [
        {
          organisme: "",
          organismeAutre: "",
          montant: 0,
          numeroTransaction: ""
        }
      ]
    })
      setShowEnvoiModal(true)
    }
  }

  const handleConfirmEnvoi = () => {
    if (!selectedTranche) return

    setProjets(prev => prev.map(projet => {
      if (projet.id === selectedTranche.projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.id === selectedTranche.trancheId) {
              return {
                ...tranche,
                envoye: true,
                dateEnvoi: envoiData.dateEnvoi,
                organismePartenaire: envoiData.organismePartenaire === "Autre" ? envoiData.organismeAutre : envoiData.organismePartenaire,
                numeroTransaction: envoiData.numeroTransaction
              }
            }
            return tranche
          })
        }
      }
      return projet
    }))

    setShowEnvoiModal(false)
    setSelectedTranche(null)
    setEnvoiData({
      numeroTranche: "",
      montantTranche: 0,
      dateEnvoi: "",
      organismePartenaire: "",
      organismeAutre: "",
      numeroTransaction: "",
      organismesMultiples: false,
      organismesPartenaires: [
        {
          organisme: "",
          organismeAutre: "",
          montant: 0,
          numeroTransaction: ""
        }
      ]
    })
  }

  const filteredProjets = projets.filter(projet => {
    const matchesSearch = searchTerm === "" || 
      projet.projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.nomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.prenomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProgramme = filterProgramme === "all" || projet.programme === filterProgramme
    const matchesProjet = filterProjet === "all" || projet.projet === filterProjet
    
    // Pour le statut, on vérifie si au moins une tranche correspond au statut
    const matchesStatut = filterStatut === "all" || 
      projet.tranches.some(tranche => {
        if (filterStatut === "recu") return tranche.recu
        if (filterStatut === "envoye") return tranche.envoye
        if (filterStatut === "en_attente") return !tranche.recu && !tranche.envoye
        return true
      })
    
    return matchesSearch && matchesProgramme && matchesProjet && matchesStatut
  })

  const programmes = [...new Set(projets.map(p => p.programme))]
  const projetsList = [...new Set(projets.map(p => p.projet))]

  // Calcul des statistiques
  const totalProjets = projets.length
  const budgetTotal = projets.reduce((sum, projet) => sum + projet.budgetAlloue, 0)
  const totalTranches = projets.reduce((sum, projet) => sum + projet.tranches.length, 0)
  const tranchesRecues = projets.reduce((sum, projet) => 
    sum + projet.tranches.filter(t => t.recu).length, 0
  )
  const tranchesEnvoyees = projets.reduce((sum, projet) => 
    sum + projet.tranches.filter(t => t.envoye).length, 0
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            {/* Header avec titre */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Service Budget & UH2C</h1>
                  <p className="text-gray-600 mt-1">Gérez les versements et le suivi des projets</p>
                </div>
              </div>
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
                    placeholder="Rechercher par projet, coordonnateur, établissement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                  />
                </div>

                {/* Filtres en grille */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
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
                    <Label className="text-xs font-medium text-gray-700">Projet</Label>
                    <Select value={filterProjet} onValueChange={setFilterProjet}>
                      <SelectTrigger className="h-7 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Tous les projets" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les projets</SelectItem>
                        {projetsList.map((projet) => (
                          <SelectItem key={projet} value={projet}>
                            {projet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-gray-700">Statut</Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger className="h-7 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="recu">Reçus</SelectItem>
                        <SelectItem value="envoye">Envoyés</SelectItem>
                        <SelectItem value="en_attente">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-gray-700">Tri</Label>
                    <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                      <SelectTrigger className="h-7 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Ordre de tri" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Plus récents d'abord</SelectItem>
                        <SelectItem value="asc">Plus anciens d'abord</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center justify-between pt-0.5 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{filteredProjets.length} projet(s) trouvé(s)</span>
                    {(searchTerm || filterProgramme !== "all" || filterProjet !== "all" || filterStatut !== "all") && (
                      <Badge variant="outline" className="text-xs">
                        Filtres actifs
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 mb-3">
              {/* Total Projets */}
              <Card className="border-l-4 border-l-blue-900">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Total Projets</p>
                      <p className="text-base font-bold text-gray-900">{totalProjets}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Users className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget Total */}
              <Card className="border-l-4 border-l-blue-900">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Budget Total</p>
                      <p className="text-base font-bold text-gray-900">{formatBudget(budgetTotal)}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Total Tranches */}
              <Card className="border-l-4 border-l-blue-900">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Total Tranches</p>
                      <p className="text-base font-bold text-gray-900">{totalTranches}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tranches Reçues */}
              <Card className="border-l-4 border-l-blue-900">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Tranches Reçues</p>
                      <p className="text-base font-bold text-gray-900">{tranchesRecues}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tranches Envoyées */}
              <Card className="border-l-4 border-l-blue-900">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Tranches Envoyées</p>
                      <p className="text-base font-bold text-gray-900">{tranchesEnvoyees}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-lg flex items-center justify-center">
                      <SendIcon className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Liste des projets en cartes horizontales */}
            <Card>
              <CardHeader className="bg-blue-50 border-b border-blue-200 py-3">
                <CardTitle className="flex items-center gap-2 text-blue-900 text-base">
                  <DollarSign className="h-4 w-4" />
                  Liste des Projets - Gestion des Versements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {filteredProjets.map((projet) => 
                    projet.tranches.map((tranche, index) => (
                      <Card key={`${projet.id}-${tranche.id}`} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-900">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                                {projet.projet}
                              </CardTitle>
                              <CardDescription className="text-xs text-gray-600 mb-1">
                                {projet.programme}
                              </CardDescription>
                              <Badge variant="outline" className="text-xs">
                                Tranche {tranche.id}
                              </Badge>
                  </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-900">
                                {formatBudget(tranche.montant)}
                  </div>
                              <div className="text-xs text-gray-600">
                                Budget total: {formatBudget(projet.budgetAlloue)}
                </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <User className="h-3 w-3" />
                              <span className="font-medium">Coordonnateur:</span>
                              <span className="text-gray-900">{projet.prenomCoordonnateur} {projet.nomCoordonnateur}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Building className="h-3 w-3" />
                              <span className="font-medium">Établissement:</span>
                              <span className="text-gray-900">{projet.etablissement}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span className="font-medium">Tranche:</span>
                              <span className="text-gray-900">{tranche.id}/{projet.tranches.length}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Statut de réception */}
                              <div className="space-y-2">
                              <div className="text-xs font-medium text-gray-700 mb-2">Statut de réception</div>
                                {!tranche.recu ? (
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                      <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-700">En attente</span>
                                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Non reçu</span>
                                        <div className="flex space-x-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleTrancheRecuWithDetails(projet.id, tranche.id)}
                                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                            title="Marquer comme reçu"
                                          >
                                            <CheckCircle className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleTrancheRecuWithDetails(projet.id, tranche.id)}
                                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                            title="Ajouter une réception"
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                    <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-green-700">Reçu</span>
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                      <span className="text-xs text-green-600 font-medium">Confirmé</span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleTrancheRecuWithDetails(projet.id, tranche.id)}
                                        className="h-5 w-5 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                                        title="Ajouter une réception supplémentaire"
                                      >
                                        <Plus className="h-2 w-2" />
                                      </Button>
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">
                                      {formatDate(tranche.dateReception || '')}
                                    </div>
                                    {(tranche.montantRecu || (tranche.sourcesFinancement && tranche.sourcesFinancement.length > 0)) && (
                                      <div className="text-xs text-gray-600 space-y-1">
                                        <div>
                                          Reçu: {formatBudget(
                                            tranche.sourcesFinancement && tranche.sourcesFinancement.length > 0
                                              ? tranche.sourcesFinancement.reduce((sum, source) => sum + source.montant, 0)
                                              : (tranche.montantRecu || 0)
                                          )}
                                          {(() => {
                                            const montantRecu = tranche.sourcesFinancement && tranche.sourcesFinancement.length > 0
                                              ? tranche.sourcesFinancement.reduce((sum, source) => sum + source.montant, 0)
                                              : (tranche.montantRecu || 0);
                                            return montantRecu !== tranche.montant && (
                                              <span className="text-orange-600 ml-1">
                                                (différence: {formatBudget(montantRecu - tranche.montant)})
                                              </span>
                                            );
                                          })()}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                            {/* Statut d'envoi */}
                              <div className="space-y-2">
                              <div className="text-xs font-medium text-gray-700 mb-2">Statut d'envoi</div>
                                {!tranche.envoye ? (
                                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-700">En attente</span>
                                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Non envoyé</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleTrancheEnvoye(projet.id, tranche.id, true)}
                                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                        title="Envoyer le versement"
                                      >
                                        <Send className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                    <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-blue-700">Envoyé</span>
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-2">
                                        <Send className="h-3 w-3 text-blue-600" />
                                      <span className="text-xs text-blue-600 font-medium">Confirmé</span>
                                      </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleTrancheEnvoye(projet.id, tranche.id, true)}
                                      className="h-5 w-5 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                      title="Ajouter un envoi supplémentaire"
                                    >
                                      <Plus className="h-2 w-2" />
                                    </Button>
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">
                                      {formatDate(tranche.dateEnvoi || '')}
                                    </div>
                                    {tranche.organismePartenaire && (
                                      <div className="text-xs text-gray-600">
                                        {tranche.organismePartenaire}
                                      </div>
                                    )}
                                    {tranche.numeroTransaction && (
                                      <div className="text-xs text-gray-600">
                                        N° {tranche.numeroTransaction}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                          </div>
                        </CardContent>
                      </Card>
                        ))
                      )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Modal pour saisir les détails de réception */}
      <Dialog open={showRecuModal} onOpenChange={setShowRecuModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                    </div>
                    
                    {/* Titre et description */}
                    <DialogTitle className="text-base font-bold text-blue-900 mb-0.5">
              Confirmer la réception
            </DialogTitle>
                    <DialogDescription className="text-xs text-gray-600">
              Saisissez la date de réception et le montant effectivement reçu
            </DialogDescription>
                  </div>
                </div>
              </div>
              
              {/* Bouton de fermeture */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecuModal(false)}
                className="absolute top-0.5 right-0.5 h-5 w-5 p-0 text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-2.5 w-2.5" />
              </Button>
            </div>
          </DialogHeader>
          
                      <div className="space-y-4">
              {selectedTranche && (
                <div className="bg-uh2c-blue/5 border border-uh2c-blue/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-uh2c-blue rounded-full"></div>
                    <p className="text-sm font-medium text-uh2c-blue">
                      Projet: {projets.find(p => p.id === selectedTranche.projetId)?.projet}
                    </p>
                  </div>

                </div>
              )}
              
                            <div className="space-y-2">
                <Label htmlFor="numeroTranche" className="text-sm font-medium text-gray-700">Numéro de tranche <span className="text-red-600">*</span></Label>
                <Select 
                  value={recuData.numeroTranche} 
                  onValueChange={(value) => setRecuData({ ...recuData, numeroTranche: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Sélectionner une tranche" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const projet = projets.find(p => p.id === selectedTranche?.projetId)
                      return projet?.tranches.map((tranche) => (
                        <SelectItem key={tranche.id} value={tranche.id}>
                          <div className="flex flex-col py-1">
                            <span className="font-medium text-gray-900">Tranche {tranche.id}</span>
                            <span className="text-sm text-gray-500">
                              {formatBudget(tranche.montant)} - {tranche.recu ? 'Déjà reçue' : 'Non reçue'}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    })()}
                  </SelectContent>
                </Select>
                {(() => {
                  const projet = projets.find(p => p.id === selectedTranche?.projetId)
                  const tranche = projet?.tranches.find(t => t.id === selectedTranche?.trancheId)
                  return tranche?.recu && (
                    <div className="flex items-center space-x-2 mt-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <p className="text-xs text-green-700">
                        1ère tranche a déjà été marquée comme reçue
                      </p>
                    </div>
                  )
                })()}
              </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateReception" className="text-sm font-medium text-gray-700">Date de réception <span className="text-red-600">*</span></Label>
              <Input
                id="dateReception"
                type="date"
                value={recuData.dateReception}
                onChange={(e) => setRecuData({ ...recuData, dateReception: e.target.value })}
                className="h-10"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sourcesMultiples"
                  checked={recuData.sourcesMultiples}
                  onChange={(e) => setRecuData({ ...recuData, sourcesMultiples: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="sourcesMultiples" className="text-sm font-medium text-gray-700">
                  Versement reçu de plusieurs sources de financement
                </Label>
              </div>
            </div>

            {!recuData.sourcesMultiples ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="numeroTransaction" className="text-sm font-medium text-gray-700">Numéro de transaction <span className="text-red-600">*</span></Label>
                  <Input
                    id="numeroTransaction"
                    type="text"
                    value={recuData.numeroTransaction}
                    onChange={(e) => setRecuData({ ...recuData, numeroTransaction: e.target.value })}
                    className="h-10"
                    placeholder="N° d'opération bancaire"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sourceFinancement" className="text-sm font-medium text-gray-700">Source de financement <span className="text-red-600">*</span></Label>
                  <Select 
                    value={recuData.sourceFinancement} 
                    onValueChange={(value) => setRecuData({ ...recuData, sourceFinancement: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Sélectionner la source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ministère de l'Enseignement Supérieur">
                        Ministère de l'Enseignement Supérieur
                      </SelectItem>
                      <SelectItem value="Ministère de la Recherche Scientifique">
                        Ministère de la Recherche Scientifique
                      </SelectItem>
                      <SelectItem value="Agence Nationale de Recherche">
                        Agence Nationale de Recherche
                      </SelectItem>
                      <SelectItem value="Centre National de Recherche Scientifique et Technique">
                        Centre National de Recherche Scientifique et Technique
                      </SelectItem>
                      <SelectItem value="Université Hassan II de Casablanca">
                        Université Hassan II de Casablanca
                      </SelectItem>
                      <SelectItem value="Fondation Hassan II pour la Recherche">
                        Fondation Hassan II pour la Recherche
                      </SelectItem>
                      <SelectItem value="Partenaires privés">
                        Partenaires privés
                      </SelectItem>
                      <SelectItem value="Organismes internationaux">
                        Organismes internationaux
                      </SelectItem>
                      <SelectItem value="Autre">
                        Autre
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {recuData.sourceFinancement === "Autre" && (
                    <div className="space-y-2">
                      <Label htmlFor="sourceAutre" className="text-sm font-medium text-gray-700">
                        Précisez la source <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="sourceAutre"
                        type="text"
                        value={recuData.sourceAutre || ""}
                        onChange={(e) => setRecuData({ ...recuData, sourceAutre: e.target.value })}
                        className="h-10"
                        placeholder="Nom de la source de financement"
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="montantRecu" className="text-sm font-medium text-gray-700">Montant reçu (MAD) <span className="text-red-600">*</span></Label>
                  <Input
                    id="montantRecu"
                    type="number"
                    min="0"
                    value={recuData.montantRecu}
                    onChange={(e) => setRecuData({ ...recuData, montantRecu: parseFloat(e.target.value) || 0 })}
                    className="h-10"
                    placeholder="0"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Montant attendu: {selectedTranche && projets.find(p => p.id === selectedTranche.projetId)?.tranches.find(t => t.id === selectedTranche.trancheId)?.montant ? formatBudget(projets.find(p => p.id === selectedTranche.projetId)?.tranches.find(t => t.id === selectedTranche.trancheId)?.montant || 0) : '0 MAD'}
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Sources de financement multiples</Label>
                  {recuData.sourcesFinancement.map((source, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Source {index + 1}</span>
                        {recuData.sourcesFinancement.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSourceFinancement(index)}
                            className="text-red-600 hover:text-red-700 h-6 px-2"
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Source de financement <span className="text-red-600">*</span></Label>
                          <Select 
                            value={source.source} 
                            onValueChange={(value) => updateSourceFinancement(index, 'source', value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ministère de l'Enseignement Supérieur">
                                Ministère de l'Enseignement Supérieur
                              </SelectItem>
                              <SelectItem value="Ministère de la Recherche Scientifique">
                                Ministère de la Recherche Scientifique
                              </SelectItem>
                              <SelectItem value="Agence Nationale de Recherche">
                                Agence Nationale de Recherche
                              </SelectItem>
                              <SelectItem value="Centre National de Recherche Scientifique et Technique">
                                Centre National de Recherche Scientifique et Technique
                              </SelectItem>
                              <SelectItem value="Université Hassan II de Casablanca">
                                Université Hassan II de Casablanca
                              </SelectItem>
                              <SelectItem value="Fondation Hassan II pour la Recherche">
                                Fondation Hassan II pour la Recherche
                              </SelectItem>
                              <SelectItem value="Partenaires privés">
                                Partenaires privés
                              </SelectItem>
                              <SelectItem value="Organismes internationaux">
                                Organismes internationaux
                              </SelectItem>
                              <SelectItem value="Autre">
                                Autre
                              </SelectItem>
                            </SelectContent>
                          </Select>

                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Montant (MAD) <span className="text-red-600">*</span></Label>
                          <Input
                            type="number"
                            min="0"
                            value={source.montant}
                            onChange={(e) => updateSourceFinancement(index, 'montant', parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                            placeholder="0"
                            required
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">N° Transaction <span className="text-red-600">*</span></Label>
                          <Input
                            type="text"
                            value={source.numeroTransaction}
                            onChange={(e) => updateSourceFinancement(index, 'numeroTransaction', e.target.value)}
                            className="h-8 text-xs"
                            placeholder="N° opération"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSourceFinancement}
                    className="w-full h-8 text-xs"
                  >
                    + Ajouter une source
                  </Button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Résumé des sources</div>
                  <div className="space-y-1">
                    {recuData.sourcesFinancement.map((source, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        {source.source}: {formatBudget(source.montant)} (N° {source.numeroTransaction})
                      </div>
                    ))}
                    <div className="text-sm font-semibold text-gray-800 pt-2 border-t border-gray-200">
                      Total: {formatBudget(recuData.sourcesFinancement.reduce((sum, source) => sum + source.montant, 0))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Montant attendu: {selectedTranche && projets.find(p => p.id === selectedTranche.projetId)?.tranches.find(t => t.id === selectedTranche.trancheId)?.montant ? formatBudget(projets.find(p => p.id === selectedTranche.projetId)?.tranches.find(t => t.id === selectedTranche.trancheId)?.montant || 0) : '0 MAD'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setShowRecuModal(false)}
              className="px-4 py-2"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmRecu}
              disabled={
                !recuData.dateReception || 
                !recuData.numeroTranche ||
                (!recuData.sourcesMultiples && (
                  recuData.montantRecu <= 0 || 
                  !recuData.numeroTransaction || 
                  !recuData.sourceFinancement ||
                  (recuData.sourceFinancement === "Autre" && !recuData.sourceAutre)
                )) ||
                (recuData.sourcesMultiples && (
                  recuData.sourcesFinancement.length === 0 || 
                  recuData.sourcesFinancement.some(source => 
                    !source.source || 
                    source.montant <= 0 || 
                    !source.numeroTransaction ||
                    (source.source === "Autre" && !source.sourceAutre)
                  )
                ))
              }
              className="px-4 py-2 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
            >
              Confirmer la réception
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal pour l'envoi de versements */}
      <Dialog open={showEnvoiModal} onOpenChange={setShowEnvoiModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-1">
            <div className="relative">
              {/* Ceinture bleue marine à gauche */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900 rounded-l-lg"></div>
              
              {/* Contenu principal avec fond bleu clair */}
              <div className="ml-1 bg-blue-50 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center text-center flex-1">
                    {/* Icône circulaire */}
                    <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center mb-0.5">
                      <Send className="h-2.5 w-2.5 text-blue-600" />
                    </div>
                    
                    {/* Titre et description */}
                    <DialogTitle className="text-sm font-bold text-blue-900 mb-0">
              Envoyer le versement
            </DialogTitle>
                    <DialogDescription className="text-xs text-gray-600">
              Confirmez les détails du versement à envoyer
            </DialogDescription>
                  </div>
                </div>
              </div>
              
              {/* Bouton de fermeture */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEnvoiModal(false)}
                className="absolute top-0.5 right-0.5 h-4 w-4 p-0 text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-2 w-2" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedTranche && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <p className="text-sm font-medium text-blue-800">
                    Projet: {projets.find(p => p.id === selectedTranche.projetId)?.projet}
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="numeroTranche" className="text-sm font-medium text-gray-700">
                Numéro de tranche <span className="text-red-600">*</span>
              </Label>
              <Select 
                value={envoiData.numeroTranche} 
                onValueChange={(value) => setEnvoiData({ ...envoiData, numeroTranche: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Sélectionner une tranche" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const projet = projets.find(p => p.id === selectedTranche?.projetId)
                    return projet?.tranches.map((tranche) => (
                      <SelectItem key={tranche.id} value={tranche.id}>
                        <div className="flex flex-col py-1">
                          <span className="font-medium text-gray-900">Tranche {tranche.id}</span>
                          <span className="text-sm text-gray-500">
                            {formatBudget(tranche.montant)} - {tranche.envoye ? 'Déjà envoyée' : 'Non envoyée'}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  })()}
                </SelectContent>
              </Select>
              {(() => {
                const projet = projets.find(p => p.id === selectedTranche?.projetId)
                const tranche = projet?.tranches.find(t => t.id === selectedTranche?.trancheId)
                return tranche?.envoye && (
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <p className="text-xs text-green-700">
                      Cette tranche a déjà été marquée comme envoyée
                    </p>
                  </div>
                )
              })()}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="montantTranche" className="text-sm font-medium text-gray-700">
                Montant de la tranche (MAD) <span className="text-red-600">*</span>
              </Label>
              <Input
                id="montantTranche"
                type="number"
                min="0"
                value={envoiData.montantTranche}
                onChange={(e) => setEnvoiData({ ...envoiData, montantTranche: parseFloat(e.target.value) || 0 })}
                className="h-10"
                placeholder="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateEnvoi" className="text-sm font-medium text-gray-700">
                Date d'envoi <span className="text-red-600">*</span>
              </Label>
              <Input
                id="dateEnvoi"
                type="date"
                value={envoiData.dateEnvoi}
                onChange={(e) => setEnvoiData({ ...envoiData, dateEnvoi: e.target.value })}
                className="h-10"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="organismesMultiples"
                  checked={envoiData.organismesMultiples}
                  onChange={(e) => setEnvoiData({ ...envoiData, organismesMultiples: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="organismesMultiples" className="text-sm font-medium text-gray-700">
                  Envoi vers plusieurs organismes partenaires
                </Label>
              </div>
            </div>

            {!envoiData.organismesMultiples ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organismePartenaire" className="text-sm font-medium text-gray-700">
                    Organisme partenaire <span className="text-red-600">*</span>
                  </Label>
                  <Select 
                    value={envoiData.organismePartenaire} 
                    onValueChange={(value) => setEnvoiData({ ...envoiData, organismePartenaire: value })}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Sélectionner l'organisme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ministère de l'Enseignement Supérieur">
                        Ministère de l'Enseignement Supérieur
                      </SelectItem>
                      <SelectItem value="Ministère de la Recherche Scientifique">
                        Ministère de la Recherche Scientifique
                      </SelectItem>
                      <SelectItem value="Agence Nationale de Recherche">
                        Agence Nationale de Recherche
                      </SelectItem>
                      <SelectItem value="Centre National de Recherche Scientifique et Technique">
                        Centre National de Recherche Scientifique et Technique
                      </SelectItem>
                      <SelectItem value="Université Hassan II de Casablanca">
                        Université Hassan II de Casablanca
                      </SelectItem>
                      <SelectItem value="Fondation Hassan II pour la Recherche">
                        Fondation Hassan II pour la Recherche
                      </SelectItem>
                      <SelectItem value="Partenaires privés">
                        Partenaires privés
                      </SelectItem>
                      <SelectItem value="Organismes internationaux">
                        Organismes internationaux
                      </SelectItem>
                      <SelectItem value="Autre">
                        Autre
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {envoiData.organismePartenaire === "Autre" && (
                    <div className="space-y-2 flex flex-col items-center">
                      <Label htmlFor="organismeAutre" className="text-sm font-medium text-gray-700 text-center">
                        Précisez l'organisme <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="organismeAutre"
                        type="text"
                        value={envoiData.organismeAutre || ""}
                        onChange={(e) => setEnvoiData({ ...envoiData, organismeAutre: e.target.value })}
                        className="h-10 text-center w-full"
                        placeholder="Nom de l'organisme"
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numeroTransaction" className="text-sm font-medium text-gray-700">
                    Numéro de transaction <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="numeroTransaction"
                    type="text"
                    value={envoiData.numeroTransaction}
                    onChange={(e) => setEnvoiData({ ...envoiData, numeroTransaction: e.target.value })}
                    className="h-10"
                    placeholder="N° d'opération bancaire"
                    required
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Organismes partenaires multiples</Label>
                  {envoiData.organismesPartenaires.map((organisme, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Organisme {index + 1}</span>
                        {envoiData.organismesPartenaires.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOrganismePartenaire(index)}
                            className="text-red-600 hover:text-red-700 h-6 px-2"
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">
                            Organisme partenaire <span className="text-red-600">*</span>
                          </Label>
                          <Select 
                            value={organisme.organisme} 
                            onValueChange={(value) => updateOrganismePartenaire(index, 'organisme', value)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ministère de l'Enseignement Supérieur">
                                Ministère de l'Enseignement Supérieur
                              </SelectItem>
                              <SelectItem value="Ministère de la Recherche Scientifique">
                                Ministère de la Recherche Scientifique
                              </SelectItem>
                              <SelectItem value="Agence Nationale de Recherche">
                                Agence Nationale de Recherche
                              </SelectItem>
                              <SelectItem value="Centre National de Recherche Scientifique et Technique">
                                Centre National de Recherche Scientifique et Technique
                              </SelectItem>
                              <SelectItem value="Université Hassan II de Casablanca">
                                Université Hassan II de Casablanca
                              </SelectItem>
                              <SelectItem value="Fondation Hassan II pour la Recherche">
                                Fondation Hassan II pour la Recherche
                              </SelectItem>
                              <SelectItem value="Partenaires privés">
                                Partenaires privés
                              </SelectItem>
                              <SelectItem value="Organismes internationaux">
                                Organismes internationaux
                              </SelectItem>
                              <SelectItem value="Autre">
                                Autre
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">
                            Montant (MAD) <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            value={organisme.montant}
                            onChange={(e) => updateOrganismePartenaire(index, 'montant', parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs"
                            placeholder="0"
                            required
                          />
                          {organisme.organisme === "Autre" && (
                            <div className="space-y-1 flex flex-col items-center">
                              <Label className="text-xs text-gray-600 text-center">
                                Précisez l'organisme <span className="text-red-600">*</span>
                              </Label>
                              <Input
                                type="text"
                                value={organisme.organismeAutre || ""}
                                onChange={(e) => updateOrganismePartenaire(index, 'organismeAutre', e.target.value)}
                                className="h-8 text-xs text-center w-full"
                                placeholder="Nom de l'organisme"
                                required
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">
                            N° Transaction <span className="text-red-600">*</span>
                          </Label>
                          <Input
                            type="text"
                            value={organisme.numeroTransaction}
                            onChange={(e) => updateOrganismePartenaire(index, 'numeroTransaction', e.target.value)}
                            className="h-8 text-xs"
                            placeholder="N° opération"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOrganismePartenaire}
                    className="w-full h-8 text-xs"
                  >
                    + Ajouter un organisme
                  </Button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Résumé des organismes</div>
                  <div className="space-y-1">
                    {envoiData.organismesPartenaires.map((organisme, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        {organisme.organisme}: {formatBudget(organisme.montant)} (N° {organisme.numeroTransaction})
                      </div>
                    ))}
                    <div className="text-sm font-semibold text-gray-800 pt-2 border-t border-gray-200">
                      Total: {formatBudget(envoiData.organismesPartenaires.reduce((sum, organisme) => sum + organisme.montant, 0))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Montant de la tranche: {formatBudget(envoiData.montantTranche)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Réinitialiser les données pour un nouvel envoi
                  setEnvoiData({
                    numeroTranche: "",
                    montantTranche: 0,
                    dateEnvoi: new Date().toISOString().split('T')[0],
                    organismePartenaire: "",
                    organismeAutre: "",
                    numeroTransaction: "",
                    organismesMultiples: false,
                    organismesPartenaires: [
                      {
                        organisme: "",
                        organismeAutre: "",
                        montant: 0,
                        numeroTransaction: ""
                      }
                    ]
                  })
                }}
                className="px-3 py-1 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Nouvel envoi
              </Button>
            </div>
            <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowEnvoiModal(false)}
              className="px-4 py-2"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirmEnvoi}
              disabled={
                !envoiData.numeroTranche || 
                envoiData.montantTranche <= 0 || 
                !envoiData.dateEnvoi ||
                (!envoiData.organismesMultiples && (
                  !envoiData.organismePartenaire || 
                  !envoiData.numeroTransaction ||
                  (envoiData.organismePartenaire === "Autre" && !envoiData.organismeAutre)
                )) ||
                (envoiData.organismesMultiples && (
                  envoiData.organismesPartenaires.length === 0 || 
                  envoiData.organismesPartenaires.some(organisme => 
                    !organisme.organisme || 
                    organisme.montant <= 0 || 
                    !organisme.numeroTransaction ||
                    (organisme.organisme === "Autre" && !organisme.organismeAutre)
                  )
                ))
              }
              className="px-4 py-2 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
            >
              Confirmer l'envoi
            </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 