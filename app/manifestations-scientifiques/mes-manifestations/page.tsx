"use client"

import React, { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Filter, Eye, Edit, Trash2, Calendar, MapPin, User, Users, Building2, Target, FileText, XCircle, ExternalLink, AlertTriangle, CheckCircle, Tag, UserCheck, CalendarPlus } from "lucide-react"
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
    switch (statut) {
      case "Programmée":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Calendar className="w-3 h-3 mr-1" />{statut}</Badge>
      case "En cours":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" />{statut}</Badge>
      case "Terminée":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />{statut}</Badge>
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  const getIndexationBadge = (indexation: string) => {
    switch (indexation) {
      case "Indexée":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />{indexation}</Badge>
      case "En cours":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><AlertTriangle className="w-3 h-3 mr-1" />{indexation}</Badge>
      case "Non indexée":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />{indexation}</Badge>
      default:
        return <Badge variant="outline">{indexation}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Organisateur":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><CalendarPlus className="w-3 h-3 mr-1" />{role}</Badge>
      case "Conférencier":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><User className="w-3 h-3 mr-1" />{role}</Badge>
      case "Participant":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><UserCheck className="w-3 h-3 mr-1" />{role}</Badge>
      case "Modérateur":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200"><Users className="w-3 h-3 mr-1" />{role}</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getNiveauBadge = (niveau: string) => {
    switch (niveau) {
      case "International":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><Target className="w-3 h-3 mr-1" />{niveau}</Badge>
      case "National":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Target className="w-3 h-3 mr-1" />{niveau}</Badge>
      case "Régional":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><Target className="w-3 h-3 mr-1" />{niveau}</Badge>
      case "Local":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><Target className="w-3 h-3 mr-1" />{niveau}</Badge>
      default:
        return <Badge variant="outline">{niveau}</Badge>
    }
  }

  const stats = {
    total: manifestations.length,
    organisees: manifestations.filter(m => m.role === "Organisateur").length,
    participations: manifestations.filter(m => m.role === "Participant").length,
    conferences: manifestations.filter(m => m.role === "Conférencier").length,
    internationales: manifestations.filter(m => m.niveauParticipation === "International").length
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Manifestations Scientifiques</h1>
              <p className="text-gray-600">Vue d'ensemble de toutes mes manifestations (organisation, participation, conférences)</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CalendarPlus className="w-8 h-8 text-purple-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Organisées</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.organisees}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <UserCheck className="w-8 h-8 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Participations</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.participations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <User className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Conférences</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.conferences}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Target className="w-8 h-8 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-600">Internationales</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.internationales}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher une manifestation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {typesManifestation.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterNiveau} onValueChange={setFilterNiveau}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    {niveauxParticipation.map(niveau => (
                      <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatut} onValueChange={setFilterStatut}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Statut" />
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
                  {/* Table Header */}
                  <Card>
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center">
                          <Checkbox
                            checked={selectedManifestations.length === filteredManifestations.length && filteredManifestations.length > 0}
                            onCheckedChange={handleSelectAll}
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {selectedManifestations.length > 0 
                              ? `${selectedManifestations.length} sélectionné(s)` 
                              : `${filteredManifestations.length} manifestation(s)`
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Manifestations */}
                  {filteredManifestations.map((manifestation) => (
                    <Card key={manifestation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <Checkbox
                              checked={selectedManifestations.includes(manifestation.id)}
                              onCheckedChange={() => handleSelectManifestation(manifestation.id)}
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {manifestation.intitule}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                    <div className="flex items-center">
                                      <Tag className="w-4 h-4 mr-1" />
                                      {manifestation.type}
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      {new Date(manifestation.dateDebut).toLocaleDateString('fr-FR')} - {new Date(manifestation.dateFin).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
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

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="flex items-center mb-2">
                                    <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">Organisateur:</span>
                                    <span className="ml-2">{manifestation.organisateur}</span>
                                  </div>
                                  <div className="flex items-center mb-2">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">Lieu:</span>
                                    <span className="ml-2">{manifestation.lieu}</span>
                                  </div>
                                  {manifestation.lien && (
                                    <div className="flex items-center">
                                      <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />
                                      <a 
                                        href={manifestation.lien} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
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
                                      <p className="text-gray-600 mt-1 line-clamp-3">{manifestation.resume}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
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
