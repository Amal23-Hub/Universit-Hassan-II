"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  BarChart3,
  Search,
  Filter,
  Send,
  Plus,
  X,
  Clock,
  FileCheck,
  UserCheck,
  Building
} from "lucide-react"

interface ProjetAvancement {
  id: string
  programme: string
  projet: string
  coordonnateur: string
  etablissement: string
  organismeContractant: string
  budgetTotal: number
  dateDebut: string
  dateFin: string
  tranches: TrancheAvancement[]
}

interface TrancheAvancement {
  numero: number
  montant: number
  dateVersement: string
  dateFinTranche: string
  rapportIntermediaire?: RapportIntermediaire
  statut: "en_cours" | "terminee" | "rapport_depose" | "rapport_envoye"
}

interface RapportIntermediaire {
  id: string
  dateDepot: string
  fichier: string
  signeCoordonnateur: boolean
  signePresident: boolean
  dateEnvoi?: string
  commentaires?: string
}

export default function AvancementPage() {
  const [projets, setProjets] = useState<ProjetAvancement[]>([
    {
      id: "PROJ-001",
      programme: "Programme National de Recherche en IA",
      projet: "IA pour la santé préventive",
      coordonnateur: "Dr. Ahmed Benali",
      etablissement: "Université Hassan II",
      organismeContractant: "Ministère de l'Enseignement Supérieur",
      budgetTotal: 420000,
      dateDebut: "2024-02-15",
      dateFin: "2025-02-15",
      tranches: [
        {
          numero: 1,
          montant: 168000,
          dateVersement: "2024-02-15",
          dateFinTranche: "2024-08-15",
          statut: "terminee",
          rapportIntermediaire: {
            id: "RAPP-001-1",
            dateDepot: "2024-08-20",
            fichier: "rapport_intermediaire_proj001_tranche1.pdf",
            signeCoordonnateur: true,
            signePresident: true,
            dateEnvoi: "2024-08-25",
            commentaires: "Rapport déposé et envoyé avec succès"
          }
        },
        {
          numero: 2,
          montant: 126000,
          dateVersement: "2024-08-15",
          dateFinTranche: "2025-02-15",
          statut: "en_cours"
        },
        {
          numero: 3,
          montant: 126000,
          dateVersement: "2025-02-15",
          dateFinTranche: "2025-08-15",
          statut: "en_cours"
        }
      ]
    },
    {
      id: "PROJ-002",
      programme: "Programme National de Recherche en IA",
      projet: "Cybersécurité avancée",
      coordonnateur: "Dr. Fatima El Mansouri",
      etablissement: "Université Mohammed V",
      organismeContractant: "Agence Nationale de Réglementation des Télécommunications",
      budgetTotal: 300000,
      dateDebut: "2024-02-15",
      dateFin: "2025-02-15",
      tranches: [
        {
          numero: 1,
          montant: 120000,
          dateVersement: "2024-02-15",
          dateFinTranche: "2024-08-15",
          statut: "rapport_depose",
          rapportIntermediaire: {
            id: "RAPP-002-1",
            dateDepot: "2024-08-18",
            fichier: "rapport_intermediaire_proj002_tranche1.pdf",
            signeCoordonnateur: true,
            signePresident: false,
            commentaires: "En attente de signature du Président"
          }
        },
        {
          numero: 2,
          montant: 90000,
          dateVersement: "2024-08-15",
          dateFinTranche: "2025-02-15",
          statut: "en_cours"
        },
        {
          numero: 3,
          montant: 90000,
          dateVersement: "2025-02-15",
          dateFinTranche: "2025-08-15",
          statut: "en_cours"
        }
      ]
    },
    {
      id: "PROJ-003",
      programme: "Programme Énergies Renouvelables",
      projet: "Optimisation des panneaux solaires",
      coordonnateur: "Dr. Karim Alami",
      etablissement: "Université Ibn Zohr",
      organismeContractant: "Office National de l'Électricité",
      budgetTotal: 650000,
      dateDebut: "2024-03-20",
      dateFin: "2025-09-20",
      tranches: [
        {
          numero: 1,
          montant: 162500,
          dateVersement: "2024-03-20",
          dateFinTranche: "2024-09-20",
          statut: "terminee"
        },
        {
          numero: 2,
          montant: 162500,
          dateVersement: "2024-09-20",
          dateFinTranche: "2025-03-20",
          statut: "en_cours"
        },
        {
          numero: 3,
          montant: 162500,
          dateVersement: "2025-03-20",
          dateFinTranche: "2025-09-20",
          statut: "en_cours"
        },
        {
          numero: 4,
          montant: 162500,
          dateVersement: "2025-09-20",
          dateFinTranche: "2026-03-20",
          statut: "en_cours"
        }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [selectedProjet, setSelectedProjet] = useState<ProjetAvancement | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedTranche, setSelectedTranche] = useState<{projetId: string, trancheNum: number} | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [commentaires, setCommentaires] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getUniqueProgrammes = () => {
    return [...new Set(projets.map((p) => p.programme))].sort()
  }

  const getStatutBadge = (statut: string) => {
    const config = {
      en_cours: { label: "En cours", color: "bg-blue-100 text-blue-800" },
      terminee: { label: "Terminée", color: "bg-green-100 text-green-800" },
      rapport_depose: { label: "Rapport déposé", color: "bg-yellow-100 text-yellow-800" },
      rapport_envoye: { label: "Rapport envoyé", color: "bg-purple-100 text-purple-800" }
    }
    const configItem = config[statut as keyof typeof config]
    return (
      <Badge className={configItem.color}>
        {configItem.label}
      </Badge>
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleDeposerRapport = () => {
    if (selectedTranche && uploadedFile) {
      setProjets(projets.map(projet => {
        if (projet.id === selectedTranche.projetId) {
          return {
            ...projet,
            tranches: projet.tranches.map(tranche => {
              if (tranche.numero === selectedTranche.trancheNum) {
                return {
                  ...tranche,
                  statut: "rapport_depose",
                  rapportIntermediaire: {
                    id: `RAPP-${projet.id}-${tranche.numero}`,
                    dateDepot: new Date().toISOString().split('T')[0],
                    fichier: uploadedFile.name,
                    signeCoordonnateur: false,
                    signePresident: false,
                    commentaires: commentaires
                  }
                }
              }
              return tranche
            })
          }
        }
        return projet
      }))
      setShowUploadModal(false)
      setSelectedTranche(null)
      setUploadedFile(null)
      setCommentaires("")
    }
  }

  const handleEnvoiRapport = (projetId: string, trancheNum: number) => {
    setProjets(projets.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.numero === trancheNum && tranche.rapportIntermediaire) {
              return {
                ...tranche,
                statut: "rapport_envoye",
                rapportIntermediaire: {
                  ...tranche.rapportIntermediaire,
                  dateEnvoi: new Date().toISOString().split('T')[0]
                }
              }
            }
            return tranche
          })
        }
      }
      return projet
    }))
  }

  const getStats = () => {
    const totalProjets = projets.length
    const totalTranches = projets.reduce((sum, p) => sum + p.tranches.length, 0)
    const tranchesTerminees = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.statut === "terminee").length, 0
    )
    const rapportsDeposes = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.statut === "rapport_depose").length, 0
    )
    const rapportsEnvoyes = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.statut === "rapport_envoye").length, 0
    )

    return { totalProjets, totalTranches, tranchesTerminees, rapportsDeposes, rapportsEnvoyes }
  }

  const stats = getStats()

  const filteredProjets = projets.filter(projet => {
    const matchesSearch = 
      projet.projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.coordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.programme.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProgramme = filterProgramme === "all" || projet.programme === filterProgramme
    const matchesStatut = filterStatut === "all" || 
      projet.tranches.some(t => t.statut === filterStatut)

    return matchesSearch && matchesProgramme && matchesStatut
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="mx-auto max-w-7xl">
            {/* En-tête */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">État d'avancement du Projet</h1>
                  <p className="text-sm text-gray-600 mt-1">UH2C - Gestion des rapports intermédiaires</p>
                </div>
              </div>
            </div>

            {/* Statistiques - AVANT les filtres */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
              <Card className="h-16 border-l-4 border-l-blue-900">
                <CardContent className="p-2 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Total Projets</p>
                      <p className="text-base font-bold text-gray-700">{stats.totalProjets}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-16 border-l-4 border-l-blue-900">
                <CardContent className="p-2 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Total Tranches</p>
                      <p className="text-base font-bold text-gray-700">{stats.totalTranches}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-16 border-l-4 border-l-blue-900">
                <CardContent className="p-2 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Tranches Terminées</p>
                      <p className="text-base font-bold text-gray-700">{stats.tranchesTerminees}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-16 border-l-4 border-l-blue-900">
                <CardContent className="p-2 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Rapports Déposés</p>
                      <p className="text-base font-bold text-gray-700">{stats.rapportsDeposes}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileCheck className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-16 border-l-4 border-l-blue-900">
                <CardContent className="p-2 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">Rapports Envoyés</p>
                      <p className="text-base font-bold text-gray-700">{stats.rapportsEnvoyes}</p>
                    </div>
                    <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Send className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section de recherche et filtres améliorée - APRÈS les statistiques */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-gray-700">Programme</Label>
                    <Select
                      value={filterProgramme}
                      onValueChange={(value) => setFilterProgramme(value)}
                    >
                      <SelectTrigger className="h-7 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-xs">
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

                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium text-gray-700">Statut</Label>
                    <Select
                      value={filterStatut}
                      onValueChange={(value) => setFilterStatut(value)}
                    >
                      <SelectTrigger className="h-7 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="terminee">Terminée</SelectItem>
                        <SelectItem value="rapport_depose">Rapport déposé</SelectItem>
                        <SelectItem value="rapport_envoye">Rapport envoyé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex items-center justify-between pt-0.5 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>{filteredProjets.length} projet(s) trouvé(s)</span>
                    {(searchTerm || filterProgramme !== "all" || filterStatut !== "all") && (
                      <Badge variant="outline" className="text-xs">
                        Filtres actifs
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des projets */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  État d'avancement des Projets
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {filteredProjets.map((projet, index) => (
                    <div 
                      key={projet.id} 
                      className={`p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate text-sm">
                                {projet.projet}
                              </h3>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {projet.programme}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Coordonnateur:</span>
                              <span className="font-medium text-gray-700">{projet.coordonnateur}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Établissement:</span>
                              <span className="font-medium text-gray-700">{projet.etablissement}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Budget:</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(projet.budgetTotal)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Organisme:</span>
                              <span className="font-medium text-gray-700">{projet.organismeContractant}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProjet(projet)}
                          className="h-8 px-2 text-xs hover:bg-blue-100 hover:text-blue-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                      </div>

                      {/* Tranches */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {projet.tranches.map((tranche) => (
                          <div key={tranche.numero} className="border rounded p-2 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">Tranche {tranche.numero}</span>
                              {getStatutBadge(tranche.statut)}
                            </div>
                            <div className="text-gray-600 mb-1">
                              {formatCurrency(tranche.montant)}
                            </div>
                            <div className="text-gray-500 mb-2">
                              Fin: {new Date(tranche.dateFinTranche).toLocaleDateString('fr-FR')}
                            </div>
                            
                            {tranche.statut === "terminee" && !tranche.rapportIntermediaire && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTranche({ projetId: projet.id, trancheNum: tranche.numero })
                                  setShowUploadModal(true)
                                }}
                                className="h-6 px-2 text-xs hover:bg-green-100 hover:text-green-700 w-full"
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Déposer Rapport
                              </Button>
                            )}
                            
                            {tranche.rapportIntermediaire && (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <FileCheck className="h-3 w-3 text-green-600" />
                                  <span className="text-green-600">Rapport déposé</span>
                                </div>
                                <div className="text-gray-500">
                                  {tranche.rapportIntermediaire.dateDepot}
                                </div>
                                {tranche.statut === "rapport_depose" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEnvoiRapport(projet.id, tranche.numero)}
                                    className="h-6 px-2 text-xs hover:bg-purple-100 hover:text-purple-700 w-full"
                                  >
                                    <Send className="h-3 w-3 mr-1" />
                                    Envoyer
                                  </Button>
                                )}
                                {tranche.statut === "rapport_envoye" && (
                                  <div className="text-purple-600 text-xs">
                                    Envoyé: {tranche.rapportIntermediaire.dateEnvoi}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modal de détails */}
          {selectedProjet && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-900 rounded-l-lg"></div>
                  <div className="ml-1 bg-blue-50 rounded-lg p-2 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="h-2.5 w-2.5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-blue-900 mb-0.5">Détails du Projet</h2>
                          <p className="text-xs text-gray-600">{selectedProjet.projet}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedProjet(null)}
                        className="h-4 w-4 p-0 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 space-y-3">
                  {/* Informations générales */}
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">Programme</Label>
                      <p className="font-medium text-gray-900">{selectedProjet.programme}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">Coordonnateur</Label>
                      <p className="font-medium text-gray-900">{selectedProjet.coordonnateur}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">Établissement</Label>
                      <p className="font-medium text-gray-900">{selectedProjet.etablissement}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">Organisme Contractant</Label>
                      <p className="font-medium text-gray-900">{selectedProjet.organismeContractant}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">Budget Total</Label>
                      <p className="font-medium text-blue-600">{formatCurrency(selectedProjet.budgetTotal)}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-600">Période</Label>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedProjet.dateDebut).toLocaleDateString('fr-FR')} - {new Date(selectedProjet.dateFin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {/* Détails des tranches */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-900 border-b pb-1">Détails des Tranches et Rapports</h3>
                    <div className="space-y-2">
                      {selectedProjet.tranches.map((tranche) => (
                        <div key={tranche.numero} className="border border-gray-200 rounded-lg p-2">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-xs text-gray-900">Tranche {tranche.numero}</h4>
                            {getStatutBadge(tranche.statut)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mb-1 text-xs">
                            <div>
                              <span className="text-gray-500">Montant:</span>
                              <span className="ml-1 font-medium text-gray-900">{formatCurrency(tranche.montant)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Date de fin:</span>
                              <span className="ml-1 font-medium text-gray-900">{new Date(tranche.dateFinTranche).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>

                          {tranche.rapportIntermediaire && (
                            <div className="bg-blue-50 rounded p-2 text-xs border border-blue-100">
                              <div className="font-medium mb-1 text-blue-900">Rapport Intermédiaire</div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-gray-600">Date de dépôt:</span>
                                  <span className="ml-1 text-gray-900">{tranche.rapportIntermediaire.dateDepot}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Fichier:</span>
                                  <span className="ml-1 text-gray-900">{tranche.rapportIntermediaire.fichier}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-600">Signatures:</span>
                                  <div className="flex space-x-1">
                                    <Badge variant={tranche.rapportIntermediaire.signeCoordonnateur ? "default" : "secondary"} className="text-xs">
                                      Coordonnateur
                                    </Badge>
                                    <Badge variant={tranche.rapportIntermediaire.signePresident ? "default" : "secondary"} className="text-xs">
                                      Président
                                    </Badge>
                                  </div>
                                </div>
                                {tranche.rapportIntermediaire.dateEnvoi && (
                                  <div>
                                    <span className="text-gray-600">Date d'envoi:</span>
                                    <span className="ml-1 text-blue-600">{tranche.rapportIntermediaire.dateEnvoi}</span>
                                  </div>
                                )}
                              </div>
                              {tranche.rapportIntermediaire.commentaires && (
                                <div className="mt-1 text-gray-600 text-xs">
                                  {tranche.rapportIntermediaire.commentaires}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de dépôt de rapport */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Déposer un Rapport Intermédiaire</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowUploadModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <Label htmlFor="rapport-upload" className="cursor-pointer">
                      <div className="font-medium text-gray-900 mb-1">Sélectionner le rapport PDF</div>
                      <div className="text-sm text-gray-500">Rapport signé par le coordonnateur et le président</div>
                    </Label>
                    <Input
                      id="rapport-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {uploadedFile && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium text-sm">{uploadedFile.name}</div>
                          <div className="text-xs text-green-700">
                            Taille: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium">Commentaires (optionnel)</Label>
                    <Textarea
                      placeholder="Ajouter des commentaires sur le rapport..."
                      value={commentaires}
                      onChange={(e) => setCommentaires(e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowUploadModal(false)}>
                      Annuler
                    </Button>
                    <Button 
                      disabled={!uploadedFile}
                      size="sm"
                      onClick={handleDeposerRapport}
                    >
                      Déposer le Rapport
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 