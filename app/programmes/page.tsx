"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MultiSelect } from "@/components/ui/multi-select"
import { Plus, Edit, Trash2, Calendar, Building, DollarSign, Search, FolderOpen, BookOpen, Eye, Target, Users, X, CheckCircle, AlignLeft, Upload, AlertCircle, ChevronDown, FileText, Tag } from "lucide-react"
import { Header } from "@/components/header"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Checkbox } from "@/components/ui/checkbox"

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
  sourcesFinancement?: string[]
  autresSourcesFinancement?: string[]
  statut: "en_cours" | "termine" | "inactif"
  type?: "demande" | "créé"
}

interface AppelProjet {
  id: string
  titre: string
  programme: string
  organisme: string
  dateOuverture: string
  dateLimite: string
  description: string
  budget: number
  nombreProjetsAttendus: number
  statut: "ouvert" | "ferme" | "en_evaluation"
  sourcesFinancement?: string[]
  autresSourcesFinancement?: string[]
  criteres?: string[]
  documents?: string[]
  type?: "demande" | "créé"
}

export default function ProgrammesPage() {
  const [activeTab, setActiveTab] = useState<"appels" | "programmes">("appels")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOrganisme, setFilterOrganisme] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterAnnee, setFilterAnnee] = useState("all")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [filterAppelProgramme, setFilterAppelProgramme] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [showNewProgramForm, setShowNewProgramForm] = useState(false)
  const [showNewAppelForm, setShowNewAppelForm] = useState(false)
  const [showEditProgramForm, setShowEditProgramForm] = useState(false)
  const [showEditAppelForm, setShowEditAppelForm] = useState(false)
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null)
  const [selectedAppel, setSelectedAppel] = useState<AppelProjet | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showSubmitProjectModal, setShowSubmitProjectModal] = useState(false)
  const [selectedAppelForSubmit, setSelectedAppelForSubmit] = useState<AppelProjet | null>(null)
  const [selectedProgrammeForSubmit, setSelectedProgrammeForSubmit] = useState<Programme | null>(null)
  const [submitType, setSubmitType] = useState<"appel" | "programme">("appel")
  const [programmes, setProgrammes] = useState<Programme[]>([
    {
      id: "P001",
      name: "Programme National de Recherche en IA",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateDebut: "2024-01-01",
      dateFin: "2026-12-31",
      description: "Programme national dédié au développement de l'intelligence artificielle",
      budget: 5000000,
      nombreProjets: 25,
      statut: "en_cours",
      objectifs: ["Développer l'IA au Maroc", "Former des experts", "Créer des partenariats"],
      criteres: ["Équipe pluridisciplinaire", "Impact économique", "Innovation technologique"],
      type: "demande"
    },
    {
      id: "P002",
      name: "Programme de Recherche Environnementale",
      organisme: "Ministère de l'Environnement",
      dateDebut: "2023-06-01",
      dateFin: "2025-05-31",
      description: "Recherche sur les enjeux environnementaux et le développement durable",
      budget: 3000000,
      nombreProjets: 15,
      statut: "en_cours",
      objectifs: ["Protection environnementale", "Développement durable", "Innovation verte"],
      criteres: ["Impact environnemental", "Durabilité", "Innovation"],
      type: "demande"
    },
    {
      id: "P003",
      name: "Programme Énergies Renouvelables",
      organisme: "Ministère de l'Énergie",
      dateDebut: "2024-03-01",
      dateFin: "2027-02-28",
      description: "Développement des énergies renouvelables et de l'efficacité énergétique",
      budget: 8000000,
      nombreProjets: 30,
      statut: "en_cours",
      objectifs: ["Transition énergétique", "Autonomie énergétique", "Innovation technologique"],
      criteres: ["Efficacité énergétique", "Innovation", "Impact économique"],
      type: "demande"
    },
    {
      id: "P004",
      name: "Programme National de Cybersécurité",
      organisme: "Agence Nationale de Sécurité",
      dateDebut: "2024-02-01",
      dateFin: "2026-01-31",
      description: "Développement de solutions de cybersécurité pour protéger les infrastructures critiques du pays",
      budget: 4500000,
      nombreProjets: 20,
      statut: "en_cours",
      objectifs: ["Protection des infrastructures critiques", "Formation d'experts en cybersécurité", "Innovation technologique"],
      criteres: ["Expertise en cybersécurité", "Collaboration avec les autorités", "Innovation technologique"],
      type: "demande"
    },
    {
      id: "P005",
      name: "Programme de Recherche en Biotechnologie",
      organisme: "Ministère de l'Environnement",
      dateDebut: "2024-04-01",
      dateFin: "2027-03-31",
      description: "Applications biotechnologiques innovantes pour la protection et la restauration environnementale",
      budget: 3500000,
      nombreProjets: 18,
      statut: "en_cours",
      objectifs: ["Protection environnementale", "Innovation biotechnologique", "Développement durable"],
      criteres: ["Expertise biotechnologie", "Impact environnemental", "Innovation technologique"],
      type: "demande"
    },
    {
      id: "P006",
      name: "Programme IA Éducative",
      organisme: "Ministère de l'Éducation Nationale",
      dateDebut: "2024-05-01",
      dateFin: "2026-04-30",
      description: "Développement de systèmes d'IA adaptatifs pour l'apprentissage personnalisé et l'éducation inclusive",
      budget: 2800000,
      nombreProjets: 12,
      statut: "en_cours",
      objectifs: ["Amélioration de l'apprentissage", "Éducation inclusive", "Innovation pédagogique"],
      criteres: ["Expertise IA éducative", "Validation pédagogique", "Accessibilité"],
      type: "demande"
    },
    {
      id: "P007",
      name: "Programme Nanotechnologies Avancées",
      organisme: "Ministère de la Santé",
      dateDebut: "2024-06-01",
      dateFin: "2027-05-31",
      description: "Développement de nanomatériaux et nanodévices pour le diagnostic et traitement médical",
      budget: 6000000,
      nombreProjets: 15,
      statut: "en_cours",
      objectifs: ["Innovation médicale", "Développement de nanotechnologies", "Amélioration des soins"],
      criteres: ["Expertise nanotechnologies", "Validation médicale", "Innovation thérapeutique"],
      type: "demande"
    },
    {
      id: "P008",
      name: "Programme Transport du Futur",
      organisme: "Ministère des Transports",
      dateDebut: "2024-07-01",
      dateFin: "2027-06-30",
      description: "Solutions innovantes pour un système de transport intelligent, connecté et durable",
      budget: 7500000,
      nombreProjets: 22,
      statut: "en_cours",
      objectifs: ["Transport intelligent", "Mobilité durable", "Innovation technologique"],
      criteres: ["Expertise transport", "Innovation technologique", "Durabilité"],
      type: "demande"
    },
    {
      id: "P009",
      name: "Programme Agriculture 4.0",
      organisme: "Ministère de l'Agriculture",
      dateDebut: "2024-08-01",
      dateFin: "2027-07-31",
      description: "Technologies d'agriculture de précision et systèmes intelligents pour optimiser la production agricole",
      budget: 4200000,
      nombreProjets: 16,
      statut: "en_cours",
      objectifs: ["Agriculture de précision", "Optimisation de la production", "Innovation agricole"],
      criteres: ["Expertise agriculture", "Innovation technologique", "Impact économique"],
      type: "demande"
    },
    {
      id: "P010",
      name: "Programme Villes Intelligentes",
      organisme: "Ministère de l'Intérieur",
      dateDebut: "2024-09-01",
      dateFin: "2027-08-31",
      description: "Développement de solutions intelligentes pour la gestion urbaine et l'amélioration de la qualité de vie",
      budget: 5500000,
      nombreProjets: 20,
      statut: "en_cours",
      objectifs: ["Gestion urbaine intelligente", "Amélioration de la qualité de vie", "Innovation urbaine"],
      criteres: ["Expertise urbanisme", "Innovation technologique", "Impact social"],
      type: "demande"
    },
    {
      id: "P011",
      name: "Programme Innovation Numérique Avancée",
      organisme: "Ministère de l'Industrie et du Commerce",
      dateDebut: "2024-10-01",
      dateFin: "2027-09-30",
      description: "Développement de technologies numériques innovantes pour l'industrie 4.0 et la transformation digitale",
      budget: 4800000,
      nombreProjets: 18,
      statut: "en_cours",
      objectifs: ["Transformation digitale", "Innovation industrielle", "Compétitivité économique"],
      criteres: ["Expertise numérique", "Innovation technologique", "Impact industriel"],
      type: "créé"
    },
    {
      id: "P012",
      name: "Programme Recherche en Sciences Sociales",
      organisme: "Ministère de la Culture et de la Communication",
      dateDebut: "2024-11-01",
      dateFin: "2027-10-31",
      description: "Études approfondies en sciences sociales pour comprendre les dynamiques sociétales contemporaines",
      budget: 3200000,
      nombreProjets: 14,
      statut: "en_cours",
      objectifs: ["Compréhension sociétale", "Développement humain", "Politiques publiques"],
      criteres: ["Expertise sciences sociales", "Méthodologie rigoureuse", "Impact sociétal"],
      type: "créé"
    },
    {
      id: "P013",
      name: "Programme Technologies Spatiales",
      organisme: "Agence Spatiale Marocaine",
      dateDebut: "2024-12-01",
      dateFin: "2027-11-30",
      description: "Développement de technologies spatiales et satellitaires pour les applications terrestres",
      budget: 6500000,
      nombreProjets: 12,
      statut: "en_cours",
      objectifs: ["Technologies spatiales", "Applications satellitaires", "Innovation spatiale"],
      criteres: ["Expertise spatiale", "Innovation technologique", "Applications pratiques"],
      type: "créé"
    },
    {
      id: "P014",
      name: "Programme Intelligence Économique",
      organisme: "Ministère de l'Économie et des Finances",
      dateDebut: "2025-01-01",
      dateFin: "2027-12-31",
      description: "Développement de systèmes d'intelligence économique pour la prise de décision stratégique",
      budget: 3800000,
      nombreProjets: 16,
      statut: "en_cours",
      objectifs: ["Intelligence économique", "Aide à la décision", "Compétitivité nationale"],
      criteres: ["Expertise économique", "Analyse de données", "Stratégie nationale"],
      type: "créé"
    },
    {
      id: "P015",
      name: "Programme Technologies Marines",
      organisme: "Ministère de la Pêche Maritime",
      dateDebut: "2025-02-01",
      dateFin: "2028-01-31",
      description: "Développement de technologies marines pour l'exploitation durable des ressources océaniques",
      budget: 4200000,
      nombreProjets: 15,
      statut: "en_cours",
      objectifs: ["Technologies marines", "Exploitation durable", "Ressources océaniques"],
      criteres: ["Expertise marine", "Durabilité", "Innovation technologique"],
      type: "créé"
    }
  ])

  const [appelsProjets, setAppelsProjets] = useState<AppelProjet[]>([
    {
      id: "AP001",
      titre: "IA pour la santé préventive",
      programme: "Programme National de Recherche en IA",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateOuverture: "2024-01-15",
      dateLimite: "2024-06-30",
      description: "Développement d'algorithmes d'intelligence artificielle pour la prévention et le diagnostic précoce des maladies",
      budget: 800000,
      nombreProjetsAttendus: 5,
      statut: "ouvert",
      criteres: ["Expertise en IA", "Partenaire médical", "Données de qualité"],
      documents: ["Cahier des charges", "Guide de soumission", "Modèle de convention"],
      type: "demande"
    },
    {
      id: "AP002",
      titre: "Changement climatique et agriculture",
      programme: "Programme de Recherche Environnementale",
      organisme: "Ministère de l'Environnement",
      dateOuverture: "2024-02-01",
      dateLimite: "2024-07-31",
      description: "Étude des impacts du changement climatique sur l'agriculture marocaine",
      budget: 600000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      criteres: ["Expertise climatique", "Partenaire agricole", "Méthodologie robuste"],
      documents: ["Cahier des charges", "Guide méthodologique"],
      type: "demande"
    },
    {
      id: "AP003",
      titre: "Optimisation énergétique des bâtiments",
      programme: "Programme Énergies Renouvelables",
      organisme: "Ministère de l'Énergie",
      dateOuverture: "2024-03-15",
      dateLimite: "2024-08-31",
      description: "Solutions innovantes pour l'optimisation énergétique des bâtiments",
      budget: 1000000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      criteres: ["Expertise énergétique", "Partenaire industriel", "Prototype fonctionnel"],
      documents: ["Cahier des charges", "Guide technique", "Modèle de convention"],
      type: "demande"
    },
    {
      id: "AP004",
      titre: "Cybersécurité des infrastructures critiques",
      programme: "Programme National de Cybersécurité",
      organisme: "Agence Nationale de Sécurité",
      dateOuverture: "2024-04-01",
      dateLimite: "2024-09-30",
      description: "Développement de solutions de cybersécurité pour protéger les infrastructures critiques du pays",
      budget: 1500000,
      nombreProjetsAttendus: 6,
      statut: "ouvert",
      criteres: ["Expertise en cybersécurité", "Expérience infrastructure critique", "Collaboration autorités"],
      documents: ["Analyse des menaces", "Architecture de sécurité", "Plan de déploiement"],
      type: "créé"
    },
    {
      id: "AP005",
      titre: "Biotechnologie pour l'environnement",
      programme: "Programme de Recherche en Biotechnologie",
      organisme: "Ministère de l'Environnement",
      dateOuverture: "2024-04-15",
      dateLimite: "2024-10-31",
      description: "Applications biotechnologiques innovantes pour la protection et la restauration environnementale",
      budget: 900000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      criteres: ["Expertise biotechnologie", "Impact environnemental", "Innovation technologique"],
      documents: ["Projet détaillé", "Étude d'impact", "Plan de validation"],
      type: "créé"
    },
    {
      id: "AP006",
      titre: "Intelligence artificielle pour l'éducation",
      programme: "Programme IA Éducative",
      organisme: "Ministère de l'Éducation Nationale",
      dateOuverture: "2024-05-01",
      dateLimite: "2024-11-30",
      description: "Développement de systèmes d'IA adaptatifs pour l'apprentissage personnalisé et l'éducation inclusive",
      budget: 1200000,
      nombreProjetsAttendus: 5,
      statut: "ouvert",
      criteres: ["Expertise IA éducative", "Validation pédagogique", "Accessibilité"],
      documents: ["Concept pédagogique", "Prototype fonctionnel", "Plan d'évaluation"],
      type: "créé"
    },
    {
      id: "AP007",
      titre: "Nanotechnologies pour applications médicales",
      programme: "Programme Nanotechnologies Avancées",
      organisme: "Ministère de la Santé",
      dateOuverture: "2024-05-15",
      dateLimite: "2024-12-31",
      description: "Développement de nanomatériaux et nanodévices pour le diagnostic et traitement médical",
      budget: 1800000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      criteres: ["Expertise nanotechnologies", "Validation médicale", "Innovation thérapeutique"],
      documents: ["Étude de faisabilité", "Protocole de validation", "Plan de développement"],
      type: "créé"
    },
    {
      id: "AP008",
      titre: "Transport intelligent et mobilité durable",
      programme: "Programme Transport du Futur",
      organisme: "Ministère des Transports",
      dateOuverture: "2024-06-01",
      dateLimite: "2025-01-31",
      description: "Solutions innovantes pour un système de transport intelligent, connecté et durable",
      budget: 2000000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      criteres: ["Expertise transport", "Innovation technologique", "Durabilité"],
      documents: ["Étude de marché", "Architecture système", "Plan de déploiement"],
      type: "créé"
    },
    {
      id: "AP009",
      titre: "Agriculture intelligente et précision",
      programme: "Programme Agriculture 4.0",
      organisme: "Ministère de l'Agriculture",
      dateOuverture: "2024-06-15",
      dateLimite: "2025-02-28",
      description: "Technologies d'agriculture de précision et systèmes intelligents pour optimiser la production agricole",
      budget: 1100000,
      nombreProjetsAttendus: 5,
      statut: "ouvert",
      criteres: ["Expertise agriculture", "Innovation technologique", "Impact économique"],
      documents: ["Étude de faisabilité", "Prototype fonctionnel", "Plan de commercialisation"],
      type: "créé"
    },
    {
      id: "AP010",
      titre: "Smart Cities et urbanisme intelligent",
      programme: "Programme Villes Intelligentes",
      organisme: "Ministère de l'Intérieur",
      dateOuverture: "2024-07-01",
      dateLimite: "2025-03-31",
      description: "Développement de solutions intelligentes pour la gestion urbaine et l'amélioration de la qualité de vie",
      budget: 1600000,
      nombreProjetsAttendus: 6,
      statut: "ouvert",
      criteres: ["Expertise urbanisme", "Innovation technologique", "Impact social"],
      documents: ["Étude urbaine", "Architecture système", "Plan d'implémentation"],
      type: "créé"
    }
  ])

  // États pour les formulaires
  const [newProgramData, setNewProgramData] = useState({
    name: "",
    organisme: "",
    dateDebut: "",
    dateFin: "",
    description: "",
    budget: "",
    nombreProjets: "",
    sousProgramme: "",
    descriptifSousProgramme: "",
    typologie: "",
    sourcesFinancement: [] as string[],
    autresSourcesFinancement: [] as string[],
    autreSourceFinancement: "",
    type: ""
  })

  const [newAppelData, setNewAppelData] = useState({
    titre: "",
    programme: "",
    organisme: "",
    dateOuverture: "",
    dateLimite: "",
    description: "",
    budget: "",
    nombreProjetsAttendus: "",
    sourcesFinancement: [] as string[],
    autresSourcesFinancement: [] as string[],
    autreSourceFinancement: "",
    type: ""
  })

  // État de validation pour le formulaire d'appel à projets
  const [newAppelErrors, setNewAppelErrors] = useState({
    titre: false,
    programme: false,
    organisme: false,
    dateOuverture: false,
    dateLimite: false,
    description: false,
    budget: false,
    nombreProjetsAttendus: false,
    description: false,
    sourcesFinancement: false,
    type: false
  })

  // État de validation pour le formulaire de programme
  const [newProgramErrors, setNewProgramErrors] = useState({
    name: false,
    organisme: false,
    dateDebut: false,
    dateFin: false,
    budget: false,
    nombreProjets: false,
    description: false,
    type: false
  })

  const typologies = [
    "Recherche fondamentale",
    "Recherche appliquée",
    "Recherche et développement",
    "Innovation technologique",
    "Transfert de technologie",
    "Formation et recherche"
  ]

  const organismes = [
    "Ministère de l'Enseignement Supérieur",
    "Agence Nationale de Sécurité",
    "Ministère de la Santé",
    "Ministère de l'Énergie",
    "Ministère de l'Agriculture",
    "Ministère des Transports",
    "CNRST",
    "Université Hassan II",
    "Autre"
  ]

  // Sources de financement disponibles
  const sourcesFinancement = [
    "Ministère de l'Enseignement Supérieur",
    "Ministère de la Recherche Scientifique",
    "Agence Nationale de Recherche",
    "Centre National de Recherche Scientifique et Technique",
    "Université Hassan II de Casablanca",
    "Fondation Hassan II pour la Recherche",
    "Partenaires privés",
    "Organisations internationales",
    "Autre"
  ]

  // Fonctions utilitaires
  const isProgrammeActif = (dateFin: string) => {
    return new Date(dateFin) > new Date()
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' MAD'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
      case "ouvert":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "termine":
      case "ferme":
        return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>
      case "inactif":
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>
      case "en_evaluation":
        return <Badge className="bg-yellow-100 text-yellow-800">En évaluation</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{statut}</Badge>
    }
  }

  // Gestionnaires d'événements
  const handleVoirDetails = (programme: Programme) => {
    setSelectedProgramme(programme)
    setShowDetailsModal(true)
  }

  const handleVoirDetailsAppel = (appel: AppelProjet) => {
    setSelectedAppel(appel)
    setShowDetailsModal(true)
  }

  const handleEditProgram = (programme: Programme) => {
    setSelectedProgramme(programme)
    setNewProgramData({
      name: programme.name,
      organisme: programme.organisme,
      dateDebut: programme.dateDebut,
      dateFin: programme.dateFin,
      description: programme.description,
      budget: programme.budget.toString(),
      nombreProjets: programme.nombreProjets.toString(),
      sousProgramme: "",
      descriptifSousProgramme: "",
      typologie: "",
      sourcesFinancement: programme.sourcesFinancement || [],
      autresSourcesFinancement: programme.autresSourcesFinancement || [],
      autreSourceFinancement: "",
      type: programme.type || ""
    })
    setShowEditProgramForm(true)
  }

  const handleEditAppel = (appel: AppelProjet) => {
    setSelectedAppel(appel)
    setNewAppelData({
      titre: appel.titre,
      programme: appel.programme,
      organisme: appel.organisme,
      dateOuverture: appel.dateOuverture,
      dateLimite: appel.dateLimite,
      description: appel.description,
      budget: appel.budget.toString(),
      nombreProjetsAttendus: appel.nombreProjetsAttendus.toString(),
      sourcesFinancement: appel.sourcesFinancement || [],
      autresSourcesFinancement: appel.autresSourcesFinancement || [],
      autreSourceFinancement: "",
      type: appel.type || ""
    })
    setShowEditAppelForm(true)
  }

  const handleNewProgramInputChange = (field: string, value: string) => {
    setNewProgramData(prev => ({ ...prev, [field]: value }))
  }

  // Fonctions pour gérer les sources de financement du programme
  const handleProgramSourceFinancementToggle = (source: string) => {
    setNewProgramData(prev => {
      const currentSources = [...prev.sourcesFinancement]
      const index = currentSources.indexOf(source)
      
      if (index > -1) {
        // Retirer la source si elle est déjà sélectionnée
        currentSources.splice(index, 1)
      } else {
        // Ajouter la source si elle n'est pas sélectionnée
        currentSources.push(source)
      }
      
      return {
        ...prev,
        sourcesFinancement: currentSources
      }
    })
  }

  const handleRemoveProgramSourceFinancement = (sourceToRemove: string) => {
    setNewProgramData(prev => ({
      ...prev,
      sourcesFinancement: prev.sourcesFinancement.filter(source => source !== sourceToRemove)
    }))
  }

  const handleAddProgramAutreSourceFinancement = () => {
    if (newProgramData.autreSourceFinancement.trim()) {
      setNewProgramData(prev => ({
        ...prev,
        autresSourcesFinancement: [...prev.autresSourcesFinancement, newProgramData.autreSourceFinancement.trim()],
        autreSourceFinancement: ""
      }))
    }
  }

  const handleRemoveProgramAutreSourceFinancement = (sourceToRemove: string) => {
    setNewProgramData(prev => ({
      ...prev,
      autresSourcesFinancement: prev.autresSourcesFinancement.filter(source => source !== sourceToRemove)
    }))
  }

  const handleNewAppelInputChange = (field: keyof typeof newAppelData, value: string | string[]) => {
    setNewAppelData(prev => ({ ...prev, [field]: value }))
    
    // Validation en temps réel
    if (typeof value === 'string') {
      setNewAppelErrors(prev => ({
        ...prev,
        [field]: !value.trim() && (field === 'titre' || field === 'description') || 
                 !value && (field === 'programme' || field === 'organisme' || field === 'dateOuverture' || field === 'dateLimite' || field === 'budget' || field === 'nombreProjetsAttendus')
      }))
    }
  }

  // Fonctions pour gérer les sources de financement
  const handleAppelSourceFinancementToggle = (source: string) => {
    setNewAppelData(prev => {
      const currentSources = [...prev.sourcesFinancement]
      const index = currentSources.indexOf(source)
      
      if (index > -1) {
        // Retirer la source si elle est déjà sélectionnée
        currentSources.splice(index, 1)
      } else {
        // Ajouter la source si elle n'est pas sélectionnée
        currentSources.push(source)
      }
      
      return {
        ...prev,
        sourcesFinancement: currentSources
      }
    })
  }

  const handleRemoveAppelSourceFinancement = (sourceToRemove: string) => {
    setNewAppelData(prev => ({
      ...prev,
      sourcesFinancement: prev.sourcesFinancement.filter(source => source !== sourceToRemove)
    }))
  }

  const handleAddAppelAutreSourceFinancement = () => {
    if (newAppelData.autreSourceFinancement.trim()) {
      setNewAppelData(prev => ({
        ...prev,
        autresSourcesFinancement: [...prev.autresSourcesFinancement, newAppelData.autreSourceFinancement.trim()],
        autreSourceFinancement: ""
      }))
    }
  }

  const handleRemoveAppelAutreSourceFinancement = (sourceToRemove: string) => {
    setNewAppelData(prev => ({
      ...prev,
      autresSourcesFinancement: prev.autresSourcesFinancement.filter(source => source !== sourceToRemove)
    }))
  }

  const handleCreateNewProgram = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation des champs obligatoires
    const errors = {
      name: !newProgramData.name,
      organisme: !newProgramData.organisme,
      dateDebut: !newProgramData.dateDebut,
      dateFin: !newProgramData.dateFin,
      budget: !newProgramData.budget,
      nombreProjets: !newProgramData.nombreProjets,
      description: !newProgramData.description,
      type: !newProgramData.type
    }
    
    setNewProgramErrors(errors)
    
    // Si il y a des erreurs, ne pas soumettre
    if (Object.values(errors).some(error => error)) {
      return
    }
    
    const newProgram: Programme = {
      id: `P${Date.now()}`,
      name: newProgramData.name,
      organisme: newProgramData.organisme,
      dateDebut: newProgramData.dateDebut,
      dateFin: newProgramData.dateFin,
      description: newProgramData.description,
      budget: parseInt(newProgramData.budget),
      nombreProjets: parseInt(newProgramData.nombreProjets),
      statut: "en_cours",
      objectifs: [],
      criteres: []
    }
    setProgrammes(prev => [...prev, newProgram])
    setShowNewProgramForm(false)
    
    // Réinitialiser le formulaire et les erreurs
    setNewProgramData({
      name: "",
      organisme: "",
      dateDebut: "",
      dateFin: "",
      description: "",
      budget: "",
      nombreProjets: "",
      sousProgramme: "",
      descriptifSousProgramme: "",
      typologie: "",
      sourcesFinancement: [],
      autresSourcesFinancement: [],
      autreSourceFinancement: "",
      type: ""
    })
    setNewProgramErrors({
      name: false,
      organisme: false,
      dateDebut: false,
      dateFin: false,
      budget: false,
      nombreProjets: false,
      description: false,
      type: false
    })
  }

  const handleCreateNewAppel = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation complète de tous les champs
    const errors = {
      titre: !newAppelData.titre.trim(),
      programme: !newAppelData.programme,
      organisme: !newAppelData.organisme,
      dateOuverture: !newAppelData.dateOuverture,
      dateLimite: !newAppelData.dateLimite,
      budget: !newAppelData.budget || newAppelData.budget === "0",
      nombreProjetsAttendus: !newAppelData.nombreProjetsAttendus || newAppelData.nombreProjetsAttendus === "0",
      description: !newAppelData.description.trim(),
      sourcesFinancement: newAppelData.sourcesFinancement.length === 0,
      type: !newAppelData.type
    }

    setNewAppelErrors(errors)

    // Vérifier s'il y a des erreurs
    if (Object.values(errors).some(error => error)) {
      return // Arrêter l'exécution si il y a des erreurs
    }
    
    // Si tout est valide, créer l'appel
    const newAppel: AppelProjet = {
      id: `appel-${Date.now()}`,
      titre: newAppelData.titre,
      programme: newAppelData.programme,
      organisme: newAppelData.organisme,
      dateOuverture: newAppelData.dateOuverture,
      dateLimite: newAppelData.dateLimite,
      budget: parseInt(newAppelData.budget),
      nombreProjetsAttendus: parseInt(newAppelData.nombreProjetsAttendus),
      description: newAppelData.description,
      sourcesFinancement: newAppelData.sourcesFinancement,
      autresSourcesFinancement: newAppelData.autresSourcesFinancement,
      statut: "ouvert",
      criteres: ["Innovation", "Impact économique", "Partenariat académique"],
      documents: ["CV du coordonnateur", "Projet détaillé", "Lettre de motivation"],
      type: "demande"
    }
    
    setAppelsProjets([...appelsProjets, newAppel])
    
    // Reset form
    setNewAppelData({
      titre: "",
      programme: "",
      organisme: "",
      dateOuverture: "",
      dateLimite: "",
      budget: "",
      nombreProjetsAttendus: "",
      description: "",
      sourcesFinancement: [],
      autresSourcesFinancement: [],
      autreSourceFinancement: "",
      type: ""
    })
    
    setNewAppelErrors({
      titre: false,
      programme: false,
      organisme: false,
      dateOuverture: false,
      dateLimite: false,
      budget: false,
      nombreProjetsAttendus: false,
      description: false,
      sourcesFinancement: false,
      type: false
    })
    
    setShowNewAppelForm(false)
  }

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProgramme) return

    const updatedProgramme: Programme = {
      ...selectedProgramme,
      name: newProgramData.name,
      organisme: newProgramData.organisme,
      dateDebut: newProgramData.dateDebut,
      dateFin: newProgramData.dateFin,
      description: newProgramData.description,
      budget: parseInt(newProgramData.budget),
      nombreProjets: parseInt(newProgramData.nombreProjets)
    }

    setProgrammes(prev => prev.map(p => p.id === selectedProgramme.id ? updatedProgramme : p))
    setShowEditProgramForm(false)
    setSelectedProgramme(null)
    setNewProgramData({
      name: "",
      organisme: "",
      dateDebut: "",
      dateFin: "",
      description: "",
      budget: "",
      nombreProjets: "",
      sousProgramme: "",
      descriptifSousProgramme: "",
      typologie: "",
      sourcesFinancement: [],
      autresSourcesFinancement: [],
      autreSourceFinancement: "",
      type: ""
    })
  }

  const handleUpdateAppel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAppel) return

    const updatedAppel: AppelProjet = {
      ...selectedAppel,
      titre: newAppelData.titre,
      programme: newAppelData.programme,
      organisme: newAppelData.organisme,
      dateOuverture: newAppelData.dateOuverture,
      dateLimite: newAppelData.dateLimite,
      description: newAppelData.description,
      budget: parseInt(newAppelData.budget),
      nombreProjetsAttendus: parseInt(newAppelData.nombreProjetsAttendus)
    }

    setAppelsProjets(prev => prev.map(a => a.id === selectedAppel.id ? updatedAppel : a))
    setShowEditAppelForm(false)
    setSelectedAppel(null)
    setNewAppelData({
      titre: "",
      programme: "",
      organisme: "",
      dateOuverture: "",
      dateLimite: "",
      description: "",
      budget: "",
      nombreProjetsAttendus: "",
      sourcesFinancement: [],
      autresSourcesFinancement: [],
      autreSourceFinancement: "",
      type: ""
    })
  }

  // Filtrage des données
  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrganisme = filterOrganisme === "all" || programme.organisme === filterOrganisme
    const matchesStatut = filterStatut === "all" || programme.statut === filterStatut
    const matchesAnnee = filterAnnee === "all" || 
                        new Date(programme.dateDebut).getFullYear().toString() === filterAnnee ||
                        new Date(programme.dateFin).getFullYear().toString() === filterAnnee
    const matchesType = filterType === "all" || programme.type === filterType
    
    return matchesSearch && matchesOrganisme && matchesStatut && matchesAnnee && matchesType
  })

  const filteredAppels = appelsProjets.filter(appel => {
    const matchesSearch = appel.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appel.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrganisme = filterOrganisme === "all" || appel.organisme === filterOrganisme
    const matchesStatut = filterStatut === "all" || appel.statut === filterStatut
    const matchesProgramme = filterProgramme === "all" || appel.programme === filterProgramme
    const matchesAnnee = filterAnnee === "all" || 
                        new Date(appel.dateOuverture).getFullYear().toString() === filterAnnee ||
                        new Date(appel.dateLimite).getFullYear().toString() === filterAnnee
    const matchesType = filterType === "all" || appel.type === filterType
    
    return matchesSearch && matchesOrganisme && matchesStatut && matchesProgramme && matchesAnnee && matchesType
  })

  const uniqueOrganismes = [...new Set([...programmes.map(p => p.organisme), ...appelsProjets.map(a => a.organisme)])]

  const resetFilters = () => {
    setSearchTerm("")
    setFilterOrganisme("all")
    setFilterStatut("all")
    setFilterAnnee("all")
    setFilterProgramme("all")
    setFilterAppelProgramme("all")
    setFilterType("all")
  }

  const handleSubmitProject = (appel: AppelProjet) => {
    setSelectedAppelForSubmit(appel)
    setSelectedProgrammeForSubmit(null)
    setSubmitType("appel")
    setShowSubmitProjectModal(true)
  }

  const handleSubmitProjectProgramme = (programme: Programme) => {
    setSelectedProgrammeForSubmit(programme)
    setSelectedAppelForSubmit(null)
    setSubmitType("programme")
    setShowSubmitProjectModal(true)
  }

  const [showSourcesDropdown, setShowSourcesDropdown] = useState(false)
  const [sourcesSearchTerm, setSourcesSearchTerm] = useState("")

  const [showProgramSourcesDropdown, setShowProgramSourcesDropdown] = useState(false)
  const [programSourcesSearchTerm, setProgramSourcesSearchTerm] = useState("")

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="mx-auto max-w-5xl">
            {/* Header avec titre et bouton sur la même ligne */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeTab === "appels" ? "Appels à projets" : "Gestion des programmes"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeTab === "appels" 
                    ? "Gérez les appels à projets de recherche"
                    : "Gérez les programmes de recherche"
                  }
                </p>
              </div>
              <Button
                onClick={() => activeTab === "appels" ? setShowNewAppelForm(true) : setShowNewProgramForm(true)}
                size="sm"
                className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white text-sm px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau {activeTab === "appels" ? "appel" : "programme"}
              </Button>
            </div>

            {/* Section de recherche et filtres compacte */}
            <Card className="mb-3 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-1">
                <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-900" />
                  Recherche et filtres - {activeTab === "appels" ? "Appels à projets" : "Programmes"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3">
                {/* Barre de recherche principale */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={activeTab === "appels" ? "Rechercher un appel à projets..." : "Rechercher un programme..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                  />
                </div>

                {/* Filtres dynamiques selon l'onglet actif */}
                {activeTab === "appels" ? (
                  // Pour les appels à projets : deux filtres sur la même ligne
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <FolderOpen className="h-3 w-3 text-blue-900" />
                        Appel à projets
                      </Label>
                      <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                        <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                          <SelectValue placeholder="Tous les appels à projets" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les appels à projets</SelectItem>
                          {appelsProjets.map((appel) => (
                            <SelectItem key={appel.id} value={appel.titre}>
                              {appel.titre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-blue-900" />
                        Programme associé
                      </Label>
                      <Select value={filterAppelProgramme} onValueChange={setFilterAppelProgramme}>
                        <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                          <SelectValue placeholder="Tous les programmes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les programmes</SelectItem>
                          {Array.from(new Set(appelsProjets.map(appel => appel.programme))).map((programme) => (
                            <SelectItem key={programme} value={programme}>
                              {programme}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  // Pour les programmes : un seul filtre
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-blue-900" />
                      Programme
                    </Label>
                    <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                      <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
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
                )}

                {/* Filtres communs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <Building className="h-3 w-3 text-blue-900" />
                      Organisme
                    </Label>
                    <Select value={filterOrganisme} onValueChange={setFilterOrganisme}>
                      <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
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

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <Target className="h-3 w-3 text-blue-900" />
                      Statut
                    </Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {activeTab === "appels" ? (
                          <>
                            <SelectItem value="ouvert">Ouvert</SelectItem>
                            <SelectItem value="ferme">Fermé</SelectItem>
                            <SelectItem value="en_evaluation">En évaluation</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="termine">Terminé</SelectItem>
                            <SelectItem value="inactif">Inactif</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-blue-900" />
                      Année
                    </Label>
                    <Select value={filterAnnee} onValueChange={setFilterAnnee}>
                      <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Toutes les années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les années</SelectItem>
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      <Tag className="h-3 w-3 text-blue-900" />
                      Type
                    </Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="demande">Demande</SelectItem>
                        <SelectItem value="créé">Créé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets */}
            <div className="mb-6">
              <div className="bg-gray-100 p-1 rounded-lg">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setActiveTab("appels")}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === "appels"
                        ? "bg-white text-blue-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FolderOpen className="h-4 w-4" />
                    Appels à projets
                  </button>
                  <button
                    onClick={() => setActiveTab("programmes")}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === "programmes"
                        ? "bg-white text-blue-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Programmes
                  </button>
                </div>
              </div>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm border-l-4 border-l-uh2c-blue">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {activeTab === "appels" ? (
                        <FolderOpen className="h-4 w-4 text-gray-600" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        {activeTab === "appels" ? "Appels ouverts" : "Programmes en cours"}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {activeTab === "appels" 
                          ? filteredAppels.filter(a => a.statut === "ouvert").length
                          : filteredProgrammes.filter(p => p.statut === "en_cours").length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm border-l-4 border-l-uh2c-blue">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      {activeTab === "appels" ? (
                        <FolderOpen className="h-4 w-4 text-gray-600" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        {activeTab === "appels" ? "Appels fermés" : "Programmes terminés"}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {activeTab === "appels" 
                          ? filteredAppels.filter(a => a.statut === "ferme").length
                          : filteredProgrammes.filter(p => p.statut === "termine").length
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="space-y-6">
              {activeTab === "appels" ? (
                // Liste des appels à projets
                filteredAppels.map((appel) => (
                  <Card key={appel.id} className="group hover:shadow-md transition-all duration-200 w-full bg-white border border-gray-200 hover:border-gray-300 border-l-4 border-l-uh2c-blue">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Header avec titre et badges */}
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-semibold text-gray-900">{appel.titre}</h3>
                            {appel.type === "demande" ? (
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium px-2 py-0.5">
                                Demande
                              </Badge>
                            ) : (
                              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs font-medium px-2 py-0.5">
                                Créé
                              </Badge>
                            )}
                          </div>
                          
                          {/* Statut et projets */}
                          <div className="flex items-center gap-2 mb-2">
                            {getStatutBadge(appel.statut)}
                            <span className="text-gray-400">•</span>
                            <span className="text-xs text-gray-600 font-medium">{appel.nombreProjetsAttendus} projets attendus</span>
                          </div>
                          
                          {/* Programme */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500 font-medium">Programme :</span>
                            <span className="text-xs text-gray-800 font-semibold">{appel.programme}</span>
                          </div>
                          
                          {/* Description */}
                          <p className="text-gray-700 mb-3 text-xs leading-relaxed line-clamp-2">{appel.description}</p>
                          
                          {/* Informations clés */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-md border border-gray-100">
                              <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                                <Building className="h-3 w-3 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Organisme</p>
                                <p className="text-xs text-gray-900 font-semibold">{appel.organisme}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-md border border-gray-100">
                              <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                                <Calendar className="h-3 w-3 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Période</p>
                                <p className="text-xs text-gray-900 font-semibold">
                                  {formatDate(appel.dateOuverture)} - {formatDate(appel.dateLimite)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-md border border-gray-100">
                              <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                                <DollarSign className="h-3 w-3 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Budget</p>
                                <p className="text-xs text-gray-900 font-semibold">{formatBudget(appel.budget)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 ml-4 min-w-[80px]">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleVoirDetailsAppel(appel)}
                            className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-xs h-8 px-3 w-full"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Détails
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditAppel(appel)}
                            className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-xs h-8 px-3 w-full"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // Liste des programmes
                filteredProgrammes.map((programme) => (
                  <Card key={programme.id} className="group hover:shadow-lg transition-all duration-200 w-full bg-white border border-gray-200 hover:border-gray-300 border-l-4 border-l-uh2c-blue">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Header avec titre et badges */}
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{programme.name}</h3>
                            {programme.type === "demande" ? (
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium px-2 py-1">
                                Demande
                              </Badge>
                            ) : (
                              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs font-medium px-2 py-1">
                                Créé
                              </Badge>
                            )}
                          </div>
                          
                          {/* Statut et projets */}
                          <div className="flex items-center gap-2 mb-3">
                            {getStatutBadge(programme.statut)}
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600 font-medium">{programme.nombreProjets} projets</span>
                          </div>
                          
                          {/* Description */}
                          <p className="text-gray-700 mb-4 text-sm leading-relaxed">{programme.description}</p>
                          
                          {/* Informations clés */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-100">
                              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                                <Building className="h-3 w-3 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Organisme</p>
                                <p className="text-sm text-gray-900 font-semibold">{programme.organisme}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-100">
                              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                                <Calendar className="h-3 w-3 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Période</p>
                                <p className="text-sm text-gray-900 font-semibold">
                                  {formatDate(programme.dateDebut)} - {formatDate(programme.dateFin)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-100">
                              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                                <DollarSign className="h-3 w-3 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Budget</p>
                                <p className="text-sm text-gray-900 font-semibold">{formatBudget(programme.budget)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 ml-4 min-w-[80px]">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleVoirDetails(programme)}
                            className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-xs h-8 px-3 w-full"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Détails
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditProgram(programme)}
                            className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-xs h-8 px-3 w-full"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              {/* Message si aucun résultat */}
              {((activeTab === "appels" && filteredAppels.length === 0) || 
                (activeTab === "programmes" && filteredProgrammes.length === 0)) && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun {activeTab === "appels" ? "appel à projets" : "programme"} trouvé
                  </h3>
                  <p className="text-gray-600">
                    Essayez de modifier vos critères de recherche ou de créer un nouveau {activeTab === "appels" ? "appel" : "programme"}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
            </div>

      {/* Modals et dialogs */}
            {/* Modal de détails */}
            <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-xl">
          <DialogHeader className="text-center pb-3 border-b border-gray-100 bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 rounded-t-xl">
            <div className="flex items-center justify-center gap-3 mb-2 mt-3">
              <div className="w-8 h-8 bg-gradient-to-br from-uh2c-blue to-uh2c-blue/80 rounded-lg flex items-center justify-center shadow-sm">
                {selectedProgramme ? (
                  <BookOpen className="h-4 w-4 text-white" />
                ) : (
                  <FolderOpen className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="text-center">
                <DialogTitle className="text-lg font-semibold text-gray-900 mb-1 text-center">
                  {selectedProgramme ? selectedProgramme.name : selectedAppel?.titre}
                    </DialogTitle>
                <DialogDescription className="text-gray-600 text-xs text-center">
                  Détails du {selectedProgramme ? "programme" : "appel à projets"}
                    </DialogDescription>
              </div>
            </div>
                  </DialogHeader>
          
          <div className="space-y-4 p-6">
            {selectedProgramme ? (
              <div className="space-y-6">
                {/* Informations de base */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-uh2c-blue" />
                    Informations de base
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Nom du programme</span>
                        <p className="text-sm text-gray-900 font-medium">{selectedProgramme.name}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Organisme</span>
                        <p className="text-sm text-gray-900">{selectedProgramme.organisme}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Période</span>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedProgramme.dateDebut)} - {formatDate(selectedProgramme.dateFin)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Budget</span>
                        <p className="text-sm text-gray-900 font-semibold text-green-600">{formatBudget(selectedProgramme.budget)}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Nombre de projets</span>
                        <p className="text-sm text-gray-900">{selectedProgramme.nombreProjets}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description, Objectifs, Critères et Documents sur la même ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Description */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <AlignLeft className="h-4 w-4 text-uh2c-blue" />
                      Description
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedProgramme.description}</p>
                  </div>

                  {/* Objectifs */}
                  {selectedProgramme.objectifs && selectedProgramme.objectifs.length > 0 && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-uh2c-blue" />
                        Objectifs
                      </h3>
                      <div className="space-y-2">
                        {selectedProgramme.objectifs.map((objectif, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-uh2c-blue rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{objectif}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Critères */}
                  {selectedProgramme.criteres && selectedProgramme.criteres.length > 0 && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-uh2c-blue" />
                        Critères
                      </h3>
                      <div className="space-y-2">
                        {selectedProgramme.criteres.map((critere, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-uh2c-blue rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{critere}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {selectedProgramme.documents && selectedProgramme.documents.length > 0 && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-uh2c-blue" />
                        Documents
                      </h3>
                      <div className="space-y-2">
                        {selectedProgramme.documents.map((document, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-uh2c-blue rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{document}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedAppel ? (
              <div className="space-y-4">
                {/* Informations de base */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-uh2c-blue" />
                    Informations de base
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Titre de l'appel</span>
                        <p className="text-sm text-gray-900 font-medium">{selectedAppel.titre}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Programme associé</span>
                        <p className="text-sm text-gray-900">{selectedAppel.programme}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Organisme</span>
                        <p className="text-sm text-gray-900">{selectedAppel.organisme}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Période</span>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedAppel.dateOuverture)} - {formatDate(selectedAppel.dateLimite)}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Budget</span>
                        <p className="text-sm text-gray-900 font-semibold text-green-600">{formatBudget(selectedAppel.budget)}</p>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500 font-medium">Projets attendus</span>
                        <p className="text-sm text-gray-900">{selectedAppel.nombreProjetsAttendus}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description, Critères et Documents requis sur la même ligne */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Description */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <AlignLeft className="h-4 w-4 text-uh2c-blue" />
                      Description
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedAppel.description}</p>
                  </div>

                  {/* Critères */}
                  {selectedAppel.criteres && selectedAppel.criteres.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-uh2c-blue" />
                        Critères
                      </h3>
                      <div className="space-y-1">
                        {selectedAppel.criteres.map((critere, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{critere}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents requis */}
                  {selectedAppel.documents && selectedAppel.documents.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-uh2c-blue" />
                        Documents requis
                      </h3>
                      <div className="space-y-1">
                        {selectedAppel.documents.map((document, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{document}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de soumission de projet */}
      <Dialog open={showSubmitProjectModal} onOpenChange={setShowSubmitProjectModal}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Soumettre un projet - {submitType === "appel" ? selectedAppelForSubmit?.titre : selectedProgrammeForSubmit?.name}
            </DialogTitle>
            <DialogDescription>
              Remplissez le formulaire ci-dessous pour soumettre votre projet
                      </DialogDescription>
                </DialogHeader>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Informations générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                  <Label htmlFor="intitule" className="text-sm font-medium text-gray-700">Intitulé du projet *</Label>
                      <Input
                    id="intitule"
                    type="text"
                    className="h-9 border border-gray-300 focus:border-blue-500"
                    placeholder="Intitulé du projet"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                  <Label htmlFor="thematique" className="text-sm font-medium text-gray-700">Thématique *</Label>
                      <Input
                    id="thematique"
                    type="text"
                    className="h-9 border border-gray-300 focus:border-blue-500"
                    placeholder="Thématique du projet"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                  <Label htmlFor="anneeDebut" className="text-sm font-medium text-gray-700">Année de début *</Label>
                      <Input
                    id="anneeDebut"
                        type="number"
                    min="2024"
                    max="2030"
                    className="h-9 border border-gray-300 focus:border-blue-500"
                    placeholder="2024"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                  <Label htmlFor="anneeFin" className="text-sm font-medium text-gray-700">Année de fin *</Label>
                      <Input
                    id="anneeFin"
                        type="number"
                    min="2024"
                    max="2030"
                    className="h-9 border border-gray-300 focus:border-blue-500"
                    placeholder="2026"
                        required
                      />
                    </div>
                    </div>
                  </div>

            {/* Budget */}
                  <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Budget</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                  <Label htmlFor="budgetTotal" className="text-sm font-medium text-gray-700">Budget total *</Label>
                      <Input
                    id="budgetTotal"
                        type="number"
                    min="0"
                    className="h-9 border border-gray-300 focus:border-blue-500"
                    placeholder="500000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                  <Label htmlFor="budgetPersonnel" className="text-sm font-medium text-gray-700">Personnel</Label>
                      <Input
                    id="budgetPersonnel"
                        type="number"
                    min="0"
                    className="h-9 border border-gray-300 focus:border-blue-500"
                    placeholder="200000"
                  />
                    </div>
                      <div className="space-y-2">
                  <Label htmlFor="budgetEquipement" className="text-sm font-medium text-gray-700">Équipements et matériel</Label>
                        <Input
                    id="budgetEquipement"
                    type="number"
                    min="0"
                    className="h-9 border border-gray-300 focus:border-blue-500"
                    placeholder="150000"
                  />
                  </div>
                    <div className="space-y-2">
                  <Label htmlFor="budgetFonctionnement" className="text-sm font-medium text-gray-700">Fonctionnement</Label>
                      <Input
                    id="budgetFonctionnement"
                        type="number"
                    min="0"
                    className="h-9 border border-gray-300 focus:border-blue-500"
                    placeholder="100000"
                      />
                    </div>
                    <div className="space-y-2">
                  <Label htmlFor="budgetAutres" className="text-sm font-medium text-gray-700">Autres dépenses</Label>
                        <Input
                    id="budgetAutres"
                        type="number"
                    min="0"
                    className="h-9 border border-gray-300 focus:border-blue-500"
                    placeholder="50000"
                  />
                </div>
                    </div>
                  </div>

            {/* Documents à joindre */}
                  <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">Documents à joindre</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                  <Label htmlFor="cvCoordonnateur" className="text-sm font-medium text-gray-700">CV du coordonnateur *</Label>
                        <Input
                    id="cvCoordonnateur"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          required
                      />
                            </div>
                    <div className="space-y-2">
                  <Label htmlFor="projetDetaille" className="text-sm font-medium text-gray-700">Projet détaillé *</Label>
                        <Input
                    id="projetDetaille"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                          />
                        </div>
                  <div className="space-y-2">
                  <Label htmlFor="lettreMotivation" className="text-sm font-medium text-gray-700">Lettre de motivation</Label>
                            <Input
                    id="lettreMotivation"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                          </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button 
                      type="button" 
                      variant="outline" 
                onClick={() => setShowSubmitProjectModal(false)}
                      className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                Soumettre le projet
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

      {/* Modal de création/édition de programme */}
      <Dialog open={showNewProgramForm || showEditProgramForm} onOpenChange={(open) => {
              if (!open) {
          setShowNewProgramForm(false)
          setShowEditProgramForm(false)
          setSelectedProgramme(null)
          setNewProgramData({
            name: "",
                          organisme: "",
            dateDebut: "",
            dateFin: "",
                          description: "",
                          budget: "",
            nombreProjets: "",
            sousProgramme: "",
            descriptifSousProgramme: "",
            typologie: "",
                          sourcesFinancement: [],
                          autresSourcesFinancement: [],
                          autreSourceFinancement: "",
                          type: ""
                        })
          setNewProgramErrors({
            name: false,
                  organisme: false,
            dateDebut: false,
            dateFin: false,
                  budget: false,
            nombreProjets: false,
            description: false,
            type: false
                })
              }
            }}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader className="text-center pb-2 relative bg-gradient-to-br from-blue-50 to-white rounded-t-xl">
                  {/* Barre verticale bleue plus prononcée */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-uh2c-blue rounded-r-full"></div>
                  
                  {/* Icône centrée avec fond plus subtil */}
                  <div className="mx-auto w-6 h-6 bg-uh2c-blue/20 rounded-full flex items-center justify-center mb-1">
                    <Plus className="h-3 w-3 text-uh2c-blue" />
                        </div>
                  
                  {/* Titre principal avec style amélioré */}
                  <DialogTitle className="text-base font-bold text-uh2c-blue mb-1 text-center">
                    {showEditProgramForm ? "Modifier le programme" : "Créer un nouveau programme"}
                  </DialogTitle>
                  
                  {/* Description avec style amélioré */}
                  <DialogDescription className="text-gray-600 text-xs px-4 text-center">
                    {showEditProgramForm ? "Modifiez les informations du programme" : "Remplissez les informations pour créer un nouveau programme"}
                  </DialogDescription>
                </DialogHeader>
          <form onSubmit={showEditProgramForm ? handleUpdateProgram : handleCreateNewProgram} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-3 w-3 text-uh2c-blue" />
                      </div>
                <h3 className="text-base font-semibold text-gray-900">Informations de base</h3>
                </div>
                
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                  <Label htmlFor="programName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Nom du programme <span className="text-red-500">*</span>
                      </Label>
                        <Input
                    id="programName"
                    type="text"
                    value={newProgramData.name}
                    onChange={(e) => handleNewProgramInputChange("name", e.target.value)}
                    className={`h-9 border-2 ${newProgramErrors.name ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                    placeholder="Nom du programme"
                          required
                        />
                  {newProgramErrors.name && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Le nom du programme est requis
                    </p>
                      )}
                      </div>
                
                      <div className="space-y-2">
                  <Label htmlFor="programOrganisme" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Organisme <span className="text-red-500">*</span>
                      </Label>
                  <Select value={newProgramData.organisme} onValueChange={(value) => handleNewProgramInputChange("organisme", value)}>
                    <SelectTrigger className={`h-9 border-2 ${newProgramErrors.organisme ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}>
                            <SelectValue placeholder="Sélectionner un organisme" />
                          </SelectTrigger>
                          <SelectContent>
                            {organismes.map((organisme) => (
                              <SelectItem key={organisme} value={organisme}>
                                {organisme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                  {newProgramErrors.organisme && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      L'organisme est requis
                    </p>
                      )}
                      </div>
                
                      <div className="space-y-2">
                  <Label htmlFor="programDateDebut" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Date de début <span className="text-red-500">*</span>
                      </Label>
                        <Input
                    id="programDateDebut"
                    type="date"
                    value={newProgramData.dateDebut}
                    onChange={(e) => handleNewProgramInputChange("dateDebut", e.target.value)}
                    className={`h-9 border-2 ${newProgramErrors.dateDebut ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                          required
                        />
                  {newProgramErrors.dateDebut && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      La date de début est requise
                    </p>
                      )}
                      </div>
                
                      <div className="space-y-2">
                  <Label htmlFor="programDateFin" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Date de fin <span className="text-red-500">*</span>
                      </Label>
                        <Input
                    id="programDateFin"
                    type="date"
                    value={newProgramData.dateFin}
                    onChange={(e) => handleNewProgramInputChange("dateFin", e.target.value)}
                    className={`h-9 border-2 ${newProgramErrors.dateFin ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                          required
                        />
                  {newProgramErrors.dateFin && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      La date de fin est requise
                    </p>
                  )}
                  </div>

                      <div className="space-y-2">
                  <Label htmlFor="programBudget" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Budget (MAD) <span className="text-red-500">*</span>
                      </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">MAD</span>
                        <Input
                      id="programBudget"
                      type="number"
                      min="0"
                      value={newProgramData.budget}
                      onChange={(e) => handleNewProgramInputChange("budget", e.target.value)}
                      className={`h-9 border-2 pl-12 ${newProgramErrors.budget ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                      placeholder="5000000"
                          required
                        />
                  </div>
                  {newProgramErrors.budget && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Le budget est requis
                    </p>
                      )}
                      </div>
                
                      <div className="space-y-2">
                  <Label htmlFor="programNombreProjets" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Nombre de projets <span className="text-red-500">*</span>
                      </Label>
                        <Input
                    id="programNombreProjets"
                    type="number"
                    min="0"
                    value={newProgramData.nombreProjets}
                    onChange={(e) => handleNewProgramInputChange("nombreProjets", e.target.value)}
                    className={`h-9 border-2 ${newProgramErrors.nombreProjets ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                    placeholder="25"
                          required
                        />
                  {newProgramErrors.nombreProjets && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Le nombre de projets est requis
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="programType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={newProgramData.type} onValueChange={(value) => handleNewProgramInputChange("type", value)}>
                    <SelectTrigger className={`h-9 border-2 ${newProgramErrors.type ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demande">Demande</SelectItem>
                      <SelectItem value="créé">Créé par UH2C</SelectItem>
                    </SelectContent>
                  </Select>
                  {newProgramErrors.type && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Le type est requis
                    </p>
                      )}
                    </div>
                  </div>


            </div>

            {/* Sources de financement */}
            <div className="space-y-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="space-y-4">
                {/* Affichage des sources sélectionnées */}
                {newProgramData.sourcesFinancement.length > 0 && (
                  <div className="p-3 bg-uh2c-blue/5 rounded-lg border border-uh2c-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-uh2c-blue rounded-full flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Sources sélectionnées</span>
                      <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded-full border">
                        {newProgramData.sourcesFinancement.length}
                                </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {newProgramData.sourcesFinancement.map((source, index) => (
                        <div key={source} className="group relative">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-uh2c-blue/30 shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-uh2c-blue/50">
                            <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">{source}</span>
                                  <button
                                    type="button"
                              onClick={() => handleProgramSourceFinancementToggle(source)}
                              className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-1"
                              title="Retirer cette source"
                                  >
                              <X className="h-2.5 w-2.5" />
                                  </button>
                          </div>
                        </div>
                              ))}
                            </div>
                          </div>
                        )}

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Sources de financement principales</Label>
                        <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowProgramSourcesDropdown(!showProgramSourcesDropdown)}
                      className="w-full h-9 border-2 border-gray-200 rounded-lg px-3 text-left flex items-center justify-between hover:border-uh2c-blue focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 transition-all duration-200"
                    >
                      <span className="text-sm text-gray-600">
                        {newProgramData.sourcesFinancement.length > 0 
                          ? `${newProgramData.sourcesFinancement.length} source(s) sélectionnée(s)`
                          : "Sélectionner les sources de financement"
                        }
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showProgramSourcesDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showProgramSourcesDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 border-2 border-gray-200 rounded-lg bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
                        <div className="p-2 border-b border-gray-200">
                          <Input
                            placeholder="Rechercher une source..."
                            className="h-8 text-sm"
                            value={programSourcesSearchTerm}
                            onChange={(e) => setProgramSourcesSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="p-1">
                          {sourcesFinancement
                            .filter(source => source.toLowerCase().includes(programSourcesSearchTerm.toLowerCase()))
                            .map((source) => (
                              <div key={source} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded transition-colors duration-200">
                                <Checkbox
                                  id={`program-source-${source}`}
                                  checked={newProgramData.sourcesFinancement.includes(source)}
                                  onCheckedChange={() => handleProgramSourceFinancementToggle(source)}
                                  className="data-[state=checked]:bg-uh2c-blue data-[state=checked]:border-uh2c-blue"
                                />
                                <Label htmlFor={`program-source-${source}`} className="text-sm font-medium cursor-pointer flex-1">{source}</Label>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                      </div>

                <div className="border-t border-gray-200 pt-4">
                  {newProgramData.sourcesFinancement.includes("Autre") && (
                    <>
                      <Label className="text-sm font-semibold text-gray-700 mb-3 block">Autres sources de financement</Label>
                          <div className="flex gap-2">
                            <Input
                          value={newProgramData.autreSourceFinancement}
                          onChange={(e) => handleNewProgramInputChange("autreSourceFinancement", e.target.value)}
                          placeholder="Ajouter une source de financement personnalisée"
                          className="flex-1 h-9 border-2 border-gray-200 focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200"
                            />
                            <Button
                              type="button"
                          onClick={handleAddProgramAutreSourceFinancement}
                          variant="outline"
                          size="sm"
                          className="h-9 px-4 border-2 border-uh2c-blue text-uh2c-blue hover:bg-uh2c-blue/10 hover:border-uh2c-blue/80 transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Ajouter
                            </Button>
                          </div>
                      
                      {newProgramData.autresSourcesFinancement.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {newProgramData.autresSourcesFinancement.map((source, index) => (
                            <div key={index} className="flex items-center justify-between bg-uh2c-blue/10 p-2 rounded-lg border border-uh2c-blue/20">
                              <span className="text-sm font-medium text-uh2c-blue">{source}</span>
                              <Button
                                type="button"
                                onClick={() => handleRemoveProgramAutreSourceFinancement(source)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

                  {/* Description */}
            <div className="space-y-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                  <AlignLeft className="h-3 w-3 text-uh2c-blue" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">Description</h3>
              </div>
              
                    <div className="space-y-2">
                <Label htmlFor="programDescription" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Description <span className="text-red-500">*</span>
                    </Label>
                <div className="relative">
                      <Textarea
                    id="programDescription"
                    value={newProgramData.description}
                    onChange={(e) => handleNewProgramInputChange("description", e.target.value)}
                    className={`min-h-[100px] border-2 ${newProgramErrors.description ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200 resize-none`}
                    placeholder="Description détaillée du programme"
                        required
                      />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {newProgramData.description.length}/1000
                  </div>
                </div>
                {newProgramErrors.description && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <X className="h-3 w-3" />
                    La description est requise
                  </p>
                )}
                {newProgramData.description.length > 800 && (
                  <p className="text-orange-500 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {newProgramData.description.length > 950 ? "Limite presque atteinte" : "Description assez longue"}
                  </p>
                )}
              </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 bg-white rounded-xl p-4 shadow-sm">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowNewProgramForm(false)
                        setShowEditProgramForm(false)
                      }}
                      className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-uh2c-blue to-uh2c-blue/90 hover:from-uh2c-blue/90 hover:to-uh2c-blue text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                    >
                      {showEditProgramForm ? (
                        <>
                          <Edit className="h-4 w-4" />
                          Modifier le programme
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Créer le programme
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

      {/* Modal de création/édition d'appel à projets */}
      <Dialog open={showNewAppelForm || showEditAppelForm} onOpenChange={(open) => {
        if (!open) {
                        setShowNewAppelForm(false)
          setShowEditAppelForm(false)
          setSelectedAppel(null)
                        setNewAppelData({
                          titre: "",
                          programme: "",
                          organisme: "",
                          dateOuverture: "",
                          dateLimite: "",
                          description: "",
                          budget: "",
                          nombreProjetsAttendus: "",
                          sourcesFinancement: [],
                          autresSourcesFinancement: [],
                          autreSourceFinancement: "",
                          type: ""
                        })
                        setNewAppelErrors({
                          titre: false,
                          programme: false,
                          organisme: false,
                          dateOuverture: false,
                          dateLimite: false,
                          description: false,
                          budget: false,
                          nombreProjetsAttendus: false,
                          description: false,
                          sourcesFinancement: false,
                          type: false
                        })
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="text-center pb-2 relative bg-gradient-to-br from-blue-50 to-white rounded-t-xl">
            {/* Barre verticale bleue plus prononcée */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-uh2c-blue rounded-r-full"></div>
            
            {/* Icône centrée avec fond plus subtil */}
            <div className="mx-auto w-6 h-6 bg-uh2c-blue/20 rounded-full flex items-center justify-center mb-1">
              <Plus className="h-3 w-3 text-uh2c-blue" />
                  </div>
            
            {/* Titre principal avec style amélioré */}
            <DialogTitle className="text-base font-bold text-uh2c-blue mb-1 text-center">
              {showEditAppelForm ? "Modifier l'appel à projets" : "Créer un nouvel appel à projets"}
            </DialogTitle>
            
            {/* Description avec style amélioré */}
            <DialogDescription className="text-gray-600 text-xs px-4 text-center">
              {showEditAppelForm ? "Modifiez les informations de l'appel à projets" : "Remplissez les informations pour créer un nouvel appel à projets"}
                  </DialogDescription>
                </DialogHeader>
          
          <form onSubmit={showEditAppelForm ? handleUpdateAppel : handleCreateNewAppel} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-3 w-3 text-uh2c-blue" />
                      </div>
                <h3 className="text-base font-semibold text-gray-900">Informations de base</h3>
                  </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                  <Label htmlFor="appelTitre" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Titre de l'appel <span className="text-red-500">*</span>
                  </Label>
                      <Input
                    id="appelTitre"
                    type="text"
                        value={newAppelData.titre}
                        onChange={(e) => handleNewAppelInputChange("titre", e.target.value)}
                    className={`h-9 border-2 ${newAppelErrors.titre ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                    placeholder="Ex: Appel à projets pour l'innovation technologique"
                        required
                      />
                  {newAppelErrors.titre && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Le titre est requis
                    </p>
                  )}
                    </div>
                
                    <div className="space-y-2">
                  <Label htmlFor="appelProgramme" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Programme associé <span className="text-red-500">*</span>
                  </Label>
                      <Select value={newAppelData.programme} onValueChange={(value) => handleNewAppelInputChange("programme", value)}>
                    <SelectTrigger className={`h-9 border-2 ${newAppelErrors.programme ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}>
                          <SelectValue placeholder="Sélectionner un programme" />
                        </SelectTrigger>
                        <SelectContent>
                          {programmes.map((programme) => (
                            <SelectItem key={programme.id} value={programme.name}>
                              {programme.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  {newAppelErrors.programme && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Le programme est requis
                    </p>
                  )}
                    </div>
                
                    <div className="space-y-2">
                  <Label htmlFor="appelOrganisme" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Organisme <span className="text-red-500">*</span>
                  </Label>
                      <Select value={newAppelData.organisme} onValueChange={(value) => handleNewAppelInputChange("organisme", value)}>
                    <SelectTrigger className={`h-9 border-2 ${newAppelErrors.organisme ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}>
                          <SelectValue placeholder="Sélectionner un organisme" />
                        </SelectTrigger>
                        <SelectContent>
                          {organismes.map((organisme) => (
                            <SelectItem key={organisme} value={organisme}>
                              {organisme}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  {newAppelErrors.organisme && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      L'organisme est requis
                    </p>
                  )}
                    </div>
                
                    <div className="space-y-2">
                  <Label htmlFor="appelDateOuverture" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Date d'ouverture <span className="text-red-500">*</span>
                  </Label>
                      <Input
                    id="appelDateOuverture"
                        type="date"
                        value={newAppelData.dateOuverture}
                        onChange={(e) => handleNewAppelInputChange("dateOuverture", e.target.value)}
                    className={`h-9 border-2 ${newAppelErrors.dateOuverture ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                        required
                      />
                  {newAppelErrors.dateOuverture && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      La date d'ouverture est requise
                    </p>
                  )}
                    </div>
                
                    <div className="space-y-2">
                  <Label htmlFor="appelDateLimite" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Date limite <span className="text-red-500">*</span>
                  </Label>
                      <Input
                    id="appelDateLimite"
                        type="date"
                        value={newAppelData.dateLimite}
                        onChange={(e) => handleNewAppelInputChange("dateLimite", e.target.value)}
                    className={`h-9 border-2 ${newAppelErrors.dateLimite ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                        required
                      />
                  {newAppelErrors.dateLimite && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      La date limite est requise
                    </p>
                  )}
                    </div>
                
                    <div className="space-y-2">
                  <Label htmlFor="appelBudget" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Budget (MAD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">MAD</span>
                      <Input
                      id="appelBudget"
                        type="number"
                      min="0"
                        value={newAppelData.budget}
                        onChange={(e) => handleNewAppelInputChange("budget", e.target.value)}
                      className={`h-9 border-2 pl-12 ${newAppelErrors.budget ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                      placeholder="800000"
                        required
                      />
                    </div>
                  {newAppelErrors.budget && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Le budget est requis
                    </p>
                  )}
                </div>
                
                    <div className="space-y-2">
                  <Label htmlFor="appelNombreProjets" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Nombre de projets attendus <span className="text-red-500">*</span>
                  </Label>
                      <Input
                    id="appelNombreProjets"
                        type="number"
                    min="0"
                        value={newAppelData.nombreProjetsAttendus}
                        onChange={(e) => handleNewAppelInputChange("nombreProjetsAttendus", e.target.value)}
                    className={`h-9 border-2 ${newAppelErrors.nombreProjetsAttendus ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}
                    placeholder="5"
                        required
                      />
                  {newAppelErrors.nombreProjetsAttendus && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Le nombre de projets attendus est requis
                    </p>
                  )}
                    </div>
                
                    <div className="space-y-2">
                  <Label htmlFor="appelType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={newAppelData.type} onValueChange={(value) => handleNewAppelInputChange("type", value)}>
                    <SelectTrigger className={`h-9 border-2 ${newAppelErrors.type ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200`}>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demande">Demande</SelectItem>
                      <SelectItem value="créé">Créé par UH2C</SelectItem>
                    </SelectContent>
                  </Select>
                  {newAppelErrors.type && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Le type est requis
                    </p>
                  )}
                    </div>
                  </div>


                  </div>

            {/* Sources de financement */}
            <div className="space-y-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="space-y-4">
                {/* Affichage des sources sélectionnées */}
                {newAppelData.sourcesFinancement.length > 0 && (
                  <div className="p-3 bg-uh2c-blue/5 rounded-lg border border-uh2c-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-uh2c-blue rounded-full flex items-center justify-center">
                        <CheckCircle className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700">Sources sélectionnées</span>
                      <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded-full border">
                        {newAppelData.sourcesFinancement.length}
                      </span>
                      </div>
                    <div className="flex flex-wrap gap-1.5">
                      {newAppelData.sourcesFinancement.map((source, index) => (
                        <div key={source} className="group relative">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-uh2c-blue/30 shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-uh2c-blue/50">
                            <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">{source}</span>
                            <button
                              type="button"
                              onClick={() => handleAppelSourceFinancementToggle(source)}
                              className="text-gray-400 hover:text-red-500 transition-colors duration-200 ml-1"
                              title="Retirer cette source"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                      </div>
                      </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Sources de financement principales</Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSourcesDropdown(!showSourcesDropdown)}
                      className="w-full h-9 border-2 border-gray-200 rounded-lg px-3 text-left flex items-center justify-between hover:border-uh2c-blue focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 transition-all duration-200"
                    >
                      <span className="text-sm text-gray-600">
                        {newAppelData.sourcesFinancement.length > 0 
                          ? `${newAppelData.sourcesFinancement.length} source(s) sélectionnée(s)`
                          : "Sélectionner les sources de financement"
                        }
                      </span>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showSourcesDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showSourcesDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 border-2 border-gray-200 rounded-lg bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
                        <div className="p-2 border-b border-gray-200">
                        <Input
                            placeholder="Rechercher une source..."
                            className="h-8 text-sm"
                            value={sourcesSearchTerm}
                            onChange={(e) => setSourcesSearchTerm(e.target.value)}
                        />
                      </div>
                        <div className="p-1">
                          {sourcesFinancement
                            .filter(source => source.toLowerCase().includes(sourcesSearchTerm.toLowerCase()))
                            .map((source) => (
                              <div key={source} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded transition-colors duration-200">
                                <Checkbox
                                  id={`appel-source-${source}`}
                                  checked={newAppelData.sourcesFinancement.includes(source)}
                                  onCheckedChange={() => handleAppelSourceFinancementToggle(source)}
                                  className="data-[state=checked]:bg-uh2c-blue data-[state=checked]:border-uh2c-blue"
                                />
                                <Label htmlFor={`appel-source-${source}`} className="text-sm font-medium cursor-pointer flex-1">{source}</Label>
                      </div>
                            ))}
                      </div>
                    </div>
                    )}
                  </div>
                      </div>
                      </div>
                                        </div>
                    
            {/* Description */}
            <div className="space-y-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                  <AlignLeft className="h-3 w-3 text-uh2c-blue" />
                        </div>
                <h3 className="text-base font-semibold text-gray-900">Description</h3>
                  </div>

                      <div className="space-y-2">
                <Label htmlFor="appelDescription" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Description <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Textarea
                    id="appelDescription"
                    value={newAppelData.description}
                    onChange={(e) => handleNewAppelInputChange("description", e.target.value)}
                    className={`min-h-[100px] border-2 ${newAppelErrors.description ? "border-red-500 bg-red-50" : "border-gray-200"} focus:border-uh2c-blue focus:ring-4 focus:ring-uh2c-blue/20 rounded-lg transition-all duration-200 resize-none`}
                    placeholder="Description détaillée de l'appel à projets, objectifs, critères d'éligibilité, etc."
                          required
                        />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {newAppelData.description.length}/1000
                      </div>
                      </div>
                {newAppelErrors.description && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <X className="h-3 w-3" />
                    La description est requise
                  </p>
                )}
                {newAppelData.description.length > 800 && (
                  <p className="text-orange-500 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {newAppelData.description.length > 950 ? "Limite presque atteinte" : "Description assez longue"}
                  </p>
                )}
                    </div>
                  </div>

                    {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 bg-white rounded-xl p-4 shadow-sm">
                    <Button 
                      type="button" 
                      variant="outline" 
                onClick={() => {
                  setShowNewAppelForm(false)
                  setShowEditAppelForm(false)
                }}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                className="px-6 py-2 bg-gradient-to-r from-uh2c-blue to-uh2c-blue/90 hover:from-uh2c-blue/90 hover:to-uh2c-blue text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                {showEditAppelForm ? (
                  <>
                    <Edit className="h-4 w-4" />
                    Modifier l'appel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Créer l'appel
                  </>
                )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
    </div>
  )
} 