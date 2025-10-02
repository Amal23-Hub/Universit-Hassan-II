"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { 
  FileText, 
  CheckCircle,
  Users,
  BarChart3,
  Search,
  Filter,
  Save,
  X,
  Calculator,
  Eye
} from "lucide-react"

interface ProjetEmploi {
  id: string
  programme: string
  projet: string
  coordonnateur: string
  etablissement: string
  budgetTotal: number
  dateDebut: string
  dateFin: string
  tranches: TrancheEmploi[]
}

interface TrancheEmploi {
  numero: number
  montantPrevisionnel: number
  montantUtilise: number
  dateVersement: string
  dateFinTranche: string
  statut: "en_cours" | "terminee" | "emploi_saisi" | "emploi_valide"
  rubriques: RubriqueEmploi[]
  programmeEmploi?: ProgrammeEmploi
}

interface RubriqueEmploi {
  nom: string
  budgetPrevisionnel: number
  budgetUtilise: number
  pourcentagePrevisionnel: number
  pourcentageUtilise: number
  description?: string
}

interface ProgrammeEmploi {
  id: string
  dateSaisie: string
  totalUtilise: number
  ecart: number
  commentaires?: string
  valide: boolean
  dateValidation?: string
}

export default function ProgrammeEmploiPage() {
  const [projets, setProjets] = useState<ProjetEmploi[]>([
    {
      id: "PROJ-001",
      programme: "Programme National de Recherche en IA",
      projet: "IA pour la santé préventive",
      coordonnateur: "Dr. Ahmed Benali",
      etablissement: "Université Hassan II",
      budgetTotal: 420000,
      dateDebut: "2024-02-15",
      dateFin: "2025-02-15",
      tranches: [
        {
          numero: 1,
          montantPrevisionnel: 168000,
          montantUtilise: 0,
          dateVersement: "2024-02-15",
          dateFinTranche: "2024-08-15",
          statut: "terminee",
          rubriques: [
            {
              nom: "Personnel",
              budgetPrevisionnel: 67200,
              budgetUtilise: 0,
              pourcentagePrevisionnel: 40,
              pourcentageUtilise: 0,
              description: "Salaires chercheurs et assistants"
            },
            {
              nom: "Équipements",
              budgetPrevisionnel: 50400,
              budgetUtilise: 0,
              pourcentagePrevisionnel: 30,
              pourcentageUtilise: 0,
              description: "Matériel informatique et logiciels"
            },
            {
              nom: "Fonctionnement",
              budgetPrevisionnel: 33600,
              budgetUtilise: 0,
              pourcentagePrevisionnel: 20,
              pourcentageUtilise: 0,
              description: "Frais de déplacement et consommables"
            },
            {
              nom: "Autres",
              budgetPrevisionnel: 16800,
              budgetUtilise: 0,
              pourcentagePrevisionnel: 10,
              pourcentageUtilise: 0,
              description: "Frais divers et imprévus"
            }
          ]
        }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [selectedTranche, setSelectedTranche] = useState<{projetId: string, trancheNum: number} | null>(null)
  const [showSaisieModal, setShowSaisieModal] = useState(false)
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
      emploi_saisi: { label: "Emploi saisi", color: "bg-yellow-100 text-yellow-800" },
      emploi_valide: { label: "Emploi validé", color: "bg-purple-100 text-purple-800" }
    }
    const configItem = config[statut as keyof typeof config]
    return (
      <Badge className={configItem.color}>
        {configItem.label}
      </Badge>
    )
  }

  const handleRubriqueChange = (projetId: string, trancheNum: number, rubriqueIndex: number, value: number) => {
    setProjets(projets.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.numero === trancheNum) {
              const newRubriques = [...tranche.rubriques]
              newRubriques[rubriqueIndex] = {
                ...newRubriques[rubriqueIndex],
                budgetUtilise: value,
                pourcentageUtilise: value > 0 ? (value / tranche.montantPrevisionnel) * 100 : 0
              }
              
              const totalUtilise = newRubriques.reduce((sum, r) => sum + r.budgetUtilise, 0)
              
              return {
                ...tranche,
                montantUtilise: totalUtilise,
                rubriques: newRubriques
              }
            }
            return tranche
          })
        }
      }
      return projet
    }))
  }

  const handleSauvegarderEmploi = () => {
    if (selectedTranche) {
      const projet = projets.find(p => p.id === selectedTranche.projetId)
      const tranche = projet?.tranches.find(t => t.numero === selectedTranche.trancheNum)
      
      if (projet && tranche) {
        const ecart = tranche.montantUtilise - tranche.montantPrevisionnel
        
        setProjets(projets.map(p => {
          if (p.id === selectedTranche.projetId) {
            return {
              ...p,
              tranches: p.tranches.map(t => {
                if (t.numero === selectedTranche.trancheNum) {
                  return {
                    ...t,
                    statut: "emploi_saisi",
                    programmeEmploi: {
                      id: `EMP-${p.id}-${t.numero}`,
                      dateSaisie: new Date().toISOString().split('T')[0],
                      totalUtilise: t.montantUtilise,
                      ecart: ecart,
                      commentaires: commentaires,
                      valide: false
                    }
                  }
                }
                return t
              })
            }
          }
          return p
        }))
        
        setShowSaisieModal(false)
        setSelectedTranche(null)
        setCommentaires("")
      }
    }
  }

  const getStats = () => {
    const totalProjets = projets.length
    const totalTranches = projets.reduce((sum, p) => sum + p.tranches.length, 0)
    const tranchesTerminees = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.statut === "terminee").length, 0
    )
    const emploisSaisis = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.statut === "emploi_saisi").length, 0
    )
    const emploisValides = projets.reduce((sum, p) => 
      sum + p.tranches.filter(t => t.statut === "emploi_valide").length, 0
    )

    return { totalProjets, totalTranches, tranchesTerminees, emploisSaisis, emploisValides }
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
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Saisie du programme d'emploi exécuté</h1>
                  <p className="text-sm text-gray-600 mt-1">Enseignant chercheur - Justification des dépenses par rubrique</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Projets</p>
                      <p className="text-lg font-bold">{stats.totalProjets}</p>
                    </div>
                    <Users className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Tranches</p>
                      <p className="text-lg font-bold">{stats.totalTranches}</p>
                    </div>
                    <BarChart3 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Tranches Terminées</p>
                      <p className="text-lg font-bold text-green-600">{stats.tranchesTerminees}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Emplois Saisis</p>
                      <p className="text-lg font-bold text-yellow-600">{stats.emploisSaisis}</p>
                    </div>
                    <Calculator className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Emplois Validés</p>
                      <p className="text-lg font-bold text-purple-600">{stats.emploisValides}</p>
                    </div>
                    <FileText className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres et Recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col md:flex-row md:items-end md:space-x-4 gap-3 md:gap-0">
                  <div className="flex-1">
                    <Label className="text-xs">Recherche</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        placeholder="Rechercher par projet, coordonnateur, établissement..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 text-sm h-8"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Programme</Label>
                    <Select
                      value={filterProgramme}
                      onValueChange={(value) => setFilterProgramme(value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
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
                  <div className="flex-1">
                    <Label className="text-xs">Statut</Label>
                    <Select
                      value={filterStatut}
                      onValueChange={(value) => setFilterStatut(value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="terminee">Terminée</SelectItem>
                        <SelectItem value="emploi_saisi">Emploi saisi</SelectItem>
                        <SelectItem value="emploi_valide">Emploi validé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-red-50 border-b">
                <CardTitle className="text-base flex items-center">
                  <Calculator className="h-4 w-4 mr-2 text-orange-600" />
                  Mes Projets - Programme d'emploi exécuté
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {filteredProjets.map((projet, index) => (
                    <div 
                      key={projet.id} 
                      className={`p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 ${
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
                              <span className="text-gray-500">Budget Total:</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(projet.budgetTotal)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Période:</span>
                              <span className="font-medium text-gray-700">
                                {new Date(projet.dateDebut).toLocaleDateString('fr-FR')} - {new Date(projet.dateFin).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs hover:bg-blue-100 hover:text-blue-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {projet.tranches.map((tranche) => (
                          <div key={tranche.numero} className="border rounded p-3 text-xs">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Tranche {tranche.numero}</span>
                              {getStatutBadge(tranche.statut)}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <span className="text-gray-600">Prévisionnel:</span>
                                <span className="ml-1 font-medium">{formatCurrency(tranche.montantPrevisionnel)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Utilisé:</span>
                                <span className={`ml-1 font-medium ${
                                  tranche.montantUtilise > tranche.montantPrevisionnel ? 'text-red-600' : 
                                  tranche.montantUtilise < tranche.montantPrevisionnel ? 'text-green-600' : 'text-gray-700'
                                }`}>
                                  {formatCurrency(tranche.montantUtilise)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-gray-500 mb-2">
                              Fin: {new Date(tranche.dateFinTranche).toLocaleDateString('fr-FR')}
                            </div>
                            
                            {tranche.statut === "terminee" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedTranche({ projetId: projet.id, trancheNum: tranche.numero })
                                  setShowSaisieModal(true)
                                }}
                                className="h-6 px-2 text-xs hover:bg-orange-100 hover:text-orange-700 w-full"
                              >
                                <Calculator className="h-3 w-3 mr-1" />
                                Saisir Emploi
                              </Button>
                            )}
                            
                            {tranche.programmeEmploi && (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1">
                                  <FileText className="h-3 w-3 text-green-600" />
                                  <span className="text-green-600">Emploi saisi</span>
                                </div>
                                <div className="text-gray-500">
                                  {tranche.programmeEmploi.dateSaisie}
                                </div>
                                <div className={`text-xs ${
                                  tranche.programmeEmploi.ecart > 0 ? 'text-red-600' : 
                                  tranche.programmeEmploi.ecart < 0 ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                  Écart: {formatCurrency(tranche.programmeEmploi.ecart)}
                                </div>
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

          {showSaisieModal && selectedTranche && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Saisie du programme d'emploi exécuté</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowSaisieModal(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {(() => {
                    const projet = projets.find(p => p.id === selectedTranche.projetId)
                    const tranche = projet?.tranches.find(t => t.numero === selectedTranche.trancheNum)
                    
                    if (!projet || !tranche) return null
                    
                    return (
                      <>
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <div className="text-sm font-medium text-blue-900 mb-2">
                            Projet: {projet.projet} - Tranche {tranche.numero}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-blue-700">Montant prévisionnel:</span>
                              <span className="ml-1 font-medium">{formatCurrency(tranche.montantPrevisionnel)}</span>
                            </div>
                            <div>
                              <span className="text-blue-700">Période:</span>
                              <span className="ml-1">{new Date(tranche.dateVersement).toLocaleDateString('fr-FR')} - {new Date(tranche.dateFinTranche).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>

                                                 <div className="overflow-x-auto">
                           <table className="w-full text-sm">
                             <thead>
                               <tr className="border-b border-gray-200 bg-gray-50">
                                 <th className="text-left py-3 px-4 font-medium text-gray-700">Rubrique</th>
                                 <th className="text-right py-3 px-4 font-medium text-gray-700">Budget Prévisionnel</th>
                                 <th className="text-right py-3 px-4 font-medium text-gray-700">Budget Utilisé</th>
                                 <th className="text-right py-3 px-4 font-medium text-gray-700">Écart</th>
                                 <th className="text-center py-3 px-4 font-medium text-gray-700">% Utilisé</th>
                               </tr>
                             </thead>
                             <tbody>
                               {tranche.rubriques.map((rubrique, index) => {
                                 const ecart = rubrique.budgetUtilise - rubrique.budgetPrevisionnel
                                 return (
                                   <tr key={index} className="border-b border-gray-100">
                                     <td className="py-3 px-4">
                                       <div>
                                         <div className="font-medium">{rubrique.nom}</div>
                                         <div className="text-gray-500 text-xs">{rubrique.description}</div>
                                       </div>
                                     </td>
                                     <td className="py-3 px-4 text-right">
                                       {formatCurrency(rubrique.budgetPrevisionnel)}
                                     </td>
                                     <td className="py-3 px-4 text-right">
                                       <Input
                                         type="number"
                                         value={rubrique.budgetUtilise}
                                         onChange={(e) => handleRubriqueChange(selectedTranche.projetId, selectedTranche.trancheNum, index, parseFloat(e.target.value) || 0)}
                                         className="w-24 text-right"
                                         min="0"
                                       />
                                     </td>
                                     <td className="py-3 px-4 text-right">
                                       <span className={ecart > 0 ? 'text-red-600' : ecart < 0 ? 'text-green-600' : 'text-gray-600'}>
                                         {formatCurrency(ecart)}
                                       </span>
                                     </td>
                                     <td className="py-3 px-4 text-center">
                                       <span>{rubrique.budgetUtilise > 0 ? (rubrique.budgetUtilise / tranche.montantPrevisionnel * 100).toFixed(1) : '0'}%</span>
                                     </td>
                                   </tr>
                                 )
                               })}
                             </tbody>
                             <tfoot>
                               <tr className="bg-gray-50 font-medium">
                                 <td className="py-3 px-4">TOTAL</td>
                                 <td className="py-3 px-4 text-right">{formatCurrency(tranche.montantPrevisionnel)}</td>
                                 <td className="py-3 px-4 text-right">
                                   <span className={tranche.montantUtilise > tranche.montantPrevisionnel ? 'text-red-600' : 'text-gray-700'}>
                                     {formatCurrency(tranche.montantUtilise)}
                                   </span>
                                 </td>
                                 <td className="py-3 px-4 text-right">
                                   <span className={tranche.montantUtilise > tranche.montantPrevisionnel ? 'text-red-600' : 
                                     tranche.montantUtilise < tranche.montantPrevisionnel ? 'text-green-600' : 'text-gray-600'}>
                                     {formatCurrency(tranche.montantUtilise - tranche.montantPrevisionnel)}
                                   </span>
                                 </td>
                                 <td className="py-3 px-4 text-center">
                                   {tranche.montantUtilise > 0 ? (tranche.montantUtilise / tranche.montantPrevisionnel * 100).toFixed(1) : '0'}%
                                 </td>
                               </tr>
                             </tfoot>
                           </table>
                         </div>

                        <div>
                          <Label className="text-sm font-medium">Commentaires (optionnel)</Label>
                          <Textarea
                            placeholder="Ajouter des commentaires sur l'utilisation du budget..."
                            value={commentaires}
                            onChange={(e) => setCommentaires(e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setShowSaisieModal(false)}>
                            Annuler
                          </Button>
                          <Button 
                            size="sm"
                            onClick={handleSauvegarderEmploi}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Sauvegarder l'emploi
                          </Button>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 