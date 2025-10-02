"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Eye, FileText, Calendar, Building, Users, DollarSign, Target, Upload, Plus, Info, CheckCircle } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface Programme {
  id: string
  name: string
  organisme: string
  dateDebut: string
  dateFin: string
  description: string
  budget: number
  nombreProjets: number
  objectifs?: string[]
  criteres?: string[]
  documents?: string[]
}

interface Member {
  id: string
  nom: string
  prenom: string
  etat: string
  titre: string
  qualite: string
  etablissement: string
}

export default function ListeProgrammes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOrganisme, setFilterOrganisme] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterAnnee, setFilterAnnee] = useState("all")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showNewProgramForm, setShowNewProgramForm] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [formData, setFormData] = useState({
    intitule: "",
    thematique: "",
    organismesPartenaires: "",
    anneeDebut: "",
    anneeFin: "",
    budget: "",
    document: null as File | null
  })
  const [organismesPartenaires, setOrganismesPartenaires] = useState<string[]>([])
  const [nouvelOrganisme, setNouvelOrganisme] = useState("")
  const [memberSearchTerm, setMemberSearchTerm] = useState("")
  
  // Référence pour le timer de réinitialisation automatique
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [formErrors, setFormErrors] = useState({
    intitule: false,
    thematique: false,
    organismesPartenaires: false,
    anneeDebut: false,
    anneeFin: false,
    budget: false,
    document: false
  })

  const [newProgramData, setNewProgramData] = useState({
    name: "",
    organisme: "",
    dateDebut: "",
    dateFin: "",
    description: "",
    budget: "",
    nombreProjets: ""
  })

  const [newProgramErrors, setNewProgramErrors] = useState({
    name: false,
    organisme: false,
    budget: false,
    dateDebut: false,
    dateFin: false,
    description: false,
    nombreProjets: false
  })
  const [showProgramCreatedMessage, setShowProgramCreatedMessage] = useState(false)
  const [createdProgramName, setCreatedProgramName] = useState("")
  const [showProjectSubmittedMessage, setShowProjectSubmittedMessage] = useState(false)
  const [submittedProjectName, setSubmittedProjectName] = useState("")
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [newMember, setNewMember] = useState({
    nom: "",
    prenom: "",
    titre: "",
    etablissement: ""
  })
  const [newMemberErrors, setNewMemberErrors] = useState({
    nom: false,
    prenom: false,
    titre: false,
    etablissement: false
  })

  // Données des programmes
  const programmes: Programme[] = [
    {
      id: "1",
      name: "Programme National de Recherche en IA",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateDebut: "2024-01-15",
      dateFin: "2026-12-31",
      description: "Programme de recherche en intelligence artificielle pour le développement de solutions innovantes",
      budget: 5000000,
      nombreProjets: 12,
      objectifs: [
        "Développer des algorithmes d'IA avancés",
        "Créer des solutions d'IA pour l'industrie",
        "Former des experts en intelligence artificielle",
        "Établir des partenariats internationaux"
      ],
      criteres: [
        "Équipe de recherche pluridisciplinaire",
        "Innovation technologique démontrée",
        "Impact économique et social",
        "Partnerships avec l'industrie"
      ],
      documents: [
        "Cahier des charges détaillé",
        "Plan de recherche",
        "Budget détaillé",
        "CV des chercheurs principaux"
      ]
    },
    {
      id: "2",
      name: "Programme de Recherche en Cybersécurité",
      organisme: "Agence Nationale de Sécurité",
      dateDebut: "2024-03-01",
      dateFin: "2027-02-28",
      description: "Développement de solutions de cybersécurité pour protéger les infrastructures critiques",
      budget: 8000000,
      nombreProjets: 8,
      objectifs: [
        "Protéger les infrastructures critiques",
        "Développer des outils de détection",
        "Former des experts en cybersécurité",
        "Créer des normes de sécurité"
      ],
      criteres: [
        "Expertise en sécurité informatique",
        "Expérience avec les infrastructures critiques",
        "Collaboration avec les autorités",
        "Innovation en matière de sécurité"
      ],
      documents: [
        "Analyse des risques",
        "Architecture de sécurité",
        "Plan de déploiement",
        "Certifications de sécurité"
      ]
    },
    {
      id: "3",
      name: "Programme de Recherche en Santé Numérique",
      organisme: "Ministère de la Santé",
      dateDebut: "2024-02-15",
      dateFin: "2026-08-31",
      description: "Innovation technologique dans le domaine de la santé et de la télémédecine",
      budget: 6000000,
      nombreProjets: 15,
      objectifs: [
        "Améliorer l'accès aux soins",
        "Développer la télémédecine",
        "Optimiser la gestion des données médicales",
        "Réduire les coûts de santé"
      ],
      criteres: [
        "Expertise médicale et technologique",
        "Validation clinique",
        "Conformité aux normes de santé",
        "Impact sur la qualité des soins"
      ],
      documents: [
        "Étude clinique préliminaire",
        "Protocole de validation",
        "Plan de déploiement médical",
        "Autorisations éthiques"
      ]
    },
    {
      id: "4",
      name: "Programme de Recherche en Énergies Renouvelables",
      organisme: "Ministère de l'Énergie",
      dateDebut: "2024-04-01",
      dateFin: "2027-03-31",
      description: "Développement de technologies d'énergies renouvelables et d'efficacité énergétique",
      budget: 7500000,
      nombreProjets: 10,
      objectifs: [
        "Réduire la dépendance énergétique",
        "Développer les énergies vertes",
        "Améliorer l'efficacité énergétique",
        "Créer des emplois verts"
      ],
      criteres: [
        "Innovation technologique énergétique",
        "Impact environnemental positif",
        "Viabilité économique",
        "Potentiel de déploiement"
      ],
      documents: [
        "Étude d'impact environnemental",
        "Analyse technico-économique",
        "Plan de déploiement industriel",
        "Certifications énergétiques"
      ]
    },
    {
      id: "5",
      name: "Programme de Recherche en Agriculture Intelligente",
      organisme: "Ministère de l'Agriculture",
      dateDebut: "2024-05-01",
      dateFin: "2026-10-31",
      description: "Intégration des technologies numériques dans l'agriculture pour améliorer la productivité",
      budget: 4000000,
      nombreProjets: 6,
      objectifs: [
        "Améliorer la productivité agricole",
        "Optimiser l'utilisation des ressources",
        "Réduire l'impact environnemental",
        "Moderniser l'agriculture"
      ],
      criteres: [
        "Expertise agricole et technologique",
        "Tests sur le terrain",
        "Impact sur la productivité",
        "Adoption par les agriculteurs"
      ],
      documents: [
        "Étude de faisabilité agricole",
        "Protocole de test terrain",
        "Plan de formation agricole",
        "Évaluation d'impact"
      ]
    },
    {
      id: "6",
      name: "Programme de Recherche en Transport Durable",
      organisme: "Ministère des Transports",
      dateDebut: "2024-06-01",
      dateFin: "2027-05-31",
      description: "Développement de solutions de transport durable et intelligent",
      budget: 9000000,
      nombreProjets: 9,
      objectifs: [
        "Réduire les émissions de CO2",
        "Améliorer la mobilité urbaine",
        "Développer les transports électriques",
        "Optimiser les flux de transport"
      ],
      criteres: [
        "Innovation en transport durable",
        "Réduction des émissions",
        "Amélioration de la mobilité",
        "Intégration urbaine"
      ],
      documents: [
        "Étude d'impact environnemental",
        "Plan de mobilité urbaine",
        "Analyse technico-économique",
        "Certifications de transport"
      ]
    },
    {
      id: "7",
      name: "Programme de Recherche en Nanotechnologies (Expiré)",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateDebut: "2022-01-01",
      dateFin: "2023-12-31",
      description: "Développement de nanotechnologies pour applications médicales et industrielles",
      budget: 3500000,
      nombreProjets: 7,
      objectifs: [
        "Développer des nanomatériaux innovants",
        "Applications médicales des nanotechnologies",
        "Transfert technologique vers l'industrie",
        "Formation d'experts en nanotechnologies"
      ],
      criteres: [
        "Expertise en nanosciences",
        "Applications pratiques démontrées",
        "Potentiel industriel",
        "Sécurité des nanomatériaux"
      ],
      documents: [
        "Étude de toxicité",
        "Protocoles de sécurité",
        "Plan de transfert technologique",
        "Certifications de sécurité"
      ]
    },
    {
      id: "8",
      name: "Programme de Recherche en Biotechnologies (Expiré)",
      organisme: "Ministère de la Santé",
      dateDebut: "2021-03-01",
      dateFin: "2023-02-28",
      description: "Développement de biotechnologies pour la santé et l'environnement",
      budget: 4200000,
      nombreProjets: 11,
      objectifs: [
        "Développer des thérapies innovantes",
        "Solutions environnementales biotechnologiques",
        "Améliorer la production agricole",
        "Créer des bioproduits"
      ],
      criteres: [
        "Expertise en biotechnologies",
        "Validation biologique",
        "Impact environnemental positif",
        "Potentiel commercial"
      ],
      documents: [
        "Études précliniques",
        "Évaluation environnementale",
        "Plan de commercialisation",
        "Autorisations réglementaires"
      ]
    },
    {
      id: "9",
      name: "Programme de Recherche en Intelligence Artificielle Avancée (Expiré)",
      organisme: "Agence Nationale de Sécurité",
      dateDebut: "2020-09-01",
      dateFin: "2022-08-31",
      description: "Développement d'algorithmes d'IA avancés pour la sécurité nationale",
      budget: 6800000,
      nombreProjets: 14,
      objectifs: [
        "Développer des systèmes d'IA de sécurité",
        "Protection contre les cyberattaques",
        "Surveillance intelligente",
        "Détection de menaces avancées"
      ],
      criteres: [
        "Expertise en IA et sécurité",
        "Tests de robustesse",
        "Conformité aux normes de sécurité",
        "Intégration avec les systèmes existants"
      ],
      documents: [
        "Analyse de sécurité",
        "Tests de pénétration",
        "Plan de déploiement sécurisé",
        "Certifications de sécurité"
      ]
    }
  ]

  // Données des membres
  const [availableMembers, setAvailableMembers] = useState<Member[]>([
    { id: "1", nom: "Benali", prenom: "Ahmed", etat: "Actif", titre: "Dr.", qualite: "Membre directeur", etablissement: "Ministère de l'Enseignement Supérieur" },
    { id: "2", nom: "Zahra", prenom: "Fatima", etat: "Actif", titre: "Dr.", qualite: "Membre associé", etablissement: "Agence Nationale de Sécurité" },
    { id: "3", nom: "El Harti", prenom: "Sara", etat: "Actif", titre: "Dr.", qualite: "Chercheur", etablissement: "Ministère de la Santé" },
    { id: "4", nom: "Lahby", prenom: "Mohamed", etat: "Actif", titre: "Dr.", qualite: "Membre directeur", etablissement: "Ministère de l'Énergie" },
    { id: "5", nom: "Alaoui", prenom: "Karim", etat: "Actif", titre: "Pr.", qualite: "Expert", etablissement: "Ministère de l'Agriculture" },
    { id: "6", nom: "Bennani", prenom: "Amina", etat: "Actif", titre: "Dr.", qualite: "Membre associé", etablissement: "Ministère des Transports" }
  ])

  // Thématiques disponibles
  const thematiques = [
    "Intelligence Artificielle",
    "Machine Learning",
    "Deep Learning",
    "Traitement du Langage Naturel",
    "Vision par Ordinateur",
    "Robotique",
    "Cybersécurité",
    "Blockchain",
    "Internet des Objets",
    "Big Data",
    "Cloud Computing",
    "Autres"
  ]

  // Fonction pour vérifier si un programme est en cours
  const isProgrammeActif = (dateFin: string) => {
    return new Date(dateFin) >= new Date()
  }

  // Filtrage des programmes
  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.organisme.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrganisme = filterOrganisme === "all" || programme.organisme === filterOrganisme
    const matchesStatut = filterStatut === "all" || 
      (filterStatut === "en_cours" && isProgrammeActif(programme.dateFin)) ||
      (filterStatut === "expire" && !isProgrammeActif(programme.dateFin))
    const matchesAnnee = filterAnnee === "all" || 
      new Date(programme.dateDebut).getFullYear().toString() === filterAnnee ||
      new Date(programme.dateFin).getFullYear().toString() === filterAnnee
    const matchesProgramme = filterProgramme === "all" || programme.name === filterProgramme
    
    return matchesSearch && matchesOrganisme && matchesStatut && matchesAnnee && matchesProgramme
  })

  // Liste des organismes uniques pour le filtre
  const uniqueOrganismes = Array.from(new Set(programmes.map(p => p.organisme)))

  // Fonction pour formater le budget
  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Fonction pour soumettre un projet
  const handleSoumettreProjet = (programme: Programme) => {
    setSelectedProgramme(programme)
    setShowSubmitModal(true)
    // Reset form data
    setFormData({
      intitule: "",
      thematique: "",
      organismesPartenaires: "",
      anneeDebut: "",
      anneeFin: "",
      budget: "",
      document: null
    })
    setSelectedMembers([])
    setOrganismesPartenaires([])
    setNouvelOrganisme("")
  }

  // Fonction pour voir les détails
  const handleVoirDetails = (programme: Programme) => {
    setSelectedProgramme(programme)
    setShowDetailsModal(true)
  }

  // Fonctions pour le formulaire
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Effacer l'erreur pour ce champ quand l'utilisateur commence à taper
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: false
      }))
    }
  }

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      document: file
    }))
  }

  const handleAddOrganisme = () => {
    if (nouvelOrganisme.trim()) {
      setOrganismesPartenaires(prev => [...prev, nouvelOrganisme.trim()])
      setNouvelOrganisme("")
    }
  }

  const handleRemoveOrganisme = (index: number) => {
    setOrganismesPartenaires(prev => prev.filter((_, i) => i !== index))
  }

  // Filtrage des membres par recherche
  const filteredMembers = availableMembers.filter(member => {
    const searchLower = memberSearchTerm.toLowerCase()
    const fullName = `${member.nom} ${member.prenom}`.toLowerCase()
    const titre = member.titre.toLowerCase()
    const qualite = member.qualite.toLowerCase()
    
    return fullName.includes(searchLower) || 
           titre.includes(searchLower) || 
           qualite.includes(searchLower)
  })

  const handleMemberSelect = (memberId: string) => {
    if (!selectedMembers.includes(memberId)) {
      setSelectedMembers(prev => [...prev, memberId])
    }
  }

  const handleAddNewMember = () => {
    // Validation
    const errors = {
      nom: !newMember.nom.trim(),
      prenom: !newMember.prenom.trim(),
      titre: !newMember.titre.trim(),
      etablissement: !newMember.etablissement.trim()
    }
    
    setNewMemberErrors(errors)
    
    if (Object.values(errors).some(error => error)) {
      return
    }
    
    // Créer un nouveau membre
    const newMemberData: Member = {
      id: Date.now().toString(),
      nom: newMember.nom.trim(),
      prenom: newMember.prenom.trim(),
      etat: "Actif",
      titre: newMember.titre.trim(),
      qualite: "Membre externe",
      etablissement: newMember.etablissement.trim()
    }
    
    // Ajouter à la liste des membres disponibles
    setAvailableMembers(prev => [...prev, newMemberData])
    
    // Ajouter aux membres sélectionnés
    setSelectedMembers(prev => [...prev, newMemberData.id])
    
    // Réinitialiser le formulaire
    setNewMember({
      nom: "",
      prenom: "",
      titre: "",
      etablissement: ""
    })
    
    // Fermer le modal
    setShowAddMemberModal(false)
  }

  const handleNewMemberInputChange = (field: string, value: string) => {
    setNewMember(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Effacer l'erreur pour ce champ
    if (newMemberErrors[field as keyof typeof newMemberErrors]) {
      setNewMemberErrors(prev => ({
        ...prev,
        [field]: false
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation des champs obligatoires
    const errors = {
      intitule: !formData.intitule.trim(),
      thematique: !formData.thematique,
      organismesPartenaires: organismesPartenaires.length === 0,
      anneeDebut: !formData.anneeDebut,
      anneeFin: !formData.anneeFin,
      budget: !formData.budget || formData.budget === "0",
      document: !formData.document
    }
    
    setFormErrors(errors)
    
    // Vérifier s'il y a des erreurs
    if (Object.values(errors).some(Boolean)) {
      return
    }
    
    // Ici on pourrait envoyer les données au serveur
    console.log("Soumission du projet:", {
      programme: selectedProgramme,
      ...formData,
      organismesPartenaires: organismesPartenaires,
      membres: selectedMembers
    })
    // Message de succès et fermeture de la modal
    setSubmittedProjectName(formData.intitule)
    setShowProjectSubmittedMessage(true)
    setShowSubmitModal(false)
    setFormErrors({
      intitule: false,
      thematique: false,
      organismesPartenaires: false,
      anneeDebut: false,
      anneeFin: false,
      budget: false,
      document: false
    })
  }

  const handleNewProgramInputChange = (field: string, value: string) => {
    setNewProgramData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Effacer l'erreur pour ce champ quand l'utilisateur commence à taper
    if (newProgramErrors[field as keyof typeof newProgramErrors]) {
      setNewProgramErrors(prev => ({
        ...prev,
        [field]: false
      }))
    }
  }

  const handleCreateNewProgram = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation des champs obligatoires
    const errors = {
      name: !newProgramData.name.trim(),
      organisme: !newProgramData.organisme.trim(),
      dateDebut: !newProgramData.dateDebut,
      dateFin: !newProgramData.dateFin,
      description: !newProgramData.description.trim(),
      budget: !newProgramData.budget || newProgramData.budget === "0",
      nombreProjets: !newProgramData.nombreProjets || newProgramData.nombreProjets === "0"
    }
    
    setNewProgramErrors(errors)
    
    console.log("Erreurs de validation:", errors)
    
    // Vérifier s'il y a des erreurs
    if (Object.values(errors).some(Boolean)) {
      console.log("Formulaire bloqué à cause d'erreurs")
      return
    }
    
    // Ici on pourrait envoyer les données au serveur
    console.log("Création du nouveau programme:", newProgramData)
    // Message de succès et fermeture de la modal
    setCreatedProgramName(newProgramData.name)
    setShowProgramCreatedMessage(true)
    setShowNewProgramForm(false)
    setNewProgramData({
      name: "",
      organisme: "",
      dateDebut: "",
      dateFin: "",
      description: "",
      budget: "",
      nombreProjets: ""
    })
    setNewProgramErrors({
      name: false,
      organisme: false,
      budget: false,
      dateDebut: false,
      dateFin: false,
      description: false,
      nombreProjets: false
    })
  }

  const selectedMembersData = availableMembers.filter(member => 
    selectedMembers.includes(member.id)
  )

  // Fonction de réinitialisation automatique des filtres
  const resetFilters = () => {
    setSearchTerm("")
    setFilterOrganisme("all")
    setFilterStatut("all")
    setFilterAnnee("all")
    setFilterProgramme("all")
  }

  // Logique de réinitialisation automatique après 5 minutes d'inactivité
  useEffect(() => {
    const handleUserActivity = () => {
      // Annuler le timer précédent
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
      
      // Démarrer un nouveau timer de 5 minutes
      resetTimerRef.current = setTimeout(() => {
        resetFilters()
      }, 5 * 60 * 1000) // 5 minutes
    }

    // Écouter les événements d'activité utilisateur
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true)
    })

    // Démarrer le timer initial
    handleUserActivity()

    // Nettoyage
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true)
      })
    }
  }, [])

  // Réinitialisation automatique quand l'utilisateur quitte la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      resetFilters()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="mx-auto max-w-5xl">
            {/* Header simple */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Liste des programmes</h1>
              <p className="text-gray-600 mt-1">Consultez les programmes de recherche disponibles et soumettre vos projets</p>
            </div>

            {/* Section de recherche et filtres améliorée */}
            <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Recherche et filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barre de recherche principale */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Rechercher un programme..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                {/* Filtres en grille */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Organisme</Label>
                    <Select value={filterOrganisme} onValueChange={setFilterOrganisme}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les organismes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les organismes</SelectItem>
                        {uniqueOrganismes.map((organisme) => (
                          <SelectItem key={organisme} value={organisme}>
                            {organisme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Statut</Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="expire">Expiré</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Année</Label>
                    <Select value={filterAnnee} onValueChange={setFilterAnnee}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Toutes les années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les années</SelectItem>
                        {Array.from(new Set(programmes.flatMap(p => [
                          new Date(p.dateDebut).getFullYear(),
                          new Date(p.dateFin).getFullYear()
                        ]))).sort((a, b) => b - a).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Programme</Label>
                    <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les programmes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les programmes</SelectItem>
                        {programmes.map((programme) => (
                          <SelectItem key={programme.id} value={programme.name}>
                            {programme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>


              </CardContent>
            </Card>

            {/* Statistiques simples */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Programmes en cours</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {programmes.filter(p => isProgrammeActif(p.dateFin)).length}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total projets</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {programmes.reduce((sum, p) => sum + p.nombreProjets, 0)}
                      </p>
                    </div>
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des programmes simplifiée */}
            <div className="space-y-4">
              {filteredProgrammes.map((programme) => (
                <Card key={programme.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* En-tête avec titre et statut */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">{programme.name}</h3>
                          <Badge 
                            className={isProgrammeActif(programme.dateFin) 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                            }
                          >
                            {isProgrammeActif(programme.dateFin) ? "En cours" : "Expiré"}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Informations du programme */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Date début</p>
                            <p className="text-sm text-gray-900">
                              {new Date(programme.dateDebut).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Date fin</p>
                            <p className="text-sm text-gray-900">
                              {new Date(programme.dateFin).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Organisme</p>
                            <p className="text-sm text-gray-900">{programme.organisme}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600">{programme.description}</p>
                      
                      {/* Boutons d'action en bas */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100 justify-end">
                        <Button
                          onClick={() => handleSoumettreProjet(programme)}
                          disabled={!isProgrammeActif(programme.dateFin)}
                          size="sm"
                          className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white text-xs h-7 px-3"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Soumettre un projet
                        </Button>
                        <Button
                          onClick={() => handleVoirDetails(programme)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs h-7 px-3"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Carte pour créer un nouveau programme */}
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Plus className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Votre programme n'est pas dans la liste ?
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Créez un nouveau programme de recherche personnalisé
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowNewProgramForm(true)}
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un nouveau programme
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message si aucun programme trouvé */}
            {filteredProgrammes.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Aucun programme trouvé avec les critères de recherche actuels</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Modal de détails du programme */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedProgramme?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProgramme && (
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Organisme</p>
                      <p className="text-base text-gray-900 font-medium">{selectedProgramme.organisme}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Période</p>
                      <p className="text-base text-gray-900 font-medium">
                        {new Date(selectedProgramme.dateDebut).toLocaleDateString('fr-FR')} - {new Date(selectedProgramme.dateFin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nombre de projets</p>
                      <p className="text-base text-gray-900 font-medium">{selectedProgramme.nombreProjets} projets</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-gray-500" />
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                  </div>
                  <Badge 
                    className={isProgrammeActif(selectedProgramme.dateFin) 
                      ? "bg-green-100 text-green-800 text-sm px-3 py-1 font-medium" 
                      : "bg-gray-100 text-gray-600 text-sm px-3 py-1 font-medium"
                    }
                  >
                    {isProgrammeActif(selectedProgramme.dateFin) ? "Actif" : "Expiré"}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">{selectedProgramme.description}</p>
              </div>

              {/* Objectifs */}
              {selectedProgramme.objectifs && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objectifs du programme
                  </h3>
                  <ul className="space-y-2">
                    {selectedProgramme.objectifs.map((objectif, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-uh2c-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{objectif}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Critères d'éligibilité */}
              {selectedProgramme.criteres && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Critères d'éligibilité
                  </h3>
                  <ul className="space-y-2">
                    {selectedProgramme.criteres.map((critere, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-uh2c-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{critere}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documents requis */}
              {selectedProgramme.documents && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents requis
                  </h3>
                  <ul className="space-y-2">
                    {selectedProgramme.documents.map((document, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-uh2c-blue rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{document}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 justify-end">
                <Button
                  onClick={() => handleSoumettreProjet(selectedProgramme)}
                  disabled={!isProgrammeActif(selectedProgramme.dateFin)}
                  size="sm"
                  className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white text-sm h-8 px-4"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Soumettre un projet
                </Button>
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-sm h-8 px-4"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de soumission de projet */}
      <Dialog open={showSubmitModal} onOpenChange={setShowSubmitModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Soumettre un projet
            </DialogTitle>
          </DialogHeader>
          
          {selectedProgramme && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Informations du programme */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informations du programme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Programme</Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                        <p className="font-medium text-gray-900">{selectedProgramme.name}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-600">Typologie</Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                        <p className="text-gray-900">Projet de recherche financé</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-600">Descriptif du sous programme</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                      <p className="text-gray-900">{selectedProgramme.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations du projet */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Informations du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="intitule" className={`text-xs font-medium ${formErrors.intitule ? 'text-red-600' : 'text-gray-600'}`}>
                        Intitulé du projet <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="intitule"
                        placeholder="Titre du projet"
                        value={formData.intitule}
                        onChange={(e) => handleInputChange("intitule", e.target.value)}
                        className={`mt-1 h-9 text-sm ${formErrors.intitule ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {formErrors.intitule && (
                        <p className="text-red-500 text-xs mt-1">L'intitulé du projet est obligatoire</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="thematique" className={`text-xs font-medium ${formErrors.thematique ? 'text-red-600' : 'text-gray-600'}`}>
                        Thématique du projet <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.thematique} onValueChange={(value) => handleInputChange("thematique", value)}>
                        <SelectTrigger className={`mt-1 h-9 text-sm ${formErrors.thematique ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="Sélectionnez une thématique" />
                        </SelectTrigger>
                        <SelectContent>
                          {thematiques.map((thematique) => (
                            <SelectItem key={thematique} value={thematique}>
                              {thematique}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.thematique && (
                        <p className="text-red-500 text-xs mt-1">La thématique du projet est obligatoire</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="organismesPartenaires" className={`text-xs font-medium ${formErrors.organismesPartenaires ? 'text-red-600' : 'text-gray-600'}`}>
                      Organismes partenaires <span className="text-red-500">*</span>
                    </Label>
                    
                    {/* Liste des organismes ajoutés */}
                    {organismesPartenaires.length > 0 && (
                      <div className="mt-2 mb-3">
                        <div className="flex flex-wrap gap-2">
                          {organismesPartenaires.map((organisme, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-uh2c-blue text-white">
                              {organisme}
                              <button
                                type="button"
                                onClick={() => handleRemoveOrganisme(index)}
                                className="ml-2 text-white hover:text-red-200"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Champ pour ajouter un nouvel organisme */}
                    <div className="flex gap-2">
                      <Input
                        id="organismesPartenaires"
                        placeholder="Ex: CHU Hassan II"
                        value={nouvelOrganisme}
                        onChange={(e) => setNouvelOrganisme(e.target.value)}
                        className={`flex-1 h-9 text-sm ${formErrors.organismesPartenaires ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddOrganisme()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddOrganisme}
                        className="h-9 px-3 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
                        disabled={!nouvelOrganisme.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {formErrors.organismesPartenaires && (
                      <p className="text-red-500 text-xs mt-1">Au moins un organisme partenaire est obligatoire</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Membres associés */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Membres associés</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500 mb-3">
                    Sélectionnez les membres impliqués dans cette soumission
                  </p>
                  
                  <div className="space-y-3">
                    {/* Liste déroulante des membres avec recherche intégrée */}
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Sélectionner un membre</Label>
                      <Select onValueChange={(value) => handleMemberSelect(value)}>
                        <SelectTrigger className="mt-1 h-9 text-sm">
                          <SelectValue placeholder="Rechercher et choisir un membre..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {/* Champ de recherche dans le dropdown */}
                          <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                placeholder="Rechercher un membre..."
                                value={memberSearchTerm}
                                onChange={(e) => setMemberSearchTerm(e.target.value)}
                                className="pl-8 h-8 text-sm border-0 focus:ring-0 focus:border-0"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                          
                          {/* Liste des membres filtrés */}
                          {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{member.nom} {member.prenom}</span>
                                  <div className="flex items-center gap-2 text-gray-500">
                                    <span className="text-xs ml-2">{member.titre}</span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1 text-sm text-gray-500">
                              Aucun membre trouvé
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Bouton pour ajouter un autre membre */}
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddMemberModal(true)}
                        className="w-full h-9 text-sm border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un autre membre
                      </Button>
                    </div>

                    {/* Membres sélectionnés */}
                    {selectedMembersData.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Membres sélectionnés :</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedMembersData.map((member) => (
                            <span key={member.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-uh2c-blue text-white">
                              {member.titre} {member.nom} {member.prenom}
                              <button
                                type="button"
                                onClick={() => handleMemberToggle(member.id)}
                                className="ml-2 text-white hover:text-red-200"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Durée et budget */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Durée de projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="anneeDebut" className={`text-xs font-medium ${formErrors.anneeDebut ? 'text-red-600' : 'text-gray-600'}`}>
                        Date de début <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.anneeDebut} onValueChange={(value) => handleInputChange("anneeDebut", value)}>
                        <SelectTrigger className={`mt-1 h-9 text-sm ${formErrors.anneeDebut ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="Sélectionnez la date" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.anneeDebut && (
                        <p className="text-red-500 text-xs mt-1">La date de début est obligatoire</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="anneeFin" className={`text-xs font-medium ${formErrors.anneeFin ? 'text-red-600' : 'text-gray-600'}`}>
                        Date de fin <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.anneeFin} onValueChange={(value) => handleInputChange("anneeFin", value)}>
                        <SelectTrigger className={`mt-1 h-9 text-sm ${formErrors.anneeFin ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                          <SelectValue placeholder="Sélectionnez la date" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.anneeFin && (
                        <p className="text-red-500 text-xs mt-1">La date de fin est obligatoire</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget" className={`text-xs font-medium ${formErrors.budget ? 'text-red-600' : 'text-gray-600'}`}>
                      Budget proposé en dirhams <span className="text-red-500">*</span>
                    </Label>
                                          <Input
                        id="budget"
                        type="number"
                        placeholder="0"
                        value={formData.budget}
                        onChange={(e) => handleInputChange("budget", e.target.value)}
                        className={`mt-1 h-9 text-sm ${formErrors.budget ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                    {formErrors.budget && (
                      <p className="text-red-500 text-xs mt-1">Le budget doit être supérieur à 0</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Document */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Document intégral du projet à signer<span className="text-red-500">*</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1 text-sm">Confidentialité des documents</h4>
                        <p className="text-xs text-blue-800">
                          Tous les documents soumis dans cette section sont traités de manière strictement confidentielle. 
                          Seuls les membres autorisés du comité d'évaluation auront accès à ces informations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`border-2 border-dashed rounded p-3 text-center ${formErrors.document ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                    <Upload className={`mx-auto h-8 w-8 ${formErrors.document ? 'text-red-400' : 'text-gray-400'}`} />
                    <div className="mt-2">
                      <p className={`text-xs ${formErrors.document ? 'text-red-600' : 'text-gray-600'}`}>
                        Cliquez pour télécharger ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX jusqu'à 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="document-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={`mt-3 h-8 text-xs ${formErrors.document ? 'border-red-300 text-red-600 hover:bg-red-50' : ''}`}
                      onClick={() => document.getElementById('document-upload')?.click()}
                    >
                      Sélectionner un fichier
                    </Button>
                  </div>
                  {formErrors.document && (
                    <p className="text-red-500 text-xs mt-1">Le document est obligatoire</p>
                  )}

                  {formData.document && (
                    <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-800">{formData.document.name}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Boutons d'action */}
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 h-9 text-sm"
                >
                  Retour
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 h-9 text-sm"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white h-9 text-sm"
                >
                  Soumettre la demande de projet
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal pour créer un nouveau programme */}
      <Dialog open={showNewProgramForm} onOpenChange={setShowNewProgramForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Créer un nouveau programme
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateNewProgram} className="space-y-6">
            {/* Informations du programme */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Informations du programme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="programmeName" className={`text-sm font-medium ${newProgramErrors.name ? 'text-red-600' : 'text-gray-700'}`}>
                    Nom du programme <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="programmeName"
                    placeholder="Ex: Programme de Recherche en Santé Numérique"
                    value={newProgramData.name}
                    onChange={(e) => handleNewProgramInputChange("name", e.target.value)}
                    className={`mt-1 h-10 text-sm ${newProgramErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {newProgramErrors.name && (
                    <p className="text-red-500 text-xs mt-1">Le nom du programme est obligatoire</p>
                  )}
                </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="programmeOrganisme" className={`text-sm font-medium ${newProgramErrors.organisme ? 'text-red-600' : 'text-gray-700'}`}>
                        Organisme <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="programmeOrganisme"
                        placeholder="Ex: Ministère de la Santé"
                        value={newProgramData.organisme}
                        onChange={(e) => handleNewProgramInputChange("organisme", e.target.value)}
                        className={`mt-1 h-10 text-sm ${newProgramErrors.organisme ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {newProgramErrors.organisme && (
                        <p className="text-red-500 text-xs mt-1">L'organisme est obligatoire</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="programmeBudget" className={`text-sm font-medium ${newProgramErrors.budget ? 'text-red-600' : 'text-gray-700'}`}>
                        Budget en dirhams <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="programmeBudget"
                        type="number"
                        placeholder="0"
                        value={newProgramData.budget}
                        onChange={(e) => handleNewProgramInputChange("budget", e.target.value)}
                        className={`mt-1 h-10 text-sm ${newProgramErrors.budget ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {newProgramErrors.budget && (
                        <p className="text-red-500 text-xs mt-1">Le budget doit être supérieur à 0</p>
                      )}
                    </div>
                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="programmeDateDebut" className={`text-sm font-medium ${newProgramErrors.dateDebut ? 'text-red-600' : 'text-gray-700'}`}>
                        Date de début <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="programmeDateDebut"
                        type="date"
                        value={newProgramData.dateDebut}
                        onChange={(e) => handleNewProgramInputChange("dateDebut", e.target.value)}
                        className={`mt-1 h-10 text-sm ${newProgramErrors.dateDebut ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {newProgramErrors.dateDebut && (
                        <p className="text-red-500 text-xs mt-1">La date de début est obligatoire</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="programmeDateFin" className={`text-sm font-medium ${newProgramErrors.dateFin ? 'text-red-600' : 'text-gray-700'}`}>
                        Date de fin <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="programmeDateFin"
                        type="date"
                        value={newProgramData.dateFin}
                        onChange={(e) => handleNewProgramInputChange("dateFin", e.target.value)}
                        className={`mt-1 h-10 text-sm ${newProgramErrors.dateFin ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {newProgramErrors.dateFin && (
                        <p className="text-red-500 text-xs mt-1">La date de fin est obligatoire</p>
                      )}
                    </div>
                  </div>

                <div>
                  <Label htmlFor="programmeDescription" className={`text-sm font-medium ${newProgramErrors.description ? 'text-red-600' : 'text-gray-700'}`}>
                    Description du programme <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="programmeDescription"
                    placeholder="Décrivez les objectifs et la portée du programme..."
                    value={newProgramData.description}
                    onChange={(e) => handleNewProgramInputChange("description", e.target.value)}
                    className={`mt-1 w-full h-24 p-3 text-sm border rounded-md resize-none ${newProgramErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                  />
                  {newProgramErrors.description && (
                    <p className="text-red-500 text-xs mt-1">La description du programme est obligatoire</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="programmeNombreProjets" className={`text-sm font-medium ${newProgramErrors.nombreProjets ? 'text-red-600' : 'text-gray-700'}`}>
                    Nombre de projets prévus <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="programmeNombreProjets"
                    type="number"
                    placeholder="0"
                    value={newProgramData.nombreProjets}
                    onChange={(e) => handleNewProgramInputChange("nombreProjets", e.target.value)}
                    className={`mt-1 h-10 text-sm ${newProgramErrors.nombreProjets ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {newProgramErrors.nombreProjets && (
                    <p className="text-red-500 text-xs mt-1">Le nombre de projets doit être supérieur à 0</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewProgramForm(false)}
                className="flex-1 h-10 text-sm"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white h-10 text-sm"
              >
                Créer le programme
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Message de confirmation de création de programme */}
      {showProgramCreatedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Demande envoyée au pôle de recherche !</h3>
              <p className="text-sm text-gray-600 mb-4">
                Votre demande de création du programme <strong>"{createdProgramName}"</strong> a été enregistrée. Le pôle de recherche vous contactera pour traiter votre demande.
              </p>
              <Button
                onClick={() => setShowProgramCreatedMessage(false)}
                className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
              >
                Continuer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message de confirmation de soumission de projet */}
      {showProjectSubmittedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Demande envoyée au pôle de recherche !</h3>
              <p className="text-sm text-gray-600 mb-4">
                Votre demande a été enregistrée. Le pôle de recherche vous contactera pour ajouter le nouveau programme.
              </p>
              <Button
                onClick={() => setShowProjectSubmittedMessage(false)}
                className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
              >
                Continuer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour ajouter un nouveau membre */}
      <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Ajouter un nouveau membre</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="newMemberNom" className={`text-sm font-medium ${newMemberErrors.nom ? 'text-red-600' : 'text-gray-700'}`}>
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newMemberNom"
                placeholder="Nom du membre"
                value={newMember.nom}
                onChange={(e) => handleNewMemberInputChange("nom", e.target.value)}
                className={`mt-1 h-10 text-sm ${newMemberErrors.nom ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {newMemberErrors.nom && (
                <p className="text-red-500 text-xs mt-1">Le nom est obligatoire</p>
              )}
            </div>

            <div>
              <Label htmlFor="newMemberPrenom" className={`text-sm font-medium ${newMemberErrors.prenom ? 'text-red-600' : 'text-gray-700'}`}>
                Prénom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newMemberPrenom"
                placeholder="Prénom du membre"
                value={newMember.prenom}
                onChange={(e) => handleNewMemberInputChange("prenom", e.target.value)}
                className={`mt-1 h-10 text-sm ${newMemberErrors.prenom ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {newMemberErrors.prenom && (
                <p className="text-red-500 text-xs mt-1">Le prénom est obligatoire</p>
              )}
            </div>

            <div>
              <Label htmlFor="newMemberTitre" className={`text-sm font-medium ${newMemberErrors.titre ? 'text-red-600' : 'text-gray-700'}`}>
                Titre <span className="text-red-500">*</span>
              </Label>
              <Select value={newMember.titre} onValueChange={(value) => handleNewMemberInputChange("titre", value)}>
                <SelectTrigger className={`mt-1 h-10 text-sm ${newMemberErrors.titre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionnez un titre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Pr.">Pr.</SelectItem>
                  <SelectItem value="M.">M.</SelectItem>
                  <SelectItem value="Mme.">Mme.</SelectItem>
                </SelectContent>
              </Select>
              {newMemberErrors.titre && (
                <p className="text-red-500 text-xs mt-1">Le titre est obligatoire</p>
              )}
            </div>

            <div>
              <Label htmlFor="newMemberEtablissement" className={`text-sm font-medium ${newMemberErrors.etablissement ? 'text-red-600' : 'text-gray-700'}`}>
                Établissement <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newMemberEtablissement"
                placeholder="Ex: Université Hassan II, Ministère..."
                value={newMember.etablissement}
                onChange={(e) => handleNewMemberInputChange("etablissement", e.target.value)}
                className={`mt-1 h-10 text-sm ${newMemberErrors.etablissement ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {newMemberErrors.etablissement && (
                <p className="text-red-500 text-xs mt-1">L'établissement est obligatoire</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddMemberModal(false)}
              className="flex-1 h-10 text-sm"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleAddNewMember}
              className="flex-1 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white h-10 text-sm"
            >
              Ajouter le membre
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}