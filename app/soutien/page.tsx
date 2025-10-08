"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { 
  Heart, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  Shield, 
  FileSignature, 
  Gift,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  FileText
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SoutienPage() {
  const [activeTab, setActiveTab] = useState("manifestation")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

   // Fonction pour gérer le changement de filtre par type
   const handleTypeFilterChange = (value: string) => {
     setTypeFilter(value)
   }
  const [isConferenceFormOpen, setIsConferenceFormOpen] = useState(false)
  const [isPublicationFormOpen, setIsPublicationFormOpen] = useState(false)
  const [isOuvrageFormOpen, setIsOuvrageFormOpen] = useState(false)
  const [isBrevetFormOpen, setIsBrevetFormOpen] = useState(false)
  const [isManifestationSupportOpen, setIsManifestationSupportOpen] = useState(false)
  
  // État pour le formulaire de soutien à la conférence
  const [conferenceForm, setConferenceForm] = useState({
    typeDemande: "labo",
    labo: "",
    universite: "",
    discipline: "",
    natureManifestation: "Congrès",
    naturePriseEnCharge: "Billet d'avion",
    montantEstime: "",
    intituleManifestation: "",
    lieuManifestation: "",
    dateManifestation: ""
  })

  // État pour le formulaire de publication (identique à celui des publications)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubCategory, setSelectedSubCategory] = useState("")
  const [publicationForm, setPublicationForm] = useState({
    title: "",
    authors: "",
    year: new Date().getFullYear(),
    journal: "",
    issn: "",
    base: "",
    lien: "",
    justificatif: null as File | null
  })

  // État pour le formulaire d'ouvrage (identique à celui des publications)
  const [ouvrageForm, setOuvrageForm] = useState({
    intitule: "",
    maisonEdition: "",
    annee: new Date().getFullYear().toString(),
    issn: "",
    isbn: "",
    lien: "",
    justificatif: null as File | null
  })
  const [ouvrageErrors, setOuvrageErrors] = useState({
    intitule: false,
    maisonEdition: false,
    annee: false
  })
  const [yearError, setYearError] = useState("")
  const [ouvrageLienJustificatifError, setOuvrageLienJustificatifError] = useState("")

  // État pour le formulaire de brevet (identique à celui des publications)
  const [brevetForm, setBrevetForm] = useState({
    intitule: "",
    type: "",
    champApplication: "",
    numeroDepot: "",
    dateDepot: "",
    numeroEnregistrement: "",
    partenaires: "",
    lien: "",
    justificatif: null as File | null
  })
  const [brevetErrors, setBrevetErrors] = useState({
    intitule: false,
    type: false,
    champApplication: false,
    numeroDepot: false,
    dateDepot: false
  })
  const [brevetLienJustificatifError, setBrevetLienJustificatifError] = useState("")

  // Données d'exemple pour les différents types de soutien
  const soutienData = {
    manifestation: [
      {
        id: 1,
        titre: "Soutien manifestation mathématiques",
        type: "Manifestation",
        statut: "En attente",
        date: "2024-01-15",
         montant: "5000 MAD",
         ville: "casablanca",
         pays: "maroc"
      }
    ],
    conference: [
      {
        id: 2,
        titre: "Conférence internationale IA 2024",
        type: "Conférence",
        statut: "Approuvé",
        date: "2024-02-20",
         montant: "8000 MAD",
         ville: "paris",
         pays: "france"
      }
    ],
    publication: [
      {
        id: 3,
        titre: "Publication article scientifique",
        type: "Publication",
        statut: "En cours",
        date: "2024-01-10",
         montant: "3000 MAD",
         ville: "rabat",
         pays: "maroc"
      }
    ],
    ouvrage: [
      {
        id: 4,
        titre: "Ouvrage de recherche",
        type: "Ouvrage",
        statut: "Rejeté",
        date: "2024-01-05",
         montant: "10000 MAD",
         ville: "berlin",
         pays: "allemagne"
      }
    ],
    brevet: [
      {
        id: 5,
        titre: "Enregistrement brevet innovation",
        type: "Brevet",
        statut: "Approuvé",
        date: "2024-01-20",
         montant: "15000 MAD",
         ville: "montreal",
         pays: "canada"
      }
    ],
    prime: [
      {
        id: 6,
        titre: "Prime de publication Q1",
        type: "Prime",
        statut: "En attente",
        date: "2024-02-01",
         montant: "2000 MAD",
         ville: "marrakech",
         pays: "maroc"
      }
    ]
  }

  // Fonction de filtrage des données
  const getFilteredData = (data: any[], currentType: string) => {
    return data.filter(item => {
      const matchesSearch = item.titre.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.statut === statusFilter
      const matchesType = typeFilter === "all" || currentType === typeFilter
      const matchesCity = cityFilter === "all" || item.ville === cityFilter
      const matchesCountry = countryFilter === "all" || item.pays === countryFilter
      return matchesSearch && matchesStatus && matchesType && matchesCity && matchesCountry
    })
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "Approuvé":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />{statut}</Badge>
      case "Rejeté":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{statut}</Badge>
      case "En attente":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />{statut}</Badge>
      case "En cours":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{statut}</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const soutienTypes = [
    {
      id: "manifestation",
      title: "Soutien à la manifestation",
      description: "Demande de soutien pour organiser des manifestations scientifiques",
      icon: Calendar,
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "conference",
      title: "Soutien à la mobilité",
      description: "Demande de soutien pour participer à des conférences",
      icon: MessageSquare,
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      id: "publication",
      title: "Soutien à la publication",
      description: "Demande de soutien pour publier des articles scientifiques",
      icon: BookOpen,
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      id: "ouvrage",
      title: "Soutien à l'édition d'ouvrage",
      description: "Demande de soutien pour publier des ouvrages de recherche",
      icon: Shield,
      color: "bg-orange-50 text-orange-700 border-orange-200"
    },
    {
      id: "brevet",
      title: "Soutien au dépôt du brevet",
      description: "Demande de soutien pour le dépôt de brevets",
      icon: FileSignature,
      color: "bg-red-50 text-red-700 border-red-200"
    },
    {
      id: "prime",
      title: "Prime de publication",
      description: "Demande de prime pour publications dans des revues indexées",
      icon: Gift,
      color: "bg-yellow-50 text-yellow-700 border-yellow-200"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Gestion des Demandes de Soutien</h1>
                  <p className="text-xs text-gray-600 mt-1">Gérez vos demandes de soutien pour vos activités de recherche</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle demande
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <div className="text-center">
                        <div className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-lg p-4 mb-4 shadow-sm">
                          <DialogTitle className="text-uh2c-blue font-bold text-lg mb-2">Demande de Soutien</DialogTitle>
                          <p className="text-gray-700 text-sm">Veuillez sélectionner le type de soutien que vous souhaitez demander :</p>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        variant="outline"
                        className="h-12 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setIsManifestationSupportOpen(true)
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-gray-900">Soutien à la manifestation</span>
                          <span className="text-sm text-gray-500">Organiser des manifestations scientifiques</span>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-12 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setIsConferenceFormOpen(true)
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-gray-900">Soutien à la mobilité</span>
                          <span className="text-sm text-gray-500">Participer à des conférences</span>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-12 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setIsPublicationFormOpen(true)
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-gray-900">Soutien à la publication</span>
                          <span className="text-sm text-gray-500">Publier des articles scientifiques</span>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-12 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setIsOuvrageFormOpen(true)
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-gray-900">Soutien à l'édition d'ouvrage</span>
                          <span className="text-sm text-gray-500">Publier des ouvrages de recherche</span>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-12 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setIsBrevetFormOpen(true)
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-gray-900">Soutien au dépôt du brevet</span>
                          <span className="text-sm text-gray-500">Garder le même formulaire d'ajout d'un brevet dans le module production scientifique</span>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-12 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => {
                          setActiveTab("prime")
                          setIsDialogOpen(false)
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-gray-900">Prime de publication</span>
                          <span className="text-sm text-gray-500">Prime pour publications indexées</span>
                        </div>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Formulaire de soutien à la conférence */}
                <Dialog open={isConferenceFormOpen} onOpenChange={setIsConferenceFormOpen}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                              <MessageSquare className="h-3 w-3 text-uh2c-blue" />
                            </div>
                            <div>
                              <DialogTitle className="text-sm font-bold text-uh2c-blue">
                                DEMANDE DE SOUTIEN À LA CONFÉRENCE
                              </DialogTitle>
                               <p className="text-xs text-gray-600 mt-0.5">Remplissez tous les champs obligatoires pour votre demande de soutien à la conférence</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setIsConferenceFormOpen(false)
                              setIsDialogOpen(true)
                            }}
                          >
                            ← Retour
                          </Button>
                        </div>
                      </div>
                    </DialogHeader>
                    
                    <form className="border rounded-lg p-6 mt-4 space-y-6">
                      {/* Type de demande */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Type demande de soutien à la conférence <span className="text-red-600">*</span>
                        </Label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="typeDemande"
                              value="labo"
                              checked={conferenceForm.typeDemande === "labo"}
                              onChange={(e) => setConferenceForm({...conferenceForm, typeDemande: e.target.value})}
                              className="text-blue-600"
                            />
                            <span className="text-sm">Laboratoire</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="typeDemande"
                              value="universite"
                              checked={conferenceForm.typeDemande === "universite"}
                              onChange={(e) => setConferenceForm({...conferenceForm, typeDemande: e.target.value})}
                              className="text-blue-600"
                            />
                            <span className="text-sm">Université</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="typeDemande"
                              value="fonds-propre"
                              checked={conferenceForm.typeDemande === "fonds-propre"}
                              onChange={(e) => setConferenceForm({...conferenceForm, typeDemande: e.target.value})}
                              className="text-blue-600"
                            />
                            <span className="text-sm">Fonds propre (projet financé)</span>
                          </label>
                        </div>
                      </div>

                      {/* Discipline */}
                      <div>
                        <Label htmlFor="discipline" className="text-sm font-medium text-gray-700">
                          Discipline <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="discipline"
                          required
                          value={conferenceForm.discipline}
                          onChange={(e) => setConferenceForm({...conferenceForm, discipline: e.target.value})}
                          placeholder="Ex: Mathématiques, Informatique, Physique..."
                          className="h-11 rounded-lg text-base mt-1"
                        />
                      </div>

                      {/* Nature de la manifestation */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Nature de la manifestation <span className="text-red-600">*</span>
                        </Label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {["Congrès", "Conférence", "Séminaire", "Colloque", "Workshop", "Stage"].map((nature) => (
                            <label key={nature} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="natureManifestation"
                                value={nature}
                                checked={conferenceForm.natureManifestation === nature}
                                onChange={(e) => setConferenceForm({...conferenceForm, natureManifestation: e.target.value})}
                                className="text-blue-600"
                              />
                              <span className="text-sm">{nature}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Nature de prise en charge */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Nature de prise en charge <span className="text-red-600">*</span>
                        </Label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="naturePriseEnCharge"
                              value="Frais de séjour"
                              checked={conferenceForm.naturePriseEnCharge === "Frais de séjour"}
                              onChange={(e) => setConferenceForm({...conferenceForm, naturePriseEnCharge: e.target.value})}
                              className="text-blue-600"
                            />
                            <span className="text-sm">Frais de séjour (Pour enseignant chercheur uniquement)</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="naturePriseEnCharge"
                              value="Billet d'avion"
                              checked={conferenceForm.naturePriseEnCharge === "Billet d'avion"}
                              onChange={(e) => setConferenceForm({...conferenceForm, naturePriseEnCharge: e.target.value})}
                              className="text-blue-600"
                            />
                            <span className="text-sm">Billet d'avion</span>
                          </label>
                        </div>
                      </div>

                      {/* Montant estimé */}
                      <div>
                        <Label htmlFor="montantEstime" className="text-sm font-medium text-gray-700">
                          Montant estimé <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="montantEstime"
                          type="number"
                          required
                          value={conferenceForm.montantEstime}
                          onChange={(e) => setConferenceForm({...conferenceForm, montantEstime: e.target.value})}
                          placeholder="Montant en MAD"
                          className="h-11 rounded-lg text-base mt-1"
                        />
                      </div>

                      {/* Intitulé de la manifestation */}
                      <div>
                        <Label htmlFor="intituleManifestation" className="text-sm font-medium text-gray-700">
                          Intitulé de la manifestation <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="intituleManifestation"
                          required
                          value={conferenceForm.intituleManifestation}
                          onChange={(e) => setConferenceForm({...conferenceForm, intituleManifestation: e.target.value})}
                          placeholder="Nom de la conférence"
                          className="h-11 rounded-lg text-base mt-1"
                        />
                      </div>

                      {/* Lieu de la manifestation */}
                      <div>
                        <Label htmlFor="lieuManifestation" className="text-sm font-medium text-gray-700">
                          Lieu de la manifestation (Pays-ville) <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="lieuManifestation"
                          required
                          value={conferenceForm.lieuManifestation}
                          onChange={(e) => setConferenceForm({...conferenceForm, lieuManifestation: e.target.value})}
                          placeholder="Ex: France-Paris, Allemagne-Berlin..."
                          className="h-11 rounded-lg text-base mt-1"
                        />
                      </div>

                      {/* Date de déroulement */}
                      <div>
                        <Label htmlFor="dateManifestation" className="text-sm font-medium text-gray-700">
                          Date de déroulement de la manifestation <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="dateManifestation"
                          type="date"
                          required
                          value={conferenceForm.dateManifestation}
                          onChange={(e) => setConferenceForm({...conferenceForm, dateManifestation: e.target.value})}
                          className="h-11 rounded-lg text-base mt-1"
                        />
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsConferenceFormOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit" className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                          Envoyer la demande
                        </Button>
                      </div>
                    </form>

                    {/* Indication importante */}
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-600 text-xs font-bold">i</span>
                        </div>
                        <p className="text-gray-600 text-xs">
                          Vous avez le droit de faire une demande de soutien à la conférence une seule fois par an.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Formulaire de soutien à la publication */}
                <Dialog open={isPublicationFormOpen} onOpenChange={setIsPublicationFormOpen}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                              <BookOpen className="h-3 w-3 text-uh2c-blue" />
                            </div>
                            <div>
                              <DialogTitle className="text-sm font-bold text-uh2c-blue">
                                SOUTIEN À LA PUBLICATION D'UN ARTICLE
                              </DialogTitle>
                              <p className="text-xs text-gray-600 mt-0.5">Remplissez tous les champs obligatoires pour votre demande de soutien à la publication</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setIsPublicationFormOpen(false)
                              setIsDialogOpen(true)
                            }}
                          >
                            ← Retour
                          </Button>
                        </div>
                      </div>
                    </DialogHeader>

                    <form className="border rounded-lg p-6 mt-4 space-y-6">
                          {/* Titre */}
                          <div>
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                          Titre de la publication <span className="text-red-600">*</span>
                        </Label>
                            <Input
                              id="title"
                          required
                              value={publicationForm.title}
                              onChange={(e) => setPublicationForm({...publicationForm, title: e.target.value})}
                              placeholder="Titre de l'article ou de la publication"
                          className="h-11 rounded-lg text-base mt-1"
                            />
                          </div>

                          {/* Auteurs */}
                          <div>
                        <Label htmlFor="authors" className="text-sm font-medium text-gray-700">
                          Auteurs <span className="text-red-600">*</span>
                        </Label>
                            <Input
                              id="authors"
                          required
                              value={publicationForm.authors}
                              onChange={(e) => setPublicationForm({...publicationForm, authors: e.target.value})}
                              placeholder="Noms des auteurs séparés par des virgules"
                          className="h-11 rounded-lg text-base mt-1"
                            />
                          </div>

                          {/* Année */}
                          <div>
                        <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                          Année de publication <span className="text-red-600">*</span>
                        </Label>
                            <Input
                              id="year"
                              type="number"
                          required
                              value={publicationForm.year}
                              onChange={(e) => setPublicationForm({...publicationForm, year: parseInt(e.target.value)})}
                          className="h-11 rounded-lg text-base mt-1"
                              min="1900"
                              max={new Date().getFullYear()}
                            />
                          </div>

                              {/* Journal */}
                              <div>
                        <Label htmlFor="journal" className="text-sm font-medium text-gray-700">
                          Nom de la revue <span className="text-red-600">*</span>
                        </Label>
                                <Input
                                  id="journal"
                          required
                                  value={publicationForm.journal}
                                  onChange={(e) => setPublicationForm({...publicationForm, journal: e.target.value})}
                                  placeholder="Nom de la revue scientifique"
                          className="h-11 rounded-lg text-base mt-1"
                                />
                              </div>

                              {/* ISSN */}
                              <div>
                                <Label htmlFor="issn" className="text-sm font-medium text-gray-700">ISSN</Label>
                                <Input
                                  id="issn"
                                  value={publicationForm.issn}
                                  onChange={(e) => setPublicationForm({...publicationForm, issn: e.target.value})}
                                  placeholder="ISSN de la revue"
                          className="h-11 rounded-lg text-base mt-1"
                                />
                              </div>

                              {/* Base d'indexation */}
                              <div>
                                <Label htmlFor="base" className="text-sm font-medium text-gray-700">Base d'indexation</Label>
                                <Select value={publicationForm.base} onValueChange={(value) => setPublicationForm({...publicationForm, base: value})}>
                          <SelectTrigger className="h-11 rounded-lg text-base mt-1">
                                    <SelectValue placeholder="Sélectionner la base d'indexation" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Scopus">Scopus</SelectItem>
                                    <SelectItem value="WOS">Web of Science</SelectItem>
                                    <SelectItem value="Autre">Autre</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                          {/* Lien */}
                          <div>
                        <Label htmlFor="lien" className="text-sm font-medium text-gray-700">
                          Lien vers la publication <span className="text-red-600">*</span>
                        </Label>
                            <Input
                              id="lien"
                          required
                              value={publicationForm.lien}
                              onChange={(e) => setPublicationForm({...publicationForm, lien: e.target.value})}
                              placeholder="URL de la publication (DOI, lien vers la revue, etc.)"
                          className="h-11 rounded-lg text-base mt-1"
                            />
                          </div>

                          {/* Justificatif */}
                          <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Justificatif <span className="text-red-600">*</span>
                          <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                        </Label>
                        
                        {!publicationForm.justificatif ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer mt-1">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => setPublicationForm({...publicationForm, justificatif: e.target.files?.[0] || null})}
                              className="hidden"
                              id="justif-publication"
                            />
                            <label htmlFor="justif-publication" className="cursor-pointer">
                              <div className="space-y-3">
                                <div className="mx-auto w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">
                                    Cliquez pour télécharger ou glissez-déposez
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    PDF, DOC, DOCX jusqu'à 10MB
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 mt-1">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span className="flex-1 text-sm text-gray-700 truncate">
                              {publicationForm.justificatif.name}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPublicationForm({ ...publicationForm, justificatif: null })
                                const fileInput = document.getElementById('justif-publication') as HTMLInputElement
                                if (fileInput) fileInput.value = ''
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                            )}
                          </div>

                          {/* Boutons d'action */}
                          <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setIsPublicationFormOpen(false)}>
                              Annuler
                            </Button>
                            <Button type="submit" className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                              Envoyer la demande
                            </Button>
                          </div>
                        </form>

                    {/* Indication importante */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-lg p-4 mt-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 text-sm font-bold">ℹ</span>
                      </div>
                        <div>
                          <h4 className="text-sm font-semibold text-amber-900 mb-1">Information importante</h4>
                          <p className="text-amber-800 text-sm leading-relaxed">
                            Vous avez le droit de faire une demande de soutien à la publication <span className="font-semibold">une seule fois par an</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Formulaire de soutien à l'ouvrage de recherche */}
                <Dialog open={isOuvrageFormOpen} onOpenChange={setIsOuvrageFormOpen}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                              <BookOpen className="h-3 w-3 text-uh2c-blue" />
                            </div>
                            <div>
                              <DialogTitle className="text-sm font-bold text-uh2c-blue">
                                SOUTIEN À L'OUVRAGE DE RECHERCHE
                              </DialogTitle>
                              <p className="text-xs text-gray-600 mt-0.5">Remplissez tous les champs obligatoires pour votre demande de soutien à l'ouvrage</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setIsOuvrageFormOpen(false)
                              setIsDialogOpen(true)
                            }}
                          >
                            ← Retour
                          </Button>
                        </div>
                      </div>
                    </DialogHeader>

                    <form className="border rounded-lg p-6 mt-4 space-y-6">
                      {/* Intitulé */}
                      <div>
                        <Label htmlFor="intitule-ouvrage" className={`text-sm font-medium ${ouvrageErrors.intitule ? 'text-red-600' : 'text-gray-700'}`}>
                          Intitulé <span className="text-red-600">*</span>
                        </Label>
                        <Input 
                          id="intitule-ouvrage" 
                          required 
                          placeholder="Intitulé de l'ouvrage" 
                          className={`h-11 rounded-lg text-base mt-1 ${ouvrageErrors.intitule ? 'border-red-500' : ''}`}
                          value={ouvrageForm.intitule}
                          onChange={(e) => {
                            setOuvrageForm({ ...ouvrageForm, intitule: e.target.value })
                            if (e.target.value) setOuvrageErrors(err => ({ ...err, intitule: false }))
                          }}
                        />
                        {ouvrageErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>

                      {/* Maison d'édition */}
                      <div>
                        <Label htmlFor="maison-edition-ouvrage" className={`text-sm font-medium ${ouvrageErrors.maisonEdition ? 'text-red-600' : 'text-gray-700'}`}>
                          Maison d'édition <span className="text-red-600">*</span>
                        </Label>
                        <Input 
                          id="maison-edition-ouvrage" 
                          required 
                          placeholder="Maison d'édition" 
                          className={`h-11 rounded-lg text-base mt-1 ${ouvrageErrors.maisonEdition ? 'border-red-500' : ''}`}
                          value={ouvrageForm.maisonEdition}
                          onChange={(e) => {
                            setOuvrageForm({ ...ouvrageForm, maisonEdition: e.target.value })
                            if (e.target.value) setOuvrageErrors(err => ({ ...err, maisonEdition: false }))
                          }}
                        />
                        {ouvrageErrors.maisonEdition && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>

                      {/* Année */}
                      <div>
                        <Label htmlFor="annee-ouvrage" className={`text-sm font-medium ${ouvrageErrors.annee ? 'text-red-600' : 'text-gray-700'}`}>
                          Date <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="annee-ouvrage"
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          placeholder={new Date().getFullYear().toString()}
                          className={`h-11 rounded-lg text-base mt-1 ${yearError || ouvrageErrors.annee ? 'border-red-500' : ''}`}
                          value={ouvrageForm.annee}
                          onChange={(e) => {
                            setOuvrageForm({ ...ouvrageForm, annee: e.target.value })
                            if (e.target.value) setOuvrageErrors(err => ({ ...err, annee: false }))
                            const year = parseInt(e.target.value)
                            if (year > new Date().getFullYear()) {
                              setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                            } else {
                              setYearError("")
                            }
                          }}
                        />
                        {(ouvrageErrors.annee || yearError) && (
                          <p className="text-xs text-red-600 mt-1">{yearError || 'Ce champ est obligatoire'}</p>
                        )}
                      </div>

                      {/* ISSN */}
                      <div>
                        <Label htmlFor="issn-ouvrage" className="text-sm font-medium text-gray-700">ISSN</Label>
                        <Input 
                          id="issn-ouvrage" 
                          placeholder="ISSN" 
                          className="h-11 rounded-lg text-base mt-1"
                          value={ouvrageForm.issn}
                          onChange={(e) => setOuvrageForm({ ...ouvrageForm, issn: e.target.value })}
                        />
                      </div>

                      {/* ISBN */}
                      <div>
                        <Label htmlFor="isbn-ouvrage" className="text-sm font-medium text-gray-700">ISBN</Label>
                        <Input 
                          id="isbn-ouvrage" 
                          placeholder="ISBN" 
                          className="h-11 rounded-lg text-base mt-1"
                          value={ouvrageForm.isbn}
                          onChange={(e) => setOuvrageForm({ ...ouvrageForm, isbn: e.target.value })}
                        />
                      </div>

                      {/* Lien */}
                      <div>
                        <Label htmlFor="lien-ouvrage" className="text-sm font-medium text-gray-700">
                          Lien
                          <span className={`ml-1 ${!ouvrageForm.lien && !ouvrageForm.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                            {!ouvrageForm.lien && !ouvrageForm.justificatif ? '*' : (!ouvrageForm.lien ? '(optionnel)' : '')}
                          </span>
                        </Label>
                        <Input 
                          id="lien-ouvrage" 
                          placeholder="https://link.springer.com/book/10.1007/978-3-030-12345-6" 
                          className="h-11 rounded-lg text-base mt-1"
                          value={ouvrageForm.lien}
                          onChange={(e) => {
                            setOuvrageForm({ ...ouvrageForm, lien: e.target.value })
                            if (e.target.value || ouvrageForm.justificatif) {
                              setOuvrageLienJustificatifError("")
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                        </p>
                      </div>

                      {/* Justificatif */}
                      <div>
                        <Label htmlFor="justif-ouvrage" className="text-sm font-medium text-gray-700">
                          Justificatif 
                          <span className={`ml-1 ${!ouvrageForm.lien && !ouvrageForm.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                            {!ouvrageForm.lien && !ouvrageForm.justificatif ? '*' : (!ouvrageForm.justificatif ? '(optionnel)' : '')}
                          </span>
                          <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                        </Label>
                        
                        {!ouvrageForm.justificatif ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer mt-1">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null
                                setOuvrageForm({ ...ouvrageForm, justificatif: file })
                                if (file || ouvrageForm.lien) {
                                  setOuvrageLienJustificatifError("")
                                }
                              }}
                              className="hidden"
                              id="justif-ouvrage"
                            />
                            <label htmlFor="justif-ouvrage" className="cursor-pointer">
                              <div className="space-y-3">
                                <div className="mx-auto w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">
                                    Cliquez pour télécharger ou glissez-déposez
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    PDF, DOC, DOCX jusqu'à 10MB
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 mt-1">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span className="flex-1 text-sm text-gray-700 truncate">
                              {ouvrageForm.justificatif.name}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setOuvrageForm({ ...ouvrageForm, justificatif: null })
                                const fileInput = document.getElementById('justif-ouvrage') as HTMLInputElement
                                if (fileInput) fileInput.value = ''
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {ouvrageLienJustificatifError && (
                          <p className="text-xs text-red-600 mt-1">{ouvrageLienJustificatifError}</p>
                        )}
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsOuvrageFormOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit" className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                          Envoyer la demande
                        </Button>
                      </div>
                    </form>

                    {/* Indication importante */}
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-600 text-xs font-bold">i</span>
                        </div>
                        <p className="text-gray-600 text-xs">
                          Vous avez le droit de faire une demande de soutien à l'ouvrage une seule fois par an.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Formulaire de soutien à l'enregistrement au brevet */}
                <Dialog open={isBrevetFormOpen} onOpenChange={setIsBrevetFormOpen}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                              <FileSignature className="h-3 w-3 text-uh2c-blue" />
                            </div>
                            <div>
                              <DialogTitle className="text-sm font-bold text-uh2c-blue">
                                SOUTIEN À L'ENREGISTREMENT AU BREVET
                              </DialogTitle>
                              <p className="text-xs text-gray-600 mt-0.5">Remplissez tous les champs obligatoires pour votre demande de soutien au brevet</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setIsBrevetFormOpen(false)
                              setIsDialogOpen(true)
                            }}
                          >
                            ← Retour
                          </Button>
                        </div>
                      </div>
                    </DialogHeader>

                    <form className="border rounded-lg p-6 mt-4 space-y-6">
                      {/* Intitulé */}
                      <div>
                        <Label htmlFor="intitule-brevet" className={`text-sm font-medium ${brevetErrors.intitule ? 'text-red-600' : 'text-gray-700'}`}>
                          Intitulé <span className="text-red-600">*</span>
                        </Label>
                        <Input 
                          id="intitule-brevet" 
                          required 
                          placeholder="Intitulé du brevet" 
                          className={`h-11 rounded-lg text-base mt-1 ${brevetErrors.intitule ? 'border-red-500' : ''}`}
                          value={brevetForm.intitule}
                          onChange={(e) => {
                            setBrevetForm({ ...brevetForm, intitule: e.target.value })
                            if (e.target.value) setBrevetErrors(err => ({ ...err, intitule: false }))
                          }}
                        />
                        {brevetErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>

                      {/* Type */}
                      <div>
                        <Label htmlFor="type-brevet" className={`text-sm font-medium ${brevetErrors.type ? 'text-red-600' : 'text-gray-700'}`}>
                          Type <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={brevetForm.type}
                          onValueChange={(value) => {
                            setBrevetForm({ ...brevetForm, type: value })
                            if (value) setBrevetErrors(err => ({ ...err, type: false }))
                          }}
                        >
                          <SelectTrigger className={`h-11 rounded-lg text-base mt-1 ${brevetErrors.type ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Choisir un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Brevet d'invention">Brevet d'invention</SelectItem>
                            <SelectItem value="Modèle d'utilité">Modèle d'utilité</SelectItem>
                            <SelectItem value="Certificat d'utilité">Certificat d'utilité</SelectItem>
                            <SelectItem value="Dessin et modèle">Dessin et modèle</SelectItem>
                            <SelectItem value="Marque">Marque</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        {brevetErrors.type && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>

                      {/* Champ d'application */}
                      <div>
                        <Label htmlFor="champ-application-brevet" className={`text-sm font-medium ${brevetErrors.champApplication ? 'text-red-600' : 'text-gray-700'}`}>
                          Champ d'application <span className="text-red-600">*</span>
                        </Label>
                        <Input 
                          id="champ-application-brevet" 
                          required 
                          placeholder="Champ d'application" 
                          className={`h-11 rounded-lg text-base mt-1 ${brevetErrors.champApplication ? 'border-red-500' : ''}`}
                          value={brevetForm.champApplication}
                          onChange={(e) => {
                            setBrevetForm({ ...brevetForm, champApplication: e.target.value })
                            if (e.target.value) setBrevetErrors(err => ({ ...err, champApplication: false }))
                          }}
                        />
                        {brevetErrors.champApplication && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>

                      {/* Numéro de dépôt */}
                      <div>
                        <Label htmlFor="numero-depot-brevet" className={`text-sm font-medium ${brevetErrors.numeroDepot ? 'text-red-600' : 'text-gray-700'}`}>
                          Numéro de dépôt <span className="text-red-600">*</span>
                        </Label>
                        <Input 
                          id="numero-depot-brevet" 
                          required 
                          placeholder="Numéro de dépôt" 
                          className={`h-11 rounded-lg text-base mt-1 ${brevetErrors.numeroDepot ? 'border-red-500' : ''}`}
                          value={brevetForm.numeroDepot}
                          onChange={(e) => {
                            setBrevetForm({ ...brevetForm, numeroDepot: e.target.value })
                            if (e.target.value) setBrevetErrors(err => ({ ...err, numeroDepot: false }))
                          }}
                        />
                        {brevetErrors.numeroDepot && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>

                      {/* Date de dépôt */}
                      <div>
                        <Label htmlFor="date-depot-brevet" className={`text-sm font-medium ${brevetErrors.dateDepot ? 'text-red-600' : 'text-gray-700'}`}>
                          Date de dépôt <span className="text-red-600">*</span>
                        </Label>
                        <Input 
                          id="date-depot-brevet" 
                          type="date"
                          required 
                          className={`h-11 rounded-lg text-base mt-1 ${brevetErrors.dateDepot ? 'border-red-500' : ''}`}
                          value={brevetForm.dateDepot}
                          onChange={(e) => {
                            setBrevetForm({ ...brevetForm, dateDepot: e.target.value })
                            if (e.target.value) setBrevetErrors(err => ({ ...err, dateDepot: false }))
                          }}
                        />
                        {brevetErrors.dateDepot && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>

                      {/* Numéro d'enregistrement */}
                      <div>
                        <Label htmlFor="numero-enregistrement-brevet" className="text-sm font-medium text-gray-700">Numéro d'enregistrement</Label>
                        <Input 
                          id="numero-enregistrement-brevet" 
                          placeholder="Numéro d'enregistrement" 
                          className="h-11 rounded-lg text-base mt-1"
                          value={brevetForm.numeroEnregistrement}
                          onChange={(e) => setBrevetForm({ ...brevetForm, numeroEnregistrement: e.target.value })}
                        />
                      </div>

                      {/* Partenaires */}
                      <div>
                        <Label htmlFor="partenaires-brevet" className="text-sm font-medium text-gray-700">Partenaires</Label>
                        <Input 
                          id="partenaires-brevet" 
                          placeholder="Partenaires" 
                          className="h-11 rounded-lg text-base mt-1"
                          value={brevetForm.partenaires}
                          onChange={(e) => setBrevetForm({ ...brevetForm, partenaires: e.target.value })}
                        />
                      </div>

                      {/* Lien */}
                      <div>
                        <Label htmlFor="lien-brevet" className="text-sm font-medium text-gray-700">
                          Lien
                          <span className={`ml-1 ${!brevetForm.lien && !brevetForm.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                            {!brevetForm.lien && !brevetForm.justificatif ? '*' : (!brevetForm.lien ? '(optionnel)' : '')}
                          </span>
                        </Label>
                        <Input 
                          id="lien-brevet" 
                          placeholder="https://patents.google.com/patent/US12345678B2" 
                          className="h-11 rounded-lg text-base mt-1"
                          value={brevetForm.lien}
                          onChange={(e) => {
                            setBrevetForm({ ...brevetForm, lien: e.target.value })
                            if (e.target.value || brevetForm.justificatif) {
                              setBrevetLienJustificatifError("")
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                        </p>
                      </div>

                      {/* Justificatif */}
                      <div>
                        <Label htmlFor="justif-brevet" className="text-sm font-medium text-gray-700">
                          Justificatifs 
                          <span className={`ml-1 ${!brevetForm.lien && !brevetForm.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                            {!brevetForm.lien && !brevetForm.justificatif ? '*' : (!brevetForm.justificatif ? '(optionnel)' : '')}
                          </span>
                          <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                        </Label>
                        
                        {!brevetForm.justificatif ? (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer mt-1">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null
                                setBrevetForm({ ...brevetForm, justificatif: file })
                                if (file || brevetForm.lien) {
                                  setBrevetLienJustificatifError("")
                                }
                              }}
                              className="hidden"
                              id="justif-brevet"
                            />
                            <label htmlFor="justif-brevet" className="cursor-pointer">
                              <div className="space-y-3">
                                <div className="mx-auto w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <FileText className="h-8 w-8 text-gray-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">
                                    Cliquez pour télécharger ou glissez-déposez
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    PDF, DOC, DOCX jusqu'à 10MB
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 mt-1">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span className="flex-1 text-sm text-gray-700 truncate">
                              {brevetForm.justificatif.name}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setBrevetForm({ ...brevetForm, justificatif: null })
                                const fileInput = document.getElementById('justif-brevet') as HTMLInputElement
                                if (fileInput) fileInput.value = ''
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {brevetLienJustificatifError && (
                          <p className="text-xs text-red-600 mt-1">{brevetLienJustificatifError}</p>
                        )}
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsBrevetFormOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit" className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                          Envoyer la demande
                        </Button>
                      </div>
                    </form>

                    {/* Indication importante */}
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-yellow-600 text-xs font-bold">i</span>
                        </div>
                        <p className="text-gray-600 text-xs">
                          Vous avez le droit de faire une demande de soutien au brevet une seule fois par an.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Popup pour le soutien à la manifestation */}
                <Dialog open={isManifestationSupportOpen} onOpenChange={setIsManifestationSupportOpen}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <div className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-lg p-2 mb-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-uh2c-blue/20 rounded-full flex items-center justify-center">
                            <Calendar className="h-3 w-3 text-uh2c-blue" />
                          </div>
                          <div>
                            <DialogTitle className="text-uh2c-blue font-bold text-sm">Soutien à la Manifestation</DialogTitle>
                            <p className="text-xs text-gray-600 mt-0.5">Demande de soutien pour organiser des manifestations scientifiques</p>
                          </div>
                        </div>
                      </div>
                    </DialogHeader>
                    
                    <div className="space-y-3">
                      <div className="text-center py-2">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                          <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-gray-700 text-xs leading-relaxed">
                          Veuillez vous diriger vers les manifestations scientifiques de soutien afin d'effectuer votre demande de soutien à la Manifestation
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span>Redirection vers la section manifestations scientifiques</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between space-x-2 pt-1">
                        <div className="flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs px-2 py-1"
                            onClick={() => {
                              setIsManifestationSupportOpen(false)
                              setIsDialogOpen(true)
                            }}
                          >
                            ← Retour
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs px-2 py-1"
                            onClick={() => setIsManifestationSupportOpen(false)}
                          >
                            Annuler
                          </Button>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-xs px-2 py-1"
                          onClick={() => {
                            setIsManifestationSupportOpen(false)
                            // Redirection vers la page d'organisation de manifestation
                            window.location.href = '/manifestations-scientifiques/organisation-manifestation-member'
                          }}
                        >
                          Aller aux manifestations scientifiques
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Section Recherche et filtres */}
            <Card className="mb-4 bg-blue-50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 text-uh2c-blue" />
                  <CardTitle className="text-sm">Recherche et filtres</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Barre de recherche principale */}
                    <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                      <Input
                    placeholder="Rechercher une demande de soutien..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-6 h-7 text-xs"
                      />
                    </div>

                {/* Filtres par type et date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Filter className="h-3 w-3 text-gray-500" />
                      <Label className="text-xs font-medium">Type de soutien</Label>
                  </div>
                    <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="manifestation">Soutien à la manifestation</SelectItem>
                        <SelectItem value="conference">Soutien à la mobilité</SelectItem>
                        <SelectItem value="publication">Soutien à la publication</SelectItem>
                        <SelectItem value="ouvrage">Soutien à l'édition d'ouvrage</SelectItem>
                        <SelectItem value="brevet">Soutien au dépôt du brevet</SelectItem>
                        <SelectItem value="prime">Prime de publication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <Label className="text-xs font-medium">Date</Label>
                </div>
                    <Input
                      type="date"
                      className="h-7 text-xs"
                      onChange={(e) => {
                        // Vous pouvez ajouter la logique de filtrage par date ici
                        console.log('Date sélectionnée:', e.target.value)
                      }}
                    />
                  </div>
                </div>

                {/* Filtres par pays et ville */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Filter className="h-3 w-3 text-gray-500" />
                      <Label className="text-xs font-medium">Pays</Label>
                    </div>
                    <Select value={countryFilter} onValueChange={setCountryFilter}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Tous les pays" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les pays</SelectItem>
                        <SelectItem value="maroc">Maroc</SelectItem>
                        <SelectItem value="france">France</SelectItem>
                        <SelectItem value="allemagne">Allemagne</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="espagne">Espagne</SelectItem>
                        <SelectItem value="italie">Italie</SelectItem>
                        <SelectItem value="suisse">Suisse</SelectItem>
                        <SelectItem value="belgique">Belgique</SelectItem>
                        <SelectItem value="etats-unis">États-Unis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Filter className="h-3 w-3 text-gray-500" />
                      <Label className="text-xs font-medium">Ville</Label>
                    </div>
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Toutes les villes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les villes</SelectItem>
                        <SelectItem value="casablanca">Casablanca</SelectItem>
                        <SelectItem value="rabat">Rabat</SelectItem>
                        <SelectItem value="marrakech">Marrakech</SelectItem>
                        <SelectItem value="paris">Paris</SelectItem>
                        <SelectItem value="lyon">Lyon</SelectItem>
                        <SelectItem value="berlin">Berlin</SelectItem>
                        <SelectItem value="munich">Munich</SelectItem>
                        <SelectItem value="montreal">Montréal</SelectItem>
                        <SelectItem value="toronto">Toronto</SelectItem>
                        <SelectItem value="madrid">Madrid</SelectItem>
                        <SelectItem value="barcelone">Barcelone</SelectItem>
                        <SelectItem value="rome">Rome</SelectItem>
                        <SelectItem value="milan">Milan</SelectItem>
                        <SelectItem value="zurich">Zurich</SelectItem>
                        <SelectItem value="geneve">Genève</SelectItem>
                        <SelectItem value="bruxelles">Bruxelles</SelectItem>
                        <SelectItem value="new-york">New York</SelectItem>
                        <SelectItem value="los-angeles">Los Angeles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </CardContent>
            </Card>

             {/* Affichage des demandes de soutien */}
             <div className="mt-6">
               {(() => {
                 // Collecter toutes les données selon le filtre
                 let allItems: any[] = []
                 
                 if (typeFilter === "all") {
                   // Récupérer tous les éléments de tous les types
                   soutienTypes.forEach(type => {
                     const typeData = soutienData[type.id as keyof typeof soutienData]
                     const filteredData = getFilteredData(typeData, type.id)
                     filteredData.forEach(item => {
                       allItems.push({ ...item, typeId: type.id, typeTitle: type.title })
                     })
                   })
                 } else {
                   // Récupérer les éléments du type sélectionné
                   const typeData = soutienData[typeFilter as keyof typeof soutienData]
                   const filteredData = getFilteredData(typeData, typeFilter)
                   const selectedType = soutienTypes.find(type => type.id === typeFilter)
                   filteredData.forEach(item => {
                     allItems.push({ ...item, typeId: typeFilter, typeTitle: selectedType?.title })
                   })
                 }
                 
                 if (allItems.length === 0) {
                   return (
                  <Card>
                       <CardContent className="text-center py-8">
                         <p className="text-gray-500 mb-2">Aucune demande de soutien trouvée</p>
                         <p className="text-sm text-gray-400">Cliquez sur "Nouvelle demande" pour commencer</p>
                       </CardContent>
                     </Card>
                   )
                 }
                 
                 return (
                   <Card>
                     <CardHeader className="pb-2">
                        <div>
                         <CardTitle className="text-lg">
                           {typeFilter === "all" 
                             ? "Toutes les demandes de soutien" 
                             : soutienTypes.find(type => type.id === typeFilter)?.title || "Demandes de soutien"
                           }
                         </CardTitle>
                         <p className="text-sm text-gray-600 mt-1">
                           {typeFilter === "all" 
                             ? "Liste de toutes vos demandes de soutien" 
                             : soutienTypes.find(type => type.id === typeFilter)?.description || ""
                           }
                         </p>
                      </div>
                    </CardHeader>
                     <CardContent className="pt-2 px-4 pb-4">
                       <div className="space-y-3">
                         {allItems.map((item) => (
                           <div key={`${item.typeId}-${item.id}`} className="bg-gray-50 border-l-4 border-l-blue-900 border border-gray-200 rounded-lg hover:shadow-lg hover:bg-gray-100 transition-all duration-200 p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                 <div className="flex items-center gap-2 mb-1">
                                   <h3 className="font-medium text-gray-900 text-sm">{item.titre}</h3>
                                   <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.typeTitle}</span>
                                 </div>
                                 <div className="flex items-center gap-4 text-gray-600 text-xs">
                                      <span>Date: {new Date(item.date).toLocaleDateString("fr-FR")}</span>
                                      <span>Montant: {item.montant}</span>
                                   <span>Lieu: {item.ville && item.pays ? `${item.ville}, ${item.pays}` : 'Non spécifié'}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {getStatutBadge(item.statut)}
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                    </CardContent>
                  </Card>
                 )
               })()}
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}

