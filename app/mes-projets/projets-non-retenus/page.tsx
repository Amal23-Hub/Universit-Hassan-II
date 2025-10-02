"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { XCircle, AlertTriangle, RefreshCw, Search, Filter, Eye, FileText, DollarSign } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface ProjetNonRetenu {
  id: string
  titre: string
  description: string
  raison: string
  dateSoumission: string
  dateDecision: string
  programme: string
  budgetDemande: number
  duree: string
  recommandations?: string
  peutResoumettre: boolean
}

const projetsNonRetenus: ProjetNonRetenu[] = [
  {
    id: "PNR001",
    titre: "Développement d'une plateforme de e-learning pour l'enseignement supérieur",
    description: "Création d'une plateforme complète d'apprentissage en ligne avec IA",
    raison: "Budget trop élevé pour le programme",
    dateSoumission: "2024-01-15",
    dateDecision: "2024-03-15",
    programme: "Programme de Recherche en Éducation",
    budgetDemande: 450000,
    duree: "36 mois",
    recommandations: "Réduire le budget de 30% et simplifier la portée du projet",
    peutResoumettre: true
  },
  {
    id: "PNR002",
    titre: "Étude sur l'impact des réseaux sociaux sur la productivité au travail",
    description: "Analyse quantitative de l'effet des réseaux sociaux sur la performance professionnelle",
    raison: "Méthodologie insuffisante",
    dateSoumission: "2024-02-01",
    dateDecision: "2024-04-01",
    programme: "Programme de Recherche en Psychologie",
    budgetDemande: 120000,
    duree: "18 mois",
    recommandations: "Améliorer la méthodologie d'échantillonnage et ajouter des contrôles expérimentaux",
    peutResoumettre: true
  },
  {
    id: "PNR003",
    titre: "Optimisation des algorithmes de cryptographie quantique",
    description: "Développement de nouveaux algorithmes de sécurité pour l'ère post-quantique",
    raison: "Expertise insuffisante dans le domaine",
    dateSoumission: "2024-01-20",
    dateDecision: "2024-03-20",
    programme: "Programme National de Recherche en IA",
    budgetDemande: 280000,
    duree: "30 mois",
    recommandations: "Collaborer avec des experts en cryptographie quantique",
    peutResoumettre: false
  },
  {
    id: "PNR004",
    titre: "Étude comparative des méthodes de recyclage des déchets électroniques",
    description: "Analyse des différentes techniques de recyclage et leur impact environnemental",
    raison: "Projet déjà financé par un autre organisme",
    dateSoumission: "2024-02-10",
    dateDecision: "2024-04-10",
    programme: "Programme de Recherche Environnementale",
    budgetDemande: 150000,
    duree: "24 mois",
    recommandations: "Proposer un angle d'approche différent ou collaborer avec l'équipe existante",
    peutResoumettre: true
  }
]

export default function ProjetsNonRetenus() {
  const [searchTerm, setSearchTerm] = useState("")
  const [programmeFilter, setProgrammeFilter] = useState<string>("all")
  const [resoumettreFilter, setResoumettreFilter] = useState<string>("all")
  const [anneeFilter, setAnneeFilter] = useState<string>("all")

  const filteredProjets = projetsNonRetenus.filter(projet => {
    const matchesSearch = projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.raison.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProgramme = programmeFilter === "all" || projet.programme === programmeFilter
    const matchesResoumettre = resoumettreFilter === "all" || 
                              (resoumettreFilter === "oui" && projet.peutResoumettre) ||
                              (resoumettreFilter === "non" && !projet.peutResoumettre)
    const matchesAnnee = anneeFilter === "all" || new Date(projet.dateSoumission).getFullYear().toString() === anneeFilter
    
    return matchesSearch && matchesProgramme && matchesResoumettre && matchesAnnee
  })

  const programmes = [...new Set(projetsNonRetenus.map(p => p.programme))]

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes Projets Non Retenus</h1>
                <p className="text-gray-600 mt-1">
                  Consultez vos projets non retenus et les recommandations d'amélioration
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {projetsNonRetenus.length} projet(s) non retenu(s)
                </Badge>
              </div>
            </div>

      {/* Section de recherche et filtres améliorée */}
      <Card className="mb-4 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Search className="h-4 w-4 text-blue-600" />
            Recherche et filtres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Barre de recherche principale */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
            />
          </div>

          {/* Filtres en grille */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Programme</Label>
              <Select value={programmeFilter} onValueChange={setProgrammeFilter}>
                <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                  <SelectValue placeholder="Tous les programmes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les programmes</SelectItem>
                  {programmes.map(programme => (
                    <SelectItem key={programme} value={programme}>{programme}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Resoumettable</Label>
              <Select value={resoumettreFilter} onValueChange={setResoumettreFilter}>
                <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                  <SelectValue placeholder="Toutes les possibilités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les possibilités</SelectItem>
                  <SelectItem value="oui">Peut être resoumis</SelectItem>
                  <SelectItem value="non">Ne peut pas être resoumis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Année</Label>
              <Select value={anneeFilter} onValueChange={setAnneeFilter}>
                <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                  <SelectValue placeholder="Toutes les années" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des projets */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Programme
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Date soumission
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Date décision
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Raison rejet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Resoumettable
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProjets.map((projet) => (
                  <tr key={projet.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {projet.titre}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {projet.description}
                        </div>
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
                      {new Date(projet.dateSoumission).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {new Date(projet.dateDecision).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {projet.raison}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={`${projet.peutResoumettre ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {projet.peutResoumettre ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Oui
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Non
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        {projet.peutResoumettre && (
                          <Button size="sm" className="h-7 px-2 text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Resoumettre
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* État vide */}
      {filteredProjets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
            <p className="text-gray-600">
              {searchTerm || programmeFilter !== "all" || resoumettreFilter !== "all" 
                ? "Aucun projet ne correspond à vos critères de recherche."
                : "Vous n'avez pas de projets non retenus."}
            </p>
          </CardContent>
        </Card>
      )}
          </div>
        </main>
      </div>
    </div>
  )
} 