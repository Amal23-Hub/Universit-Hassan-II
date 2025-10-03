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
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, ExternalLink, FileText, Check, Calendar, X, Users, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { paysMonde, getVillesByPays } from "@/lib/pays-villes"
import { Textarea } from "@/components/ui/textarea"
import { etabUh2c } from "@/lib/etab-uh2c"
import { DemandeParticipation, listeDemandesParticipationsManifestations } from "@/lib/demandes-participations-member"

import { useParticipation } from '@/lib/participation-context'

// Interface pour les manifestations existantes
interface ManifestationExistante {
  id: string
  nature: string
  intitule: string
  dateDebut: string
  dateFin: string
  ville: string
  pays: string
  statut: "Validée" | "En attente" | "Rejetée"
}

//DATA chercheurs
const chercheurs: string[] = [
  "Naciri Mohamed", "Kadiri Jawad", "Amrani Lamia", "yhyawi Fouad", "Amrawi Imane"
]

// Données de manifestations existantes (simulées)
const manifestationsExistantes: ManifestationExistante[] = [
  {
    id: "1",
    nature: "Conférence",
    intitule: "International Conference on Artificial Intelligence",
    dateDebut: "2024-06-15",
    dateFin: "2024-06-17",
    ville: "Paris",
    pays: "France",
    statut: "Validée"
  },
  {
    id: "2",
    nature: "Congrès",
    intitule: "World Congress on Machine Learning",
    dateDebut: "2024-07-20",
    dateFin: "2024-07-25",
    ville: "Londres",
    pays: "Royaume-Uni",
    statut: "Validée"
  },
  {
    id: "3",
    nature: "Séminaire",
    intitule: "Advanced Data Science Workshop",
    dateDebut: "2024-08-10",
    dateFin: "2024-08-12",
    ville: "Berlin",
    pays: "Allemagne",
    statut: "En attente"
  },
  {
    id: "4",
    nature: "Colloque",
    intitule: "Digital Transformation in Education",
    dateDebut: "2024-09-05",
    dateFin: "2024-09-07",
    ville: "Madrid",
    pays: "Espagne",
    statut: "Validée"
  }
]

export default function ParticipationManifestationMember() {

  /***************Traitement****************/
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [dateDebutFilter, setDateDebutFilter] = useState("")
  const [dateFinFilter, setDateFinFilter] = useState("")
  const [villeFilter, setVilleFilter] = useState<string>("all")
  const [paysFilter, setPaysFilter] = useState<string>("all")
  const { toast } = useToast()

  const { addDemandeParticipation } = useParticipation()
  const {demandesParticipations} = useParticipation()

  const [nomPrenomUserConnecte, setNomPrenomUserConnecte]=useState<string>("Elkanoun Mohamed")
  //NB IU: dév StateManagG SécG FrontG(nomPrenomUserConnecte-username)!!!

  // État pour les villes disponibles basé sur le pays sélectionné
  const [villesDisponibles, setVillesDisponibles] = useState<string[]>([])

  
  const filteredDemandesParticipations = demandesParticipations.filter((item) => {
    const matchesSearch =
      item.nomPrenomDemandeur.includes(nomPrenomUserConnecte) &&
      (item.intituleManifestation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.villeManifestation.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === "all" || item.natureManifestation === typeFilter
    const matchesYear = yearFilter === "all" || item.dateManifestation.startsWith(yearFilter)
    const matchesDateDebut = !dateDebutFilter || item.dateManifestation >= dateDebutFilter
    const matchesDateFin = !dateFinFilter || item.dateManifestation <= dateFinFilter
    const matchesVille = villeFilter === "all" || item.villeManifestation.toLowerCase().includes(villeFilter.toLowerCase())
    const matchesPays = paysFilter === "all" || item.paysManifestation.toLowerCase().includes(paysFilter.toLowerCase())
    return matchesSearch && matchesType && matchesYear && matchesDateDebut && matchesDateFin && matchesVille && matchesPays
  })
  

  // Obtenir la date actuelle pour limiter la sélection
  const getCurrentDate = () => new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const years = Array.from(new Set(demandesParticipations.map((item) => item.dateManifestation.split("-")[0]))).sort()

  /* Traitements Globaes demandes participations manifestations */
  const [isModalOpenParticipation, setIsModalOpenParticipation] = useState(false)
  
  // États pour le processus de participation
  const [etapeProcessus, setEtapeProcessus] = useState<"recherche" | "selection" | "nouvelle">("recherche")
  const [manifestationSelectionnee, setManifestationSelectionnee] = useState<ManifestationExistante | null>(null)
  const [rechercheManifestation, setRechercheManifestation] = useState("")
  const [filtreVilleManifestation, setFiltreVilleManifestation] = useState("")
  const [filtrePaysManifestation, setFiltrePaysManifestation] = useState("")
  const [filtreDateDebutManifestation, setFiltreDateDebutManifestation] = useState("")
  const [filtreDateFinManifestation, setFiltreDateFinManifestation] = useState("")
  const [justificatifParticipation, setJustificatifParticipation] = useState<File | null>(null)

  const [formDataParticipation, setFormDataParticipation] = useState({
    natureManifestation: "Congrès" as "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage",
    naturePriseEnCharge: "Billet d'avion" as "Frais de séjour" | "Billet d'avion",
    intituleManifestation: "",
    paysManifestation: "",
    villeManifestation: "",
    dateManifestation: "",
    dateFinManifestation: "",
    // Nouveaux champs pour les avis
    avisResponsableStructure: "",
    avisCommissionRechercheEtablissement: "",
    avisResponsableEtablissement: "",
    avisCommissionRechercheConseilUniversite: "",
    // Documents à fournir
    documentsFournis: {
      demandeOfficielle: null as File | null,
      lettreInvitation: null as File | null,
      programmeManifestation: null as File | null,
      resumeCommunication: null as File | null,
      formulaireMobilite: null as File | null,
      copieCarteEtudiant: null as File | null,
      rapportMission: null as File | null
    }
  })


  const resetFormDataParticipation = () => {
    setFormDataParticipation({
      natureManifestation: "Congrès" as "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage",
      naturePriseEnCharge: "Billet d'avion" as "Frais de séjour" | "Billet d'avion",   
      intituleManifestation: "",
      paysManifestation: "",
      villeManifestation: "",
      dateManifestation: "",
      dateFinManifestation: "",
      // Nouveaux champs pour les avis
      avisResponsableStructure: "",
      avisCommissionRechercheEtablissement: "",
      avisResponsableEtablissement: "",
      avisCommissionRechercheConseilUniversite: "",
      // Documents à fournir
      documentsFournis: {
        demandeOfficielle: null,
        lettreInvitation: null,
        programmeManifestation: null,
        resumeCommunication: null,
        formulaireMobilite: null,
        copieCarteEtudiant: null,
        rapportMission: null
      }
    })
  }

  // Fonction pour filtrer les manifestations existantes
  const manifestationsFiltrees = manifestationsExistantes.filter((manifestation) => {
    const matchesRecherche = manifestation.intitule.toLowerCase().includes(rechercheManifestation.toLowerCase()) ||
                            manifestation.ville.toLowerCase().includes(rechercheManifestation.toLowerCase()) ||
                            manifestation.pays.toLowerCase().includes(rechercheManifestation.toLowerCase())
    const matchesVille = !filtreVilleManifestation || manifestation.ville.toLowerCase().includes(filtreVilleManifestation.toLowerCase())
    const matchesPays = !filtrePaysManifestation || manifestation.pays.toLowerCase().includes(filtrePaysManifestation.toLowerCase())
    const matchesDateDebut = !filtreDateDebutManifestation || manifestation.dateDebut >= filtreDateDebutManifestation
    const matchesDateFin = !filtreDateFinManifestation || manifestation.dateFin <= filtreDateFinManifestation
    
    return matchesRecherche && matchesVille && matchesPays && matchesDateDebut && matchesDateFin
  })

  // Fonction pour sélectionner une manifestation existante
  const selectionnerManifestation = (manifestation: ManifestationExistante) => {
    setManifestationSelectionnee(manifestation)
    setEtapeProcessus("selection")
  }

  // Fonction pour créer une nouvelle manifestation
  const creerNouvelleManifestation = () => {
    setEtapeProcessus("nouvelle")
  }

  // Fonction pour revenir à la recherche
  const retourRecherche = () => {
    setEtapeProcessus("recherche")
    setManifestationSelectionnee(null)
    setRechercheManifestation("")
    setFiltreVilleManifestation("")
    setFiltrePaysManifestation("")
    setFiltreDateDebutManifestation("")
    setFiltreDateFinManifestation("")
  }

  // Fonction pour finaliser la participation
  const finaliserParticipation = () => {
    if (manifestationSelectionnee) {
      // Créer une demande de participation avec la manifestation sélectionnée
      const newDemandeParticipation: DemandeParticipation = {
        id: Date.now().toString(),
        nomPrenomDemandeur: nomPrenomUserConnecte,
        directeurTheseDoctorant: "",
        gsm: "",
        email: "",
        fonction: "Chercheur" as "Chercheur" | "Enseignant chercheur",
        etablissement: "",
        nomLaboratoire: "",
        discipline: "",
        natureManifestation: manifestationSelectionnee.nature as "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage",
        naturePriseEnCharge: formDataParticipation.naturePriseEnCharge,
        intituleManifestation: manifestationSelectionnee.intitule,
        paysManifestation: manifestationSelectionnee.pays,
        villeManifestation: manifestationSelectionnee.ville,
        dateManifestation: manifestationSelectionnee.dateDebut,
        avisResponsableStructure: "",
        avisCommissionRechercheEtablissement: "",
        avisResponsableEtablissement: "",
        avisCommissionRechercheConseilUniversite: "",
        documentsFournis: {
          demandeOfficielle: justificatifParticipation,
          lettreInvitation: null,
          programmeManifestation: null,
          resumeCommunication: null,
          formulaireMobilite: null,
          copieCarteEtudiant: null,
          rapportMission: null
        },
        statut: "En attente",
        dateCreation: new Date().toISOString().split('T')[0]
      }

      if (addDemandeParticipation) {
        addDemandeParticipation(newDemandeParticipation)
        toast({
          title: "Participation ajoutée",
          description: "Votre demande de participation a été enregistrée avec succès"
        })
      }

      setIsModalOpenParticipation(false)
      setEtapeProcessus("recherche")
      setManifestationSelectionnee(null)
      setJustificatifParticipation(null)
    }
  }

  // Fonction pour gérer le téléchargement des fichiers
  const handleFileUpload = (field: keyof typeof formDataParticipation.documentsFournis, file: File | null) => {
    setFormDataParticipation((prev) => ({
      ...prev,
      documentsFournis: {
        ...prev.documentsFournis,
        [field]: file
      }
    }))
  }
  
  //méthode traitements envoyer demande participation
  const handleSubmitDemandeParticipation = (e: React.FormEvent) => {
    e.preventDefault()

    //validations

    if (!formDataParticipation.intituleManifestation || !formDataParticipation.dateManifestation) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez renseigner l'intitulé et la date de la manifestation",
        variant: "destructive"
      })
      return
    }

    const newDemandeParticipation: DemandeParticipation = {
      id: Date.now().toString(),
      nomPrenomDemandeur: nomPrenomUserConnecte, // Utilise l'utilisateur connecté
      directeurTheseDoctorant: "", // Valeur par défaut
      gsm: "", // Valeur par défaut
      email: "", // Valeur par défaut
      fonction: "Chercheur" as "Chercheur" | "Enseignant chercheur", // Valeur par défaut
      etablissement: "", // Valeur par défaut
      nomLaboratoire: "", // Valeur par défaut
      discipline: "", // Valeur par défaut
      natureManifestation: formDataParticipation.natureManifestation,
      naturePriseEnCharge: formDataParticipation.naturePriseEnCharge,   
      intituleManifestation: formDataParticipation.intituleManifestation,
      paysManifestation: formDataParticipation.paysManifestation,
      villeManifestation: formDataParticipation.villeManifestation,
      dateManifestation: formDataParticipation.dateManifestation,
      // Nouveaux champs
      avisResponsableStructure: formDataParticipation.avisResponsableStructure,
      avisCommissionRechercheEtablissement: formDataParticipation.avisCommissionRechercheEtablissement,
      avisResponsableEtablissement: formDataParticipation.avisResponsableEtablissement,
      avisCommissionRechercheConseilUniversite: formDataParticipation.avisCommissionRechercheConseilUniversite,
      documentsFournis: formDataParticipation.documentsFournis,
      statut: "En attente",
      dateCreation: new Date().toISOString().split('T')[0]
    }

    console.log(newDemandeParticipation.dateManifestation)
    console.log("******************************************************************")
    
    // Vérifiez que la fonction existe
    if (addDemandeParticipation) {
      addDemandeParticipation(newDemandeParticipation);
      console.log('Demande ajoutée:', newDemandeParticipation); // Debug
    } else {
      console.error('addDemandeParticipation non disponible');
    }

    
    demandesParticipations.map((ddeParticip) => {
      console.log('Demande participation:', ddeParticip)
      console.log("-------------------")
    })

    toast({title: "Nouvelle demande participation manifestation ajoutée"})


    setIsModalOpenParticipation(false)
    resetFormDataParticipation()
  }

  /***************vue****************/
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Gestion des Manifestations Scientifiques</h1>
                  <p className="text-xs text-gray-600 mt-1">Demander Participations aux manifestations non organisé à l'UH2C</p>
                </div>
                <Dialog open={isModalOpenParticipation} onOpenChange={setIsModalOpenParticipation}>
                  <DialogTrigger asChild>
                    <Button onClick={resetFormDataParticipation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Demander une participation à une manifestation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                      <DialogTitle className="sr-only">
                        Processus de Participation à une manifestation
                      </DialogTitle>
                      
                      {/* En-tête unifié du formulaire */}
                      <div className="mb-4">
                        <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                              <Users className="h-3 w-3 text-uh2c-blue" />
                            </div>
                            <div>
                              <h2 className="text-sm font-bold text-uh2c-blue">
                                PROCESSUS DE PARTICIPATION À UNE MANIFESTATION
                              </h2>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Recherchez une manifestation existante ou créez-en une nouvelle
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Étapes du processus */}
                      {etapeProcessus === "recherche" && (
                        <div className="space-y-6">
                          {/* Recherche de manifestations existantes */}
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Rechercher une manifestation existante
                              </CardTitle>
                              <p className="text-sm text-gray-600">
                                Si la manifestation figure déjà dans la liste, vous pouvez la rechercher par mot-clé
                              </p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Barre de recherche principale */}
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                  placeholder="Rechercher par intitulé, ville ou pays..."
                                  value={rechercheManifestation}
                                  onChange={(e) => setRechercheManifestation(e.target.value)}
                                  className="pl-10 h-10"
                                />
                              </div>

                              {/* Filtres avancés */}
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Ville</Label>
                                  <Input
                                    placeholder="Filtrer par ville"
                                    value={filtreVilleManifestation}
                                    onChange={(e) => setFiltreVilleManifestation(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Pays</Label>
                                  <Input
                                    placeholder="Filtrer par pays"
                                    value={filtrePaysManifestation}
                                    onChange={(e) => setFiltrePaysManifestation(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Date début</Label>
                                  <Input
                                    type="date"
                                    value={filtreDateDebutManifestation}
                                    onChange={(e) => setFiltreDateDebutManifestation(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Date fin</Label>
                                  <Input
                                    type="date"
                                    value={filtreDateFinManifestation}
                                    onChange={(e) => setFiltreDateFinManifestation(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </div>

                              {/* Liste des manifestations filtrées */}
                              <div className="space-y-3">
                                <h4 className="font-medium text-sm">Manifestations trouvées ({manifestationsFiltrees.length})</h4>
                                {manifestationsFiltrees.length > 0 ? (
                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {manifestationsFiltrees.map((manifestation) => (
                                      <div
                                        key={manifestation.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => selectionnerManifestation(manifestation)}
                                      >
                                        <div className="flex justify-between items-start">
                                          <div className="flex-1">
                                            <h5 className="font-medium text-sm">{manifestation.intitule}</h5>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                              <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {manifestation.ville}, {manifestation.pays}
                                              </span>
                                              <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(manifestation.dateDebut).toLocaleDateString("fr-FR")} - {new Date(manifestation.dateFin).toLocaleDateString("fr-FR")}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge variant={manifestation.statut === "Validée" ? "default" : manifestation.statut === "En attente" ? "secondary" : "destructive"}>
                                              {manifestation.statut}
                                            </Badge>
                                            <Button size="sm" variant="outline">
                                              Sélectionner
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>Aucune manifestation trouvée</p>
                                    <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                                  </div>
                                )}
                              </div>

                              {/* Bouton pour créer une nouvelle manifestation */}
                              <div className="border-t pt-4">
                                <div className="text-center">
                                  <p className="text-sm text-gray-600 mb-3">
                                    La manifestation n'existe pas dans la liste ?
                                  </p>
                                  <Button onClick={creerNouvelleManifestation} variant="outline">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Créer une nouvelle manifestation
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {/* Étape de sélection d'une manifestation */}
                      {etapeProcessus === "selection" && manifestationSelectionnee && (
                        <div className="space-y-6">
                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-base">Manifestation sélectionnée</CardTitle>
                                  <p className="text-sm text-gray-600">Confirmez votre participation à cette manifestation</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={retourRecherche}>
                                  <X className="h-4 w-4 mr-2" />
                                  Changer
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Informations de la manifestation */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-medium text-sm mb-3">{manifestationSelectionnee.intitule}</h5>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Nature :</span>
                                    <span className="ml-2 font-medium">{manifestationSelectionnee.nature}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Lieu :</span>
                                    <span className="ml-2 font-medium">{manifestationSelectionnee.ville}, {manifestationSelectionnee.pays}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Date début :</span>
                                    <span className="ml-2 font-medium">{new Date(manifestationSelectionnee.dateDebut).toLocaleDateString("fr-FR")}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Date fin :</span>
                                    <span className="ml-2 font-medium">{new Date(manifestationSelectionnee.dateFin).toLocaleDateString("fr-FR")}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Nature de prise en charge */}
                              <div>
                                <Label className="text-sm font-medium">Nature de prise en charge</Label>
                                <Select
                                  value={formDataParticipation.naturePriseEnCharge}
                                  onValueChange={(value: "Frais de séjour" | "Billet d'avion") =>
                                    setFormDataParticipation((prev) => ({ ...prev, naturePriseEnCharge: value }))
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Sélectionner la nature" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Frais de séjour">Frais de séjour</SelectItem>
                                    <SelectItem value="Billet d'avion">Billet d'avion</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Justificatif */}
                              <div>
                                <Label className="text-sm font-medium">Justificatif de participation <span className="text-red-500">*</span></Label>
                                <p className="text-xs text-gray-600 mb-2">Joignez un document justifiant votre participation à cette manifestation</p>
                                {!justificatifParticipation ? (
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition-colors">
                                    <input
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={(e) => setJustificatifParticipation(e.target.files?.[0] || null)}
                                      className="hidden"
                                      id="justificatif-participation"
                                    />
                                    <label htmlFor="justificatif-participation" className="cursor-pointer">
                                      <div className="space-y-3">
                                        <div className="mx-auto w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                          <Upload className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-700">
                                            Cliquez pour télécharger un justificatif
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            PDF, DOC, DOCX jusqu'à 10MB
                                          </p>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                      <Check className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <span className="text-sm text-green-800 font-medium block">
                                        {justificatifParticipation.name}
                                      </span>
                                      <span className="text-xs text-green-600">
                                        Téléchargé avec succès
                                      </span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setJustificatifParticipation(null)}
                                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Boutons d'action */}
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={retourRecherche}>
                                  Annuler
                                </Button>
                                <Button 
                                  onClick={finaliserParticipation}
                                  disabled={!justificatifParticipation}
                                >
                                  Confirmer la participation
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {/* Étape de création d'une nouvelle manifestation */}
                      {etapeProcessus === "nouvelle" && (
                        <div className="space-y-6">
                          <Card>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-base">Créer une nouvelle manifestation</CardTitle>
                                  <p className="text-sm text-gray-600">Renseignez les informations de la manifestation</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={retourRecherche}>
                                  <X className="h-4 w-4 mr-2" />
                                  Annuler
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <form onSubmit={handleSubmitDemandeParticipation} className="space-y-6">

                                {/* Section Informations manifestation */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Informations sur la manifestation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                          <div>
                                <Label htmlFor="natureManifestation" className="text-xs font-medium text-gray-600">
                                  Nature de la manifestation
                                </Label>
                            <Select
                              value={formDataParticipation.natureManifestation}
                              onValueChange={(value: "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage") =>
                                setFormDataParticipation((prev) => ({ ...prev, natureManifestation: value }))
                              }
                            >
                                  <SelectTrigger className="mt-1 h-9 text-sm">
                                    <SelectValue placeholder="Sélectionner le type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Congrès">Congrès</SelectItem>
                                <SelectItem value="Conférence">Conférence</SelectItem>
                                <SelectItem value="Séminaire">Séminaire</SelectItem>
                                <SelectItem value="Colloque">Colloque</SelectItem>
                                <SelectItem value="Workshop">Workshop</SelectItem>
                                <SelectItem value="Stage">Stage</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                                <Label htmlFor="naturePriseEnCharge" className="text-xs font-medium text-gray-600">
                                  Nature de prise en charge
                                </Label>
                            <Select
                              value={formDataParticipation.naturePriseEnCharge}
                                  onValueChange={(value: "Frais de séjour" | "Billet d'avion") =>
                                setFormDataParticipation((prev) => ({ ...prev, naturePriseEnCharge: value }))
                              }
                            >
                                  <SelectTrigger className="mt-1 h-9 text-sm">
                                    <SelectValue placeholder="Sélectionner la nature" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Frais de séjour">Frais de séjour</SelectItem>
                                <SelectItem value="Billet d'avion">Billet d'avion</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>

                          <div>
                                <Label htmlFor="intituleManifestation" className="text-xs font-medium text-gray-600">
                                  Intitulé de la manifestation
                                </Label>
                            <Input
                              id="intituleManifestation"
                              value={formDataParticipation.intituleManifestation}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, intituleManifestation: e.target.value }))}
                                  placeholder="Intitulé de la manifestation"
                                  className="mt-1 h-9 text-sm"
                            />
                          </div>

                          <div>
                                <Label htmlFor="paysManifestation" className="text-xs font-medium text-gray-600">
                                  Pays de la manifestation
                                </Label>
                            <Select
                              value={formDataParticipation.paysManifestation}
                              onValueChange={(value: string) => {
                                // Mettre à jour le pays et les villes disponibles
                                const villes = getVillesByPays(value)
                                setVillesDisponibles(villes)
                                setFormDataParticipation((prev) => ({ 
                                  ...prev, 
                                  paysManifestation: value,
                                  villeManifestation: "" // Réinitialiser la ville
                                }))
                              }}
                            >
                                  <SelectTrigger className="mt-1 h-9 text-sm">
                                <SelectValue placeholder="Sélectionner un pays" />
                              </SelectTrigger>
                              <SelectContent>
                                {paysMonde.map((p) => (
                                  <SelectItem key={p} value={p}>
                                    {p}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        </div>

                          <div>
                                <Label htmlFor="villeManifestation" className="text-xs font-medium text-gray-600">
                                  Ville de la manifestation
                                </Label>
                            <Select
                              value={formDataParticipation.villeManifestation}
                              onValueChange={(value: string) =>
                                setFormDataParticipation((prev) => ({ ...prev, villeManifestation: value }))
                              }
                              disabled={!formDataParticipation.paysManifestation}
                            >
                                  <SelectTrigger className="mt-1 h-9 text-sm">
                                <SelectValue placeholder={
                                  formDataParticipation.paysManifestation 
                                    ? "Sélectionner une ville" 
                                    : "Sélectionnez d'abord un pays"
                                } />
                              </SelectTrigger>
                              <SelectContent>
                                {villesDisponibles.length > 0 ? (
                                  villesDisponibles.map((v) => (
                                    <SelectItem key={v} value={v}>
                                      {v}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="no-cities" disabled>
                                    Aucune ville disponible
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                                <Label htmlFor="dateManifestation" className="text-xs font-medium text-gray-600">
                                  Date de début
                                </Label>
                            <Input
                              id="dateManifestation"                                                                                                                                                                        
                              type="date"
                              value={formDataParticipation.dateManifestation}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, dateManifestation: e.target.value }))}
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="dateFinManifestation" className="text-xs font-medium text-gray-600">
                                  Date de fin
                                </Label>
                            <Input
                              id="dateFinManifestation"                                                                                                                                                                        
                              type="date"
                              value={formDataParticipation.dateFinManifestation}
                              onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, dateFinManifestation: e.target.value }))}
                                  className="mt-1 h-9 text-sm"
                                />
                              </div>
                            </div>
                            </CardContent>
                          </Card>

                          {/* Section AVIS MOTIVÉ DU RESPONSABLE DE LA STRUCTURE DE RECHERCHE */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Avis motivé du responsable de la structure de recherche</CardTitle>
                              <p className="text-sm text-gray-600">(Laboratoire, Équipe, ...)</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label htmlFor="avisResponsableStructure" className="text-xs font-medium text-gray-600">
                                  Avis motivé
                                </Label>
                                <Textarea
                                  id="avisResponsableStructure"
                                  value={formDataParticipation.avisResponsableStructure}
                                  onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, avisResponsableStructure: e.target.value }))}
                                  placeholder="Veuillez justifier la demande de participation..."
                                  className="mt-1 h-20 text-sm"
                                  rows={4}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Section AVIS MOTIVÉ DE LA COMMISSION RECHERCHE DE L'ÉTABLISSEMENT */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Avis motivé de la commission recherche de l'établissement</CardTitle>
                              <p className="text-sm text-gray-600">Les raisons pour lesquelles l'établissement ne peut pas prendre en charge les frais de cette participation</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label htmlFor="avisCommissionRechercheEtablissement" className="text-xs font-medium text-gray-600">
                                  Raisons de non-prise en charge
                                </Label>
                                <Textarea
                                  id="avisCommissionRechercheEtablissement"
                                  value={formDataParticipation.avisCommissionRechercheEtablissement}
                                  onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, avisCommissionRechercheEtablissement: e.target.value }))}
                                  placeholder="Expliquez pourquoi l'établissement ne peut pas prendre en charge les frais..."
                                  className="mt-1 h-20 text-sm"
                                  rows={4}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Section AVIS DU RESPONSABLE D'ÉTABLISSEMENT */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Avis du responsable d'établissement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label htmlFor="avisResponsableEtablissement" className="text-xs font-medium text-gray-600">
                                  Avis du responsable d'établissement
                                </Label>
                                <Textarea
                                  id="avisResponsableEtablissement"
                                  value={formDataParticipation.avisResponsableEtablissement}
                                  onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, avisResponsableEtablissement: e.target.value }))}
                                  placeholder="Avis du responsable d'établissement..."
                                  className="mt-1 h-20 text-sm"
                                  rows={4}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Section AVIS DE LA COMMISSION RECHERCHE DU CONSEIL D'UNIVERSITÉ */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Avis de la commission « RECHERCHE » du conseil d'université</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label htmlFor="avisCommissionRechercheConseilUniversite" className="text-xs font-medium text-gray-600">
                                  Avis de la commission recherche du conseil
                                </Label>
                                <Textarea
                                  id="avisCommissionRechercheConseilUniversite"
                                  value={formDataParticipation.avisCommissionRechercheConseilUniversite}
                                  onChange={(e) => setFormDataParticipation((prev) => ({ ...prev, avisCommissionRechercheConseilUniversite: e.target.value }))}
                                  placeholder="Avis de la commission recherche du conseil d'université..."
                                  className="mt-1 h-20 text-sm"
                                  rows={4}
                                />
                              </div>
                            </CardContent>
                          </Card>

                          {/* Section DOSSIER À FOURNIR */}
                          <Card className="border-l-4 border-l-uh2c-blue">
                            <CardHeader className="pb-3 bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-uh2c-blue/10 rounded-lg flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-uh2c-blue" />
                                </div>
                                <div>
                                  <CardTitle className="text-base font-semibold text-uh2c-blue">Dossier à fournir</CardTitle>
                                  <p className="text-xs text-uh2c-blue/80 mt-1">Téléchargez les documents requis pour votre demande</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Demande officielle */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-uh2c-blue">1</span>
                                    </div>
                                    <Label className="text-sm font-semibold text-gray-800">
                                      Demande officielle <span className="text-red-500">*</span>
                                    </Label>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                    Portant le numéro téléphone et l'adresse e-mail S/C du Chef d'établissement, adressée au Président de l'Université
                                  </p>
                                  {!formDataParticipation.documentsFournis.demandeOfficielle ? (
                                    <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileUpload('demandeOfficielle', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="demande-officielle"
                                      />
                                      <label htmlFor="demande-officielle" className="cursor-pointer">
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
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-sm text-green-800 font-medium block">
                                          {formDataParticipation.documentsFournis.demandeOfficielle.name}
                                        </span>
                                        <span className="text-xs text-green-600">
                                          Téléchargé avec succès
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleFileUpload('demandeOfficielle', null)}
                                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* Lettre d'invitation */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-uh2c-blue">2</span>
                                    </div>
                                    <Label className="text-sm font-semibold text-gray-800">
                                      Lettre d'invitation <span className="text-red-500">*</span>
                                    </Label>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                    Une copie de la lettre officielle d'invitation ou d'acceptation de participation à la manifestation
                                  </p>
                                  {!formDataParticipation.documentsFournis.lettreInvitation ? (
                                    <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileUpload('lettreInvitation', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="lettre-invitation"
                                      />
                                      <label htmlFor="lettre-invitation" className="cursor-pointer">
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
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-sm text-green-800 font-medium block">
                                          {formDataParticipation.documentsFournis.lettreInvitation.name}
                                        </span>
                                        <span className="text-xs text-green-600">
                                          Téléchargé avec succès
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleFileUpload('lettreInvitation', null)}
                                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* Programme */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-uh2c-blue">3</span>
                                    </div>
                                    <Label className="text-sm font-semibold text-gray-800">
                                      Programme de la manifestation <span className="text-red-500">*</span>
                                    </Label>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                    Le programme de la manifestation scientifique
                                  </p>
                                  {!formDataParticipation.documentsFournis.programmeManifestation ? (
                                    <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileUpload('programmeManifestation', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="programme-manifestation"
                                      />
                                      <label htmlFor="programme-manifestation" className="cursor-pointer">
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
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-sm text-green-800 font-medium block">
                                          {formDataParticipation.documentsFournis.programmeManifestation.name}
                                        </span>
                                        <span className="text-xs text-green-600">
                                          Téléchargé avec succès
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleFileUpload('programmeManifestation', null)}
                                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* Résumé de communication */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-uh2c-blue">4</span>
                                    </div>
                                    <Label className="text-sm font-semibold text-gray-800">
                                      Résumé de communication <span className="text-red-500">*</span>
                                    </Label>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                    Résumé de la communication présentée à la manifestation scientifique
                                  </p>
                                  {!formDataParticipation.documentsFournis.resumeCommunication ? (
                                    <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileUpload('resumeCommunication', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="resume-communication"
                                      />
                                      <label htmlFor="resume-communication" className="cursor-pointer">
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
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-sm text-green-800 font-medium block">
                                          {formDataParticipation.documentsFournis.resumeCommunication.name}
                                        </span>
                                        <span className="text-xs text-green-600">
                                          Téléchargé avec succès
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleFileUpload('resumeCommunication', null)}
                                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* Formulaire de mobilité */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-uh2c-blue">5</span>
                                    </div>
                                    <Label className="text-sm font-semibold text-gray-800">
                                      Formulaire de mobilité <span className="text-red-500">*</span>
                                    </Label>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                    Formulaire de demande de mobilité dûment renseigné et signé (formulaire disponible sur le site de l'Université)
                                  </p>
                                  {!formDataParticipation.documentsFournis.formulaireMobilite ? (
                                    <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                      <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleFileUpload('formulaireMobilite', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="formulaire-mobilite"
                                      />
                                      <label htmlFor="formulaire-mobilite" className="cursor-pointer">
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
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-sm text-green-800 font-medium block">
                                          {formDataParticipation.documentsFournis.formulaireMobilite.name}
                                        </span>
                                        <span className="text-xs text-green-600">
                                          Téléchargé avec succès
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleFileUpload('formulaireMobilite', null)}
                                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                {/* Carte d'étudiant (pour doctorants) */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                                      <span className="text-xs font-bold text-uh2c-blue">6</span>
                                    </div>
                                    <Label className="text-sm font-semibold text-gray-800">
                                      Carte d'étudiant (pour doctorants) <span className="text-red-500">*</span>
                                    </Label>
                                  </div>
                                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                    Copie carte d'étudiant ou attestation d'inscription (pour les doctorants)
                                  </p>
                                  {!formDataParticipation.documentsFournis.copieCarteEtudiant ? (
                                    <div className="border-2 border-dashed border-uh2c-blue/20 rounded-lg p-6 text-center hover:border-uh2c-blue/40 hover:bg-uh2c-blue/5 cursor-pointer transition-all">
                                      <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload('copieCarteEtudiant', e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="carte-etudiant"
                                      />
                                      <label htmlFor="carte-etudiant" className="cursor-pointer">
                                        <div className="space-y-3">
                                          <div className="mx-auto w-16 h-16 rounded-lg bg-uh2c-blue/10 flex items-center justify-center">
                                            <FileText className="h-8 w-8 text-uh2c-blue" />
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-uh2c-blue">
                                              Cliquez pour télécharger ou glissez-déposez
                                            </p>
                                            <p className="text-xs text-uh2c-blue/70 mt-1">
                                              PDF, JPG, JPEG, PNG jusqu'à 10MB
                                            </p>
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <Check className="h-4 w-4 text-green-600" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-sm text-green-800 font-medium block">
                                          {formDataParticipation.documentsFournis.copieCarteEtudiant.name}
                                        </span>
                                        <span className="text-xs text-green-600">
                                          Téléchargé avec succès
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleFileUpload('copieCarteEtudiant', null)}
                                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Boutons d'action */}
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpenParticipation(false)}>
                              Annuler
                            </Button>
                            <Button type="submit">Envoyer la demande</Button>
                          </div>
                      </form>
                            </CardContent>
                          </Card>
                      </div>
                      )}
                    </DialogContent>
                                
                  </Dialog>
                </div>
            </div>

            {/* Section Recherche et filtres */}
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
                        <SelectItem value="Casablanca">Casablanca</SelectItem>
                        <SelectItem value="Rabat">Rabat</SelectItem>
                        <SelectItem value="Paris">Paris</SelectItem>
                        <SelectItem value="Londres">Londres</SelectItem>
                        <SelectItem value="Berlin">Berlin</SelectItem>
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
                        <SelectItem value="Maroc">Maroc</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Royaume-Uni">Royaume-Uni</SelectItem>
                        <SelectItem value="Allemagne">Allemagne</SelectItem>
                        <SelectItem value="Espagne">Espagne</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card>
              <CardContent >

                {/* Titre de la liste */}
                <div className="mt-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Liste des Demandes de Participation aux manifestations</h2>
                </div>

                {//liste manifestations
                filteredDemandesParticipations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50">
                          <TableHead className="text-black font-semibold">Demandeur</TableHead>
                          <TableHead className="text-black font-semibold">Fonction</TableHead>
                          <TableHead className="text-black font-semibold">Établissement</TableHead>
                          <TableHead className="text-black font-semibold">Laboratoire</TableHead>
                          <TableHead className="text-black font-semibold">Manifestation</TableHead>
                          <TableHead className="text-black font-semibold">Nature</TableHead>
                          <TableHead className="text-black font-semibold">Prise en charge</TableHead>
                          <TableHead className="text-black font-semibold">Lieu</TableHead>
                          <TableHead className="text-black font-semibold">Date</TableHead>
                          <TableHead className="text-black font-semibold">Statut</TableHead>
                          <TableHead className="text-right text-black font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                                        <TableBody>
                                          {filteredDemandesParticipations.map((item) => (
                                            <TableRow key={item.id}>
                                              <TableCell className="max-w-xs">
                                                <div>
                                                  <div className="font-medium">{item.nomPrenomDemandeur}</div>
                                                  <div className="text-sm text-gray-500">{item.email}</div>
                                                  <div className="text-sm text-gray-500">{item.gsm}</div>
                                                  {item.directeurTheseDoctorant && (
                                                    <div className="text-sm text-blue-600">
                                                      Directeur: {item.directeurTheseDoctorant}
                                                    </div>
                                                  )}
                                                </div>
                                              </TableCell>
                                              <TableCell>
                                                <Badge variant={item.fonction === "Enseignant chercheur" ? "default" : "secondary"}>
                                                  {item.fonction}
                                                </Badge>
                                              </TableCell>
                                              <TableCell className="max-w-xs">
                                                <div className="truncate" title={item.etablissement}>
                                                  {item.etablissement}
                                                </div>
                                              </TableCell>
                                              <TableCell className="max-w-xs">
                                                <div>
                                                  <div className="font-medium">{item.nomLaboratoire}</div>
                                                  <div className="text-sm text-gray-500">{item.discipline}</div>
                                                </div>
                                              </TableCell>
                                              <TableCell className="max-w-xs">
                                                <div className="truncate" title={item.intituleManifestation}>
                                                  {item.intituleManifestation}
                                                </div>
                                              </TableCell>
                                              <TableCell>
                                                <Badge variant="outline">{item.natureManifestation}</Badge>
                                              </TableCell>
                                              <TableCell>
                                                <Badge variant="secondary">{item.naturePriseEnCharge}</Badge>
                                              </TableCell>
                                              <TableCell>
                                                <div className="text-sm">
                                                  <div>{item.villeManifestation}</div>
                                                  <div className="text-gray-500">{item.paysManifestation}</div>
                                                </div>
                                              </TableCell>
                                              <TableCell>{new Date(item.dateManifestation).toLocaleDateString("fr-FR")}</TableCell>
                                              <TableCell>
                                                <Badge variant={item.statut === "Approuvée" ? "default" : item.statut === "Rejetée" ? "destructive" : "secondary"}>
                                                  {item.statut || "En attente"}
                                                </Badge>
                                              </TableCell>
                                              <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                  <Button variant="outline" size="sm" title="Voir détails">
                                                    <Eye className="h-4 w-4" />
                                                  </Button>
                                                  <Button variant="outline" size="sm" title="Modifier">
                                                    <Edit className="h-4 w-4" />
                                                  </Button>
                                                  <Button variant="outline" size="sm" title="Supprimer">
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
                    <p className="text-gray-500">Aucune manifestation trouvée</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm || typeFilter !== "all" || yearFilter !== "all"
                        ? "Essayez de modifier vos filtres"
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