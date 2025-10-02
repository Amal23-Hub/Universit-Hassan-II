"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { RefreshCw, Check, X, Eye, Search, ExternalLink, BookOpen, Plus, Edit, FileText, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Member {
  id: string
  name: string
  scopusId: string
  role: string
}

interface Publication {
  id: string
  title: string
  authors: string
  year: number
  date?: string
  source: "Scopus" | "WOS" | "ORCID" | "DOI"
  status: "pending" | "validated" | "rejected"
  category: string
  mode: string
  memberId: string
  doi?: string
  orcid?: string
  journal?: string
  citations?: number
  abstract?: string
  scopusUrl?: string
  wosUrl?: string
  orcidUrl?: string
  doiUrl?: string
  detectedAffiliation?: string
  tranche?: string
}

export default function PublicationsPage() {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [addManualDialogOpen, setAddManualDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterYear, setFilterYear] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [filterMode, setFilterMode] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("")
  const [searchGlobal, setSearchGlobal] = useState("")
  const [selectedMemberId, setSelectedMemberId] = useState<string>("member1")
  const [lienJustificatifError, setLienJustificatifError] = useState("")
  const [yearError, setYearError] = useState("")
  const [manualFormData, setManualFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [indexeeErrors, setIndexeeErrors] = useState({
    titre: false,
    journal: false,
    issn: false,
    base: false,
    annee: false
  })
  const [indexeeValues, setIndexeeValues] = useState({
    titre: '',
    journal: '',
    issn: '',
    base: '',
    annee: ''
  })
  const [ouvrageErrors, setOuvrageErrors] = useState({
    intitule: false,
    maisonEdition: false,
    annee: false
  })
  const [ouvrageValues, setOuvrageValues] = useState({
    intitule: '',
    maisonEdition: '',
    annee: ''
  })
  const [ouvrageFormData, setOuvrageFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [ouvrageLienJustificatifError, setOuvrageLienJustificatifError] = useState("")
  const [brevetErrors, setBrevetErrors] = useState({
    intitule: false,
    type: false,
    champApplication: false,
    numeroDepot: false,
    dateDepot: false
  })
  const [brevetValues, setBrevetValues] = useState({
    intitule: '',
    type: '',
    champApplication: '',
    numeroDepot: '',
    dateDepot: '',
    numeroEnregistrement: '',
    partenaires: ''
  })
  const [brevetFormData, setBrevetFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [brevetLienJustificatifError, setBrevetLienJustificatifError] = useState("")
  const [revueErrors, setRevueErrors] = useState({
    intitule: false,
    type: false,
    champApplication: false,
    numeroDepot: false,
    dateDepot: false
  })
  const [revueValues, setRevueValues] = useState({
    intitule: '',
    type: '',
    champApplication: '',
    numeroDepot: '',
    dateDepot: '',
    numeroEnregistrement: '',
    partenaires: ''
  })
  const [revueFormData, setRevueFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [revueLienJustificatifError, setRevueLienJustificatifError] = useState("")
  const [distinctionErrors, setDistinctionErrors] = useState({
    intitule: false,
    date: false
  })
  const [distinctionValues, setDistinctionValues] = useState({
    intitule: '',
    evenement: '',
    organisme: '',
    date: ''
  })
  const [distinctionFormData, setDistinctionFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [distinctionLienJustificatifError, setDistinctionLienJustificatifError] = useState("")
  const [chapitreErrors, setChapitreErrors] = useState({
    intituleChapitre: false,
    intituleOuvrage: false,
    maisonEdition: false,
    annee: false
  })
  const [chapitreValues, setChapitreValues] = useState({
    intituleChapitre: '',
    numeroChapitre: '',
    pageDe: '',
    pageA: '',
    intituleOuvrage: '',
    maisonEdition: '',
    annee: '',
    issn: '',
    isbn: ''
  })
  const [chapitreFormData, setChapitreFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [chapitreLienJustificatifError, setChapitreLienJustificatifError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    year: new Date().getFullYear(),
    journal: "",
    doi: "",
    orcid: "",
    source: "",
    abstract: "",
    lien: "",
    justificatifs: [] as File[],
    tranche: ""
  })
  const [genericErrors, setGenericErrors] = useState({
    title: false,
    authors: false,
    year: false,
    source: false,
    tranche: false
  })
  const [commErrors, setCommErrors] = useState({
    intitule: false,
    manifestation: false,
    jour: false,
    mois: false,
    annee: false,
    ville: false,
    base: false,
    pays: false,
    justificatif: false
  })
  const [commValues, setCommValues] = useState({
    intitule: '',
    manifestation: '',
    jour: '',
    mois: '',
    annee: '',
    ville: '',
    base: '',
    pays: ''
  })
  const [commFormData, setCommFormData] = useState({
    lien: "",
    justificatif: null as File | null
  })
  const [commLienJustificatifError, setCommLienJustificatifError] = useState("")

  // Données des membres
  const [members, setMembers] = useState<Member[]>([
    {
      id: "member1",
      name: "Prof. Mohamed Lahby",
      scopusId: "57123456789",
      role: "Enseignant chercheur"
    }
  ])

  const [publications, setPublications] = useState<Publication[]>([
    {
      id: "1",
      title: "Deep Learning in Oncology",
      authors: "F. EL HASSANI, J. Smith",
      year: 2024,
      date: "2024-03-15",
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      doi: "10.1234/abcd.2024.001",
      journal: "Iran Medicine",
      citations: 12,
      abstract:
        "This paper presents a comprehensive study on the application of deep learning techniques in oncology...",
      scopusUrl: "https://scopus.com/record/123",
      detectedAffiliation: "Université Hassan II Casablanca",
      category: "Publications",
      mode: "Automatique",
      tranche: "Tranche A"
    },
    {
      id: "2",
      title: "NLP for Arabic Documents",
      authors: "F. EL HASSANI, A. BENALI, M. ALAMI",
      year: 2023,
      date: "2023-11-22",
      source: "WOS",
      status: "validated",
      memberId: "member1",
      doi: "10.5678/efgh.2023.002",
      journal: "Computational Linguistics",
      citations: 8,
      abstract:
        "Natural Language Processing techniques applied to Arabic document analysis...",
      wosUrl: "https://wos.com/record/456",
      detectedAffiliation: "Université Hassan II Casablanca",
      category: "Publications",
      mode: "Automatique",
      tranche: "Tranche B"
    },
    {
      id: "3",
      title: "Smart Cities and Sustainability",
      authors: "F. EL HASSANI, M. LAHBY, S. HASSAN",
      year: 2023,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      doi: "10.9012/ijkl.2023.003",
      journal: "Sustainable Cities Journal",
      citations: 15,
      abstract: "An analysis of smart city initiatives and their impact on sustainability...",
      scopusUrl: "https://scopus.com/record/789",
      detectedAffiliation: "Université Hassan II Casablanca",
      category: "Ouvrages",
      mode: "Manuel",
      tranche: "Tranche C"
    },
    // Exemples supplémentaires pour tester la pagination
    {
      id: "4",
      title: "Blockchain for Secure Transactions",
      authors: "F. EL HASSANI, A. YOUSSEF, L. KHALID",
      year: 2022,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Publications",
      mode: "Automatique",
      tranche: "Tranche B"
    },
    {
      id: "5",
      title: "Quantum Computing: A New Era",
      authors: "F. EL HASSANI, S. AMINE, F. ZAHRA",
      year: 2021,
      source: "Scopus",
      status: "validated",
      memberId: "member1",
      category: "Ouvrages",
      mode: "Manuel",
      tranche: "Tranche A"
    },
    {
      id: "6",
      title: "Edge AI for IoT Devices",
      authors: "F. EL HASSANI, M. BOUZID, H. EL MANSOURI",
      year: 2020,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Communications",
      mode: "Automatique",
      tranche: "Tranche B"
    },
    {
      id: "7",
      title: "Cybersecurity Trends in 2024",
      authors: "F. EL HASSANI, A. BENJELLOUN, K. LAMRANI",
      year: 2024,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Publications",
      mode: "Automatique",
      tranche: "Tranche A"
    },
    {
      id: "8",
      title: "Big Data Analytics for Healthcare",
      authors: "F. EL HASSANI, N. EL FASSI, R. BOUZIANE",
      year: 2023,
      source: "WOS",
      status: "validated",
      memberId: "member1",
      category: "Ouvrages",
      mode: "Manuel",
      tranche: "Tranche C"
    },
    {
      id: "9",
      title: "AI Ethics and Society",
      authors: "F. EL HASSANI, S. EL HARTI, M. CHAKIR",
      year: 2022,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Communications",
      mode: "Automatique",
      tranche: "Tranche B"
    },
    {
      id: "10",
      title: "Natural Language Generation",
      authors: "F. EL HASSANI, A. EL MANSOURI, F. BENSAID",
      year: 2021,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Publications",
      mode: "Automatique",
      tranche: "Tranche C"
    },
    {
      id: "11",
      title: "Smart Grids and Renewable Energy",
      authors: "F. EL HASSANI, M. EL KADIRI, S. BERRADA",
      year: 2020,
      source: "Scopus",
      status: "validated",
      memberId: "member1",
      category: "Ouvrages",
      mode: "Manuel",
      tranche: "Tranche A"
    },
    {
      id: "12",
      title: "Data Mining in Social Networks",
      authors: "F. EL HASSANI, H. EL AMRANI, L. BOUZID",
      year: 2023,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Communications",
      mode: "Automatique",
      tranche: "Tranche D"
    },
    {
      id: "13",
      title: "Machine Learning for Finance",
      authors: "F. EL HASSANI, A. EL BAKKALI, K. EL YOUSFI",
      year: 2022,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Publications",
      mode: "Automatique",
      tranche: "Tranche B"
    },
    {
      id: "14",
      title: "Cloud Computing Security",
      authors: "F. EL HASSANI, S. EL HASSANI, M. BENALI",
      year: 2021,
      source: "WOS",
      status: "validated",
      memberId: "member1",
      category: "Ouvrages",
      mode: "Manuel",
      tranche: "Tranche C"
    },
    {
      id: "15",
      title: "Prix d'Excellence en Recherche 2024",
      authors: "F. EL HASSANI",
      year: 2024,
      source: "Scopus",
      status: "validated",
      memberId: "member1",
      category: "Distinctions et Prix",
      mode: "Manuel",
      tranche: "Non classée"
    },
    {
      id: "16",
      title: "Distinction Honorifique - Académie des Sciences",
      authors: "F. EL HASSANI",
      year: 2023,
      source: "WOS",
      status: "pending",
      memberId: "member1",
      category: "Distinctions et Prix",
      mode: "Manuel",
      tranche: "Non classée"
    },
    {
      id: "17",
      title: "Médaille d'Or pour l'Innovation Technologique",
      authors: "F. EL HASSANI",
      year: 2022,
      source: "Scopus",
      status: "validated",
      memberId: "member1",
      category: "Distinctions et Prix",
      mode: "Automatique",
      tranche: "Non classée"
    },
    {
      id: "19",
      title: "État de l'art sur l'Intelligence Artificielle en 2024",
      authors: "F. EL HASSANI, A. BENNANI, M. EL KADIRI",
      year: 2024,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Revue bibliographique",
      mode: "Manuel",
      tranche: "Tranche A"
    },
    {
      id: "20",
      title: "Revue systématique des méthodes de Deep Learning",
      authors: "F. EL HASSANI, S. EL HARTI, L. BOUZID",
      year: 2023,
      source: "WOS",
      status: "validated",
      memberId: "member1",
      category: "Revue bibliographique",
      mode: "Automatique",
      tranche: "Tranche B"
    },
    {
      id: "21",
      title: "Analyse bibliométrique des publications en cybersécurité",
      authors: "F. EL HASSANI, N. EL FASSI, R. BOUZIANE",
      year: 2022,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Revue bibliographique",
      mode: "Manuel",
      tranche: "Tranche C"
    },
    {
      id: "18",
      title: "Robotics in Industry 4.0",
      authors: "F. EL HASSANI, N. EL MOUTAWAKIL, F. EL HASSANI",
      year: 2020,
      source: "Scopus",
      status: "pending",
      memberId: "member1",
      category: "Communications",
      mode: "Automatique",
      tranche: "Tranche D"
    },
  ])

  const handleValidatePublication = (pub: Publication) => {
    setPublications(publications.map((p) => (p.id === pub.id ? { ...p, status: "validated" as const } : p)))
    setDetailDialogOpen(false)
  }

  const handleRejectPublication = (pub: Publication) => {
    setPublications(publications.map((p) => (p.id === pub.id ? { ...p, status: "rejected" as const } : p)))
    setDetailDialogOpen(false)
  }

  const handleViewDetails = (pub: Publication) => {
    setSelectedPublication(pub)
    setDetailDialogOpen(true)
  }

  const handleAddManual = () => {
    setAddManualDialogOpen(true)
  }

  const handleAddAuto = () => {
    console.log("Ajouter automatiquement")
    // Logique pour ajouter automatiquement
  }

  // Obtenir l'année actuelle pour limiter la sélection
  const getCurrentYear = () => new Date().getFullYear()

  const getSelectedMember = () => {
    return members.find(m => m.id === selectedMemberId) || members[0]
  }

  const getStatusBadge = (status: Publication["status"]) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-green-100 text-green-800">Validée</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-800">À valider</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejetée</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  const getSourceBadge = (source: Publication["source"]) => {
    return source === "Scopus" ? (
      <Badge className="bg-orange-100 text-orange-800">Scopus</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">WOS</Badge>
    )
  }

  const filteredPublications = publications.filter((pub) => {
    const matchesMember = pub.memberId === selectedMemberId;
    const matchesYear = filterYear === "all" || pub.year.toString() === filterYear;
    const matchesCategory = filterCategory === "all" || pub.category === filterCategory;
    const matchesSource = filterSource === "all" || pub.source === filterSource;
    const matchesMode = filterMode === "all" || pub.mode === filterMode;
    return matchesMember && matchesYear && matchesCategory && matchesSource && matchesMode;
  }).sort((a, b) => {
    // Trier par mode : Automatique en premier, Manuel à la fin
    if (a.mode === "Automatique" && b.mode === "Manuel") return -1;
    if (a.mode === "Manuel" && b.mode === "Automatique") return 1;
    
    // Si même mode, trier par année décroissante
    if (a.year !== b.year) return b.year - a.year;
    
    // Si même année, trier par titre alphabétiquement
    return a.title.localeCompare(b.title);
  });

  const validatedCount = publications.filter((p) => p.status === "validated").length
  const proposedCount = publications.filter((p) => p.status === "pending").length

  // Ajout de la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage);
  const paginatedPublications = filteredPublications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3">
          <div className="w-full max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div className="flex-1">
                  <div className="flex items-center">
                    <h1 className="text-lg font-bold text-gray-800 mr-2">Publications scientifiques :</h1>
                    <h2 className="text-lg font-semibold text-gray-600">
                      Prof. Mohamed Lahby
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Gestion des Productions Scientifiques</p>
                </div>
              <Button onClick={handleAddManual} className="bg-uh2c-blue hover:bg-uh2c-blue/90 h-10">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter manuel
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
                    placeholder="Rechercher une publication..."
                    value={searchGlobal}
                    onChange={(e) => setSearchGlobal(e.target.value)}
                    className="pl-10 h-10 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                  />
                </div>

                {/* Filtres en grille */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Date</Label>
                    <Select value={filterYear} onValueChange={setFilterYear}>
                      <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Toutes les dates" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les dates</SelectItem>
                        {[...new Set(publications.map((p) => p.year))].sort((a, b) => b - a).map((year) => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Catégorie</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Toutes les catégories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem value="Brevets et droits">Brevets et droits</SelectItem>
                        <SelectItem value="Chapitre">Chapitre</SelectItem>
                        {[...new Set(publications.map((p) => p.category))].map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Mode</Label>
                    <Select value={filterMode} onValueChange={setFilterMode}>
                      <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les modes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les modes</SelectItem>
                        {[...new Set(publications.map((p) => p.mode))].map((mode) => (
                          <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Source</Label>
                    <Select value={filterSource} onValueChange={setFilterSource}>
                      <SelectTrigger className="h-9 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Toutes les sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les sources</SelectItem>
                        <SelectItem value="Scopus">Scopus</SelectItem>
                        <SelectItem value="WOS">WOS</SelectItem>
                        <SelectItem value="ORCID">ORCID</SelectItem>
                        <SelectItem value="DOI">DOI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publications Table */}
            <Card className="mb-3">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <tr>
                        <th className="text-center py-1.5 px-2 font-bold text-gray-900 w-12">#</th>
                        <th className="text-left py-1.5 px-2 font-bold text-gray-900">Titre</th>
                        <th className="text-left py-1.5 px-2 font-bold text-gray-900">Date</th>
                        <th className="text-center py-1.5 px-2 font-bold text-gray-900">Catégorie</th>
                        <th className="text-center py-1.5 px-2 font-bold text-gray-900">Mode</th>
                        <th className="text-center py-1.5 px-2 font-bold text-gray-900">Source</th>
                        <th className="text-center py-1.5 px-2 font-bold text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPublications.map((pub, index) => (
                        <tr key={pub.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="py-1.5 px-2 text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </span>
                          </td>
                          <td className="py-1.5 px-2 max-w-sm">
                            <div className="font-medium text-gray-900 truncate" title={pub.title}>
                              {pub.title}
                            </div>
                            <div className="text-xs text-gray-500 truncate" title={pub.authors}>
                              {pub.authors}
                            </div>
                          </td>
                          <td className="py-1.5 px-2 text-gray-700">{pub.date || `${pub.year}-01-15`}</td>
                          <td className="py-1.5 px-2 text-center">
                            <Badge variant="outline" className="text-xs">
                              {pub.category}
                            </Badge>
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            <span className="text-xs text-gray-600">{pub.mode}</span>
                          </td>
                          <td className="py-1.5 px-2 text-center">
                            {pub.source === "Scopus" ? (
                              <a 
                                href={pub.scopusUrl || "https://www.scopus.com"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                              >
                                Scopus
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            ) : pub.source === "WOS" ? (
                              <a 
                                href={pub.wosUrl || "https://www.webofscience.com"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                              >
                                WOS
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            ) : pub.source === "ORCID" ? (
                              <a 
                                href={pub.orcidUrl || "https://orcid.org"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                              >
                                ORCID
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            ) : pub.source === "DOI" ? (
                              <a 
                                href={pub.doiUrl || `https://doi.org/${pub.doi}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                              >
                                DOI
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            ) : (
                              <a 
                                href="#" 
                                className="inline-flex items-center text-blue-600 underline hover:text-blue-800 text-xs"
                                onClick={(e) => e.preventDefault()}
                              >
                                {pub.source}
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            )}
                          </td>
                          <td className="py-1.5 px-2">
                            <div className="flex justify-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(pub)}
                                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                title="Voir détails"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            
                              {pub.mode === "Manuel" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleValidatePublication(pub)}
                                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    title="Valider"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRejectPublication(pub)}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    title="Rejeter"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 my-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Page précédente"
                      >
                        &lt;
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i + 1}
                          variant={currentPage === i + 1 ? "default" : "ghost"}
                          size="icon"
                          className={`rounded-full ${currentPage === i + 1 ? 'bg-uh2c-blue text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                          onClick={() => setCurrentPage(i + 1)}
                          aria-label={`Page ${i + 1}`}
                        >
                          {i + 1}
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full border border-gray-300 text-gray-500 hover:bg-gray-100"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        aria-label="Page suivante"
                      >
                        &gt;
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add Manual Button */}
            {/* 
            <div className="flex justify-center mt-6">
              <Button 
                onClick={handleAddManual}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter manuel
              </Button>
            </div>
            */}

            {/* My Publications Section - Commented out */}
            {/* 
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  MES PUBLICATIONS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Rechercher dans Scopus / WOS" className="pl-10" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Publications validées ({validatedCount})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium">Publications proposées ({proposedCount})</span>
                  </div>
                  <Button variant="ghost" className="flex items-center space-x-2 text-sm p-0 h-auto">
                    <Plus className="h-4 w-4" />
                    <span>Ajouter manuellement</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
            */}
          </div>
        </main>
      </div>

      {/* Publication Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-b-lg p-3 mb-3 shadow-sm">
            <DialogTitle className="text-base font-bold text-uh2c-blue text-center">
              Détails de la publication
            </DialogTitle>
            <DialogDescription className="text-gray-700 text-xs text-center mt-1">
              Gérer les informations de la publication
            </DialogDescription>
          </DialogHeader>

          {selectedPublication && (
            <div className="space-y-6">
              {/* Publication Details */}
              <div className="space-y-4">
                {/* Titre et Auteurs - Section principale */}
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">Titre de la publication</label>
                      <p className="text-gray-900 font-medium text-sm leading-relaxed">{selectedPublication.title}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-gray-700 mb-1 block">Auteurs</label>
                      <p className="text-gray-900 text-sm">{selectedPublication.authors}</p>
                    </div>
                  </div>
                </div>

                {/* Informations spécifiques selon le type de publication */}
                {selectedPublication.category === "Publications" && selectedPublication.subCategory === "Publication dans une revue indexée" ? (
                  <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center">
                      <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full mr-2"></div>
                      Détails de la publication avec revue indexée
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Libellé de la Revue/Journal <span className="text-red-600">*</span></label>
                        <p className="text-gray-900 text-xs">
                          {selectedPublication.journal || (
                            <span className="text-gray-400 italic">Non spécifié</span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">ISSN de la Revue/Journal <span className="text-red-600">*</span></label>
                        <p className="text-gray-900 font-mono text-xs">
                          {selectedPublication.issn || (
                            <span className="text-gray-400 italic">Non spécifié</span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Base d'indexation <span className="text-red-600">*</span></label>
                        <p className="text-gray-900 text-xs">
                          {selectedPublication.base || (
                            <span className="text-gray-400 italic">Non spécifié</span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Année de publication <span className="text-red-600">*</span></label>
                        <p className="text-gray-900 text-xs font-medium">
                          {selectedPublication.date ? selectedPublication.date : selectedPublication.year || (
                            <span className="text-gray-400 italic">Non spécifié</span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 md:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Lien vers la revue <span className="text-red-600">*</span></label>
                        <p className="text-gray-900 text-xs">
                          {selectedPublication.lien ? (
                            <a href={selectedPublication.lien} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedPublication.lien}</a>
                          ) : (
                            <span className="text-gray-400 italic">Non fourni</span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100 md:col-span-2">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Justificatifs <span className="text-red-600">*</span> <span className='text-[10px] text-gray-500'>(Scan du justificatif au format PDF)</span></label>
                        <p className="text-gray-900 text-xs">
                          {selectedPublication.justificatifUrl ? (
                            <a href={selectedPublication.justificatifUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir le justificatif (PDF)</a>
                          ) : (
                            <span className="text-gray-400 italic">Non fourni</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center">
                    <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full mr-2"></div>
                    Informations techniques
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">DOI</label>
                      <p className="text-gray-900 font-mono text-xs">
                        {selectedPublication.doi || (
                          <span className="text-gray-400 italic">Non spécifié</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Journal</label>
                      <p className="text-gray-900 text-xs">
                        {selectedPublication.journal || (
                          <span className="text-gray-400 italic">Non spécifié</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Date de publication</label>
                      <p className="text-gray-900 text-xs font-medium">
                        {selectedPublication.date ? selectedPublication.date : `${selectedPublication.year}-01-01`}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Citations</label>
                      <div className="flex items-center space-x-2">
                        {selectedPublication.citations ? (
                          <>
                            <span className="text-gray-900 text-xs font-medium">{selectedPublication.citations}</span>
                            <span className="text-gray-600 text-xs">fois</span>
                          </>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Aucune citation</span>
                        )}
                        <span className="text-gray-500 text-xs bg-white px-1.5 py-0.5 rounded border">
                          {selectedPublication.source}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Tranche et Résumé */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Tranche</label>
                      <div className="text-gray-900">
                        {selectedPublication.tranche ? (
                          <Badge variant="outline" className="text-sm bg-yellow-50 border-yellow-200 text-yellow-800 font-medium">
                            {selectedPublication.tranche}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Non définie</span>
                        )}
                      </div>
                    </div>
                    
                    {selectedPublication.abstract && (
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Résumé</label>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {selectedPublication.abstract}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Association et Affiliation */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Associer à un projet</label>
                      <Select>
                        <SelectTrigger className="w-full mt-1 bg-white border-gray-200">
                          <SelectValue placeholder="🔗 Sélectionner un projet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project1">Projet X - IA pour la santé</SelectItem>
                          <SelectItem value="project2">Projet Y - Cybersécurité</SelectItem>
                          <SelectItem value="project3">Projet Z - Énergies renouvelables</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">Affiliation détectée</label>
                      <p className="text-gray-900 text-sm">
                        {selectedPublication.detectedAffiliation || (
                          <span className="text-gray-400 italic">Aucune affiliation détectée</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* External Links */}
                <div className="flex space-x-2">
                  {selectedPublication.scopusUrl && (
                    <a href={selectedPublication.scopusUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 underline hover:text-blue-800">
                      Voir sur Scopus
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                  {selectedPublication.wosUrl && (
                    <a href={selectedPublication.wosUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 underline hover:text-blue-800">
                      Voir sur WOS
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                  Fermer
                </Button>
                {selectedPublication.status === "pending" && (
                  <Button
                    onClick={() => handleValidatePublication(selectedPublication)}
                    className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Valider cette publication
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Manual Publication Dialog */}
      <Dialog open={addManualDialogOpen} onOpenChange={setAddManualDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
            </DialogTitle>
          </DialogHeader>

          {!selectedCategory ? (
            // Step 1: Select Category
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-uh2c-blue/10 to-uh2c-blue/5 border-l-4 border-uh2c-blue rounded-lg p-4 mb-4 shadow-sm">
                  <h3 className="text-uh2c-blue font-bold text-lg mb-2">Publication Manuelle</h3>
                  <p className="text-gray-700 text-sm">Veuillez d'abord sélectionner le type de publication à ajouter :</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Publications")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Publications</span>
                    <span className="text-sm text-gray-500">Articles scientifiques, revues, etc.</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Communications")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Communications</span>
                    <span className="text-sm text-gray-500">Présentations en conférences, colloques</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Ouvrages")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Ouvrages</span>
                    <span className="text-sm text-gray-500">Livres, monographies</span>
                  </div>
                </Button>
                

                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Brevets et droits")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Brevets et droits</span>
                    <span className="text-sm text-gray-500">Brevets, propriété intellectuelle</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Chapitre")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Chapitre</span>
                    <span className="text-sm text-gray-500">Chapitres d'ouvrages, contributions</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Distinctions et Prix")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Distinctions et Prix</span>
                    <span className="text-sm text-gray-500">Prix, distinctions, médailles, récompenses</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setSelectedCategory("Revue bibliographique")}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-900">Revue bibliographique</span>
                    <span className="text-sm text-gray-500">États de l'art, revues systématiques, analyses bibliométriques</span>
                  </div>
                </Button>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setAddManualDialogOpen(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (selectedCategory === "Publications" || selectedCategory === "Communications") && !selectedSubCategory ? (
            // Step 1.5: Select Sub-Category
            <div className="space-y-6">
              <div className="text-center mb-4">
                <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                  <h3 className="text-base font-semibold text-uh2c-blue mb-1">
                    {selectedCategory === "Publications" 
                      ? "Type de publication"
                      : "Type de communication"
                    }
                  </h3>
                  <p className="text-xs text-gray-600">
                    {selectedCategory === "Publications" 
                      ? "Sélectionnez le type de publication que vous souhaitez ajouter :"
                      : "Sélectionnez le type de communication que vous souhaitez ajouter :"
                    }
                  </p>
                </div>
              </div>
              
              {selectedCategory === "Publications" ? (
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => setSelectedSubCategory("Publication dans une revue indexée")}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">Publication dans une revue indexée</span>
                      <span className="text-sm text-gray-500">Articles publiés dans des revues indexées (Scopus, WOS, etc.)</span>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => setSelectedSubCategory("Publication dans une revue avec comité de lecture")}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">Publication dans une revue avec comité de lecture</span>
                      <span className="text-sm text-gray-500">Articles avec processus de révision par les pairs</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => setSelectedSubCategory("Communication nationale")}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">Communication nationale</span>
                      <span className="text-sm text-gray-500">Présentations dans des conférences nationales</span>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-16 text-left justify-start p-4 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => setSelectedSubCategory("Communication internationale")}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900">Communication internationale</span>
                      <span className="text-sm text-gray-500">Présentations dans des conférences internationales</span>
                    </div>
                  </Button>
                </div>
              )}

              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedCategory("")}
                  className="flex items-center"
                >
                  ← Retour
                </Button>
                <Button variant="outline" onClick={() => {
                  setAddManualDialogOpen(false)
                  setSelectedCategory("")
                  setSelectedSubCategory("")
                }}>
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            // Step 2: Fill Publication Details
            <div className="space-y-4">
              <div className="mb-4">
                {/* En-tête principal */}
                <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (selectedCategory === "Publications" || selectedCategory === "Communications") {
                            setSelectedSubCategory("")
                          } else {
                            setSelectedCategory("")
                          }
                        }}
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 hover:bg-white/80 px-2 py-1 rounded-lg transition-all duration-200 border border-gray-200 bg-white/50"
                      >
                        <ChevronLeft className="h-3 w-3" />
                        <span className="text-xs font-medium">Retour</span>
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full shadow-sm"></div>
                          <span className="text-sm font-semibold text-gray-800">
                            Nouvelle publication
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-600">
                            Type :
                          </span>
                          <div className="flex items-center space-x-1">
                            <Badge className="bg-uh2c-blue text-white font-semibold px-2 py-0.5 text-xs shadow-sm">
                              {selectedCategory}
                            </Badge>
                            {(selectedCategory === "Publications" || selectedCategory === "Communications") && selectedSubCategory && (
                              <>
                                <span className="text-gray-300 text-sm font-light">→</span>
                                <Badge variant="outline" className="border-gray-300 text-gray-700 font-medium px-2 py-0.5 text-xs bg-white/80">
                                  {selectedSubCategory}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    

                  </div>
                </div>
                
                {/* Section d'instructions */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full"></div>
                    <span className="text-sm text-gray-600 font-medium">
                      {(selectedCategory === "Publications" || selectedCategory === "Communications") 
                        ? `Remplissez les informations détaillées pour votre ${selectedSubCategory?.toLowerCase()}`
                        : `Remplissez les informations détaillées pour votre ${selectedCategory?.toLowerCase()}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {(selectedSubCategory === "Publication dans une revue indexée" || selectedSubCategory === "Publication dans une revue avec comité de lecture") ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="titre-indexee">
                      Intitulé de la publication <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="titre-indexee" 
                      required 
                      placeholder="Titre de la publication" 
                      className={`h-11 rounded-lg text-base ${indexeeErrors.titre ? 'border-red-500' : ''}`}
                      value={indexeeValues.titre}
                      onChange={(e) => {
                        setIndexeeValues(v => ({ ...v, titre: e.target.value }))
                        if (e.target.value) setIndexeeErrors(err => ({ ...err, titre: false }))
                      }}
                    />
                    {indexeeErrors.titre && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="journal-indexee">
                      Libellé de la Revue/Journal <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="journal-indexee" 
                      required 
                      placeholder="Nom de la revue/journal" 
                      className={`h-11 rounded-lg text-base ${indexeeErrors.journal ? 'border-red-500' : ''}`}
                      value={indexeeValues.journal}
                      onChange={(e) => {
                        setIndexeeValues(v => ({ ...v, journal: e.target.value }))
                        if (e.target.value) setIndexeeErrors(err => ({ ...err, journal: false }))
                      }}
                    />
                    {indexeeErrors.journal && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  {selectedSubCategory === "Publication dans une revue indexée" && (
                    <>
                      <div className="mb-4">
                        <Label htmlFor="issn-indexee">
                          ISSN de la Revue/Journal <span className="text-red-600">*</span>
                        </Label>
                        <Input 
                          id="issn-indexee" 
                          required 
                          placeholder="ISSN" 
                          className={`h-11 rounded-lg text-base ${indexeeErrors.issn ? 'border-red-500' : ''}`}
                          value={indexeeValues.issn}
                          onChange={(e) => {
                            setIndexeeValues(v => ({ ...v, issn: e.target.value }))
                            if (e.target.value) setIndexeeErrors(err => ({ ...err, issn: false }))
                          }}
                        />
                        {indexeeErrors.issn && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="base-indexation">
                          Base d'indexation <span className="text-red-600">*</span>
                        </Label>
                        <Select
                          value={indexeeValues.base}
                          onValueChange={(value) => {
                            setIndexeeValues(v => ({ ...v, base: value }))
                            if (value) setIndexeeErrors(err => ({ ...err, base: false }))
                          }}
                        >
                          <SelectTrigger className={`h-11 rounded-lg text-base ${indexeeErrors.base ? 'border-red-500' : ''}`}>
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
                        {indexeeErrors.base && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                      </div>
                    </>
                  )}
                  <div className="mb-4">
                    <Label htmlFor="annee-indexee">
                      Date de publication <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="annee-indexee"
                      type="number"
                      required
                      placeholder="2024"
                      className={`h-11 rounded-lg text-base ${indexeeErrors.annee ? 'border-red-500' : ''}`}
                      value={indexeeValues.annee}
                      onChange={(e) => {
                        setIndexeeValues(v => ({ ...v, annee: e.target.value }))
                        if (e.target.value) setIndexeeErrors(err => ({ ...err, annee: false }))
                      }}
                    />
                    {indexeeErrors.annee && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-revue">
                      Lien vers la revue
                      <span className={`ml-1 ${!manualFormData.lien && !manualFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!manualFormData.lien && !manualFormData.justificatif ? '*' : (!manualFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-revue" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={manualFormData.lien}
                      onChange={(e) => {
                        setManualFormData({ ...manualFormData, lien: e.target.value })
                        if (e.target.value || manualFormData.justificatif) {
                          setLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-indexee">
                      Justificatif 
                      <span className={`ml-1 ${!manualFormData.lien && !manualFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!manualFormData.lien && !manualFormData.justificatif ? '*' : (!manualFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!manualFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setManualFormData({ ...manualFormData, justificatif: file })
                            if (file || manualFormData.lien) {
                              setLienJustificatifError("")
                            }
                          }}
                          className="hidden"
                          id="justif-indexee"
                        />
                        <label htmlFor="justif-indexee" className="cursor-pointer">
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
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="flex-1 text-sm text-gray-700 truncate">
                          {manualFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setManualFormData({ ...manualFormData, justificatif: null })
                            // Reset the file input
                            const fileInput = document.getElementById('justif-indexee') as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {lienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{lienJustificatifError}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white border-uh2c-blue"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { titre: false, journal: false, issn: false, base: false, annee: false }
                        if (!indexeeValues.titre) errors.titre = true
                        if (!indexeeValues.journal) errors.journal = true
                        if (!indexeeValues.issn) errors.issn = true
                        if (!indexeeValues.base) errors.base = true
                        if (!indexeeValues.annee) errors.annee = true
                        setIndexeeErrors(errors)
                        
                        // Validation d'année
                        const yearInput = document.getElementById('annee-indexee') as HTMLInputElement
                        if (yearInput && parseInt(yearInput.value) > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          return
                        }
                        
                        // Validation lien OU justificatif
                        if (!manualFormData.lien && !manualFormData.justificatif) {
                          setLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Publication ajoutée manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          manualFormData,
                          indexeeValues
                        })
                        
                        // Reset form
                        setManualFormData({ lien: "", justificatif: null })
                        setLienJustificatifError("")
                        setYearError("")
                        setIndexeeErrors({ titre: false, journal: false, issn: false, base: false, annee: false, tranche: false })
                        setIndexeeValues({ titre: '', journal: '', issn: '', base: '', annee: '', tranche: '' })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </form>
              ) : selectedSubCategory === "Communication nationale" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-comm" className={commErrors.intitule ? 'text-red-600' : ''}>
                      Intitulé <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-comm" 
                      required 
                      placeholder="Intitulé de la communication" 
                      className={`h-11 rounded-lg text-base ${commErrors.intitule ? 'border-red-500' : ''}`}
                      value={commValues.intitule}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, intitule: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, intitule: false }))
                      }}
                    />
                    {commErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="manifestation-comm" className={commErrors.manifestation ? 'text-red-600' : ''}>
                      Manifestation <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="manifestation-comm" 
                      required 
                      placeholder="Nom de la manifestation" 
                      className={`h-11 rounded-lg text-base ${commErrors.manifestation ? 'border-red-500' : ''}`}
                      value={commValues.manifestation}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, manifestation: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, manifestation: false }))
                      }}
                    />
                    {commErrors.manifestation && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-2 grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="jour-comm" className={commErrors.jour ? 'text-red-600' : ''}>Date <span className="text-red-600">*</span></Label>
                      <Select 
                        required
                        value={commValues.jour}
                        onValueChange={(value) => {
                          setCommValues(v => ({ ...v, jour: value }))
                          if (value) setCommErrors(err => ({ ...err, jour: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.jour ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Jour" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(31)].map((_, i) => (
                            <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {commErrors.jour && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label htmlFor="mois-comm" className={`invisible ${commErrors.mois ? 'text-red-600' : ''}`}>Mois</Label>
                      <Select 
                        required
                        value={commValues.mois}
                        onValueChange={(value) => {
                          setCommValues(v => ({ ...v, mois: value }))
                          if (value) setCommErrors(err => ({ ...err, mois: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.mois ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Mois" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"].map((mois, i) => (
                            <SelectItem key={mois} value={mois}>{mois}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {commErrors.mois && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label htmlFor="annee-comm" className={`invisible ${commErrors.annee ? 'text-red-600' : ''}`}>Année</Label>
                      <Input
                        id="annee-comm"
                        type="number"
                        min="1900"
                        max={getCurrentYear()}
                        placeholder={getCurrentYear().toString()}
                        className={`h-11 rounded-lg text-base ${yearError || commErrors.annee ? 'border-red-500' : ''}`}
                        value={commValues.annee}
                        onChange={(e) => {
                          setCommValues(v => ({ ...v, annee: e.target.value }))
                          if (e.target.value) setCommErrors(err => ({ ...err, annee: false }))
                          const year = parseInt(e.target.value)
                          if (year > getCurrentYear()) {
                            setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          } else {
                            setYearError("")
                          }
                        }}
                      />
                      {(commErrors.annee || yearError) && (
                        <p className="text-xs text-red-600 mt-1">{yearError || 'Ce champ est obligatoire'}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="ville-comm" className={commErrors.ville ? 'text-red-600' : ''}>
                      Ville <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="ville-comm" 
                      required 
                      placeholder="Ville" 
                      className={`h-11 rounded-lg text-base ${commErrors.ville ? 'border-red-500' : ''}`}
                      value={commValues.ville}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, ville: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, ville: false }))
                      }}
                    />
                    {commErrors.ville && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-manif-comm">
                      Lien vers la manifestation
                      <span className="text-gray-500 ml-1">(optionnel)</span>
                    </Label>
                    <Input 
                      id="lien-manif-comm" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={commFormData.lien}
                      onChange={(e) => {
                        setCommFormData({ ...commFormData, lien: e.target.value })
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="base-indexation-comm" className={commErrors.base ? 'text-red-600' : ''}>
                      Bases d'indexation <span className="text-red-600">*</span>
                    </Label>
                    <Select 
                      required
                      value={commValues.base}
                      onValueChange={(value) => {
                        setCommValues(v => ({ ...v, base: value }))
                        if (value) setCommErrors(err => ({ ...err, base: false }))
                      }}
                    >
                      <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.base ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Choisir une base d'indexation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scopus">Scopus</SelectItem>
                        <SelectItem value="WOS">WOS</SelectItem>
                        <SelectItem value="ORCID">ORCID</SelectItem>
                        <SelectItem value="DOI">DOI</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {commErrors.base && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-comm" className={commErrors.justificatif ? 'text-red-600' : ''}>
                      Justificatif <span className="text-red-600">*</span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!commFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setCommFormData({ ...commFormData, justificatif: file })
                            if (file) setCommErrors(err => ({ ...err, justificatif: false }))
                          }}
                          className="hidden"
                          id="justif-comm"
                        />
                        <label htmlFor="justif-comm" className="cursor-pointer">
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
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="flex-1 text-sm text-gray-700 truncate">
                          {commFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCommFormData({ ...commFormData, justificatif: null })
                            setCommErrors(err => ({ ...err, justificatif: true }))
                            // Reset the file input
                            const fileInput = document.getElementById('justif-comm') as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {commErrors.justificatif && (
                      <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white border-uh2c-blue"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { intitule: false, manifestation: false, jour: false, mois: false, annee: false, ville: false, base: false, pays: false, justificatif: false }
                        if (!commValues.intitule) errors.intitule = true
                        if (!commValues.manifestation) errors.manifestation = true
                        if (!commValues.jour) errors.jour = true
                        if (!commValues.mois) errors.mois = true
                        if (!commValues.annee) errors.annee = true
                        if (!commValues.ville) errors.ville = true
                        if (!commValues.base) errors.base = true
                        if (!commValues.pays) errors.pays = true
                        setCommErrors(errors)
                        
                        // Validation d'année
                        const yearInput = document.getElementById('annee-comm') as HTMLInputElement
                        if (yearInput && parseInt(yearInput.value) > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          return
                        }
                        
                        // Validation lien OU justificatif
                        if (!manualFormData.lien && !manualFormData.justificatif) {
                          setLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Communication ajoutée manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          manualFormData,
                          commValues
                        })
                        
                        // Reset form
                        setManualFormData({ lien: "", justificatif: null })
                        setLienJustificatifError("")
                        setYearError("")
                        setCommErrors({ intitule: false, manifestation: false, jour: false, mois: false, annee: false, ville: false, base: false, pays: false, justificatif: false })
                        setCommValues({ intitule: '', manifestation: '', jour: '', mois: '', annee: '', ville: '', base: '', pays: '' })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </form>
              ) : selectedSubCategory === "Communication internationale" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-comm-inter" className={commErrors.intitule ? 'text-red-600' : ''}>
                      Intitulé <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-comm-inter" 
                      required 
                      placeholder="Intitulé de la communication" 
                      className={`h-11 rounded-lg text-base ${commErrors.intitule ? 'border-red-500' : ''}`}
                      value={commValues.intitule}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, intitule: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, intitule: false }))
                      }}
                    />
                    {commErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="manifestation-comm-inter" className={commErrors.manifestation ? 'text-red-600' : ''}>
                      Manifestation <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="manifestation-comm-inter" 
                      required 
                      placeholder="Nom de la manifestation" 
                      className={`h-11 rounded-lg text-base ${commErrors.manifestation ? 'border-red-500' : ''}`}
                      value={commValues.manifestation}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, manifestation: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, manifestation: false }))
                      }}
                    />
                    {commErrors.manifestation && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-2 grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="jour-comm-inter" className={commErrors.jour ? 'text-red-600' : ''}>Date <span className="text-red-600">*</span></Label>
                      <Select 
                        required
                        value={commValues.jour}
                        onValueChange={(value) => {
                          setCommValues(v => ({ ...v, jour: value }))
                          if (value) setCommErrors(err => ({ ...err, jour: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.jour ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Jour" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(31)].map((_, i) => (
                            <SelectItem key={i+1} value={(i+1).toString()}>{i+1}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {commErrors.jour && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label htmlFor="mois-comm-inter" className={`invisible ${commErrors.mois ? 'text-red-600' : ''}`}>Mois</Label>
                      <Select 
                        required
                        value={commValues.mois}
                        onValueChange={(value) => {
                          setCommValues(v => ({ ...v, mois: value }))
                          if (value) setCommErrors(err => ({ ...err, mois: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.mois ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Mois" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"].map((mois, i) => (
                            <SelectItem key={mois} value={mois}>{mois}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {commErrors.mois && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label htmlFor="annee-comm-inter" className={`invisible ${commErrors.annee ? 'text-red-600' : ''}`}>Année</Label>
                      <Input
                        id="annee-comm-inter"
                        type="number"
                        min="1900"
                        max={getCurrentYear()}
                        placeholder={getCurrentYear().toString()}
                        className={`h-11 rounded-lg text-base ${yearError || commErrors.annee ? 'border-red-500' : ''}`}
                        value={commValues.annee}
                        onChange={(e) => {
                          setCommValues(v => ({ ...v, annee: e.target.value }))
                          if (e.target.value) setCommErrors(err => ({ ...err, annee: false }))
                          const year = parseInt(e.target.value)
                          if (year > getCurrentYear()) {
                            setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          } else {
                            setYearError("")
                          }
                        }}
                      />
                      {(commErrors.annee || yearError) && (
                        <p className="text-xs text-red-600 mt-1">{yearError || 'Ce champ est obligatoire'}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="ville-comm-inter" className={commErrors.ville ? 'text-red-600' : ''}>
                      Ville <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="ville-comm-inter" 
                      required 
                      placeholder="Ville" 
                      className={`h-11 rounded-lg text-base ${commErrors.ville ? 'border-red-500' : ''}`}
                      value={commValues.ville}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, ville: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, ville: false }))
                      }}
                    />
                    {commErrors.ville && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="pays-comm-inter" className={commErrors.pays ? 'text-red-600' : ''}>
                      Pays <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="pays-comm-inter" 
                      required 
                      placeholder="Pays" 
                      className={`h-11 rounded-lg text-base ${commErrors.pays ? 'border-red-500' : ''}`}
                      value={commValues.pays}
                      onChange={(e) => {
                        setCommValues(v => ({ ...v, pays: e.target.value }))
                        if (e.target.value) setCommErrors(err => ({ ...err, pays: false }))
                      }}
                    />
                    {commErrors.pays && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-manif-comm-inter">
                      Lien vers la manifestation
                      <span className={`ml-1 ${!commFormData.lien && !commFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!commFormData.lien && !commFormData.justificatif ? '*' : (!commFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-manif-comm-inter" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={commFormData.lien}
                      onChange={(e) => {
                        setCommFormData({ ...commFormData, lien: e.target.value })
                        if (e.target.value || commFormData.justificatif) {
                          setCommLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="base-indexation-comm-inter" className={commErrors.base ? 'text-red-600' : ''}>
                      Bases d'indexation <span className="text-red-600">*</span>
                    </Label>
                    <Select 
                      required
                      value={commValues.base}
                      onValueChange={(value) => {
                        setCommValues(v => ({ ...v, base: value }))
                        if (value) setCommErrors(err => ({ ...err, base: false }))
                      }}
                    >
                      <SelectTrigger className={`h-11 rounded-lg text-base ${commErrors.base ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Choisir une base d'indexation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scopus">Scopus</SelectItem>
                        <SelectItem value="WOS">WOS</SelectItem>
                        <SelectItem value="ORCID">ORCID</SelectItem>
                        <SelectItem value="DOI">DOI</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {commErrors.base && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-comm-inter">
                      Justificatif 
                      <span className={`ml-1 ${!commFormData.lien && !commFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!commFormData.lien && !commFormData.justificatif ? '*' : (!commFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!commFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setCommFormData({ ...commFormData, justificatif: file })
                            if (file) setCommErrors(err => ({ ...err, justificatif: false }))
                          }}
                          className="hidden"
                          id="justif-comm-inter"
                        />
                        <label htmlFor="justif-comm-inter" className="cursor-pointer">
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
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="flex-1 text-sm text-gray-700 truncate">
                          {commFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCommFormData({ ...commFormData, justificatif: null })
                            // Reset the file input
                            const fileInput = document.getElementById('justif-comm-inter') as HTMLInputElement
                            if (fileInput) fileInput.value = ''
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                  </div>
                    )}
                    
                    {commLienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{commLienJustificatifError}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white border-uh2c-blue"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </form>
              ) : selectedCategory === "Ouvrages" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-ouvrage" className={ouvrageErrors.intitule ? 'text-red-600' : ''}>
                      Intitulé <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-ouvrage" 
                      required 
                      placeholder="Intitulé de l'ouvrage" 
                      className={`h-11 rounded-lg text-base ${ouvrageErrors.intitule ? 'border-red-500' : ''}`}
                      value={ouvrageValues.intitule}
                      onChange={(e) => {
                        setOuvrageValues(v => ({ ...v, intitule: e.target.value }))
                        if (e.target.value) setOuvrageErrors(err => ({ ...err, intitule: false }))
                      }}
                    />
                    {ouvrageErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="maison-edition-ouvrage" className={ouvrageErrors.maisonEdition ? 'text-red-600' : ''}>
                      Maison d'édition <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="maison-edition-ouvrage" 
                      required 
                      placeholder="Maison d'édition" 
                      className={`h-11 rounded-lg text-base ${ouvrageErrors.maisonEdition ? 'border-red-500' : ''}`}
                      value={ouvrageValues.maisonEdition}
                      onChange={(e) => {
                        setOuvrageValues(v => ({ ...v, maisonEdition: e.target.value }))
                        if (e.target.value) setOuvrageErrors(err => ({ ...err, maisonEdition: false }))
                      }}
                    />
                    {ouvrageErrors.maisonEdition && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="annee-ouvrage" className={ouvrageErrors.annee ? 'text-red-600' : ''}>
                      Date <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="annee-ouvrage"
                      type="number"
                      min="1900"
                      max={getCurrentYear()}
                      placeholder={getCurrentYear().toString()}
                      className={`h-11 rounded-lg text-base ${yearError || ouvrageErrors.annee ? 'border-red-500' : ''}`}
                      value={ouvrageValues.annee}
                      onChange={(e) => {
                        setOuvrageValues(v => ({ ...v, annee: e.target.value }))
                        if (e.target.value) setOuvrageErrors(err => ({ ...err, annee: false }))
                        const year = parseInt(e.target.value)
                        if (year > getCurrentYear()) {
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
                  <div className="mb-4">
                    <Label htmlFor="issn-ouvrage">ISSN</Label>
                    <Input id="issn-ouvrage" placeholder="ISSN" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="isbn-ouvrage">ISBN</Label>
                    <Input id="isbn-ouvrage" placeholder="ISBN" className="h-11 rounded-lg text-base" />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-ouvrage">
                      Lien
                      <span className={`ml-1 ${!ouvrageFormData.lien && !ouvrageFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!ouvrageFormData.lien && !ouvrageFormData.justificatif ? '*' : (!ouvrageFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-ouvrage" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={ouvrageFormData.lien}
                      onChange={(e) => {
                        setOuvrageFormData({ ...ouvrageFormData, lien: e.target.value })
                        if (e.target.value || ouvrageFormData.justificatif) {
                          setOuvrageLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-ouvrage">
                      Justificatif 
                      <span className={`ml-1 ${!ouvrageFormData.lien && !ouvrageFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!ouvrageFormData.lien && !ouvrageFormData.justificatif ? '*' : (!ouvrageFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!ouvrageFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setOuvrageFormData({ ...ouvrageFormData, justificatif: file })
                            if (file || ouvrageFormData.lien) {
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
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="flex-1 text-sm text-gray-700 truncate">
                          {ouvrageFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOuvrageFormData({ ...ouvrageFormData, justificatif: null })
                            // Reset the file input
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
                  <div className="flex justify-end space-x-3 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white border-uh2c-blue"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { intitule: false, maisonEdition: false, annee: false }
                        if (!ouvrageValues.intitule) errors.intitule = true
                        if (!ouvrageValues.maisonEdition) errors.maisonEdition = true
                        if (!ouvrageValues.annee) errors.annee = true
                        setOuvrageErrors(errors)
                        
                        // Validation d'année
                        const yearInput = document.getElementById('annee-ouvrage') as HTMLInputElement
                        if (yearInput && parseInt(yearInput.value) > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          return
                        }
                        
                        // Validation lien OU justificatif
                        if (!ouvrageFormData.lien && !ouvrageFormData.justificatif) {
                          setOuvrageLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Ouvrage ajouté manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          ouvrageFormData,
                          ouvrageValues
                        })
                        
                        // Reset form
                        setOuvrageFormData({ lien: "", justificatif: null })
                        setOuvrageLienJustificatifError("")
                        setYearError("")
                        setOuvrageErrors({ intitule: false, maisonEdition: false, annee: false })
                        setOuvrageValues({ intitule: '', maisonEdition: '', annee: '' })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </form>
              ) : selectedCategory === "Brevets et droits" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-brevet" className={brevetErrors.intitule ? 'text-red-600' : ''}>
                      Intitulé <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-brevet" 
                      required 
                      placeholder="Intitulé du brevet" 
                      className={`h-11 rounded-lg text-base ${brevetErrors.intitule ? 'border-red-500' : ''}`}
                      value={brevetValues.intitule}
                      onChange={(e) => {
                        setBrevetValues(v => ({ ...v, intitule: e.target.value }))
                        if (e.target.value) setBrevetErrors(err => ({ ...err, intitule: false }))
                      }}
                    />
                    {brevetErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="type-brevet" className={brevetErrors.type ? 'text-red-600' : ''}>
                      Type <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={brevetValues.type}
                      onValueChange={(value) => {
                        setBrevetValues(v => ({ ...v, type: value }))
                        if (value) setBrevetErrors(err => ({ ...err, type: false }))
                      }}
                    >
                      <SelectTrigger className={`h-11 rounded-lg text-base ${brevetErrors.type ? 'border-red-500' : ''}`}>
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
                  <div className="mb-4">
                    <Label htmlFor="champ-application-brevet" className={brevetErrors.champApplication ? 'text-red-600' : ''}>
                      Champ d'application <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="champ-application-brevet" 
                      required 
                      placeholder="Champ d'application" 
                      className={`h-11 rounded-lg text-base ${brevetErrors.champApplication ? 'border-red-500' : ''}`}
                      value={brevetValues.champApplication}
                      onChange={(e) => {
                        setBrevetValues(v => ({ ...v, champApplication: e.target.value }))
                        if (e.target.value) setBrevetErrors(err => ({ ...err, champApplication: false }))
                      }}
                    />
                    {brevetErrors.champApplication && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="numero-depot-brevet" className={brevetErrors.numeroDepot ? 'text-red-600' : ''}>
                      Numéro de dépôt <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="numero-depot-brevet" 
                      required 
                      placeholder="Numéro de dépôt" 
                      className={`h-11 rounded-lg text-base ${brevetErrors.numeroDepot ? 'border-red-500' : ''}`}
                      value={brevetValues.numeroDepot}
                      onChange={(e) => {
                        setBrevetValues(v => ({ ...v, numeroDepot: e.target.value }))
                        if (e.target.value) setBrevetErrors(err => ({ ...err, numeroDepot: false }))
                      }}
                    />
                    {brevetErrors.numeroDepot && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="date-depot-brevet" className={brevetErrors.dateDepot ? 'text-red-600' : ''}>
                      Date de dépôt <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="date-depot-brevet" 
                      type="date"
                      required 
                      className={`h-11 rounded-lg text-base ${brevetErrors.dateDepot ? 'border-red-500' : ''}`}
                      value={brevetValues.dateDepot}
                      onChange={(e) => {
                        setBrevetValues(v => ({ ...v, dateDepot: e.target.value }))
                        if (e.target.value) setBrevetErrors(err => ({ ...err, dateDepot: false }))
                      }}
                    />
                    {brevetErrors.dateDepot && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="numero-enregistrement-brevet">Numéro d'enregistrement</Label>
                    <Input 
                      id="numero-enregistrement-brevet" 
                      placeholder="Numéro d'enregistrement" 
                      className="h-11 rounded-lg text-base"
                      value={brevetValues.numeroEnregistrement}
                      onChange={(e) => {
                        setBrevetValues(v => ({ ...v, numeroEnregistrement: e.target.value }))
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="partenaires-brevet">Partenaires</Label>
                    <Input 
                      id="partenaires-brevet" 
                      placeholder="Partenaires" 
                      className="h-11 rounded-lg text-base"
                      value={brevetValues.partenaires}
                      onChange={(e) => {
                        setBrevetValues(v => ({ ...v, partenaires: e.target.value }))
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-brevet">
                      Lien
                      <span className={`ml-1 ${!brevetFormData.lien && !brevetFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!brevetFormData.lien && !brevetFormData.justificatif ? '*' : (!brevetFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-brevet" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={brevetFormData.lien}
                      onChange={(e) => {
                        setBrevetFormData({ ...brevetFormData, lien: e.target.value })
                        if (e.target.value || brevetFormData.justificatif) {
                          setBrevetLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-brevet">
                      Justificatifs 
                      <span className={`ml-1 ${!brevetFormData.lien && !brevetFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!brevetFormData.lien && !brevetFormData.justificatif ? '*' : (!brevetFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!brevetFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setBrevetFormData({ ...brevetFormData, justificatif: file })
                            if (file || brevetFormData.lien) {
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
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="flex-1 text-sm text-gray-700 truncate">
                          {brevetFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setBrevetFormData({ ...brevetFormData, justificatif: null })}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {brevetLienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{brevetLienJustificatifError}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white border-uh2c-blue"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { intitule: false, type: false, champApplication: false, numeroDepot: false, dateDepot: false }
                        if (!brevetValues.intitule) errors.intitule = true
                        if (!brevetValues.type) errors.type = true
                        if (!brevetValues.champApplication) errors.champApplication = true
                        if (!brevetValues.numeroDepot) errors.numeroDepot = true
                        if (!brevetValues.dateDepot) errors.dateDepot = true
                        setBrevetErrors(errors)
                        
                        // Validation lien OU justificatif
                        if (!brevetFormData.lien && !brevetFormData.justificatif) {
                          setBrevetLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Brevet ajouté manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          brevetFormData,
                          brevetValues
                        })
                        
                        // Reset form
                        setBrevetFormData({ lien: "", justificatif: null })
                        setBrevetLienJustificatifError("")
                        setBrevetErrors({ intitule: false, type: false, champApplication: false, numeroDepot: false, dateDepot: false })
                        setBrevetValues({ intitule: '', type: '', champApplication: '', numeroDepot: '', dateDepot: '', numeroEnregistrement: '', partenaires: '' })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </form>
              ) : selectedCategory === "Revue bibliographique" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-revue" className={revueErrors.intitule ? 'text-red-600' : ''}>
                      Intitulé <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-revue" 
                      required 
                      placeholder="Intitulé du brevet" 
                      className={`h-11 rounded-lg text-base ${revueErrors.intitule ? 'border-red-500' : ''}`}
                      value={revueValues.intitule}
                      onChange={(e) => {
                        setRevueValues(v => ({ ...v, intitule: e.target.value }))
                        if (e.target.value) setRevueErrors(err => ({ ...err, intitule: false }))
                      }}
                    />
                    {revueErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="type-revue" className={revueErrors.type ? 'text-red-600' : ''}>
                      Type <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={revueValues.type}
                      onValueChange={(value) => {
                        setRevueValues(v => ({ ...v, type: value }))
                        if (value) setRevueErrors(err => ({ ...err, type: false }))
                      }}
                    >
                      <SelectTrigger className={`h-11 rounded-lg text-base ${revueErrors.type ? 'border-red-500' : ''}`}>
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
                    {revueErrors.type && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="champ-application-revue" className={revueErrors.champApplication ? 'text-red-600' : ''}>
                      Champ d'application <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="champ-application-revue" 
                      required 
                      placeholder="Champ d'application" 
                      className={`h-11 rounded-lg text-base ${revueErrors.champApplication ? 'border-red-500' : ''}`}
                      value={revueValues.champApplication}
                      onChange={(e) => {
                        setRevueValues(v => ({ ...v, champApplication: e.target.value }))
                        if (e.target.value) setRevueErrors(err => ({ ...err, champApplication: false }))
                      }}
                    />
                    {revueErrors.champApplication && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="numero-depot-revue" className={revueErrors.numeroDepot ? 'text-red-600' : ''}>
                      Numéro de dépôt <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="numero-depot-revue" 
                      required 
                      placeholder="Numéro de dépôt" 
                      className={`h-11 rounded-lg text-base ${revueErrors.numeroDepot ? 'border-red-500' : ''}`}
                      value={revueValues.numeroDepot}
                      onChange={(e) => {
                        setRevueValues(v => ({ ...v, numeroDepot: e.target.value }))
                        if (e.target.value) setRevueErrors(err => ({ ...err, numeroDepot: false }))
                      }}
                    />
                    {revueErrors.numeroDepot && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="date-depot-revue" className={revueErrors.dateDepot ? 'text-red-600' : ''}>
                      Date de dépôt <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="date-depot-revue" 
                      type="date"
                      required 
                      className={`h-11 rounded-lg text-base ${revueErrors.dateDepot ? 'border-red-500' : ''}`}
                      value={revueValues.dateDepot}
                      onChange={(e) => {
                        setRevueValues(v => ({ ...v, dateDepot: e.target.value }))
                        if (e.target.value) setRevueErrors(err => ({ ...err, dateDepot: false }))
                      }}
                    />
                    {revueErrors.dateDepot && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="numero-enregistrement-revue">Numéro d'enregistrement</Label>
                    <Input 
                      id="numero-enregistrement-revue" 
                      placeholder="Numéro d'enregistrement" 
                      className="h-11 rounded-lg text-base"
                      value={revueValues.numeroEnregistrement}
                      onChange={(e) => {
                        setRevueValues(v => ({ ...v, numeroEnregistrement: e.target.value }))
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="partenaires-revue">Partenaires</Label>
                    <Input 
                      id="partenaires-revue" 
                      placeholder="Partenaires" 
                      className="h-11 rounded-lg text-base"
                      value={revueValues.partenaires}
                      onChange={(e) => {
                        setRevueValues(v => ({ ...v, partenaires: e.target.value }))
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-revue">
                      Lien
                      <span className={`ml-1 ${!revueFormData.lien && !revueFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!revueFormData.lien && !revueFormData.justificatif ? '*' : (!revueFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-revue" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={revueFormData.lien}
                      onChange={(e) => {
                        setRevueFormData({ ...revueFormData, lien: e.target.value })
                        if (e.target.value || revueFormData.justificatif) {
                          setRevueLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-revue">
                      Justificatifs 
                      <span className={`ml-1 ${!revueFormData.lien && !revueFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!revueFormData.lien && !revueFormData.justificatif ? '*' : (!revueFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!revueFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setRevueFormData({ ...revueFormData, justificatif: file })
                            if (file || revueFormData.lien) {
                              setRevueLienJustificatifError("")
                            }
                          }}
                          className="hidden"
                          id="justif-revue"
                        />
                        <label htmlFor="justif-revue" className="cursor-pointer">
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
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="flex-1 text-sm text-gray-700 truncate">
                          {revueFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setRevueFormData({ ...revueFormData, justificatif: null })}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {revueLienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{revueLienJustificatifError}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white border-uh2c-blue"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { intitule: false, type: false, champApplication: false, numeroDepot: false, dateDepot: false }
                        if (!revueValues.intitule) errors.intitule = true
                        if (!revueValues.type) errors.type = true
                        if (!revueValues.champApplication) errors.champApplication = true
                        if (!revueValues.numeroDepot) errors.numeroDepot = true
                        if (!revueValues.dateDepot) errors.dateDepot = true
                        setRevueErrors(errors)
                        
                        // Validation lien OU justificatif
                        if (!revueFormData.lien && !revueFormData.justificatif) {
                          setRevueLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Revue bibliographique ajoutée manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          revueFormData,
                          revueValues
                        })
                        
                        // Reset form
                        setRevueFormData({ lien: "", justificatif: null })
                        setRevueLienJustificatifError("")
                        setRevueErrors({ intitule: false, type: false, champApplication: false, numeroDepot: false, dateDepot: false })
                        setRevueValues({ intitule: '', type: '', champApplication: '', numeroDepot: '', dateDepot: '', numeroEnregistrement: '', partenaires: '' })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </form>
              ) : selectedCategory === "Distinctions et Prix" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-distinction" className={distinctionErrors.intitule ? 'text-red-600' : ''}>
                      Intitulé <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-distinction" 
                      required 
                      placeholder="Intitulé de la distinction/prix" 
                      className={`h-11 rounded-lg text-base ${distinctionErrors.intitule ? 'border-red-500' : ''}`}
                      value={distinctionValues.intitule}
                      onChange={(e) => {
                        setDistinctionValues(v => ({ ...v, intitule: e.target.value }))
                        if (e.target.value) setDistinctionErrors(err => ({ ...err, intitule: false }))
                      }}
                    />
                    {distinctionErrors.intitule && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="evenement-distinction">Évènement</Label>
                    <Input 
                      id="evenement-distinction" 
                      placeholder="Nom de l'évènement" 
                      className="h-11 rounded-lg text-base"
                      value={distinctionValues.evenement}
                      onChange={(e) => {
                        setDistinctionValues(v => ({ ...v, evenement: e.target.value }))
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="organisme-distinction">Organisme</Label>
                    <Input 
                      id="organisme-distinction" 
                      placeholder="Nom de l'organisme" 
                      className="h-11 rounded-lg text-base"
                      value={distinctionValues.organisme}
                      onChange={(e) => {
                        setDistinctionValues(v => ({ ...v, organisme: e.target.value }))
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="date-distinction" className={distinctionErrors.date ? 'text-red-600' : ''}>
                      Date <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="date-distinction"
                      type="date"
                      required
                      className={`h-11 rounded-lg text-base ${distinctionErrors.date ? 'border-red-500' : ''}`}
                      value={distinctionValues.date}
                      onChange={(e) => {
                        setDistinctionValues(v => ({ ...v, date: e.target.value }))
                        if (e.target.value) setDistinctionErrors(err => ({ ...err, date: false }))
                      }}
                    />
                    {distinctionErrors.date && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-distinction">
                      Lien
                      <span className={`ml-1 ${!distinctionFormData.lien && !distinctionFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!distinctionFormData.lien && !distinctionFormData.justificatif ? '*' : (!distinctionFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-distinction" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={distinctionFormData.lien}
                      onChange={(e) => {
                        setDistinctionFormData({ ...distinctionFormData, lien: e.target.value })
                        if (e.target.value || distinctionFormData.justificatif) {
                          setDistinctionLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-distinction">
                      Justificatifs 
                      <span className={`ml-1 ${!distinctionFormData.lien && !distinctionFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!distinctionFormData.lien && !distinctionFormData.justificatif ? '*' : (!distinctionFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!distinctionFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setDistinctionFormData({ ...distinctionFormData, justificatif: file })
                            if (file || distinctionFormData.lien) {
                              setDistinctionLienJustificatifError("")
                            }
                          }}
                          className="hidden"
                          id="justif-distinction"
                        />
                        <label htmlFor="justif-distinction" className="cursor-pointer">
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
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="flex-1 text-sm text-gray-700 truncate">
                          {distinctionFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDistinctionFormData({ ...distinctionFormData, justificatif: null })}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {distinctionLienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{distinctionLienJustificatifError}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white border-uh2c-blue"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { intitule: false, date: false }
                        if (!distinctionValues.intitule) errors.intitule = true
                        if (!distinctionValues.date) errors.date = true
                        setDistinctionErrors(errors)
                        
                        // Validation lien OU justificatif
                        if (!distinctionFormData.lien && !distinctionFormData.justificatif) {
                          setDistinctionLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Distinction ajoutée manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          distinctionFormData,
                          distinctionValues
                        })
                        
                        // Reset form
                        setDistinctionFormData({ lien: "", justificatif: null })
                        setDistinctionLienJustificatifError("")
                        setDistinctionErrors({ intitule: false, date: false })
                        setDistinctionValues({ intitule: '', evenement: '', organisme: '', date: '' })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </form>
              ) : selectedCategory === "Chapitre" ? (
                <form className="space-y-8 rounded-lg shadow-md bg-white border p-6">
                  <div className="mb-4">
                    <Label htmlFor="intitule-chapitre" className={chapitreErrors.intituleChapitre ? 'text-red-600' : ''}>
                      Intitulé du chapitre <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-chapitre" 
                      required 
                      placeholder="Intitulé du chapitre" 
                      className={`h-11 rounded-lg text-base ${chapitreErrors.intituleChapitre ? 'border-red-500' : ''}`}
                      value={chapitreValues.intituleChapitre}
                      onChange={(e) => {
                        setChapitreValues(v => ({ ...v, intituleChapitre: e.target.value }))
                        if (e.target.value) setChapitreErrors(err => ({ ...err, intituleChapitre: false }))
                      }}
                    />
                    {chapitreErrors.intituleChapitre && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="numero-chapitre">Numéro du chapitre</Label>
                    <Input 
                      id="numero-chapitre" 
                      placeholder="Numéro du chapitre" 
                      className="h-11 rounded-lg text-base"
                      value={chapitreValues.numeroChapitre}
                      onChange={(e) => {
                        setChapitreValues(v => ({ ...v, numeroChapitre: e.target.value }))
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="page-de">Page de</Label>
                      <Input 
                        id="page-de" 
                        placeholder="Page de" 
                        className="h-11 rounded-lg text-base"
                        value={chapitreValues.pageDe}
                        onChange={(e) => {
                          setChapitreValues(v => ({ ...v, pageDe: e.target.value }))
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="page-a">Page à</Label>
                      <Input 
                        id="page-a" 
                        placeholder="Page à" 
                        className="h-11 rounded-lg text-base"
                        value={chapitreValues.pageA}
                        onChange={(e) => {
                          setChapitreValues(v => ({ ...v, pageA: e.target.value }))
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="intitule-ouvrage" className={chapitreErrors.intituleOuvrage ? 'text-red-600' : ''}>
                      Intitulé d'ouvrage <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="intitule-ouvrage" 
                      required 
                      placeholder="Intitulé d'ouvrage" 
                      className={`h-11 rounded-lg text-base ${chapitreErrors.intituleOuvrage ? 'border-red-500' : ''}`}
                      value={chapitreValues.intituleOuvrage}
                      onChange={(e) => {
                        setChapitreValues(v => ({ ...v, intituleOuvrage: e.target.value }))
                        if (e.target.value) setChapitreErrors(err => ({ ...err, intituleOuvrage: false }))
                      }}
                    />
                    {chapitreErrors.intituleOuvrage && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="maison-edition" className={chapitreErrors.maisonEdition ? 'text-red-600' : ''}>
                      Maison d'édition <span className="text-red-600">*</span>
                    </Label>
                    <Input 
                      id="maison-edition" 
                      required 
                      placeholder="Maison d'édition" 
                      className={`h-11 rounded-lg text-base ${chapitreErrors.maisonEdition ? 'border-red-500' : ''}`}
                      value={chapitreValues.maisonEdition}
                      onChange={(e) => {
                        setChapitreValues(v => ({ ...v, maisonEdition: e.target.value }))
                        if (e.target.value) setChapitreErrors(err => ({ ...err, maisonEdition: false }))
                      }}
                    />
                    {chapitreErrors.maisonEdition && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="annee-chapitre" className={chapitreErrors.annee ? 'text-red-600' : ''}>
                      Année <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="annee-chapitre"
                      type="number"
                      required
                      placeholder="2025"
                      className={`h-11 rounded-lg text-base ${chapitreErrors.annee ? 'border-red-500' : ''}`}
                      value={chapitreValues.annee}
                      onChange={(e) => {
                        setChapitreValues(v => ({ ...v, annee: e.target.value }))
                        if (e.target.value) setChapitreErrors(err => ({ ...err, annee: false }))
                      }}
                    />
                    {chapitreErrors.annee && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="issn-chapitre">ISSN</Label>
                      <Input 
                        id="issn-chapitre" 
                        placeholder="ISSN" 
                        className="h-11 rounded-lg text-base"
                        value={chapitreValues.issn}
                        onChange={(e) => {
                          setChapitreValues(v => ({ ...v, issn: e.target.value }))
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="isbn-chapitre">ISBN</Label>
                      <Input 
                        id="isbn-chapitre" 
                        placeholder="ISBN" 
                        className="h-11 rounded-lg text-base"
                        value={chapitreValues.isbn}
                        onChange={(e) => {
                          setChapitreValues(v => ({ ...v, isbn: e.target.value }))
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lien-chapitre">
                      Lien
                      <span className={`ml-1 ${!chapitreFormData.lien && !chapitreFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!chapitreFormData.lien && !chapitreFormData.justificatif ? '*' : (!chapitreFormData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien-chapitre" 
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base"
                      value={chapitreFormData.lien}
                      onChange={(e) => {
                        setChapitreFormData({ ...chapitreFormData, lien: e.target.value })
                        if (e.target.value || chapitreFormData.justificatif) {
                          setChapitreLienJustificatifError("")
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="justif-chapitre">
                      Justificatifs 
                      <span className={`ml-1 ${!chapitreFormData.lien && !chapitreFormData.justificatif ? 'text-red-600' : 'text-gray-500'}`}>
                        {!chapitreFormData.lien && !chapitreFormData.justificatif ? '*' : (!chapitreFormData.justificatif ? '(optionnel)' : '')}
                      </span>
                      <span className='text-xs text-gray-500'> (Scan du justificatif au format PDF)</span>
                    </Label>
                    
                    {!chapitreFormData.justificatif ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            setChapitreFormData({ ...chapitreFormData, justificatif: file })
                            if (file || chapitreFormData.lien) {
                              setChapitreLienJustificatifError("")
                            }
                          }}
                          className="hidden"
                          id="justif-chapitre"
                        />
                        <label htmlFor="justif-chapitre" className="cursor-pointer">
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
                      <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="flex-1 text-sm text-gray-700 truncate">
                          {chapitreFormData.justificatif.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setChapitreFormData({ ...chapitreFormData, justificatif: null })}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {chapitreLienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{chapitreLienJustificatifError}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white border-uh2c-blue"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { intituleChapitre: false, intituleOuvrage: false, maisonEdition: false, annee: false }
                        if (!chapitreValues.intituleChapitre) errors.intituleChapitre = true
                        if (!chapitreValues.intituleOuvrage) errors.intituleOuvrage = true
                        if (!chapitreValues.maisonEdition) errors.maisonEdition = true
                        if (!chapitreValues.annee) errors.annee = true
                        setChapitreErrors(errors)
                        
                        // Validation d'année
                        const yearInput = document.getElementById('annee-chapitre') as HTMLInputElement
                        if (yearInput && parseInt(yearInput.value) > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          return
                        }
                        
                        // Validation lien OU justificatif
                        if (!chapitreFormData.lien && !chapitreFormData.justificatif) {
                          setChapitreLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Chapitre ajouté manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          chapitreFormData,
                          chapitreValues
                        })
                        
                        // Reset form
                        setChapitreFormData({ lien: "", justificatif: null })
                        setChapitreLienJustificatifError("")
                        setYearError("")
                        setChapitreErrors({ intituleChapitre: false, intituleOuvrage: false, maisonEdition: false, annee: false })
                        setChapitreValues({ intituleChapitre: '', numeroChapitre: '', pageDe: '', pageA: '', intituleOuvrage: '', maisonEdition: '', annee: '', issn: '', isbn: '' })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </form>
              ) : (
                // Formulaire classique pour les autres cas
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="title" className={genericErrors.title ? 'text-red-600' : ''}>
                        Titre de la publication <span className="text-red-600">*</span>
                      </Label>
                      <Input 
                        id="title" 
                        required 
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value })
                          if (e.target.value) setGenericErrors(err => ({ ...err, title: false }))
                        }}
                        placeholder="Entrez le titre..." 
                        className={`h-11 rounded-lg text-base ${genericErrors.title ? 'border-red-500' : ''}`}
                      />
                      {genericErrors.title && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="authors" className={genericErrors.authors ? 'text-red-600' : ''}>
                        Auteurs <span className="text-red-600">*</span>
                      </Label>
                      <Input 
                        id="authors" 
                        required 
                        value={formData.authors}
                        onChange={(e) => {
                          setFormData({ ...formData, authors: e.target.value })
                          if (e.target.value) setGenericErrors(err => ({ ...err, authors: false }))
                        }}
                        placeholder="Entrez les auteurs..." 
                        className={`h-11 rounded-lg text-base ${genericErrors.authors ? 'border-red-500' : ''}`}
                      />
                      {genericErrors.authors && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="year" className={genericErrors.year ? 'text-red-600' : ''}>
                        Date <span className="text-red-600">*</span>
                      </Label>
                      <Input 
                        id="year" 
                        type="number" 
                        min="1900" 
                        max={getCurrentYear()} 
                        required 
                        value={formData.year}
                        onChange={(e) => {
                          setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })
                          if (e.target.value) setGenericErrors(err => ({ ...err, year: false }))
                          const year = parseInt(e.target.value)
                          if (year > getCurrentYear()) {
                            setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          } else {
                            setYearError("")
                          }
                        }}
                        placeholder={getCurrentYear().toString()} 
                        className={`h-11 rounded-lg text-base ${yearError || genericErrors.year ? 'border-red-500' : ''}`}
                      />
                      {(genericErrors.year || yearError) && (
                        <p className="text-xs text-red-600 mt-1">{yearError || 'Ce champ est obligatoire'}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="journal">
                        Journal/Revue
                      </Label>
                      <Input 
                        id="journal" 
                        value={formData.journal}
                        onChange={(e) => setFormData({ ...formData, journal: e.target.value })}
                        placeholder="Nom du journal..." 
                        className="h-11 rounded-lg text-base" 
                      />
                    </div>
                  </div>


                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <Label htmlFor="source" className={genericErrors.source ? 'text-red-600' : ''}>
                        Source <span className="text-red-600">*</span>
                      </Label>
                      <Select 
                        value={formData.source} 
                        onValueChange={(value) => {
                          setFormData({ ...formData, source: value })
                          if (value) setGenericErrors(err => ({ ...err, source: false }))
                        }}
                      >
                        <SelectTrigger className={`h-11 rounded-lg text-base ${genericErrors.source ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Sélectionnez une source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Scopus">Scopus</SelectItem>
                          <SelectItem value="WOS">WOS</SelectItem>
                          <SelectItem value="ORCID">ORCID</SelectItem>
                          <SelectItem value="DOI">DOI</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      {genericErrors.source && <p className="text-xs text-red-600 mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="abstract">Résumé</Label>
                      <Textarea 
                        id="abstract" 
                        value={formData.abstract}
                        onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                        placeholder="Entrez le résumé de la publication..." 
                        rows={4} 
                        className="h-11 rounded-lg text-base" 
                      />
                    </div>
                  </div>

                  {/* Lien */}
                  <div className="mb-4">
                    <Label htmlFor="lien">
                      Lien 
                      <span className={`ml-1 ${!formData.lien && formData.justificatifs.length === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {!formData.lien && formData.justificatifs.length === 0 ? '*' : (!formData.lien ? '(optionnel)' : '')}
                      </span>
                    </Label>
                    <Input 
                      id="lien" 
                      type="url"
                      value={formData.lien}
                      onChange={(e) => {
                        setFormData({ ...formData, lien: e.target.value })
                        setLienJustificatifError("")
                      }}
                      placeholder="https://..." 
                      className="h-11 rounded-lg text-base" 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                    </p>
                  </div>

                  {/* Justificatifs */}
                  <div className="mb-4">
                    <Label htmlFor="justificatifs">
                      Justificatifs 
                      <span className={`ml-1 ${!formData.lien && formData.justificatifs.length === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {!formData.lien && formData.justificatifs.length === 0 ? '*' : (!formData.justificatifs.length ? '(optionnels)' : '')}
                      </span>
                    </Label>
                    
                    {formData.justificatifs.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files) {
                              setFormData({ ...formData, justificatifs: Array.from(e.target.files || []) })
                              setLienJustificatifError("")
                            }
                          }}
                          className="hidden"
                          id="justificatifs"
                        />
                        <label htmlFor="justificatifs" className="cursor-pointer">
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
                      <div className="space-y-2">
                        {formData.justificatifs.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span className="flex-1 text-sm text-gray-700 truncate">
                              {file.name}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newFiles = formData.justificatifs.filter((_, i) => i !== index)
                                setFormData({ ...formData, justificatifs: newFiles })
                                // Reset the file input if no files left
                                if (newFiles.length === 0) {
                                  const fileInput = document.getElementById('justificatifs') as HTMLInputElement
                                  if (fileInput) fileInput.value = ''
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {lienJustificatifError && (
                      <p className="text-xs text-red-600 mt-1">{lienJustificatifError}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 p-2 md:p-4">
                    <Button variant="outline" onClick={() => {
                      setAddManualDialogOpen(false)
                      setSelectedCategory("")
                      setSelectedSubCategory("")
                    }}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white border-uh2c-blue"
                      onClick={(e) => {
                        e.preventDefault()
                        
                        // Validation de tous les champs obligatoires
                        let errors = { title: false, authors: false, year: false, source: false, tranche: false }
                        if (!formData.title) errors.title = true
                        if (!formData.authors) errors.authors = true
                        if (!formData.year) errors.year = true
                        if (!formData.source) errors.source = true
                        if (!formData.tranche) errors.tranche = true
                        setGenericErrors(errors)
                        
                        // Validation d'année
                        const yearInput = document.getElementById('year') as HTMLInputElement
                        if (yearInput && parseInt(yearInput.value) > getCurrentYear()) {
                          setYearError("L'année ne peut pas être supérieure à l'année actuelle")
                          return
                        }
                        
                        // Validation lien OU justificatif
                        if (!formData.lien && formData.justificatifs.length === 0) {
                          setLienJustificatifError("Veuillez fournir soit un lien, soit un justificatif.")
                          return
                        }
                        
                        // Si il y a des erreurs, ne pas continuer
                        if (Object.values(errors).some(Boolean)) {
                          return
                        }
                        
                        console.log("Publication ajoutée manuellement", { 
                          category: selectedCategory,
                          subCategory: selectedSubCategory,
                          formData
                        })
                        
                        // Reset form
                        setFormData({
                          title: "",
                          authors: "",
                          year: new Date().getFullYear(),
                          journal: "",
                          doi: "",
                          orcid: "",
                          source: "",
                          abstract: "",
                          lien: "",
                          justificatifs: [],
                          tranche: ""
                        })
                        setLienJustificatifError("")
                        setYearError("")
                        setGenericErrors({ title: false, authors: false, year: false, source: false, tranche: false })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter la publication
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}