"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Filter, Eye, Edit, Trash2, LinkIcon, Upload, FileText } from "lucide-react"
import Image from "next/image"

interface DistinctionPrix {
  id: string
  intitule: string
  evenement?: string
  organisme?: string
  date: string
  dateType: "jour" | "mois" | "annee"
  lien?: string
  justificatifs?: string
  decision?: string
  commentaireExpert?: string
  typeProjet?: "individuel" | "collectif"
  membres?: string[]
  membresExternes?: Array<{
    id: string
    nom: string
    prenom: string
    titre: string
    etablissement: string
  }>
}

export default function DistinctionsPrix() {
  const [distinctions, setDistinctions] = useState<DistinctionPrix[]>([
    {
      id: "DP001",
      intitule: "Prix de l'Innovation Scientifique",
      evenement: "Conférence Nationale de la Recherche",
      organisme: "Ministère de l'Enseignement Supérieur",
      date: "2023-11-20",
      dateType: "jour",
      lien: "https://example.com/prix001",
      justificatifs: "prix001_certifi.",
      decision: "Attribué",
      commentaireExpert: "Reconnaissance pour des travaux exceptionnels.",
      typeProjet: "individuel",
      membres: ["1"],
    },
    {
      id: "DP002",
      intitule: "Médaille d'Or de la Recherche",
      evenement: "Gala Annuel de la Science",
      organisme: "Académie Royale des Sciences",
      date: "2022-05",
      dateType: "mois",
      lien: "https://example.com/prix002",
      justificatifs: "prix002_medail",
      decision: "Attribué",
      commentaireExpert: "Contribution significative à la science.",
      typeProjet: "individuel",
      membres: ["2"],
    },
    {
      id: "DP003",
      intitule: "Prix d'Excellence Académique",
      evenement: "Cérémonie de Distinction",
      organisme: "Université Hassan II",
      date: "2021",
      dateType: "annee",
      lien: "https://example.com/prix003",
      justificatifs: "prix003_excelle",
      decision: "Attribué",
      commentaireExpert: "Excellence dans l'enseignement et la recherche.",
      typeProjet: "individuel",
      membres: ["3"],
    },
    {
      id: "DP004",
      intitule: "Prix du Meilleur Projet Collaboratif",
      evenement: "Forum International de l'Innovation",
      organisme: "Organisation Mondiale de l'Innovation",
      date: "2023-06-15",
      dateType: "jour",
      lien: "https://example.com/prix004",
      justificatifs: "prix004_collabc",
      decision: "Attribué",
      commentaireExpert: "Projet collectif remarquable impliquant plusieurs membres.",
      typeProjet: "collectif",
      membres: ["1", "2", "3"],
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterAnnee, setFilterAnnee] = useState("all")
  const [filterOrganisme, setFilterOrganisme] = useState("all")
  const [filteredDistinctions, setFilteredDistinctions] = useState<DistinctionPrix[]>(distinctions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPays, setSelectedPays] = useState<string>("")
  const [autreOrganismeType, setAutreOrganismeType] = useState<string>("")
  const [selectedOrganismeName, setSelectedOrganismeName] = useState<string>("")
  const [addedOrganismes, setAddedOrganismes] = useState<string[]>([])
  const [selectedLink, setSelectedLink] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [datePrecision, setDatePrecision] = useState("precise")
  const [selectedDate, setSelectedDate] = useState("")
  const [organismeType, setOrganismeType] = useState<"existant" | "autre">("existant")
  const [selectedOrganismeType, setSelectedOrganismeType] = useState<string>("")
  const [selectedOrganisme, setSelectedOrganisme] = useState<string>("")
  const [typeProjet, setTypeProjet] = useState<"individuel" | "collectif">("individuel")
  const [selectedDistinction, setSelectedDistinction] = useState<DistinctionPrix | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  
  // États pour les données du formulaire
  const [formData, setFormData] = useState({
    intitule: "",
    evenement: "",
    organisme: "",
    date: "",
    lien: "",
    justificatifs: [] as File[]
  })
  
  // États pour la validation
  const [formErrors, setFormErrors] = useState({
    intitule: false,
    evenement: false,
    organisme: false,
    date: false,
    lienJustificatif: false
  })
  
  // États pour les membres du projet
  const [selectedMembresPermanents, setSelectedMembresPermanents] = useState<string[]>([])
  const [selectedDoctorants, setSelectedDoctorants] = useState<string[]>([])
  const [isMembresDropdownOpen, setIsMembresDropdownOpen] = useState(false)
  const [isDoctorantsDropdownOpen, setIsDoctorantsDropdownOpen] = useState(false)
  
  // États pour les filtres de sélection des membres
  const [filterEtablissement, setFilterEtablissement] = useState("all")
  const [filterOrganismeMembres, setFilterOrganismeMembres] = useState("all")
  const [filterLaboratoire, setFilterLaboratoire] = useState("all")
  
  // États pour les membres associés
  const [membresAssocies, setMembresAssocies] = useState<Array<{
    nom: string
    prenom: string
    pays: string
    etablissement: string
  }>>([])
  const [membreAssocie, setMembreAssocie] = useState({
    nom: "",
    prenom: "",
    pays: "",
    etablissement: ""
  })

  // Gestionnaire pour fermer les dropdowns quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      
      // Vérifier si le clic est en dehors des dropdowns
      const membresDropdown = document.getElementById('membres-dropdown-container')
      const doctorantsDropdown = document.getElementById('doctorants-dropdown-container')
      
      if (membresDropdown && !membresDropdown.contains(target)) {
        setIsMembresDropdownOpen(false)
      }
      
      if (doctorantsDropdown && !doctorantsDropdown.contains(target)) {
        setIsDoctorantsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fonctions utilitaires
  const applyFilters = () => {
    let filtered = distinctions.filter(distinction => {
      const matchesSearch = searchTerm === "" || 
        distinction.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        distinction.evenement?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        distinction.organisme?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesAnnee = filterAnnee === "all" || 
        distinction.date.startsWith(filterAnnee)
      
      const matchesOrganisme = filterOrganisme === "all" || 
        distinction.organisme === filterOrganisme
      
      return matchesSearch && matchesAnnee && matchesOrganisme
    })
    
    setFilteredDistinctions(filtered)
  }

  const formatDateForDisplay = (date: string, dateType: "jour" | "mois" | "annee") => {
    if (!date) return "-"
    
    if (dateType === "jour") {
      return new Date(date).toLocaleDateString('fr-FR')
    } else if (dateType === "mois") {
      const [year, month] = date.split('-')
      const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ]
      return `${monthNames[parseInt(month) - 1]} ${year}`
    } else {
      return date
    }
  }

  const getUniqueYears = () => {
    const years = distinctions.map(d => {
      if (d.dateType === "jour" || d.dateType === "mois") {
        return parseInt(d.date.split('-')[0])
      } else {
        return parseInt(d.date)
      }
    })
    return [...new Set(years)].sort((a, b) => b - a)
  }

  const getUniqueOrganismes = () => {
    const organismes = distinctions
      .map(d => d.organisme)
      .filter((organisme): organisme is string => organisme !== undefined)
    return [...new Set(organismes)].sort()
  }

  const handleAddOrganismeExistant = () => {
    if (selectedOrganisme) {
      const organismeName = getOrganismeName(selectedOrganisme)
      const fullName = selectedOrganismeType === "international" && selectedPays 
        ? `${organismeName} (${selectedPays})`
        : organismeName
      
      setAddedOrganismes(prev => [...prev, fullName])
      setSelectedOrganisme("")
      setSelectedOrganismeType("")
      setSelectedPays("")
    }
  }

  const handleAddAutreOrganisme = () => {
    if (selectedOrganismeName.trim()) {
      const fullName = autreOrganismeType === "international" && selectedPays 
        ? `${selectedOrganismeName} (${selectedPays})`
        : selectedOrganismeName
      
      setAddedOrganismes(prev => [...prev, fullName])
      setSelectedOrganismeName("")
      setAutreOrganismeType("")
      setSelectedPays("")
    }
  }

  const getOrganismeName = (value: string) => {
    const organismes = {
      "ministere-enseignement": "Ministère de l'Enseignement Supérieur",
      "ministere-recherche": "Ministère de la Recherche Scientifique",
      "academie-sciences": "Académie Royale des Sciences",
      "universite-hassan": "Université Hassan II",
      "cnrst": "Centre National de Recherche Scientifique et Technique",
      "anr": "Agence Nationale de Recherche",
      "fondation-hassan": "Fondation Hassan II pour la Recherche",
      "organisation-innovation": "Organisation Mondiale de l'Innovation",
      "union-europeenne": "Union Européenne",
      "unesco": "UNESCO",
      "banque-mondiale": "Banque Mondiale",
      "onu": "Organisation des Nations Unies"
    }
    return organismes[value as keyof typeof organismes] || value
  }

  const handleAddMembreAssocie = () => {
    if (membreAssocie.nom.trim() && membreAssocie.prenom.trim()) {
      setMembresAssocies(prev => [...prev, { ...membreAssocie }])
      setMembreAssocie({
        nom: "",
        prenom: "",
        pays: "",
        etablissement: ""
      })
    }
  }

  const handleViewDetails = (distinction: DistinctionPrix) => {
    setSelectedDistinction(distinction)
    setDetailDialogOpen(true)
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterAnnee, filterOrganisme, distinctions])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Distinctions et Prix</h1>
                <p className="text-gray-600 mt-1 text-sm">Gérez vos distinctions et prix reçus</p>
              </div>
              <Button className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nouvelle distinction
              </Button>
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
                    placeholder="Rechercher une distinction..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                  />
                </div>

                {/* Filtres en grille */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Année</Label>
                    <Select value={filterAnnee} onValueChange={setFilterAnnee}>
                      <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Toutes les années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les années</SelectItem>
                        {getUniqueYears().map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Organisme</Label>
                    <Select value={filterOrganisme} onValueChange={setFilterOrganisme}>
                      <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les organismes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les organismes</SelectItem>
                        {getUniqueOrganismes().map(organisme => (
                          <SelectItem key={organisme} value={organisme}>
                            {getOrganismeName(organisme)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Résultats</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-uh2c-blue rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {filteredDistinctions.length} distinction(s)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dialogue pour ajouter une nouvelle distinction */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="sr-only">Ajouter une nouvelle distinction/prix</DialogTitle>
                    </DialogHeader>
                    
                    {/* En-tête unifié */}
                    <div className="mb-6">
                      {/* En-tête principal avec instructions */}
                      <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col items-center space-y-3">
                          <span className="text-base font-bold text-uh2c-blue">
                            Ajouter une nouvelle Distinction/Prix
                          </span>
                          <span className="text-sm text-gray-600 font-medium text-center">
                            Remplissez tous les champs obligatoires (*) pour votre distinction ou prix. Assurez-vous que toutes les informations sont exactes et complètes.
                          </span>
                        </div>
                      </div>
                    </div>
                    
                <form className="space-y-6">
                  {/* Type de projet */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Type de projet <span className="text-red-500">*</span></Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`relative p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        typeProjet === "individuel" 
                          ? "border-uh2c-blue bg-uh2c-blue/5" 
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}>
                        <input
                          type="radio"
                          id="type-individuel"
                          name="typeProjet"
                          value="individuel"
                          checked={typeProjet === "individuel"}
                          onChange={(e) => setTypeProjet(e.target.value as "individuel" | "collectif")}
                          className="sr-only"
                        />
                        <Label htmlFor="type-individuel" className="flex items-center space-x-2 cursor-pointer">
                          <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                            typeProjet === "individuel" 
                              ? "border-uh2c-blue bg-uh2c-blue" 
                              : "border-gray-300 bg-white"
                          }`}>
                            {typeProjet === "individuel" && (
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Projet individuel</div>
                            <div className="text-xs text-gray-500">Projet réalisé par une seule personne</div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className={`relative p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        typeProjet === "collectif" 
                          ? "border-uh2c-blue bg-uh2c-blue/5" 
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}>
                        <input
                          type="radio"
                          id="type-collectif"
                          name="typeProjet"
                          value="collectif"
                          checked={typeProjet === "collectif"}
                          onChange={(e) => setTypeProjet(e.target.value as "individuel" | "collectif")}
                          className="sr-only"
                        />
                        <Label htmlFor="type-collectif" className="flex items-center space-x-2 cursor-pointer">
                          <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                            typeProjet === "collectif" 
                              ? "border-uh2c-blue bg-uh2c-blue" 
                              : "border-gray-300 bg-white"
                          }`}>
                            {typeProjet === "collectif" && (
                              <div className="w-1 h-1 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Projet collectif</div>
                            <div className="text-xs text-gray-500">Projet réalisé par plusieurs personnes</div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Membres du projet - affiché seulement pour les projets collectifs */}
                  {typeProjet === "collectif" && (
                    <div className="space-y-3 border border-gray-200 rounded-lg p-3 bg-gradient-to-br from-gray-50 to-white">
                      {/* En-tête de la section */}
                      <div className="border-b border-gray-200 pb-2">
                        <div className="flex items-center space-x-2 mb-1 justify-center">
                          <div className="w-1 h-1 bg-uh2c-blue rounded-full"></div>
                          <h3 className="text-sm font-semibold text-gray-900">Membres du projet</h3>
                        </div>
                        <p className="text-xs text-gray-600 text-center">Sélectionnez les membres impliqués dans cette soumission</p>
                      </div>

                      {/* Membres permanents */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-gray-800">Membres permanents</h4>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-gray-700">Sélectionner des membres permanents</Label>
                          <div className="space-y-2">
                            <div className="border-2 border-gray-200 rounded-lg p-3">
                              <div className="flex flex-wrap gap-1 mb-3">
                                {selectedMembresPermanents.map((membreId) => {
                                  const membre = {
                                    membre1: "Dr. Ahmed Benali",
                                    membre2: "Dr. Fatima Zahra",
                                    membre3: "Dr. Mohamed Alami",
                                    membre4: "Dr. Aicha Mansouri",
                                    membre5: "Dr. Karim El Fassi",
                                    membre6: "Dr. Samira Bennis",
                                    membre7: "Dr. Hassan Tazi",
                                    membre8: "Dr. Amina Rachidi",
                                    membre9: "Dr. Youssef Idrissi",
                                    membre10: "Dr. Leila Benjelloun"
                                  }[membreId]
                                  return (
                                    <Badge key={membreId} variant="secondary" className="bg-blue-100 text-blue-800">
                                      {membre}
                                      <button
                                        onClick={() => setSelectedMembresPermanents(prev => prev.filter(id => id !== membreId))}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  )
                                })}
                              </div>
                              
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-gray-700 mb-1">Sélectionner des membres :</div>
                                
                                {/* Filtres par établissement, organisme et laboratoire */}
                                <div className="grid grid-cols-3 gap-2 mb-2">
                                  <div className="space-y-1">
                                    <Label className="text-xs font-medium text-gray-600">Établissement</Label>
                                    <Select value={filterEtablissement} onValueChange={setFilterEtablissement}>
                                      <SelectTrigger className="h-6 text-xs border border-gray-300 rounded-md">
                                        <SelectValue placeholder="Tous" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Tous les établissements</SelectItem>
                                        <SelectItem value="uh2c">Université Hassan II</SelectItem>
                                        <SelectItem value="um6p">Université Mohammed VI</SelectItem>
                                        <SelectItem value="enp">École Nationale Polytechnique</SelectItem>
                                        <SelectItem value="ensias">ENSIAS</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <Label className="text-xs font-medium text-gray-600">Organisme</Label>
                                    <Select value={filterOrganismeMembres} onValueChange={setFilterOrganismeMembres}>
                                      <SelectTrigger className="h-6 text-xs border border-gray-300 rounded-md">
                                        <SelectValue placeholder="Tous" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Tous les organismes</SelectItem>
                                        <SelectItem value="cnrst">CNRST</SelectItem>
                                        <SelectItem value="academie">Académie Hassan II</SelectItem>
                                        <SelectItem value="ministere">Ministère de l'Enseignement</SelectItem>
                                        <SelectItem value="international">Organismes internationaux</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <Label className="text-xs font-medium text-gray-600">Laboratoire</Label>
                                    <Select value={filterLaboratoire} onValueChange={setFilterLaboratoire}>
                                      <SelectTrigger className="h-6 text-xs border border-gray-300 rounded-md">
                                        <SelectValue placeholder="Tous" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">Tous les laboratoires</SelectItem>
                                        <SelectItem value="lamsin">LAMSIN</SelectItem>
                                        <SelectItem value="lsti">LSTI</SelectItem>
                                        <SelectItem value="lmi">LMI</SelectItem>
                                        <SelectItem value="lir">LIR</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div className="relative" id="membres-dropdown-container">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setIsMembresDropdownOpen(!isMembresDropdownOpen)
                                    }}
                                    className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                                  >
                                    <span className="text-sm text-gray-600">
                                      {selectedMembresPermanents.length === 0 
                                        ? "Choisir des membres..." 
                                        : `${selectedMembresPermanents.length} membre(s) sélectionné(s)`
                                      }
                                    </span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isMembresDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                  
                                  {isMembresDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                                      {[
                                        { value: "membre1", label: "Dr. Ahmed Benali", etablissement: "uh2c", organisme: "cnrst", laboratoire: "lamsin" },
                                        { value: "membre2", label: "Dr. Fatima Zahra", etablissement: "uh2c", organisme: "academie", laboratoire: "lsti" },
                                        { value: "membre3", label: "Dr. Mohamed Alami", etablissement: "um6p", organisme: "cnrst", laboratoire: "lmi" },
                                        { value: "membre4", label: "Dr. Aicha Mansouri", etablissement: "enp", organisme: "ministere", laboratoire: "lir" },
                                        { value: "membre5", label: "Dr. Karim El Fassi", etablissement: "ensias", organisme: "international", laboratoire: "lamsin" },
                                        { value: "membre6", label: "Dr. Samira Bennis", etablissement: "uh2c", organisme: "cnrst", laboratoire: "lsti" },
                                        { value: "membre7", label: "Dr. Hassan Tazi", etablissement: "um6p", organisme: "academie", laboratoire: "lmi" },
                                        { value: "membre8", label: "Dr. Amina Rachidi", etablissement: "enp", organisme: "ministere", laboratoire: "lir" },
                                        { value: "membre9", label: "Dr. Youssef Idrissi", etablissement: "ensias", organisme: "international", laboratoire: "lamsin" },
                                        { value: "membre10", label: "Dr. Leila Benjelloun", etablissement: "uh2c", organisme: "cnrst", laboratoire: "lsti" }
                                      ]
                                      .filter(membre => {
                                        const matchEtablissement = filterEtablissement === "all" || membre.etablissement === filterEtablissement
                                        const matchOrganisme = filterOrganismeMembres === "all" || membre.organisme === filterOrganismeMembres
                                        const matchLaboratoire = filterLaboratoire === "all" || membre.laboratoire === filterLaboratoire
                                        return matchEtablissement && matchOrganisme && matchLaboratoire
                                      })
                                      .map((membre) => (
                                  <div
                                    key={membre.value}
                                          className={`flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer ${
                                            selectedMembresPermanents.includes(membre.value) ? 'bg-blue-50' : ''
                                    }`}
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                      if (selectedMembresPermanents.includes(membre.value)) {
                                        setSelectedMembresPermanents(prev => prev.filter(id => id !== membre.value))
                                      } else {
                                        setSelectedMembresPermanents(prev => [...prev, membre.value])
                                      }
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedMembresPermanents.includes(membre.value)}
                                      onChange={() => {}}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                          <div className="flex-1">
                                            <span className="text-sm text-gray-700 font-medium">{membre.label}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-xs text-gray-500">
                                                {membre.etablissement === "uh2c" ? "UH2C" : 
                                                 membre.etablissement === "um6p" ? "UM6P" :
                                                 membre.etablissement === "enp" ? "ENP" :
                                                 membre.etablissement === "ensias" ? "ENSIAS" : membre.etablissement}
                                              </span>
                                              <span className="text-xs text-gray-400">•</span>
                                              <span className="text-xs text-gray-500">
                                                {membre.organisme === "cnrst" ? "CNRST" :
                                                 membre.organisme === "academie" ? "Académie" :
                                                 membre.organisme === "ministere" ? "Ministère" :
                                                 membre.organisme === "international" ? "International" : membre.organisme}
                                              </span>
                                              <span className="text-xs text-gray-400">•</span>
                                              <span className="text-xs text-gray-500">
                                                {membre.laboratoire === "lamsin" ? "LAMSIN" :
                                                 membre.laboratoire === "lsti" ? "LSTI" :
                                                 membre.laboratoire === "lmi" ? "LMI" :
                                                 membre.laboratoire === "lir" ? "LIR" : membre.laboratoire}
                                              </span>
                                            </div>
                                          </div>
                                  </div>
                                ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {selectedMembresPermanents.length > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                              <span className="text-xs font-medium text-blue-800">
                                {selectedMembresPermanents.length} membre(s) sélectionné(s)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Doctorants */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-gray-800">Doctorants</h4>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-gray-700">Sélectionner des doctorants</Label>
                          <div className="space-y-2">
                            <div className="border-2 border-gray-200 rounded-lg p-3">
                              <div className="flex flex-wrap gap-1 mb-3">
                                {selectedDoctorants.map((doctorantId) => {
                                  const doctorant = {
                                    doctorant1: "Ahmed Benali",
                                    doctorant2: "Fatima Zahra",
                                    doctorant3: "Mohamed Alami",
                                    doctorant4: "Aicha Mansouri",
                                    doctorant5: "Karim El Fassi",
                                    doctorant6: "Samira Bennis",
                                    doctorant7: "Hassan Tazi",
                                    doctorant8: "Amina Rachidi",
                                    doctorant9: "Youssef Idrissi",
                                    doctorant10: "Leila Benjelloun"
                                  }[doctorantId]
                                  return (
                                    <Badge key={doctorantId} variant="secondary" className="bg-green-100 text-green-800">
                                      {doctorant}
                                      <button
                                        onClick={() => setSelectedDoctorants(prev => prev.filter(id => id !== doctorantId))}
                                        className="ml-1 text-green-600 hover:text-green-800"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  )
                                })}
                              </div>
                              
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-700 mb-1">Sélectionner des doctorants :</div>
                                <div className="relative" id="doctorants-dropdown-container">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setIsDoctorantsDropdownOpen(!isDoctorantsDropdownOpen)
                                    }}
                                    className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                                  >
                                    <span className="text-sm text-gray-600">
                                      {selectedDoctorants.length === 0 
                                        ? "Choisir des doctorants..." 
                                        : `${selectedDoctorants.length} doctorant(s) sélectionné(s)`
                                      }
                                    </span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDoctorantsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </button>
                                  
                                  {isDoctorantsDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                                {[
                                  { value: "doctorant1", label: "Ahmed Benali" },
                                  { value: "doctorant2", label: "Fatima Zahra" },
                                  { value: "doctorant3", label: "Mohamed Alami" },
                                  { value: "doctorant4", label: "Aicha Mansouri" },
                                  { value: "doctorant5", label: "Karim El Fassi" },
                                  { value: "doctorant6", label: "Samira Bennis" },
                                  { value: "doctorant7", label: "Hassan Tazi" },
                                  { value: "doctorant8", label: "Amina Rachidi" },
                                  { value: "doctorant9", label: "Youssef Idrissi" },
                                  { value: "doctorant10", label: "Leila Benjelloun" }
                                ].map((doctorant) => (
                                  <div
                                    key={doctorant.value}
                                          className={`flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer ${
                                            selectedDoctorants.includes(doctorant.value) ? 'bg-green-50' : ''
                                    }`}
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                      if (selectedDoctorants.includes(doctorant.value)) {
                                        setSelectedDoctorants(prev => prev.filter(id => id !== doctorant.value))
                                      } else {
                                        setSelectedDoctorants(prev => [...prev, doctorant.value])
                                      }
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedDoctorants.includes(doctorant.value)}
                                      onChange={() => {}}
                                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">{doctorant.label}</span>
                                  </div>
                                ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {selectedDoctorants.length > 0 && (
                            <div className="mt-2 p-2 bg-green-50 rounded-lg">
                              <span className="text-xs font-medium text-green-800">
                                {selectedDoctorants.length} doctorant(s) sélectionné(s)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Membres associés */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <h4 className="text-sm font-semibold text-gray-800">Membres associés</h4>
                        </div>
                        
                        {/* Formulaire d'ajout */}
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Nom</Label>
                            <Input
                              placeholder="Nom du membre associé" 
                              value={membreAssocie.nom}
                              onChange={(e) => setMembreAssocie(prev => ({ ...prev, nom: e.target.value }))}
                                className="h-7 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md"
                            />
                          </div>
                            <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Prénom</Label>
                            <Input 
                              placeholder="Prénom du membre associé" 
                              value={membreAssocie.prenom}
                              onChange={(e) => setMembreAssocie(prev => ({ ...prev, prenom: e.target.value }))}
                                className="h-7 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md"
                            />
                          </div>
                        </div>
                        
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">Pays</Label>
                            <Select value={membreAssocie.pays} onValueChange={(value) => setMembreAssocie(prev => ({ ...prev, pays: value }))}>
                                <SelectTrigger className="h-7 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md">
                                <SelectValue placeholder="Sélectionner un pays..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="france">France</SelectItem>
                                <SelectItem value="allemagne">Allemagne</SelectItem>
                                <SelectItem value="espagne">Espagne</SelectItem>
                                <SelectItem value="italie">Italie</SelectItem>
                                <SelectItem value="usa">États-Unis</SelectItem>
                                <SelectItem value="canada">Canada</SelectItem>
                                <SelectItem value="japon">Japon</SelectItem>
                                <SelectItem value="chine">Chine</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                            <div className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700">Établissement</Label>
                            <Input 
                              placeholder="Nom de l'établissement" 
                              value={membreAssocie.etablissement}
                              onChange={(e) => setMembreAssocie(prev => ({ ...prev, etablissement: e.target.value }))}
                                className="h-7 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-md"
                            />
                          </div>
                        </div>
                        
                          <div className="flex justify-center mt-3">
                          <Button 
                            type="button" 
                              className="flex items-center gap-1 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white px-3 py-1.5 rounded-md transition-colors text-xs" 
                            onClick={handleAddMembreAssocie}
                              disabled={!membreAssocie.nom.trim() || !membreAssocie.prenom.trim()}
                          >
                              <Plus className="h-3 w-3" />
                            Ajouter le membre associé
                          </Button>
                          </div>
                        </div>
                        
                        {/* Affichage des membres associés ajoutés */}
                        {membresAssocies.length > 0 && (
                            <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium text-gray-700">Membres associés ajoutés ({membresAssocies.length})</Label>
                            </div>
                            <div className="space-y-1">
                              {membresAssocies.map((membre, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">{membre.prenom} {membre.nom}</span>
                                    {membre.pays && <span className="text-xs text-gray-500">({membre.pays})</span>}
                                    {membre.etablissement && <span className="text-xs text-gray-500">- {membre.etablissement}</span>}
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 h-5 w-5 p-0 hover:bg-red-50"
                                    onClick={() => setMembresAssocies(prev => prev.filter((_, i) => i !== index))}
                                  >
                                    <Trash2 className="h-2.5 w-2.5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Intitulé */}
                  <div className="space-y-2">
                    <Label htmlFor="intitule" className={`text-sm font-medium ${formErrors.intitule ? 'text-red-600' : ''}`}>
                      Intitulé <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="intitule"
                      placeholder="Titre de la distinction"
                      value={formData.intitule}
                      onChange={(e) => {
                        setFormData({ ...formData, intitule: e.target.value })
                        if (e.target.value) setFormErrors(prev => ({ ...prev, intitule: false }))
                      }}
                      className={`w-full ${formErrors.intitule ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {formErrors.intitule && (
                      <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>
                    )}
                  </div>

                  {/* Evènement */}
                  <div className="space-y-2">
                    <Label htmlFor="evenement" className={`text-sm font-medium ${formErrors.evenement ? 'text-red-600' : ''}`}>
                      Evènement <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="evenement"
                      placeholder="Conférence Nationale de la Recherche"
                      value={formData.evenement}
                      onChange={(e) => {
                        setFormData({ ...formData, evenement: e.target.value })
                        if (e.target.value) setFormErrors(prev => ({ ...prev, evenement: false }))
                      }}
                      className={`w-full ${formErrors.evenement ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {formErrors.evenement && (
                      <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>
                    )}
                  </div>
                        
                  {/* Organisme */}
                  <div className="space-y-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <Label className="text-sm font-medium">Organismes partenaires <span className="text-red-500">*</span></Label>
                    
                    {/* Boutons toggle */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOrganismeType("existant")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          organismeType === "existant"
                            ? "bg-primary text-primary-foreground"
                            : "bg-white text-gray-700 border border-gray-300"
                        }`}
                      >
                        Organisme existant
                      </button>
                      <button
                                  type="button"
                        onClick={() => setOrganismeType("autre")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                          organismeType === "autre"
                            ? "bg-primary text-primary-foreground"
                            : "bg-white text-gray-700 border border-gray-300"
                        }`}
                      >
                        Autre organisme
                      </button>
                              </div>

                    {/* Contenu selon le type sélectionné */}
                    {organismeType === "existant" && (
                          <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-sm font-medium">Type d'organisme</Label>
                            <Select value={selectedOrganismeType} onValueChange={setSelectedOrganismeType}>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Choisir un type..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="national">National</SelectItem>
                                <SelectItem value="international">International</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {selectedOrganismeType === "international" && (
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">Pays</Label>
                              <Select value={selectedPays} onValueChange={setSelectedPays}>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Sélectionner un pays..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="france">France</SelectItem>
                                  <SelectItem value="allemagne">Allemagne</SelectItem>
                                  <SelectItem value="espagne">Espagne</SelectItem>
                                  <SelectItem value="italie">Italie</SelectItem>
                                  <SelectItem value="royaume-uni">Royaume-Uni</SelectItem>
                                  <SelectItem value="pays-bas">Pays-Bas</SelectItem>
                                  <SelectItem value="belgique">Belgique</SelectItem>
                                  <SelectItem value="suisse">Suisse</SelectItem>
                                  <SelectItem value="autriche">Autriche</SelectItem>
                                  <SelectItem value="usa">États-Unis</SelectItem>
                                  <SelectItem value="canada">Canada</SelectItem>
                                  <SelectItem value="japon">Japon</SelectItem>
                                  <SelectItem value="chine">Chine</SelectItem>
                                  <SelectItem value="coree-sud">Corée du Sud</SelectItem>
                                  <SelectItem value="australie">Australie</SelectItem>
                                  <SelectItem value="nouvelle-zelande">Nouvelle-Zélande</SelectItem>
                                  <SelectItem value="bresil">Brésil</SelectItem>
                                  <SelectItem value="argentine">Argentine</SelectItem>
                                  <SelectItem value="chili">Chili</SelectItem>
                                  <SelectItem value="mexique">Mexique</SelectItem>
                                  <SelectItem value="afrique-sud">Afrique du Sud</SelectItem>
                                  <SelectItem value="egypte">Égypte</SelectItem>
                                  <SelectItem value="maroc">Maroc</SelectItem>
                                  <SelectItem value="tunisie">Tunisie</SelectItem>
                                  <SelectItem value="algerie">Algérie</SelectItem>
                                  <SelectItem value="senegal">Sénégal</SelectItem>
                                  <SelectItem value="cote-ivoire">Côte d'Ivoire</SelectItem>
                                  <SelectItem value="nigeria">Nigeria</SelectItem>
                                  <SelectItem value="kenya">Kenya</SelectItem>
                                  <SelectItem value="ethiopie">Éthiopie</SelectItem>
                                  <SelectItem value="ouganda">Ouganda</SelectItem>
                                  <SelectItem value="tanzanie">Tanzanie</SelectItem>
                                </SelectContent>
                              </Select>
                              </div>
                            )}
                          </div>

                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Sélectionner un organisme</Label>
                          <Select value={selectedOrganisme} onValueChange={setSelectedOrganisme}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Choisir un organisme..." />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedOrganismeType === "national" && (
                                <>
                                  <SelectItem value="ministere-enseignement">Ministère de l'Enseignement Supérieur</SelectItem>
                                  <SelectItem value="ministere-recherche">Ministère de la Recherche Scientifique</SelectItem>
                                  <SelectItem value="academie-sciences">Académie Royale des Sciences</SelectItem>
                                  <SelectItem value="universite-hassan">Université Hassan II</SelectItem>
                                  <SelectItem value="cnrst">Centre National de Recherche Scientifique et Technique</SelectItem>
                                  <SelectItem value="anr">Agence Nationale de Recherche</SelectItem>
                                  <SelectItem value="fondation-hassan">Fondation Hassan II pour la Recherche</SelectItem>
                                </>
                              )}
                              {selectedOrganismeType === "international" && (
                                <>
                                  <SelectItem value="organisation-innovation">Organisation Mondiale de l'Innovation</SelectItem>
                                  <SelectItem value="union-europeenne">Union Européenne</SelectItem>
                                  <SelectItem value="unesco">UNESCO</SelectItem>
                                  <SelectItem value="banque-mondiale">Banque Mondiale</SelectItem>
                                  <SelectItem value="onu">Organisation des Nations Unies</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {organismeType === "existant" && (
                          <div className="space-y-2">
                            <div className="flex justify-center">
                              <Button type="button" className="flex items-center gap-1 px-3 py-1.5 text-sm" onClick={handleAddOrganismeExistant}>
                                <Plus className="h-3 w-3" />
                                Ajouter l'organisme
                              </Button>
                      </div>

                            {/* Organismes sélectionnés */}
                            {addedOrganismes.length > 0 && (
                              <div className="space-y-1">
                                <Label className="text-sm font-medium">Organismes sélectionnés :</Label>
                                <div className="flex flex-wrap gap-1">
                                  {addedOrganismes.map((organisme, index) => (
                                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                      {organisme}
                                    </Badge>
                                  ))}
                          </div>
                          </div>
                            )}
                        </div>
                        )}
                      </div>
                    )}

                    {organismeType === "autre" && (
                          <div className="space-y-3">
                        {/* Message d'avertissement */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0">
                              <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                                      <div>
                              <h4 className="text-sm font-medium text-yellow-800">Validation requise</h4>
                              <p className="text-xs text-yellow-700 mt-1">
                                La création de ce nouvel organisme sera soumise à validation par la Division de la Recherche. Vous recevrez une notification une fois la validation effectuée.
                              </p>
                                      </div>
                                    </div>
                            </div>

                        {/* Champs en disposition horizontale */}
                        <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                            <Label className="text-sm font-medium">Type d'organisme</Label>
                            <Select value={autreOrganismeType} onValueChange={setAutreOrganismeType}>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Choisir un type..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="national">National</SelectItem>
                                <SelectItem value="international">International</SelectItem>
                              </SelectContent>
                            </Select>
                                </div>
                          {autreOrganismeType === "international" && (
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">Pays</Label>
                              <Select value={selectedPays} onValueChange={setSelectedPays}>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Sélectionner un pays..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="france">France</SelectItem>
                                  <SelectItem value="allemagne">Allemagne</SelectItem>
                                  <SelectItem value="espagne">Espagne</SelectItem>
                                  <SelectItem value="italie">Italie</SelectItem>
                                  <SelectItem value="royaume-uni">Royaume-Uni</SelectItem>
                                  <SelectItem value="pays-bas">Pays-Bas</SelectItem>
                                  <SelectItem value="belgique">Belgique</SelectItem>
                                  <SelectItem value="suisse">Suisse</SelectItem>
                                  <SelectItem value="autriche">Autriche</SelectItem>
                                  <SelectItem value="usa">États-Unis</SelectItem>
                                  <SelectItem value="canada">Canada</SelectItem>
                                  <SelectItem value="japon">Japon</SelectItem>
                                  <SelectItem value="chine">Chine</SelectItem>
                                  <SelectItem value="coree-sud">Corée du Sud</SelectItem>
                                  <SelectItem value="australie">Australie</SelectItem>
                                  <SelectItem value="nouvelle-zelande">Nouvelle-Zélande</SelectItem>
                                  <SelectItem value="bresil">Brésil</SelectItem>
                                  <SelectItem value="argentine">Argentine</SelectItem>
                                  <SelectItem value="chili">Chili</SelectItem>
                                  <SelectItem value="mexique">Mexique</SelectItem>
                                  <SelectItem value="afrique-sud">Afrique du Sud</SelectItem>
                                  <SelectItem value="egypte">Égypte</SelectItem>
                                  <SelectItem value="maroc">Maroc</SelectItem>
                                  <SelectItem value="tunisie">Tunisie</SelectItem>
                                  <SelectItem value="algerie">Algérie</SelectItem>
                                  <SelectItem value="senegal">Sénégal</SelectItem>
                                  <SelectItem value="cote-ivoire">Côte d'Ivoire</SelectItem>
                                  <SelectItem value="nigeria">Nigeria</SelectItem>
                                  <SelectItem value="kenya">Kenya</SelectItem>
                                  <SelectItem value="ethiopie">Éthiopie</SelectItem>
                                  <SelectItem value="ouganda">Ouganda</SelectItem>
                                  <SelectItem value="tanzanie">Tanzanie</SelectItem>
                                </SelectContent>
                              </Select>
                              </div>
                            )}
                              </div>
                              
                        {/* Nom de l'organisme */}
                                <div className="space-y-1">
                          <Label htmlFor="nom-organisme" className="text-sm font-medium">Nom de l'organisme</Label>
                          <Input
                            id="nom-organisme"
                            placeholder="Entrez le nom de l'organisme"
                            value={selectedOrganismeName}
                            onChange={(e) => setSelectedOrganismeName(e.target.value)}
                            className="w-full h-8"
                          />
                                      </div>

                        {/* Bouton Ajouter */}
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <Button type="button" className="flex items-center gap-1 px-3 py-1.5 text-sm" onClick={handleAddAutreOrganisme}>
                              <Plus className="h-3 w-3" />
                              Ajouter l'organisme
                                      </Button>
                                    </div>
                          
                          {/* Organismes sélectionnés */}
                          {addedOrganismes.length > 0 && (
                            <div className="space-y-1">
                              <Label className="text-sm font-medium">Organismes sélectionnés :</Label>
                              <div className="flex flex-wrap gap-1">
                                {addedOrganismes.map((organisme, index) => (
                                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                    {organisme}
                                  </Badge>
                                  ))}
                                </div>
                            </div>
                            )}
                        </div>
                          </div>
                        )}
                      </div>

                  {/* Date */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-4">
                      <div className="w-64">
                        <Label className={`text-sm font-medium ${formErrors.date ? 'text-red-600' : ''}`}>
                          Date <span className="text-red-500">*</span>
                        </Label>
                        <div className="mt-1">
                          {datePrecision === "precise" && (
                            <Input
                              type="date"
                              value={selectedDate}
                              onChange={(e) => {
                                setSelectedDate(e.target.value)
                                setFormData({ ...formData, date: e.target.value })
                                if (e.target.value) setFormErrors(prev => ({ ...prev, date: false }))
                              }}
                              placeholder="jj/mm/aaaa"
                              className={`w-full ${formErrors.date ? 'border-red-500 focus:border-red-500' : ''}`}
                            />
                          )}
                          {datePrecision === "month-year" && (
                            <Input
                              type="month"
                              value={selectedDate}
                              onChange={(e) => {
                                setSelectedDate(e.target.value)
                                setFormData({ ...formData, date: e.target.value })
                                if (e.target.value) setFormErrors(prev => ({ ...prev, date: false }))
                              }}
                              className={`w-full ${formErrors.date ? 'border-red-500 focus:border-red-500' : ''}`}
                            />
                          )}
                          {datePrecision === "year-only" && (
                            <Input
                              type="number"
                              value={selectedDate}
                              onChange={(e) => {
                                setSelectedDate(e.target.value)
                                setFormData({ ...formData, date: e.target.value })
                                if (e.target.value) setFormErrors(prev => ({ ...prev, date: false }))
                              }}
                              placeholder="2024"
                              min="1900"
                              max={new Date().getFullYear()}
                              className={`w-full ${formErrors.date ? 'border-red-500 focus:border-red-500' : ''}`}
                            />
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {datePrecision === "precise" && "Sélectionnez le jour exact de la distinction"}
                            {datePrecision === "month-year" && "Sélectionnez le mois et l'année"}
                            {datePrecision === "year-only" && "Sélectionnez l'année seulement"}
                          </p>
                          {formErrors.date && (
                            <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>
                          )}
                        </div>
                      </div>
                      <div className="w-48 flex-shrink-0">
                        <Label className="text-sm font-medium">Précision de la date</Label>
                        <div className="mt-1">
                          <Select value={datePrecision} onValueChange={(value) => {
                            setDatePrecision(value)
                            setSelectedDate("")
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Date précise" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="precise">Date précise</SelectItem>
                              <SelectItem value="month-year">Mois/Année</SelectItem>
                              <SelectItem value="year-only">Année seulement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lien et justificatifs */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="lien" className={`text-sm font-medium ${formErrors.lienJustificatif ? 'text-red-600' : ''}`}>
                        Lien vers la distinction 
                        {selectedFiles.length === 0 ? <span className="text-red-500">*</span> : <span className="text-gray-500"> (optionnel)</span>}
                      </Label>
                      <Input
                        id="lien"
                        type="url"
                        value={selectedLink}
                        onChange={(e) => {
                          setSelectedLink(e.target.value)
                          setFormData({ ...formData, lien: e.target.value })
                          if (e.target.value || selectedFiles.length > 0) setFormErrors(prev => ({ ...prev, lienJustificatif: false }))
                        }}
                        placeholder="https://example.com/distinction"
                        className={`w-full ${formErrors.lienJustificatif ? 'border-red-500 focus:border-red-500' : ''}`}
                      />
                      <p className="text-xs text-gray-500">Fournissez un lien OU un justificatif (au moins l'un des deux est requis)</p>
                      {formErrors.lienJustificatif && (
                        <p className="text-xs text-red-600 mt-1">Veuillez fournir soit un lien, soit un justificatif</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className={`text-sm font-medium ${formErrors.lienJustificatif ? 'text-red-600' : ''}`}>
                        Justificatifs
                        {selectedLink === "" ? <span className="text-red-500">*</span> : <span className="text-gray-500"> (optionnel)</span>}
                      </Label>
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center ${formErrors.lienJustificatif ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-1">Cliquez pour télécharger ou glissez-déposez</p>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX jusqu'à 10MB</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="justificatif-upload"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              console.log('Fichier sélectionné:', e.target.files[0].name)
                              setSelectedFiles(prev => {
                                const newFiles = [...prev, e.target.files![0]]
                                console.log('Nouveaux fichiers:', newFiles.length)
                                return newFiles
                              })
                              setFormData({ ...formData, justificatifs: [...formData.justificatifs, e.target.files![0]] })
                              if (selectedLink || e.target.files!.length > 0) setFormErrors(prev => ({ ...prev, lienJustificatif: false }))
                            }
                          }}
                        />
                            <Button
                              type="button"
                          variant="outline"
                              size="sm"
                          className="mt-2"
                          onClick={() => document.getElementById('justificatif-upload')?.click()}
                            >
                          Sélectionner un fichier
                            </Button>
                      </div>
                      
                      {/* Affichage des fichiers sélectionnés */}
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Fichiers sélectionnés : ({selectedFiles.length})</Label>
                          <div className="space-y-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{file.name}</span>
                                  <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </div>
                            <Button
                              type="button"
                                  variant="ghost"
                              size="sm"
                                  className="text-red-600 h-6 w-6 p-0"
                                  onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                            >
                                  <Trash2 className="h-3 w-3" />
                            </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedFiles.length > 0 && (
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            variant="ghost" 
                            size="sm"
                            className="text-blue-600"
                            onClick={() => document.getElementById('justificatif-upload')?.click()}
                          >
                            Ajouter un autre justificatif
                        </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                        >
                          Annuler
                        </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { 
                          intitule: false, 
                          evenement: false, 
                          organisme: false, 
                          date: false, 
                          lienJustificatif: false 
                        }
                        
                        if (!formData.intitule) errors.intitule = true
                        if (!formData.evenement) errors.evenement = true
                        if (!formData.organisme) errors.organisme = true
                        if (!formData.date) errors.date = true
                        if (!formData.lien && formData.justificatifs.length === 0) errors.lienJustificatif = true
                        
                        setFormErrors(errors)
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Distinction ajoutée", { 
                          typeProjet,
                          formData,
                          addedOrganismes,
                          membresAssocies
                        })
                        
                        // Reset form
                        setFormData({
                          intitule: "",
                          evenement: "",
                          organisme: "",
                          date: "",
                          lien: "",
                          justificatifs: []
                        })
                        setFormErrors({
                          intitule: false,
                          evenement: false,
                          organisme: false,
                          date: false,
                          lienJustificatif: false
                        })
                        setAddedOrganismes([])
                        setMembresAssocies([])
                        setIsDialogOpen(false)
                      }}
                    >
                      Ajouter la distinction
                    </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

            {/* Liste des distinctions */}
                <Card>
                    <CardHeader>
                <CardTitle>Liste des distinctions et prix</CardTitle>
                    </CardHeader>
                    <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                        <th className="text-left py-2 px-3 font-bold whitespace-nowrap text-gray-800">Intitulé</th>
                        <th className="text-center py-2 px-3 font-bold whitespace-nowrap text-gray-800">Type</th>
                        <th className="text-left py-2 px-3 font-bold whitespace-nowrap text-gray-800">Evènement</th>
                        <th className="text-left py-2 px-3 font-bold whitespace-nowrap text-gray-800">Organisme</th>
                        <th className="text-center py-2 px-3 font-bold whitespace-nowrap text-gray-800">Date</th>
                        <th className="text-center py-2 px-3 font-bold whitespace-nowrap text-gray-800">Justifs</th>
                        <th className="text-left py-2 px-3 font-bold whitespace-nowrap text-gray-800">Liens</th>
                        <th className="text-left py-2 px-3 font-bold whitespace-nowrap text-gray-800">Décision</th>
                        <th className="text-left py-2 px-3 font-bold whitespace-nowrap text-gray-800">Commentaire</th>
                        <th className="text-center py-2 px-3 font-bold whitespace-nowrap text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDistinctions.map((distinction) => (
                        <tr key={distinction.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-3 whitespace-nowrap">
                            {distinction.intitule}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap text-center">
                          <Badge
                              variant={distinction.typeProjet === "individuel" ? "secondary" : "default"}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1"
                            >
                            {distinction.typeProjet === "individuel" ? "Individuel" : "Collectif"}
                          </Badge>
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            {distinction.evenement}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            {distinction.organisme}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap text-center">
                            {formatDateForDisplay(distinction.date, distinction.dateType)}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap text-center">
                            <div className="flex items-center gap-1 justify-center">
                              <Upload className="h-3 w-3 flex-shrink-0" />
                              <span>{distinction.justificatifs}</span>
                        </div>
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            {distinction.lien && (
                              <div className="flex items-center gap-1">
                                <LinkIcon className="h-3 w-3 flex-shrink-0" />
                                <span>Lien</span>
                          </div>
                        )}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            <span>{distinction.decision}</span>
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap">
                            <span className="text-gray-600">{distinction.commentaireExpert}</span>
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap text-center">
                            <div className="flex gap-1 justify-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleViewDetails(distinction)}
                                title="Voir détails"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                      </div>
                    </CardContent>
                  </Card>
          </div>
        </main>
      </div>

      {/* Modal de détails de la distinction */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-b-lg p-3 mb-3 shadow-sm">
            <DialogTitle className="text-base font-bold text-uh2c-blue text-center">
              Détails de la distinction
            </DialogTitle>
            <DialogDescription className="text-gray-700 text-xs text-center mt-1">
              Informations complètes de la distinction ou prix
            </DialogDescription>
          </DialogHeader>

          {selectedDistinction && (
            <div className="space-y-6">
              {/* Informations principales */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">Intitulé de la distinction</label>
                      <p className="text-gray-900 font-medium text-sm leading-relaxed">{selectedDistinction.intitule}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Type de projet</label>
                        <Badge variant="outline" className="text-xs">
                          {selectedDistinction.typeProjet === "individuel" ? "Individuel" : "Collectif"}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 mb-1 block">Évènement</label>
                        <p className="text-gray-900 text-sm">{selectedDistinction.evenement || "Non spécifié"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organisme et date */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center">
                    <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full mr-2"></div>
                    Informations institutionnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Organisme</label>
                      <p className="text-gray-900 text-xs">
                        {selectedDistinction.organisme || "Non spécifié"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Date de distinction</label>
                      <p className="text-gray-900 text-xs font-medium">
                        {formatDateForDisplay(selectedDistinction.date, selectedDistinction.dateType)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Membres du projet */}
                {selectedDistinction.typeProjet === "collectif" && selectedDistinction.membres && selectedDistinction.membres.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center">
                      <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full mr-2"></div>
                      Membres du projet
                    </h3>
                    <div className="space-y-2">
                      {selectedDistinction.membres.map((membreId, index) => {
                        const membre = {
                          "1": "Dr. Ahmed Benali",
                          "2": "Dr. Fatima Zahra", 
                          "3": "Dr. Mohamed Alami"
                        }[membreId]
                        return (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{membre || `Membre ${membreId}`}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Membres externes */}
                {selectedDistinction.membresExternes && selectedDistinction.membresExternes.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center">
                      <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full mr-2"></div>
                      Membres externes
                    </h3>
                    <div className="space-y-2">
                      {selectedDistinction.membresExternes.map((membre, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700 font-medium">{membre.prenom} {membre.nom}</span>
                            <span className="text-xs text-gray-500">({membre.titre})</span>
                          </div>
                          <span className="text-xs text-gray-600">{membre.etablissement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Décision et commentaire */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Décision</label>
                      <div className="text-gray-900">
                        {selectedDistinction.decision ? (
                          <Badge variant="outline" className="text-sm bg-green-50 border-green-200 text-green-800 font-medium">
                            {selectedDistinction.decision}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Non définie</span>
                        )}
                      </div>
                    </div>
                    
                    {selectedDistinction.commentaireExpert && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Commentaire de l'expert</label>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {selectedDistinction.commentaireExpert}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Liens et justificatifs */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center">
                    <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full mr-2"></div>
                    Ressources et documents
                  </h3>
                  <div className="space-y-3">
                    {selectedDistinction.lien && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Lien vers la distinction</span>
                        </div>
                        <a 
                          href={selectedDistinction.lien} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center px-3 py-1.5 bg-uh2c-blue text-white text-xs font-medium rounded-md hover:bg-uh2c-blue/90 transition-colors"
                        >
                          Ouvrir le lien
                          <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                    {selectedDistinction.justificatifs && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Upload className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Justificatif</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            Disponible
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-3 text-xs border-uh2c-blue text-uh2c-blue hover:bg-uh2c-blue/10"
                          >
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    )}
                    {!selectedDistinction.lien && !selectedDistinction.justificatifs && (
                      <div className="text-center py-4 text-gray-500">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Aucune ressource disponible</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 