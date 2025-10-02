"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, ExternalLink, FileText, Check, Building2, Calendar, MapPin, Users, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { paysMonde, villesMonde, getVillesByPays } from "@/lib/pays-villes"
import { Textarea } from "@/components/ui/textarea"
import { etabUh2c } from "@/lib/etab-uh2c"
import { DemandeParticipation, listeDemandesParticipationsManifestations } from "@/lib/demandes-participations-member"

import { useOrganisation } from "@/lib/organisation-context"
import { DemandeOrganisation } from "@/lib/models/demande-organisation-member"



/***************DATA****************/
//DATA chercheurs
const chercheurs: string[] = [
  "Naciri Mohamed", "Kadiri Jawad", "Amrani Lamia", "yhyawi Fouad", "Amrawi Imane"
]

//liste demandes organisation
const listeDemandesOrganisation: DemandeOrganisation[] = [
  {
    id: "1",
    intitule: "Colloque International sur l'Intelligence Artificielle et l'Éducation",
    type: "Colloque",
    lieu: "Faculté des Sciences et Techniques - Casablanca",
    dateDebut: "2024-06-15",
    dateFin: "2024-06-17",
    nomPrenomCoordinateur: "Elkanoun Mohamed",
    nomsEnseignantsOrganisateursUh2c: ["Naciri Mohamed", "Kadiri Jawad"],
    statutIndexation: "EnCours",
    partenaires: "Université Mohammed V, Université Cadi Ayyad",
    publicCible: ["Enseignants", "Doctorants"],
    resume: "Ce colloque vise à explorer les applications de l'IA dans le domaine éducatif",
    justificatifs: []
  },
  {
    id: "2",
    intitule: "Séminaire sur les Technologies Émergentes",
    type: "séminaire",
    lieu: "Faculté des Sciences Juridiques - Casablanca",
    dateDebut: "2024-07-20",
    dateFin: "2024-07-21",
    nomPrenomCoordinateur: "Ahmed Benali",
    nomsEnseignantsOrganisateursUh2c: ["Amrani Lamia", "yhyawi Fouad"],
    statutIndexation: "Obtenu",
    partenaires: "CNRS, Ministère de l'Éducation",
    publicCible: ["Chercheurs", "Industriels"],
    resume: "Séminaire dédié aux nouvelles technologies et leur impact sur la société",
    justificatifs: []
  },
  {
    id: "3",
    intitule: "Atelier de Formation en Cybersécurité",
    type: "atelier",
    lieu: "Faculté des Sciences et Techniques - Casablanca",
    dateDebut: "2024-08-10",
    dateFin: "2024-08-12",
    nomPrenomCoordinateur: "Fatima Zahra El Mansouri",
    nomsEnseignantsOrganisateursUh2c: ["Amrawi Imane", "Kadiri Jawad"],
    statutIndexation: "EnCours",
    partenaires: "ANSSI, Orange Maroc",
    publicCible: ["Étudiants", "Professionnels"],
    resume: "Formation pratique sur les bonnes pratiques de cybersécurité",
    justificatifs: []
  },
  {
    id: "4",
    intitule: "journée d'étude sur l'Innovation Pédagogique",
    type: "journée d'étude",
    lieu: "Faculté des Lettres et Sciences Humaines - Casablanca",
    dateDebut: "2024-09-05",
    dateFin: "2024-09-05",
    nomPrenomCoordinateur: "Hassan Alami",
    nomsEnseignantsOrganisateursUh2c: ["Naciri Mohamed", "Amrani Lamia"],
    statutIndexation: "Obtenu",
    partenaires: "Ministère de l'Enseignement Supérieur",
    publicCible: ["Enseignants", "Formateurs"],
    resume: "Journée dédiée aux nouvelles méthodes pédagogiques et outils numériques",
    justificatifs: []
  },
  {
    id: "5",
    intitule: "Colloque International sur le Développement Durable",
    type: "Colloque",
    lieu: "Faculté des Sciences et Techniques - Casablanca",
    dateDebut: "2024-10-15",
    dateFin: "2024-10-17",
    nomPrenomCoordinateur: "Mohamed Tazi",
    nomsEnseignantsOrganisateursUh2c: ["yhyawi Fouad", "Amrawi Imane"],
    statutIndexation: "EnCours",
    partenaires: "ONU, UNESCO, IRESEN",
    publicCible: ["Chercheurs", "Étudiants", "Décideurs"],
    resume: "Colloque international sur les enjeux du développement durable au Maroc",
    justificatifs: []
  }
]

//nomPrenom coordinateur Manif uh2c connecté
const nomPrenomCoordinateurConnecte: string="Yousfi"

//liste partenaires
const publicCible: string[] = ["Enseignant","Doctorants","industriels","ect"]

//liste thématiques
const thematiques: string[] = [
  "Intelligence Artificielle et Machine Learning",
  "Sciences de l'Information et de la Communication",
  "Développement Durable et Environnement",
  "Santé et Médecine",
  "Éducation et Formation",
  "Économie et Gestion",
  "Droit et Sciences Juridiques",
  "Lettres et Sciences Humaines",
  "Sciences Exactes et Naturelles",
  "Ingénierie et Technologie",
  "Architecture et Urbanisme",
  "Agriculture et Sciences Agronomiques",
  "Tourisme et Hôtellerie",
  "Arts et Culture",
  "Sport et Éducation Physique",
  "Autres"
]

//liste laboratoires UH2C
const laboratoiresUh2c: string[] = [
  "Laboratoire de Recherche en Informatique et Télécommunications (LRIT)",
  "Laboratoire de Mathématiques Appliquées et Calcul Scientifique (LMACS)",
  "Laboratoire de Physique de la Matière et du Rayonnement (LPMR)",
  "Laboratoire de Chimie Organique et Analytique (LCOA)",
  "Laboratoire de Biologie et Santé (LBS)",
  "Laboratoire d'Économie et de Gestion (LEG)",
  "Laboratoire de Droit et Sciences Politiques (LDSP)",
  "Laboratoire de Lettres et Sciences Humaines (LLSH)",
  "Laboratoire de Géographie et Aménagement du Territoire (LGAT)",
  "Laboratoire d'Histoire et Civilisation (LHC)",
  "Laboratoire de Langues et Communication (LLC)",
  "Laboratoire de Psychologie et Sciences de l'Éducation (LPSE)",
  "Laboratoire d'Architecture et Urbanisme (LAU)",
  "Laboratoire de Génie Civil et Matériaux (LGCM)",
  "Laboratoire de Génie Mécanique et Énergétique (LGME)",
  "Laboratoire de Génie Électrique et Électronique (LGEE)",
  "Laboratoire de Génie Industriel et Logistique (LGIL)",
  "Laboratoire de Génie Chimique et Procédés (LGCP)",
  "Laboratoire de Génie Informatique et Systèmes (LGIS)",
  "Laboratoire de Génie des Matériaux et Nanotechnologies (LGMN)",
  "Autre"
]

//liste types de structures externes
const typesStructuresExternes: string[] = [
  "Association",
  "Université",
  "ONG",
  "Organisation Internationale",
  "Ministère",
  "Organisme Public",
  "Entreprise Privée",
  "Fondation",
  "Centre de Recherche",
  "Institut",
  "Consortium",
  "Réseau",
  "Autre"
]








export default function OrganisationManifestationMember() {

/***************Composant****************/
  const [isModalOpenOrganisation, setIsModalOpenOrganisation] = useState(false)
  const [editingItem, setEditingItem] = useState<DemandeOrganisation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [dateDebutFilter, setDateDebutFilter] = useState("")
  const [dateFinFilter, setDateFinFilter] = useState("")
  const [villeFilter, setVilleFilter] = useState<string>("all")
  const [paysFilter, setPaysFilter] = useState<string>("all")
  const { toast } = useToast()

  const [demandesOrganisation, setDemandesOrganisation] = useState<DemandeOrganisation[]>(listeDemandesOrganisation)

  const [selectedOrganisateurs, setSelectedOrganisateurs] = useState<string[]>([]);

  const [selectedPublicCible, setSelectedPublicCible] = useState<string[]>([]);
  
  const [selectedThematiques, setSelectedThematiques] = useState<string[]>([]);
  
  const [selectedStructuresInternes, setSelectedStructuresInternes] = useState<string[]>([]);
  
  //const [selected, setSelected] = useState<string[]>([]);

  const [formDataOrganisation, setFormDataOrganisation] = useState({
    // 1. INTITULÉ DE LA MANIFESTATION
    intitule: "",
    
    // 2. CARACTÈRE
    caractere: "NATIONAL" as "NATIONAL" | "REGIONAL" | "INTERNATIONAL",
    
    // 3. THÉMATIQUE
    thematique: "",
    
    // 4. ORGANISATION
    lieu: "",
    ville: "",
    pays: "",
    dateDebut: "",
    dateFin: "",
    afficheManifestation: null as File | null,
    structureUh2c: "",
    typeStructure: "interne" as "interne" | "externe",
    structuresInternes: [] as string[],
    structureExterneVille: "",
    structureExternePays: "",
    structureExterneType: "",
    coOrganisateurs: "",

    // 5. COORDONNATEUR DE LA MANIFESTATION
    nomPrenomCoordinateur: "",
    etablissementAttache: "",
    laboratoireAffiliation: "",
    adresse: "",
    telephone: "",
    email: "",
    dejaBeneficieSoutien: false,
    manifestationsPrecedentes: "",
    dateManifestationsPrecedentes: "",
    
    // 6. DESCRIPTION DE LA MANIFESTATION
    description: "",
    
    // 7. COMPOSITION DU COMITÉ SCIENTIFIQUE
    comiteScientifique: "",
    
    // 8. COMPOSITION DU COMITÉ D'ORGANISATION
    comiteOrganisation: "",
    
    // 9. NOMBRE PRÉVU D'INTERVENANTS
    intervenantsUh2c: 0,
    intervenantsUniversitesNationales: 0,
    intervenantsUniversitesInternationales: 0,
    intervenantsSecteursSocio: 0,
    
    // 10. NOMBRE ESTIMÉ DE PARTICIPANTS
    participantsUh2c: 0,
    participantsUniversitesNationales: 0,
    participantsUniversitesInternationales: 0,
    
    // 11. PROGRAMME PRÉVISIONNEL
    programmePrevisionnel: "",
    programmePrevisionnelDocument: null as File | null,
    argumentaireJustification: "",
    
    // 12. INDEXATION
    indexationDemandee: "non" as "oui" | "non",
    baseIndexation: "scopus" as "scopus" | "wos",
    
    // 14. PRÉVISIONS BUDGÉTAIRES
    fraisDeplacement: 0,
    fraisSejour: 0,
    fraisPublication: 0,
    fraisTraduction: 0,
    fraisRestauration: 0,
    fraisPauses: 0,
    fraisMateriel: 0,
    autresFrais: 0,
    totalBudget: 0,
    partSolicitee: 0,
    
    // 15. AVIS MOTIVÉ DU RESPONSABLE DE LA STRUCTURE DE RECHERCHE
    avisResponsableStructure: "",
    
    // 16. AVIS DE LA COMMISSION RECHERCHE DU CONSEIL D'ÉTABLISSEMENT
    avisCommissionRechercheEtablissement: "",
    avisChefEtablissement: "",
    
    // 17. AVIS DE LA COMMISSION RECHERCHE DU CONSEIL D'UNIVERSITÉ
    avisCommissionRechercheConseilUniversite: "",
    
    // DOSSIER À FOURNIR
    demandeManuscrite: null as File | null,
    formulaireDemande: null as File | null,
    ficheFinanciere: null as File | null,
    programmeFinal: null as File | null,
    piecesJustificatives: [] as File[],
    
    // Champs existants pour compatibilité
    type: "Colloque" as "Colloque" | "journée d'étude" | "séminaire" | "atelier",
    nomsEnseignantsOrganisateursUh2c: "",
    statutIndexation: "EnCours" as "EnCours" | "Obtenu", 
    partenaires: "",
    publicCible: "",
    resume: "",
    justificatifs: [] as File []
  })

  const resetFormDataOrganisation = () => {
    setFormDataOrganisation({
      // 1. INTITULÉ DE LA MANIFESTATION
      intitule: "",
      
      // 2. CARACTÈRE
      caractere: "NATIONAL" as "NATIONAL" | "REGIONAL" | "INTERNATIONAL",
      
      // 3. THÉMATIQUE
      thematique: "",
      
      // 4. ORGANISATION
    lieu: "",
    ville: "",
    pays: "",
    dateDebut: "",
    dateFin: "",
    afficheManifestation: null as File | null,
      structureUh2c: "",
      typeStructure: "interne" as "interne" | "externe",
      structuresInternes: [] as string[],
      structureExterneVille: "",
      structureExternePays: "",
      structureExterneType: "",
      coOrganisateurs: "",

      // 5. COORDONNATEUR DE LA MANIFESTATION
    nomPrenomCoordinateur: nomPrenomCoordinateurConnecte,
      etablissementAttache: "",
      laboratoireAffiliation: "",
      adresse: "",
      telephone: "",
      email: "",
      dejaBeneficieSoutien: false,
      manifestationsPrecedentes: "",
      dateManifestationsPrecedentes: "",
      
      // 6. DESCRIPTION DE LA MANIFESTATION
      description: "",
      
      // 7. COMPOSITION DU COMITÉ SCIENTIFIQUE
      comiteScientifique: "",
      
      // 8. COMPOSITION DU COMITÉ D'ORGANISATION
      comiteOrganisation: "",
      
      // 9. NOMBRE PRÉVU D'INTERVENANTS
      intervenantsUh2c: 0,
      intervenantsUniversitesNationales: 0,
      intervenantsUniversitesInternationales: 0,
      intervenantsSecteursSocio: 0,
      
      // 10. NOMBRE ESTIMÉ DE PARTICIPANTS
      participantsUh2c: 0,
      participantsUniversitesNationales: 0,
      participantsUniversitesInternationales: 0,
      
      // 11. PROGRAMME PRÉVISIONNEL
      programmePrevisionnel: "",
      programmePrevisionnelDocument: null as File | null,
      argumentaireJustification: "",
      
      // 12. INDEXATION
      indexationDemandee: "non" as "oui" | "non",
      baseIndexation: "scopus" as "scopus" | "wos",
      
      // 14. PRÉVISIONS BUDGÉTAIRES
      fraisDeplacement: 0,
      fraisSejour: 0,
      fraisPublication: 0,
      fraisTraduction: 0,
      fraisRestauration: 0,
      fraisPauses: 0,
      fraisMateriel: 0,
      autresFrais: 0,
      totalBudget: 0,
      partSolicitee: 0,
      
      // 15. AVIS MOTIVÉ DU RESPONSABLE DE LA STRUCTURE DE RECHERCHE
      avisResponsableStructure: "",
      
      // 16. AVIS DE LA COMMISSION RECHERCHE DU CONSEIL D'ÉTABLISSEMENT
      avisCommissionRechercheEtablissement: "",
      avisChefEtablissement: "",
      
      // 17. AVIS DE LA COMMISSION RECHERCHE DU CONSEIL D'UNIVERSITÉ
      avisCommissionRechercheConseilUniversite: "",
      
      // DOSSIER À FOURNIR
      demandeManuscrite: null as File | null,
      formulaireDemande: null as File | null,
      ficheFinanciere: null as File | null,
      programmeFinal: null as File | null,
      piecesJustificatives: [] as File[],
      
      // Champs existants pour compatibilité
      type: "Colloque" as "Colloque" | "journée d'étude" | "séminaire" | "atelier",
    nomsEnseignantsOrganisateursUh2c: "",
    statutIndexation: "EnCours" as "EnCours" | "Obtenu", 
    partenaires: "",
    publicCible: "",
    resume: "",
    justificatifs: []
    })
    
    setEditingItem(null)
  }

  
  const filteredDemandesOrganisations = demandesOrganisation.filter((item) => {
    const matchesSearch =
      item.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lieu.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesYear = yearFilter === "all" || item.dateDebut.startsWith(yearFilter)
    const matchesDateDebut = !dateDebutFilter || item.dateDebut >= dateDebutFilter
    const matchesDateFin = !dateFinFilter || item.dateFin <= dateFinFilter
    const matchesVille = villeFilter === "all" || item.lieu.toLowerCase().includes(villeFilter.toLowerCase())
    const matchesPays = paysFilter === "all" || item.lieu.toLowerCase().includes(paysFilter.toLowerCase())
    return matchesSearch && matchesType && matchesYear && matchesDateDebut && matchesDateFin && matchesVille && matchesPays
  })

  const resetFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setYearFilter("all")
    setDateDebutFilter("")
    setDateFinFilter("")
    setVilleFilter("all")
    setPaysFilter("all")
  }

  const handleEdit = (item: DemandeOrganisation) => {
    setEditingItem(item)
    
    setIsModalOpenOrganisation(true)
  }

  const handleDelete = (id: string) => {
    setDemandesOrganisation((prev) => prev.filter((item) => item.id !== id))
    toast({ title: "DemandeOrganisation supprimée avec succès" })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormDataOrganisation((prev) => ({
        ...prev,
        justificatifs: Array.from(e.target.files || []),
      }))
    }
  }

  // Obtenir la date actuelle pour limiter la sélection
  const getCurrentDate = () => new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const years = Array.from(new Set(demandesOrganisation.map((item) => item.dateDebut.split("-")[0]))).sort()
  
  //méthode trait handleChangeOrganisateurs form dde organisation
  const handleChangeOrganisateurs= (event: any) => {
    const value = event.target.value;
    setSelectedOrganisateurs((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value+" /"]
    );
  };

  //méthode trait handleChangePublicCible form dde organisation
  const handleChangePublicCible= (event: any) => {
    const value = event.target.value;
    setSelectedPublicCible((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value+" /"]
    );
  };

  //méthode trait handleChangeThematiques form dde organisation
  const handleChangeThematiques= (event: any) => {
    const value = event.target.value;
    setSelectedThematiques((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  //méthode trait handleChangeStructuresInternes form dde organisation
  const handleChangeStructuresInternes= (value: string) => {
    setSelectedStructuresInternes((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };


  
  
  //traitement envoyer demande organisation
  const handleSubmitDemandeOrganisation = (e: React.FormEvent) => {
    e.preventDefault()

    //validations
    //

    const newDemandeOrganisation: DemandeOrganisation = {
      
      id: Date.now().toString(),
      intitule: formDataOrganisation.intitule,
      type: formDataOrganisation.type,
      lieu: formDataOrganisation.lieu,
      dateDebut: formDataOrganisation.dateDebut,
      dateFin: formDataOrganisation.dateFin,

      nomPrenomCoordinateur: formDataOrganisation.nomPrenomCoordinateur,
      nomsEnseignantsOrganisateursUh2c: selectedOrganisateurs,
      statutIndexation: formDataOrganisation.statutIndexation, 
      partenaires: formDataOrganisation.partenaires,
      publicCible: selectedPublicCible,
  
     resume: formDataOrganisation.resume,
     justificatifs: formDataOrganisation.justificatifs.map((f) => f.name)
    }
    
    // déboggages
    console.log(newDemandeOrganisation.nomPrenomCoordinateur+"-----"+newDemandeOrganisation.dateDebut)
    console.log("******************************************************************")

    setDemandesOrganisation(prev => [...prev, newDemandeOrganisation])
    
    /*
    if (addDemandeParticipation) {
      addDemandeParticipation(newDemandeParticipation);
      console.log('Demande ajoutée:', newDemandeParticipation); // Debug
    } else {
      console.error('addDemandeParticipation non disponible');
    }

    
    demandesParticipations.map(((ddeParticip) => {
      console.log('Demande participation:', ddeParticip)
      console.log("-------------------")
    }))
    */

    toast({title: "Nouvelle demande participation manifestation ajoutée"})


    setIsModalOpenOrganisation(false)
    resetFormDataOrganisation()

    
  }
  
  




/***************Template****************/
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-lg font-bold text-gray-900">Gestion des Manifestations Scientifiques</h1>
                  <Dialog open={isModalOpenOrganisation} onOpenChange={setIsModalOpenOrganisation}>
                    <DialogTrigger asChild>
                      <Button onClick={resetFormDataOrganisation} size="default" className="text-sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Demander l'organisation d'une manifestation scientifique
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogTitle className="sr-only">
                          Demander l'organisation d'une manifestation scientifique
                        </DialogTitle>
                      
                      {/* En-tête unifié du formulaire */}
                      <div className="mb-4">
                        <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                              <Building2 className="h-3 w-3 text-uh2c-blue" />
                            </div>
                            <div>
                              <h2 className="text-sm font-bold text-uh2c-blue">
                                DEMANDE D'ORGANISATION D'UNE MANIFESTATION À L'UH2C
                              </h2>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Remplissez tous les champs obligatoires <span className="text-red-500 font-bold">(*)</span> pour votre demande d'organisation
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <form onSubmit={handleSubmitDemandeOrganisation} className="space-y-6">
                        {/* 1. INTITULÉ DE LA MANIFESTATION */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Intitulé de la manifestation</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                          <div>
                              <Label htmlFor="intitule" className="text-xs font-medium text-gray-600">
                                Intitulé <span className="text-red-500">*</span>
                              </Label>
                            <Input
                              id="intitule"
                              value={formDataOrganisation.intitule}
                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, intitule: e.target.value }))}
                              required
                                placeholder="Saisissez l'intitulé complet de la manifestation"
                                className="mt-1 h-9 text-sm"
                            />
                          </div>
                          </CardContent>
                        </Card>

                        {/* 2. CARACTÈRE */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Caractère</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                          <div>
                              <Label htmlFor="caractere" className="text-xs font-medium text-gray-600">
                                Caractère <span className="text-red-500">*</span>
                              </Label>
                            <Select
                                value={formDataOrganisation.caractere}
                                onValueChange={(value: "NATIONAL" | "REGIONAL" | "INTERNATIONAL") =>
                                  setFormDataOrganisation((prev) => ({ ...prev, caractere: value }))
                                }
                              >
                                <SelectTrigger className="mt-1 h-9 text-sm">
                                  <SelectValue placeholder="Sélectionnez le caractère" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="NATIONAL">NATIONAL</SelectItem>
                                  <SelectItem value="REGIONAL">REGIONAL</SelectItem>
                                  <SelectItem value="INTERNATIONAL">INTERNATIONAL</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          </CardContent>
                        </Card>

                        {/* 3. THÉMATIQUE */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Thématique</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="thematique" className="text-xs font-medium text-gray-600">
                                Thématique <span className="text-red-500">*</span>
                              </Label>
                              <Select onValueChange={handleChangeThematiques}>
                                <SelectTrigger className="mt-1 h-9 text-sm">
                                  <SelectValue placeholder="Sélectionnez une ou plusieurs thématiques" />
                                </SelectTrigger>
                                <SelectContent>
                                  {thematiques.map((thematique) => (
                                    <SelectItem key={thematique} value={thematique}>
                                      {thematique}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              {/* Affichage des thématiques sélectionnées */}
                              {selectedThematiques.length > 0 && (
                                <div className="mt-3">
                                  <Label className="text-xs font-medium text-gray-600 mb-2 block">
                                    Thématiques sélectionnées :
                                  </Label>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedThematiques.map((thematique, index) => (
                                      <div key={index} className="flex items-center gap-1 bg-uh2c-blue/10 text-uh2c-blue px-2 py-1 rounded-md text-xs">
                                        <span>{thematique}</span>
                                        <button
                                          type="button"
                                          onClick={() => setSelectedThematiques(prev => prev.filter((_, i) => i !== index))}
                                          className="ml-1 text-uh2c-blue hover:text-red-600"
                                        >
                                          ×
                                        </button>
                        </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* 4. ORGANISATION */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Organisation</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                                <Label htmlFor="lieu" className="text-xs font-medium text-gray-600">
                                  Lieu <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="lieu"
                              value={formDataOrganisation.lieu}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, lieu: e.target.value }))}
                                  required
                                  placeholder="Saisissez le lieu exact de la manifestation"
                                  className="mt-1 h-9 text-sm"
                                />
                           </div>
                           <div>
                                <Label htmlFor="pays" className="text-xs font-medium text-gray-600">
                                  Pays <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={formDataOrganisation.pays}
                                  onValueChange={(value: string) => {
                                    setFormDataOrganisation((prev) => ({ 
                                      ...prev, 
                                      pays: value,
                                      ville: "" // Reset ville quand le pays change
                                    }))
                                  }}
                                >
                                  <SelectTrigger className="mt-1 h-9 text-sm">
                                    <SelectValue placeholder="Sélectionnez le pays" />
                              </SelectTrigger>
                              <SelectContent>
                                    {paysMonde.map((pays) => ( 
                                      <SelectItem key={pays} value={pays}>{pays}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                                <Label htmlFor="ville" className="text-xs font-medium text-gray-600">
                                  Ville <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                  value={formDataOrganisation.ville}
                                  onValueChange={(value: string) =>
                                    setFormDataOrganisation((prev) => ({ ...prev, ville: value }))
                                  }
                                  disabled={!formDataOrganisation.pays}
                                >
                                  <SelectTrigger className="mt-1 h-9 text-sm">
                                    <SelectValue placeholder={formDataOrganisation.pays ? "Sélectionnez la ville" : "Sélectionnez d'abord un pays"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {formDataOrganisation.pays ? (
                                      getVillesByPays(formDataOrganisation.pays).map((ville) => ( 
                                        <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                                      ))
                                    ) : (
                                      <SelectItem value="no-country" disabled>Sélectionnez d'abord un pays</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                           </div>
                          <div>
                                <Label htmlFor="dateDebut" className="text-xs font-medium text-gray-600">
                                  Date de début <span className="text-red-500">*</span>
                                </Label>
                            <Input
                              id="dateDebut"
                              type="date"
                              value={formDataOrganisation.dateDebut}
                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, dateDebut: e.target.value }))}
                                  required
                                  className="mt-1 h-9 text-sm"
                            />
                          </div>
                          <div>
                                <Label htmlFor="dateFin" className="text-xs font-medium text-gray-600">
                                  Date de fin <span className="text-red-500">*</span>
                                </Label>
                            <Input
                              id="dateFin"
                              type="date"
                              value={formDataOrganisation.dateFin}
                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, dateFin: e.target.value }))}
                                  required
                                  className="mt-1 h-9 text-sm"
                            />
                          </div>
                              <div className="col-span-2">
                                <Label className="text-xs font-medium text-gray-600 mb-3 block">
                                  Structure organisatrice <span className="text-red-500">*</span>
                                </Label>
                                
                                {/* Radio buttons Interne/Externe */}
                                <div className="flex space-x-6 mb-4">
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      name="typeStructure"
                                      value="interne"
                                      checked={formDataOrganisation.typeStructure === "interne"}
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ 
                                        ...prev, 
                                        typeStructure: e.target.value as "interne" | "externe",
                                        structuresInternes: [],
                                        structureExterneVille: "",
                                        structureExternePays: "",
                                        structureExterneType: ""
                                      }))}
                                      className="mr-2"
                                    />
                                    Interne
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="radio"
                                      name="typeStructure"
                                      value="externe"
                                      checked={formDataOrganisation.typeStructure === "externe"}
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ 
                                        ...prev, 
                                        typeStructure: e.target.value as "interne" | "externe",
                                        structuresInternes: [],
                                        structureExterneVille: "",
                                        structureExternePays: "",
                                        structureExterneType: ""
                                      }))}
                                      className="mr-2"
                                    />
                                    Externe
                                  </label>
                                </div>

                                {/* Structure Interne */}
                                {formDataOrganisation.typeStructure === "interne" && (
                                  <div className="space-y-3">
                                    <Label className="text-xs font-medium text-gray-600">
                                      Sélectionnez les laboratoires organisateurs
                                    </Label>
                                    <Select onValueChange={handleChangeStructuresInternes}>
                                      <SelectTrigger className="h-9 text-sm">
                                        <SelectValue placeholder="Sélectionnez un ou plusieurs laboratoires" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {laboratoiresUh2c.map((laboratoire) => (
                                          <SelectItem key={laboratoire} value={laboratoire}>
                                            {laboratoire}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    
                                    {/* Affichage des laboratoires sélectionnés */}
                                    {selectedStructuresInternes.length > 0 && (
                                      <div className="mt-3">
                                        <Label className="text-xs font-medium text-gray-600 mb-2 block">
                                          Laboratoires sélectionnés :
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedStructuresInternes.map((laboratoire, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-uh2c-blue/10 text-uh2c-blue px-2 py-1 rounded-md text-xs">
                                              <span>{laboratoire}</span>
                                              <button
                                                type="button"
                                                onClick={() => setSelectedStructuresInternes(prev => prev.filter((_, i) => i !== index))}
                                                className="ml-1 text-uh2c-blue hover:text-red-600"
                                              >
                                                ×
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Structure Externe */}
                                {formDataOrganisation.typeStructure === "externe" && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                          <div>
                                        <Label htmlFor="structureExternePays" className="text-xs font-medium text-gray-600">
                                          Pays <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                          value={formDataOrganisation.structureExternePays}
                                          onValueChange={(value: string) =>
                                            setFormDataOrganisation((prev) => ({ 
                                              ...prev, 
                                              structureExternePays: value,
                                              structureExterneVille: "" // Reset ville quand le pays change
                                            }))
                                          }
                                        >
                                          <SelectTrigger className="mt-1 h-9 text-sm">
                                            <SelectValue placeholder="Sélectionnez le pays" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {paysMonde.map((pays) => ( 
                                              <SelectItem key={pays} value={pays}>{pays}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="structureExterneVille" className="text-xs font-medium text-gray-600">
                                          Ville <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                          value={formDataOrganisation.structureExterneVille}
                                          onValueChange={(value: string) =>
                                            setFormDataOrganisation((prev) => ({ ...prev, structureExterneVille: value }))
                                          }
                                          disabled={!formDataOrganisation.structureExternePays}
                                        >
                                          <SelectTrigger className="mt-1 h-9 text-sm">
                                            <SelectValue placeholder={formDataOrganisation.structureExternePays ? "Sélectionnez la ville" : "Sélectionnez d'abord un pays"} />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {formDataOrganisation.structureExternePays ? (
                                              getVillesByPays(formDataOrganisation.structureExternePays).map((ville) => ( 
                                                <SelectItem key={ville} value={ville}>{ville}</SelectItem>
                                              ))
                                            ) : (
                                              <SelectItem value="no-country" disabled>Sélectionnez d'abord un pays</SelectItem>
                                            )}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div>
                                      <Label htmlFor="structureExterneType" className="text-xs font-medium text-gray-600">
                                        Type de structure <span className="text-red-500">*</span>
                                      </Label>
                                      <Select
                                        value={formDataOrganisation.structureExterneType}
                                        onValueChange={(value: string) =>
                                          setFormDataOrganisation((prev) => ({ ...prev, structureExterneType: value }))
                                        }
                                      >
                                        <SelectTrigger className="mt-1 h-9 text-sm">
                                          <SelectValue placeholder="Sélectionnez le type de structure" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {typesStructuresExternes.map((type) => ( 
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="col-span-2">
                                <Label htmlFor="coOrganisateurs" className="text-xs font-medium text-gray-600">
                                  Co-organisateurs
                                </Label>
                                <Textarea
                                  id="coOrganisateurs"
                                  value={formDataOrganisation.coOrganisateurs}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, coOrganisateurs: e.target.value }))}
                                  placeholder="Liste des co-organisateurs (si applicable)"
                                  rows={2}
                                  className="mt-1 text-sm"
                                />
                              </div>
                              
                              {/* Affiche de la manifestation */}
                              <div className="col-span-2">
                                <Label className="text-xs font-medium text-gray-600">
                                  Affiche de la manifestation
                                </Label>
                                {!formDataOrganisation.afficheManifestation ? (
                                  <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all mt-1">
                                    <input 
                                      type="file" 
                                      accept=".jpg,.jpeg,.png,.pdf" 
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, afficheManifestation: e.target.files?.[0] || null }))} 
                                      className="hidden" 
                                      id="affiche-manifestation" 
                                    />
                                    <label htmlFor="affiche-manifestation" className="cursor-pointer">
                                      <div className="space-y-3">
                                        <div className="mx-auto w-16 h-16 rounded-lg bg-uh2c-blue/10 flex items-center justify-center">
                                          <FileText className="h-8 w-8 text-uh2c-blue" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-uh2c-blue">Cliquez pour télécharger ou glissez-déposez</p>
                                          <p className="text-xs text-uh2c-blue/70 mt-1">JPG, PNG, PDF jusqu'à 10MB</p>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 mt-1">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                      <FileText className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">{formDataOrganisation.afficheManifestation.name}</p>
                                      <p className="text-xs text-gray-500">{(formDataOrganisation.afficheManifestation.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => setFormDataOrganisation((prev) => ({ ...prev, afficheManifestation: null }))} 
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* 5. COORDONNATEUR 
                        DE LA MANIFESTATION */}
                        <Card className="bg-gray-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base text-gray-600">Coordonnateur de la manifestation</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                          <div>
                                <Label htmlFor="nomPrenomCoordinateur" className="text-xs font-medium text-gray-600">
                                  Nom & Prénom <span className="text-red-500">*</span>
                                </Label>
                            <Input
                              id="nomPrenomCoordinateur"
                                  value={formDataOrganisation.nomPrenomCoordinateur}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, nomPrenomCoordinateur: e.target.value }))}
                                  required
                                  placeholder="Saisissez votre nom et prénom"
                                  className="mt-1 h-9 text-sm bg-gray-100 text-gray-500"
                              readOnly 
                            />
                          </div>
                              <div>
                                <Label htmlFor="etablissementAttache" className="text-xs font-medium text-gray-600">
                                  Établissement d'attache <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="etablissementAttache"
                                  value={formDataOrganisation.etablissementAttache}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, etablissementAttache: e.target.value }))}
                                  required
                                  placeholder="Saisissez l'établissement d'attache"
                                  className="mt-1 h-9 text-sm bg-gray-100 text-gray-500"
                                  readOnly
                                />
                        </div>
                          <div>
                                <Label htmlFor="laboratoireAffiliation" className="text-xs font-medium text-gray-600">
                                  Laboratoire d'affiliation
                                </Label>
                                <Input
                                  id="laboratoireAffiliation"
                                  value={formDataOrganisation.laboratoireAffiliation}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, laboratoireAffiliation: e.target.value }))}
                                  placeholder="Saisissez le laboratoire d'affiliation"
                                  className="mt-1 h-9 text-sm bg-gray-100 text-gray-500"
                                  readOnly
                                />
                              </div>
                              <div>
                                <Label htmlFor="telephone" className="text-xs font-medium text-gray-600">
                                  Téléphone <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="telephone"
                                  value={formDataOrganisation.telephone}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, telephone: e.target.value }))}
                                  required
                                  placeholder="Saisissez votre numéro de téléphone"
                                  className="mt-1 h-9 text-sm bg-gray-100 text-gray-500"
                                  readOnly
                                />
                              </div>
                              <div>
                                <Label htmlFor="email" className="text-xs font-medium text-gray-600">
                                  Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={formDataOrganisation.email}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, email: e.target.value }))}
                                  required
                                  placeholder="Saisissez votre adresse email"
                                  className="mt-1 h-9 text-sm bg-gray-100 text-gray-500"
                                  readOnly
                                />
                              </div>
                              <div className="col-span-2">
                                <Label htmlFor="adresse" className="text-xs font-medium text-gray-600">
                                  Adresse
                                </Label>
                                <Textarea
                                  id="adresse"
                                  value={formDataOrganisation.adresse}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, adresse: e.target.value }))}
                                  placeholder="Saisissez votre adresse complète"
                                  rows={2}
                                  className="mt-1 text-sm bg-gray-100 text-gray-500"
                                  readOnly
                                />
                              </div>
                              <div className="col-span-2">
                                <div className="flex items-center space-x-4 opacity-60">
                                  <Label className="text-xs font-medium text-gray-600">Avez-vous déjà bénéficié d'un soutien de la part de l'UH2C ?</Label>
                                  <div className="flex space-x-4">
                                    <label className="flex items-center">
                                  <input
                                        type="radio"
                                        name="dejaBeneficieSoutien"
                                        checked={formDataOrganisation.dejaBeneficieSoutien === true}
                                        onChange={() => setFormDataOrganisation((prev) => ({ ...prev, dejaBeneficieSoutien: true }))}
                                        className="mr-2"
                                        disabled
                                      />
                                      OUI
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="radio"
                                        name="dejaBeneficieSoutien"
                                        checked={formDataOrganisation.dejaBeneficieSoutien === false}
                                        onChange={() => setFormDataOrganisation((prev) => ({ ...prev, dejaBeneficieSoutien: false }))}
                                        className="mr-2"
                                        disabled
                                      />
                                      NON
                                  </label>
                                </div>
                            </div>
                          </div>
                              {formDataOrganisation.dejaBeneficieSoutien && (
                                <>
                                  <div>
                                    <Label htmlFor="manifestationsPrecedentes" className="text-xs font-medium text-gray-600">
                                      Pour quelle(s) manifestation(s) ?
                                    </Label>
                                    <Input
                                      id="manifestationsPrecedentes"
                                      value={formDataOrganisation.manifestationsPrecedentes}
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, manifestationsPrecedentes: e.target.value }))}
                                      placeholder="Indiquez les manifestations précédentes"
                                      className="mt-1 h-9 text-sm bg-gray-100 text-gray-500"
                                      readOnly
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="dateManifestationsPrecedentes" className="text-xs font-medium text-gray-600">
                                      Date
                                    </Label>
                                    <Input
                                      id="dateManifestationsPrecedentes"
                                      type="date"
                                      value={formDataOrganisation.dateManifestationsPrecedentes}
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, dateManifestationsPrecedentes: e.target.value }))}
                                      className="mt-1 h-9 text-sm bg-gray-100 text-gray-500"
                                      readOnly
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* 6. DESCRIPTION DE LA MANIFESTATION */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Description de la manifestation</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                          <div>
                              <Label htmlFor="description" className="text-xs font-medium text-gray-600">
                                Présentation générale, objectifs, retombées scientifiques attendues, publication des actes <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="description"
                                value={formDataOrganisation.description}
                                onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, description: e.target.value }))}
                                required
                                placeholder="Décrivez la manifestation, ses objectifs et retombées attendues"
                                rows={6}
                                className="mt-1 text-sm"
                              />
                          </div>       
                          </CardContent>
                        </Card>

                        {/* 7. COMPOSITION DU COMITÉ SCIENTIFIQUE */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Composition du comité scientifique</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="comiteScientifique" className="text-xs font-medium text-gray-600">
                                Liste des membres du Comité scientifique <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="comiteScientifique"
                                value={formDataOrganisation.comiteScientifique}
                                onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, comiteScientifique: e.target.value }))}
                                required
                                placeholder="Indiquez leur titre, fonction, institution et pays d'origine, ainsi que leurs lettres d'engagement"
                                rows={5}
                                className="mt-1 text-sm"
                              />
                        </div>
                          </CardContent>
                        </Card>

                        {/* 8. COMPOSITION DU COMITÉ D'ORGANISATION */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Composition du comité d'organisation</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                          <div>
                              <Label htmlFor="comiteOrganisation" className="text-xs font-medium text-gray-600">
                                Liste des membres du Comité d'organisation <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="comiteOrganisation"
                                value={formDataOrganisation.comiteOrganisation}
                                onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, comiteOrganisation: e.target.value }))}
                                required
                                placeholder="Indiquez leur titre, fonction, institution et pays d'origine"
                                rows={5}
                                className="mt-1 text-sm"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* 9. NOMBRE PRÉVU D'INTERVENANTS */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">NOMBRE PRÉVU D'INTERVENANTS (Conférenciers, Panélistes, Sessions plénières)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="intervenantsUh2c" className="text-xs font-medium text-gray-600">
                                  UH2C <span className="text-red-500">*</span>
                                </Label>
                            <Input
                                  id="intervenantsUh2c"
                                  type="number"
                                  value={formDataOrganisation.intervenantsUh2c}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, intervenantsUh2c: parseInt(e.target.value) || 0 }))}
                                  required
                                  min="0"
                                  className="mt-1 h-9 text-sm"
                            />
                          </div>
                              <div>
                                <Label htmlFor="intervenantsUniversitesNationales" className="text-xs font-medium text-gray-600">
                                  Universités Nationales <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="intervenantsUniversitesNationales"
                                  type="number"
                                  value={formDataOrganisation.intervenantsUniversitesNationales}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, intervenantsUniversitesNationales: parseInt(e.target.value) || 0 }))}
                                  required
                                  min="0"
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label htmlFor="intervenantsUniversitesInternationales" className="text-xs font-medium text-gray-600">
                                  Universités Internationales <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="intervenantsUniversitesInternationales"
                                  type="number"
                                  value={formDataOrganisation.intervenantsUniversitesInternationales}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, intervenantsUniversitesInternationales: parseInt(e.target.value) || 0 }))}
                                  required
                                  min="0"
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="intervenantsSecteursSocio" className="text-xs font-medium text-gray-600">
                                  Secteurs Socio-économiques <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="intervenantsSecteursSocio"
                                  type="number"
                                  value={formDataOrganisation.intervenantsSecteursSocio}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, intervenantsSecteursSocio: parseInt(e.target.value) || 0 }))}
                                  required
                                  min="0"
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* 10. NOMBRE ESTIMÉ DE PARTICIPANTS */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Nombre estimé de participants (Communication orale, poster)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                                <Label htmlFor="participantsUh2c" className="text-xs font-medium text-gray-600">
                                  UH2C <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="participantsUh2c"
                                  type="number"
                                  value={formDataOrganisation.participantsUh2c}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, participantsUh2c: parseInt(e.target.value) || 0 }))}
                                  required
                                  min="0"
                                  className="mt-1 h-9 text-sm"
                                />
                                </div>
                              <div>
                                <Label htmlFor="participantsUniversitesNationales" className="text-xs font-medium text-gray-600">
                                  Universités Nationales <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="participantsUniversitesNationales"
                                  type="number"
                                  value={formDataOrganisation.participantsUniversitesNationales}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, participantsUniversitesNationales: parseInt(e.target.value) || 0 }))}
                                  required
                                  min="0"
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="participantsUniversitesInternationales" className="text-xs font-medium text-gray-600">
                                  Universités Internationales <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="participantsUniversitesInternationales"
                                  type="number"
                                  value={formDataOrganisation.participantsUniversitesInternationales}
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, participantsUniversitesInternationales: parseInt(e.target.value) || 0 }))}
                                  required
                                  min="0"
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* 11. PROGRAMME PRÉVISIONNEL */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Programme prévisionnel</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="programmePrevisionnel" className="text-xs font-medium text-gray-600">
                                Programme prévisionnel <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="programmePrevisionnel"
                                value={formDataOrganisation.programmePrevisionnel}
                                onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, programmePrevisionnel: e.target.value }))}
                                required
                                placeholder="Ordre du jour, calendrier, nombre et thèmes des ateliers par ½ journée de travail"
                                rows={4}
                                className="mt-1 text-sm"
                              />
                            </div>
                            
                            {/* Champ de téléchargement du document */}
                            <div>
                              <Label className="text-xs font-medium text-gray-600">
                                Document du programme prévisionnel
                              </Label>
                              {!formDataOrganisation.programmePrevisionnelDocument ? (
                                <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all mt-1">
                                  <input
                                    type="file" 
                                    accept=".pdf,.doc,.docx" 
                                    onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, programmePrevisionnelDocument: e.target.files?.[0] || null }))} 
                                    className="hidden" 
                                    id="programme-previsionnel-document" 
                                  />
                                  <label htmlFor="programme-previsionnel-document" className="cursor-pointer">
                                    <div className="space-y-3">
                                      <div className="mx-auto w-16 h-16 rounded-lg bg-uh2c-blue/10 flex items-center justify-center">
                                        <FileText className="h-8 w-8 text-uh2c-blue" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-uh2c-blue">Cliquez pour télécharger ou glissez-déposez</p>
                                        <p className="text-xs text-uh2c-blue/70 mt-1">PDF, DOC, DOCX jusqu'à 10MB</p>
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 mt-1">
                                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-green-600" />
                            </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{formDataOrganisation.programmePrevisionnelDocument.name}</p>
                                    <p className="text-xs text-gray-500">{(formDataOrganisation.programmePrevisionnelDocument.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                                  <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setFormDataOrganisation((prev) => ({ ...prev, programmePrevisionnelDocument: null }))} 
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="argumentaireJustification" className="text-xs font-medium text-gray-600">
                                Argumentaire résumé justifiant la demande <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="argumentaireJustification"
                                value={formDataOrganisation.argumentaireJustification}
                                onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, argumentaireJustification: e.target.value }))}
                                required
                                placeholder="Justifiez la demande de soutien pour cette manifestation"
                                rows={3}
                                className="mt-1 text-sm"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* 12. INDEXATION */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Indexation</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                          <div>
                              <Label className="text-xs font-medium text-gray-600 mb-3 block">
                                Demande d'indexation <span className="text-red-500">*</span>
                              </Label>
                              
                              {/* Radio buttons Oui/Non */}
                              <div className="flex space-x-6 mb-4">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="indexationDemandee"
                                    value="oui"
                                    checked={formDataOrganisation.indexationDemandee === "oui"}
                                    onChange={(e) => setFormDataOrganisation((prev) => ({ 
                                      ...prev, 
                                      indexationDemandee: e.target.value as "oui" | "non"
                                    }))}
                                    className="mr-2"
                                  />
                                  Oui
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="indexationDemandee"
                                    value="non"
                                    checked={formDataOrganisation.indexationDemandee === "non"}
                                    onChange={(e) => setFormDataOrganisation((prev) => ({ 
                                      ...prev, 
                                      indexationDemandee: e.target.value as "oui" | "non"
                                    }))}
                                    className="mr-2"
                                  />
                                  Non
                                </label>
                              </div>

                              {/* Sélection de la base d'indexation (visible seulement si "Oui" est sélectionné) */}
                              {formDataOrganisation.indexationDemandee === "oui" && (
                                <div className="mt-4">
                                  <Label htmlFor="baseIndexation" className="text-xs font-medium text-gray-600">
                                    Base d'indexation <span className="text-red-500">*</span>
                                  </Label>
                            <Select
                                    value={formDataOrganisation.baseIndexation}
                                    onValueChange={(value: "scopus" | "wos") =>
                                      setFormDataOrganisation((prev) => ({ ...prev, baseIndexation: value }))
                                    }
                                  >
                                    <SelectTrigger className="mt-1 h-9 text-sm">
                                      <SelectValue placeholder="Sélectionnez la base d'indexation" />
                              </SelectTrigger>
                              <SelectContent>
                                      <SelectItem value="scopus">Scopus</SelectItem>
                                      <SelectItem value="wos">Web of Science (WoS)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>       
                              )}
                        </div>
                          </CardContent>
                        </Card>

                        {/* 14. PRÉVISIONS BUDGÉTAIRES */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Prévisions budgétaires de la manifestation</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-8">
                            
                            {/* Note sur la devise */}
                            <p className="text-xs text-gray-500 mb-4">
                              Tous les montants doivent être saisis en dirham marocain (DH)
                            </p>
                            
                            {/* Estimation Dépenses */}
                            <div className="border border-gray-200 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Estimation Dépenses</h4>
                              <div className="space-y-4">
                          <div>
                                  <Label htmlFor="fraisTraduction" className="text-xs font-medium text-gray-600">
                                    Frais de traduction (DH) <span className="text-red-500">*</span>
                                  </Label>
                            <Input
                                    id="fraisTraduction"
                                    type="number"
                                    value={formDataOrganisation.fraisTraduction}
                                    onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, fraisTraduction: parseFloat(e.target.value) || 0 }))}
                                    min="0"
                                    className="mt-1 h-9 text-sm"
                                    placeholder="0"
                            />
                          </div>

                          <div>
                                  <Label htmlFor="fraisRestaurationCafe" className="text-xs font-medium text-gray-600">
                                    Restauration (repas & café) (DH) <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id="fraisRestaurationCafe"
                                    type="number"
                                    value={formDataOrganisation.fraisRestaurationCafe}
                                    onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, fraisRestaurationCafe: parseFloat(e.target.value) || 0 }))}
                                    min="0"
                                    className="mt-1 h-9 text-sm"
                                    placeholder="0"
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="autresFrais" className="text-xs font-medium text-gray-600">
                                    Autres frais (DH) <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id="autresFrais"
                                    type="number"
                                    value={formDataOrganisation.autresFrais}
                                    onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, autresFrais: parseFloat(e.target.value) || 0 }))}
                                    min="0"
                                    className="mt-1 h-9 text-sm"
                                    placeholder="0"
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="autresFraisDescription" className="text-xs font-medium text-gray-600">
                                    Précisez les autres frais
                                  </Label>
                                  <Input
                                    id="autresFraisDescription"
                                    value={formDataOrganisation.autresFraisDescription}
                                    onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, autresFraisDescription: e.target.value }))}
                                    className="mt-1 h-9 text-sm"
                                    placeholder="Décrivez les autres frais"
                                  />
                                </div>
                            </div>
                          </div>

                            {/* Estimation Recettes */}
                            <div className="border border-gray-200 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Estimation Recettes</h4>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="totalPartSoliciteePresidence" className="text-xs font-medium text-gray-600">
                                    Total part sollicitée par la présidence (DH) <span className="text-red-500">*</span>
                                  </Label>
                                  <Input
                                    id="totalPartSoliciteePresidence"
                                    type="number"
                                    value={formDataOrganisation.totalPartSoliciteePresidence}
                                    onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, totalPartSoliciteePresidence: parseFloat(e.target.value) || 0 }))}
                                    min="0"
                                    className="mt-1 h-9 text-sm"
                                    placeholder="0"
                                  />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="sponsoring" className="text-xs font-medium text-gray-600">
                                      Sponsoring (DH)
                                    </Label>
                                    <Input
                                      id="sponsoring"
                                      type="number"
                                      value={formDataOrganisation.sponsoring}
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, sponsoring: parseFloat(e.target.value) || 0 }))}
                                      min="0"
                                      className="mt-1 h-9 text-sm"
                                      placeholder="0"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="sponsoringDescription" className="text-xs font-medium text-gray-600">
                                      Détails du sponsoring
                                    </Label>
                                    <Input
                                      id="sponsoringDescription"
                                      value={formDataOrganisation.sponsoringDescription}
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, sponsoringDescription: e.target.value }))}
                                      className="mt-1 h-9 text-sm"
                                      placeholder="Décrivez le sponsoring"
                                    />
                                  </div>
                                </div>
                                
                                {/* Tableau frais d'inscription */}
                                <div>
                                  <Label className="text-xs font-medium text-gray-600 mb-3 block">
                                    Frais d'inscription par participant (DH)
                                  </Label>
                                  <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300 text-sm">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="border border-gray-300 p-2 text-left font-medium text-gray-700">Catégorie</th>
                                          <th className="border border-gray-300 p-2 text-center font-medium text-gray-700">National</th>
                                          <th className="border border-gray-300 p-2 text-center font-medium text-gray-700">International</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="border border-gray-300 p-2 font-medium text-gray-700">Chercheur doctorant</td>
                                          <td className="border border-gray-300 p-2">
                                            <Input
                                              type="number"
                                              value={formDataOrganisation.fraisInscriptionDoctorantNational}
                                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, fraisInscriptionDoctorantNational: parseFloat(e.target.value) || 0 }))}
                                              min="0"
                                              className="h-8 text-sm text-center"
                                              placeholder="0"
                                            />
                                          </td>
                                          <td className="border border-gray-300 p-2">
                                            <Input
                                              type="number"
                                              value={formDataOrganisation.fraisInscriptionDoctorantInternational}
                                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, fraisInscriptionDoctorantInternational: parseFloat(e.target.value) || 0 }))}
                                              min="0"
                                              className="h-8 text-sm text-center"
                                              placeholder="0"
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border border-gray-300 p-2 font-medium text-gray-700">Enseignant chercheur</td>
                                          <td className="border border-gray-300 p-2">
                                            <Input
                                              type="number"
                                              value={formDataOrganisation.fraisInscriptionEnseignantNational}
                                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, fraisInscriptionEnseignantNational: parseFloat(e.target.value) || 0 }))}
                                              min="0"
                                              className="h-8 text-sm text-center"
                                              placeholder="0"
                                            />
                                          </td>
                                          <td className="border border-gray-300 p-2">
                                            <Input
                                              type="number"
                                              value={formDataOrganisation.fraisInscriptionEnseignantInternational}
                                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, fraisInscriptionEnseignantInternational: parseFloat(e.target.value) || 0 }))}
                                              min="0"
                                              className="h-8 text-sm text-center"
                                              placeholder="0"
                                            />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="border border-gray-300 p-2 font-medium text-gray-700">Industriel</td>
                                          <td className="border border-gray-300 p-2">
                                            <Input
                                              type="number"
                                              value={formDataOrganisation.fraisInscriptionIndustrielNational}
                                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, fraisInscriptionIndustrielNational: parseFloat(e.target.value) || 0 }))}
                                              min="0"
                                              className="h-8 text-sm text-center"
                                              placeholder="0"
                                            />
                                          </td>
                                          <td className="border border-gray-300 p-2">
                                            <Input
                                              type="number"
                                              value={formDataOrganisation.fraisInscriptionIndustrielInternational}
                                              onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, fraisInscriptionIndustrielInternational: parseFloat(e.target.value) || 0 }))}
                                              min="0"
                                              className="h-8 text-sm text-center"
                                              placeholder="0"
                                            />
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                        </div> 
                        
                          </CardContent>
                        </Card>


                        {/* 15. AVIS MOTIVÉ DU RESPONSABLE DE LA STRUCTURE DE RECHERCHE */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Avis motivé du responsable de la structure de recherche (Laboratoire, Équipe, …)</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                          <div>
                              <Label htmlFor="avisResponsableStructure" className="text-xs font-medium text-gray-600">
                                Avis du responsable
                              </Label>
                            <Textarea
                                id="avisResponsableStructure"
                                value={formDataOrganisation.avisResponsableStructure}
                                onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, avisResponsableStructure: e.target.value }))}
                                placeholder="Saisissez l'avis motivé du responsable de la structure de recherche"
                                rows={4}
                                className="mt-1 text-sm"
                            />
                          </div>
                          </CardContent>
                        </Card>

                        {/* 16. AVIS DE LA COMMISSION RECHERCHE DU CONSEIL D'ÉTABLISSEMENT */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Avis de la commission recherche du conseil d'établissement</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                          <div>
                              <Label htmlFor="avisCommissionRechercheEtablissement" className="text-xs font-medium text-gray-600">
                                Avis de la commission recherche du conseil d'établissement
                            </Label>
                              <Textarea
                                id="avisCommissionRechercheEtablissement"
                                value={formDataOrganisation.avisCommissionRechercheEtablissement}
                                onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, avisCommissionRechercheEtablissement: e.target.value }))}
                                placeholder="Saisissez l'avis de la commission recherche du conseil d'établissement"
                                rows={3}
                                className="mt-1 text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="avisChefEtablissement" className="text-xs font-medium text-gray-600">
                                Avis du chef d'établissement
                              </Label>
                              <Textarea
                                id="avisChefEtablissement"
                                value={formDataOrganisation.avisChefEtablissement}
                                onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, avisChefEtablissement: e.target.value }))}
                                placeholder="Saisissez l'avis du chef d'établissement"
                                rows={3}
                                className="mt-1 text-sm"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* 17. AVIS DE LA COMMISSION RECHERCHE DU CONSEIL D'UNIVERSITÉ */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Avis de la commission « recherche » du conseil d'université</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label htmlFor="avisCommissionRechercheConseilUniversite" className="text-xs font-medium text-gray-600">
                                Avis de la commission recherche du conseil d'université
                              </Label>
                              <Textarea
                                id="avisCommissionRechercheConseilUniversite"
                                value={formDataOrganisation.avisCommissionRechercheConseilUniversite}
                                onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, avisCommissionRechercheConseilUniversite: e.target.value }))}
                                placeholder="Saisissez l'avis de la commission recherche du conseil d'université"
                                rows={4}
                                className="mt-1 text-sm"
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* DOSSIER À FOURNIR */}
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Dossier à fournir</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Demande manuscrite */}
                              <div className="space-y-3">
                                <Label className="text-xs font-medium text-gray-600">
                                  Demande manuscrite adressée à Monsieur le Président de l'Université
                                </Label>
                                {!formDataOrganisation.demandeManuscrite ? (
                                  <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                              <input
                                type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, demandeManuscrite: e.target.files?.[0] || null }))}
                                className="hidden"
                                      id="demande-manuscrite"
                              />
                                    <label htmlFor="demande-manuscrite" className="cursor-pointer">
                                <div className="space-y-3">
                                        <div className="mx-auto w-16 h-16 rounded-lg bg-uh2c-blue/10 flex items-center justify-center">
                                          <FileText className="h-8 w-8 text-uh2c-blue" />
                                  </div>
                                  <div>
                                          <p className="text-sm font-medium text-uh2c-blue">
                                      Cliquez pour télécharger ou glissez-déposez
                                    </p>
                                          <p className="text-xs text-uh2c-blue/70 mt-1">
                                      PDF, DOC, DOCX jusqu'à 10MB
                                    </p>
                                  </div>
                                      </div>
                                    </label>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                      <FileText className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {formDataOrganisation.demandeManuscrite.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(formDataOrganisation.demandeManuscrite.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setFormDataOrganisation((prev) => ({ ...prev, demandeManuscrite: null }))}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Formulaire de demande */}
                              <div className="space-y-3">
                                <Label className="text-xs font-medium text-gray-600">
                                  Formulaire de demande de soutien (disponible sur le site de l'Université)
                                </Label>
                                {!formDataOrganisation.formulaireDemande ? (
                                  <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                    <input
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, formulaireDemande: e.target.files?.[0] || null }))}
                                      className="hidden"
                                      id="formulaire-demande"
                                    />
                                    <label htmlFor="formulaire-demande" className="cursor-pointer">
                                      <div className="space-y-3">
                                        <div className="mx-auto w-16 h-16 rounded-lg bg-uh2c-blue/10 flex items-center justify-center">
                                          <FileText className="h-8 w-8 text-uh2c-blue" />
                                </div>
                                <div>
                                          <p className="text-sm font-medium text-uh2c-blue">
                                            Cliquez pour télécharger ou glissez-déposez
                                          </p>
                                          <p className="text-xs text-uh2c-blue/70 mt-1">
                                            PDF, DOC, DOCX jusqu'à 10MB
                                          </p>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                      <FileText className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {formDataOrganisation.formulaireDemande.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(formDataOrganisation.formulaireDemande.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setFormDataOrganisation((prev) => ({ ...prev, formulaireDemande: null }))}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                               </div>
                                
                              {/* Fiche financière */}
                              <div className="space-y-3">
                                <Label className="text-xs font-medium text-gray-600">
                                  Fiche financière prévisionnelle (recettes, dépenses)
                                </Label>
                                {!formDataOrganisation.ficheFinanciere ? (
                                  <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                    <input
                                      type="file"
                                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, ficheFinanciere: e.target.files?.[0] || null }))}
                                      className="hidden"
                                      id="fiche-financiere"
                                    />
                                    <label htmlFor="fiche-financiere" className="cursor-pointer">
                                      <div className="space-y-3">
                                        <div className="mx-auto w-16 h-16 rounded-lg bg-uh2c-blue/10 flex items-center justify-center">
                                          <FileText className="h-8 w-8 text-uh2c-blue" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-uh2c-blue">
                                            Cliquez pour télécharger ou glissez-déposez
                                          </p>
                                          <p className="text-xs text-uh2c-blue/70 mt-1">
                                            PDF, DOC, DOCX, XLS, XLSX jusqu'à 10MB
                                          </p>
                                        </div>
                                      </div>
                              </label>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                      <FileText className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {formDataOrganisation.ficheFinanciere.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(formDataOrganisation.ficheFinanciere.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setFormDataOrganisation((prev) => ({ ...prev, ficheFinanciere: null }))}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Programme final */}
                              <div className="space-y-3">
                                <Label className="text-xs font-medium text-gray-600">
                                  Programme final ou prévisionnel de la manifestation
                                </Label>
                                {!formDataOrganisation.programmeFinal ? (
                                  <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                    <input
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, programmeFinal: e.target.files?.[0] || null }))}
                                      className="hidden"
                                      id="programme-final"
                                    />
                                    <label htmlFor="programme-final" className="cursor-pointer">
                                      <div className="space-y-3">
                                        <div className="mx-auto w-16 h-16 rounded-lg bg-uh2c-blue/10 flex items-center justify-center">
                                          <FileText className="h-8 w-8 text-uh2c-blue" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-uh2c-blue">
                                            Cliquez pour télécharger ou glissez-déposez
                                          </p>
                                          <p className="text-xs text-uh2c-blue/70 mt-1">
                                            PDF, DOC, DOCX jusqu'à 10MB
                                          </p>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                      <FileText className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">
                                        {formDataOrganisation.programmeFinal.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(formDataOrganisation.programmeFinal.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setFormDataOrganisation((prev) => ({ ...prev, programmeFinal: null }))}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Pièces justificatives */}
                            <div className="space-y-3">
                              <Label className="text-xs font-medium text-gray-600">
                                Toutes pièces jugées justificatives nécessaires (dépliant, affiche, actes de précédentes éditions, …)
                              </Label>
                              <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                <input
                                  type="file"
                                  multiple
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                  onChange={(e) => setFormDataOrganisation((prev) => ({ ...prev, piecesJustificatives: Array.from(e.target.files || []) }))}
                                  className="hidden"
                                  id="pieces-justificatives"
                                />
                                <label htmlFor="pieces-justificatives" className="cursor-pointer">
                                  <div className="space-y-3">
                                    <div className="mx-auto w-16 h-16 rounded-lg bg-uh2c-blue/10 flex items-center justify-center">
                                      <Upload className="h-8 w-8 text-uh2c-blue" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-uh2c-blue">
                                        Cliquez pour télécharger ou glissez-déposez
                                      </p>
                                      <p className="text-xs text-uh2c-blue/70 mt-1">
                                        PDF, DOC, DOCX, JPG, PNG jusqu'à 10MB chacun
                                      </p>
                                      <p className="text-xs text-uh2c-blue/70 mt-1">
                                        Vous pouvez sélectionner plusieurs fichiers
                                      </p>
                                    </div>
                                  </div>
                                </label>
                              </div>
                              
                              {/* Liste des fichiers uploadés */}
                              {formDataOrganisation.piecesJustificatives.length > 0 && (
                                <div className="space-y-2">
                                  {formDataOrganisation.piecesJustificatives.map((file, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                        <FileText className="h-5 w-5 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                        {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newFiles = formDataOrganisation.piecesJustificatives.filter((_, i) => i !== index)
                                          setFormDataOrganisation(prev => ({ ...prev, piecesJustificatives: newFiles }))
                                        }}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Boutons d'action */}
                        <div className="flex justify-end space-x-2 pt-6 border-t">
                          <Button type="button" variant="outline" onClick={() => setIsModalOpenOrganisation(false)}>
                            Annuler
                          </Button>
                          <Button type="submit" className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                            Envoyer la demande
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              <p className="text-xs text-gray-600 mt-1">Demander l'organisation d'une manifestation scientifique</p>
                </div>

            {/* Section de filtrage */}
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
                    placeholder="Rechercher une manifestation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-6 h-7 text-xs"
                      />
                    </div>

                {/* Filtres par dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <Label className="text-xs font-medium">Date début</Label>
                  </div>
                    <Input
                      type="date"
                      value={dateDebutFilter}
                      onChange={(e) => setDateDebutFilter(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <Label className="text-xs font-medium">Date fin</Label>
                    </div>
                    <Input
                      type="date"
                      value={dateFinFilter}
                      onChange={(e) => setDateFinFilter(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>

                {/* Filtres par localisation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <Label className="text-xs font-medium">Ville</Label>
                    </div>
                    <Select value={villeFilter} onValueChange={setVilleFilter}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Toutes les villes" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les villes</SelectItem>
                        <SelectItem value="casablanca">Casablanca</SelectItem>
                        <SelectItem value="rabat">Rabat</SelectItem>
                        <SelectItem value="marrakech">Marrakech</SelectItem>
                        <SelectItem value="fes">Fès</SelectItem>
                        <SelectItem value="tanger">Tanger</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <Label className="text-xs font-medium">Pays</Label>
                    </div>
                    <Select value={paysFilter} onValueChange={setPaysFilter}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Tous les pays" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les pays</SelectItem>
                        <SelectItem value="maroc">Maroc</SelectItem>
                        <SelectItem value="france">France</SelectItem>
                        <SelectItem value="espagne">Espagne</SelectItem>
                        <SelectItem value="algerie">Algérie</SelectItem>
                        <SelectItem value="tunisie">Tunisie</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Liste des Demandes d'Organisation de Manifestations</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent>

                {filteredDemandesOrganisations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50">
                          <TableHead className="text-black font-semibold">Intitulé</TableHead>
                          <TableHead className="text-black font-semibold">Type</TableHead>
                          <TableHead className="text-black font-semibold">Lieu</TableHead>
                        <TableHead className="text-black font-semibold">Date</TableHead>
                        <TableHead className="text-black font-semibold">Statut</TableHead>
                        <TableHead className="text-right text-black font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDemandesOrganisations.map((item) => (
                          <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.intitule}</TableCell>
                            <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                            </TableCell>
                            <TableCell>{item.lieu}</TableCell>
                            <TableCell>
                            {new Date(item.dateDebut).toLocaleDateString("fr-FR")} - {new Date(item.dateFin).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell>
                            <Badge variant={item.statutIndexation === "Obtenu" ? "default" : "secondary"}>
                              {item.statutIndexation}
                            </Badge>
                            </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm || typeFilter !== "all" || yearFilter !== "all"
                        ? "Aucune demande trouvée avec ces critères"
                        : "Commencez par ajouter une nouvelle manifestation"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}


