"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Eye, FileText, Calendar, Building, Users, DollarSign, Target, Upload, Plus, Info, CheckCircle, FolderOpen, BookOpen, X, AlertTriangle, Clock } from "lucide-react"
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
  sourcesFinancement?: string[]
  autresSourcesFinancement?: string[]
  objectifs?: string[]
  criteres?: string[]
  documents?: string[]
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

interface MembrePermanent {
  nom: string
  laboratoire: string
  etablissement: string
}

interface MembreAssocie {
  nom: string
  prenom: string
  pays: string
  etablissement: string
}

export default function AppelsProjets() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOrganisme, setFilterOrganisme] = useState("all")
  const [filterStatut, setFilterStatut] = useState("all")
  const [filterAnnee, setFilterAnnee] = useState("all")
  const [filterProgramme, setFilterProgramme] = useState("all")
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null)
  const [selectedAppel, setSelectedAppel] = useState<AppelProjet | null>(null)
  const [activeTab, setActiveTab] = useState<"appels" | "programmes">("appels")
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showNewProgramForm, setShowNewProgramForm] = useState(false)
  const [showNewAppelForm, setShowNewAppelForm] = useState(false)

  const [membresPermanents, setMembresPermanents] = useState<MembrePermanent[]>([])
  const [docteurs, setDocteurs] = useState<number[]>([])
  const [membresAssocies, setMembresAssocies] = useState<MembreAssocie[]>([])
  const [nouveauMembrePermanent, setNouveauMembrePermanent] = useState<MembrePermanent>({nom: "", laboratoire: "", etablissement: ""})
  const [selectedMembrePermanent, setSelectedMembrePermanent] = useState<string>("")
  const [nouveauMembreAssocie, setNouveauMembreAssocie] = useState<MembreAssocie>({nom: "", prenom: "", pays: "", etablissement: ""})
  const [formData, setFormData] = useState({
    intitule: "",
    thematique: "",
    organismesPartenaires: "",
    anneeDebut: "",
    anneeFin: "",
    budget: "",
    document: null as File | null
  })
  const [documents, setDocuments] = useState<Array<{id: string, name: string, type: string, file: File}>>([])
  const [nouveauDocument, setNouveauDocument] = useState({
    nom: "",
    type: "",
    fichier: null as File | null
  })
  const [organismesPartenaires, setOrganismesPartenaires] = useState<string[]>([])
  const [organismesEnValidation, setOrganismesEnValidation] = useState<string[]>([])
  const [nouvelOrganisme, setNouvelOrganisme] = useState("")
  const [typeOrganisme, setTypeOrganisme] = useState<"national" | "international">("national")
  const [paysOrganisme, setPaysOrganisme] = useState("")
  const [organismeExistant, setOrganismeExistant] = useState<string>("")
  const [modeAjoutOrganisme, setModeAjoutOrganisme] = useState<"existant" | "nouveau">("existant")
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
    nombreProjets: "",
    sourceFinancement: "",
    autreSourceFinancement: "",
    sourcesFinancement: [] as string[],
    autresSourcesFinancement: [] as string[]
  })

  const [newProgramErrors, setNewProgramErrors] = useState({
    name: false,
    organisme: false,
    budget: false,
    dateDebut: false,
    dateFin: false,
    description: false,
    nombreProjets: false,
    sourceFinancement: false,
    sourcesFinancement: false
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
    statut: "ouvert",
    sourcesFinancement: [] as string[],
    autresSourcesFinancement: [] as string[],
    autreSourceFinancement: ""
  })

  const [newAppelErrors, setNewAppelErrors] = useState({
    titre: false,
    programme: false,
    organisme: false,
    dateOuverture: false,
    dateLimite: false,
    description: false,
    budget: false,
    nombreProjetsAttendus: false,
    sourcesFinancement: false
  })
  const [showProgramCreatedMessage, setShowProgramCreatedMessage] = useState(false)
  const [createdProgramName, setCreatedProgramName] = useState("")
  const [showAppelCreatedMessage, setShowAppelCreatedMessage] = useState(false)
  const [createdAppelName, setCreatedAppelName] = useState("")
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

  // Types de documents attendus par l'UH2C
  const typesDocuments = [
    "Document principal du projet",
    "Annexe technique",
    "CV du responsable",
    "CV des membres de l'équipe",
    "Lettre de motivation",
    "Budget détaillé",
    "Planning du projet",
    "Résumé exécutif",
    "Bibliographie",
    "Autres"
  ]

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
      sourcesFinancement: ["Ministère de l'Enseignement Supérieur", "Agence Nationale de Sécurité"],
      autresSourcesFinancement: [],
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
      sourcesFinancement: ["Agence Nationale de Sécurité", "Union Européenne"],
      autresSourcesFinancement: [],
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
      sourcesFinancement: ["Ministère de la Santé", "Banque Mondiale"],
      autresSourcesFinancement: [],
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

  // Données des membres enseignants avec laboratoire et établissement
  const membresEnseignantsData = [
    {
      id: "ME1",
      nom: "LAHBY",
      prenom: "MOHAMED",
      titre: "Dr.",
      qualite: "Enseignant-Chercheur",
      laboratoire: "MINDLab",
      etablissement: "Université Hassan II"
    },
    {
      id: "ME2",
      nom: "ALAMI",
      prenom: "YOUSSEF",
      titre: "Dr.",
      qualite: "Enseignant-Chercheur",
      laboratoire: "LIIAN",
      etablissement: "Université Hassan II"
    },
    {
      id: "ME3",
      nom: "BENALI",
      prenom: "SARA",
      titre: "Dr.",
      qualite: "Enseignant-Chercheur",
      laboratoire: "LISFA",
      etablissement: "Université Hassan II"
    },
    {
      id: "ME4",
      nom: "CHAKIR",
      prenom: "AHMED",
      titre: "Dr.",
      qualite: "Enseignant-Chercheur",
      laboratoire: "MINDLab",
      etablissement: "Université Hassan II"
    }
  ]

  // Données des doctorants associés selon les enseignants
  const doctorantsAssociesData = [
    {
      id: "DA1",
      nom: "ZAHRA",
      prenom: "FATIMA",
      titre: "M.",
      qualite: "Doctorant",
      enseignant: "Dr. LAHBY MOHAMED",
      laboratoire: "MINDLab",
      etablissement: "Université Hassan II"
    },
    {
      id: "DA2",
      nom: "BENKIRANE",
      prenom: "LAILA",
      titre: "M.",
      qualite: "Doctorant",
      enseignant: "Dr. ALAMI YOUSSEF",
      laboratoire: "LIIAN",
      etablissement: "Université Hassan II"
    },
    {
      id: "DA3",
      nom: "CHERKAOUI",
      prenom: "OMAR",
      titre: "M.",
      qualite: "Doctorant",
      enseignant: "Dr. BENALI SARA",
      laboratoire: "LISFA",
      etablissement: "Université Hassan II"
    },
    {
      id: "DA4",
      nom: "EL HARTI",
      prenom: "KARIM",
      titre: "M.",
      qualite: "Doctorant",
      enseignant: "Dr. CHAKIR AHMED",
      laboratoire: "MINDLab",
      etablissement: "Université Hassan II"
    }
  ]

  // Données des membres (pour compatibilité)
  const [availableMembers, setAvailableMembers] = useState<Member[]>([
    { id: "1", nom: "Benali", prenom: "Ahmed", etat: "Actif", titre: "Dr.", qualite: "Membre directeur", etablissement: "Ministère de l'Enseignement Supérieur" },
    { id: "2", nom: "Zahra", prenom: "Fatima", etat: "Actif", titre: "Dr.", qualite: "Membre associé", etablissement: "Agence Nationale de Sécurité" },
    { id: "3", nom: "El Harti", prenom: "Sara", etat: "Actif", titre: "Dr.", qualite: "Chercheur", etablissement: "Ministère de la Santé" },
    { id: "4", nom: "Lahby", prenom: "Mohamed", etat: "Actif", titre: "Dr.", qualite: "Membre directeur", etablissement: "Ministère de l'Énergie" },
    { id: "5", nom: "Alaoui", prenom: "Karim", etat: "Actif", titre: "Pr.", qualite: "Expert", etablissement: "Ministère de l'Agriculture" },
    { id: "6", nom: "Bennani", prenom: "Amina", etat: "Actif", titre: "Dr.", qualite: "Membre associé", etablissement: "Ministère des Transports" }
  ])

  // Données des membres permanents organisés par établissement et laboratoire
  const membresPermanentsDisponibles = [
    {
      id: "1",
      nom: "Dr. Alami Mohamed",
      laboratoire: "Laboratoire de Biologie Moléculaire",
      etablissement: "Université Hassan II - Faculté des Sciences"
    },
    {
      id: "2", 
      nom: "Pr. Benjelloun Fatima",
      laboratoire: "Laboratoire de Biologie Moléculaire",
      etablissement: "Université Hassan II - Faculté des Sciences"
    },
    {
      id: "3",
      nom: "Dr. El Fassi Ahmed",
      laboratoire: "Laboratoire de Chimie Organique",
      etablissement: "Université Hassan II - Faculté des Sciences"
    },
    {
      id: "4",
      nom: "Pr. Tazi Amina",
      laboratoire: "Laboratoire de Chimie Organique", 
      etablissement: "Université Hassan II - Faculté des Sciences"
    },
    {
      id: "5",
      nom: "Dr. Bennani Karim",
      laboratoire: "Laboratoire de Physique Quantique",
      etablissement: "Université Hassan II - Faculté des Sciences"
    },
    {
      id: "6",
      nom: "Pr. Cherkaoui Nadia",
      laboratoire: "Laboratoire de Mathématiques Appliquées",
      etablissement: "Université Hassan II - Faculté des Sciences"
    },
    {
      id: "7",
      nom: "Dr. Mouline Hassan",
      laboratoire: "Laboratoire d'Informatique",
      etablissement: "Université Hassan II - Faculté des Sciences"
    },
    {
      id: "8",
      nom: "Pr. Rachidi Samira",
      laboratoire: "Laboratoire d'Informatique",
      etablissement: "Université Hassan II - Faculté des Sciences"
    },
    {
      id: "9",
      nom: "Dr. Zaki Omar",
      laboratoire: "Laboratoire de Médecine Expérimentale",
      etablissement: "Université Hassan II - Faculté de Médecine"
    },
    {
      id: "10",
      nom: "Pr. Mansouri Leila",
      laboratoire: "Laboratoire de Médecine Expérimentale",
      etablissement: "Université Hassan II - Faculté de Médecine"
    },
    {
      id: "11",
      nom: "Dr. Idrissi Youssef",
      laboratoire: "Laboratoire de Pharmacologie",
      etablissement: "Université Hassan II - Faculté de Médecine"
    },
    {
      id: "12",
      nom: "Pr. El Khadir Sara",
      laboratoire: "Laboratoire de Pharmacologie",
      etablissement: "Université Hassan II - Faculté de Médecine"
    }
  ]

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

  // Sources de financement disponibles
  const sourcesFinancement = [
    "Ministère de l'Enseignement Supérieur",
    "Ministère de la Santé",
    "Ministère de l'Énergie",
    "Ministère de l'Agriculture",
    "Ministère des Transports",
    "Agence Nationale de Sécurité",
    "Office National de Recherche et d'Exploitation Pétrolière",
    "Office Chérifien des Phosphates",
    "Institut National de Recherche Agronomique",
    "Centre National de Recherche Scientifique et Technique",
    "Agence Nationale de Réglementation des Télécommunications",
    "Agence Marocaine de l'Efficacité Énergétique",
    "Agence Nationale de Développement des Energies Renouvelables",
    "Office National de l'Eau et de l'Électricité",
    "Société Nationale des Autoroutes du Maroc",
    "Office National des Chemins de Fer",
    "Union Européenne",
    "Banque Mondiale",
    "Banque Africaine de Développement",
    "Organisation des Nations Unies",
    "Autre"
  ]

  const pays = [
    "France",
    "États-Unis",
    "Canada",
    "Allemagne",
    "Royaume-Uni",
    "Espagne",
    "Italie",
    "Belgique",
    "Suisse",
    "Pays-Bas",
    "Suède",
    "Norvège",
    "Danemark",
    "Finlande",
    "Autriche",
    "Portugal",
    "Grèce",
    "Pologne",
    "République tchèque",
    "Hongrie",
    "Slovaquie",
    "Slovénie",
    "Croatie",
    "Bulgarie",
    "Roumanie",
    "Estonie",
    "Lettonie",
    "Lituanie",
    "Luxembourg",
    "Malte",
    "Chypre",
    "Irlande",
    "Islande",
    "Japon",
    "Corée du Sud",
    "Chine",
    "Inde",
    "Australie",
    "Nouvelle-Zélande",
    "Brésil",
    "Argentine",
    "Chili",
    "Mexique",
    "Afrique du Sud",
    "Égypte",
    "Tunisie",
    "Algérie",
    "Maroc",
    "Sénégal",
    "Côte d'Ivoire",
    "Ghana",
    "Nigeria",
    "Kenya",
    "Éthiopie",
    "Ouganda",
    "Tanzanie",
    "Zambie",
    "Zimbabwe",
    "Botswana",
    "Namibie",
    "Mozambique",
    "Angola",
    "Congo",
    "Gabon",
    "Cameroun",
    "Tchad",
    "Niger",
    "Mali",
    "Burkina Faso",
    "Bénin",
    "Togo",
    "Guinée",
    "Sierra Leone",
    "Libéria",
    "Gambie",
    "Guinée-Bissau",
    "Cap-Vert",
    "Mauritanie",
    "Autre"
  ]

  // Liste des organismes partenaires existants
  const organismesPartenairesExistants = {
    national: [
      "CHU Hassan II",
      "CHU Ibn Sina",
      "CHU Mohammed VI",
      "Institut Pasteur du Maroc",
      "Institut National de Recherche Halieutique",
      "Office National de Recherche et d'Exploitation Pétrolière",
      "Office Chérifien des Phosphates",
      "Institut National de Recherche Agronomique",
      "Centre National de Recherche Scientifique et Technique",
      "Agence Nationale de Réglementation des Télécommunications",
      "Agence Marocaine de l'Efficacité Énergétique",
      "Agence Nationale de Développement des Energies Renouvelables",
      "Office National de l'Eau et de l'Électricité",
      "Société Nationale des Autoroutes du Maroc",
      "Office National des Chemins de Fer",
      "Agence Urbaine de Casablanca",
      "Agence Urbaine de Rabat",
      "Agence Urbaine de Marrakech",
      "Agence Urbaine de Fès",
      "Agence Urbaine de Tanger"
    ],
    international: [
      "MIT - Massachusetts Institute of Technology",
      "Stanford University",
      "Harvard University",
      "University of California, Berkeley",
      "CNRS - Centre National de la Recherche Scientifique",
      "INSERM - Institut National de la Santé et de la Recherche Médicale",
      "Max Planck Institute",
      "Fraunhofer Institute",
      "University of Oxford",
      "University of Cambridge",
      "Imperial College London",
      "ETH Zurich",
      "EPFL - École Polytechnique Fédérale de Lausanne",
      "University of Tokyo",
      "Kyoto University",
      "Tsinghua University",
      "Peking University",
      "IIT - Indian Institute of Technology",
      "University of Toronto",
      "McGill University",
      "University of Melbourne",
      "University of Sydney"
    ]
  }

  // Données des appels à projets
  const appelsProjets: AppelProjet[] = [
    {
      id: "AP1",
      titre: "Appel à projets - IA pour la santé préventive",
      programme: "Programme National de Recherche en IA",
      organisme: "Ministère de l'Enseignement Supérieur",
      dateOuverture: "2024-01-15",
      dateLimite: "2024-06-30",
      description: "Développement d'algorithmes d'intelligence artificielle pour la prévention et le diagnostic précoce des maladies",
      budget: 800000,
      nombreProjetsAttendus: 5,
      statut: "ouvert",
      sourcesFinancement: ["Ministère de l'Enseignement Supérieur", "Agence Nationale de Sécurité"],
      autresSourcesFinancement: [],
      criteres: [
        "Expertise en IA et santé",
        "Validation clinique préliminaire",
        "Équipe pluridisciplinaire",
        "Impact sur la santé publique"
      ],
      documents: [
        "Projet détaillé",
        "Plan de recherche",
        "Budget prévisionnel",
        "CV des chercheurs"
      ]
    },
    {
      id: "AP2",
      titre: "Appel à projets - Cybersécurité des infrastructures critiques",
      programme: "Programme de Recherche en Cybersécurité",
      organisme: "Agence Nationale de Sécurité",
      dateOuverture: "2024-03-01",
      dateLimite: "2024-08-31",
      description: "Protection avancée des infrastructures critiques contre les cyberattaques",
      budget: 1200000,
      nombreProjetsAttendus: 3,
      statut: "ouvert",
      sourcesFinancement: ["Agence Nationale de Sécurité", "Union Européenne"],
      autresSourcesFinancement: [],
      criteres: [
        "Expertise en cybersécurité",
        "Expérience avec les infrastructures critiques",
        "Collaboration avec les autorités",
        "Innovation technologique"
      ],
      documents: [
        "Analyse des menaces",
        "Architecture de sécurité",
        "Plan de déploiement",
        "Certifications"
      ]
    },
    {
      id: "AP3",
      titre: "Appel à projets - Télémédecine et santé connectée",
      programme: "Programme de Recherche en Santé Numérique",
      organisme: "Ministère de la Santé",
      dateOuverture: "2024-02-15",
      dateLimite: "2024-07-31",
      description: "Développement de solutions de télémédecine et de santé connectée",
      budget: 600000,
      nombreProjetsAttendus: 8,
      statut: "en_evaluation",
      sourcesFinancement: ["Ministère de la Santé", "Banque Mondiale"],
      autresSourcesFinancement: [],
      criteres: [
        "Expertise médicale et technologique",
        "Validation clinique",
        "Conformité aux normes",
        "Impact sur les soins"
      ],
      documents: [
        "Étude clinique",
        "Protocole médical",
        "Plan de déploiement",
        "Autorisations"
      ]
    }
  ]

  // Fonction pour vérifier si un programme est en cours
  const isProgrammeActif = (dateFin: string) => {
    return new Date(dateFin) >= new Date()
  }

  // Filtrage des appels à projets
  const filteredAppelsProjets = appelsProjets.filter(appel => {
    const matchesSearch = appel.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appel.programme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appel.organisme.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrganisme = filterOrganisme === "all" || appel.organisme === filterOrganisme
    const matchesStatut = filterStatut === "all" || 
      (filterStatut === "en_cours" && appel.statut === "ouvert") ||
      (filterStatut === "expire" && (appel.statut === "ferme" || appel.statut === "en_evaluation"))
    const matchesAnnee = filterAnnee === "all" || 
      new Date(appel.dateOuverture).getFullYear().toString() === filterAnnee ||
      new Date(appel.dateLimite).getFullYear().toString() === filterAnnee
    const matchesProgramme = filterProgramme === "all" || appel.programme === filterProgramme
    
    return matchesSearch && matchesOrganisme && matchesStatut && matchesAnnee && matchesProgramme
  })

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

  // Données filtrées selon l'onglet actif
  const filteredData = activeTab === "appels" ? filteredAppelsProjets : filteredProgrammes

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
    setMembresPermanents([])
    setDocteurs([])
    setMembresAssocies([])
    setDocuments([])
    setNouveauDocument({nom: "", type: "", fichier: null})
    setOrganismesPartenaires([])
    setOrganismesEnValidation([])
    setNouvelOrganisme("")
    setTypeOrganisme("national")
    setPaysOrganisme("")
    setOrganismeExistant("")
    setModeAjoutOrganisme("existant")
  }

  // Fonction pour voir les détails d'un programme
  const handleVoirDetails = (programme: Programme) => {
    setSelectedProgramme(programme)
    setSelectedAppel(null) // Réinitialiser l'appel sélectionné
    setShowDetailsModal(true)
  }

  // Fonction pour voir les détails d'un appel à projets
  const handleVoirDetailsAppel = (appel: AppelProjet) => {
    setSelectedAppel(appel)
    setSelectedProgramme(null) // Réinitialiser le programme sélectionné
    setShowDetailsModal(true)
  }

  // Fonction pour fermer le modal de détails et réinitialiser l'état
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedAppel(null)
    setSelectedProgramme(null)
  }

  // Fonction pour soumettre un projet à un appel
  const handleSoumettreAppel = (appel: AppelProjet) => {
    setSelectedAppel(appel)
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
    setMembresPermanents([])
    setDocteurs([])
    setMembresAssocies([])
    setDocuments([])
    setNouveauDocument({nom: "", type: "", fichier: null})
    setOrganismesPartenaires([])
    setOrganismesEnValidation([])
    setNouvelOrganisme("")
    setTypeOrganisme("national")
    setPaysOrganisme("")
    setOrganismeExistant("")
    setModeAjoutOrganisme("existant")
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
    // Cette fonction n'est plus utilisée car nous avons des fonctions spécifiques pour chaque type
    console.log("handleMemberToggle is deprecated")
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      document: file
    }))
  }

  const handleDocumentInputChange = (field: string, value: string | File | null) => {
    setNouveauDocument(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddDocument = () => {
    if (nouveauDocument.fichier && nouveauDocument.type) {
      // Si le type est "Autres", utiliser le nom du fichier comme nom du document
      // Sinon, utiliser le type comme nom du document
      const documentName = nouveauDocument.type === "Autres" 
        ? nouveauDocument.fichier.name.replace(/\.[^/.]+$/, "") // Enlever l'extension
        : nouveauDocument.type // Utiliser le type comme nom
      
      const newDoc = {
        id: Date.now().toString(),
        name: documentName,
        type: nouveauDocument.type,
        file: nouveauDocument.fichier
      }
      setDocuments(prev => [...prev, newDoc])
      setNouveauDocument({nom: "", type: "", fichier: null})
    }
  }

  const handleRemoveDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const handleDocumentFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setNouveauDocument(prev => ({
      ...prev,
      fichier: file
    }))
  }

  const handleAddOrganisme = () => {
    if (nouvelOrganisme.trim()) {
      const organismeComplet = typeOrganisme === "international" && paysOrganisme 
        ? `${nouvelOrganisme} (${paysOrganisme})`
        : nouvelOrganisme.trim()
      
      setOrganismesPartenaires([...organismesPartenaires, organismeComplet])
      setOrganismesEnValidation([...organismesEnValidation, organismeComplet])
      setNouvelOrganisme("")
      setPaysOrganisme("")
    }
  }

  const handleAddOrganismeExistant = () => {
    if (organismeExistant && !organismesPartenaires.includes(organismeExistant)) {
      let organismeComplet = organismeExistant
      
      // Si c'est un organisme international, ajouter le pays sélectionné
      if (typeOrganisme === "international" && paysOrganisme) {
        organismeComplet = `${organismeExistant} (${paysOrganisme})`
      }
      
      setOrganismesPartenaires(prev => [...prev, organismeComplet])
      setOrganismeExistant("")
      setPaysOrganisme("")
    }
  }

  const handleRemoveOrganisme = (index: number) => {
    const organismeToRemove = organismesPartenaires[index]
    setOrganismesPartenaires(organismesPartenaires.filter((_, i) => i !== index))
    setOrganismesEnValidation(organismesEnValidation.filter(org => org !== organismeToRemove))
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
    // Cette fonction n'est plus utilisée car nous avons des fonctions spécifiques pour chaque type
    console.log("handleMemberSelect is deprecated")
  }

  const handleDocteurSelect = (memberIndex: string) => {
    const index = parseInt(memberIndex)
    if (docteurs.includes(index)) {
      setDocteurs(docteurs.filter(id => id !== index))
    } else {
      setDocteurs([...docteurs, index])
    }
  }

  const handleMembreAssocieInputChange = (field: string, value: string) => {
    setNouveauMembreAssocie(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddMembreAssocie = () => {
    if (nouveauMembreAssocie.nom.trim() && nouveauMembreAssocie.prenom.trim() && nouveauMembreAssocie.pays && nouveauMembreAssocie.etablissement.trim()) {
      const nouveauMembre: MembreAssocie = {
        nom: nouveauMembreAssocie.nom.trim(),
        prenom: nouveauMembreAssocie.prenom.trim(),
        pays: nouveauMembreAssocie.pays,
        etablissement: nouveauMembreAssocie.etablissement.trim()
      }
      setMembresAssocies([...membresAssocies, nouveauMembre])
      setNouveauMembreAssocie({ nom: "", prenom: "", pays: "", etablissement: "" })
    }
  }

  const handleRemoveMembreAssocie = (index: number) => {
    setMembresAssocies(membresAssocies.filter((_, i) => i !== index))
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
    
    // Ajouter aux membres associés au lieu de selectedMembers
    setMembresAssocies(prev => [...prev, {
      nom: newMember.nom.trim(),
      prenom: newMember.prenom.trim(),
      pays: "Maroc", // Valeur par défaut pour les nouveaux membres
      etablissement: newMember.etablissement.trim()
    }])
    
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
      document: documents.length === 0
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
      membres: {
        permanents: membresPermanents,
        doctorants: docteurs,
        associes: membresAssocies
      }
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

  const handleSourceFinancementToggle = (source: string) => {
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
    
    // Effacer l'erreur
    if (newProgramErrors.sourcesFinancement) {
      setNewProgramErrors(prev => ({
        ...prev,
        sourcesFinancement: false
      }))
    }
  }

  const handleRemoveSourceFinancement = (sourceToRemove: string) => {
    setNewProgramData(prev => ({
      ...prev,
      sourcesFinancement: prev.sourcesFinancement.filter(source => source !== sourceToRemove)
    }))
  }

  const handleAddAutreSourceFinancement = () => {
    if (newProgramData.autreSourceFinancement.trim()) {
      setNewProgramData(prev => ({
        ...prev,
        autresSourcesFinancement: [...prev.autresSourcesFinancement, newProgramData.autreSourceFinancement.trim()],
        autreSourceFinancement: ""
      }))
    }
  }

  const handleRemoveAutreSourceFinancement = (sourceToRemove: string) => {
    setNewProgramData(prev => ({
      ...prev,
      autresSourcesFinancement: prev.autresSourcesFinancement.filter(source => source !== sourceToRemove)
    }))
  }

  const handleNewAppelInputChange = (field: string, value: string) => {
    setNewAppelData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Effacer l'erreur pour ce champ quand l'utilisateur commence à taper
    if (newAppelErrors[field as keyof typeof newAppelErrors]) {
      setNewAppelErrors(prev => ({
        ...prev,
        [field]: false
      }))
    }
  }

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
    
    // Effacer l'erreur
    if (newAppelErrors.sourcesFinancement) {
      setNewAppelErrors(prev => ({
        ...prev,
        sourcesFinancement: false
      }))
    }
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
      name: !newProgramData.name.trim(),
      organisme: !newProgramData.organisme.trim(),
      dateDebut: !newProgramData.dateDebut,
      dateFin: !newProgramData.dateFin,
      description: !newProgramData.description.trim(),
      budget: !newProgramData.budget || newProgramData.budget === "0",
      nombreProjets: !newProgramData.nombreProjets || newProgramData.nombreProjets === "0",
      sourceFinancement: false, // Ancien champ, maintenant inutilisé
      sourcesFinancement: newProgramData.sourcesFinancement.length === 0
    }
    
    setNewProgramErrors(errors)
    
    console.log("Erreurs de validation:", errors)
    
    // Vérifier s'il y a des erreurs
    if (Object.values(errors).some(Boolean)) {
      console.log("Formulaire bloqué à cause d'erreurs")
      return
    }
    
    // Ici on pourrait envoyer les données au serveur
    console.log("Création du nouveau programme:", {
      ...newProgramData,
      sourcesFinancement: newProgramData.sourcesFinancement,
      autresSourcesFinancement: newProgramData.autresSourcesFinancement,
      autreSourceFinancement: newProgramData.sourcesFinancement.includes("Autre") ? newProgramData.autreSourceFinancement : ""
    })
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
      nombreProjets: "",
      sourceFinancement: "",
      autreSourceFinancement: "",
      sourcesFinancement: [],
      autresSourcesFinancement: []
    })
    setNewProgramErrors({
      name: false,
      organisme: false,
      budget: false,
      dateDebut: false,
      dateFin: false,
      description: false,
      nombreProjets: false,
      sourceFinancement: false,
      sourcesFinancement: false
    })
  }

  const handleCreateNewAppel = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {
      titre: !newAppelData.titre,
      programme: !newAppelData.programme,
      organisme: !newAppelData.organisme,
      dateOuverture: !newAppelData.dateOuverture,
      dateLimite: !newAppelData.dateLimite,
      description: !newAppelData.description,
      budget: !newAppelData.budget || parseFloat(newAppelData.budget) <= 0,
      nombreProjetsAttendus: !newAppelData.nombreProjetsAttendus || parseInt(newAppelData.nombreProjetsAttendus) <= 0,
      sourcesFinancement: newAppelData.sourcesFinancement.length === 0
    }

    if (Object.values(newErrors).some(Boolean)) {
      setNewAppelErrors(newErrors)
      return
    }

    // Validation des dates
    const dateOuverture = new Date(newAppelData.dateOuverture)
    const dateLimite = new Date(newAppelData.dateLimite)
    const dateActuelle = new Date()
    
    if (dateOuverture > dateActuelle) {
      alert("La date d'ouverture ne peut pas dépasser la date actuelle")
      return
    }
    
    if (dateLimite <= dateOuverture) {
      alert("La date limite doit être postérieure à la date d'ouverture")
      return
    }

    // Créer le nouvel appel à projets
    const newAppel: AppelProjet = {
      id: `AP${Date.now()}`,
      titre: newAppelData.titre,
      programme: newAppelData.programme,
      organisme: newAppelData.organisme,
      dateOuverture: newAppelData.dateOuverture,
      dateLimite: newAppelData.dateLimite,
      description: newAppelData.description,
      budget: parseFloat(newAppelData.budget),
      nombreProjetsAttendus: parseInt(newAppelData.nombreProjetsAttendus),
      statut: "ouvert",
      criteres: [],
      documents: []
    }

    // Ajouter à la liste (simulation)
    console.log("Nouvel appel à projets créé:", newAppel)
    
    // Afficher le message de succès
    setCreatedAppelName(newAppelData.titre)
    setShowAppelCreatedMessage(true)
    
    // Réinitialiser le formulaire
    setShowNewAppelForm(false)
    setNewAppelData({
      titre: "",
      programme: "",
      organisme: "",
      dateOuverture: "",
      dateLimite: "",
      description: "",
      budget: "",
      nombreProjetsAttendus: "",
      statut: "ouvert",
      sourcesFinancement: [],
      autresSourcesFinancement: [],
      autreSourceFinancement: ""
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
      sourcesFinancement: false
    })
  }

  // Données combinées de tous les types de membres sélectionnés
  const selectedMembersData = [
    ...membresPermanents.map((membre, index) => ({
      id: `permanent-${index}`,
      nom: membre.nom,
      prenom: '',
      titre: '',
      qualite: 'Membre permanent',
      etablissement: membre.etablissement,
      type: 'permanent'
    })),
    ...docteurs.map((memberIndex) => {
      const member = membresPermanents[memberIndex]
      return member ? {
        id: `docteur-${memberIndex}`,
        nom: member.nom,
        prenom: '',
        titre: 'Dr.',
        qualite: 'Docteur',
        etablissement: member.etablissement,
        type: 'docteur'
      } : null
    }).filter(Boolean),
    ...membresAssocies.map((membre, index) => ({
      id: `associe-${index}`,
      nom: membre.nom,
      prenom: membre.prenom,
      titre: '',
      qualite: 'Membre associé',
      etablissement: membre.etablissement,
      type: 'associe'
    }))
  ]

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

  const handleMembrePermanentInputChange = (field: string, value: string) => {
    setNouveauMembrePermanent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddMembrePermanent = () => {
    if (nouveauMembrePermanent.nom.trim() && nouveauMembrePermanent.laboratoire.trim() && nouveauMembrePermanent.etablissement.trim()) {
      setMembresPermanents([...membresPermanents, { ...nouveauMembrePermanent }])
      setNouveauMembrePermanent({ nom: "", laboratoire: "", etablissement: "" })
    }
  }

  const handleRemoveMembrePermanent = (index: number) => {
    setMembresPermanents(membresPermanents.filter((_, i) => i !== index))
  }

  const handleSelectMembrePermanent = (membreId: string) => {
    const membre = membresPermanentsDisponibles.find(m => m.id === membreId)
    if (membre) {
      setMembresPermanents(prev => [...prev, membre])
      setSelectedMembrePermanent("")
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <div className="mx-auto max-w-5xl">
            {/* Header simple */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === "appels" ? "Appels à projets" : "Programmes"}
              </h1>
              <p className="text-gray-600 mt-1">
                {activeTab === "appels" 
                  ? "Consultez les appels à projets de recherche disponibles et soumettre vos projets"
                  : "Consultez les programmes de recherche disponibles et soumettre vos projets"
                }
              </p>
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
                    placeholder={activeTab === "appels" ? "Rechercher un appel à projets..." : "Rechercher un programme..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 text-sm border-2 border-gray-200 focus:border-uh2c-blue focus:ring-2 focus:ring-uh2c-blue/20 rounded-lg"
                  />
                </div>

                {/* Filtre Appel à projets en premier - seulement pour l'onglet Appels */}
                {activeTab === "appels" && (
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                      <BookOpen className="h-3 w-3 text-uh2c-blue" />
                      Appel à projets
                    </Label>
                    <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                      <SelectTrigger className="h-9 border-2 border-uh2c-blue/20 focus:border-uh2c-blue focus:ring-2 focus:ring-uh2c-blue/20 rounded-lg bg-uh2c-blue/5 hover:bg-uh2c-blue/10 transition-colors">
                        <SelectValue placeholder="Tous les appels à projets" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="all" className="font-medium text-uh2c-blue">
                          Tous les appels à projets
                        </SelectItem>
                        {appelsProjets.map((appel) => (
                          <SelectItem key={appel.id} value={appel.programme} className="py-1">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 text-sm">{appel.programme}</span>
                              <span className="text-xs text-gray-500">{appel.organisme}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Filtres alignés */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-uh2c-blue" />
                      Statut
                    </Label>
                    <Select value={filterStatut} onValueChange={setFilterStatut}>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-uh2c-blue focus:ring-2 focus:ring-uh2c-blue/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium text-uh2c-blue">
                          Tous les statuts
                        </SelectItem>
                        {activeTab === "appels" ? (
                          <>
                            <SelectItem value="en_cours">Ouvert</SelectItem>
                            <SelectItem value="expire">Fermé</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="en_cours">En cours</SelectItem>
                            <SelectItem value="expire">Expiré</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-uh2c-blue" />
                      Programme
                    </Label>
                    <Select value={filterProgramme} onValueChange={setFilterProgramme}>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-uh2c-blue focus:ring-2 focus:ring-uh2c-blue/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder="Tous les programmes" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        <SelectItem value="all" className="font-medium text-uh2c-blue">
                          Tous les programmes
                        </SelectItem>
                        {activeTab === "appels" ? (
                          appelsProjets.map((appel) => (
                            <SelectItem key={appel.id} value={appel.programme} className="py-1">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900 text-sm">{appel.programme}</span>
                                <span className="text-xs text-gray-500">{appel.organisme}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          programmes.map((programme) => (
                            <SelectItem key={programme.id} value={programme.name} className="py-1">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900 text-sm">{programme.name}</span>
                                <span className="text-xs text-gray-500">{programme.organisme}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-uh2c-blue" />
                      Année
                    </Label>
                    <Select value={filterAnnee} onValueChange={setFilterAnnee}>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-uh2c-blue focus:ring-2 focus:ring-uh2c-blue/20 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <SelectValue placeholder="Toutes les années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-medium text-uh2c-blue">
                          Toutes les années
                        </SelectItem>
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
                </div>






              </CardContent>
            </Card>

            {/* Onglets pour les deux volets */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("appels")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "appels"
                      ? "bg-white text-uh2c-blue shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  Appels à projets
                </button>
                <button
                  onClick={() => setActiveTab("programmes")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "programmes"
                      ? "bg-white text-uh2c-blue shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Programmes
                </button>
              </div>
            </div>

            {/* Statistiques selon l'onglet actif */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        {activeTab === "appels" ? "Appels à projets ouverts" : "Programmes en cours"}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {activeTab === "appels" 
                          ? filteredAppelsProjets.filter(a => a.statut === "ouvert").length
                          : filteredProgrammes.filter(p => isProgrammeActif(p.dateFin)).length
                        }
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      {activeTab === "appels" ? (
                        <FolderOpen className="h-4 w-4 text-green-600" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">
                        {activeTab === "appels" ? "Résultats filtrés" : "Résultats filtrés"}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {activeTab === "appels" 
                          ? filteredAppelsProjets.length
                          : filteredProgrammes.length
                        }
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contenu selon l'onglet actif */}
            {activeTab === "appels" ? (
              // Volet Appels à projets
              <div className="space-y-4">
                {filteredAppelsProjets.map((appel) => (
                  <Card key={appel.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* En-tête avec titre et statut */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">{appel.titre}</h3>
                            <Badge 
                              className={
                                appel.statut === "ouvert" ? "bg-green-100 text-green-800" :
                                appel.statut === "en_evaluation" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }
                            >
                              {appel.statut === "ouvert" ? "Ouvert" :
                               appel.statut === "en_evaluation" ? "En évaluation" : "Fermé"}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Informations de l'appel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Date limite</p>
                              <p className="text-sm text-gray-900">
                                {new Date(appel.dateLimite).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Programme</p>
                              <p className="text-sm text-gray-900">{appel.programme}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Budget</p>
                              <p className="text-sm text-gray-900">{formatBudget(appel.budget)}</p>
                            </div>
                          </div>
                          {(appel.sourcesFinancement && appel.sourcesFinancement.length > 0) || 
                           (appel.autresSourcesFinancement && appel.autresSourcesFinancement.length > 0) ? (
                            <div className="md:col-span-2 lg:col-span-3">
                              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-uh2c-blue">
                                <div className="flex items-center gap-2 mb-2">
                                  <DollarSign className="h-4 w-4 text-uh2c-blue" />
                                  <p className="text-xs font-semibold text-gray-700">Sources de financement</p>
                                </div>
                                <div className="space-y-1.5">
                                  {appel.sourcesFinancement?.map((source, index) => (
                                    <div key={`predef-${index}`} className="flex items-center gap-2 text-xs">
                                      <div className="w-2 h-2 bg-uh2c-blue rounded-full"></div>
                                      <span className="text-gray-700 font-medium">{source}</span>
                                    </div>
                                  ))}
                                  {appel.autresSourcesFinancement?.map((source, index) => (
                                    <div key={`custom-${index}`} className="flex items-center gap-2 text-xs">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="text-gray-700 font-medium">{source}</span>
                                      <span className="text-xs text-green-600 font-semibold">(personnalisé)</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-600">{appel.description}</p>
                        
                        {/* Boutons d'action */}
                        <div className="flex gap-2 pt-3 border-t border-gray-100 justify-end">
                          <Button
                            onClick={() => handleSoumettreAppel(appel)}
                            disabled={appel.statut !== "ouvert"}
                            size="sm"
                            className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white text-xs h-7 px-3"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Soumettre un projet
                          </Button>
                          <Button
                            onClick={() => handleVoirDetailsAppel(appel)}
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

                {filteredAppelsProjets.length === 0 && (
                  <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                    <CardContent className="p-8 text-center">
                      <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun appel à projets trouvé</h3>
                      <p className="text-sm text-gray-600">Aucun appel à projets ne correspond à vos critères de recherche</p>
                    </CardContent>
                  </Card>
                )}

                {/* Carte pour créer un nouvel appel à projets */}
                <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Plus className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          Votre appel à projets n'est pas dans la liste ?
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Créez un nouvel appel à projets de recherche personnalisé
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowNewAppelForm(true)}
                        className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer un appel à projets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Volet Programmes
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
                                                  {(programme.sourcesFinancement && programme.sourcesFinancement.length > 0) || 
                           (programme.autresSourcesFinancement && programme.autresSourcesFinancement.length > 0) ? (
                            <div className="md:col-span-2 lg:col-span-3">
                              <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-uh2c-blue">
                                <div className="flex items-center gap-2 mb-2">
                                  <DollarSign className="h-4 w-4 text-uh2c-blue" />
                                  <p className="text-xs font-semibold text-gray-700">Sources de financement</p>
                                </div>
                                <div className="space-y-1.5">
                                  {programme.sourcesFinancement?.map((source, index) => (
                                    <div key={`predef-${index}`} className="flex items-center gap-2 text-xs">
                                      <div className="w-2 h-2 bg-uh2c-blue rounded-full"></div>
                                      <span className="text-gray-700 font-medium">{source}</span>
                                    </div>
                                  ))}
                                  {programme.autresSourcesFinancement?.map((source, index) => (
                                    <div key={`custom-${index}`} className="flex items-center gap-2 text-xs">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="text-gray-700 font-medium">{source}</span>
                                      <span className="text-xs text-green-600 font-semibold">(personnalisé)</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : null}
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

                {filteredProgrammes.length === 0 && (
                  <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                    <CardContent className="p-8 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun programme trouvé</h3>
                      <p className="text-sm text-gray-600">Aucun programme ne correspond à vos critères de recherche</p>
                    </CardContent>
                  </Card>
                )}

              {/* Carte pour créer un nouveau programme */}
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Plus className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        Ajouter ici dans ce formulaire
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Créer un nouveau programme de recherche avec informations complètes
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
            )}
          </div>
        </main>
      </div>

      {/* Modal de détails du programme */}
      <Dialog open={showDetailsModal} onOpenChange={(open) => {
        if (!open) {
          handleCloseDetailsModal()
        } else {
          setShowDetailsModal(true)
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="pb-3">
            {selectedAppel ? (
              <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-uh2c-blue" />
                    <DialogTitle className="text-base font-bold text-uh2c-blue">
                      {selectedAppel.titre}
                    </DialogTitle>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    <p className="font-medium text-uh2c-blue">Appel à projets</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-uh2c-blue" />
                    <DialogTitle className="text-base font-bold text-uh2c-blue">
                      {selectedProgramme?.name}
                    </DialogTitle>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    <p className="font-medium text-uh2c-blue">Programme de recherche</p>
                  </div>
                </div>
              </div>
            )}
          </DialogHeader>
          
          {selectedProgramme && !selectedAppel && (
            <div className="space-y-4 pt-2">
              {/* En-tête avec informations principales */}
              <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 rounded-lg p-4 border border-uh2c-blue/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Building className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organisme</p>
                      <p className="text-xs font-semibold text-gray-900">{selectedProgramme.organisme}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Période</p>
                      <p className="text-xs font-semibold text-gray-900">
                        {new Date(selectedProgramme.dateDebut).toLocaleDateString('fr-FR')} - {new Date(selectedProgramme.dateFin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Projets</p>
                      <p className="text-xs font-semibold text-gray-900">{selectedProgramme.nombreProjets} projets</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Target className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</p>
                      <Badge 
                        className={isProgrammeActif(selectedProgramme.dateFin) 
                          ? "bg-green-100 text-green-800 border-green-200 text-xs px-1.5 py-0.5 font-medium" 
                          : "bg-gray-100 text-gray-600 border-gray-200 text-xs px-1.5 py-0.5 font-medium"
                        }
                      >
                        {isProgrammeActif(selectedProgramme.dateFin) ? "Actif" : "Expiré"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations principales regroupées */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Description */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-3 w-3 text-uh2c-blue" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Description</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-xs bg-gray-50 rounded-lg p-2">{selectedProgramme.description}</p>
                  </div>

                  {/* Budget */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-3 w-3 text-uh2c-blue" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Budget disponible</h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-base font-bold text-gray-700">{selectedProgramme.budget.toLocaleString()} MAD</p>
                      <p className="text-xs text-gray-600 mt-1">Budget maximum par projet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objectifs et Critères regroupés */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Objectifs du programme */}
                  {selectedProgramme.objectifs && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Target className="h-3 w-3 text-uh2c-blue" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Objectifs du programme</h3>
                      </div>
                      <div className="space-y-1">
                        {selectedProgramme.objectifs.map((objectif, index) => (
                          <div key={index} className="flex items-start gap-2 p-1.5 bg-gray-50 rounded border border-gray-100">
                            <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-gray-700 text-xs">{objectif}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Critères d'éligibilité */}
                  {selectedProgramme.criteres && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-uh2c-blue" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Critères d'éligibilité</h3>
                      </div>
                      <div className="space-y-1">
                        {selectedProgramme.criteres.map((critere, index) => (
                          <div key={index} className="flex items-start gap-2 p-1.5 bg-gray-50 rounded border border-gray-100">
                            <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-gray-700 text-xs">{critere}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents requis */}
              {selectedProgramme.documents && (
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-3 w-3 text-uh2c-blue" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Documents requis</h3>
                  </div>
                  <div className="space-y-1">
                    {selectedProgramme.documents.map((document, index) => (
                      <div key={index} className="flex items-start gap-2 p-1.5 bg-gray-50 rounded border border-gray-100">
                        <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-gray-700 text-xs">{document}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 justify-end bg-gray-50 rounded-lg p-3">
                <Button
                  onClick={() => handleSoumettreProjet(selectedProgramme)}
                  disabled={!isProgrammeActif(selectedProgramme.dateFin)}
                  size="sm"
                  className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white text-xs h-8 px-4 font-medium shadow-sm"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Soumettre un projet
                </Button>
                <Button
                  onClick={handleCloseDetailsModal}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-white text-xs h-8 px-4 font-medium border-gray-300"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}

          {/* Détails des appels à projets */}
          {selectedAppel && (
            <div className="space-y-4 pt-2">
              {/* En-tête avec informations principales */}
              <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 rounded-lg p-4 border border-uh2c-blue/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Building className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organisme</p>
                      <p className="text-xs font-semibold text-gray-900">{selectedAppel.organisme}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Calendar className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date limite</p>
                      <p className="text-xs font-semibold text-gray-900">
                        {new Date(selectedAppel.dateLimite).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Projets attendus</p>
                      <p className="text-xs font-semibold text-gray-900">{selectedAppel.nombreProjetsAttendus} projets</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Target className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</p>
                      <Badge 
                        className={
                          selectedAppel.statut === "ouvert" 
                            ? "bg-green-100 text-green-800 border-green-200 text-xs px-1.5 py-0.5 font-medium"
                            : selectedAppel.statut === "en_evaluation"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200 text-xs px-1.5 py-0.5 font-medium"
                            : "bg-gray-100 text-gray-600 border-gray-200 text-xs px-1.5 py-0.5 font-medium"
                        }
                      >
                        {selectedAppel.statut === "ouvert" ? "Ouvert" : 
                         selectedAppel.statut === "en_evaluation" ? "En évaluation" : "Fermé"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations principales regroupées */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Programme et Description */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-3 w-3 text-uh2c-blue" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Programme associé</h3>
                    </div>
                    <p className="text-gray-700 font-medium bg-gray-50 rounded-lg p-2 border border-gray-100 text-xs">{selectedAppel.programme}</p>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-3 w-3 text-uh2c-blue" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Description</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-xs bg-gray-50 rounded-lg p-2">{selectedAppel.description}</p>
                  </div>

                  {/* Budget */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-3 w-3 text-gray-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Budget disponible</h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <p className="text-base font-bold text-gray-700">{selectedAppel.budget.toLocaleString()} MAD</p>
                      <p className="text-xs text-gray-600 mt-1">Budget maximum par projet</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critères et Documents regroupés */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Critères d'éligibilité */}
                  {selectedAppel.criteres && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-gray-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Critères d'éligibilité</h3>
                      </div>
                      <div className="space-y-1">
                        {selectedAppel.criteres.map((critere, index) => (
                          <div key={index} className="flex items-start gap-2 p-1.5 bg-gray-50 rounded border border-gray-100">
                            <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-gray-700 text-xs">{critere}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents requis */}
                  {selectedAppel.documents && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-3 w-3 text-gray-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">Documents requis</h3>
                      </div>
                      <div className="space-y-1">
                        {selectedAppel.documents.map((document, index) => (
                          <div key={index} className="flex items-start gap-2 p-1.5 bg-gray-50 rounded border border-gray-100">
                            <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-gray-700 text-xs">{document}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 justify-end bg-gray-50 rounded-lg p-3">
                <Button
                  onClick={() => handleSoumettreAppel(selectedAppel)}
                  disabled={selectedAppel.statut !== "ouvert"}
                  size="sm"
                  className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white text-xs h-8 px-4 font-medium shadow-sm"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Soumettre un projet
                </Button>
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  variant="outline"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-white text-xs h-8 px-4 font-medium border-gray-300"
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
            <DialogTitle className="sr-only">Soumettre un projet</DialogTitle>
          </DialogHeader>
          
          {/* En-tête adapté selon l'onglet actif */}
          <div className="mb-6">
            {activeTab === "appels" ? (
              // Style pour Appels à projets
              <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-4 shadow-sm">
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-uh2c-blue" />
                    <span className="text-lg font-bold text-uh2c-blue">
                      Soumettre un projet - Appel à projets
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    <p className="font-medium mb-2 text-uh2c-blue">
                      {selectedAppel?.titre}
                    </p>
                    <p className="text-xs">
                      Remplissez tous les champs obligatoires (*) pour votre projet. Respectez la date limite et le budget disponible.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Style pour Programmes
              <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-4 shadow-sm">
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-uh2c-blue" />
                    <span className="text-lg font-bold text-uh2c-blue">
                      Soumettre un projet - Programme
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    <p className="font-medium mb-2 text-uh2c-blue">
                      {selectedProgramme?.name}
                    </p>
                    <p className="text-xs">
                      Remplissez tous les champs obligatoires (*) pour votre projet. Assurez-vous que toutes les informations sont exactes et complètes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {(selectedProgramme || selectedAppel) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Informations adaptées selon l'onglet actif */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {activeTab === "appels" ? "Informations de l'appel à projets" : "Informations du programme"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeTab === "appels" ? (
                    // Contenu pour Appels à projets
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Appel à projets</Label>
                          <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                            <p className="font-medium text-gray-900">
                              {selectedAppel?.titre}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-gray-600">Typologie</Label>
                          <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                            <p className="text-gray-900">Appel à projets</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-600">Programme associé</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                          <p className="font-medium text-gray-900">
                            {selectedAppel?.programme}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-600">Description de l'appel</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                          <p className="text-gray-900">
                            {selectedAppel?.description}
                          </p>
                        </div>
                      </div>

                      {selectedAppel && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Budget disponible</Label>
                            <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                              <p className="font-medium text-gray-900">{selectedAppel.budget.toLocaleString()} MAD</p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Date limite</Label>
                            <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                              <p className="font-medium text-gray-900">
                                {new Date(selectedAppel.dateLimite).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Contenu pour Programmes
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs font-medium text-gray-600">Programme</Label>
                          <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                            <p className="font-medium text-gray-900">
                              {selectedProgramme?.name}
                            </p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs font-medium text-gray-600">Typologie</Label>
                          <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                            <p className="text-gray-900">Projet de recherche financé</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-600">Organisme</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                          <p className="font-medium text-gray-900">
                            {selectedProgramme?.organisme}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs font-medium text-gray-600">Descriptif du programme</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                          <p className="text-gray-900">
                            {selectedProgramme?.description}
                          </p>
                        </div>
                      </div>

                      {selectedProgramme && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Budget total</Label>
                            <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                              <p className="font-medium text-gray-900">{selectedProgramme.budget.toLocaleString()} MAD</p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Nombre de projets</Label>
                            <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">
                              <p className="font-medium text-gray-900">
                                {selectedProgramme.nombreProjets} projets
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
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
                          {organismesPartenaires.map((organisme, index) => {
                            const isEnValidation = organismesEnValidation.includes(organisme)
                            return (
                              <span key={index} className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                                isEnValidation 
                                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                                  : 'bg-uh2c-blue text-white'
                              }`}>
                                {organisme}
                                {isEnValidation && (
                                  <Clock className="h-3 w-3 ml-1 text-yellow-600" />
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOrganisme(index)}
                                  className={`ml-2 hover:text-red-200 ${
                                    isEnValidation ? 'text-yellow-700 hover:text-red-600' : 'text-white'
                                  }`}
                                >
                                  ×
                                </button>
                              </span>
                            )
                          })}
                        </div>
                        {organismesEnValidation.length > 0 && (
                          <p className="text-xs text-yellow-700 mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {organismesEnValidation.length} organisme(s) en attente de validation par la Division
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Interface pour ajouter un organisme */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border">
                      {/* Mode d'ajout */}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={modeAjoutOrganisme === "existant" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setModeAjoutOrganisme("existant")}
                          className="text-xs"
                        >
                          Organisme existant
                        </Button>
                        <Button
                          type="button"
                          variant={modeAjoutOrganisme === "nouveau" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setModeAjoutOrganisme("nouveau")}
                          className="text-xs"
                        >
                          Autre organisme
                        </Button>
                      </div>

                      {modeAjoutOrganisme === "existant" ? (
                        /* Mode organisme existant */
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs font-medium text-gray-700">Type d'organisme</Label>
                              <Select value={typeOrganisme} onValueChange={(value: "national" | "international") => setTypeOrganisme(value)}>
                                <SelectTrigger className="mt-1 h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="national">National</SelectItem>
                                  <SelectItem value="international">International</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs font-medium text-gray-700">Sélectionner un organisme</Label>
                              <Select value={organismeExistant} onValueChange={setOrganismeExistant}>
                                <SelectTrigger className="mt-1 h-9 text-sm">
                                  <SelectValue placeholder="Choisir un organisme..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                  {organismesPartenairesExistants[typeOrganisme].map((organisme) => (
                                    <SelectItem key={organisme} value={organisme}>
                                      {organisme}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {typeOrganisme === "international" && (
                            <div>
                              <Label className="text-xs font-medium text-gray-700">Pays</Label>
                              <Select value={paysOrganisme} onValueChange={setPaysOrganisme}>
                                <SelectTrigger className="mt-1 h-9 text-sm">
                                  <SelectValue placeholder="Sélectionnez un pays" />
                                </SelectTrigger>
                                <SelectContent>
                                  {pays.map((pays) => (
                                    <SelectItem key={pays} value={pays}>
                                      {pays}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="flex justify-center">
                          <Button
                            type="button"
                            onClick={handleAddOrganismeExistant}
                            disabled={!organismeExistant || (typeOrganisme === "international" && !paysOrganisme)}
                              className="h-9 px-6 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter l'organisme
                          </Button>
                          </div>
                        </div>
                      ) : (
                        /* Mode nouvel organisme */
                        <div className="space-y-3">
                          {/* Message de validation */}
                          <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium text-yellow-900 mb-1 text-sm">Validation requise</h4>
                                <p className="text-xs text-yellow-800">
                                  La création de ce nouvel organisme sera soumise à validation par la Division de la Recherche. 
                                  Vous recevrez une notification une fois la validation effectuée.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs font-medium text-gray-700">Type d'organisme</Label>
                              <Select value={typeOrganisme} onValueChange={(value: "national" | "international") => setTypeOrganisme(value)}>
                                <SelectTrigger className="mt-1 h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="national">National</SelectItem>
                                  <SelectItem value="international">International</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {typeOrganisme === "international" && (
                              <div>
                                <Label className="text-xs font-medium text-gray-700">Pays</Label>
                                <Select value={paysOrganisme} onValueChange={setPaysOrganisme}>
                                  <SelectTrigger className="mt-1 h-9 text-sm">
                                    <SelectValue placeholder="Sélectionnez un pays" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {pays.map((pays) => (
                                      <SelectItem key={pays} value={pays}>
                                        {pays}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Input
                              id="organismesPartenaires"
                              placeholder={typeOrganisme === "national" ? "Ex: CHU Hassan II" : "Ex: MIT, CNRS, etc."}
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
                              disabled={!nouvelOrganisme.trim() || (typeOrganisme === "international" && !paysOrganisme)}
                              className="h-9 px-3 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {formErrors.organismesPartenaires && (
                      <p className="text-red-500 text-xs mt-1">Au moins un organisme partenaire est obligatoire</p>
                    )}
                  </div>
                </CardContent>
              </Card>

                            {/* Membres du projet */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Membres du projet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500 mb-4">
                    Sélectionnez les membres impliqués dans cette soumission
                  </p>
                  
                  <div className="space-y-4">
                    {/* 1. Membres permanents */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Membres permanents</Label>
                      <div className="space-y-3">
                          <div>
                          <Label className="text-xs font-medium text-gray-600">Sélectionner un membre permanent</Label>
                          <Select value={selectedMembrePermanent} onValueChange={handleSelectMembrePermanent}>
                            <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg">
                              <SelectValue placeholder="Choisir un membre permanent..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {(() => {
                                // Organiser les membres par établissement et laboratoire
                                const membresParEtablissement = membresPermanentsDisponibles.reduce((acc, membre) => {
                                  if (!acc[membre.etablissement]) {
                                    acc[membre.etablissement] = {}
                                  }
                                  if (!acc[membre.etablissement][membre.laboratoire]) {
                                    acc[membre.etablissement][membre.laboratoire] = []
                                  }
                                  acc[membre.etablissement][membre.laboratoire].push(membre)
                                  return acc
                                }, {} as Record<string, Record<string, typeof membresPermanentsDisponibles>>)

                                return Object.entries(membresParEtablissement).map(([etablissement, laboratoires]) => (
                                  <div key={etablissement}>
                                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-100 border-b">
                                      {etablissement}
                            </div>
                                    {Object.entries(laboratoires).map(([laboratoire, membres]) => (
                                      <div key={laboratoire}>
                                        <div className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50">
                                          {laboratoire}
                          </div>
                                        {membres.map((membre) => (
                                          <SelectItem key={membre.id} value={membre.id} className="py-2 pl-6">
                                            <div className="flex flex-col">
                                              <span className="font-medium text-gray-900">{membre.nom}</span>
                                              <span className="text-xs text-gray-500">{membre.laboratoire}</span>
                        </div>
                                          </SelectItem>
                                        ))}
                        </div>
                                    ))}
                                  </div>
                                ))
                              })()}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Membres permanents ajoutés */}
                      {membresPermanents.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1.5">
                            {membresPermanents.map((membre, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-600 text-white">
                                {membre.nom} (Labo: {membre.laboratoire})
                                  <button
                                    type="button"
                                  onClick={() => handleRemoveMembrePermanent(index)}
                                    className="ml-1.5 text-white hover:text-red-200"
                                  >
                                    ×
                                  </button>
                                </span>
                            ))}
                          </div>
                        </div>
                      )}
                          </div>
                          
                    {/* 2. Docteurs */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Docteurs</Label>
                      <Select onValueChange={(value) => handleDocteurSelect(value)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Sélectionner un docteur parmi les membres permanents..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {membresPermanents.map((member, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              <div className="flex flex-col py-1">
                                <span className="font-medium text-sm">{member.nom}</span>
                                <span className="text-xs text-gray-500">Labo: {member.laboratoire} | {member.etablissement}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {/* Docteurs sélectionnés */}
                      {docteurs.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1.5">
                            {docteurs.map((memberIndex) => {
                              const member = membresPermanents[memberIndex]
                              return member ? (
                                <span key={memberIndex} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-blue-600 text-white">
                                  Dr. {member.nom}
                                  <button
                                    type="button"
                                    onClick={() => handleDocteurSelect(memberIndex.toString())}
                                    className="ml-1.5 text-white hover:text-red-200"
                                  >
                                    ×
                                  </button>
                                </span>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Membres associés */}
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">Membres associés</Label>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Nom</Label>
                            <Input
                              placeholder="Nom du membre associé"
                              value={nouveauMembreAssocie.nom}
                              onChange={(e) => handleMembreAssocieInputChange("nom", e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Prénom</Label>
                            <Input
                              placeholder="Prénom du membre associé"
                              value={nouveauMembreAssocie.prenom}
                              onChange={(e) => handleMembreAssocieInputChange("prenom", e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Pays</Label>
                            <Select value={nouveauMembreAssocie.pays} onValueChange={(value) => handleMembreAssocieInputChange("pays", value)}>
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Sélectionner un pays" />
                              </SelectTrigger>
                              <SelectContent>
                                {pays.map((pays) => (
                                  <SelectItem key={pays} value={pays}>
                                    {pays}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-gray-600">Établissement d'appartenance</Label>
                            <Input
                              placeholder="Nom de l'établissement"
                              value={nouveauMembreAssocie.etablissement}
                              onChange={(e) => handleMembreAssocieInputChange("etablissement", e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                        <Button
                          type="button"
                          onClick={handleAddMembreAssocie}
                          disabled={!nouveauMembreAssocie.nom.trim() || !nouveauMembreAssocie.prenom.trim() || !nouveauMembreAssocie.pays || !nouveauMembreAssocie.etablissement.trim()}
                            className="h-9 px-6 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter le membre associé
                        </Button>
                        </div>
                      </div>

                      {/* Membres associés ajoutés */}
                      {membresAssocies.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1.5">
                            {membresAssocies.map((membre, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-purple-600 text-white">
                                {membre.nom} {membre.prenom} ({membre.pays})
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMembreAssocie(index)}
                                  className="ml-1.5 text-white hover:text-red-200"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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

              {/* Documents */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Documents du projet<span className="text-red-500">*</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  {/* Interface pour ajouter des documents */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Ajouter un document</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className={nouveauDocument.type === "Autres" ? "col-span-2" : ""}>
                        <Label className="text-xs font-medium text-gray-600">Type de document</Label>
                        <Select value={nouveauDocument.type} onValueChange={(value) => handleDocumentInputChange("type", value)}>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Sélectionnez un type de document" />
                          </SelectTrigger>
                          <SelectContent>
                            {typesDocuments.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {nouveauDocument.type === "Autres" && (
                        <div className="col-span-2">
                          <Label className="text-xs font-medium text-gray-600">Nom du document</Label>
                          <Input
                            placeholder="Ex: Document principal, Annexe 1, etc."
                            value={nouveauDocument.nom}
                            onChange={(e) => handleDocumentInputChange("nom", e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Fichier</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={handleAddDocument}
                          disabled={
                            (nouveauDocument.type === "Autres" && !nouveauDocument.nom.trim()) || 
                            !nouveauDocument.type || 
                            !nouveauDocument.fichier
                          }
                          className="h-9 px-4 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajouter
                        </Button>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleDocumentFileChange}
                          className="hidden"
                          id="document-file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('document-file-upload')?.click()}
                          className="h-9 text-sm flex-1"
                        >
                          {nouveauDocument.fichier ? nouveauDocument.fichier.name : "Sélectionner un fichier"}
                        </Button>
                      </div>
                    </div>
                    

                  </div>

                  {/* Liste des documents ajoutés */}
                  {documents.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Documents ajoutés</Label>
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-gray-600" />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                                <span className="text-xs text-gray-500">{doc.type}</span>
                                <span className="text-xs text-gray-400">({doc.file.name})</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveDocument(doc.id)}
                              className="h6 w-6 p-0 text-gray-600 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {documents.length === 0 && (
                    <div className="text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      Aucun document ajouté
                    </div>
                  )}

                  {formErrors.document && documents.length === 0 && (
                    <p className="text-red-500 text-xs">Au moins un document est obligatoire</p>
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogTitle className="sr-only">Créer un nouveau programme</DialogTitle>
          
          {/* En-tête unifié avec style popup */}
          <div className="mb-6">
            {/* En-tête principal */}
            <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-uh2c-blue rounded-lg flex items-center justify-center">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-1">
                    Créer un nouveau programme
                  </h2>
                  <p className="text-xs text-gray-600">
                    Remplissez les informations du programme pour créer un nouveau programme de recherche
                  </p>
                </div>
              </div>
            </div>
          </div>
          
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

                <div>
                  <Label className={`text-sm font-medium ${newProgramErrors.sourcesFinancement ? 'text-red-600' : 'text-gray-700'}`}>
                    Sources de financement
                  </Label>
                  <p className="text-xs text-gray-500 mt-1 mb-3">Sélectionnez une ou plusieurs sources de financement (optionnel)</p>
                  
                  {/* Toutes les sources sélectionnées sur la même ligne */}
                  {(newProgramData.sourcesFinancement.length > 0 || newProgramData.autresSourcesFinancement.length > 0) && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {/* Sources prédéfinies */}
                        {newProgramData.sourcesFinancement.map((source, index) => (
                          <span key={`predef-${index}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-uh2c-blue text-white">
                            {source}
                            <button
                              type="button"
                              onClick={() => handleRemoveSourceFinancement(source)}
                              className="ml-2 hover:text-red-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                        {/* Sources personnalisées */}
                        {newProgramData.autresSourcesFinancement.map((source, index) => (
                          <span key={`custom-${index}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-uh2c-blue text-white">
                            {source}
                            <button
                              type="button"
                              onClick={() => handleRemoveAutreSourceFinancement(source)}
                              className="ml-2 hover:text-red-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Liste déroulante des sources disponibles */}
                  <div className="relative">
                    <Select 
                      onValueChange={(value) => {
                        if (value && !newProgramData.sourcesFinancement.includes(value)) {
                          handleSourceFinancementToggle(value)
                        }
                      }}
                    >
                      <SelectTrigger className={`mt-1 h-10 text-sm ${newProgramErrors.sourcesFinancement ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                        <SelectValue placeholder="Sélectionnez des sources de financement" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {sourcesFinancement.map((source) => (
                          <SelectItem 
                            key={source} 
                            value={source}
                            className={newProgramData.sourcesFinancement.includes(source) ? "bg-blue-50 text-blue-700" : ""}
                          >
                            <div className="flex items-center gap-2">
                              {newProgramData.sourcesFinancement.includes(source) && (
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              )}
                              {source}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newProgramErrors.sourcesFinancement && (
                    <p className="text-red-500 text-xs mt-1">Veuillez sélectionner au moins une source de financement</p>
                  )}
                </div>

                {/* Champ pour source "Autre" si sélectionnée */}
                {newProgramData.sourcesFinancement.includes("Autre") && (
                  <div>
                    <Label htmlFor="programmeAutreSourceFinancement" className="text-sm font-medium text-gray-700">
                      Précisez la source de financement
                    </Label>
                    
                    {/* Champ de saisie avec bouton d'ajout */}
                    <div className="flex gap-2">
                      <Input
                        id="programmeAutreSourceFinancement"
                        placeholder="Ex: Fondation privée, Organisation internationale..."
                        value={newProgramData.autreSourceFinancement}
                        onChange={(e) => handleNewProgramInputChange("autreSourceFinancement", e.target.value)}
                        className="flex-1 h-10 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newProgramData.autreSourceFinancement.trim()) {
                            e.preventDefault()
                            handleAddAutreSourceFinancement()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddAutreSourceFinancement}
                        disabled={!newProgramData.autreSourceFinancement.trim()}
                        className="h-10 px-3 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
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
                Votre demande de création du programme <strong>"{createdProgramName}"</strong> avec {newProgramData.sourcesFinancement.length + newProgramData.autresSourcesFinancement.length} source(s) de financement a été enregistrée. Le pôle de recherche vous contactera pour traiter votre demande.
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

      {/* Modal pour créer un nouvel appel à projets */}
      <Dialog open={showNewAppelForm} onOpenChange={setShowNewAppelForm}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogTitle className="sr-only">Créer un nouvel appel à projets</DialogTitle>
          
          {/* En-tête unifié avec style popup */}
          <div className="mb-6">
            {/* En-tête principal */}
            <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-uh2c-blue rounded-lg flex items-center justify-center">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-1">
                    Créer un Appel à Projets
                  </h2>
                  <p className="text-xs text-gray-600">
                    Définissez les paramètres de votre appel à projets
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleCreateNewAppel} className="space-y-6 border border-gray-200 rounded-lg p-6 bg-white">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appelTitre" className={`text-sm font-medium ${newAppelErrors.titre ? 'text-red-600' : 'text-gray-700'}`}>
                  Titre de l'appel à projets <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appelTitre"
                  placeholder="Ex: Appel à projets - IA pour la santé"
                  value={newAppelData.titre}
                  onChange={(e) => handleNewAppelInputChange("titre", e.target.value)}
                  className={`mt-1 h-10 text-sm ${newAppelErrors.titre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {newAppelErrors.titre && (
                  <p className="text-red-500 text-xs mt-1">Le titre est obligatoire</p>
                )}
              </div>

              <div>
                <Label htmlFor="appelProgramme" className={`text-sm font-medium ${newAppelErrors.programme ? 'text-red-600' : 'text-gray-700'}`}>
                  Programme associé <span className="text-red-500">*</span>
                </Label>
                <Select value={newAppelData.programme} onValueChange={(value) => handleNewAppelInputChange("programme", value)}>
                  <SelectTrigger className={`mt-1 h-10 text-sm ${newAppelErrors.programme ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                    <SelectValue placeholder="Sélectionnez un programme" />
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
                  <p className="text-red-500 text-xs mt-1">Le programme est obligatoire</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appelOrganisme" className={`text-sm font-medium ${newAppelErrors.organisme ? 'text-red-600' : 'text-gray-700'}`}>
                  Organisme contractant <span className="text-red-500">*</span>
                </Label>
                <Select value={newAppelData.organisme} onValueChange={(value) => handleNewAppelInputChange("organisme", value)}>
                  <SelectTrigger className={`mt-1 h-10 text-sm ${newAppelErrors.organisme ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                    <SelectValue placeholder="Sélectionnez un organisme" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueOrganismes.map((organisme: string) => (
                      <SelectItem key={organisme} value={organisme}>
                        {organisme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newAppelErrors.organisme && (
                  <p className="text-red-500 text-xs mt-1">L'organisme est obligatoire</p>
                )}
              </div>

              <div>
                <Label htmlFor="appelStatut" className="text-sm font-medium text-gray-700">
                  Statut
                </Label>
                <Select value={newAppelData.statut} onValueChange={(value) => handleNewAppelInputChange("statut", value)}>
                  <SelectTrigger className="mt-1 h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ouvert">Ouvert</SelectItem>
                    <SelectItem value="ferme">Fermé</SelectItem>
                    <SelectItem value="en_evaluation">En évaluation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appelDateOuverture" className={`text-sm font-medium ${newAppelErrors.dateOuverture ? 'text-red-600' : 'text-gray-700'}`}>
                  Date d'ouverture <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appelDateOuverture"
                  type="date"
                  value={newAppelData.dateOuverture}
                  onChange={(e) => handleNewAppelInputChange("dateOuverture", e.target.value)}
                  className={`mt-1 h-10 text-sm ${newAppelErrors.dateOuverture ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {newAppelErrors.dateOuverture && (
                  <p className="text-red-500 text-xs mt-1">La date d'ouverture est obligatoire</p>
                )}
              </div>

              <div>
                <Label htmlFor="appelDateLimite" className={`text-sm font-medium ${newAppelErrors.dateLimite ? 'text-red-600' : 'text-gray-700'}`}>
                  Date limite <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appelDateLimite"
                  type="date"
                  value={newAppelData.dateLimite}
                  onChange={(e) => handleNewAppelInputChange("dateLimite", e.target.value)}
                  className={`mt-1 h-10 text-sm ${newAppelErrors.dateLimite ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {newAppelErrors.dateLimite && (
                  <p className="text-red-500 text-xs mt-1">La date limite est obligatoire</p>
                )}
              </div>
            </div>

            {/* Budget et nombre de projets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appelBudget" className={`text-sm font-medium ${newAppelErrors.budget ? 'text-red-600' : 'text-gray-700'}`}>
                  Budget total (MAD) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appelBudget"
                  type="number"
                  placeholder="0"
                  value={newAppelData.budget}
                  onChange={(e) => handleNewAppelInputChange("budget", e.target.value)}
                  className={`mt-1 h-10 text-sm ${newAppelErrors.budget ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {newAppelErrors.budget && (
                  <p className="text-red-500 text-xs mt-1">Le budget doit être supérieur à 0</p>
                )}
              </div>

              <div>
                <Label htmlFor="appelNombreProjets" className={`text-sm font-medium ${newAppelErrors.nombreProjetsAttendus ? 'text-red-600' : 'text-gray-700'}`}>
                  Nombre de projets attendus <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="appelNombreProjets"
                  type="number"
                  placeholder="0"
                  value={newAppelData.nombreProjetsAttendus}
                  onChange={(e) => handleNewAppelInputChange("nombreProjetsAttendus", e.target.value)}
                  className={`mt-1 h-10 text-sm ${newAppelErrors.nombreProjetsAttendus ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {newAppelErrors.nombreProjetsAttendus && (
                  <p className="text-red-500 text-xs mt-1">Le nombre de projets doit être supérieur à 0</p>
                )}
              </div>
            </div>

            {/* Sources de financement */}
            <div>
              <Label className={`text-sm font-medium ${newAppelErrors.sourcesFinancement ? 'text-red-600' : 'text-gray-700'}`}>
                Sources de financement
              </Label>
              <p className="text-xs text-gray-500 mt-1 mb-3">Sélectionnez une ou plusieurs sources de financement (optionnel)</p>
              
              {/* Toutes les sources sélectionnées sur la même ligne */}
              {(newAppelData.sourcesFinancement.length > 0 || newAppelData.autresSourcesFinancement.length > 0) && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {/* Sources prédéfinies */}
                    {newAppelData.sourcesFinancement.map((source, index) => (
                      <span key={`predef-${index}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-uh2c-blue text-white">
                        {source}
                        <button
                          type="button"
                          onClick={() => handleRemoveAppelSourceFinancement(source)}
                          className="ml-2 hover:text-red-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {/* Sources personnalisées */}
                    {newAppelData.autresSourcesFinancement.map((source, index) => (
                      <span key={`custom-${index}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-uh2c-blue text-white">
                        {source}
                        <button
                          type="button"
                          onClick={() => handleRemoveAppelAutreSourceFinancement(source)}
                          className="ml-2 hover:text-red-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Liste déroulante des sources disponibles */}
              <div className="relative">
                <Select 
                  onValueChange={(value) => {
                    if (value && !newAppelData.sourcesFinancement.includes(value)) {
                      handleAppelSourceFinancementToggle(value)
                    }
                  }}
                >
                  <SelectTrigger className={`mt-1 h-10 text-sm ${newAppelErrors.sourcesFinancement ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}>
                    <SelectValue placeholder="Sélectionnez des sources de financement" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {sourcesFinancement.map((source) => (
                      <SelectItem 
                        key={source} 
                        value={source}
                        className={newAppelData.sourcesFinancement.includes(source) ? "bg-blue-50 text-blue-700" : ""}
                      >
                        <div className="flex items-center gap-2">
                          {newAppelData.sourcesFinancement.includes(source) && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                          {source}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {newAppelErrors.sourcesFinancement && (
                <p className="text-red-500 text-xs mt-1">Veuillez sélectionner au moins une source de financement</p>
              )}
            </div>

            {/* Champ pour source "Autre" si sélectionnée */}
            {newAppelData.sourcesFinancement.includes("Autre") && (
              <div>
                <Label htmlFor="appelAutreSourceFinancement" className="text-sm font-medium text-gray-700">
                  Précisez la source de financement
                </Label>
                
                {/* Champ de saisie avec bouton d'ajout */}
                <div className="flex gap-2">
                  <Input
                    id="appelAutreSourceFinancement"
                    placeholder="Ex: Fondation privée, Organisation internationale..."
                    value={newAppelData.autreSourceFinancement}
                    onChange={(e) => handleNewAppelInputChange("autreSourceFinancement", e.target.value)}
                    className="flex-1 h-10 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newAppelData.autreSourceFinancement.trim()) {
                        e.preventDefault()
                        handleAddAppelAutreSourceFinancement()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddAppelAutreSourceFinancement}
                    disabled={!newAppelData.autreSourceFinancement.trim()}
                    className="h-10 px-3 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <Label htmlFor="appelDescription" className={`text-sm font-medium ${newAppelErrors.description ? 'text-red-600' : 'text-gray-700'}`}>
                Description <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="appelDescription"
                placeholder="Description détaillée de l'appel à projets..."
                value={newAppelData.description}
                onChange={(e) => handleNewAppelInputChange("description", e.target.value)}
                className={`mt-1 w-full h-24 px-3 py-2 text-sm border rounded-md resize-none ${newAppelErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
              {newAppelErrors.description && (
                <p className="text-red-500 text-xs mt-1">La description est obligatoire</p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewAppelForm(false)}
                className="flex-1 h-10 text-sm"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-uh2c-blue hover:bg-uh2c-blue/90 text-white h-10 text-sm"
              >
                Créer l'appel à projets
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Message de succès pour la création d'appel à projets */}
      <Dialog open={showAppelCreatedMessage} onOpenChange={setShowAppelCreatedMessage}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Appel à projets créé avec succès
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              L'appel à projets <strong>"{createdAppelName}"</strong> a été créé avec succès.
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowAppelCreatedMessage(false)}
              className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}