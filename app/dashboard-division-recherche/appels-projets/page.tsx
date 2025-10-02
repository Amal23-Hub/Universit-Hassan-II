"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  BookOpen, 
  Calendar,
  DollarSign,
  Users,
  Target,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Building,
  UserPlus,
  Settings,
  X
} from "lucide-react"

interface AppelProjet {
  id: string
  titre: string
  description: string
  programme: string
  organisme: string
  dateOuverture: string
  dateLimite: string
  budget: number
  nombreProjetsAttendus: number
  statut: "ouvert" | "fermé" | "en_cours"
  type: "cree" | "demande" // Nouveau champ pour différencier
  demandeur?: string // Pour les demandes
  priorite?: "haute" | "moyenne" | "basse" // Pour les demandes
  raisonDemande?: string // Pour les demandes
}

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
  type: "cree" | "demande" // Nouveau champ pour différencier
}

export default function AppelsProjetsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("appels")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [filterOrganisme, setFilterOrganisme] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterAnnee, setFilterAnnee] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [showNewAppelForm, setShowNewAppelForm] = useState(false)
  const [showNewDemandeForm, setShowNewDemandeForm] = useState(false)
  const [showNewProgramForm, setShowNewProgramForm] = useState(false)
  const [selectedAppel, setSelectedAppel] = useState<AppelProjet | null>(null)
  const [showAppelDetails, setShowAppelDetails] = useState(false)
  const [filteredAppels, setFilteredAppels] = useState<AppelProjet[]>([])

  // Programmes disponibles
  const programmesList = [
    "Programme National de Recherche en IA",
    "Programme de Recherche Environnementale", 
    "Programme Énergies Renouvelables",
    "Programme Sécurité Numérique",
    "Programme Biotechnologie",
    "Programme Innovation Technologique",
    "Programme Développement Durable"
  ]

  // Données des programmes
  const [programmes] = useState<Programme[]>([
    {
      id: "P001",
      name: "Programme National de Recherche en IA",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateDebut: "2024-01-01",
      dateFin: "2026-12-31",
      description: "Programme national dédié au développement de l'intelligence artificielle et des technologies numériques avancées",
      budget: 5000000,
      nombreProjets: 25,
      statut: "en_cours",
      objectifs: ["Développer l'IA au Maroc", "Former des experts", "Créer des partenariats"],
      criteres: ["Équipe pluridisciplinaire", "Impact économique", "Innovation technologique"],
      type: "cree"
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
      type: "cree"
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
      type: "cree"
    },
    {
      id: "P004",
      name: "Programme Santé et Biotechnologie",
      organisme: "Ministère de la Santé",
      dateDebut: "2024-02-01",
      dateFin: "2026-01-31",
      description: "Recherche en santé publique et biotechnologies médicales",
      budget: 4500000,
      nombreProjets: 20,
      statut: "en_cours",
      objectifs: ["Amélioration de la santé publique", "Innovation médicale", "Transfert de technologies"],
      criteres: ["Impact sanitaire", "Innovation médicale", "Collaboration internationale"],
      type: "cree"
    },
    {
      id: "P005",
      name: "Programme Agriculture Intelligente",
      organisme: "Ministère de l'Agriculture",
      dateDebut: "2024-04-01",
      dateFin: "2027-03-31",
      description: "Développement de l'agriculture de précision et des technologies agricoles",
      budget: 6000000,
      nombreProjets: 18,
      statut: "en_cours",
      objectifs: ["Modernisation agricole", "Sécurité alimentaire", "Innovation rurale"],
      criteres: ["Innovation agricole", "Durabilité", "Impact rural"],
      type: "cree"
    },
    {
      id: "P006",
      name: "Programme Mobilité et Transport",
      organisme: "Ministère des Transports",
      dateDebut: "2024-05-01",
      dateFin: "2026-04-30",
      description: "Solutions innovantes pour la mobilité urbaine et le transport durable",
      budget: 3500000,
      nombreProjets: 12,
      statut: "en_cours",
      objectifs: ["Mobilité durable", "Efficacité transport", "Innovation urbaine"],
      criteres: ["Innovation transport", "Durabilité", "Impact urbain"],
      type: "cree"
    },
    {
      id: "P007",
      name: "Programme Innovation Financière",
      organisme: "Bank Al-Maghrib",
      dateDebut: "2024-01-15",
      dateFin: "2025-12-31",
      description: "Développement de solutions fintech et d'inclusion financière",
      budget: 2500000,
      nombreProjets: 10,
      statut: "en_cours",
      objectifs: ["Inclusion financière", "Innovation fintech", "Stabilité financière"],
      criteres: ["Innovation financière", "Inclusion", "Sécurité"],
      type: "cree"
    },
    {
      id: "P008",
      name: "Programme Gestion de l'Eau",
      organisme: "Ministère de l'Équipement",
      dateDebut: "2024-03-15",
      dateFin: "2026-03-14",
      description: "Technologies intelligentes pour la gestion et l'optimisation des ressources en eau",
      budget: 4000000,
      nombreProjets: 15,
      statut: "en_cours",
      objectifs: ["Gestion durable de l'eau", "Optimisation des ressources", "Innovation hydraulique"],
      criteres: ["Efficacité hydraulique", "Durabilité", "Innovation"],
      type: "cree"
    },
    {
      id: "P009",
      name: "Programme Blockchain",
      organisme: "Ministère de la Transformation Numérique",
      dateDebut: "2024-06-01",
      dateFin: "2026-05-31",
      description: "Applications blockchain pour la transparence et l'efficacité de la gouvernance",
      budget: 3000000,
      nombreProjets: 8,
      statut: "en_cours",
      objectifs: ["Transparence gouvernementale", "Efficacité administrative", "Innovation blockchain"],
      criteres: ["Innovation blockchain", "Transparence", "Efficacité"],
      type: "cree"
    },
    {
      id: "P010",
      name: "Programme Architecture Durable",
      organisme: "Ministère de l'Habitat",
      dateDebut: "2024-07-01",
      dateFin: "2026-06-30",
      description: "Développement de techniques d'architecture bioclimatique pour les bâtiments durables",
      budget: 2000000,
      nombreProjets: 10,
      statut: "en_cours",
      objectifs: ["Architecture durable", "Efficacité énergétique", "Innovation construction"],
      criteres: ["Durabilité", "Efficacité énergétique", "Innovation"],
      type: "cree"
    }
  ])

  // État du formulaire
  const [formData, setFormData] = useState({
    titre: "",
    programme: "",
    organisme: "",
    dateOuverture: "",
    dateLimite: "",
    budget: "",
    nombreProjetsAttendus: "",
    sourcesFinancement: "",
    autreSourceFinancement: "",
    description: ""
  })

  // État du formulaire programme
  const [programmeFormData, setProgrammeFormData] = useState({
    nom: "",
    organisme: "",
    dateDebut: "",
    dateFin: "",
    budget: "",
    nombreProjets: "",
    sousProgramme: "",
    typologie: "",
    descriptifSousProgramme: "",
    descriptionGenerale: "",
    sourcesFinancement: "",
    autreSourceFinancement: ""
  })

  // État pour les erreurs de validation
  const [errors, setErrors] = useState<{[key: string]: boolean}>({})

  // État pour les erreurs de validation programme
  const [programmeErrors, setProgrammeErrors] = useState<{[key: string]: boolean}>({})

  // Sources de financement disponibles
  const sourcesFinancement = [
    "Ministère de l'Enseignement Supérieur",
    "Ministère de l'Environnement", 
    "Ministère de l'Énergie",
    "Agence Nationale de Sécurité",
    "Institut National de Recherche Halieutique",
    "Fonds National de Recherche",
    "Union Européenne",
    "Banque Mondiale",
    "Autres partenaires internationaux"
  ]

  // Organismes disponibles
  const organismes = [
    "Ministère de l'Enseignement Supérieur",
    "Ministère de l'Environnement",
    "Ministère de l'Énergie", 
    "Agence Nationale de Sécurité",
    "Institut National de Recherche Halieutique",
    "Centre National de Recherche Scientifique",
    "Universités partenaires"
  ]

  // Typologies disponibles
  const typologies = [
    "Recherche fondamentale",
    "Recherche appliquée",
    "Recherche développement",
    "Innovation technologique",
    "Transfert de technologie",
    "Formation et recherche",
    "Coopération internationale"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Validation des champs obligatoires
    const newErrors: {[key: string]: boolean} = {}
    
    if (!formData.titre.trim()) newErrors.titre = true
    if (!formData.programme.trim()) newErrors.programme = true
    if (!formData.organisme.trim()) newErrors.organisme = true
    if (!formData.dateOuverture.trim()) newErrors.dateOuverture = true
    if (!formData.dateLimite.trim()) newErrors.dateLimite = true
    if (!formData.budget.trim()) newErrors.budget = true
    if (!formData.nombreProjetsAttendus.trim()) newErrors.nombreProjetsAttendus = true
    if (!formData.description.trim()) newErrors.description = true
    
    // Si il y a des erreurs, les afficher et arrêter
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Créer le nouvel appel
    const nouvelAppel: AppelProjet = {
      id: `AP${String(appelsProjets.length + 1).padStart(3, '0')}`,
      titre: formData.titre,
      description: formData.description,
      programme: formData.programme,
      organisme: formData.organisme,
      dateOuverture: formData.dateOuverture,
      dateLimite: formData.dateLimite,
      budget: parseFloat(formData.budget),
      nombreProjetsAttendus: parseInt(formData.nombreProjetsAttendus),
      statut: "ouvert",
      type: "cree"
    }

    // Ajouter à la liste (dans un vrai projet, on enverrait à l'API)
    console.log("Nouvel appel créé:", nouvelAppel)
    
    // Réinitialiser le formulaire et les erreurs
    resetForm()
    setErrors({})
    setShowNewAppelForm(false)
  }

  const resetForm = () => {
    setFormData({
      titre: "",
      programme: "",
      organisme: "",
      dateOuverture: "",
      dateLimite: "",
      budget: "",
      nombreProjetsAttendus: "",
      sourcesFinancement: "",
      autreSourceFinancement: "",
      description: ""
    })
    setErrors({})
  }

  const handleProgrammeInputChange = (field: string, value: string) => {
    setProgrammeFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmitProgramme = () => {
    // Validation des champs obligatoires
    const newErrors: {[key: string]: boolean} = {}
    
    if (!programmeFormData.nom.trim()) newErrors.nom = true
    if (!programmeFormData.organisme.trim()) newErrors.organisme = true
    if (!programmeFormData.dateDebut.trim()) newErrors.dateDebut = true
    if (!programmeFormData.dateFin.trim()) newErrors.dateFin = true
    if (!programmeFormData.budget.trim()) newErrors.budget = true
    if (!programmeFormData.nombreProjets.trim()) newErrors.nombreProjets = true
    if (!programmeFormData.descriptionGenerale.trim()) newErrors.descriptionGenerale = true
    
    // Si il y a des erreurs, les afficher et arrêter
    if (Object.keys(newErrors).length > 0) {
      setProgrammeErrors(newErrors)
      return
    }

    // Créer le nouveau programme
    const nouveauProgramme: Programme = {
      id: `P${String(programmes.length + 1).padStart(3, '0')}`,
      name: programmeFormData.nom,
      organisme: programmeFormData.organisme,
      dateDebut: programmeFormData.dateDebut,
      dateFin: programmeFormData.dateFin,
      description: programmeFormData.descriptionGenerale,
      budget: parseFloat(programmeFormData.budget),
      nombreProjets: parseInt(programmeFormData.nombreProjets),
      statut: "en_cours",
      type: "cree"
    }

    // Ajouter à la liste (dans un vrai projet, on enverrait à l'API)
    console.log("Nouveau programme créé:", nouveauProgramme)
    
    // Réinitialiser le formulaire et les erreurs
    resetProgrammeForm()
    setProgrammeErrors({})
    setShowNewProgramForm(false)
  }

  const resetProgrammeForm = () => {
    setProgrammeFormData({
      nom: "",
      organisme: "",
      dateDebut: "",
      dateFin: "",
      budget: "",
      nombreProjets: "",
      sousProgramme: "",
      typologie: "",
      descriptifSousProgramme: "",
      descriptionGenerale: "",
      sourcesFinancement: "",
      autreSourceFinancement: ""
    })
    setProgrammeErrors({})
  }

  // Données des appels à projets
  const [appelsProjets] = useState<AppelProjet[]>([
    {
      id: "AP001",
      titre: "IA pour la santé préventive",
      description: "Développement d'algorithmes d'intelligence artificielle pour la prévention et le diagnostic précoce des maladies chroniques",
      programme: "Programme National de Recherche en IA",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateOuverture: "2024-01-15",
      dateLimite: "2024-06-30",
      budget: 800000,
      nombreProjetsAttendus: 5,
      statut: "en_cours",
      type: "cree"
    },
    {
      id: "AP002",
      titre: "Changement climatique et agriculture",
      description: "Étude des impacts du changement climatique sur l'agriculture marocaine et développement de solutions adaptatives",
      programme: "Programme de Recherche Environnementale",
      organisme: "Ministère de l'Environnement",
      dateOuverture: "2024-02-01",
      dateLimite: "2024-07-31",
      budget: 600000,
      nombreProjetsAttendus: 3,
      statut: "en_cours",
      type: "cree"
    },
    {
      id: "AP003",
      titre: "Optimisation énergétique des bâtiments",
      description: "Solutions innovantes pour l'optimisation énergétique des bâtiments publics et privés",
      programme: "Programme Énergies Renouvelables",
      organisme: "Ministère de l'Énergie",
      dateOuverture: "2024-03-01",
      dateLimite: "2024-08-31",
      budget: 1000000,
      nombreProjetsAttendus: 4,
      statut: "en_cours",
      type: "cree"
    },
    {
      id: "AP004",
      titre: "Cybersécurité avancée",
      description: "Développement de solutions de cybersécurité pour les infrastructures critiques",
      programme: "Programme Sécurité Numérique",
      organisme: "Agence Nationale de Sécurité",
      dateOuverture: "2024-01-20",
      dateLimite: "2024-05-15",
      budget: 750000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      type: "demande",
      demandeur: "Dr. Karim Alami",
      priorite: "haute",
      raisonDemande: "Besoin urgent de renforcement de la sécurité des systèmes gouvernementaux"
    },
    {
      id: "AP005",
      titre: "Biotechnologie marine",
      description: "Exploitation des ressources marines pour le développement de produits pharmaceutiques",
      programme: "Programme Biotechnologie",
      organisme: "Institut National de Recherche Halieutique",
      dateOuverture: "2024-02-15",
      dateLimite: "2024-07-15",
      budget: 900000,
      nombreProjetsAttendus: 2,
      statut: "ouvert",
      type: "demande",
      demandeur: "Dr. Sara El Harti",
      priorite: "moyenne",
      raisonDemande: "Opportunité de développement économique dans les régions côtières"
    },
    {
      id: "AP006",
      titre: "Smart Cities et IoT",
      description: "Développement de solutions intelligentes pour les villes marocaines basées sur l'Internet des Objets",
      programme: "Programme Innovation Technologique",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateOuverture: "2024-04-01",
      dateLimite: "2024-09-30",
      budget: 1200000,
      nombreProjetsAttendus: 6,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP007",
      titre: "Médecine personnalisée",
      description: "Recherche en médecine personnalisée et pharmacogénomique pour les populations marocaines",
      programme: "Programme Santé et Biotechnologie",
      organisme: "Ministère de la Santé",
      dateOuverture: "2024-03-15",
      dateLimite: "2024-08-31",
      budget: 1500000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP008",
      titre: "Agriculture de précision",
      description: "Technologies d'agriculture de précision pour optimiser la production agricole",
      programme: "Programme Agriculture Intelligente",
      organisme: "Ministère de l'Agriculture",
      dateOuverture: "2024-02-20",
      dateLimite: "2024-07-20",
      budget: 800000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP009",
      titre: "Transport durable",
      description: "Solutions de transport durable et mobilité urbaine pour les grandes villes marocaines",
      programme: "Programme Mobilité et Transport",
      organisme: "Ministère des Transports",
      dateOuverture: "2024-04-10",
      dateLimite: "2024-10-10",
      budget: 1100000,
      nombreProjetsAttendus: 5,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP010",
      titre: "Éducation numérique",
      description: "Développement de plateformes éducatives numériques pour l'enseignement supérieur",
      programme: "Programme Éducation et Numérique",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateOuverture: "2024-01-10",
      dateLimite: "2024-06-10",
      budget: 700000,
      nombreProjetsAttendus: 4,
      statut: "fermé",
      type: "cree"
    },
    {
      id: "AP011",
      titre: "Gestion des déchets intelligente",
      description: "Systèmes intelligents de gestion et valorisation des déchets urbains",
      programme: "Programme Environnement et Développement Durable",
      organisme: "Ministère de l'Environnement",
      dateOuverture: "2024-03-20",
      dateLimite: "2024-08-20",
      budget: 950000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP012",
      titre: "Fintech et inclusion financière",
      description: "Solutions fintech pour améliorer l'inclusion financière au Maroc",
      programme: "Programme Innovation Financière",
      organisme: "Bank Al-Maghrib",
      dateOuverture: "2024-05-01",
      dateLimite: "2024-10-01",
      budget: 1300000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP013",
      titre: "Tourisme intelligent et durable",
      description: "Développement de solutions numériques pour un tourisme durable et intelligent",
      programme: "Programme Tourisme et Numérique",
      organisme: "Ministère du Tourisme",
      dateOuverture: "2024-06-01",
      dateLimite: "2024-11-30",
      budget: 850000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP014",
      titre: "Logistique et supply chain 4.0",
      description: "Optimisation des chaînes logistiques avec les technologies 4.0",
      programme: "Programme Industrie 4.0",
      organisme: "Ministère de l'Industrie",
      dateOuverture: "2024-04-15",
      dateLimite: "2024-09-15",
      budget: 1400000,
      nombreProjetsAttendus: 5,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP015",
      titre: "Sécurité alimentaire et nutrition",
      description: "Recherche sur la sécurité alimentaire et la nutrition pour les populations vulnérables",
      programme: "Programme Sécurité Alimentaire",
      organisme: "Ministère de l'Agriculture",
      dateOuverture: "2024-03-10",
      dateLimite: "2024-08-10",
      budget: 950000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP016",
      titre: "Énergies renouvelables marines",
      description: "Développement des énergies renouvelables marines (éolien offshore, houle)",
      programme: "Programme Énergies Marines",
      organisme: "Ministère de l'Énergie",
      dateOuverture: "2024-05-15",
      dateLimite: "2024-10-15",
      budget: 1800000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP017",
      titre: "Intelligence artificielle pour l'éducation",
      description: "Applications d'IA pour personnaliser l'apprentissage et améliorer l'éducation",
      programme: "Programme IA et Éducation",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateOuverture: "2024-02-20",
      dateLimite: "2024-07-20",
      budget: 1100000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP018",
      titre: "Médecine traditionnelle et pharmacopée",
      description: "Valorisation de la médecine traditionnelle marocaine et développement de nouveaux médicaments",
      programme: "Programme Médecine Traditionnelle",
      organisme: "Ministère de la Santé",
      dateOuverture: "2024-06-10",
      dateLimite: "2024-11-10",
      budget: 1200000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP019",
      titre: "Gestion intelligente de l'eau",
      description: "Technologies intelligentes pour la gestion et l'optimisation des ressources en eau",
      programme: "Programme Gestion de l'Eau",
      organisme: "Ministère de l'Équipement",
      dateOuverture: "2024-04-20",
      dateLimite: "2024-09-20",
      budget: 1600000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP020",
      titre: "Blockchain et gouvernance numérique",
      description: "Applications blockchain pour la transparence et l'efficacité de la gouvernance",
      programme: "Programme Blockchain",
      organisme: "Ministère de la Transformation Numérique",
      dateOuverture: "2024-07-01",
      dateLimite: "2024-12-01",
      budget: 2000000,
      nombreProjetsAttendus: 5,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP021",
      titre: "Architecture bioclimatique",
      description: "Développement de techniques d'architecture bioclimatique pour les bâtiments durables",
      programme: "Programme Architecture Durable",
      organisme: "Ministère de l'Habitat",
      dateOuverture: "2024-05-20",
      dateLimite: "2024-10-20",
      budget: 900000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP022",
      titre: "Cybersécurité pour les PME",
      description: "Solutions de cybersécurité adaptées aux besoins des petites et moyennes entreprises",
      programme: "Programme Cybersécurité PME",
      organisme: "Agence Nationale de Sécurité",
      dateOuverture: "2024-03-25",
      dateLimite: "2024-08-25",
      budget: 750000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP023",
      titre: "Mobilité électrique et infrastructure",
      description: "Développement de l'infrastructure pour la mobilité électrique au Maroc",
      programme: "Programme Mobilité Électrique",
      organisme: "Ministère des Transports",
      dateOuverture: "2024-06-15",
      dateLimite: "2024-11-15",
      budget: 2500000,
      nombreProjetsAttendus: 6,
      statut: "ouvert",
      type: "cree"
    },
    {
      id: "AP024",
      titre: "Intelligence artificielle pour l'agriculture",
      description: "Applications d'IA pour optimiser la production agricole et la gestion des ressources",
      programme: "Programme IA et Agriculture",
      organisme: "Ministère de l'Agriculture",
      dateOuverture: "2024-04-30",
      dateLimite: "2024-09-30",
      budget: 1700000,
      nombreProjetsAttendus: 4,
      statut: "ouvert",
      type: "cree"
    }
  ])

  // Appliquer les filtres
  useEffect(() => {
    if (activeTab === "appels") {
      let filtered = appelsProjets

      if (searchTerm) {
        filtered = filtered.filter(appel =>
          appel.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appel.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (filterProgramme !== "all") {
        filtered = filtered.filter(appel => appel.programme === filterProgramme)
      }

      if (filterOrganisme !== "all") {
        filtered = filtered.filter(appel => appel.organisme === filterOrganisme)
      }

      if (filterStatut !== "all") {
        filtered = filtered.filter(appel => appel.statut === filterStatut)
      }

      if (filterType !== "all") {
        filtered = filtered.filter(appel => appel.type === filterType)
      }

      setFilteredAppels(filtered)
    } else {
      // Filtrage pour les programmes
      let filtered = programmes

      if (searchTerm) {
        filtered = filtered.filter(programme =>
          programme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          programme.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      if (filterProgramme !== "all") {
        filtered = filtered.filter(programme => programme.name === filterProgramme)
      }

      if (filterOrganisme !== "all") {
        filtered = filtered.filter(programme => programme.organisme === filterOrganisme)
      }

      if (filterStatut !== "all") {
        filtered = filtered.filter(programme => programme.statut === filterStatut)
      }

      if (filterAnnee !== "all") {
        const anneeDebut = new Date(programme.dateDebut).getFullYear().toString()
        const anneeFin = new Date(programme.dateFin).getFullYear().toString()
        matches = matches && (anneeDebut === filterAnnee || anneeFin === filterAnnee)
      }

      setFilteredAppels([]) // Vider les appels filtrés quand on est sur les programmes
    }
  }, [appelsProjets, programmes, searchTerm, filterProgramme, filterOrganisme, filterStatut, filterAnnee, filterType, activeTab])

  // Fonction pour vérifier si un programme est actif
  const isProgrammeActif = (dateFin: string) => {
    return new Date(dateFin) > new Date()
  }

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  // Fonction pour obtenir le badge de statut des programmes
  const getProgrammeStatutBadge = (statut: string, dateFin: string) => {
    const isActif = isProgrammeActif(dateFin)
    
    if (statut === "en_cours" && isActif) {
      return <Badge className="bg-green-100 text-green-800">En cours</Badge>
    } else if (statut === "termine" || !isActif) {
      return <Badge className="bg-gray-100 text-gray-800">Terminé</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">Inactif</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "ouvert":
        return "Ouvert"
      case "fermé":
        return "Fermé"
      case "en_cours":
        return "En cours"
      default:
        return "Inconnu"
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "ouvert":
        return "bg-green-100 text-green-800"
      case "fermé":
        return "bg-red-100 text-red-800"
      case "en_cours":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "cree":
        return "Créé par DR"
      case "demande":
        return "Demande reçue"
      default:
        return "Inconnu"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "cree":
        return "bg-blue-100 text-blue-800"
      case "demande":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPrioriteColor = (priorite?: string) => {
    switch (priorite) {
      case "haute":
        return "bg-red-100 text-red-800"
      case "moyenne":
        return "bg-yellow-100 text-yellow-800"
      case "basse":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const appelsCrees = appelsProjets.filter(appel => appel.type === "cree")
  const appelsDemandes = appelsProjets.filter(appel => appel.type === "demande")
  const appelsOuverts = appelsProjets.filter(appel => appel.statut === "ouvert")
  const appelsFermes = appelsProjets.filter(appel => appel.statut === "fermé")

  const handleApprouverAppel = (appel: AppelProjet) => {
    // Logique pour approuver un appel
    console.log("Approuver l'appel:", appel)
  }

  const handleShowProgrammeDetails = (programme: Programme) => {
    setSelectedAppel(programme as any) // Conversion temporaire pour réutiliser le modal
    setShowAppelDetails(true)
  }

  const handleEditProgramme = (programme: Programme) => {
    // Logique pour modifier un programme
    console.log("Modifier le programme:", programme)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Appels à projets</h1>
                  <p className="text-gray-600 mt-2">Gérez les appels à projets de recherche</p>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => activeTab === "appels" ? setShowNewAppelForm(true) : setShowNewProgramForm(true)} 
                    className="bg-uh2c-blue hover:bg-uh2c-blue/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau {activeTab === "appels" ? "appel" : "programme"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Onglets pour les deux volets */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("appels")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "appels"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Appels à projets
                </button>
                <button
                  onClick={() => setActiveTab("programmes")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "programmes"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Programmes
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Appels créés</p>
                      <p className="text-2xl font-bold text-blue-600">{appelsCrees.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Demandes reçues</p>
                      <p className="text-2xl font-bold text-orange-600">{appelsDemandes.length}</p>
                    </div>
                    <UserPlus className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Appels ouverts</p>
                      <p className="text-2xl font-bold text-green-600">{appelsOuverts.length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Appels fermés</p>
                      <p className="text-2xl font-bold text-red-600">{appelsFermes.length}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
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
                    placeholder={activeTab === "appels" ? "Rechercher un appel à projets..." : "Rechercher un programme..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl"
                  />
                </div>

                {/* Filtre Programme en haut */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    {activeTab === "appels" ? "Programme" : "Programme"}
                  </Label>
                  <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                    <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                      <SelectValue placeholder="Tous les programmes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les programmes</SelectItem>
                      {programmesList.map((programme) => (
                        <SelectItem key={programme} value={programme}>
                          {programme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtres en grille */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Organisme</Label>
                    <Select value={filterOrganisme} onValueChange={setFilterOrganisme}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les organismes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les organismes</SelectItem>
                        <SelectItem value="Ministère de l'Enseignement Supérieur">Ministère de l'Enseignement Supérieur</SelectItem>
                        <SelectItem value="Ministère de l'Environnement">Ministère de l'Environnement</SelectItem>
                        <SelectItem value="Ministère de l'Énergie">Ministère de l'Énergie</SelectItem>
                        <SelectItem value="Agence Nationale de Sécurité">Agence Nationale de Sécurité</SelectItem>
                        <SelectItem value="Institut National de Recherche Halieutique">Institut National de Recherche Halieutique</SelectItem>
                        <SelectItem value="Ministère de la Santé">Ministère de la Santé</SelectItem>
                        <SelectItem value="Ministère de l'Agriculture">Ministère de l'Agriculture</SelectItem>
                        <SelectItem value="Ministère des Transports">Ministère des Transports</SelectItem>
                        <SelectItem value="Bank Al-Maghrib">Bank Al-Maghrib</SelectItem>
                        <SelectItem value="Ministère de l'Équipement">Ministère de l'Équipement</SelectItem>
                        <SelectItem value="Ministère de la Transformation Numérique">Ministère de la Transformation Numérique</SelectItem>
                        <SelectItem value="Ministère de l'Habitat">Ministère de l'Habitat</SelectItem>
                        <SelectItem value="Ministère du Tourisme">Ministère du Tourisme</SelectItem>
                        <SelectItem value="Ministère de l'Industrie">Ministère de l'Industrie</SelectItem>
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
                        {activeTab === "appels" ? (
                          <>
                            <SelectItem value="ouvert">Ouvert</SelectItem>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="fermé">Fermé</SelectItem>
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

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="cree">Créé par DR</SelectItem>
                        <SelectItem value="demande">Demande reçue</SelectItem>
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
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>


              </CardContent>
            </Card>

            {/* Appels à projets ouverts et fermés */}
            <div className="space-y-6">
              {activeTab === "appels" ? (
                <>
                  {/* Appels à projets ouverts */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appels à projets ouverts</h3>
                    <div className="space-y-4">
                      {filteredAppels.filter(appel => appel.statut === "ouvert").map((appel) => (
                        <Card key={appel.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-lg font-semibold text-gray-900">{appel.titre}</h3>
                                  <Badge className={getTypeColor(appel.type)}>
                                    {getTypeLabel(appel.type)}
                                  </Badge>
                                  <Badge className={getStatutColor(appel.statut)}>
                                    {getStatutLabel(appel.statut)}
                                  </Badge>
                                  {appel.priorite && (
                                    <Badge className={getPrioriteColor(appel.priorite)}>
                                      Priorité {appel.priorite}
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-gray-600 mb-4">{appel.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{appel.organisme}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{appel.programme}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Limite: {new Date(appel.dateLimite).toLocaleDateString('fr-FR')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{formatCurrency(appel.budget)}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">{appel.nombreProjetsAttendus} projets attendus</span>
                                </div>

                                {appel.type === "demande" && (
                                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <UserPlus className="h-4 w-4 text-orange-600" />
                                      <span className="text-sm font-medium text-orange-800">Demandeur: {appel.demandeur}</span>
                                    </div>
                                    {appel.raisonDemande && (
                                      <p className="text-sm text-orange-700">{appel.raisonDemande}</p>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                <Button variant="outline" size="sm" onClick={() => handleShowProgrammeDetails(programme as any)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Détails
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditProgramme(programme as any)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Appels à projets fermés */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appels à projets fermés</h3>
                    <div className="space-y-4">
                      {filteredAppels.filter(appel => appel.statut === "fermé").map((appel) => (
                        <Card key={appel.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-lg font-semibold text-gray-900">{appel.titre}</h3>
                                  <Badge className={getTypeColor(appel.type)}>
                                    {getTypeLabel(appel.type)}
                                  </Badge>
                                  <Badge className={getStatutColor(appel.statut)}>
                                    {getStatutLabel(appel.statut)}
                                  </Badge>
                                  {appel.priorite && (
                                    <Badge className={getPrioriteColor(appel.priorite)}>
                                      Priorité {appel.priorite}
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-gray-600 mb-4">{appel.description}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{appel.organisme}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{appel.programme}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Limite: {new Date(appel.dateLimite).toLocaleDateString('fr-FR')}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{formatCurrency(appel.budget)}</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">{appel.nombreProjetsAttendus} projets attendus</span>
                                </div>

                                {appel.type === "demande" && (
                                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <UserPlus className="h-4 w-4 text-orange-600" />
                                      <span className="text-sm font-medium text-orange-800">Demandeur: {appel.demandeur}</span>
                                    </div>
                                    {appel.raisonDemande && (
                                      <p className="text-sm text-orange-700">{appel.raisonDemande}</p>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                <Button variant="outline" size="sm" onClick={() => handleShowProgrammeDetails(programme as any)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Détails
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditProgramme(programme as any)}>
                                  <Edit className="h-4 w-4 mr-1" />
                                  Modifier
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Section Programmes avec Cards */
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Programmes de recherche</h3>
                  <div className="space-y-4">
                    {programmes.filter(programme => {
                      // Appliquer les mêmes filtres que dans useEffect
                      let matches = true
                      
                      if (searchTerm) {
                        matches = matches && (
                          programme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          programme.description.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                      }

                      if (filterProgramme !== "all") {
                        matches = matches && programme.name === filterProgramme
                      }

                      if (filterOrganisme !== "all") {
                        matches = matches && programme.organisme === filterOrganisme
                      }

                      if (filterStatut !== "all") {
                        matches = matches && programme.statut === filterStatut
                      }

                      if (filterAnnee !== "all") {
                        const anneeDebut = new Date(programme.dateDebut).getFullYear().toString()
                        const anneeFin = new Date(programme.dateFin).getFullYear().toString()
                        matches = matches && (anneeDebut === filterAnnee || anneeFin === filterAnnee)
                      }

                      return matches
                    }).map((programme) => (
                      <Card key={programme.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">{programme.name}</h3>
                                {getProgrammeStatutBadge(programme.statut, programme.dateFin)}
                                <Badge className={getTypeColor(programme.type)}>
                                  {getTypeLabel(programme.type)}
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-800">
                                  Programme
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-4">{programme.description}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">{programme.organisme}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {formatDate(programme.dateDebut)} - {formatDate(programme.dateFin)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">{formatCurrency(programme.budget)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">{programme.nombreProjets} projets</span>
                                </div>
                              </div>

                              {programme.objectifs && programme.objectifs.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Objectifs :</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {programme.objectifs.map((objectif, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {objectif}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {programme.criteres && programme.criteres.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Critères :</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {programme.criteres.map((critere, index) => (
                                      <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                                        {critere}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <Button variant="outline" size="sm" onClick={() => handleShowProgrammeDetails(programme)}>
                                <Eye className="h-4 w-4 mr-1" />
                                Détails
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEditProgramme(programme)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>


          </div>
        </main>
      </div>

      {/* Modal pour nouveau appel */}
      <Dialog open={showNewAppelForm} onOpenChange={setShowNewAppelForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Nouvel appel à projets
            </DialogTitle>
            <p className="text-gray-600">Créez un nouvel appel à projets</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informations principales */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations principales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titre" className="text-sm font-medium text-gray-700">
                    Titre de l'appel <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="titre"
                    placeholder="Entrez le titre de l'appel"
                    value={formData.titre}
                    onChange={(e) => handleInputChange("titre", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      errors.titre 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {errors.titre && (
                    <p className="text-red-500 text-xs mt-1">Le titre est requis.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programme" className="text-sm font-medium text-gray-700">
                    Programme <span className="text-red-600">*</span>
                  </Label>
                  <Select value={formData.programme} onValueChange={(value) => handleInputChange("programme", value)}>
                    <SelectTrigger className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      errors.programme 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}>
                      <SelectValue placeholder="Sélectionner un programme" />
                    </SelectTrigger>
                    <SelectContent>
                      {programmesList.map((programme) => (
                        <SelectItem key={programme} value={programme}>
                          {programme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.programme && (
                    <p className="text-red-500 text-xs mt-1">Le programme est requis.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organisme" className="text-sm font-medium text-gray-700">
                    Organisme <span className="text-red-600">*</span>
                  </Label>
                  <Select value={formData.organisme} onValueChange={(value) => handleInputChange("organisme", value)}>
                    <SelectTrigger className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      errors.organisme 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}>
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
                  {errors.organisme && (
                    <p className="text-red-500 text-xs mt-1">L'organisme est requis.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOuverture" className="text-sm font-medium text-gray-700">
                    Date d'ouverture <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="dateOuverture"
                    type="date"
                    value={formData.dateOuverture}
                    onChange={(e) => handleInputChange("dateOuverture", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      errors.dateOuverture 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {errors.dateOuverture && (
                    <p className="text-red-500 text-xs mt-1">La date d'ouverture est requise.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateLimite" className="text-sm font-medium text-gray-700">
                    Date limite <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="dateLimite"
                    type="date"
                    value={formData.dateLimite}
                    onChange={(e) => handleInputChange("dateLimite", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      errors.dateLimite 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {errors.dateLimite && (
                    <p className="text-red-500 text-xs mt-1">La date limite est requise.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                    Budget (MAD) <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Montant en MAD"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      errors.budget 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {errors.budget && (
                    <p className="text-red-500 text-xs mt-1">Le budget est requis.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombreProjetsAttendus" className="text-sm font-medium text-gray-700">
                    Projets attendus <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="nombreProjetsAttendus"
                    type="number"
                    placeholder="Nombre de projets"
                    value={formData.nombreProjetsAttendus}
                    onChange={(e) => handleInputChange("nombreProjetsAttendus", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      errors.nombreProjetsAttendus 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {errors.nombreProjetsAttendus && (
                    <p className="text-red-500 text-xs mt-1">Le nombre de projets attendus est requis.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sources de financement */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources de financement</h3>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Sources de financement
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionnez une source de financement (optionnel)
                </p>
                
                <Select value={formData.sourcesFinancement} onValueChange={(value) => handleInputChange("sourcesFinancement", value)}>
                  <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                    <SelectValue placeholder="Sélectionnez une source de financement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aucune">Aucune source</SelectItem>
                    <SelectItem value="Ministère de l'Enseignement Supérieur">Ministère de l'Enseignement Supérieur</SelectItem>
                    <SelectItem value="Ministère de l'Environnement">Ministère de l'Environnement</SelectItem>
                    <SelectItem value="Ministère de l'Énergie">Ministère de l'Énergie</SelectItem>
                    <SelectItem value="Agence Nationale de Sécurité">Agence Nationale de Sécurité</SelectItem>
                    <SelectItem value="Institut National de Recherche Halieutique">Institut National de Recherche Halieutique</SelectItem>
                    <SelectItem value="Fonds National de Recherche">Fonds National de Recherche</SelectItem>
                    <SelectItem value="Union Européenne">Union Européenne</SelectItem>
                    <SelectItem value="Banque Mondiale">Banque Mondiale</SelectItem>
                    <SelectItem value="Autres partenaires internationaux">Autres partenaires internationaux</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>

                {/* Champ pour source "Autre" si sélectionnée */}
                {formData.sourcesFinancement === "autre" && (
                  <div className="space-y-2">
                    <Label htmlFor="autreSourceFinancement" className="text-sm font-medium text-gray-700">
                      Précisez la source de financement
                    </Label>
                    <Input
                      id="autreSourceFinancement"
                      placeholder="Ex: Fondation privée, Organisation internationale..."
                      value={formData.autreSourceFinancement}
                      onChange={(e) => handleInputChange("autreSourceFinancement", e.target.value)}
                      className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                )}
                {errors.sourcesFinancement && (
                  <p className="text-red-500 text-xs mt-1">La source de financement est requise.</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez l'appel à projets..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={`border-2 focus:ring-2 rounded-lg ${
                    errors.description 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                  }`}
                  rows={6}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">La description est requise.</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => {
                resetForm()
                setShowNewAppelForm(false)
              }}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="px-6 py-2 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
              Créer l'appel à projets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour nouveau programme */}
      <Dialog open={showNewProgramForm} onOpenChange={setShowNewProgramForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-uh2c-blue/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-uh2c-blue" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Nouveau programme de recherche
                </DialogTitle>
                <p className="text-gray-600 mt-1">
                  Créez un nouveau programme de recherche pour la Division de Recherche
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informations principales */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations principales</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-sm font-medium text-gray-700">
                    Nom du programme <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="nom"
                    placeholder="Entrez le nom du programme"
                    value={programmeFormData.nom}
                    onChange={(e) => handleProgrammeInputChange("nom", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      programmeErrors.nom 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {programmeErrors.nom && (
                    <p className="text-red-500 text-xs mt-1">Le nom du programme est requis.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organisme" className="text-sm font-medium text-gray-700">
                    Organisme <span className="text-red-600">*</span>
                  </Label>
                  <Select value={programmeFormData.organisme} onValueChange={(value) => handleProgrammeInputChange("organisme", value)}>
                    <SelectTrigger className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      programmeErrors.organisme 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}>
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
                  {programmeErrors.organisme && (
                    <p className="text-red-500 text-xs mt-1">L'organisme est requis.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateDebut" className="text-sm font-medium text-gray-700">
                    Date de début <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="dateDebut"
                    type="date"
                    value={programmeFormData.dateDebut}
                    onChange={(e) => handleProgrammeInputChange("dateDebut", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      programmeErrors.dateDebut 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {programmeErrors.dateDebut && (
                    <p className="text-red-500 text-xs mt-1">La date de début est requise.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFin" className="text-sm font-medium text-gray-700">
                    Date de fin <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="dateFin"
                    type="date"
                    value={programmeFormData.dateFin}
                    onChange={(e) => handleProgrammeInputChange("dateFin", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      programmeErrors.dateFin 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {programmeErrors.dateFin && (
                    <p className="text-red-500 text-xs mt-1">La date de fin est requise.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                    Budget (MAD) <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Montant en MAD"
                    value={programmeFormData.budget}
                    onChange={(e) => handleProgrammeInputChange("budget", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      programmeErrors.budget 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {programmeErrors.budget && (
                    <p className="text-red-500 text-xs mt-1">Le budget est requis.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombreProjets" className="text-sm font-medium text-gray-700">
                    Nombre de projets <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="nombreProjets"
                    type="number"
                    placeholder="Nombre de projets"
                    value={programmeFormData.nombreProjets}
                    onChange={(e) => handleProgrammeInputChange("nombreProjets", e.target.value)}
                    className={`h-11 border-2 focus:ring-2 rounded-lg ${
                      programmeErrors.nombreProjets 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                  />
                  {programmeErrors.nombreProjets && (
                    <p className="text-red-500 text-xs mt-1">Le nombre de projets est requis.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations détaillées</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sousProgramme" className="text-sm font-medium text-gray-700">
                    Sous-programme
                  </Label>
                  <Input
                    id="sousProgramme"
                    placeholder="Nom du sous-programme"
                    value={programmeFormData.sousProgramme}
                    onChange={(e) => handleProgrammeInputChange("sousProgramme", e.target.value)}
                    className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typologie" className="text-sm font-medium text-gray-700">
                    Typologie
                  </Label>
                  <Select value={programmeFormData.typologie} onValueChange={(value) => handleProgrammeInputChange("typologie", value)}>
                    <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                      <SelectValue placeholder="Sélectionner une typologie" />
                    </SelectTrigger>
                    <SelectContent>
                      {typologies.map((typologie) => (
                        <SelectItem key={typologie} value={typologie}>
                          {typologie}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Descriptions</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descriptifSousProgramme" className="text-sm font-medium text-gray-700">
                    Descriptif du sous-programme
                  </Label>
                  <Textarea
                    id="descriptifSousProgramme"
                    placeholder="Décrivez les détails du sous-programme..."
                    value={programmeFormData.descriptifSousProgramme}
                    onChange={(e) => handleProgrammeInputChange("descriptifSousProgramme", e.target.value)}
                    className="border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionGenerale" className="text-sm font-medium text-gray-700">
                    Description générale <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="descriptionGenerale"
                    placeholder="Décrivez le programme de recherche..."
                    value={programmeFormData.descriptionGenerale}
                    onChange={(e) => handleProgrammeInputChange("descriptionGenerale", e.target.value)}
                    className={`border-2 focus:ring-2 rounded-lg ${
                      programmeErrors.descriptionGenerale 
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    rows={6}
                  />
                  {programmeErrors.descriptionGenerale && (
                    <p className="text-red-500 text-xs mt-1">La description générale est requise.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sources de financement */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources de financement</h3>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Sources de financement <span className="text-red-600">*</span>
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionnez une source de financement
                </p>
                
                <Select value={programmeFormData.sourcesFinancement} onValueChange={(value) => handleProgrammeInputChange("sourcesFinancement", value)}>
                  <SelectTrigger className={`h-11 border-2 focus:ring-2 rounded-lg ${
                    programmeErrors.sourcesFinancement 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                  }`}>
                    <SelectValue placeholder="Sélectionnez une source de financement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aucune">Aucune source</SelectItem>
                    <SelectItem value="Ministère de l'Enseignement Supérieur">Ministère de l'Enseignement Supérieur</SelectItem>
                    <SelectItem value="Ministère de l'Environnement">Ministère de l'Environnement</SelectItem>
                    <SelectItem value="Ministère de l'Énergie">Ministère de l'Énergie</SelectItem>
                    <SelectItem value="Agence Nationale de Sécurité">Agence Nationale de Sécurité</SelectItem>
                    <SelectItem value="Institut National de Recherche Halieutique">Institut National de Recherche Halieutique</SelectItem>
                    <SelectItem value="Fonds National de Recherche">Fonds National de Recherche</SelectItem>
                    <SelectItem value="Union Européenne">Union Européenne</SelectItem>
                    <SelectItem value="Banque Mondiale">Banque Mondiale</SelectItem>
                    <SelectItem value="Autres partenaires internationaux">Autres partenaires internationaux</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>

                {/* Champ pour source "Autre" si sélectionnée */}
                {programmeFormData.sourcesFinancement === "autre" && (
                  <div className="space-y-2">
                    <Label htmlFor="autreSourceFinancement" className="text-sm font-medium text-gray-700">
                      Précisez la source de financement
                    </Label>
                    <Input
                      id="autreSourceFinancement"
                      placeholder="Ex: Fondation privée, Organisation internationale..."
                      value={programmeFormData.autreSourceFinancement}
                      onChange={(e) => handleProgrammeInputChange("autreSourceFinancement", e.target.value)}
                      className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                )}
                {programmeErrors.sourcesFinancement && (
                  <p className="text-red-500 text-xs mt-1">La source de financement est requise.</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => {
                resetProgrammeForm()
                setShowNewProgramForm(false)
              }}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button onClick={handleSubmitProgramme} className="px-6 py-2 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
              Créer le programme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 