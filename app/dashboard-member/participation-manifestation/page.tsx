"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Search, Edit, Trash2, Upload, Calendar, MapPin, User, Users, Building2, FileText, XCircle, DollarSign, Plane, Hotel, FolderOpen, Globe, BookOpen, UserPlus, Handshake, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DemandeParticipation {
  id: string
  nomDemandeur: string
  directeurThese: string
  gsm: string
  email: string
  typeDemandeur: "Chercheur" | "Enseignant chercheur"
  etablissement: string
  nomLaboratoire: string
  discipline: string
  natureManifestation: "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage"
  naturePriseEnCharge: "Frais de séjour" | "Billet d'avion"
  intituleManifestation: string
  lieuManifestation: string
  dateManifestation: string
  avisResponsableStructure: string
  avisCommissionRecherche: string
  avisResponsableEtablissement: string
  avisCommissionConseil: string
  piecesJointes: File[]
  statut: "En attente" | "Approuvée" | "Rejetée"
  dateCreation: string
}

const typesDemandeur = ["Chercheur", "Enseignant chercheur"]
const naturesManifestation = ["Congrès", "Conférence", "Séminaire", "Colloque", "Workshop", "Stage"]
const naturesPriseEnCharge = ["Frais de séjour", "Billet d'avion"]

export default function ParticipationManifestation() {
  const [formType, setFormType] = useState<"participation" | "organisation">("participation")
  const [demandes, setDemandes] = useState<DemandeParticipation[]>([
    {
      id: "1",
      nomDemandeur: "Dr. Ahmed Benali",
      directeurThese: "",
      gsm: "0612345678",
      email: "ahmed.benali@uh2c.ac.ma",
      typeDemandeur: "Enseignant chercheur",
      etablissement: "Faculté des Sciences",
      nomLaboratoire: "Laboratoire de Physique Quantique",
      discipline: "Physique",
      natureManifestation: "Congrès",
      naturePriseEnCharge: "Billet d'avion",
      intituleManifestation: "International Conference on Quantum Computing",
      lieuManifestation: "Paris, France",
      dateManifestation: "2024-06-15",
      avisResponsableStructure: "Demande approuvée par le laboratoire",
      avisCommissionRecherche: "Commission favorable à la participation",
      avisResponsableEtablissement: "Soutien de l'établissement accordé",
      avisCommissionConseil: "Validation du conseil d'université",
      piecesJointes: [],
      statut: "Approuvée",
      dateCreation: "2024-01-15"
    },
    {
      id: "2",
      nomDemandeur: "Pr. Fatima Zahra El Mansouri",
      directeurThese: "",
      gsm: "0623456789",
      email: "fatima.elmansouri@uh2c.ac.ma",
      typeDemandeur: "Enseignant chercheur",
      etablissement: "Faculté des Sciences Juridiques",
      nomLaboratoire: "Centre d'Études Juridiques",
      discipline: "Droit International",
      natureManifestation: "Conférence",
      naturePriseEnCharge: "Frais de séjour",
      intituleManifestation: "European Law Conference 2024",
      lieuManifestation: "Bruxelles, Belgique",
      dateManifestation: "2024-07-20",
      avisResponsableStructure: "Recommandation positive du centre",
      avisCommissionRecherche: "Intérêt scientifique confirmé",
      avisResponsableEtablissement: "Appui de la faculté",
      avisCommissionConseil: "Validation en cours",
      piecesJointes: [],
      statut: "En attente",
      dateCreation: "2024-02-10"
    }
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DemandeParticipation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateDebutFilter, setDateDebutFilter] = useState<string>("")
  const [dateFinFilter, setDateFinFilter] = useState<string>("")
  const [villePaysFilter, setVillePaysFilter] = useState<string>("")
  const [coordonnateurFilter, setCoordonnateurFilter] = useState<string>("")
  const [manifestationFilter, setManifestationFilter] = useState<string>("")
  const [soutienUH2C, setSoutienUH2C] = useState<string>("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nomDemandeur: "",
    directeurThese: "",
    gsm: "",
    email: "",
    typeDemandeur: "Chercheur" as "Chercheur" | "Enseignant chercheur",
    etablissement: "",
    nomLaboratoire: "",
    discipline: "",
    natureManifestation: "Congrès" as "Congrès" | "Conférence" | "Séminaire" | "Colloque" | "Workshop" | "Stage",
    naturePriseEnCharge: "Frais de séjour" as "Frais de séjour" | "Billet d'avion",
    intituleManifestation: "",
    lieuManifestation: "",
    dateManifestation: "",
    avisResponsableStructure: "",
    avisCommissionRecherche: "",
    avisResponsableEtablissement: "",
    avisCommissionConseil: "",
    // Fichiers des avis
    fichierAvisResponsableStructure: null as File | null,
    fichierAvisCommissionRecherche: null as File | null,
    fichierAvisResponsableEtablissement: null as File | null,
    fichierAvisCommissionConseil: null as File | null,
    // Documents obligatoires individuels
    demandeManuscrit: null as File | null,
    lettreInvitation: null as File | null,
    programmeManifestation: null as File | null,
    resumeCommunication: null as File | null,
    formulaireMobilite: null as File | null,
    carteEtudiant: null as File | null,
    // Nouveaux documents obligatoires
    demandeManuscritPresident: null as File | null,
    formulaireDemandeSoutien: null as File | null,
    ficheFinanciere: null as File | null,
    programmeFinal: null as File | null,
    piecesJustificatives: null as File | null,
    piecesJointes: [] as File[]
  })

  const filteredDemandes = demandes.filter((item) => {
    const matchesSearch = item.nomDemandeur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.intituleManifestation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.lieuManifestation.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtres de date
    const matchesDateDebut = !dateDebutFilter || new Date(item.dateManifestation) >= new Date(dateDebutFilter)
    const matchesDateFin = !dateFinFilter || new Date(item.dateManifestation) <= new Date(dateFinFilter)
    
    // Filtres supplémentaires
    const matchesVillePays = !villePaysFilter || item.lieuManifestation.toLowerCase().includes(villePaysFilter.toLowerCase())
    const matchesCoordonnateur = !coordonnateurFilter || item.nomDemandeur.toLowerCase().includes(coordonnateurFilter.toLowerCase())
    const matchesManifestation = !manifestationFilter || item.intituleManifestation.toLowerCase().includes(manifestationFilter.toLowerCase())
    
    return matchesSearch && matchesDateDebut && matchesDateFin && 
           matchesVillePays && matchesCoordonnateur && matchesManifestation
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nomDemandeur || !formData.email || !formData.intituleManifestation || 
        !formData.lieuManifestation || !formData.dateManifestation) {
      toast({ 
        title: "Erreur de validation", 
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      })
      return
    }

    const newDemande: DemandeParticipation = {
      id: editingItem?.id || Date.now().toString(),
      ...formData,
      statut: "En attente",
      dateCreation: new Date().toISOString().split('T')[0]
    }

    if (editingItem) {
      setDemandes((prev) => prev.map((item) => (item.id === editingItem.id ? newDemande : item)))
      toast({ title: "Demande modifiée avec succès" })
    } else {
      setDemandes((prev) => [...prev, newDemande])
      toast({ title: "Nouvelle demande ajoutée avec succès" })
    }

    setIsModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      nomDemandeur: "",
      directeurThese: "",
      gsm: "",
      email: "",
      typeDemandeur: "Chercheur",
      etablissement: "",
      nomLaboratoire: "",
      discipline: "",
      natureManifestation: "Congrès",
      naturePriseEnCharge: "Frais de séjour",
      intituleManifestation: "",
      lieuManifestation: "",
      dateManifestation: "",
      avisResponsableStructure: "",
      avisCommissionRecherche: "",
      avisResponsableEtablissement: "",
      avisCommissionConseil: "",
      // Fichiers des avis
      fichierAvisResponsableStructure: null,
      fichierAvisCommissionRecherche: null,
      fichierAvisResponsableEtablissement: null,
      fichierAvisCommissionConseil: null,
      // Documents obligatoires individuels
      demandeManuscrit: null,
      lettreInvitation: null,
      programmeManifestation: null,
      resumeCommunication: null,
      formulaireMobilite: null,
      carteEtudiant: null,
      // Nouveaux documents obligatoires
      demandeManuscritPresident: null,
      formulaireDemandeSoutien: null,
      ficheFinanciere: null,
      programmeFinal: null,
      piecesJustificatives: null,
      piecesJointes: []
    })
    setEditingItem(null)
  }

  const handleEdit = (item: DemandeParticipation) => {
    setEditingItem(item)
    setFormData({
      nomDemandeur: item.nomDemandeur,
      directeurThese: item.directeurThese,
      gsm: item.gsm,
      email: item.email,
      typeDemandeur: item.typeDemandeur,
      etablissement: item.etablissement,
      nomLaboratoire: item.nomLaboratoire,
      discipline: item.discipline,
      natureManifestation: item.natureManifestation,
      naturePriseEnCharge: item.naturePriseEnCharge,
      intituleManifestation: item.intituleManifestation,
      lieuManifestation: item.lieuManifestation,
      dateManifestation: item.dateManifestation,
      avisResponsableStructure: item.avisResponsableStructure,
      avisCommissionRecherche: item.avisCommissionRecherche,
      avisResponsableEtablissement: item.avisResponsableEtablissement,
      avisCommissionConseil: item.avisCommissionConseil,
      // Fichiers des avis
      fichierAvisResponsableStructure: null,
      fichierAvisCommissionRecherche: null,
      fichierAvisResponsableEtablissement: null,
      fichierAvisCommissionConseil: null,
      // Documents obligatoires individuels
      demandeManuscrit: null,
      lettreInvitation: null,
      programmeManifestation: null,
      resumeCommunication: null,
      formulaireMobilite: null,
      carteEtudiant: null,
      // Nouveaux documents obligatoires
      demandeManuscritPresident: null,
      formulaireDemandeSoutien: null,
      ficheFinanciere: null,
      programmeFinal: null,
      piecesJustificatives: null,
      piecesJointes: item.piecesJointes
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setDemandes((prev) => prev.filter((item) => item.id !== id))
    toast({ title: "Demande supprimée avec succès" })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        piecesJointes: Array.from(e.target.files || []),
      }))
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Approuvée": return "bg-green-100 text-green-800"
      case "Rejetée": return "bg-red-100 text-red-800"
      default: return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900">
                      {formType === "participation" 
                        ? "Demande Participation aux manifestations non organisé à l'UH2C"
                        : "Demande de contribution à une manifestation scientifique"
                      }
                  </h1>
                </div>
                  
                  {/* Boutons de basculement */}
                  <div className="flex gap-2">
                    <Button
                      variant={formType === "participation" ? "default" : "outline"}
                      onClick={() => setFormType("participation")}
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90"
                    >
                      Participation
                    </Button>
                    <Button
                      variant={formType === "organisation" ? "default" : "outline"}
                      onClick={() => setFormType("organisation")}
                      className="bg-uh2c-blue hover:bg-uh2c-blue/90"
                    >
                      Organisation
                    </Button>
                  </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                      <Plus className="h-4 w-4 mr-2" />
                      {formType === "participation" ? "Demande Participation" : "Demande d'organisation"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogTitle className="sr-only">
                      {editingItem ? "Modification de la demande" : 
                        formType === "participation" ? "Nouvelle demande de participation" : "Nouvelle demande de contribution"}
                    </DialogTitle>
                    
                    <div className="mb-4">
                      <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                            <Users className="h-3 w-3 text-uh2c-blue" />
                          </div>
                          <div>
                            <h2 className="text-sm font-bold text-uh2c-blue">
                              {editingItem ? "Modification de la demande" : 
                                formType === "participation" ? "Demande de participation" : "Demande de contribution"}
                            </h2>
                            <p className="text-xs text-gray-600 mt-0.5">
                              Remplissez tous les champs obligatoires <span className="text-red-500 font-bold">(*)</span> pour votre {formType === "participation" ? "demande de participation" : "demande de contribution"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {formType === "participation" ? (
                        <>
                          {/* Section 1: Informations du demandeur */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                      <div className="flex items-center space-x-2 mb-3">
                            <User className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">INFORMATIONS DU DEMANDEUR</h3>
                          </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nom et Prénom du demandeur <span className="text-red-500 font-bold">*</span></Label>
                         <Input
                              value={formData.nomDemandeur}
                              onChange={(e) => setFormData({...formData, nomDemandeur: e.target.value})}
                              placeholder="Nom et prénom du demandeur"
                              required
                            />
                          </div>
                          <div>
                            <Label>Directeur de thèse (pour les doctorants)</Label>
                            <Input
                              value={formData.directeurThese}
                              onChange={(e) => setFormData({...formData, directeurThese: e.target.value})}
                              placeholder="Directeur de thèse"
                            />
                          </div>
                          <div>
                            <Label>GSM</Label>
                            <Input
                              value={formData.gsm}
                              onChange={(e) => setFormData({...formData, gsm: e.target.value})}
                              placeholder="Numéro de téléphone"
                            />
                          </div>
                          <div>
                            <Label>Email <span className="text-red-500 font-bold">*</span></Label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              placeholder="Adresse email"
                              required
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label className="text-sm font-medium">Type de demandeur</Label>
                          <RadioGroup 
                            value={formData.typeDemandeur} 
                            onValueChange={(value) => setFormData({...formData, typeDemandeur: value as "Chercheur" | "Enseignant chercheur"})}
                            className="flex space-x-4 mt-2"
                          >
                            {typesDemandeur.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem value={type} id={type} />
                                <Label htmlFor={type}>{type}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <Label>Établissement</Label>
                            <Input
                              value={formData.etablissement}
                              onChange={(e) => setFormData({...formData, etablissement: e.target.value})}
                              placeholder="Établissement"
                            />
                          </div>
                          <div>
                            <Label>Nom du Laboratoire</Label>
                            <Input
                              value={formData.nomLaboratoire}
                              onChange={(e) => setFormData({...formData, nomLaboratoire: e.target.value})}
                              placeholder="Nom du laboratoire"
                            />
                          </div>
                          <div>
                            <Label>Discipline</Label>
                            <Input
                              value={formData.discipline}
                              onChange={(e) => setFormData({...formData, discipline: e.target.value})}
                              placeholder="Discipline"
                            />
                          </div>
                        </div>
                      </div>

                                              {/* Section 2: Informations sur la manifestation */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Calendar className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">INFORMATIONS SUR LA MANIFESTATION</h3>
                          </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nature de la manifestation</Label>
                            <Select value={formData.natureManifestation} onValueChange={(value) => setFormData({...formData, natureManifestation: value as any})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner la nature" />
                              </SelectTrigger>
                              <SelectContent>
                                {naturesManifestation.map((nature) => (
                                  <SelectItem key={nature} value={nature}>{nature}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Nature de prise en charge</Label>
                            <RadioGroup 
                              value={formData.naturePriseEnCharge} 
                              onValueChange={(value) => setFormData({...formData, naturePriseEnCharge: value as "Frais de séjour" | "Billet d'avion"})}
                              className="flex space-x-4 mt-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem 
                                  value="Frais de séjour" 
                                  id="frais-sejour" 
                                  disabled={formData.typeDemandeur !== "Enseignant chercheur"}
                                />
                                <Label 
                                  htmlFor="frais-sejour" 
                                  className={formData.typeDemandeur !== "Enseignant chercheur" ? "text-gray-400" : ""}
                                >
                                  Frais de séjour
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Billet d'avion" id="billet-avion" />
                                <Label htmlFor="billet-avion">Billet d'avion</Label>
                              </div>
                            </RadioGroup>
                            {formData.typeDemandeur !== "Enseignant chercheur" && (
                              <p className="text-xs text-gray-500 mt-1">
                                Les frais de séjour sont réservés aux enseignants chercheurs uniquement
                              </p>
                            )}
                          </div>
                          <div>
                            <Label>Intitulé de la manifestation <span className="text-red-500 font-bold">*</span></Label>
                            <Input
                              value={formData.intituleManifestation}
                              onChange={(e) => setFormData({...formData, intituleManifestation: e.target.value})}
                           placeholder="Intitulé de la manifestation"
                              required
                            />
                          </div>
                          <div>
                            <Label>Lieu de la manifestation (Pays-ville) <span className="text-red-500 font-bold">*</span></Label>
                            <Input
                              value={formData.lieuManifestation}
                              onChange={(e) => setFormData({...formData, lieuManifestation: e.target.value})}
                              placeholder="Pays-ville"
                              required
                            />
                          </div>
                          <div>
                            <Label>Date de déroulement de la manifestation <span className="text-red-500 font-bold">*</span></Label>
                            <Input
                              type="date"
                              value={formData.dateManifestation}
                              onChange={(e) => setFormData({...formData, dateManifestation: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                       </div>

                                              {/* Section 3: Avis et recommandations */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <FileText className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">AVIS ET RECOMMANDATIONS</h3>
                          </div>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2">Avis motivé du responsable de la structure de recherche</Label>
                            <Textarea
                              value={formData.avisResponsableStructure}
                              onChange={(e) => setFormData({...formData, avisResponsableStructure: e.target.value})}
                              placeholder="Avis motivé du responsable de la structure de recherche"
                              rows={3}
                            />
                            </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2">Avis motivé de la commission recherche de l'établissement</Label>
                            <Textarea
                              value={formData.avisCommissionRecherche}
                              onChange={(e) => setFormData({...formData, avisCommissionRecherche: e.target.value})}
                              placeholder="Avis motivé de la commission recherche de l'établissement (Les raisons pour lesquelles l'établissement ne peut pas prendre en charge les frais de cette participation)"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2">Avis du responsable d'établissement</Label>
                            <Textarea
                              value={formData.avisResponsableEtablissement}
                              onChange={(e) => setFormData({...formData, avisResponsableEtablissement: e.target.value})}
                              placeholder="Avis du responsable d'établissement"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2">Avis de la commission recherche du conseil d'université</Label>
                            <Textarea
                              value={formData.avisCommissionConseil}
                              onChange={(e) => setFormData({...formData, avisCommissionConseil: e.target.value})}
                              placeholder="Avis de la commission recherche du conseil d'université"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>

                                              {/* Section Pièces jointes */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="mb-3">
                            <div className="text-xs uppercase tracking-wide text-uh2c-blue/70">section</div>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">DOSSIER À FOURNIR</h3>
                          </div>
                        <div className="space-y-4">
                          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-uh2c-blue/10 rounded flex items-center justify-center">
                                <FolderOpen className="h-3 w-3 text-uh2c-blue" />
                              </div>
                              <span className="text-sm font-medium text-gray-800">Documents obligatoires</span>
                            </div>
                          </div>
                          
                          {/* Champs individuels pour chaque document */}
                          <div className="grid grid-cols-1 gap-4">
                            {/* Demande manuscrite */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                Demande manuscrite adressée au Président de l'Université
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="demandeManuscrit" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.demandeManuscrit ? formData.demandeManuscrit.name : "Sélectionner le fichier"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="demandeManuscrit"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFormData({...formData, demandeManuscrit: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Lettre d'invitation */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                Lettre officielle d'invitation ou d'acceptation
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="lettreInvitation" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.lettreInvitation ? formData.lettreInvitation.name : "Sélectionner le fichier"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="lettreInvitation"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFormData({...formData, lettreInvitation: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Programme de la manifestation */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                Programme de la manifestation scientifique
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="programmeManifestation" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.programmeManifestation ? formData.programmeManifestation.name : "Sélectionner le fichier"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="programmeManifestation"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFormData({...formData, programmeManifestation: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Résumé de la communication */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                Résumé de la communication présentée
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="resumeCommunication" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.resumeCommunication ? formData.resumeCommunication.name : "Sélectionner le fichier"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="resumeCommunication"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFormData({...formData, resumeCommunication: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Formulaire de mobilité */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                Formulaire de demande de mobilité
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="formulaireMobilite" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.formulaireMobilite ? formData.formulaireMobilite.name : "Sélectionner le fichier"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="formulaireMobilite"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFormData({...formData, formulaireMobilite: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Carte d'étudiant (optionnel pour les doctorants) */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                Carte d'étudiant ou attestation d'inscription (pour les doctorants)
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="carteEtudiant" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.carteEtudiant ? formData.carteEtudiant.name : "Sélectionner le fichier (optionnel)"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="carteEtudiant"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFormData({...formData, carteEtudiant: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            

                            {/* Formulaire de demande de soutien */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                Formulaire de demande de soutien à l'organisation de manifestation scientifique dûment rempli
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="formulaireDemandeSoutien" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.formulaireDemandeSoutien ? formData.formulaireDemandeSoutien.name : "Sélectionner le fichier"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="formulaireDemandeSoutien"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFormData({...formData, formulaireDemandeSoutien: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Fiche financière prévisionnelle */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                Fiche financière prévisionnelle (recettes, dépenses)
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="ficheFinanciere" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.ficheFinanciere ? formData.ficheFinanciere.name : "Sélectionner le fichier"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="ficheFinanciere"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    onChange={(e) => setFormData({...formData, ficheFinanciere: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Programme final ou prévisionnel */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                Programme final ou prévisionnel de la manifestation
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="programmeFinal" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.programmeFinal ? formData.programmeFinal.name : "Sélectionner le fichier"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="programmeFinal"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setFormData({...formData, programmeFinal: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Pièces justificatives */}
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-2">
                                <span className="text-red-500 font-bold">*</span>
                                Toutes pièces jugées justificatives nécessaires (dépliant, affiche, actes de précédentes éditions, …)
                              </Label>
                              <div className="mt-1">
                                <label htmlFor="piecesJustificatives" className="block">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                    <div className="flex items-center justify-center space-x-2">
                                      <Upload className="h-4 w-4 text-uh2c-blue" />
                                      <span className="text-sm text-gray-700">
                                        {formData.piecesJustificatives ? formData.piecesJustificatives.name : "Sélectionner le fichier"}
                                      </span>
                                    </div>
                                  </div>
                                  <Input
                                    id="piecesJustificatives"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => setFormData({...formData, piecesJustificatives: e.target.files?.[0] || null})}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>Pour les enseignants :</strong> Au retour un rapport de mission est à déposer à la présidence de l'Université.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit">
                          {editingItem ? "Modifier" : "Soumettre"} la demande
                        </Button>
                      </div>
                        </>
                      ) : (
                        <>
                          {/* FORMULAIRE D'ORGANISATION */}
                          
                          {/* 1. INTITULÉ DE LA MANIFESTATION */}
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                      <div className="flex items-center space-x-2 mb-3">
                            <FileText className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">INTITULÉ DE LA MANIFESTATION</h3>
                          </div>
                            <div>
                              <Label>Intitulé de la manifestation <span className="text-red-500 font-bold">*</span></Label>
                              <Input
                                placeholder="Intitulé de la manifestation"
                                className="mt-1"
                                required
                              />
                            </div>
                          </div>

                          {/* 2. CARACTÈRE */}
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                      <div className="flex items-center space-x-2 mb-3">
                            <Globe className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">CARACTÈRE</h3>
                          </div>
                            <RadioGroup className="flex space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="national" id="national" />
                                <Label htmlFor="national">national</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="regional" id="regional" />
                                <Label htmlFor="regional">regional</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="international" id="international" />
                                <Label htmlFor="international">international</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* 3. THÉMATIQUE */}
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                      <div className="flex items-center space-x-2 mb-3">
                            <BookOpen className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">THÉMATIQUE</h3>
                          </div>
                            <div>
                              <Label>Thématique de la manifestation</Label>
                         <Textarea
                           placeholder="Thématique de la manifestation"
                                className="mt-1"
                           rows={3}
                         />
                            </div>
                       </div>

                          {/* 4. ORGANISATION */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                      <div className="flex items-center space-x-2 mb-3">
                            <Building2 className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">ORGANISATION</h3>
                          </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                                <Label>Lieu <span className="text-red-500 font-bold">*</span></Label>
                            <Input
                              placeholder="Lieu de la manifestation"
                                  className="mt-1"
                              required
                            />
                          </div>
                          <div>
                                <Label>Date <span className="text-red-500 font-bold">*</span></Label>
                            <Input
                              type="date"
                                  className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label>Structure UH2C organisatrice</Label>
                                <Select>
                                  <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Sélectionner une structure" />
                              </SelectTrigger>
                              <SelectContent>
                                    <SelectItem value="faculte-sciences">Faculté des Sciences</SelectItem>
                                    <SelectItem value="faculte-droit">Faculté de Droit</SelectItem>
                                    <SelectItem value="faculte-medecine">Faculté de Médecine</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Co-organisateur(s)</Label>
                            <Input
                              placeholder="Co-organisateurs"
                                  className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                          {/* 5. COORDONNATEUR DE LA MANIFESTATION */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                      <div className="flex items-center space-x-2 mb-3">
                            <User className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">COORDONNATEUR DE LA MANIFESTATION</h3>
                          </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                                <Label>Nom & Prénom <span className="text-red-500 font-bold">*</span></Label>
                            <Input
                              placeholder="Nom et prénom du coordinateur"
                                  className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label>Établissement d'attache</Label>
                            <Input
                              placeholder="Établissement d'attache"
                                  className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Laboratoire d'affiliation</Label>
                            <Input
                              placeholder="Laboratoire d'affiliation"
                                  className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Adresse</Label>
                            <Input
                              placeholder="Adresse"
                                  className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Téléphone</Label>
                            <Input
                              placeholder="Téléphone"
                                  className="mt-1"
                            />
                          </div>
                          <div>
                                <Label>Email <span className="text-red-500 font-bold">*</span></Label>
                            <Input
                              type="email"
                              placeholder="Email"
                                  className="mt-1"
                              required
                            />
                          </div>
                        </div>
                        
                                                        <div className="mt-4">
                              <Label className="text-sm font-medium">Avez-vous déjà bénéficié d'un soutien de la part de l'UH2C ?</Label>
                              <RadioGroup 
                                value={soutienUH2C} 
                                onValueChange={setSoutienUH2C}
                                className="flex space-x-4 mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="oui" id="soutien-oui" />
                                  <Label htmlFor="soutien-oui">OUI</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="non" id="soutien-non" />
                                  <Label htmlFor="soutien-non">NON</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            {/* Champs conditionnels si OUI */}
                            {soutienUH2C === "oui" && (
                              <div className="mt-4 space-y-4">
                                <div>
                                  <Label className="text-sm font-medium">Si oui pour quelle(s) manifestation(s)?</Label>
                                  <Input
                                    placeholder="Précisez les manifestations"
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Date</Label>
                                  <Input
                                    type="date"
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            )}
                                             </div>

                          {/* 6. DESCRIPTION DE LA MANIFESTATION */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                      <div className="flex items-center space-x-2 mb-3">
                            <FileText className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">DESCRIPTION DE LA MANIFESTATION</h3>
                          </div>
                            <div>
                              <Label>Présentation générale, objectifs, retombées scientifiques attendues, publication des actes…</Label>
                         <Textarea
                           placeholder="Description détaillée de la manifestation, ses objectifs et retombées attendues"
                                className="mt-1"
                           rows={6}
                         />
                            </div>
                       </div>

                          {/* 7. COMPOSITION DU COMITÉ SCIENTIFIQUE */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                      <div className="flex items-center space-x-2 mb-3">
                            <Users className="h-4 w-4 text-uh2c-blue" />
                            <h3 className="text-sm font-semibold text-gray-900">COMPOSITION DU COMITÉ SCIENTIFIQUE</h3>
                          </div>
                                                          <div>
                                <Textarea
                                  placeholder="Liste des membres du comité scientifique indiquant leur titre, fonction, institution et pays d'origine, ainsi que leurs lettres d'engagement"
                                  className="mt-1"
                                  rows={4}
                                />
                              </div>
                       </div>

                          {/* 8. COMPOSITION DU COMITÉ D'ORGANISATION */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                          <div className="flex items-center space-x-2 mb-3">
                                <Users className="h-4 w-4 text-uh2c-blue" />
                                <h3 className="text-sm font-semibold text-gray-900">COMPOSITION DU COMITÉ D'ORGANISATION</h3>
                              </div>
                                                          <div>
                                <Textarea
                                  placeholder="Liste des membres du comité d'organisation indiquant leur titre, fonction, institution et pays d'origine"
                                  className="mt-1"
                                  rows={4}
                                />
                              </div>
                       </div>

                          {/* 9. NOMBRE PRÉVU D'INTERVENANTS */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                                              <UserPlus className="h-4 w-4 text-uh2c-blue" />
                              <h3 className="text-sm font-semibold text-gray-900">NOMBRE PRÉVU D'INTERVENANTS</h3>
                            </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                             <Label>uh2c</Label>
                             <Input
                                  type="number"
                               placeholder="nombre d'intervenants uh2c"
                                  className="mt-1"
                             />
                           </div>
                           <div>
                             <Label>autres universités</Label>
                             <Input
                                  type="number"
                               placeholder="nombre d'intervenants autres universités"
                                  className="mt-1"
                             />
                           </div>
                           <div>
                             <Label>secteurs socio économiques</Label>
                             <Input
                                  type="number"
                               placeholder="nombre d'intervenants secteurs socio-économiques"
                                  className="mt-1"
                             />
                           </div>
                           
                         </div>
                       </div>

                          {/* 10. NOMBRE ESTIMÉ DE PARTICIPANTS */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                                              <Users className="h-4 w-4 text-uh2c-blue" />
                              <h3 className="text-sm font-semibold text-gray-900">NOMBRE ESTIMÉ DE PARTICIPANTS</h3>
                            </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                             <Label>Nationaux</Label>
                             <Input
                                  type="number"
                                  inputMode="numeric"
                                  min={0}
                                  step={1}
                                  onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                      e.preventDefault()
                                    }
                                  }}
                                  onPaste={(e) => {
                                    const text = e.clipboardData.getData("text")
                                    if (/[^0-9]/.test(text)) {
                                      e.preventDefault()
                                    }
                                  }}
                               placeholder="Nombre de participants nationaux"
                                  className="mt-1"
                             />
                           </div>
                           <div>
                             <Label>Étrangers</Label>
                             <Input
                                  type="number"
                                  inputMode="numeric"
                                  min={0}
                                  step={1}
                                  onKeyDown={(e) => {
                                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                                      e.preventDefault()
                                    }
                                  }}
                                  onPaste={(e) => {
                                    const text = e.clipboardData.getData("text")
                                    if (/[^0-9]/.test(text)) {
                                      e.preventDefault()
                                    }
                                  }}
                               placeholder="Nombre de participants étrangers"
                                  className="mt-1"
                             />
                           </div>
                         </div>
                       </div>

                          {/* 11. PROGRAMME PRÉVISIONNEL */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                          <div className="flex items-center space-x-2 mb-3">
                                <Calendar className="h-4 w-4 text-uh2c-blue" />
                                <h3 className="text-sm font-semibold text-gray-900">PROGRAMME PRÉVISIONNEL</h3>
                              </div>
                            <div className="space-y-4">
                              <div>
                                <Label>Programme prévisionnel détaillé de la manifestation</Label>
                         <Textarea
                           placeholder="Programme prévisionnel détaillé de la manifestation"
                                  className="mt-1"
                           rows={4}
                         />
                              </div>
                              <div>
                                <Label>argumentaire résumé justifiant la demande</Label>
                           <Textarea
                             placeholder="Argumentaire justifiant la demande de soutien"
                                  className="mt-1"
                                  rows={4}
                           />
                              </div>
                         </div>
                       </div>

                          {/* 12. NATURE DE L'APPUI SOLLICITÉ */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                                              <DollarSign className="h-4 w-4 text-uh2c-blue" />
                              <h3 className="text-sm font-semibold text-gray-900">NATURE DE L'APPUI SOLLICITÉ À LA PRÉSIDENCE DE L'UNIVERSITÉ HASSAN II DE CASABLANCA</h3>
                            </div>
                         <div className="space-y-4">
                           <div>
                                <Label>soutien à la participation</Label>
                             <Textarea
                               placeholder="Détails du soutien à la participation sollicité"
                                  className="mt-1"
                               rows={3}
                             />
                           </div>
                           <div>
                                <Label>publication des actes de la manifestation</Label>
                             <Textarea
                               placeholder="Détails sur la publication des actes"
                                  className="mt-1"
                               rows={3}
                             />
                           </div>
                           <div>
                                <Label>autre(s) contribution(s) sollicitée(s) (à préciser)</Label>
                             <Textarea
                               placeholder="Autres contributions sollicitées"
                                  className="mt-1"
                               rows={3}
                             />
                           </div>
                         </div>
                       </div>

                          {/* 13. BÉNÉFICIEZ-VOUS D'AUTRES SOUTIENS */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                                              <Handshake className="h-4 w-4 text-uh2c-blue" />
                              <h3 className="text-sm font-semibold text-gray-900">BÉNÉFICIEZ-VOUS D'AUTRES SOUTIENS</h3>
                            </div>
                            <div className="space-y-4">
                           <div>
                                <Label>Accordés</Label>
                             <Textarea
                               placeholder="Soutiens déjà accordés"
                                  className="mt-1"
                               rows={3}
                             />
                           </div>
                           <div>
                                <Label>En prospection</Label>
                             <Textarea
                               placeholder="Soutiens en prospection"
                                  className="mt-1"
                               rows={3}
                             />
                           </div>
                         </div>
                       </div>

                          {/* 14. PRÉVISIONS BUDGÉTAIRES */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-3">
                                                              <Calculator className="h-4 w-4 text-uh2c-blue" />
                              <h3 className="text-sm font-semibold text-gray-900">PRÉVISIONS BUDGÉTAIRES DE LA MANIFESTATION</h3>
                            </div>
                         <div className="space-y-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                  <Label>Frais de déplacement (*)</Label>
                               <Input
                                 type="number"
                                 inputMode="numeric"
                                 min={0}
                                 step={1}
                                 onKeyDown={(e) => {
                                   if (["e", "E", "+", "-", "."].includes(e.key)) {
                                     e.preventDefault()
                                   }
                                 }}
                                 onPaste={(e) => {
                                   const text = e.clipboardData.getData("text")
                                   if (/[^0-9]/.test(text)) {
                                     e.preventDefault()
                                   }
                                 }}
                                    placeholder="0"
                                    className="mt-1"
                               />
                             </div>
                             <div>
                                  <Label>Frais de séjour (*)</Label>
                               <Input
                                 type="number"
                                 inputMode="numeric"
                                 min={0}
                                 step={1}
                                 onKeyDown={(e) => {
                                   if (["e", "E", "+", "-", "."].includes(e.key)) {
                                     e.preventDefault()
                                   }
                                 }}
                                 onPaste={(e) => {
                                   const text = e.clipboardData.getData("text")
                                   if (/[^0-9]/.test(text)) {
                                     e.preventDefault()
                                   }
                                 }}
                                    placeholder="0"
                                    className="mt-1"
                               />
                             </div>
                             <div>
                                  <Label>Publication des actes</Label>
                               <Input
                                 type="number"
                                 inputMode="numeric"
                                 min={0}
                                 step={1}
                                 onKeyDown={(e) => {
                                   if (["e", "E", "+", "-", "."].includes(e.key)) {
                                     e.preventDefault()
                                   }
                                 }}
                                 onPaste={(e) => {
                                   const text = e.clipboardData.getData("text")
                                   if (/[^0-9]/.test(text)) {
                                     e.preventDefault()
                                   }
                                 }}
                                    placeholder="0"
                                    className="mt-1"
                               />
                             </div>
                             <div>
                                  <Label>Promotion de la langue arabe</Label>
                               <Input
                                 type="number"
                                 inputMode="numeric"
                                 min={0}
                                 step={1}
                                 onKeyDown={(e) => {
                                   if (["e", "E", "+", "-", "."].includes(e.key)) {
                                     e.preventDefault()
                                   }
                                 }}
                                 onPaste={(e) => {
                                   const text = e.clipboardData.getData("text")
                                   if (/[^0-9]/.test(text)) {
                                     e.preventDefault()
                                   }
                                 }}
                                    placeholder="0"
                                    className="mt-1"
                               />
                             </div>
                             <div>
                                  <Label>Restauration (repas)</Label>
                               <Input
                                 type="number"
                                 inputMode="numeric"
                                 min={0}
                                 step={1}
                                 onKeyDown={(e) => {
                                   if (["e", "E", "+", "-", "."].includes(e.key)) {
                                     e.preventDefault()
                                   }
                                 }}
                                 onPaste={(e) => {
                                   const text = e.clipboardData.getData("text")
                                   if (/[^0-9]/.test(text)) {
                                     e.preventDefault()
                                   }
                                 }}
                                    placeholder="0"
                                    className="mt-1"
                               />
                             </div>
                             <div>
                                  <Label>Pauses café</Label>
                               <Input
                                 type="number"
                                 inputMode="numeric"
                                 min={0}
                                 step={1}
                                 onKeyDown={(e) => {
                                   if (["e", "E", "+", "-", "."].includes(e.key)) {
                                     e.preventDefault()
                                   }
                                 }}
                                 onPaste={(e) => {
                                   const text = e.clipboardData.getData("text")
                                   if (/[^0-9]/.test(text)) {
                                     e.preventDefault()
                                   }
                                 }}
                                    placeholder="0"
                                    className="mt-1"
                               />
                             </div>
                             <div>
                                  <Label>Besoins par participant</Label>
                               <Input
                                 type="number"
                                 inputMode="numeric"
                                 min={0}
                                 step={1}
                                 onKeyDown={(e) => {
                                   if (["e", "E", "+", "-", "."].includes(e.key)) {
                                     e.preventDefault()
                                   }
                                 }}
                                 onPaste={(e) => {
                                   const text = e.clipboardData.getData("text")
                                   if (/[^0-9]/.test(text)) {
                                     e.preventDefault()
                                   }
                                 }}
                                    placeholder="0"
                                    className="mt-1"
                               />
                             </div>
                             <div>
                                  <Label>Autres frais (à préciser)</Label>
                               <Input
                                 type="number"
                                 inputMode="numeric"
                                 min={0}
                                 step={1}
                                 onKeyDown={(e) => {
                                   if (["e", "E", "+", "-", "."].includes(e.key)) {
                                     e.preventDefault()
                                   }
                                 }}
                                 onPaste={(e) => {
                                   const text = e.clipboardData.getData("text")
                                   if (/[^0-9]/.test(text)) {
                                     e.preventDefault()
                                   }
                                 }}
                                    placeholder="0"
                                    className="mt-1"
                               />
                             </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                             <div>
                                  <Label className="font-semibold">TOTAL BUDGET</Label>
                               <Input
                                 type="number"
                                    placeholder="0"
                                    className="mt-1 font-bold"
                                    readOnly
                               />
                             </div>
                             <div>
                                  <Label className="font-semibold">TOTAL PART SOLLICITÉE</Label>
                               <Input
                                 type="number"
                                    placeholder="0"
                                    className="mt-1 font-bold"
                                    readOnly
                               />
                             </div>
                           </div>
                           <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                             <p className="text-sm text-yellow-800">
                               <strong>(*)</strong> Veuillez fournir en annexe une estimation détaillée des frais de déplacement et de séjour pour chaque participant que vous souhaitez prendre en charge.
                             </p>
                           </div>
                         </div>
                       </div>

                          {/* 15-17. AVIS ET RECOMMANDATIONS */}
                       <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <FileText className="h-5 w-5 text-uh2c-blue" />
                              <h3 className="text-base font-semibold text-gray-900">AVIS ET RECOMMANDATIONS</h3>
                            </div>
                         <div className="space-y-4">
                           <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2">Avis motivé du responsable de la structure de recherche (Laboratoire, Equipe, …)</Label>
                                <Textarea
                                  placeholder="Avis motivé du responsable de la structure de recherche (Laboratoire, Equipe, …)"
                                  className="mt-1"
                                  rows={3}
                                />
                                     </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2">Avis de la commission recherche du conseil d'établissement</Label>
                                <Textarea
                                  placeholder="Avis de la commission recherche du conseil d'établissement"
                                  className="mt-1"
                                  rows={3}
                                />
                                     </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2">Avis du chef d'établissement</Label>
                                <Textarea
                                  placeholder="Avis du chef d'établissement"
                                  className="mt-1"
                                  rows={3}
                                />
                                   </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2">Avis de la commission recherche du conseil d'université</Label>
                                <Textarea
                                  placeholder="Avis de la commission recherche du conseil d'université"
                                  className="mt-1"
                                  rows={3}
                                />
                                         </div>
                             </div>
                           </div>
                           
                          {/* DOSSIER À FOURNIR */}
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="mb-3">
                              <div className="text-xs uppercase tracking-wide text-uh2c-blue/70">section</div>
                              <h3 className="text-lg font-bold text-gray-900 mt-1">DOSSIER À FOURNIR</h3>
                            </div>
                            <div className="space-y-4">
                           <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-3">
                             <div className="flex items-center gap-2">
                               <div className="w-5 h-5 bg-uh2c-blue/10 rounded flex items-center justify-center">
                                 <FolderOpen className="h-3 w-3 text-uh2c-blue" />
                               </div>
                               <span className="text-sm font-medium text-gray-800">Documents obligatoires</span>
                             </div>
                           </div>
                           <div className="space-y-2">
                             <ul className="list-disc pl-6 text-sm text-gray-800 space-y-1">
                               <li>Demande, portant le numéro téléphone et l’adresse e-mail S/C du Chef d’établissement, adressée au Président de l’Université.</li>
                               <li>Une copie de la lettre officielle d’invitation ou d’acceptation de participation à la manifestation.</li>
                               <li>Le programme de la manifestation scientifique.</li>
                               <li>Résumé de la communication présentée à la manifestation scientifique.</li>
                               <li>Formulaire de demande de mobilité dûment renseigné et signé (formulaire disponible sur le site de l’Université).</li>
                               <li>Copie carte d’étudiant ou attestation d’inscription (pour les doctorants).</li>
                                </ul>
                           </div>
                         </div>
                       </div>

                       <div className="flex justify-end space-x-2 pt-4 border-t">
                         <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                           Annuler
                         </Button>
                         <Button type="submit">
                           {editingItem ? "Modifier" : "Soumettre"} la demande
                         </Button>
                       </div>
                        </>
                      )}
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

            </div>

            {/* Section de recherche et filtres */}
            <Card className="mb-3 border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-1">
                <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
                  <Search className="h-4 w-4 text-uh2c-blue" />
                  Recherche et filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <Input
                    placeholder="Rechercher une demande..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs border border-gray-200 focus:border-uh2c-blue focus:ring-1 focus:ring-uh2c-blue/20 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Coordonnateur</Label>
                    <Input
                      placeholder="Rechercher par coordonnateur..."
                      value={coordonnateurFilter}
                      onChange={(e) => setCoordonnateurFilter(e.target.value)}
                      className="h-8 text-xs border border-gray-200 focus:border-uh2c-blue focus:ring-1 focus:ring-uh2c-blue/20 rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Date début</Label>
                    <Input
                      type="date"
                      value={dateDebutFilter}
                      onChange={(e) => setDateDebutFilter(e.target.value)}
                      className="h-8 text-xs border border-gray-200 focus:border-uh2c-blue focus:ring-1 focus:ring-uh2c-blue/20 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Date fin</Label>
                    <Input
                      type="date"
                      value={dateFinFilter}
                      onChange={(e) => setDateFinFilter(e.target.value)}
                      className="h-8 text-xs border border-gray-200 focus:border-uh2c-blue focus:ring-1 focus:ring-uh2c-blue/20 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Ville/Pays</Label>
                    <Input
                      placeholder="Rechercher par ville/pays..."
                      value={villePaysFilter}
                      onChange={(e) => setVillePaysFilter(e.target.value)}
                      className="h-8 text-xs border border-gray-200 focus:border-uh2c-blue focus:ring-1 focus:ring-uh2c-blue/20 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-700">Manifestation</Label>
                    <Input
                      placeholder="Rechercher par manifestation..."
                      value={manifestationFilter}
                      onChange={(e) => setManifestationFilter(e.target.value)}
                      className="h-8 text-xs border border-gray-200 focus:border-uh2c-blue focus:ring-1 focus:ring-uh2c-blue/20 rounded-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des demandes */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {formType === "participation" 
                    ? "Liste des demandes de participation" 
                    : "Liste des demandes de contribution"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredDemandes.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune demande trouvée</p>
                    <p className="text-sm text-gray-400">Ajustez vos filtres ou ajoutez une nouvelle demande</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-blue-50 text-black">
                          <th className="text-left py-3 px-4 font-semibold">Demandeur</th>
                          <th className="text-left py-3 px-4 font-semibold">Type</th>
                          <th className="text-left py-3 px-4 font-semibold">Manifestation</th>
                          <th className="text-left py-3 px-4 font-semibold">Lieu</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                          <th className="text-left py-3 px-4 font-semibold">Prise en charge</th>
                          <th className="text-center py-3 px-4 font-semibold">Statut</th>
                          <th className="text-center py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDemandes.map((demande) => (
                          <tr key={demande.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{demande.nomDemandeur}</div>
                              <div className="text-xs text-gray-500">{demande.email}</div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-xs">
                                {demande.typeDemandeur}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{demande.intituleManifestation}</div>
                              <div className="text-xs text-gray-500">{demande.natureManifestation}</div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                {demande.lieuManifestation}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(demande.dateManifestation).toLocaleDateString('fr-FR')}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                {demande.naturePriseEnCharge === "Billet d'avion" ? (
                                  <Plane className="h-3 w-3 text-blue-500" />
                                ) : (
                                  <Hotel className="h-3 w-3 text-green-500" />
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {demande.naturePriseEnCharge}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className={`${getStatutColor(demande.statut)} text-xs`}>
                                {demande.statut}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(demande)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(demande.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
