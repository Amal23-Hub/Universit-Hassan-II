"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
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
  FileText,
  Building2
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SoutienPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("manifestation")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [isConferenceFormOpen, setIsConferenceFormOpen] = useState(false)
  const [isOuvrageFormOpen, setIsOuvrageFormOpen] = useState(false)
  const [isBrevetFormOpen, setIsBrevetFormOpen] = useState(false)
  const [isPublicationArticleFormOpen, setIsPublicationArticleFormOpen] = useState(false)
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false)
  
  // État pour le formulaire de soutien à la conférence
  const [conferenceForm, setConferenceForm] = useState({
    typeDemande: "laboratoire",
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

  // État pour le formulaire de publication d'article
  const [publicationArticleForm, setPublicationArticleForm] = useState({
    titre: "",
    journal: "",
    issn: "",
    base: "",
    annee: "",
    lien: "",
    justificatif: null as File | null
  })
  const [publicationArticleErrors, setPublicationArticleErrors] = useState({
    titre: false,
    journal: false,
    issn: false,
    base: false,
    annee: false
  })
  const [publicationArticleLienJustificatifError, setPublicationArticleLienJustificatifError] = useState("")

  // Données d'exemple pour les différents types de soutien
  const soutienData = {
    manifestation: [
      {
        id: 1,
        titre: "Soutien manifestation mathématiques",
        type: "Manifestation",
        statut: "En attente",
        date: "2024-01-15",
        montant: "5000 MAD"
      }
    ],
    conference: [
      {
        id: 2,
        titre: "Conférence internationale IA 2024",
        type: "Conférence",
        statut: "Approuvé",
        date: "2024-02-20",
        montant: "8000 MAD"
      }
    ],
    "publication-article": [
      {
        id: 4,
        titre: "Publication article revue indexée",
        type: "Publication d'article",
        statut: "En cours",
        date: "2024-01-22",
        montant: "4000 MAD"
      }
    ],
    ouvrage: [
      {
        id: 5,
        titre: "Ouvrage de recherche",
        type: "Ouvrage",
        statut: "Rejeté",
        date: "2024-01-05",
        montant: "10000 MAD"
      }
    ],
    brevet: [
      {
        id: 6,
        titre: "Enregistrement brevet innovation",
        type: "Brevet",
        statut: "Approuvé",
        date: "2024-01-20",
        montant: "15000 MAD"
      }
    ],
    prime: [
      {
        id: 7,
        titre: "Prime de publication Q1",
        type: "Prime",
        statut: "En attente",
        date: "2024-02-01",
        montant: "2000 MAD"
      }
    ]
  }

  // Fonction de filtrage des données
  const getFilteredData = (data: any[]) => {
    if (!data || !Array.isArray(data)) {
      return []
    }
    return data.filter(item => {
      const matchesSearch = item.titre.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.statut === statusFilter
      
      // Filtre par date
      let matchesDate = true
      if (dateFilter && dateFilter !== "") {
        const itemDate = new Date(item.date)
        const filterDate = new Date(dateFilter)
        
        // Comparer les dates (ignorer l'heure)
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate())
        const filterDateOnly = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate())
        
        matchesDate = itemDateOnly.getTime() === filterDateOnly.getTime()
      }
      
      return matchesSearch && matchesStatus && matchesDate
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
      title: "Soutien à la conférence",
      description: "Demande de soutien pour participer à des conférences",
      icon: MessageSquare,
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      id: "publication-article",
      title: "Soutien à la publication d'un article",
      description: "Demande de soutien pour publier des articles dans des revues indexées",
      icon: FileText,
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      id: "ouvrage",
      title: "Soutien à l'ouvrage",
      description: "Demande de soutien pour publier des ouvrages de recherche",
      icon: Shield,
      color: "bg-orange-50 text-orange-700 border-orange-200"
    },
    {
      id: "brevet",
      title: "Soutien au brevet",
      description: "Demande de soutien pour l'enregistrement de brevets",
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
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
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
                          setIsRedirectDialogOpen(true)
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
                          <span className="font-medium text-gray-900">Soutien à la conférence</span>
                          <span className="text-sm text-gray-500">Participer à des conférences</span>
                        </div>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-12 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => {
                          setIsDialogOpen(false)
                          setIsPublicationArticleFormOpen(true)
                        }}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-gray-900">Soutien à la publication d'un article</span>
                          <span className="text-sm text-gray-500">Publier des articles dans des revues indexées</span>
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
                          <span className="font-medium text-gray-900">Soutien à l'ouvrage</span>
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
                          <span className="font-medium text-gray-900">Soutien au brevet</span>
                          <span className="text-sm text-gray-500">Enregistrer des brevets</span>
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
              </div>
            </div>


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
                              <p className="text-xs text-gray-600 mt-0.5">Remplissez tous les champs obligatoires pour votre demande de soutien</p>
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
                     <Label className="text-sm font-medium text-gray-700">Type demande de soutien à la conférence <span className="text-red-500">*</span></Label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="typeDemande"
                              value="laboratoire"
                              checked={conferenceForm.typeDemande === "laboratoire"}
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
                     <Label htmlFor="discipline" className="text-sm font-medium text-gray-700">Discipline <span className="text-red-500">*</span></Label>
                        <Input
                          id="discipline"
                          value={conferenceForm.discipline}
                          onChange={(e) => setConferenceForm({...conferenceForm, discipline: e.target.value})}
                      placeholder="Ex: Mathématiques, Informatique, Physique..."
                          className="mt-1"
                        />
                      </div>

                      {/* Nature de la manifestation */}
                      <div>
                     <Label className="text-sm font-medium text-gray-700">Nature de la manifestation <span className="text-red-500">*</span></Label>
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
                     <Label className="text-sm font-medium text-gray-700">Nature de prise en charge <span className="text-red-500">*</span></Label>
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
                     <Label htmlFor="montantEstime" className="text-sm font-medium text-gray-700">Montant estimé <span className="text-red-500">*</span></Label>
                        <Input
                          id="montantEstime"
                          type="number"
                          value={conferenceForm.montantEstime}
                          onChange={(e) => setConferenceForm({...conferenceForm, montantEstime: e.target.value})}
                          placeholder="Montant en MAD"
                          className="mt-1"
                        />
                      </div>

                   {/* Intitulé de la manifestation */}
                      <div>
                     <Label htmlFor="intituleManifestation" className="text-sm font-medium text-gray-700">Intitulé de la manifestation <span className="text-red-500">*</span></Label>
                        <Input
                          id="intituleManifestation"
                          value={conferenceForm.intituleManifestation}
                          onChange={(e) => setConferenceForm({...conferenceForm, intituleManifestation: e.target.value})}
                      placeholder="Nom de la conférence"
                          className="mt-1"
                        />
                      </div>

                      {/* Lieu de la manifestation */}
                      <div>
                     <Label htmlFor="lieuManifestation" className="text-sm font-medium text-gray-700">Lieu de la manifestation (Pays-ville) <span className="text-red-500">*</span></Label>
                        <Input
                          id="lieuManifestation"
                          value={conferenceForm.lieuManifestation}
                          onChange={(e) => setConferenceForm({...conferenceForm, lieuManifestation: e.target.value})}
                          placeholder="Ex: France-Paris, Allemagne-Berlin..."
                          className="mt-1"
                        />
                      </div>

                   {/* Date de déroulement */}
                      <div>
                     <Label htmlFor="dateManifestation" className="text-sm font-medium text-gray-700">Date de déroulement de la manifestation <span className="text-red-500">*</span></Label>
                        <Input
                          id="dateManifestation"
                          type="date"
                          value={conferenceForm.dateManifestation}
                          onChange={(e) => setConferenceForm({...conferenceForm, dateManifestation: e.target.value})}
                          className="mt-1"
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
                          <p className="text-xs text-gray-600 mt-0.5">Utilisez le même formulaire d'ajout d'un ouvrage dans le module production scientifique</p>
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
                          <p className="text-xs text-gray-600 mt-0.5">Utilisez le même formulaire d'ajout d'un brevet dans le module production scientifique</p>
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
                  </DialogContent>
                </Dialog>

            {/* Formulaire Soutien à la publication d'un article */}
            <Dialog open={isPublicationArticleFormOpen} onOpenChange={setIsPublicationArticleFormOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-uh2c-blue rounded-lg flex items-center justify-center">
                          <FileText className="h-4 w-4 text-white" />
              </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">Soutien à la publication d'un article</h2>
                          <p className="text-sm text-gray-600">Remplissez tous les champs obligatoires pour votre demande de soutien</p>
            </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsPublicationArticleFormOpen(false)
                          setIsDialogOpen(true)
                        }}
                      >
                        ← Retour
                      </Button>
                    </div>
                  </div>
                </DialogHeader>

                <form className="border rounded-lg p-6 mt-4 space-y-6">
                  {/* Titre de la publication */}
                  <div>
                    <Label htmlFor="titre-publication">
                      Intitulé de la publication <span className="text-red-600">*</span>
                    </Label>
                      <Input
                      id="titre-publication" 
                      required 
                      placeholder="Titre de la publication" 
                      className={`h-11 rounded-lg text-base ${publicationArticleErrors.titre ? 'border-red-500' : ''}`}
                      value={publicationArticleForm.titre}
                      onChange={(e) => {
                        setPublicationArticleForm(v => ({ ...v, titre: e.target.value }))
                        if (e.target.value) setPublicationArticleErrors(err => ({ ...err, titre: false }))
                      }}
                    />
                    {publicationArticleErrors.titre && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>

                  {/* Libellé de la Revue/Journal */}
                  <div>
                    <Label htmlFor="journal-publication">
                      Libellé de la Revue/Journal <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="journal-publication" 
                      required 
                      placeholder="Nom de la revue/journal" 
                      className={`h-11 rounded-lg text-base ${publicationArticleErrors.journal ? 'border-red-500' : ''}`}
                      value={publicationArticleForm.journal}
                      onChange={(e) => {
                        setPublicationArticleForm(v => ({ ...v, journal: e.target.value }))
                        if (e.target.value) setPublicationArticleErrors(err => ({ ...err, journal: false }))
                      }}
                    />
                    {publicationArticleErrors.journal && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>

                  {/* ISSN */}
                  <div>
                    <Label htmlFor="issn-publication">
                      ISSN de la Revue/Journal <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="issn-publication" 
                      required 
                      placeholder="ISSN" 
                      className={`h-11 rounded-lg text-base ${publicationArticleErrors.issn ? 'border-red-500' : ''}`}
                      value={publicationArticleForm.issn}
                      onChange={(e) => {
                        setPublicationArticleForm(v => ({ ...v, issn: e.target.value }))
                        if (e.target.value) setPublicationArticleErrors(err => ({ ...err, issn: false }))
                      }}
                    />
                    {publicationArticleErrors.issn && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>

                  {/* Base d'indexation */}
                  <div>
                    <Label htmlFor="base-publication">
                      Base d'indexation <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={publicationArticleForm.base}
                      onValueChange={(value) => {
                        setPublicationArticleForm(v => ({ ...v, base: value }))
                        if (value) setPublicationArticleErrors(err => ({ ...err, base: false }))
                      }}
                    >
                      <SelectTrigger className={`h-11 rounded-lg text-base ${publicationArticleErrors.base ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Choisir une base d'indexation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scopus">Scopus</SelectItem>
                        <SelectItem value="WOS">WOS</SelectItem>
                        <SelectItem value="ORCID">ORCID</SelectItem>
                        <SelectItem value="DOI">DOI</SelectItem>
                        <SelectItem value="DOAJ">DOAJ</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {publicationArticleErrors.base && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>

                  {/* Date de publication */}
                  <div>
                    <Label htmlFor="annee-publication">
                      Date de publication <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="annee-publication"
                      type="number"
                      required
                      placeholder="2024"
                      className={`h-11 rounded-lg text-base ${publicationArticleErrors.annee ? 'border-red-500' : ''}`}
                      value={publicationArticleForm.annee}
                      onChange={(e) => {
                        setPublicationArticleForm(v => ({ ...v, annee: e.target.value }))
                        if (e.target.value) setPublicationArticleErrors(err => ({ ...err, annee: false }))
                      }}
                    />
                    {publicationArticleErrors.annee && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>

                  {/* Lien vers la revue */}
                  <div>
                    <Label htmlFor="lien-publication">
                      Lien vers la revue
                      <span className={`ml-1 ${!publicationArticleForm.lien && !publicationArticleForm.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!publicationArticleForm.lien && !publicationArticleForm.justificatif ? '*' : (!publicationArticleForm.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-publication" 
                      placeholder="https://ieeexplore.ieee.org/document/1234567" 
                      className="h-11 rounded-lg text-base"
                      value={publicationArticleForm.lien}
                      onChange={(e) => {
                        setPublicationArticleForm({ ...publicationArticleForm, lien: e.target.value })
                        if (e.target.value || publicationArticleForm.justificatif) {
                          setPublicationArticleLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>

                  {/* Justificatif */}
                  <div>
                    <Label htmlFor="justif-publication">
                      Justificatif 
                      <span className={`ml-1 ${!publicationArticleForm.lien && !publicationArticleForm.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!publicationArticleForm.lien && !publicationArticleForm.justificatif ? '*' : (!publicationArticleForm.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!publicationArticleForm.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setPublicationArticleForm({ ...publicationArticleForm, justificatif: file })
                            if (file || publicationArticleForm.lien) {
                              setPublicationArticleLienJustificatifError("")
                            }
                          }}
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
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{publicationArticleForm.justificatif.name}</p>
                              <p className="text-xs text-gray-500">
                                {(publicationArticleForm.justificatif.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setPublicationArticleForm({ ...publicationArticleForm, justificatif: null })}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                    )}
                    {publicationArticleLienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{publicationArticleLienJustificatifError}</p>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => setIsPublicationArticleFormOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                      Envoyer la demande
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Nouveau design avec grille de cartes */}
            <div className="space-y-4">

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
                        placeholder="Rechercher une demande..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-8 text-xs bg-white border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Filtres en trois colonnes */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <FileText className="h-3 w-3 text-gray-600" />
                        <Label className="text-xs font-medium text-gray-700">Type de soutien</Label>
                      </div>
                      <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger className="h-8 text-xs bg-white border-gray-300 rounded-md">
                          <SelectValue placeholder="Tous les types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          {soutienTypes.map(type => (
                            <SelectItem key={type.id} value={type.id}>{type.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <CheckCircle className="h-3 w-3 text-gray-600" />
                        <Label className="text-xs font-medium text-gray-700">Statut</Label>
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-8 text-xs bg-white border-gray-300 rounded-md">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="En attente">En attente</SelectItem>
                          <SelectItem value="Approuvé">Approuvé</SelectItem>
                          <SelectItem value="Rejeté">Rejeté</SelectItem>
                          <SelectItem value="En cours">En cours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="h-3 w-3 text-gray-600" />
                        <Label className="text-xs font-medium text-gray-700">Date</Label>
                      </div>
                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="h-8 text-xs bg-white border-gray-300 rounded-md"
                          placeholder="Date de début"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section principale */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                 <div className="mb-4">
                     <h2 className="text-lg font-semibold text-gray-900">Mes demandes de soutien</h2>
                     <p className="text-sm text-gray-600">Gérez toutes vos demandes de soutien en un seul endroit</p>
                 </div>

                {/* Liste des demandes */}
                <div className="space-y-3">
                      {(() => {
                    let allData: any[] = []
                    if (activeTab === "all") {
                      soutienTypes.forEach(type => {
                        const data = soutienData[type.id as keyof typeof soutienData] || []
                        allData = [...allData, ...data.map(item => ({ ...item, type: type.title, typeId: type.id, typeColor: type.color, typeIcon: type.icon }))]
                      })
                    } else {
                      const type = soutienTypes.find(t => t.id === activeTab)
                      if (type) {
                        const data = soutienData[type.id as keyof typeof soutienData] || []
                        allData = data.map(item => ({ ...item, type: type.title, typeId: type.id, typeColor: type.color, typeIcon: type.icon }))
                      }
                    }
                    
                    const filteredData = getFilteredData(allData)
                    
                        return filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <div key={`${item.typeId}-${item.id}`} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border-l-4 border-blue-900">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-base font-semibold text-gray-900">{item.titre}</h3>
                                  <Badge variant="outline" className="text-xs">{item.type}</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span>{new Date(item.date).toLocaleDateString("fr-FR")}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Gift className="h-3 w-3 text-gray-400" />
                                    <span className="font-semibold text-uh2c-blue">{item.montant}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <span>{item.type}</span>
                                  </div>
                                </div>
                            </div>
                                  <div className="flex items-center gap-3">
                                    {getStatutBadge(item.statut)}
                                    <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-600">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
                        <p className="text-gray-500 mb-4">
                          {activeTab === "all" 
                            ? "Vous n'avez pas encore de demandes de soutien" 
                            : `Vous n'avez pas encore de demandes de ${soutienTypes.find(t => t.id === activeTab)?.title.toLowerCase()}`
                          }
                        </p>
                        <Button 
                          onClick={() => setIsDialogOpen(true)}
                          className="bg-uh2c-blue hover:bg-uh2c-blue/90"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Créer une nouvelle demande
                        </Button>
                          </div>
                        )
                      })()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Popup de redirection pour manifestations scientifiques */}
            <Dialog open={isRedirectDialogOpen} onOpenChange={setIsRedirectDialogOpen}>
              <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="text-center">
              <div className="w-16 h-16 bg-uh2c-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-uh2c-blue" />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-3">
                Redirection vers les Manifestations
              </DialogTitle>
              <p className="text-gray-600 text-base">
                Veuillez vous rediriger vers les manifestations scientifiques afin d'effectuer une demande de soutien à la manifestation.
              </p>
            </div>
          </DialogHeader>
          
          <div className="flex justify-center gap-4 pt-8">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsRedirectDialogOpen(false)
                setIsDialogOpen(true)
              }}
              className="px-6 py-3 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              ← Retour
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsRedirectDialogOpen(false)}
              className="px-6 py-3 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              Annuler
            </Button>
            <Button 
              className="bg-uh2c-blue hover:bg-uh2c-blue/90 px-6 py-3 text-white font-medium transition-colors"
              onClick={() => {
                setIsRedirectDialogOpen(false)
                router.push('/manifestations-scientifiques/organisation-manifestation-member')
              }}
            >
              Aller aux Manifestations
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
