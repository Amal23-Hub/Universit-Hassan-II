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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Eye, Edit, Trash2, Calendar, MapPin, Building2, CheckCircle, Clock, XCircle } from "lucide-react"

export default function ManifestationsScientifiques() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatut, setFilterStatut] = useState("")
  const [filterPays, setFilterPays] = useState("")

  // Données de test
  const manifestations = [
    {
      id: "1",
      intitule: "Colloque International sur l'Intelligence Artificielle",
      type: "Colloque",
      dateDebut: "2024-06-15",
      dateFin: "2024-06-17",
      lieu: "Faculté des Sciences Ben M'Sik",
      pays: "Maroc",
      ville: "Casablanca",
      organisateur: "UH2C",
      statut: "Programmée",
      indexation: "En cours"
    },
    {
      id: "2",
      intitule: "Séminaire sur les Technologies Émergentes",
      type: "Séminaire",
      dateDebut: "2024-07-20",
      dateFin: "2024-07-21",
      lieu: "Centre de Conférences",
      pays: "France",
      ville: "Paris",
      organisateur: "Autre",
      statut: "En cours",
      indexation: "Indexée"
    },
    {
      id: "3",
      intitule: "Workshop Cybersécurité",
      type: "Workshop",
      dateDebut: "2024-08-10",
      dateFin: "2024-08-12",
      lieu: "Faculté des Sciences et Techniques",
      pays: "Maroc",
      ville: "Casablanca",
      organisateur: "UH2C",
      statut: "Terminée",
      indexation: "Indexée"
    }
  ]

  const typesManifestation = ["Colloque", "Conférence", "Séminaire", "Workshop", "Journée d'étude", "Congrès"]
  const statuts = ["Programmée", "En cours", "Terminée"]
  const pays = ["Maroc", "France", "Allemagne", "Espagne", "Canada", "États-Unis"]

  const filteredManifestations = manifestations.filter(manifestation => {
    const matchesSearch = manifestation.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifestation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         manifestation.ville.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !filterType || filterType === "all" || manifestation.type === filterType
    const matchesStatut = !filterStatut || filterStatut === "all" || manifestation.statut === filterStatut
    const matchesPays = !filterPays || filterPays === "all" || manifestation.pays === filterPays
    
    return matchesSearch && matchesType && matchesStatut && matchesPays
  })

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "Programmée":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Calendar className="w-3 h-3 mr-1" />{statut}</Badge>
      case "En cours":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />{statut}</Badge>
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
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />{indexation}</Badge>
      case "Non indexée":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />{indexation}</Badge>
      default:
        return <Badge variant="outline">{indexation}</Badge>
    }
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Manifestations Scientifiques</h1>
              <p className="text-gray-600">Gérez vos manifestations scientifiques et événements de recherche</p>
            </div>

            {/* Filtres */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-4 w-4" />
                  Filtres de recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="search" className="text-sm font-medium">Recherche</Label>
                    <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                        id="search"
                    placeholder="Rechercher une manifestation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                    </div>
                </div>
                
                  <div>
                    <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="mt-1">
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
                    <Label htmlFor="statut" className="text-sm font-medium">Statut</Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                            <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {statuts.map(statut => (
                          <SelectItem key={statut} value={statut}>{statut}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                    <Label htmlFor="pays" className="text-sm font-medium">Pays</Label>
                    <Select value={filterPays} onValueChange={setFilterPays}>
                            <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Tous les pays" />
                            </SelectTrigger>
                            <SelectContent>
                        <SelectItem value="all">Tous les pays</SelectItem>
                              {pays.map(paysItem => (
                                <SelectItem key={paysItem} value={paysItem}>{paysItem}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        </div>

              </CardContent>
            </Card>

            {/* Résultats */}
            <Card>
              <CardHeader>
                <CardTitle>Résultats de la recherche</CardTitle>
              </CardHeader>
              <CardContent>
              {filteredManifestations.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune manifestation trouvée</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterType || filterStatut || filterPays
                        ? "Aucune manifestation ne correspond à vos critères de recherche."
                        : "Aucune manifestation disponible."
                      }
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Intitulé</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Organisateur</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Indexation</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                  {filteredManifestations.map((manifestation) => (
                        <TableRow key={manifestation.id}>
                          <TableCell className="font-medium">
                                    {manifestation.intitule}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{manifestation.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                                      {new Date(manifestation.dateDebut).toLocaleDateString('fr-FR')} - {new Date(manifestation.dateFin).toLocaleDateString('fr-FR')}
                                    </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                                      {manifestation.ville}, {manifestation.pays}
                                    </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              {manifestation.organisateur}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatutBadge(manifestation.statut)}
                          </TableCell>
                          <TableCell>
                            {getIndexationBadge(manifestation.indexation)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                      </CardContent>
                    </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
