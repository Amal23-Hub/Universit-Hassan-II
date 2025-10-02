"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, FileText, User, Calendar } from "lucide-react"

interface ProjetValidation {
  id: string
  titre: string
  coordonnateur: string
  etablissement: string
  programme: string
  budgetDemande: number
  dateSoumission: string
  statut: "En attente" | "En cours d'évaluation" | "Approuvé" | "Rejeté"
  priorite: "Haute" | "Moyenne" | "Basse"
  expertAssigne: string
  commentaires: string
  documents: string[]
}

export default function ValidationProjets() {
  const [projets, setProjets] = useState<ProjetValidation[]>([
    {
      id: "1",
      titre: "Développement d'algorithmes d'IA pour l'éducation",
      coordonnateur: "Dr. Ahmed Benali",
      etablissement: "Université Hassan II",
      programme: "Programme National de Recherche en IA",
      budgetDemande: 500000,
      dateSoumission: "2024-01-15",
      statut: "En cours d'évaluation",
      priorite: "Haute",
      expertAssigne: "Dr. Expert IA",
      commentaires: "Projet innovant avec un bon potentiel",
      documents: ["projet_ia_education.pdf", "budget_detaille.xlsx"]
    },
    {
      id: "2",
      titre: "Protection des infrastructures critiques",
      coordonnateur: "Dr. Fatima Zahra",
      etablissement: "ENSA Casablanca",
      programme: "Programme de Recherche en Cybersécurité",
      budgetDemande: 1200000,
      dateSoumission: "2024-01-20",
      statut: "En attente",
      priorite: "Haute",
      expertAssigne: "Dr. Expert Cybersécurité",
      commentaires: "",
      documents: ["projet_cybersecurite.pdf"]
    },
    {
      id: "3",
      titre: "IA pour diagnostic médical",
      coordonnateur: "Dr. Sara El Harti",
      etablissement: "CHU Hassan II",
      programme: "Programme de Recherche en Santé Numérique",
      budgetDemande: 850000,
      dateSoumission: "2024-01-25",
      statut: "Approuvé",
      priorite: "Moyenne",
      expertAssigne: "Dr. Expert Santé",
      commentaires: "Projet approuvé avec modifications mineures",
      documents: ["projet_sante_ia.pdf", "protocole_etude.pdf"]
    },
    {
      id: "4",
      titre: "Optimisation des panneaux solaires",
      coordonnateur: "Dr. Mohamed Lahby",
      etablissement: "Université Mohammed V",
      programme: "Programme de Recherche en Énergies Renouvelables",
      budgetDemande: 600000,
      dateSoumission: "2024-01-30",
      statut: "Rejeté",
      priorite: "Basse",
      expertAssigne: "Dr. Expert Énergie",
      commentaires: "Budget trop élevé pour les objectifs proposés",
      documents: ["projet_energie_solaire.pdf"]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [filterProgramme, setFilterProgramme] = useState<string>("all")
  const [filterPriorite, setFilterPriorite] = useState<string>("all")

  const filteredProjets = projets.filter((projet) => {
    const matchesSearch = projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.coordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatut = filterStatut === "all" || projet.statut === filterStatut
    const matchesProgramme = filterProgramme === "all" || projet.programme === filterProgramme
    const matchesPriorite = filterPriorite === "all" || projet.priorite === filterPriorite
    return matchesSearch && matchesStatut && matchesProgramme && matchesPriorite
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Approuvé":
        return "bg-green-100 text-green-800"
      case "Rejeté":
        return "bg-red-100 text-red-800"
      case "En cours d'évaluation":
        return "bg-blue-100 text-blue-800"
      case "En attente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case "Haute":
        return "bg-red-100 text-red-800"
      case "Moyenne":
        return "bg-yellow-100 text-yellow-800"
      case "Basse":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "Approuvé":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Rejeté":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "En cours d'évaluation":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "En attente":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const handleValidation = (projetId: string, action: "approve" | "reject") => {
    setProjets(projets.map(projet => 
      projet.id === projetId 
        ? { ...projet, statut: action === "approve" ? "Approuvé" : "Rejeté" }
        : projet
    ))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Validation des Projets</h1>
              <p className="text-gray-600 mt-2">Évaluez et validez les projets de recherche soumis</p>
            </div>

            {/* Filtres */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-end md:space-x-6 gap-4 md:gap-0">
                  <div className="flex-1">
                    <Label>Recherche</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher par titre, coordonnateur ou établissement..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label>Statut</Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="En cours d'évaluation">En cours d'évaluation</SelectItem>
                        <SelectItem value="Approuvé">Approuvé</SelectItem>
                        <SelectItem value="Rejeté">Rejeté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Programme</Label>
                    <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les programmes</SelectItem>
                        <SelectItem value="Programme National de Recherche en IA">IA</SelectItem>
                        <SelectItem value="Programme de Recherche en Cybersécurité">Cybersécurité</SelectItem>
                        <SelectItem value="Programme de Recherche en Santé Numérique">Santé Numérique</SelectItem>
                        <SelectItem value="Programme de Recherche en Énergies Renouvelables">Énergies Renouvelables</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Priorité</Label>
                    <Select value={filterPriorite} onValueChange={setFilterPriorite}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les priorités</SelectItem>
                        <SelectItem value="Haute">Haute</SelectItem>
                        <SelectItem value="Moyenne">Moyenne</SelectItem>
                        <SelectItem value="Basse">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des projets */}
            <div className="space-y-4">
              {filteredProjets.map((projet) => (
                <Card key={projet.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {getStatutIcon(projet.statut)}
                          <h3 className="text-lg font-semibold text-gray-900">{projet.titre}</h3>
                          <Badge className={getStatutColor(projet.statut)}>
                            {projet.statut}
                          </Badge>
                          <Badge className={getPrioriteColor(projet.priorite)}>
                            {projet.priorite}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">{projet.coordonnateur}</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">{projet.programme}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">
                              {new Date(projet.dateSoumission).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(projet.budgetDemande)}
                            </span>
                          </div>
                        </div>
                        
                        {projet.commentaires && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Commentaires:</span> {projet.commentaires}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Expert assigné:</span>
                            <span className="text-sm font-medium">{projet.expertAssigne}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Voir détails
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Détails du projet</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Titre</Label>
                                    <p className="text-sm text-gray-700">{projet.titre}</p>
                                  </div>
                                  <div>
                                    <Label>Coordonnateur</Label>
                                    <p className="text-sm text-gray-700">{projet.coordonnateur}</p>
                                  </div>
                                  <div>
                                    <Label>Établissement</Label>
                                    <p className="text-sm text-gray-700">{projet.etablissement}</p>
                                  </div>
                                  <div>
                                    <Label>Budget demandé</Label>
                                    <p className="text-sm text-gray-700">{formatCurrency(projet.budgetDemande)}</p>
                                  </div>
                                  <div>
                                    <Label>Documents</Label>
                                    <div className="space-y-1">
                                      {projet.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                          <FileText className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                                            {doc}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {projet.statut === "En cours d'évaluation" && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleValidation(projet.id, "approve")}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleValidation(projet.id, "reject")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Rejeter
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 