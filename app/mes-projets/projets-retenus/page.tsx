"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Clock, DollarSign, Calendar, Search, Filter, Users, FileText, Printer, Download, Eye, XCircle, FileCheck, Plus, AlertCircle, BookOpen } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

interface Tranche {
  numero: number
  anneeCivile: string
  montant: number
  montantRecu?: number
  dateReception?: string
  statut: "payee" | "en_attente" | "en_cours"
  programmeEmploiStatut?: "genere" | "en_signature" | "signe"
  programmeEmploiDate?: string
}

interface ProjetRetenu {
  id: string
  titre: string
  description: string
  statut: "en_cours" | "termine" | "en_attente"
  budget: number
  dateDebut: string
  dateFin: string
  programme: string
  responsable: string
  avancement: number
  tranches: Tranche[]
}

const projetsRetenus: ProjetRetenu[] = [
  {
    id: "PR001",
    titre: "Développement d'un système d'intelligence artificielle pour la détection précoce du cancer",
    description: "Projet de recherche en IA médicale visant à améliorer la détection précoce des cancers",
    statut: "en_cours",
    budget: 250000,
    dateDebut: "2024-01-15",
    dateFin: "2026-01-15",
    programme: "Programme National de Recherche en IA",
    responsable: "Dr. Mohamed LAHBY",
    avancement: 65,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 80000, montantRecu: 80000, dateReception: "2024-02-15", statut: "payee", programmeEmploiStatut: "signe", programmeEmploiDate: "2024-03-20" },
      { numero: 2, anneeCivile: "2024", montant: 85000, montantRecu: 45000, dateReception: "2024-06-20", statut: "en_cours", programmeEmploiStatut: "en_signature", programmeEmploiDate: "2024-12-15" },
      { numero: 3, anneeCivile: "2025", montant: 85000, statut: "en_attente", programmeEmploiStatut: "genere", programmeEmploiDate: "2024-12-20" }
    ]
  },
  {
    id: "PR002",
    titre: "Étude sur l'impact du changement climatique sur l'agriculture marocaine",
    description: "Analyse des effets du changement climatique sur les rendements agricoles",
    statut: "termine",
    budget: 180000,
    dateDebut: "2023-06-01",
    dateFin: "2024-05-31",
    programme: "Programme de Recherche Environnementale",
    responsable: "Dr. Sara BENALI",
    avancement: 100,
    tranches: [
      { numero: 1, anneeCivile: "2023", montant: 90000, montantRecu: 90000, dateReception: "2023-08-10", statut: "payee", programmeEmploiStatut: "signe", programmeEmploiDate: "2023-09-15" },
      { numero: 2, anneeCivile: "2024", montant: 90000, montantRecu: 90000, dateReception: "2024-01-15", statut: "payee", programmeEmploiStatut: "signe", programmeEmploiDate: "2024-02-20" }
    ]
  },
  {
    id: "PR003",
    titre: "Optimisation des réseaux de télécommunication 5G",
    description: "Recherche sur l'optimisation des performances des réseaux 5G",
    statut: "en_attente",
    budget: 320000,
    dateDebut: "2024-03-01",
    dateFin: "2027-02-28",
    programme: "Programme de Recherche en Télécommunications",
          responsable: "Prof. Mohamed Lahby",
    avancement: 15,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 100000, montantRecu: 60000, dateReception: "2024-04-05", statut: "en_cours", programmeEmploiStatut: "genere", programmeEmploiDate: "2024-12-22" },
      { numero: 2, anneeCivile: "2025", montant: 110000, statut: "en_attente" },
      { numero: 3, anneeCivile: "2026", montant: 110000, statut: "en_attente" }
    ]
  },
  {
    id: "PR004",
    titre: "Intelligence artificielle pour la gestion intelligente des villes",
    description: "Développement de solutions IA pour optimiser la gestion urbaine",
    statut: "en_cours",
    budget: 450000,
    dateDebut: "2024-02-01",
    dateFin: "2027-01-31",
    programme: "Programme Smart Cities",
    responsable: "Dr. Karim TAZI",
    avancement: 25,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 150000, montantRecu: 150000, dateReception: "2024-03-15", statut: "payee", programmeEmploiStatut: "en_signature", programmeEmploiDate: "2024-12-18" },
      { numero: 2, anneeCivile: "2025", montant: 150000, statut: "en_attente" },
      { numero: 3, anneeCivile: "2026", montant: 150000, statut: "en_attente" }
    ]
  },
  {
    id: "PR005",
    titre: "Biotechnologie pour le traitement des eaux usées",
    description: "Innovation biotechnologique pour l'épuration des eaux",
    statut: "en_cours",
    budget: 280000,
    dateDebut: "2024-01-15",
    dateFin: "2026-01-15",
    programme: "Programme Biotechnologies Avancées",
    responsable: "Dr. Leila MOUSTAKIM",
    avancement: 45,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 140000, montantRecu: 140000, dateReception: "2024-02-28", statut: "payee", programmeEmploiStatut: "en_signature", programmeEmploiDate: "2024-12-20" },
      { numero: 2, anneeCivile: "2025", montant: 140000, montantRecu: 0, dateReception: "", statut: "en_attente" }
    ]
  },
  {
    id: "PR006",
    titre: "Énergies renouvelables pour les zones rurales",
    description: "Optimisation des systèmes d'énergie renouvelable",
    statut: "en_cours",
    budget: 380000,
    dateDebut: "2024-04-01",
    dateFin: "2027-03-31",
    programme: "Programme Énergies Durables",
    responsable: "Dr. Ahmed EL KADIRI",
    avancement: 20,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 126667, montantRecu: 126667, dateReception: "2024-05-20", statut: "payee" },
      { numero: 2, anneeCivile: "2025", montant: 126667, statut: "en_attente" },
      { numero: 3, anneeCivile: "2026", montant: 126666, statut: "en_attente" }
    ]
  },
  {
    id: "PR007",
    titre: "Sécurité informatique et cybersécurité",
    description: "Développement de solutions de sécurité informatique avancées",
    statut: "en_cours",
    budget: 220000,
    dateDebut: "2024-03-15",
    dateFin: "2026-03-15",
    programme: "Programme Cybersécurité",
    responsable: "Dr. Fatima BENNANI",
    avancement: 35,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 110000, montantRecu: 110000, dateReception: "2024-04-10", statut: "payee" },
      { numero: 2, anneeCivile: "2025", montant: 110000, statut: "en_attente" }
    ]
  },
  {
    id: "PR008",
    titre: "Nanotechnologies pour applications médicales",
    description: "Développement de nanomatériaux pour le diagnostic et traitement médical",
    statut: "en_cours",
    budget: 520000,
    dateDebut: "2024-05-01",
    dateFin: "2027-04-30",
    programme: "Programme Nanotechnologies Avancées",
    responsable: "Dr. Omar ZAKI",
    avancement: 18,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 173333, montantRecu: 173333, dateReception: "2024-06-15", statut: "payee", programmeEmploiStatut: "genere", programmeEmploiDate: "2024-12-25" },
      { numero: 2, anneeCivile: "2025", montant: 173333, statut: "en_attente" },
      { numero: 3, anneeCivile: "2026", montant: 173334, statut: "en_attente" }
    ]
  },
  {
    id: "PR009",
    titre: "Intelligence artificielle pour l'éducation",
    description: "Systèmes d'IA adaptatifs pour l'apprentissage personnalisé",
    statut: "en_cours",
    budget: 310000,
    dateDebut: "2024-02-01",
    dateFin: "2026-01-31",
    programme: "Programme IA Éducative",
    responsable: "Dr. Samira RACHIDI",
    avancement: 42,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 155000, montantRecu: 155000, dateReception: "2024-03-20", statut: "payee", programmeEmploiStatut: "en_signature", programmeEmploiDate: "2024-12-28" },
      { numero: 2, anneeCivile: "2025", montant: 155000, statut: "en_attente" }
    ]
  },
  {
    id: "PR010",
    titre: "Biotechnologie pour l'agriculture durable",
    description: "Développement de solutions biotechnologiques pour l'agriculture écologique",
    statut: "en_cours",
    budget: 290000,
    dateDebut: "2024-01-10",
    dateFin: "2026-01-09",
    programme: "Programme Biotechnologies Agricoles",
    responsable: "Dr. Nadia CHERKAOUI",
    avancement: 58,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 145000, montantRecu: 145000, dateReception: "2024-02-25", statut: "payee", programmeEmploiStatut: "signe", programmeEmploiDate: "2024-03-30" },
      { numero: 2, anneeCivile: "2025", montant: 145000, montantRecu: 80000, dateReception: "2024-07-10", statut: "en_cours", programmeEmploiStatut: "en_signature", programmeEmploiDate: "2024-12-30" }
    ]
  },
  {
    id: "PR011",
    titre: "Robotique médicale et chirurgie assistée",
    description: "Développement de robots chirurgicaux et systèmes d'assistance médicale",
    statut: "en_cours",
    budget: 680000,
    dateDebut: "2024-04-15",
    dateFin: "2027-04-14",
    programme: "Programme Robotique Médicale",
    responsable: "Dr. Hassan MOULINE",
    avancement: 22,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 226667, montantRecu: 226667, dateReception: "2024-05-30", statut: "payee", programmeEmploiStatut: "genere", programmeEmploiDate: "2024-12-22" },
      { numero: 2, anneeCivile: "2025", montant: 226667, statut: "en_attente" },
      { numero: 3, anneeCivile: "2026", montant: 226666, statut: "en_attente" }
    ]
  },
  {
    id: "PR012",
    titre: "Énergie solaire photovoltaïque avancée",
    description: "Optimisation des panneaux solaires et systèmes de stockage",
    statut: "en_cours",
    budget: 420000,
    dateDebut: "2024-03-01",
    dateFin: "2027-02-28",
    programme: "Programme Énergies Solaires",
    responsable: "Dr. Youssef IDRISSI",
    avancement: 31,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 140000, montantRecu: 140000, dateReception: "2024-04-15", statut: "payee", programmeEmploiStatut: "en_signature", programmeEmploiDate: "2024-12-24" },
      { numero: 2, anneeCivile: "2025", montant: 140000, statut: "en_attente" },
      { numero: 3, anneeCivile: "2026", montant: 140000, statut: "en_attente" }
    ]
  },
  {
    id: "PR013",
    titre: "Traitement du langage naturel arabe",
    description: "Développement d'algorithmes NLP pour la langue arabe",
    statut: "en_cours",
    budget: 260000,
    dateDebut: "2024-01-20",
    dateFin: "2026-01-19",
    programme: "Programme IA Linguistique",
    responsable: "Dr. Amina TAZI",
    avancement: 47,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 130000, montantRecu: 130000, dateReception: "2024-03-10", statut: "payee", programmeEmploiStatut: "signe", programmeEmploiDate: "2024-04-15" },
      { numero: 2, anneeCivile: "2025", montant: 130000, montantRecu: 65000, dateReception: "2024-06-25", statut: "en_cours", programmeEmploiStatut: "en_signature", programmeEmploiDate: "2024-12-26" }
    ]
  },
  {
    id: "PR014",
    titre: "Médecine régénérative et cellules souches",
    description: "Recherche sur les thérapies cellulaires et la régénération tissulaire",
    statut: "en_cours",
    budget: 750000,
    dateDebut: "2024-06-01",
    dateFin: "2028-05-31",
    programme: "Programme Médecine Régénérative",
    responsable: "Dr. Leila MANSOURI",
    avancement: 15,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 187500, montantRecu: 187500, dateReception: "2024-07-20", statut: "payee", programmeEmploiStatut: "genere", programmeEmploiDate: "2024-12-29" },
      { numero: 2, anneeCivile: "2025", montant: 187500, statut: "en_attente" },
      { numero: 3, anneeCivile: "2026", montant: 187500, statut: "en_attente" },
      { numero: 4, anneeCivile: "2027", montant: 187500, statut: "en_attente" }
    ]
  },
  {
    id: "PR015",
    titre: "Blockchain pour la traçabilité alimentaire",
    description: "Système blockchain pour assurer la traçabilité des produits alimentaires",
    statut: "en_cours",
    budget: 340000,
    dateDebut: "2024-02-15",
    dateFin: "2026-08-14",
    programme: "Programme Blockchain Applications",
    responsable: "Dr. Karim BENJELLOUN",
    avancement: 28,
    tranches: [
      { numero: 1, anneeCivile: "2024", montant: 170000, montantRecu: 170000, dateReception: "2024-04-05", statut: "payee", programmeEmploiStatut: "en_signature", programmeEmploiDate: "2024-12-27" },
      { numero: 2, anneeCivile: "2025", montant: 170000, statut: "en_attente" }
    ]
  }
]

export default function ProjetsRetenus() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [programmeFilter, setProgrammeFilter] = useState<string>("all")
  const [anneeFilter, setAnneeFilter] = useState<string>("all")
  const [showTranchesModal, setShowTranchesModal] = useState(false)
  const [showEmploiModal, setShowEmploiModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedProjet, setSelectedProjet] = useState<ProjetRetenu | null>(null)
  const [editingTranches, setEditingTranches] = useState<{[key: number]: {montantRecu: string, dateReception: string}}>({})
  const [selectedTranche, setSelectedTranche] = useState<string>("")
  const [selectedRubrique, setSelectedRubrique] = useState<string>("")
  const [selectedSousRubrique, setSelectedSousRubrique] = useState<string>("")
  const [selectedSousRubriqueDetail, setSelectedSousRubriqueDetail] = useState<string>("")
  const [emploiData, setEmploiData] = useState<{[key: string]: number}>({})
  const [selectedDestinataires, setSelectedDestinataires] = useState<string[]>([
    "responsable_structure",
    "coordinateur_projet", 
    "chef_etablissement"
  ])
  const [newDestinataireNom, setNewDestinataireNom] = useState("")
  const [newDestinataireRole, setNewDestinataireRole] = useState("")
  const [showAddDestinataire, setShowAddDestinataire] = useState(false)

  const getStatusInfo = (statut: string) => {
    switch (statut) {
      case "en_cours":
        return { label: "En cours", color: "bg-blue-100 text-blue-800", icon: Clock }
      case "termine":
        return { label: "Terminé", color: "bg-green-100 text-green-800", icon: CheckCircle }
      case "en_attente":
        return { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Clock }
      default:
        return { label: "Inconnu", color: "bg-gray-100 text-gray-800", icon: Clock }
    }
  }

  const filteredProjets = projetsRetenus.filter(projet => {
    const matchesSearch = projet.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         projet.responsable.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || projet.statut === statusFilter
    const matchesProgramme = programmeFilter === "all" || projet.programme === programmeFilter
    const matchesAnnee = anneeFilter === "all" || new Date(projet.dateDebut).getFullYear().toString() === anneeFilter
    
    return matchesSearch && matchesStatus && matchesProgramme && matchesAnnee
  })

  const programmes = [...new Set(projetsRetenus.map(p => p.programme))]

  const handleShowTranches = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowTranchesModal(true)
  }

  const handleShowEmploi = (projet: ProjetRetenu) => {
    console.log("Opening emploi modal for project:", projet.titre)
    setSelectedProjet(projet)
    setShowEmploiModal(true)
  }

  const getTrancheStatusInfo = (statut: string) => {
    switch (statut) {
      case "payee":
        return { label: "Payée", color: "bg-green-100 text-green-800" }
      case "en_cours":
        return { label: "En cours", color: "bg-blue-100 text-blue-800" }
      case "en_attente":
        return { label: "En attente", color: "bg-yellow-100 text-yellow-800" }
      default:
        return { label: "Inconnu", color: "bg-gray-100 text-gray-800" }
    }
  }

  const handleTrancheInputChange = (trancheIndex: number, field: 'montantRecu' | 'dateReception', value: string) => {
    setEditingTranches(prev => ({
      ...prev,
      [trancheIndex]: {
        ...prev[trancheIndex],
        [field]: value
      }
    }))
  }

  const handleSaveTranche = (trancheIndex: number) => {
    if (selectedProjet) {
      const updatedTranches = [...selectedProjet.tranches]
      const editingData = editingTranches[trancheIndex]
      
      if (editingData) {
        updatedTranches[trancheIndex] = {
          ...updatedTranches[trancheIndex],
          montantRecu: editingData.montantRecu ? parseFloat(editingData.montantRecu) : undefined,
          dateReception: editingData.dateReception || undefined
        }
      }
      
      setSelectedProjet({
        ...selectedProjet,
        tranches: updatedTranches
      })
      
      setEditingTranches(prev => {
        const newState = { ...prev }
        delete newState[trancheIndex]
        return newState
      })
    }
  }

  // Données des rubriques d'emploi
  const rubriquesEmploi = [
    {
      id: "personnel",
      nom: "PERSONNEL",
      sousRubriques: [
        { id: "chercheur_principal", nom: "Chercheur principal", description: "Salaire du chercheur principal" },
        { id: "doctorant", nom: "Doctorant", description: "Bourse de doctorat" },
        { id: "ingenieur", nom: "Ingénieur de recherche", description: "Salaire de l'ingénieur" },
        { id: "technicien", nom: "Technicien", description: "Salaire du technicien" },
        { id: "assistant", nom: "Assistant de recherche", description: "Salaire de l'assistant" },
        { id: "consultant", nom: "Consultant externe", description: "Honoraires de consultant" }
      ]
    },
    {
      id: "materiel_depenses",
      nom: "MATÉRIEL ET DÉPENSES DIVERSES",
      sousCategories: [
        {
          id: "allocations_indemnites",
          nom: "Allocations et indemnités pour personnel",
          sousRubriques: [
            { id: "allocations_chercheur", nom: "Allocations chercheur", description: "Allocations pour chercheur principal" },
            { id: "indemnites_doctorant", nom: "Indemnités doctorant", description: "Indemnités pour doctorant" },
            { id: "allocations_ingenieur", nom: "Allocations ingénieur", description: "Allocations pour ingénieur" },
            { id: "indemnites_technicien", nom: "Indemnités technicien", description: "Indemnités pour technicien" },
            { id: "allocations_assistant", nom: "Allocations assistant", description: "Allocations pour assistant" },
            { id: "indemnites_consultant", nom: "Indemnités consultant", description: "Indemnités pour consultant" }
          ]
        },
        {
          id: "frais_depenses",
          nom: "Frais et dépenses diverses",
          sousRubriques: [
            { id: "frais_redevances", nom: "Frais et redevances", description: "Frais administratifs et redevances" },
            { id: "seminaires_formation", nom: "Séminaires, stages et formation", description: "Frais de séminaires et formation" },
            { id: "achat_ouvrage", nom: "Achat d'ouvrage et frais d'édition", description: "Achat de livres et frais d'édition" },
            { id: "amenagement_entretien", nom: "Aménagement, entretien et équipement", description: "Frais d'aménagement et entretien" },
            { id: "achat_fournitures", nom: "Achat de fournitures", description: "Achat de fournitures de bureau" },
            { id: "transports_deplacements", nom: "Transports et déplacements", description: "Frais de transport et déplacements" },
            { id: "materiel_mobilier", nom: "Matériel et mobilier", description: "Achat de matériel et mobilier" },
            { id: "depenses_diverses", nom: "Dépenses diverses", description: "Autres dépenses non classées" }
          ]
        }
      ]
    }
  ]

  // Liste déroulante des sous-rubriques pour "Frais et dépenses diverses"
  const sousRubriquesFraisDepenses = [
    { id: "frais_redevances", nom: "Frais et redevances", description: "Frais administratifs et redevances" },
    { id: "seminaires_formation", nom: "Séminaires, stages et formation", description: "Frais de séminaires et formation" },
    { id: "achat_ouvrage", nom: "Achat d'ouvrage et frais d'édition", description: "Achat de livres et frais d'édition" },
    { id: "amenagement_entretien", nom: "Aménagement, entretien et équipement", description: "Frais d'aménagement et entretien" },
    { id: "achat_fournitures", nom: "Achat de fournitures", description: "Achat de fournitures de bureau" },
    { id: "transports_deplacements", nom: "Transports et déplacements", description: "Frais de transport et déplacements" },
    { id: "materiel_mobilier", nom: "Matériel et mobilier", description: "Achat de matériel et mobilier" },
    { id: "depenses_diverses", nom: "Dépenses diverses", description: "Autres dépenses non classées" }
  ]

  // Liste déroulante des sous-rubriques détaillées selon le modèle Excel
  const sousRubriquesDetaillees = {
    // Allocations et indemnités pour personnel
    allocations_indemnites: [
      { id: "indemnites_complementaires", nom: "Indemnités complémentaires liées aux travaux de recherches", description: "Indemnités pour travaux de recherche" },
      { id: "bourses_complementaires", nom: "Bourses complémentaires liées aux travaux de recherche", description: "Bourses pour travaux de recherche" },
      { id: "indemnites_enseignants_experts", nom: "Indemnités brutes des enseignants et des experts étrangers", description: "Indemnités pour enseignants et experts" },
      { id: "remuneration_postdoc", nom: "Rémunération des post-doctorants travaillant dans le cadre de projets", description: "Rémunération post-doctorants" },
      { id: "remuneration_agents", nom: "Rémunération des agents contractuels", description: "Rémunération agents contractuels" },
      { id: "remuneration_experts", nom: "Rémunération des experts marocains et étrangers", description: "Rémunération experts" },
      { id: "bourses_maroc", nom: "Bourses au Maroc", description: "Bourses nationales" },
      { id: "credit_non_programme", nom: "Crédit non programmé", description: "Crédits non programmés" }
    ],
    
    // Frais et redevances
    frais_redevances: [
      { id: "redevances_brevets", nom: "Redevances pour brevets, marques, droits et valeurs similaires", description: "Redevances propriété intellectuelle" },
      { id: "frais_etudes_analyses", nom: "Frais d'études, d'analyses et de sous-traitance", description: "Frais d'études et analyses" },
      { id: "frais_maquettes", nom: "Frais de réalisation de maquettes et prototypes", description: "Frais maquettes et prototypes" },
      { id: "frais_expertise", nom: "Frais d'études et d'expertise", description: "Frais d'expertise" },
      { id: "frais_aconage", nom: "Frais d'aconage et d'emmagasinage", description: "Frais de stockage" },
      { id: "redevances_eau", nom: "Redevances d'eau", description: "Redevances eau" },
      { id: "redevances_electricite", nom: "Redevances d'électricité", description: "Redevances électricité" },
      { id: "taxes_telecom", nom: "Taxes et redevances de télécommunications", description: "Taxes télécommunications" },
      { id: "taxes_reseaux", nom: "Taxes et redevances pour l'utilisation de lignes ou réseaux spécialisés", description: "Taxes réseaux spécialisés" }
    ],
    
    // Séminaires, stages et formation
    seminaires_formation: [
      { id: "frais_formation", nom: "Frais de formation", description: "Frais de formation" },
      { id: "frais_stages_seminaires", nom: "Frais de stages et de séminaires", description: "Frais stages et séminaires" },
      { id: "frais_participation_colloques", nom: "Frais de participation aux séminaires, congrés et colloques", description: "Frais participation colloques" },
      { id: "frais_inscription_colloques", nom: "Frais de participation et d'inscription aux colloques, séminaires et concours", description: "Frais inscription colloques" },
      { id: "frais_organisation_colloques", nom: "Frais d'organisation de colloques et de séminaires", description: "Frais organisation colloques" },
      { id: "frais_hebergement", nom: "Frais d'hébergement et de restauration", description: "Frais hébergement et restauration" },
      { id: "frais_reception", nom: "Frais de réception et de cérémonies officielles", description: "Frais réception et cérémonies" },
      { id: "frais_distribution_prix", nom: "Frais de distributions des prix", description: "Frais distribution prix" }
    ],
    
    // Achat d'ouvrage et frais d'édition
    achat_ouvrage: [
      { id: "abonnements_documentation", nom: "Abonnements et documentation", description: "Abonnements et documentation" },
      { id: "achat_manuels", nom: "Achat de manuels et d'ouvrages", description: "Achat manuels et ouvrages" },
      { id: "frais_reliure", nom: "Frais de reliure", description: "Frais de reliure" },
      { id: "annonces_insertions", nom: "Annonces et insertions", description: "Annonces et insertions" },
      { id: "frais_demonstration", nom: "Frais de démonstration et de publicité", description: "Frais démonstration et publicité" },
      { id: "frais_foires", nom: "Frais de participation aux foires et expositions", description: "Frais participation foires" },
      { id: "publications_impressions", nom: "Publications et impressions", description: "Publications et impressions" }
    ],
    
    // Aménagement, entretien et équipement
    amenagement_entretien: [
      { id: "agencement_amenagement", nom: "Agencement, aménagement et installation", description: "Agencement et aménagement" },
      { id: "etudes_construction", nom: "Etudes liées à la construction et à l'aménagement des bâtiments administratifs", description: "Etudes construction bâtiments" },
      { id: "location_batiments", nom: "Locations de bâtiments administratifs et charges connexes", description: "Location bâtiments administratifs" },
      { id: "entretien_batiments", nom: "Entretien et réparation des bâtiments pédagogiques et administratifs", description: "Entretien bâtiments" },
      { id: "entretien_mobilier", nom: "Entretien et réparation du mobilier, du matériel de bureau et du matériel d'impression", description: "Entretien mobilier et matériel" }
    ],
    
    // Achat de fournitures
    achat_fournitures: [
      { id: "achat_outillage", nom: "Achats de petit outillage et petit équipement", description: "Achat outillage" },
      { id: "fournitures_informatiques", nom: "Achat de fournitures informatiques", description: "Fournitures informatiques" },
      { id: "fournitures_laboratoire", nom: "Achat de fournitures et de produits pour les travaux de terrain et de laboratoire", description: "Fournitures laboratoire" },
      { id: "fournitures_bureau", nom: "Achat de fournitures de bureau, papeterie et imprimés", description: "Fournitures bureau" },
      { id: "achat_animaux", nom: "Achat d'animaux de laboratoire", description: "Achat animaux laboratoire" },
      { id: "achat_carburants", nom: "Achat de carburants et lubrifiants", description: "Achat carburants" },
      { id: "achat_matieres", nom: "Achat de matières premières", description: "Achat matières premières" },
      { id: "achat_medicaments", nom: "Achat de médicaments et de produits pharmaceutiques", description: "Achat médicaments" },
      { id: "achat_accessoires", nom: "Achat d'accessoire et matériel artistiques et culturels nationaux", description: "Achat accessoires culturels" }
    ],
    
    // Transports et déplacements
    transports_deplacements: [
      { id: "transport_etranger", nom: "Frais de transport du personnel et des étudiants à l'étranger", description: "Transport personnel étranger" },
      { id: "transport_maroc", nom: "Frais de transport du personnel et des étudiants au Maroc", description: "Transport personnel Maroc" },
      { id: "transport_mobilier", nom: "Frais de transport du mobilier et du matériel", description: "Transport mobilier et matériel" },
      { id: "transport_missionnaires", nom: "Frais de transport et de séjour des missionnaires et chercheurs étrangers", description: "Transport missionnaires" },
      { id: "indemnites_deplacement", nom: "Indemnités de déplacement à l'intérieur du Royaume", description: "Indemnités déplacement" },
      { id: "indemnites_kilometriques", nom: "Indemnités kilométriques", description: "Indemnités kilométriques" },
      { id: "indemnites_mission_etranger", nom: "Indemnités de mission à l'étranger", description: "Indemnités mission étranger" },
      { id: "frais_mission_etranger", nom: "Frais de mission à l'étranger des participants", description: "Frais mission étranger" }
    ],
    
    // Matériel et mobilier
    materiel_mobilier: [
      { id: "materiel_enseignement", nom: "Achat de matériel d'enseignement", description: "Matériel d'enseignement" },
      { id: "materiel_technique", nom: "Achat de matériel technique, scientifique et audiovisuel", description: "Matériel technique et scientifique" },
      { id: "materiel_informatique", nom: "Achat de matériel informatique et logiciels et de matériel d'atelier et de l'outillage", description: "Matériel informatique et atelier" },
      { id: "materiel_medical", nom: "Achat de matériel médical", description: "Matériel médical" },
      { id: "materiel_mobilier_bureau", nom: "Achat de matériel et mobilier de bureau", description: "Matériel et mobilier bureau" },
      { id: "entretien_materiel_enseignement", nom: "Entretien et réparation du matériel d'enseignement et du matériel scientifique et de laboratoire", description: "Entretien matériel enseignement" },
      { id: "mobilier_enseignement", nom: "Achat de mobilier d'enseignement et de laboratoire", description: "Mobilier enseignement et laboratoire" },
      { id: "entretien_materiel_scientifique", nom: "Entretien et réparation de matériel scientifique, technique et médical", description: "Entretien matériel scientifique" },
      { id: "entretien_mobilier", nom: "Entretien et réparation de mobilier de bureau, de l'enseignement et de laboratoire", description: "Entretien mobilier" }
    ],
    
    // Dépenses diverses
    depenses_diverses: [
      { id: "participation_organismes", nom: "Participation, cotisation et contribution aux organismes nationaux et internationaux", description: "Participation organismes" },
      { id: "restitution_remboursement", nom: "Restitution et remboursement", description: "Restitution et remboursement" },
      { id: "remboursement_tva", nom: "Remboursement de la TVA et des Droits de douane", description: "Remboursement TVA et droits" },
      { id: "taxes_postales", nom: "Taxes postales, frais d'affranchissement et d'envoi et boîte postale", description: "Taxes postales" },
      { id: "location_materiel_transport", nom: "Location de matériel de transport", description: "Location matériel transport" },
      { id: "indemnites_enseignants_etrangers", nom: "Indemnités brutes des enseignants et des experts étrangers dans les domaines de la recherche scientifique et technologique, formations et travaux d'expertise", description: "Indemnités enseignants étrangers" },
      { id: "bourses_complementaires_recherche", nom: "Bourses complémentaires liées aux travaux de recherche", description: "Bourses complémentaires recherche" },
      { id: "apurement_arrieres", nom: "Apurement des arriérés", description: "Apurement arriérés" },
      { id: "penalite_amende", nom: "Pénalité et amende fiscale, sociale ou pénale", description: "Pénalités et amendes" },
      { id: "credits_non_programme", nom: "Crédits non programmé", description: "Crédits non programmés" }
    ]
  }

  const handleEmploiInputChange = (rubriqueId: string, sousRubriqueId: string, value: string) => {
    const key = `${rubriqueId}_${sousRubriqueId}`
    setEmploiData(prev => ({
      ...prev,
      [key]: value ? parseFloat(value) : 0
    }))
  }

  const getTotalSousRubrique = (rubriqueId: string, sousRubriqueId: string) => {
    const key = `${rubriqueId}_${sousRubriqueId}`
    return emploiData[key] || 0
  }

  const getTotalSousCategorie = (rubriqueId: string, sousCategorieId: string) => {
    // Pour PERSONNEL - calculer le total des allocations et indemnités
    if (rubriqueId === "personnel" && sousCategorieId === "allocations_indemnites") {
      return [
        "indemnites_complementaires",
        "bourses_complementaires", 
        "indemnites_enseignants_experts",
        "remuneration_postdoc",
        "remuneration_agents",
        "remuneration_experts",
        "bourses_maroc",
        "credit_non_programme"
      ].reduce((total, sousRubriqueId) => {
        return total + getTotalSousRubrique(rubriqueId, sousRubriqueId)
      }, 0)
    }
    
    // Pour MATÉRIEL ET DÉPENSES DIVERSES - calculer le total selon la sous-catégorie
    if (rubriqueId === "materiel_depenses") {
      const sousRubriques = sousRubriquesDetaillees[sousCategorieId as keyof typeof sousRubriquesDetaillees]
      if (sousRubriques) {
        return sousRubriques.reduce((total, sousRubrique) => {
          return total + getTotalSousRubrique(rubriqueId, sousRubrique.id)
        }, 0)
      }
    }
    
    return 0
  }

  const getTotalRubrique = (rubriqueId: string) => {
    // Pour PERSONNEL - total des allocations et indemnités
    if (rubriqueId === "personnel") {
      return getTotalSousCategorie(rubriqueId, "allocations_indemnites")
    }
    
    // Pour MATÉRIEL ET DÉPENSES DIVERSES - total de toutes les sous-catégories
    if (rubriqueId === "materiel_depenses") {
      return [
        "allocations_indemnites",
        "frais_redevances",
        "seminaires_formation",
        "achat_ouvrage",
        "amenagement_entretien",
        "achat_fournitures",
        "transports_deplacements",
        "materiel_mobilier",
        "depenses_diverses"
      ].reduce((total, sousCategorieId) => {
        return total + getTotalSousCategorie(rubriqueId, sousCategorieId)
      }, 0)
    }
    
    return 0
  }

  const getTotalGeneral = () => {
    return getTotalRubrique("personnel") + getTotalRubrique("materiel_depenses")
  }

  // Liste des destinataires disponibles pour signatures
  const [destinatairesDisponibles, setDestinatairesDisponibles] = useState([
    { id: "responsable_structure", nom: "Responsable de la structure", role: "Responsable de la structure d'appartenance" },
    { id: "coordinateur_projet", nom: "Coordinateur du projet", role: "Coordinateur du projet" },
    { id: "chef_etablissement", nom: "Chef d'établissement", role: "Chef d'établissement" },
    { id: "responsable_projet", nom: "Responsable du projet", role: "Chef de projet" },
    { id: "directeur_laboratoire", nom: "Directeur du laboratoire", role: "Directeur de laboratoire" },
    { id: "directeur_faculte", nom: "Directeur de la faculté", role: "Directeur de faculté" },
    { id: "president_universite", nom: "Président de l'université", role: "Président" },
    { id: "directeur_finance", nom: "Directeur des finances", role: "Directeur financier" },
    { id: "directeur_recherche", nom: "Directeur de la recherche", role: "Directeur de recherche" },
    { id: "expert_comptable", nom: "Expert comptable", role: "Expert comptable" },
    { id: "representant_ministere", nom: "Représentant du ministère", role: "Représentant ministériel" }
  ])

  const handleDestinataireToggle = (destinataireId: string) => {
    setSelectedDestinataires(prev => {
      if (prev.includes(destinataireId)) {
        return prev.filter(id => id !== destinataireId)
      } else {
        return [...prev, destinataireId]
      }
    })
  }

  const getDestinataireInfo = (destinataireId: string) => {
    return destinatairesDisponibles.find(d => d.id === destinataireId)
  }

  const handleAddDestinataire = () => {
    if (newDestinataireNom.trim() && newDestinataireRole.trim()) {
      const newId = `custom_${Date.now()}`
      const newDestinataire = {
        id: newId,
        nom: newDestinataireNom.trim(),
        role: newDestinataireRole.trim()
      }
      
      setDestinatairesDisponibles(prev => [...prev, newDestinataire])
      setSelectedDestinataires(prev => [...prev, newId])
      setNewDestinataireNom("")
      setNewDestinataireRole("")
      setShowAddDestinataire(false)
    }
  }

  const handleRemoveDestinataire = (destinataireId: string) => {
    setSelectedDestinataires(prev => prev.filter(id => id !== destinataireId))
    // Supprimer aussi de la liste si c'est un destinataire personnalisé
    if (destinataireId.startsWith('custom_')) {
      setDestinatairesDisponibles(prev => prev.filter(d => d.id !== destinataireId))
    }
  }

  const getProgrammeEmploiStatutInfo = (statut?: string) => {
    switch (statut) {
      case "genere":
        return { label: "Généré", color: "bg-blue-100 text-blue-800", icon: "📄" }
      case "en_signature":
        return { label: "En signature", color: "bg-yellow-100 text-yellow-800", icon: "✍️" }
      case "signe":
        return { label: "Signé", color: "bg-green-100 text-green-800", icon: "✅" }
      default:
        return { label: "Non généré", color: "bg-gray-100 text-gray-800", icon: "📋" }
    }
  }

  const handleGenerateDocument = () => {
    setShowDocumentModal(true)
    // Mettre à jour le statut à "Généré"
    if (selectedProjet && selectedTranche !== "") {
      const trancheIndex = parseInt(selectedTranche)
      const updatedProjets = projetsRetenus.map(projet => {
        if (projet.id === selectedProjet.id) {
          const updatedTranches = projet.tranches.map((tranche, index) => {
            if (index === trancheIndex) {
              return {
                ...tranche,
                programmeEmploiStatut: "genere" as const,
                programmeEmploiDate: new Date().toISOString().split('T')[0]
              }
            }
            return tranche
          })
          return { ...projet, tranches: updatedTranches }
        }
        return projet
      })
      // Ici vous mettriez normalement la mise à jour dans votre base de données
      console.log("Statut mis à jour:", updatedProjets)
    }
  }

  const handleUpdateStatut = (newStatut: "genere" | "en_signature" | "signe") => {
    if (selectedProjet && selectedTranche !== "") {
      const trancheIndex = parseInt(selectedTranche)
      const updatedProjets = projetsRetenus.map(projet => {
        if (projet.id === selectedProjet.id) {
          const updatedTranches = projet.tranches.map((tranche, index) => {
            if (index === trancheIndex) {
              return {
                ...tranche,
                programmeEmploiStatut: newStatut,
                programmeEmploiDate: new Date().toISOString().split('T')[0]
              }
            }
            return tranche
          })
          return { ...projet, tranches: updatedTranches }
        }
        return projet
      })
      // Ici vous mettriez normalement la mise à jour dans votre base de données
      console.log("Statut mis à jour:", updatedProjets)
    }
  }

  const handlePrintDocument = () => {
    window.print()
  }

  const handleDownloadDocument = () => {
    // Simulation de téléchargement du document
    const content = generateDocumentContent()
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `programme-emploi-${selectedProjet?.id}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateDocumentContent = () => {
    if (!selectedProjet || selectedTranche === "") return ""
    
    const tranche = selectedProjet.tranches[parseInt(selectedTranche)]
    const totalGeneral = getTotalGeneral()
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Programme d'emploi - ${selectedProjet.titre}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            font-size: 11px;
            line-height: 1.3;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #333; 
            padding-bottom: 15px; 
            margin-bottom: 20px; 
          }
          .document-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .project-info { 
            margin-bottom: 20px; 
            border: 1px solid #ccc;
            padding: 12px;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
          }
          .info-label {
            font-weight: bold;
            width: 200px;
            min-width: 200px;
          }
          .info-value {
            flex: 1;
            border-bottom: 1px solid #ccc;
            padding-left: 10px;
          }
          .section-title {
            font-size: 13px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0 12px 0;
            background-color: #f0f0f0;
            padding: 6px;
            border: 1px solid #ccc;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .table th {
            background-color: #1e3a8a;
            color: white;
            font-weight: bold;
            padding: 6px;
            border: 1px solid #ccc;
            text-align: left;
            font-size: 10px;
          }
          .table td {
            padding: 6px;
            border: 1px solid #ccc;
            font-size: 10px;
          }
          .table .total-row {
            background-color: #1e3a8a;
            color: white;
            font-weight: bold;
          }
          .table .total-row td {
            border: 1px solid #ccc;
          }
          .amount-cell {
            text-align: right;
            font-weight: bold;
          }
          .signature { 
            margin-top: 30px; 
            display: flex; 
            justify-content: space-between; 
          }
          .signature-box { 
            border: 1px solid #333; 
            padding: 8px; 
            width: 180px; 
            text-align: center; 
          }
          @media print { 
            body { margin: 15px; } 
            .table th, .table td { font-size: 9px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="document-title">Modificatif N°1/2025 du Programme d'emploi N°${selectedProjet.id}</div>
          <div class="document-title">PROGRAMME D'EMPLOI N°${selectedProjet.id}</div>
        </div>
        
        <div class="project-info">
          <div class="info-row">
            <div class="info-label">Etablissement :</div>
            <div class="info-value">Université Hassan II de Casablanca</div>
          </div>
          <div class="info-row">
            <div class="info-label">Intitulé du P-E :</div>
            <div class="info-value">${selectedProjet.titre}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Coordinateur du P-E :</div>
            <div class="info-value">${selectedProjet.responsable}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Code du P-E :</div>
            <div class="info-value">${selectedProjet.id}</div>
          </div>
        </div>
        
        <div class="section-title">RECETTES</div>
        <table class="table">
          <thead>
            <tr>
              <th>Compte</th>
              <th>Rubriques</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10-12</td>
              <td>Excédent des recettes réalisées sur les paiements effectués au titre de l'exercice précédent -FC-TR-PS-</td>
              <td class="amount-cell">0,00</td>
            </tr>
            <tr>
              <td>20-23</td>
              <td>Produits et bénéfices provenant des travaux de recherches et des prestations de services</td>
              <td class="amount-cell">0,00</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">Total Crédit à programmer</td>
              <td class="amount-cell">0,00</td>
            </tr>
          </tbody>
        </table>
        
        <div class="section-title">EMPLOIS</div>
        <table class="table">
          <thead>
            <tr>
              <th>Compte</th>
              <th>Rubriques</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            ${rubriquesEmploi.map(rubrique => {
              const totalRubrique = getTotalRubrique(rubrique.id)
              if (totalRubrique > 0) {
                return `
                  <tr>
                    <td>${rubrique.id === 'personnel' ? '60-61' : '62-63'}</td>
                    <td>${rubrique.nom}</td>
                    <td class="amount-cell">${totalRubrique.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</td>
                  </tr>
                  ${rubrique.sousRubriques ? 
                    rubrique.sousRubriques.map(sr => {
                      const key = `${rubrique.id}_${sr.id}`
                      const montant = emploiData[key] || 0
                      if (montant > 0) {
                        return `
                          <tr>
                            <td></td>
                            <td style="padding-left: 20px;">- ${sr.nom}</td>
                            <td class="amount-cell">${montant.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</td>
                          </tr>
                        `
                      }
                      return ''
                    }).join('') :
                    rubrique.sousCategories ? 
                    rubrique.sousCategories.map(sc => {
                      const totalSousCategorie = getTotalSousCategorie(rubrique.id, sc.id)
                      if (totalSousCategorie > 0) {
                        return `
                          <tr>
                            <td></td>
                            <td style="padding-left: 20px;">${sc.nom}</td>
                            <td class="amount-cell">${totalSousCategorie.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</td>
                          </tr>
                          ${sc.sousRubriques.map(sr => {
                            const key = `${rubrique.id}_${sr.id}`
                            const montant = emploiData[key] || 0
                            if (montant > 0) {
                              return `
                                <tr>
                                  <td></td>
                                  <td style="padding-left: 40px;">- ${sr.nom}</td>
                                  <td class="amount-cell">${montant.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</td>
                                </tr>
                              `
                            }
                            return ''
                          }).join('')}
                        `
                      }
                      return ''
                    }).join('') : ''
                  }
                `
              }
              return ''
            }).join('')}
            <tr class="total-row">
              <td colspan="2">Total Emplois</td>
              <td class="amount-cell">${totalGeneral.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="signature">
            <div class="signature-box">
              <p><strong>1. Responsable de la structure</strong></p>
              <p style="font-size: 10px; color: #666; margin-top: 5px;">Responsable de la structure d'appartenance</p>
            <p style="margin-top: 50px;">_________________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
          </div>
          <div class="signature-box">
            <p><strong>2. Coordinateur du projet</strong></p>
              <p style="font-size: 10px; color: #666; margin-top: 5px;">Coordinateur du projet</p>
            <p style="margin-top: 50px;">_________________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
          </div>
          <div class="signature-box">
              <p><strong>3. Chef d'établissement</strong></p>
              <p style="font-size: 10px; color: #666; margin-top: 5px;">Chef d'établissement</p>
              <p style="margin-top: 50px;">_________________</p>
              <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
            </div>
          ${selectedDestinataires.filter(id => !["responsable_structure", "coordinateur_projet", "chef_etablissement"].includes(id)).map((destinataireId, index) => {
            const destinataire = getDestinataireInfo(destinataireId)
            return `
          <div class="signature-box">
            <p><strong>${index + 4}. ${destinataire?.nom}</strong></p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">${destinataire?.role}</p>
            <p style="margin-top: 50px;">_________________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
          </div>
            `
          }).join('')}
        </div>
        
        <div style="margin-top: 20px; text-align: center; border-top: 2px solid #007bff; padding-top: 15px;">
          <div class="signature-box" style="display: inline-block; margin: 0 20px;">
            <p><strong>Signature finale du Président</strong></p>
            <p style="margin-top: 50px;">_________________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px;">
          <p style="margin: 0; font-size: 11px; color: #495057; line-height: 1.4;">
            <strong>NOTE :</strong> Le Pôle Recherche est notifié et transmet ce document à la hiérarchie pour signature dans l'ordre suivant :<br/>
            • Responsable de la structure (Responsable de la structure d'appartenance)<br/>
            • Coordinateur du projet (Coordinateur du projet)<br/>
            • Chef d'établissement (Chef d'établissement)<br/>
            ${selectedDestinataires.filter(id => !["responsable_structure", "coordinateur_projet", "chef_etablissement"].includes(id)).map((destinataireId) => {
                const destinataire = getDestinataireInfo(destinataireId)
                return `• ${destinataire?.nom} (${destinataire?.role})<br/>`
            }).join('')}
            <strong>${4 + selectedDestinataires.filter(id => !["responsable_structure", "coordinateur_projet", "chef_etablissement"].includes(id)).length}.</strong> Une fois toutes les signatures obtenues, le document est soumis au Président pour signature finale.
          </p>
        </div>
        
        <div style="margin-top: 20px; text-align: center; border-top: 2px solid #007bff; padding-top: 15px;">
          <div class="signature-box" style="display: inline-block; margin: 0 20px;">
            <p><strong>Signature finale du Président</strong></p>
            <p style="margin-top: 50px;">_________________</p>
            <p style="font-size: 10px; color: #666; margin-top: 5px;">Date: _______________</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #666;">
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </body>
      </html>
    `
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes Projets Retenus</h1>
                <p className="text-gray-600 mt-1">
                  Gérez et suivez vos projets de recherche approuvés
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {projetsRetenus.length} projet(s) retenu(s)
                </Badge>
              </div>
            </div>

            {/* Section de recherche et filtres améliorée */}
            <Card className="mb-4 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Search className="h-4 w-4 text-uh2c-blue" />
                  Recherche et filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Barre de recherche principale */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
                  />
                </div>

                {/* Filtres alignés */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-uh2c-blue" />
                      Statut
                    </Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-uh2c-blue focus:ring-2 focus:ring-uh2c-blue/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium text-uh2c-blue">
                          Tous les statuts
                        </SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="termine">Terminé</SelectItem>
                        <SelectItem value="en_attente">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-uh2c-blue" />
                      Programme
                    </Label>
                    <Select value={programmeFilter} onValueChange={setProgrammeFilter}>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-uh2c-blue focus:ring-2 focus:ring-uh2c-blue/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder="Tous les programmes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium text-uh2c-blue">
                          Tous les programmes
                        </SelectItem>
                        {programmes.map(programme => (
                          <SelectItem key={programme} value={programme}>{programme}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-uh2c-blue" />
                      Année
                    </Label>
                    <Select value={anneeFilter} onValueChange={setAnneeFilter}>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-uh2c-blue focus:ring-2 focus:ring-uh2c-blue/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder="Toutes les années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium text-uh2c-blue">
                          Toutes les années
                        </SelectItem>
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

            {/* Liste des projets */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Projet
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Responsable
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Programme
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Budget
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Durée
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Statut Programme d'emploi
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProjets.map((projet) => {
                        const statusInfo = getStatusInfo(projet.statut)
                        const StatusIcon = statusInfo.icon
                        
                        return (
                          <tr key={projet.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {projet.titre}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {projet.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {projet.responsable}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              {projet.programme}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3 text-gray-400" />
                                {projet.budget.toLocaleString()} MAD
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(projet.dateDebut).toLocaleDateString()} - {new Date(projet.dateFin).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge className={`${statusInfo.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                {(() => {
                                  // Déterminer le statut global du programme d'emploi
                                  const statuts = projet.tranches.map(tranche => tranche.programmeEmploiStatut).filter(Boolean)
                                  let statutGlobal = "Non généré"
                                  
                                  if (statuts.includes("signe")) {
                                    statutGlobal = "Signé"
                                  } else if (statuts.includes("en_signature")) {
                                    statutGlobal = "En signature"
                                  } else if (statuts.includes("genere")) {
                                    statutGlobal = "Généré"
                                  }
                                  
                                  const statutInfo = getProgrammeEmploiStatutInfo(statutGlobal === "Non généré" ? undefined : statutGlobal.toLowerCase().replace(" ", "_"))
                                  return (
                                    <Badge className={`${statutInfo.color} text-xs`}>
                                      {statutGlobal}
                                    </Badge>
                                  )
                                })()}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2 justify-center">
                                <div className="flex gap-1">
                                  <button 
                                    className="flex items-center justify-center flex-1 h-6 px-2 text-xs bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors duration-200 font-medium text-gray-700"
                                    onClick={() => handleShowTranches(projet)}
                                  >
                                    <DollarSign className="h-3 w-3 mr-1 text-gray-600" />
                                    Tranches
                                  </button>
                                  <button 
                                    className="flex items-center justify-center flex-1 h-6 px-2 text-xs bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors duration-200 font-medium text-gray-700"
                                    onClick={() => handleShowEmploi(projet)}
                                  >
                                    <Users className="h-3 w-3 mr-1 text-gray-600" />
                                    Emploi
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* État vide */}
            {filteredProjets.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== "all" || programmeFilter !== "all" 
                      ? "Aucun projet ne correspond à vos critères de recherche."
                      : "Vous n'avez pas encore de projets retenus."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Modal des tranches */}
      <Dialog open={showTranchesModal} onOpenChange={setShowTranchesModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogTitle className="sr-only">Détails des tranches</DialogTitle>
          
          {/* En-tête unifié avec style popup */}
          <div className="mb-4">
            {/* En-tête principal */}
            <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-uh2c-blue rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 mb-1">
                    Détails des tranches
                  </h2>
                  <p className="text-xs text-gray-600">
                    {selectedProjet?.titre}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {selectedProjet && (
            <div className="space-y-4">
              {/* Informations du projet */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-uh2c-blue rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Budget total</span>
                      <p className="text-sm font-bold text-gray-900">{selectedProjet.budget.toLocaleString()} MAD</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-uh2c-blue rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Responsable</span>
                      <p className="text-xs font-semibold text-gray-900">{selectedProjet.responsable}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-uh2c-blue rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Durée</span>
                      <p className="text-xs font-semibold text-gray-900">
                        {new Date(selectedProjet.dateDebut).getFullYear()} - {new Date(selectedProjet.dateFin).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timeline des paiements */}
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-uh2c-blue" />
                  Timeline des paiements
                </h3>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-3">
                    {selectedProjet.tranches.map((tranche, index) => {
                      const statusInfo = getTrancheStatusInfo(tranche.statut)
                      
                      return (
                        <div key={index} className="relative flex items-start gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            tranche.statut === "payee" ? "bg-green-500" :
                            tranche.statut === "en_cours" ? "bg-yellow-500" : "bg-red-500"
                          }`}>
                            {tranche.statut === "payee" ? (
                              <CheckCircle className="h-3 w-3 text-white" />
                            ) : tranche.statut === "en_cours" ? (
                              <Clock className="h-3 w-3 text-white" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm">Tranche {tranche.numero}</h4>
                              <Badge className={`px-2 py-1 text-xs ${
                                tranche.statut === "payee" ? "bg-green-100 text-green-800" :
                                tranche.statut === "en_cours" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-gray-600">Montant prévu:</span>
                                <span className="font-semibold ml-1">{tranche.montant.toLocaleString()} MAD</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Année:</span>
                                <span className="font-semibold ml-1">{tranche.anneeCivile}</span>
                              </div>
                              {tranche.montantRecu && (
                                <div>
                                  <span className="text-gray-600">Montant reçu:</span>
                                  <span className="font-semibold ml-1">{tranche.montantRecu.toLocaleString()} MAD</span>
                                </div>
                              )}
                              {tranche.dateReception && (
                                <div>
                                  <span className="text-gray-600">Date réception:</span>
                                  <span className="font-semibold ml-1">{new Date(tranche.dateReception).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              
              {/* Détails des tranches */}
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900">Détails des tranches</h3>
                  <div className="flex gap-2">
                    <Badge className="bg-green-100 text-green-800 border-green-300 px-2 py-1 text-xs">
                      {selectedProjet.tranches.filter(t => t.statut === "payee").length} Payée(s)
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 px-2 py-1 text-xs">
                      {selectedProjet.tranches.filter(t => t.statut === "en_cours").length} En cours
                    </Badge>
                    <Badge className="bg-red-100 text-red-800 border-red-300 px-2 py-1 text-xs">
                      {selectedProjet.tranches.filter(t => t.statut === "en_attente").length} En attente
                    </Badge>
                  </div>
                </div>
                
                <div className="grid gap-3">
                  {selectedProjet.tranches.map((tranche, index) => {
                    const statusInfo = getTrancheStatusInfo(tranche.statut)
                    
                    return (
                      <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-uh2c-blue">{tranche.numero}</div>
                              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Tranche</div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900 text-sm">Année civile: {tranche.anneeCivile}</div>
                              <div className="text-xs text-gray-600">Montant prévu: <span className="font-semibold text-gray-900">{tranche.montant.toLocaleString()} MAD</span></div>
                            </div>
                          </div>
                          <Badge className={`px-2 py-1 text-xs font-medium ${
                            tranche.statut === "payee" ? "bg-green-100 text-green-800 border-green-300" :
                            tranche.statut === "en_cours" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                            "bg-red-100 text-red-800 border-red-300"
                          }`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-700 flex items-center gap-2 uppercase tracking-wide">
                              <DollarSign className="h-3 w-3 text-gray-600" />
                              Montant reçu (MAD)
                            </Label>
                            <div className="h-10 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                              <span className="text-sm font-semibold text-gray-900">
                                {tranche.montantRecu ? `${tranche.montantRecu.toLocaleString()} MAD` : 'Non renseigné'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-700 flex items-center gap-2 uppercase tracking-wide">
                              <Calendar className="h-3 w-3 text-gray-600" />
                              Date de réception
                            </Label>
                            <div className="h-10 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                              <span className="text-sm font-semibold text-gray-900">
                                {tranche.dateReception ? new Date(tranche.dateReception).toLocaleDateString() : 'Non renseigné'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal du programme d'emploi */}
      <Dialog open={showEmploiModal} onOpenChange={setShowEmploiModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Programme d'emploi</DialogTitle>
          <DialogHeader className="pb-4">
            <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-uh2c-blue rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-uh2c-blue">
                      Programme d'emploi
                    </div>
                    <div className="text-sm text-uh2c-blue/80 font-medium">
                      {selectedProjet?.titre}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-uh2c-blue/70 font-medium">Actif</span>
                </div>
              </div>
            </div>
          </DialogHeader>
          {selectedProjet && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Informations du projet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <span className="text-sm text-gray-600">Responsable</span>
                    <p className="font-medium text-gray-900">{selectedProjet.responsable}</p>
                    </div>
                    <div>
                    <span className="text-sm text-gray-600">Budget total</span>
                    <p className="font-medium text-gray-900">{selectedProjet.budget.toLocaleString()} MAD</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Gestion des emplois par tranche</h3>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <p className="text-sm text-gray-600">Sélectionnez une tranche pour gérer son budget</p>
                
                {/* Sélection de la tranche */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sélectionner une tranche
                  </Label>
                  <Select value={selectedTranche} onValueChange={setSelectedTranche}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Choisir une tranche..." />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProjet.tranches.map((tranche, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          <div className="flex flex-col py-1">
                            <span className="font-medium text-gray-900">Tranche {tranche.numero} - {tranche.anneeCivile}</span>
                            <span className="text-sm text-gray-500">
                              {tranche.montant.toLocaleString()} MAD - {getTrancheStatusInfo(tranche.statut).label}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Informations de la tranche sélectionnée */}
                {selectedTranche !== "" && selectedProjet && selectedProjet.tranches[parseInt(selectedTranche)] && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {selectedProjet.tranches[parseInt(selectedTranche)].numero}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          Tranche {selectedProjet.tranches[parseInt(selectedTranche)].numero} - {selectedProjet.tranches[parseInt(selectedTranche)].anneeCivile}
                        </h4>
                        <p className="text-xs text-gray-600">Gestion budgétaire de cette tranche</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                        <DollarSign className="h-4 w-4 text-gray-600" />
                        <div>
                          <span className="text-xs text-gray-600">Montant prévu</span>
                          <p className="font-semibold text-gray-900 text-sm">{selectedProjet.tranches[parseInt(selectedTranche)].montant.toLocaleString()} MAD</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                          <Badge className={`${getTrancheStatusInfo(selectedProjet.tranches[parseInt(selectedTranche)].statut).color} px-2 py-0.5 text-xs`}>
                            {getTrancheStatusInfo(selectedProjet.tranches[parseInt(selectedTranche)].statut).label}
                          </Badge>
                        <div>
                          <span className="text-xs text-gray-600">Statut</span>
                          <p className="font-semibold text-gray-900 text-sm">{getTrancheStatusInfo(selectedProjet.tranches[parseInt(selectedTranche)].statut).label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
                        <div className="text-lg">
                          {getProgrammeEmploiStatutInfo(selectedProjet.tranches[parseInt(selectedTranche)].programmeEmploiStatut).icon}
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Programme d'emploi</span>
                          <p className="font-semibold text-gray-900 text-sm">
                            {getProgrammeEmploiStatutInfo(selectedProjet.tranches[parseInt(selectedTranche)].programmeEmploiStatut).label}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rubriques d'emploi */}
                {selectedTranche !== "" && selectedProjet && selectedProjet.tranches[parseInt(selectedTranche)] && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">Répartition budgétaire</h4>
                      <Badge variant="outline" className="text-xs">
                        Saisie par rubrique
                      </Badge>
                    </div>
                    
                                        {/* Affichage de toutes les rubriques */}
                    <div className="space-y-6">
                      {/* Rubrique PERSONNEL */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                              </div>
                          <h5 className="font-semibold text-gray-900 text-lg">PERSONNEL</h5>
                          <Badge variant="outline" className="ml-auto text-xs bg-blue-50 border-blue-200 text-blue-700">
                            {getTotalRubrique("personnel").toLocaleString()} MAD
                          </Badge>
                    </div>

                        {/* Sous-catégorie Allocations et indemnités */}
                              <div className="space-y-3">
                          <h6 className="font-medium text-gray-700 text-sm mb-3">
                                  Allocations et indemnités
                          </h6>
                          <div className="space-y-2">
                                {[
                                  { id: "indemnites_complementaires", nom: "Indemnités complémentaires liées aux travaux de recherches", description: "Indemnités pour travaux de recherche" },
                                  { id: "bourses_complementaires", nom: "Bourses complémentaires liées aux travaux de recherche", description: "Bourses pour travaux de recherche" },
                                  { id: "indemnites_enseignants_experts", nom: "Indemnités brutes des enseignants et des experts étrangers", description: "Indemnités pour enseignants et experts" },
                                  { id: "remuneration_postdoc", nom: "Rémunération des post-doctorants travaillant dans le cadre de projets", description: "Rémunération post-doctorants" },
                                  { id: "remuneration_agents", nom: "Rémunération des agents contractuels", description: "Rémunération agents contractuels" },
                                  { id: "remuneration_experts", nom: "Rémunération des experts marocains et étrangers", description: "Rémunération experts" },
                                  { id: "bourses_maroc", nom: "Bourses au Maroc", description: "Bourses nationales" },
                                  { id: "credit_non_programme", nom: "Crédit non programmé", description: "Crédits non programmés" }
                                ].map((sousRubrique) => {
                              const key = `personnel_${sousRubrique.id}`
                                  return (
                                <div key={sousRubrique.id} className="bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
                                      <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 text-sm mb-1">
                                        {sousRubrique.nom}
                                        </div>
                                      <div className="text-xs text-gray-500">{sousRubrique.description}</div>
                                    </div>
                                    <div className="flex items-center gap-3 ml-4">
                                          <div className="text-right">
                                        <div className="text-xs text-gray-600">Montant</div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                              {emploiData[key] ? emploiData[key].toLocaleString() : '0'} MAD
                                            </div>
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            <Input
                                              type="number"
                                              placeholder="0"
                                              value={emploiData[key] || ""}
                                          onChange={(e) => handleEmploiInputChange("personnel", sousRubrique.id, e.target.value)}
                                          className="w-24 h-8 text-center font-medium border border-gray-300 text-sm rounded"
                                            />
                                            <span className="text-xs text-gray-500 text-center">MAD</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                          </div>
                      </div>

                      {/* Rubrique MATÉRIEL ET DÉPENSES DIVERSES */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <h5 className="font-semibold text-gray-900 text-lg">MATÉRIEL ET DÉPENSES DIVERSES</h5>
                          <Badge variant="outline" className="ml-auto text-xs bg-green-50 border-green-200 text-green-700">
                            {getTotalRubrique("materiel_depenses").toLocaleString()} MAD
                          </Badge>
                        </div>
                        
                        {/* Toutes les sous-catégories */}
                          <div className="space-y-4">
                          {Object.entries(sousRubriquesDetaillees).map(([sousCategorieId, sousRubriques]) => (
                            <div key={sousCategorieId} className="space-y-2">
                              <h6 className="font-medium text-gray-700 text-sm border-l-2 border-green-200 pl-3">
                                {sousCategorieId === "allocations_indemnites" && "Allocations et indemnités pour personnel"}
                                {sousCategorieId === "frais_redevances" && "Frais et redevances"}
                                {sousCategorieId === "seminaires_formation" && "Séminaires, stages et formation"}
                                {sousCategorieId === "achat_ouvrage" && "Achat d'ouvrage et frais d'édition"}
                                {sousCategorieId === "amenagement_entretien" && "Aménagement, entretien et équipement"}
                                {sousCategorieId === "achat_fournitures" && "Achat de fournitures"}
                                {sousCategorieId === "transports_deplacements" && "Transports et déplacements"}
                                {sousCategorieId === "materiel_mobilier" && "Matériel et mobilier"}
                                {sousCategorieId === "depenses_diverses" && "Dépenses diverses"}
                              </h6>
                              <div className="space-y-2 ml-4">
                                {(sousRubriques as any[]).map((sousRubrique: any) => {
                                  const key = `materiel_depenses_${sousRubrique.id}`
                                  return (
                                    <div key={sousRubrique.id} className="bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-gray-900 text-sm mb-1">
                                            {sousRubrique.nom}
                                      </div>
                                          <div className="text-xs text-gray-500">{sousRubrique.description}</div>
                            </div>
                                        <div className="flex items-center gap-3 ml-4">
                                          <div className="text-right">
                                            <div className="text-xs text-gray-600">Montant</div>
                                            <div className="font-semibold text-gray-900 text-sm">
                                              {emploiData[key] ? emploiData[key].toLocaleString() : '0'} MAD
                                      </div>
                                      </div>
                                          <div className="flex flex-col gap-1">
                                            <Input
                                              type="number"
                                              placeholder="0"
                                              value={emploiData[key] || ""}
                                              onChange={(e) => handleEmploiInputChange("materiel_depenses", sousRubrique.id, e.target.value)}
                                              className="w-24 h-8 text-center font-medium border border-gray-300 text-sm rounded"
                                            />
                                            <span className="text-xs text-gray-500 text-center">MAD</span>
                                    </div>
                                      </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                                        {/* Sélection des destinataires pour signatures */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                        <div className="w-6 h-6 bg-uh2c-blue/10 rounded flex items-center justify-center">
                          <FileCheck className="h-4 w-4 text-uh2c-blue" />
                        </div>
                        <h5 className="font-semibold text-gray-900 text-lg">Signataires</h5>
                        <Badge variant="outline" className="ml-auto text-xs bg-uh2c-blue/10 border-uh2c-blue/20 text-uh2c-blue">
                          {selectedDestinataires.length} sélectionné(s)
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>

                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Ajoutez des destinataires supplémentaires si nécessaire
                          </Label>
                          <Select onValueChange={(value) => {
                            if (value === "autre") {
                              setShowAddDestinataire(true)
                            } else if (value && !selectedDestinataires.includes(value)) {
                              setSelectedDestinataires(prev => [...prev, value])
                            }
                          }}>
                            <SelectTrigger className="w-full border border-gray-300 focus:border-uh2c-blue">
                              <SelectValue placeholder="Sélectionner un destinataire..." />
                            </SelectTrigger>
                            <SelectContent>
                              {destinatairesDisponibles
                                .filter(d => !selectedDestinataires.includes(d.id) && !["responsable_structure", "coordinateur_projet", "chef_etablissement"].includes(d.id))
                                .map((destinataire) => (
                                  <SelectItem key={destinataire.id} value={destinataire.id}>
                                    <div className="flex flex-col py-1">
                                      <span className="font-medium text-gray-900">{destinataire.nom}</span>
                                      <span className="text-sm text-gray-500">{destinataire.role}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              }
                              <SelectItem value="autre">
                                <div className="flex items-center gap-2 py-1">
                                  <Plus className="h-4 w-4 text-uh2c-blue" />
                                  <span className="font-medium text-uh2c-blue">Autre destinataire</span>
                                  </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                        {/* Formulaire pour ajouter un destinataire personnalisé */}
                        {showAddDestinataire && (
                          <div className="p-4 bg-uh2c-blue/5 rounded-lg border border-uh2c-blue/20">
                            <div className="flex items-center gap-2 mb-3">
                              <Plus className="h-4 w-4 text-uh2c-blue" />
                              <h6 className="font-medium text-uh2c-blue text-sm">Ajouter un destinataire personnalisé</h6>
                            </div>
                              <div className="space-y-3">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Nom du destinataire</Label>
                                <Input
                                  type="text"
                                  placeholder="Ex: Dr. Mohamed Alami"
                                  value={newDestinataireNom}
                                  onChange={(e) => setNewDestinataireNom(e.target.value)}
                                  className="mt-1 border border-gray-300 focus:border-uh2c-blue"
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">Rôle/Fonction</Label>
                                <Input
                                  type="text"
                                  placeholder="Ex: Directeur de département"
                                  value={newDestinataireRole}
                                  onChange={(e) => setNewDestinataireRole(e.target.value)}
                                  className="mt-1 border border-gray-300 focus:border-uh2c-blue"
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={handleAddDestinataire}
                                  disabled={!newDestinataireNom.trim() || !newDestinataireRole.trim()}
                                  size="sm"
                                  className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    setShowAddDestinataire(false)
                                    setNewDestinataireNom("")
                                    setNewDestinataireRole("")
                                  }}
                                  size="sm"
                                >
                                  Annuler
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Liste des destinataires sélectionnés */}
                        {selectedDestinataires.filter(id => !["responsable_structure", "coordinateur_projet", "chef_etablissement"].includes(id)).length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <h6 className="text-sm font-medium text-gray-700">Destinataires supplémentaires :</h6>
                              <Badge variant="secondary" className="text-xs">
                                {selectedDestinataires.filter(id => !["responsable_structure", "coordinateur_projet", "chef_etablissement"].includes(id)).length} destinataire(s)
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {selectedDestinataires
                                .filter(id => !["responsable_structure", "coordinateur_projet", "chef_etablissement"].includes(id))
                                .map((destinataireId, index) => {
                                const destinataire = getDestinataireInfo(destinataireId)
                                      return (
                                  <div key={destinataireId} className="bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition-colors">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                                          <span className="text-uh2c-blue text-xs font-bold">{index + 4}</span>
                                                </div>
                                        <div>
                                          <div className="font-medium text-gray-900 text-sm">{destinataire?.nom}</div>
                                          <div className="text-xs text-gray-500">{destinataire?.role}</div>
                                              </div>
                                              </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveDestinataire(destinataireId)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Résumé des rubriques */}
                    <Card className="bg-gray-50 border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Résumé des rubriques
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {rubriquesEmploi.map((rubrique) => (
                            <div key={rubrique.id} className="p-3 bg-white rounded border border-gray-200">
                              <div className="text-sm text-gray-600">{rubrique.nom}</div>
                              <div className="font-semibold text-gray-900">
                                {getTotalRubrique(rubrique.id).toLocaleString()} MAD
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Total général */}
                        <div className="mt-4 p-3 bg-white rounded border border-gray-300">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900">Total général</h4>
                              <p className="text-sm text-gray-600">Somme de toutes les rubriques</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">
                                {getTotalGeneral().toLocaleString()} MAD
                              </div>
                              <div className="text-sm text-gray-600">
                                sur {selectedProjet.tranches[parseInt(selectedTranche)].montant.toLocaleString()} MAD
                              </div>
                            </div>
                          </div>
                          

                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

                {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleGenerateDocument}>
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu du document
                  </Button>
                <Button variant="outline" onClick={handleDownloadDocument}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button onClick={handlePrintDocument}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer et signer
                  </Button>
                </div>
              </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'aperçu du document */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-uh2c-blue" />
              Aperçu du document - Programme d'emploi
            </DialogTitle>
          </DialogHeader>
          {selectedProjet && selectedTranche !== "" && (
            <div className="space-y-6">
              {/* Informations du document */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg mb-2">Document prêt à imprimer</h3>
                    <p className="text-blue-800 text-sm">
                      Ce document contient toutes les informations du programme d'emploi pour la tranche sélectionnée.
                      Il peut être imprimé et signé par les parties concernées.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-600">Projet</div>
                    <div className="font-bold text-blue-900">{selectedProjet.titre}</div>
                    <div className="text-sm text-blue-600 mt-1">
                      {selectedTranche !== "" && selectedProjet && selectedProjet.tranches[parseInt(selectedTranche)] ? 
                        `Tranche ${selectedProjet.tranches[parseInt(selectedTranche)].numero} - ${selectedProjet.tranches[parseInt(selectedTranche)].anneeCivile}` : 
                        "Tranche non sélectionnée"
                      }
                    </div>
                  </div>
                </div>
              </div>



              {/* Aperçu du document */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">PROGRAMME D'EMPLOI</h1>
                  <h2 className="text-lg font-semibold text-gray-700 mb-1">Université Hassan II de Casablanca</h2>
                  <p className="text-gray-600">Division de la Recherche</p>
                </div>
                
                <div className="space-y-6">
                  {/* Informations du projet */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">Informations du projet</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">Titre :</span>
                        <p className="text-gray-900">{selectedProjet.titre}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Responsable :</span>
                        <p className="text-gray-900">{selectedProjet.responsable}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Programme :</span>
                        <p className="text-gray-900">{selectedProjet.programme}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Budget total :</span>
                        <p className="text-gray-900">{selectedProjet.budget.toLocaleString()} MAD</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations de la tranche */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {selectedTranche !== "" && selectedProjet && selectedProjet.tranches[parseInt(selectedTranche)] ? 
                        `Tranche ${selectedProjet.tranches[parseInt(selectedTranche)].numero} - Année ${selectedProjet.tranches[parseInt(selectedTranche)].anneeCivile}` :
                        "Tranche non sélectionnée"
                      }
                    </h3>
                    <p className="text-gray-700">
                      {selectedTranche !== "" && selectedProjet && selectedProjet.tranches[parseInt(selectedTranche)] ? (
                        <span><span className="font-medium">Montant prévu :</span> {selectedProjet.tranches[parseInt(selectedTranche)].montant.toLocaleString()} MAD</span>
                      ) : (
                        <span><span className="font-medium">Montant prévu :</span> Non disponible</span>
                      )}
                    </p>
                  </div>

                  {/* Rubriques d'emploi */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-4">Répartition budgétaire</h3>
                    <div className="space-y-4">
                      {rubriquesEmploi.map((rubrique) => {
                        const totalRubrique = getTotalRubrique(rubrique.id)
                        return (
                          <div key={rubrique.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900">{rubrique.nom}</h4>
                              <span className="font-bold text-gray-900">{totalRubrique.toLocaleString()} MAD</span>
                            </div>
                            
                            {rubrique.sousRubriques && (
                              <div className="space-y-2">
                                {rubrique.sousRubriques.map((sr) => {
                                  const key = `${rubrique.id}_${sr.id}`
                                  const montant = emploiData[key] || 0
                                  return (
                                    <div key={sr.id} className="flex items-center justify-between text-sm">
                                      <span className="text-gray-700 ml-4">{sr.nom}</span>
                                      <span className="font-medium text-gray-900">{montant.toLocaleString()} MAD</span>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                            
                            {rubrique.sousCategories && (
                              <div className="space-y-3">
                                {rubrique.sousCategories.map((sc) => (
                                  <div key={sc.id} className="ml-4">
                                    <h5 className="font-medium text-gray-800 mb-2">{sc.nom}</h5>
                                    <div className="space-y-2">
                                      {sc.sousRubriques.map((sr) => {
                                        const key = `${rubrique.id}_${sr.id}`
                                        const montant = emploiData[key] || 0
                                        return (
                                          <div key={sr.id} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700 ml-4">{sr.nom}</span>
                                            <span className="font-medium text-gray-900">{montant.toLocaleString()} MAD</span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Total général */}
                  <div className="border-t-2 border-gray-300 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">Total général</h4>
                        <p className="text-gray-600 text-sm">Somme de toutes les rubriques</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {getTotalGeneral().toLocaleString()} MAD
                        </div>
                        <div className="text-sm text-gray-600">
                          sur {selectedProjet.tranches[parseInt(selectedTranche)].montant.toLocaleString()} MAD
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Processus de signature */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-900 text-lg mb-3">Processus de signature</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Signataires par défaut */}
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm font-medium text-gray-800 mb-1">1. Responsable de la structure</p>
                          <p className="text-xs text-gray-600 mb-2">Responsable de la structure d'appartenance</p>
                          <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                            _________________
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm font-medium text-gray-800 mb-1">2. Coordinateur du projet</p>
                          <p className="text-xs text-gray-600 mb-2">Coordinateur du projet</p>
                          <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                            _________________
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded border border-gray-200">
                          <p className="text-sm font-medium text-gray-800 mb-1">3. Chef d'établissement</p>
                          <p className="text-xs text-gray-600 mb-2">Chef d'établissement</p>
                          <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                            _________________
                          </div>
                        </div>
                      </div>
                      {/* Signataires supplémentaires sélectionnés */}
                      {selectedDestinataires.filter(id => !["responsable_structure", "coordinateur_projet", "chef_etablissement"].includes(id)).length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {selectedDestinataires
                            .filter(id => !["responsable_structure", "coordinateur_projet", "chef_etablissement"].includes(id))
                            .map((destinataireId, index) => {
                            const destinataire = getDestinataireInfo(destinataireId)
                            return (
                              <div key={destinataireId} className="text-center p-3 bg-white rounded border border-gray-200">
                                  <p className="text-sm font-medium text-gray-800 mb-1">{index + 4}. {destinataire?.nom}</p>
                                <p className="text-xs text-gray-600 mb-2">{destinataire?.role}</p>
                          <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                            _________________
                          </div>
                        </div>
                            )
                          })}
                      </div>
                      )}
                      <div className="text-center p-3 bg-white rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-800 mb-2">Signature finale du Président</p>
                        <div className="text-sm text-gray-600 border-t border-gray-200 pt-2">
                          _________________
                        </div>
                      </div>
                    </div>
                  </div>



                  {/* Date de génération */}
                  <div className="text-center text-sm text-gray-500">
                    <p>Document généré le {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Actions du document */}
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowDocumentModal(false)}>
                  Fermer
                </Button>
                <Button variant="outline" onClick={handleDownloadDocument}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button onClick={handlePrintDocument}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer et signer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}