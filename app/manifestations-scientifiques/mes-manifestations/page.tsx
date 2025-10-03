"use client"

import React, { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, MapPin, User, Users, Building2, Target, FileText, XCircle, ExternalLink, Tag, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ManifestationEnseignant {
  id: string
  intitule: string
  type: string
  dateDebut: string
  dateFin: string
  organisateur: string
  lieu: string
  pays: string
  ville: string
  lien: string
  indexation: string
  resume: string
  statut: "Programmée" | "En cours" | "Terminée"
  dateCreation: string
  role: "Organisateur" | "Participant" | "Conférencier" | "Modérateur"
  niveauParticipation: "International" | "National" | "Régional" | "Local"
}

export default function MesManifestations() {
  const [manifestations, setManifestations] = useState<ManifestationEnseignant[]>([
    {
      id: "1",
      intitule: "Conférence Internationale sur l'Intelligence Artificielle",
      type: "Colloque",
      dateDebut: "2024-06-15",
      dateFin: "2024-06-17",
      organisateur: "UH2C",
      lieu: "Faculté des Sciences Ben M'Sik",
      pays: "Maroc",
      ville: "Casablanca",
      lien: "https://conference-ia.uh2c.ma",
      indexation: "Indexée",
      resume: "Conférence internationale sur les dernières avancées en intelligence artificielle",
      statut: "Terminée",
      dateCreation: "2024-01-15",
      role: "Conférencier",
      niveauParticipation: "International"
    },
    {
      id: "2",
      intitule: "Séminaire sur les Technologies Émergentes",
      type: "Séminaire",
      dateDebut: "2024-07-20",
      dateFin: "2024-07-21",
      organisateur: "Autre",
      lieu: "Centre de Conférences",
      pays: "France",
      ville: "Paris",
      lien: "https://seminaire-tech.fr",
      indexation: "Indexée",
      resume: "Séminaire dédié aux technologies émergentes et leur impact sur la société",
      statut: "Terminée",
      dateCreation: "2024-02-10",
      role: "Participant",
      niveauParticipation: "International"
    },
    {
      id: "3",
      intitule: "Workshop sur la Recherche en Informatique",
      type: "Workshop",
      dateDebut: "2024-09-10",
      dateFin: "2024-09-12",
      organisateur: "UH2C",
      lieu: "Faculté des Sciences Ben M'Sik",
      pays: "Maroc",
      ville: "Casablanca",
      lien: "",
      indexation: "En cours",
      resume: "Workshop organisé pour présenter les dernières recherches en informatique",
      statut: "Programmée",
      dateCreation: "2024-03-01",
      role: "Organisateur",
      niveauParticipation: "National"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatut, setFilterStatut] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [filterNiveau, setFilterNiveau] = useState("")
  const [selectedManifestations, setSelectedManifestations] = useState<string[]>([])
  const { toast } = useToast()

  const typesManifestation = [
    "Colloque",
    "Journée d'étude", 
    "Séminaire",
    "Workshop",
    "Conférence",
    "Symposium",
    "Congrès",
    "Autre"
  ]

  const roles = [
    "Organisateur",
    "Participant",
    "Conférencier",
    "Modérateur"
  ]

  const niveauxParticipation = [
    "International",
    "National",
    "Régional",
    "Local"
  ]

  const filteredManifestations = manifestations.filter(manifestation => {
    const matchesSearch = manifestation.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifestation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifestation.ville.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || filterType === "all" || manifestation.type === filterType
    const matchesStatut = !filterStatut || filterStatut === "all" || manifestation.statut === filterStatut
    const matchesRole = !filterRole || filterRole === "all" || manifestation.role === filterRole
    const matchesNiveau = !filterNiveau || filterNiveau === "all" || manifestation.niveauParticipation === filterNiveau
    
    return matchesSearch && matchesType && matchesStatut && matchesRole && matchesNiveau
  })

  const handleSelectManifestation = (id: string) => {
    setSelectedManifestations(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedManifestations.length === filteredManifestations.length) {
      setSelectedManifestations([])
    } else {
      setSelectedManifestations(filteredManifestations.map(m => m.id))
    }
  }

  const getStatutBadge = (statut: string) => {
    return <Badge variant="outline" className="text-gray-700 border-gray-300">{statut}</Badge>
  }

  const getIndexationBadge = (indexation: string) => {
    return <Badge variant="outline" className="text-gray-700 border-gray-300">{indexation}</Badge>
  }

  const getRoleBadge = (role: string) => {
    return <Badge variant="outline" className="text-gray-700 border-gray-300">{role}</Badge>
  }

  const getNiveauBadge = (niveau: string) => {
    return <Badge variant="outline" className="text-gray-700 border-gray-300">{niveau}</Badge>
  }


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-4">
              <h1 className="text-lg font-bold text-gray-900 mb-1">Mes Manifestations Scientifiques</h1>
              <p className="text-xs text-gray-600">Vue d'ensemble de toutes mes manifestations (organisation, participation, conférences)</p>
            </div>


            {/* Filtres avancés */}
            <div className="bg-blue-50 border border-gray-300 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-3 w-3 text-gray-700" />
                <h3 className="text-sm font-bold text-black">Filtres de recherche</h3>
              </div>
              
              <div className="space-y-3">
                {/* Champ de recherche principal */}
                <div>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 w-3 h-3" />
                    <Input
                      placeholder="Rechercher une manifestation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8 text-xs bg-white border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Filtres en trois colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Tag className="h-3 w-3 text-gray-600" />
                      <Label className="text-xs font-medium text-gray-700">Type</Label>
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-8 text-xs bg-white border-gray-300 rounded-md">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {typesManifestation.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <User className="h-3 w-3 text-gray-600" />
                      <Label className="text-xs font-medium text-gray-700">Rôle</Label>
                    </div>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="h-8 text-xs bg-white border-gray-300 rounded-md">
                        <SelectValue placeholder="Tous les rôles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les rôles</SelectItem>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="h-3 w-3 text-gray-600" />
                      <Label className="text-xs font-medium text-gray-700">Niveau</Label>
                    </div>
                    <Select value={filterNiveau} onValueChange={setFilterNiveau}>
                      <SelectTrigger className="h-8 text-xs bg-white border-gray-300 rounded-md">
                        <SelectValue placeholder="Tous les niveaux" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les niveaux</SelectItem>
                        {niveauxParticipation.map(niveau => (
                          <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <CheckCircle className="h-3 w-3 text-gray-600" />
                      <Label className="text-xs font-medium text-gray-700">Statut</Label>
                    </div>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger className="h-8 text-xs bg-white border-gray-300 rounded-md">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="Programmée">Programmée</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Terminée">Terminée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Manifestations List */}
            <div className="space-y-4">
              {filteredManifestations.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune manifestation trouvée</h3>
                    <p className="text-gray-500 text-center mb-4">
                      {searchTerm || filterType || filterStatut || filterRole || filterNiveau
                        ? "Aucune manifestation ne correspond à vos critères de recherche."
                        : "Vous n'avez pas encore de manifestations enregistrées."
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>

                  {/* Manifestations */}
                  {filteredManifestations.map((manifestation) => (
                    <Card key={manifestation.id} className="hover:shadow-md transition-shadow border-l-4 border-blue-900">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Checkbox
                              checked={selectedManifestations.includes(manifestation.id)}
                              onCheckedChange={() => handleSelectManifestation(manifestation.id)}
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                                    {manifestation.intitule}
                                  </h3>
                                  <div className="flex items-center space-x-3 text-xs text-gray-600 mb-2">
                                    <div className="flex items-center">
                                      <Tag className="w-3 h-3 mr-1" />
                                      {manifestation.type}
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="w-3 h-3 mr-1" />
                                      {new Date(manifestation.dateDebut).toLocaleDateString('fr-FR')} - {new Date(manifestation.dateFin).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {manifestation.ville}, {manifestation.pays}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getRoleBadge(manifestation.role)}
                                    {getNiveauBadge(manifestation.niveauParticipation)}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {getStatutBadge(manifestation.statut)}
                                  {getIndexationBadge(manifestation.indexation)}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <div className="flex items-center mb-1">
                                    <Building2 className="w-3 h-3 mr-1 text-gray-500" />
                                    <span className="font-medium">Organisateur:</span>
                                    <span className="ml-1">{manifestation.organisateur}</span>
                                  </div>
                                  <div className="flex items-center mb-1">
                                    <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                                    <span className="font-medium">Lieu:</span>
                                    <span className="ml-1">{manifestation.lieu}</span>
                                  </div>
                                  {manifestation.lien && (
                                    <div className="flex items-center">
                                      <ExternalLink className="w-3 h-3 mr-1 text-gray-500" />
                                      <a 
                                        href={manifestation.lien} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline text-xs"
                                      >
                                        Site web
                                      </a>
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  {manifestation.resume && (
                                    <div>
                                      <span className="font-medium">Résumé:</span>
                                      <p className="text-gray-600 mt-1 line-clamp-2 text-xs">{manifestation.resume}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 ml-4">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
