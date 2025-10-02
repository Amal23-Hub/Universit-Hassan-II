"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { Checkbox } from "@/components/ui/checkbox"

import { Search, Filter, Eye, CheckCircle, XCircle, AlertTriangle, FileText, Users, Calendar, DollarSign } from "lucide-react"
import Image from "next/image"

interface ProjetRetenu {
  id: string
  programme: string
  projet: string
  thematique: string
  nomCoordonnateur: string
  prenomCoordonnateur: string
  etablissement: string
  laboratoire: string
  enseignantChercheur: string
  budgetPropose: number
  statutRetenu: "Retenu" | "Non retenu" | null
  dateReception: string
  sourceReception: "email" | "courrier"
  // Informations supplémentaires du formulaire
  typologie?: string
  descriptifProgramme?: string
  organismesPartenaires?: string[]
  membresAssocies?: Array<{
    id: string
    nom: string
    prenom: string
    titre: string
    qualite: string
    affiliation: string
  }>
  anneeDebut?: string
  anneeFin?: string
  document?: string
}

export default function ProjetsRetenus() {
  const [projets, setProjets] = useState<ProjetRetenu[]>([
    {
      id: "PR000",
      programme: "Programme de Recherche en Santé Numérique",
      projet: "IA pour diagnostic médical",
      thematique: "Santé Numérique",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      laboratoire: "Laboratoire de Physique des Matériaux et d'Électronique",
      enseignantChercheur: "Dr. Ahmed BENALI",
      budgetPropose: 500000,
      statutRetenu: null,
      dateReception: "2024-02-15",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Innovation technologique dans le domaine de la santé et de la télémédecine",
      organismesPartenaires: ["CHU Hassan II", "Ministère de la Santé"],
      membresAssocies: [
        {
          id: "0",
          nom: "Benali",
          prenom: "Ahmed",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Hassan II"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_sante_numerique_ia.pdf"
    },
    {
      id: "PR001",
      programme: "Programme National de Recherche en IA",
      projet: "Développement d'algorithmes d'IA pour l'éducation",
      thematique: "Intelligence Artificielle",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      laboratoire: "Laboratoire de Bioinformatique et de Génomique",
      enseignantChercheur: "Dr. Ahmed BENALI",
      budgetPropose: 500000,
      statutRetenu: "Non retenu",
      dateReception: "2024-01-15",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Programme de recherche en intelligence artificielle pour le développement de solutions innovantes",
      organismesPartenaires: ["CHU Hassan II", "Ministère de l'Éducation"],
      membresAssocies: [
        {
          id: "1",
          nom: "Benali",
          prenom: "Ahmed",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Hassan II"
        },
        {
          id: "2",
          nom: "Zahra",
          prenom: "Fatima",
          titre: "Dr.",
          qualite: "Membre associé",
          affiliation: "ENSA Casablanca"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_ia_education.pdf"
    },
    {
      id: "PR002",
      programme: "Programme de Recherche en Cybersécurité",
      projet: "Protection des infrastructures critiques",
      thematique: "Cybersécurité",
      nomCoordonnateur: "Zahra",
      prenomCoordonnateur: "Fatima",
      etablissement: "ENSA Casablanca",
      laboratoire: "Laboratoire de Systèmes Intelligents",
      enseignantChercheur: "Dr. Fatima ZAHRA",
      budgetPropose: 1200000,
      statutRetenu: "Retenu",
      dateReception: "2024-01-20",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement de solutions de cybersécurité pour protéger les infrastructures critiques",
      organismesPartenaires: ["Agence Nationale de Sécurité", "Ministère de l'Intérieur"],
      membresAssocies: [
        {
          id: "3",
          nom: "Zahra",
          prenom: "Fatima",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "ENSA Casablanca"
        },
        {
          id: "4",
          nom: "El Harti",
          prenom: "Sara",
          titre: "Dr.",
          qualite: "Chercheur",
          affiliation: "Université Mohammed V"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_cybersecurite.pdf"
    },
    {
      id: "PR003",
      programme: "Programme de Recherche en Santé Numérique",
      projet: "IA pour diagnostic médical",
      thematique: "Santé Numérique",
      nomCoordonnateur: "El Harti",
      prenomCoordonnateur: "Sara",
      etablissement: "CHU Hassan II",
      laboratoire: "Laboratoire de Recherche en Santé Numérique",
      enseignantChercheur: "Dr. Sara EL HARTI",
      budgetPropose: 850000,
      statutRetenu: "Non retenu",
      dateReception: "2024-01-25",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Innovation technologique dans le domaine de la santé et de la télémédecine",
      organismesPartenaires: ["CHU Hassan II", "Ministère de la Santé"],
      membresAssocies: [
        {
          id: "5",
          nom: "El Harti",
          prenom: "Sara",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "CHU Hassan II"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_sante_numerique.pdf"
    },
    {
      id: "PR004",
      programme: "Programme de Recherche en Énergies Renouvelables",
      projet: "Optimisation des panneaux solaires",
      thematique: "Énergies Renouvelables",
      nomCoordonnateur: "Lahby",
      prenomCoordonnateur: "Mohamed",
      etablissement: "Université Mohammed V",
      laboratoire: "Laboratoire d'Énergies Renouvelables et d'Efficacité Énergétique",
      enseignantChercheur: "Dr. Mohamed LAHBY",
      budgetPropose: 600000,
      statutRetenu: "Retenu",
      dateReception: "2024-01-30",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement de technologies d'énergies renouvelables et d'efficacité énergétique",
      organismesPartenaires: ["Ministère de l'Énergie", "IRESEN"],
      membresAssocies: [
        {
          id: "6",
          nom: "Lahby",
          prenom: "Mohamed",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Mohammed V"
        },
        {
          id: "7",
          nom: "Alaoui",
          prenom: "Karim",
          titre: "Pr.",
          qualite: "Expert",
          affiliation: "IRESEN"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_energies_renouvelables.pdf"
    },
    {
      id: "PR005",
      programme: "Programme de Recherche en Agriculture Intelligente",
      projet: "Agriculture de précision",
      thematique: "Agriculture Intelligente",
      nomCoordonnateur: "Alami",
      prenomCoordonnateur: "Youssef",
      etablissement: "IAV Hassan II",
      laboratoire: "Laboratoire d'Agriculture Intelligente et de Précision",
      enseignantChercheur: "Prof. Mohamed Lahby",
      budgetPropose: 450000,
      statutRetenu: "Non retenu",
      dateReception: "2024-02-05",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Intégration des technologies numériques dans l'agriculture pour améliorer la productivité",
      organismesPartenaires: ["Ministère de l'Agriculture", "IAV Hassan II"],
      membresAssocies: [
        {
          id: "8",
          nom: "Alami",
          prenom: "Youssef",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "IAV Hassan II"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_agriculture_intelligente.pdf"
    },
    {
      id: "PR006",
      programme: "Programme de Recherche en Santé Numérique",
      projet: "IA pour diagnostic médical",
      thematique: "Santé Numérique",
      nomCoordonnateur: "Benali",
      prenomCoordonnateur: "Ahmed",
      etablissement: "Université Hassan II",
      laboratoire: "Laboratoire de Physique des Matériaux et d'Électronique",
      enseignantChercheur: "Dr. Ahmed BENALI",
      budgetPropose: 500000,
      statutRetenu: null,
      dateReception: "2024-02-10",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Innovation technologique dans le domaine de la santé et de la télémédecine",
      organismesPartenaires: ["CHU Hassan II", "Ministère de la Santé"],
      membresAssocies: [
        {
          id: "9",
          nom: "Benali",
          prenom: "Ahmed",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Hassan II"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_sante_numerique_2.pdf"
    },
    {
      id: "PR007",
      programme: "Programme de Recherche en Santé Numérique",
      projet: "Télémédecine pour zones rurales",
      thematique: "Santé Numérique",
      nomCoordonnateur: "Tazi",
      prenomCoordonnateur: "Leila",
      etablissement: "Université Ibn Tofail",
      laboratoire: "Laboratoire de Télémédecine et E-santé",
      enseignantChercheur: "Dr. Leila TAZI",
      budgetPropose: 750000,
      statutRetenu: "Retenu",
      dateReception: "2024-02-12",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement de solutions de télémédecine pour améliorer l'accès aux soins dans les zones rurales",
      organismesPartenaires: ["Ministère de la Santé", "Agence de Développement Social"],
      membresAssocies: [
        {
          id: "10",
          nom: "Tazi",
          prenom: "Leila",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Ibn Tofail"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_telemedecine_rurale.pdf"
    },
    {
      id: "PR008",
      programme: "Programme National de Recherche en IA",
      projet: "IA pour la détection de fraudes",
      thematique: "Intelligence Artificielle",
      nomCoordonnateur: "Boukhari",
      prenomCoordonnateur: "Omar",
      etablissement: "Université Mohammed VI",
      laboratoire: "Laboratoire d'Intelligence Artificielle et Sécurité",
      enseignantChercheur: "Dr. Omar BOUKHARI",
      budgetPropose: 900000,
      statutRetenu: "Retenu",
      dateReception: "2024-02-15",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement d'algorithmes d'IA pour la détection et la prévention des fraudes financières",
      organismesPartenaires: ["Bank Al-Maghrib", "Autorité Marocaine du Marché des Capitaux"],
      membresAssocies: [
        {
          id: "11",
          nom: "Boukhari",
          prenom: "Omar",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Mohammed VI"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_ia_fraude.pdf"
    },
    {
      id: "PR009",
      programme: "Programme National de Recherche en IA",
      projet: "IA pour la gestion du trafic",
      thematique: "Intelligence Artificielle",
      nomCoordonnateur: "Rachidi",
      prenomCoordonnateur: "Nadia",
      etablissement: "ENSA Tanger",
      laboratoire: "Laboratoire de Systèmes Intelligents et Transport",
      enseignantChercheur: "Dr. Nadia RACHIDI",
      budgetPropose: 650000,
      statutRetenu: "Non retenu",
      dateReception: "2024-02-18",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Optimisation du trafic urbain grâce à l'intelligence artificielle",
      organismesPartenaires: ["Ministère des Transports", "Agence Urbaine de Tanger"],
      membresAssocies: [
        {
          id: "12",
          nom: "Rachidi",
          prenom: "Nadia",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "ENSA Tanger"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_ia_trafic.pdf"
    },
    {
      id: "PR010",
      programme: "Programme de Recherche en Cybersécurité",
      projet: "Sécurisation des données biométriques",
      thematique: "Cybersécurité",
      nomCoordonnateur: "El Amrani",
      prenomCoordonnateur: "Karim",
      etablissement: "Université Cadi Ayyad",
      laboratoire: "Laboratoire de Cybersécurité et Cryptographie",
      enseignantChercheur: "Dr. Karim EL AMRANI",
      budgetPropose: 1100000,
      statutRetenu: "Retenu",
      dateReception: "2024-02-20",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Protection et sécurisation des données biométriques dans les systèmes d'identification",
      organismesPartenaires: ["Direction Générale de la Sûreté Nationale", "Agence Nationale de Réglementation des Télécommunications"],
      membresAssocies: [
        {
          id: "13",
          nom: "El Amrani",
          prenom: "Karim",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Cadi Ayyad"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_cybersecurite_biometrie.pdf"
    },
    {
      id: "PR011",
      programme: "Programme de Recherche en Énergies Renouvelables",
      projet: "Stockage d'énergie par hydrogène",
      thematique: "Énergies Renouvelables",
      nomCoordonnateur: "Bennouna",
      prenomCoordonnateur: "Hassan",
      etablissement: "Université Ibn Zohr",
      laboratoire: "Laboratoire d'Énergies Renouvelables et Stockage",
      enseignantChercheur: "Dr. Hassan BENNOUNA",
      budgetPropose: 950000,
      statutRetenu: "Retenu",
      dateReception: "2024-02-22",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement de technologies de stockage d'énergie par hydrogène vert",
      organismesPartenaires: ["Ministère de l'Énergie", "Institut de Recherche en Énergie Solaire"],
      membresAssocies: [
        {
          id: "14",
          nom: "Bennouna",
          prenom: "Hassan",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Ibn Zohr"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_hydrogene_vert.pdf"
    },
    {
      id: "PR012",
      programme: "Programme de Recherche en Agriculture Intelligente",
      projet: "Drones pour surveillance agricole",
      thematique: "Agriculture Intelligente",
      nomCoordonnateur: "Moujahid",
      prenomCoordonnateur: "Amina",
      etablissement: "Université Sultan Moulay Slimane",
      laboratoire: "Laboratoire d'Agriculture de Précision et Drones",
      enseignantChercheur: "Dr. Amina MOUJAHID",
      budgetPropose: 550000,
      statutRetenu: "Non retenu",
      dateReception: "2024-02-25",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Utilisation de drones pour la surveillance et l'optimisation des cultures",
      organismesPartenaires: ["Ministère de l'Agriculture", "Office National de Sécurité Sanitaire"],
      membresAssocies: [
        {
          id: "15",
          nom: "Moujahid",
          prenom: "Amina",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Sultan Moulay Slimane"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_drones_agriculture.pdf"
    },
    {
      id: "PR013",
      programme: "Programme de Recherche en Santé Numérique",
      projet: "IA pour la prédiction des épidémies",
      thematique: "Santé Numérique",
      nomCoordonnateur: "Bouazza",
      prenomCoordonnateur: "Samira",
      etablissement: "Université Mohammed Premier",
      laboratoire: "Laboratoire d'Épidémiologie Numérique",
      enseignantChercheur: "Dr. Samira BOUAZZA",
      budgetPropose: 800000,
      statutRetenu: "Retenu",
      dateReception: "2024-02-28",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement d'algorithmes d'IA pour la prédiction et la surveillance des épidémies",
      organismesPartenaires: ["Ministère de la Santé", "Institut Pasteur du Maroc"],
      membresAssocies: [
        {
          id: "16",
          nom: "Bouazza",
          prenom: "Samira",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Mohammed Premier"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_ia_epidemies.pdf"
    },
    {
      id: "PR014",
      programme: "Programme National de Recherche en IA",
      projet: "IA pour l'optimisation énergétique",
      thematique: "Intelligence Artificielle",
      nomCoordonnateur: "El Fassi",
      prenomCoordonnateur: "Youssef",
      etablissement: "Université Abdelmalek Essaâdi",
      laboratoire: "Laboratoire d'IA et Optimisation Énergétique",
      enseignantChercheur: "Dr. Youssef EL FASSI",
      budgetPropose: 700000,
      statutRetenu: "Non retenu",
      dateReception: "2024-03-01",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Optimisation de la consommation énergétique des bâtiments grâce à l'IA",
      organismesPartenaires: ["Ministère de l'Énergie", "Agence Nationale pour le Développement des Énergies Renouvelables"],
      membresAssocies: [
        {
          id: "17",
          nom: "El Fassi",
          prenom: "Youssef",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Abdelmalek Essaâdi"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_ia_energie.pdf"
    },
    {
      id: "PR015",
      programme: "Programme de Recherche en Cybersécurité",
      projet: "Protection des réseaux IoT",
      thematique: "Cybersécurité",
      nomCoordonnateur: "Mansouri",
      prenomCoordonnateur: "Rachid",
      etablissement: "Université Ibn Tofail",
      laboratoire: "Laboratoire de Sécurité des Objets Connectés",
      enseignantChercheur: "Dr. Rachid MANSOURI",
      budgetPropose: 850000,
      statutRetenu: "Retenu",
      dateReception: "2024-03-03",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Sécurisation des réseaux d'objets connectés (IoT) dans les environnements critiques",
      organismesPartenaires: ["Agence Nationale de Réglementation des Télécommunications", "Ministère de l'Industrie"],
      membresAssocies: [
        {
          id: "18",
          nom: "Mansouri",
          prenom: "Rachid",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Ibn Tofail"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_cybersecurite_iot.pdf"
    },
    {
      id: "PR016",
      programme: "Programme de Recherche en Énergies Renouvelables",
      projet: "Éoliennes intelligentes",
      thematique: "Énergies Renouvelables",
      nomCoordonnateur: "El Ouazzani",
      prenomCoordonnateur: "Fatima",
      etablissement: "Université Hassan Premier",
      laboratoire: "Laboratoire d'Énergie Éolienne et Systèmes Intelligents",
      enseignantChercheur: "Dr. Fatima EL OUAZZANI",
      budgetPropose: 1200000,
      statutRetenu: "Retenu",
      dateReception: "2024-03-05",
      sourceReception: "courrier",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement d'éoliennes intelligentes avec optimisation automatique des performances",
      organismesPartenaires: ["Ministère de l'Énergie", "Office National de l'Électricité"],
      membresAssocies: [
        {
          id: "19",
          nom: "El Ouazzani",
          prenom: "Fatima",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Hassan Premier"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2027",
      document: "projet_eoliennes_intelligentes.pdf"
    },
    {
      id: "PR017",
      programme: "Programme de Recherche en Agriculture Intelligente",
      projet: "Capteurs pour irrigation intelligente",
      thematique: "Agriculture Intelligente",
      nomCoordonnateur: "Benjelloun",
      prenomCoordonnateur: "Khalid",
      etablissement: "Université Moulay Ismail",
      laboratoire: "Laboratoire d'Agriculture de Précision et Capteurs",
      enseignantChercheur: "Dr. Khalid BENJELLOUN",
      budgetPropose: 600000,
      statutRetenu: "Non retenu",
      dateReception: "2024-03-08",
      sourceReception: "email",
      typologie: "Projet de recherche financé",
      descriptifProgramme: "Développement de capteurs intelligents pour l'irrigation de précision",
      organismesPartenaires: ["Ministère de l'Agriculture", "Office Régional de Mise en Valeur Agricole"],
      membresAssocies: [
        {
          id: "20",
          nom: "Benjelloun",
          prenom: "Khalid",
          titre: "Dr.",
          qualite: "Membre directeur",
          affiliation: "Université Moulay Ismail"
        }
      ],
      anneeDebut: "2024",
      anneeFin: "2026",
      document: "projet_capteurs_irrigation.pdf"
    }
  ])

  const [filteredProjets, setFilteredProjets] = useState<ProjetRetenu[]>(projets.filter(projet => projet.statutRetenu === "Retenu"))
  const [searchTerm, setSearchTerm] = useState("")
  const [filterProgramme, setFilterProgramme] = useState<string>("all")
  const [filterLaboratoire, setFilterLaboratoire] = useState<string>("all")
  const [filterEnseignant, setFilterEnseignant] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [selectedProjet, setSelectedProjet] = useState<ProjetRetenu | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    projetId: string
    nouveauStatut: "Retenu" | "Non retenu"
  } | null>(null)
  
  // États pour les nouveaux modals
  const [showConventionModal, setShowConventionModal] = useState(false)
  const [showProgrammeEmploiModal, setShowProgrammeEmploiModal] = useState(false)
  const [showVersementsModal, setShowVersementsModal] = useState(false)
  const [showLivrablesModal, setShowLivrablesModal] = useState(false)

  // Appliquer les filtres automatiquement quand les projets ou les filtres changent
  useEffect(() => {
    let filtered = projets

    // Filtre principal : ne montrer que les projets retenus
    filtered = filtered.filter((projet) => projet.statutRetenu === "Retenu")

    // Filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (projet) =>
          projet.projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.nomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.prenomCoordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.thematique.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.etablissement.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.programme.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.laboratoire.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.enseignantChercheur.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par programme
    if (filterProgramme !== "all") {
      filtered = filtered.filter((projet) => projet.programme === filterProgramme)
    }

    // Filtre par statut
    if (filterSource !== "all") {
      filtered = filtered.filter((projet) => projet.sourceReception === filterSource)
    }

    // Filtre par laboratoire
    if (filterLaboratoire !== "all") {
      filtered = filtered.filter((projet) => projet.laboratoire === filterLaboratoire)
    }

    // Filtre par enseignant chercheur
    if (filterEnseignant !== "all") {
      filtered = filtered.filter((projet) => projet.enseignantChercheur === filterEnseignant)
    }

    setFilteredProjets(filtered)
  }, [projets, searchTerm, filterProgramme, filterLaboratoire, filterEnseignant, filterSource])

  const handleRetenuToggle = (projetId: string, nouveauStatut: "Retenu" | "Non retenu") => {
    // Confirmation spéciale pour le statut "Retenu"
    if (nouveauStatut === "Retenu") {
      setPendingStatusChange({ projetId, nouveauStatut })
      setShowConfirmationModal(true)
      return
    }
    
    // Pour les autres statuts, appliquer directement
    applyStatusChange(projetId, nouveauStatut)
  }

  const applyStatusChange = (projetId: string, nouveauStatut: "Retenu" | "Non retenu") => {
    const updatedProjets = projets.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          statutRetenu: nouveauStatut
        }
      }
      return projet
    })
    
    setProjets(updatedProjets)
  }

  const confirmStatusChange = () => {
    if (pendingStatusChange) {
      applyStatusChange(pendingStatusChange.projetId, pendingStatusChange.nouveauStatut)
      setShowConfirmationModal(false)
      setPendingStatusChange(null)
    }
  }

  const cancelStatusChange = () => {
    setShowConfirmationModal(false)
    setPendingStatusChange(null)
  }

  const handleVoirDetails = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowDetailsModal(true)
  }

  const handleConvention = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowConventionModal(true)
  }

  const handleProgrammeEmploi = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowProgrammeEmploiModal(true)
  }

  // Données de programme d'emploi pour l'enseignant chercheur
  const getProgrammeEmploiData = (projetId: string) => {
    // Données simulées - dans un vrai projet, cela viendrait de la base de données
    return {
      projetId,
      enseignantChercheur: "Dr. Ahmed BENALI",
      dateSaisie: "2024-07-29",
      statut: "validé",
      tranches: [
        {
          numero: 1,
          montantPrevisionnel: 168000,
          montantUtilise: 125000,
          dateVersement: "2024-02-15",
          dateFinTranche: "2024-08-15",
          statut: "terminee",
          rubriques: [
            {
              nom: "Personnel",
              budgetPrevisionnel: 67200,
              budgetUtilise: 52000,
              pourcentagePrevisionnel: 40,
              pourcentageUtilise: 31,
              description: "Salaires chercheurs et assistants",
              details: [
                { poste: "Chercheur principal", montant: 35000, heures: 120 },
                { poste: "Assistant de recherche", montant: 12000, heures: 80 },
                { poste: "Stagiaire", montant: 5000, heures: 40 }
              ]
            },
            {
              nom: "Équipements",
              budgetPrevisionnel: 50400,
              budgetUtilise: 38000,
              pourcentagePrevisionnel: 30,
              pourcentageUtilise: 22.6,
              description: "Matériel informatique et logiciels",
              details: [
                { poste: "Ordinateurs", montant: 25000, quantite: 3 },
                { poste: "Logiciels spécialisés", montant: 8000, quantite: 5 },
                { poste: "Équipements de laboratoire", montant: 5000, quantite: 2 }
              ]
            },
            {
              nom: "Fonctionnement",
              budgetPrevisionnel: 33600,
              budgetUtilise: 25000,
              pourcentagePrevisionnel: 20,
              pourcentageUtilise: 14.9,
              description: "Frais de déplacement et consommables",
              details: [
                { poste: "Déplacements", montant: 15000, voyages: 8 },
                { poste: "Consommables", montant: 7000, quantite: 50 },
                { poste: "Frais de publication", montant: 3000, articles: 3 }
              ]
            },
            {
              nom: "Autres",
              budgetPrevisionnel: 16800,
              budgetUtilise: 10000,
              pourcentagePrevisionnel: 10,
              pourcentageUtilise: 6,
              description: "Frais divers et imprévus",
              details: [
                { poste: "Frais administratifs", montant: 5000 },
                { poste: "Frais de communication", montant: 3000 },
                { poste: "Frais imprévus", montant: 2000 }
              ]
            }
          ]
        },
        {
          numero: 2,
          montantPrevisionnel: 224000,
          montantUtilise: 0,
          dateVersement: "2024-08-15",
          dateFinTranche: "2025-02-15",
          statut: "en_cours",
          rubriques: [
            {
              nom: "Personnel",
              budgetPrevisionnel: 89600,
              budgetUtilise: 0,
              pourcentagePrevisionnel: 40,
              pourcentageUtilise: 0,
              description: "Salaires chercheurs et assistants"
            },
            {
              nom: "Équipements",
              budgetPrevisionnel: 67200,
              budgetUtilise: 0,
              pourcentagePrevisionnel: 30,
              pourcentageUtilise: 0,
              description: "Matériel informatique et logiciels"
            },
            {
              nom: "Fonctionnement",
              budgetPrevisionnel: 44800,
              budgetUtilise: 0,
              pourcentagePrevisionnel: 20,
              pourcentageUtilise: 0,
              description: "Frais de déplacement et consommables"
            },
            {
              nom: "Autres",
              budgetPrevisionnel: 22400,
              budgetUtilise: 0,
              pourcentagePrevisionnel: 10,
              pourcentageUtilise: 0,
              description: "Frais divers et imprévus"
            }
          ]
        }
      ]
    }
  }

  const handleVersements = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowVersementsModal(true)
  }

  const handleLivrables = (projet: ProjetRetenu) => {
    setSelectedProjet(projet)
    setShowLivrablesModal(true)
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getUniqueProgrammes = () => {
    return [...new Set(projets.map((p) => p.programme))].sort()
  }

  const getUniqueLaboratoires = () => {
    return [...new Set(projets.map((p) => p.laboratoire))].sort()
  }

  const getUniqueEnseignants = () => {
    return [...new Set(projets.map((p) => p.enseignantChercheur))].sort()
  }

  const getStats = () => {
    const total = projets.length
    const retenus = projets.filter(p => p.statutRetenu === "Retenu").length
    const nonRetenus = projets.filter(p => p.statutRetenu === "Non retenu").length
    const nonDefinis = projets.filter(p => p.statutRetenu === null).length
    const email = projets.filter(p => p.sourceReception === "email").length
    const courrier = projets.filter(p => p.sourceReception === "courrier").length

    return { total, retenus, nonRetenus, nonDefinis, email, courrier }
  }

  const stats = getStats()

  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto">
                            <div className="mb-4">
                  <h1 className="text-xl font-bold text-gray-900">Projet de recherche retenus</h1>
                </div>

            {/* Filtres et recherche */}
            <Card className="mb-4 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Barre de recherche principale */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                      <Input
                        placeholder="Rechercher par projet, coordonnateur, thématique..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9 text-sm border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                    </div>

                {/* Filtres de base */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Programme</Label>
                    <Select
                      value={filterProgramme}
                      onValueChange={(value) => setFilterProgramme(value)}
                    >
                      <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Tous les programmes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les programmes</SelectItem>
                        {getUniqueProgrammes().map((programme) => (
                          <SelectItem key={programme} value={programme}>
                            {programme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Laboratoire</Label>
                    <Select
                      value={filterLaboratoire}
                      onValueChange={(value) => setFilterLaboratoire(value)}
                    >
                      <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Tous les laboratoires" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les laboratoires</SelectItem>
                        {getUniqueLaboratoires().map((laboratoire) => (
                          <SelectItem key={laboratoire} value={laboratoire}>
                            {laboratoire}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Enseignant chercheur</Label>
                    <Select
                      value={filterEnseignant}
                      onValueChange={(value) => setFilterEnseignant(value)}
                    >
                      <SelectTrigger className="h-8 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg text-xs">
                        <SelectValue placeholder="Tous les enseignants" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les enseignants</SelectItem>
                        {getUniqueEnseignants().map((enseignant) => (
                          <SelectItem key={enseignant} value={enseignant}>
                            {enseignant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Résultats de recherche */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-600">
                    {filteredProjets.length} projet(s) trouvé(s)
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>Filtres actifs:</span>
                    {searchTerm && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Recherche: "{searchTerm}"
                      </Badge>
                    )}
                    {filterProgramme !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Programme: {filterProgramme}
                      </Badge>
                    )}
                    {filterLaboratoire !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Laboratoire: {filterLaboratoire}
                      </Badge>
                    )}
                    {filterEnseignant !== "all" && (
                      <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                        Enseignant: {filterEnseignant}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Cards */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg className="h-5 w-5 text-uh2c-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Liste des projets de recherche classés par programme
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProjets.length === 0 ? (
                  <div className="text-center py-8">
                    <Image
                      src="/empty-state.svg"
                      alt="Empty state"
                      width={120}
                      height={120}
                      className="mx-auto mb-4 opacity-50"
                    />
                    <p className="text-gray-500">Aucun projet trouvé</p>
                    <p className="text-sm text-gray-400">Ajustez vos filtres pour voir les résultats</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Grouper les projets par programme */}
                    {(() => {
                      const projetsParProgramme = filteredProjets.reduce((acc, projet) => {
                        if (!acc[projet.programme]) {
                          acc[projet.programme] = [];
                        }
                        acc[projet.programme].push(projet);
                        return acc;
                      }, {} as Record<string, ProjetRetenu[]>);

                      return Object.entries(projetsParProgramme).map(([programme, projets]) => (
                                                 <div key={programme} className="space-y-3">
                           <div className="bg-gradient-to-r from-uh2c-blue/10 to-blue-50 rounded-lg p-1.5 border border-uh2c-blue/20">
                             <h3 className="text-xs font-medium text-uh2c-blue flex items-center gap-1.5">
                               <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                               </svg>
                               {programme}
                             </h3>
                           </div>
                                                     <div className="space-y-3">
                             {projets.map((projet) => (
                               <Card key={projet.id} className="border-l-4 border-l-uh2c-blue hover:shadow-md transition-shadow">
                                 <CardContent className="p-4">
                                   <div className="space-y-2">
                                     {/* En-tête avec programme et projet */}
                                     <div className="flex items-start justify-between">
                                       <div className="flex-1 min-w-0">
                                         <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                                           {projet.projet}
                                         </h4>
                                         <h5 className="font-medium text-gray-700 text-xs mb-1">
                                           {projet.programme}
                                         </h5>
                                         <Badge variant="secondary" className="text-xs">
                                {projet.thematique}
                              </Badge>
                                       </div>
                                       
                                       {/* Budget */}
                                       <div className="flex flex-col items-end min-w-0 flex-shrink-0 ml-3">
                                         <span className="text-xs text-gray-500">Budget proposé</span>
                                         <span className="font-semibold text-green-600 text-xs">
                                           {formatBudget(projet.budgetPropose)}
                                         </span>
                                       </div>
                                     </div>

                                     {/* Informations détaillées */}
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                       <div className="flex items-center gap-2">
                                         <Users className="h-3 w-3 text-gray-500 flex-shrink-0" />
                                         <div className="min-w-0">
                                           <span className="text-gray-500 text-xs">Coordonnateur</span>
                                           <div className="text-gray-700 font-medium text-xs">
                                             {projet.nomCoordonnateur} {projet.prenomCoordonnateur}
                                           </div>
                                         </div>
                                       </div>

                                       <div className="flex items-center gap-2">
                                         <svg className="h-3 w-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                         </svg>
                                         <div className="min-w-0">
                                           <span className="text-gray-500 text-xs">Établissement</span>
                                           <div className="text-gray-700 font-medium text-xs truncate" title={projet.etablissement}>
                                             {projet.etablissement}
                                           </div>
                                         </div>
                                       </div>

                                       <div className="flex items-center gap-2">
                                         <svg className="h-3 w-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                         </svg>
                                         <div className="min-w-0">
                                           <span className="text-gray-500 text-xs">Laboratoire</span>
                                           <div className="text-gray-700 font-medium text-xs truncate" title={projet.laboratoire}>
                                             {projet.laboratoire}
                                           </div>
                                         </div>
                                       </div>

                                       <div className="flex items-center gap-2">
                                         <svg className="h-3 w-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                         </svg>
                                         <div className="min-w-0">
                                           <span className="text-gray-500 text-xs">Enseignant chercheur</span>
                                           <div className="text-gray-700 font-medium text-xs truncate" title={projet.enseignantChercheur}>
                                             {projet.enseignantChercheur}
                                           </div>
                                         </div>
                                       </div>
                                     </div>

                                     {/* Actions */}
                                     <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-100">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleVoirDetails(projet)}
                                  className="h-6 w-6 p-0 hover:bg-uh2c-blue/10 hover:text-uh2c-blue"
                                  title="Voir les détails"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleConvention(projet)}
                                  className="h-6 w-6 p-0 hover:bg-uh2c-blue/10 hover:text-uh2c-blue"
                                  title="Convention"
                                >
                                  <FileText className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProgrammeEmploi(projet)}
                                  className="h-6 w-6 p-0 hover:bg-uh2c-blue/10 hover:text-uh2c-blue"
                                  title="Programme d'emploi"
                                >
                                  <Users className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleLivrables(projet)}
                                  className="h-6 w-6 p-0 hover:bg-uh2c-blue/10 hover:text-uh2c-blue"
                                  title="Livrables"
                                >
                                  <Calendar className="h-3 w-3" />
                                </Button>
                              </div>
                                   </div>
                                 </CardContent>
                               </Card>
                             ))}
                           </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Modal pour les détails du projet */}
      {showDetailsModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header avec couleur UH2C */}
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Détails du projet</h2>
                    <p className="text-xs text-white/80">ID: {selectedProjet.id}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                  className="h-5 w-5 p-0 text-white hover:bg-white/20 rounded"
                >
                  <XCircle className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-4">
                {/* Statut du projet - Banner en haut */}
                <div className={`rounded-lg p-3 border-l-4 ${
                  selectedProjet.statutRetenu === "Retenu"
                    ? "bg-green-50 border-green-500"
                    : selectedProjet.statutRetenu === "Non retenu"
                    ? "bg-red-50 border-red-500"
                    : "bg-yellow-50 border-yellow-500"
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedProjet.statutRetenu === "Retenu"
                        ? "bg-green-500"
                        : selectedProjet.statutRetenu === "Non retenu"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">Statut du projet</h3>
                      <p className={`text-sm font-medium ${
                        selectedProjet.statutRetenu === "Retenu"
                          ? "text-green-700"
                          : selectedProjet.statutRetenu === "Non retenu"
                          ? "text-red-700"
                          : "text-yellow-700"
                      }`}>
                        {selectedProjet.statutRetenu || "Non défini"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations du programme */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Informations du programme</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Programme</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.programme}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Typologie</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.typologie || "Projet de recherche financé"}</p>
                    </div>
                    <div className="md:col-span-3 bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Descriptif du sous programme</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.descriptifProgramme}</p>
                    </div>
                  </div>
                </div>

                {/* Informations du projet */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Informations du projet</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Intitulé du projet *</Label>
                      <p className="text-sm font-medium text-gray-900">{selectedProjet.projet}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Thématique du projet *</Label>
                      <Badge variant="secondary" className="bg-uh2c-blue/10 text-uh2c-blue border-uh2c-blue/20 text-xs">
                        {selectedProjet.thematique}
                      </Badge>
                    </div>
                    <div className="md:col-span-2 bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Organismes partenaires *</Label>
                      <div className="flex flex-wrap gap-1">
                        {selectedProjet.organismesPartenaires?.map((organisme, index) => (
                          <Badge key={index} variant="outline" className="bg-uh2c-blue/5 text-uh2c-blue border-uh2c-blue/20 text-xs">
                            {organisme}
                          </Badge>
                        )) || <span className="text-xs text-gray-500 italic">Aucun organisme partenaire spécifié</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Membres associés */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Membres associés</h3>
                  </div>
                  <div className="space-y-2">
                    {selectedProjet.membresAssocies && selectedProjet.membresAssocies.length > 0 ? (
                      selectedProjet.membresAssocies.map((membre, index) => (
                        <div key={membre.id} className="bg-white rounded p-3 border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-uh2c-blue rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-xs">
                                {membre.nom.charAt(0)}{membre.prenom.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium text-sm text-gray-900">{membre.titre} {membre.nom} {membre.prenom}</p>
                                <Badge className="bg-uh2c-blue/10 text-uh2c-blue border-uh2c-blue/20 text-xs">
                                  {membre.qualite}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600">{membre.affiliation}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded p-4 border border-gray-200 text-center">
                        <p className="text-sm text-gray-500">Aucun membre associé sélectionné</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Durée et budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Durée de projet */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Durée de projet</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Année de début *</Label>
                        <p className="text-sm font-medium text-gray-900">{selectedProjet.anneeDebut || "Non spécifiée"}</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Année de fin *</Label>
                        <p className="text-sm font-medium text-gray-900">{selectedProjet.anneeFin || "Non spécifiée"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Budget proposé */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Budget proposé</h3>
                    </div>
                    <div className="bg-white rounded p-4 border border-gray-200 text-center">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Montant en dirhams *</Label>
                      <p className="text-uh2c-blue font-bold text-xl">{formatBudget(selectedProjet.budgetPropose)}</p>
                      <p className="text-xs text-gray-500 mt-1">Budget total du projet</p>
                    </div>
                  </div>
                </div>

                {/* Document intégral du projet */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Document intégral du projet à signer *</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-uh2c-blue/5 border border-uh2c-blue/20 rounded p-3">
                      <div className="flex items-start space-x-2">
                        <div className="w-4 h-4 bg-uh2c-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-uh2c-blue mb-1">Confidentialité des documents</p>
                          <p className="text-xs text-uh2c-blue/80">
                            Tous les documents soumis dans cette section sont traités de manière strictement confidentielle. 
                            Seuls les membres autorisés du comité d'évaluation auront accès à ces informations.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-2 block">Document sélectionné</Label>
                      <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded border border-gray-200">
                        <div className="w-8 h-8 bg-uh2c-blue/10 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-uh2c-blue" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{selectedProjet.document || "Aucun document joint"}</p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX jusqu'à 10MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs text-uh2c-blue border-uh2c-blue/30 hover:bg-uh2c-blue/5">
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations administratives */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Informations administratives</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Coordonnateur</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.nomCoordonnateur} {selectedProjet.prenomCoordonnateur}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Établissement</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.etablissement}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Date de réception</Label>
                      <p className="text-sm text-gray-900">{new Date(selectedProjet.dateReception).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Source de réception</Label>
                      <Badge variant="outline" className="bg-uh2c-blue/5 text-uh2c-blue border-uh2c-blue/20 text-xs">
                        {selectedProjet.sourceReception === "email" ? "Email" : "Courrier"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white px-4 py-2 rounded text-sm"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour le statut "Retenu" */}
      {showConfirmationModal && pendingStatusChange && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmation de la décision</h3>
              <p className="text-sm text-gray-700 mb-4">
                Vous êtes sur le point de RETENIR le projet "{projets.find(p => p.id === pendingStatusChange.projetId)?.projet}".
                Voulez-vous confirmer cette action ?
              </p>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" size="sm" onClick={cancelStatusChange} className="text-gray-700 border-gray-300 hover:bg-gray-100">
                  Annuler
                </Button>
                <Button size="sm" onClick={confirmStatusChange} className="bg-green-600 hover:bg-green-700 text-white border-green-600">
                  Confirmer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Convention */}
      {showConventionModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Convention - {selectedProjet.projet}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConventionModal(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Informations du projet</h3>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Programme</Label>
                        <p className="text-sm text-gray-900">{selectedProjet.programme}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Coordonnateur</Label>
                        <p className="text-sm text-gray-900">{selectedProjet.nomCoordonnateur} {selectedProjet.prenomCoordonnateur}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Budget</Label>
                        <p className="text-sm text-gray-900">{formatBudget(selectedProjet.budgetPropose)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
                        <FileText className="w-4 h-4 mr-2" />
                        Générer la convention
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Télécharger modèle
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Voir conventions existantes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Programme d'emploi */}
      {showProgrammeEmploiModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Programme d'emploi - {selectedProjet.projet}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProgrammeEmploiModal(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                {/* Informations du projet */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations du projet</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Budget total</Label>
                      <p className="text-lg font-bold text-uh2c-blue">{formatBudget(selectedProjet.budgetPropose)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Coordonnateur</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.nomCoordonnateur} {selectedProjet.prenomCoordonnateur}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Programme</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.programme}</p>
                    </div>
                  </div>
                </div>

                {/* Sélection de la tranche */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Saisie du budget par tranche</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">Sélectionner la tranche</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choisir une tranche" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tranche1">Tranche 1 - 30% (150.000 MAD)</SelectItem>
                          <SelectItem value="tranche2">Tranche 2 - 40% (200.000 MAD)</SelectItem>
                          <SelectItem value="tranche3">Tranche 3 - 30% (150.000 MAD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">Date de fin de tranche</Label>
                      <Input type="date" className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Saisie du budget par rubrique */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget utilisé par rubrique (réel consommé)</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Personnel</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Équipement</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Fonctionnement</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Mission</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Publication</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Autres</Label>
                        <Input 
                          type="number" 
                          placeholder="Montant en MAD" 
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparaison budget prévisionnel vs réel */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison budget prévisionnel vs réel</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-medium text-gray-700">Rubrique</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-700">Prévisionnel</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-700">Réel</th>
                          <th className="text-right py-2 px-3 font-medium text-gray-700">Écart</th>
                          <th className="text-center py-2 px-3 font-medium text-gray-700">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Personnel</td>
                          <td className="py-2 px-3 text-right">45.000 MAD</td>
                          <td className="py-2 px-3 text-right">42.500 MAD</td>
                          <td className="py-2 px-3 text-right text-green-600">-2.500 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-green-100 text-green-800 text-xs">Sous-budget</Badge>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Équipement</td>
                          <td className="py-2 px-3 text-right">30.000 MAD</td>
                          <td className="py-2 px-3 text-right">32.000 MAD</td>
                          <td className="py-2 px-3 text-right text-red-600">+2.000 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-red-100 text-red-800 text-xs">Dépassement</Badge>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Fonctionnement</td>
                          <td className="py-2 px-3 text-right">25.000 MAD</td>
                          <td className="py-2 px-3 text-right">24.800 MAD</td>
                          <td className="py-2 px-3 text-right text-green-600">-200 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-green-100 text-green-800 text-xs">Sous-budget</Badge>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Mission</td>
                          <td className="py-2 px-3 text-right">20.000 MAD</td>
                          <td className="py-2 px-3 text-right">20.000 MAD</td>
                          <td className="py-2 px-3 text-right text-gray-600">0 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-gray-100 text-gray-800 text-xs">Conforme</Badge>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3">Publication</td>
                          <td className="py-2 px-3 text-right">15.000 MAD</td>
                          <td className="py-2 px-3 text-right">15.700 MAD</td>
                          <td className="py-2 px-3 text-right text-red-600">+700 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-red-100 text-red-800 text-xs">Dépassement</Badge>
                          </td>
                        </tr>
                        <tr className="bg-gray-50 font-medium">
                          <td className="py-2 px-3">Total</td>
                          <td className="py-2 px-3 text-right">135.000 MAD</td>
                          <td className="py-2 px-3 text-right">135.000 MAD</td>
                          <td className="py-2 px-3 text-right text-gray-600">0 MAD</td>
                          <td className="py-2 px-3 text-center">
                            <Badge className="bg-gray-100 text-gray-800 text-xs">Conforme</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="w-full bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
                      <FileText className="w-4 h-4 mr-2" />
                      Générer le document de justification
                    </Button>
                    <Button variant="outline" className="w-full">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Préparer déblocage tranche suivante
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Historique des programmes d'emploi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Versements */}
      {showVersementsModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Gestion des versements - {selectedProjet.projet}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVersementsModal(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                {/* Informations du projet */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations du projet</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Programme</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.programme}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Coordonnateur</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.nomCoordonnateur} {selectedProjet.prenomCoordonnateur}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Établissement</Label>
                      <p className="text-sm text-gray-900">{selectedProjet.etablissement}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Budget alloué</Label>
                      <p className="text-lg font-bold text-uh2c-blue">{formatBudget(selectedProjet.budgetPropose)}</p>
                    </div>
                  </div>
                </div>

                {/* Contrôles de tri */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Liste des projets classés par programme</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm font-medium text-gray-700">Trier par tranches:</Label>
                        <Select>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Ordre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Croissant</SelectItem>
                            <SelectItem value="desc">Décroissant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Tableau des versements */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Programme</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Projet</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Nom coordonateur</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Prénom</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Établissement</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Budget alloué</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Tranche 1</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Tranche 2</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{selectedProjet.programme}</td>
                          <td className="py-3 px-4 font-medium">{selectedProjet.projet}</td>
                          <td className="py-3 px-4">{selectedProjet.nomCoordonnateur}</td>
                          <td className="py-3 px-4">{selectedProjet.prenomCoordonnateur}</td>
                          <td className="py-3 px-4">{selectedProjet.etablissement}</td>
                          <td className="py-3 px-4 text-right font-medium">{formatBudget(selectedProjet.budgetPropose)}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="tranche1-recu" />
                                <Label htmlFor="tranche1-recu" className="text-xs">Reçu</Label>
                              </div>
                              <Input 
                                type="date" 
                                className="w-32 text-xs h-8"
                                placeholder="Date réception"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="tranche2-recu" />
                                <Label htmlFor="tranche2-recu" className="text-xs">Reçu</Label>
                              </div>
                              <Input 
                                type="date" 
                                className="w-32 text-xs h-8"
                                placeholder="Date réception"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col space-y-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-7 text-xs"
                                title="Marquer comme envoyé"
                              >
                                <DollarSign className="w-3 h-3 mr-1" />
                                Envoyé
                              </Button>
                              <Input 
                                type="date" 
                                className="w-28 text-xs h-6"
                                placeholder="Date envoi"
                              />
                            </div>
                          </td>
                        </tr>
                        {/* Exemple avec d'autres projets */}
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">Programme National de Recherche en IA</td>
                          <td className="py-3 px-4 font-medium">Développement d'algorithmes d'IA</td>
                          <td className="py-3 px-4">Zahra</td>
                          <td className="py-3 px-4">Fatima</td>
                          <td className="py-3 px-4">ENSA Casablanca</td>
                          <td className="py-3 px-4 text-right font-medium">1.200.000 MAD</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="tranche1-recu-2" defaultChecked />
                                <Label htmlFor="tranche1-recu-2" className="text-xs">Reçu</Label>
                              </div>
                              <Input 
                                type="date" 
                                className="w-32 text-xs h-8"
                                defaultValue="2024-03-15"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col items-center space-y-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox id="tranche2-recu-2" />
                                <Label htmlFor="tranche2-recu-2" className="text-xs">Reçu</Label>
                              </div>
                              <Input 
                                type="date" 
                                className="w-32 text-xs h-8"
                                placeholder="Date réception"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-col space-y-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-7 text-xs"
                                title="Marquer comme envoyé"
                              >
                                <DollarSign className="w-3 h-3 mr-1" />
                                Envoyé
                              </Button>
                              <Input 
                                type="date" 
                                className="w-28 text-xs h-6"
                                placeholder="Date envoi"
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Résumé des versements */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé des versements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-800">Tranche 1</p>
                          <p className="text-sm text-green-600">{formatBudget(selectedProjet.budgetPropose * 0.3)} (30%)</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Reçu</Badge>
                      </div>
                      <p className="text-xs text-green-600 mt-2">Reçu le: 15/03/2024</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-yellow-800">Tranche 2</p>
                          <p className="text-sm text-yellow-600">{formatBudget(selectedProjet.budgetPropose * 0.4)} (40%)</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Envoyé</Badge>
                      </div>
                      <p className="text-xs text-yellow-600 mt-2">Envoyé le: 01/06/2024</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">Tranche 3</p>
                          <p className="text-sm text-gray-600">{formatBudget(selectedProjet.budgetPropose * 0.3)} (30%)</p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-800">Non émis</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">En attente</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="w-full bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Nouveau versement
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      Générer rapport
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Historique complet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Livrables */}
      {showLivrablesModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Livrables - {selectedProjet.projet}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLivrablesModal(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Tranches de livrables</h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-green-800">Tranche 1 - Rapport initial</p>
                            <p className="text-sm text-green-600">Livré le 15/03/2024</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Livré</Badge>
                        </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-yellow-800">Tranche 2 - Rapport intermédiaire</p>
                            <p className="text-sm text-yellow-600">Échéance: 15/06/2024</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">En cours</Badge>
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">Tranche 3 - Rapport final</p>
                            <p className="text-sm text-gray-600">Échéance: 15/12/2024</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800">À venir</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-uh2c-blue hover:bg-uh2c-blue/90 text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Nouveau livrable
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Planifier échéances
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Historique des livrables
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Programme d'emploi */}
      {showProgrammeEmploiModal && selectedProjet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-semibold text-white">Programme d'emploi - {selectedProjet.projet}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProgrammeEmploiModal(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
              {(() => {
                const emploiData = getProgrammeEmploiData(selectedProjet.id)
                return (
                  <div className="space-y-6">
                    {/* En-tête avec informations */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Enseignant chercheur</Label>
                          <p className="text-sm font-semibold text-gray-900">{emploiData.enseignantChercheur}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Date de saisie</Label>
                          <p className="text-sm text-gray-900">{emploiData.dateSaisie}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Statut</Label>
                          <Badge className={`${
                            emploiData.statut === "validé" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {emploiData.statut === "validé" ? "Validé" : "En attente"}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">Budget total</Label>
                          <p className="text-lg font-bold text-uh2c-blue">
                            {formatBudget(emploiData.tranches.reduce((sum, t) => sum + t.montantPrevisionnel, 0))}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tranches */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Détail des tranches</h3>
                      {emploiData.tranches.map((tranche, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className={`p-4 ${
                            tranche.statut === "terminee" 
                              ? "bg-green-50 border-b border-green-200" 
                              : "bg-blue-50 border-b border-blue-200"
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  tranche.statut === "terminee" 
                                    ? "bg-green-500 text-white" 
                                    : "bg-blue-500 text-white"
                                }`}>
                                  {tranche.numero}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">Tranche {tranche.numero}</h4>
                                  <p className="text-sm text-gray-600">
                                    {formatBudget(tranche.montantPrevisionnel)} • {tranche.statut === "terminee" ? "Terminée" : "En cours"}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Utilisé: {formatBudget(tranche.montantUtilise)}</p>
                                <p className="text-xs text-gray-500">
                                  {tranche.dateVersement} - {tranche.dateFinTranche}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Rubriques */}
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {tranche.rubriques.map((rubrique, rubriqueIndex) => (
                                <div key={rubriqueIndex} className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium text-gray-900 text-sm">{rubrique.nom}</h5>
                                    <Badge className={`text-xs ${
                                      rubrique.pourcentageUtilise > rubrique.pourcentagePrevisionnel
                                        ? "bg-red-100 text-red-800"
                                        : rubrique.pourcentageUtilise === rubrique.pourcentagePrevisionnel
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}>
                                      {rubrique.pourcentageUtilise}%
                                    </Badge>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-600">Prévu:</span>
                                      <span className="font-medium">{formatBudget(rubrique.budgetPrevisionnel)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                      <span className="text-gray-600">Utilisé:</span>
                                      <span className="font-medium">{formatBudget(rubrique.budgetUtilise)}</span>
                                    </div>
                                  
                                    {/* Barre de progression */}
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          rubrique.pourcentageUtilise > rubrique.pourcentagePrevisionnel
                                            ? "bg-red-500"
                                            : rubrique.pourcentageUtilise === rubrique.pourcentagePrevisionnel
                                            ? "bg-green-500"
                                            : "bg-blue-500"
                                        }`}
                                        style={{ width: `${Math.min(rubrique.pourcentageUtilise, 100)}%` }}
                                      ></div>
                                    </div>
                                  
                                    {/* Détails si disponibles */}
                                    {rubrique.details && rubrique.details.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-600 mb-1">Détails:</p>
                                        <div className="space-y-1">
                                          {rubrique.details.map((detail, detailIndex) => (
                                            <div key={detailIndex} className="text-xs text-gray-700">
                                              • {detail.poste}: {formatBudget(detail.montant)}
                                              {detail.heures && ` (${detail.heures}h)`}
                                              {detail.quantite && ` (${detail.quantite} unités)`}
                                              {detail.voyages && ` (${detail.voyages} voyages)`}
                                              {detail.articles && ` (${detail.articles} articles)`}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Résumé global */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé global</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {formatBudget(emploiData.tranches.reduce((sum, t) => sum + t.montantUtilise, 0))}
                          </p>
                          <p className="text-sm text-green-700">Total utilisé</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {formatBudget(emploiData.tranches.reduce((sum, t) => sum + t.montantPrevisionnel, 0))}
                          </p>
                          <p className="text-sm text-blue-700">Total prévisionnel</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-gray-600">
                            {Math.round((emploiData.tranches.reduce((sum, t) => sum + t.montantUtilise, 0) / 
                              emploiData.tranches.reduce((sum, t) => sum + t.montantPrevisionnel, 0)) * 100)}%
                          </p>
                          <p className="text-sm text-gray-700">Taux d'exécution</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 