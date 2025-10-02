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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, Calendar, MapPin, User, Users, Building2, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DemandeOrganisation {
  id: string
  intitule: string
  type: string
  lieu: string
  dateDebut: string
  dateFin: string
  nomPrenomCoordinateur: string
  nomsEnseignantsOrganisateursUh2c: string[]
  statutIndexation: "EnCours" | "Obtenu"
  partenaires: string
  publicCible: string[]
  resume: string
  justificatifs: File[]
  statut: "En attente" | "Approuvée" | "Rejetée"
  dateCreation: string
}

// Données de référence
const typesManifestation = [
  "Colloque",
  "Journée d'étude", 
  "Séminaire",
  "Atelier",
  "Conférence",
  "Symposium"
]

const etablissementsUH2C = [
  "Faculté des Sciences Ben M'Sik",
  "Faculté des Sciences Aïn Chock",
  "Faculté des Lettres et Sciences Humaines",
  "Faculté de Médecine et de Pharmacie",
  "École Nationale Supérieure d'Électricité et Mécanique",
  "École Nationale Supérieure des Arts et Métiers",
  "Institut Supérieur de Commerce et d'Administration des Entreprises"
]

const publicCibleOptions = [
  "Enseignants",
  "Doctorants",
  "Étudiants",
  "Industriels",
  "Chercheurs",
  "Professionnels",
  "Public général"
]

export default function OrganisationManifestation() {
  const [demandes, setDemandes] = useState<DemandeOrganisation[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DemandeOrganisation | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statutFilter, setStatutFilter] = useState<string>("all")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    intitule: "",
    type: "Colloque" as "Colloque" | "journée d'étude" | "séminaire" | "atelier",
    lieu: "",
    dateDebut: "",
    dateFin: "",
    nomPrenomCoordinateur: "",
    nomsEnseignantsOrganisateursUh2c: [] as string[],
    statutIndexation: "EnCours" as "EnCours" | "Obtenu",
    partenaires: "",
    publicCible: [] as string[],
    resume: "",
    justificatifs: [] as File[]
  })

  const filteredDemandes = demandes.filter((item) => {
    const matchesSearch =
      item.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomPrenomCoordinateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lieu.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesStatut = statutFilter === "all" || item.statut === statutFilter
    return matchesSearch && matchesType && matchesStatut
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation des champs obligatoires
    if (!formData.intitule || !formData.type || !formData.dateDebut || !formData.dateFin || 
        !formData.lieu || !formData.nomPrenomCoordinateur) {
      toast({ 
        title: "Erreur de validation", 
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      })
      return
    }

    // Validation des dates
    if (new Date(formData.dateDebut) > new Date(formData.dateFin)) {
      toast({ 
        title: "Erreur de validation", 
        description: "La date de début ne peut pas être postérieure à la date de fin",
        variant: "destructive"
      })
      return
    }

    const newDemande: DemandeOrganisation = {
      id: editingItem?.id || Date.now().toString(),
      intitule: formData.intitule,
      type: formData.type,
      lieu: formData.lieu,
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      nomPrenomCoordinateur: formData.nomPrenomCoordinateur,
      nomsEnseignantsOrganisateursUh2c: formData.nomsEnseignantsOrganisateursUh2c,
      statutIndexation: formData.statutIndexation,
      partenaires: formData.partenaires,
      publicCible: formData.publicCible,
      resume: formData.resume,
      justificatifs: formData.justificatifs,
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
      intitule: "",
      type: "Colloque",
      lieu: "",
      dateDebut: "",
      dateFin: "",
      nomPrenomCoordinateur: "",
      nomsEnseignantsOrganisateursUh2c: [],
      statutIndexation: "EnCours",
      partenaires: "",
      publicCible: [],
      resume: "",
      justificatifs: []
    })
    setEditingItem(null)
  }

  const handleEdit = (item: DemandeOrganisation) => {
    setEditingItem(item)
    setFormData({
      intitule: item.intitule,
      type: item.type,
      lieu: item.lieu,
      dateDebut: item.dateDebut,
      dateFin: item.dateFin,
      nomPrenomCoordinateur: item.nomPrenomCoordinateur,
      nomsEnseignantsOrganisateursUh2c: item.nomsEnseignantsOrganisateursUh2c,
      statutIndexation: item.statutIndexation,
      partenaires: item.partenaires,
      publicCible: item.publicCible,
      resume: item.resume,
      justificatifs: item.justificatifs
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
        justificatifs: Array.from(e.target.files || []),
      }))
    }
  }

  const handleAddOrganisateur = () => {
    const nouveauMembre = prompt("Entrez le nom et prénom de l'enseignant organisateur UH2C:")
    if (nouveauMembre && nouveauMembre.trim()) {
      setFormData(prev => ({
        ...prev,
        nomsEnseignantsOrganisateursUh2c: [...prev.nomsEnseignantsOrganisateursUh2c, nouveauMembre.trim()]
      }))
    }
  }

  const handleRemoveOrganisateur = (index: number) => {
    setFormData(prev => ({
      ...prev,
      nomsEnseignantsOrganisateursUh2c: prev.nomsEnseignantsOrganisateursUh2c.filter((_, i) => i !== index)
    }))
  }

  const handlePublicCibleChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      publicCible: checked 
        ? [...prev.publicCible, value]
        : prev.publicCible.filter(item => item !== value)
    }))
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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Demande d'organisation d'une manifestation à l'UH2C</h1>
                <Badge variant="secondary" className="bg-uh2c-blue/10 text-uh2c-blue">
                  Formulaire 1
                </Badge>
              </div>
              <p className="text-gray-600">Formulaire de demande d'organisation d'une manifestation scientifique</p>
            </div>

            {/* Filtres */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs">Recherche</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {typesManifestation.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Statut</Label>
                    <Select value={statutFilter} onValueChange={setStatutFilter}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Approuvée">Approuvée</SelectItem>
                        <SelectItem value="Rejetée">Rejetée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={resetForm} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Nouvelle demande
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogTitle className="sr-only">
                          {editingItem ? "Modification de la demande" : "Demande d'organisation d'une manifestation à l'UH2C"}
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
                                  {editingItem ? "Modification de la demande" : "Demande d'organisation d'une manifestation à l'UH2C"}
                                </h2>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  Remplissez tous les champs obligatoires (*) pour votre demande d'organisation
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Informations générales */}
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                <Calendar className="w-3 h-3 text-blue-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <Label htmlFor="intitule" className="text-sm font-medium">
                                  Intitulé <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="intitule"
                                  value={formData.intitule}
                                  onChange={(e) => setFormData({...formData, intitule: e.target.value})}
                                  placeholder="Intitulé de la manifestation"
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label htmlFor="type" className="text-sm font-medium">
                                  Type <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {typesManifestation.map((type) => (
                                      <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="lieu" className="text-sm font-medium">
                                  Lieu <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.lieu} onValueChange={(value) => setFormData({...formData, lieu: value})}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Sélectionner un établissement UH2C" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {etablissementsUH2C.map((etab) => (
                                      <SelectItem key={etab} value={etab}>{etab}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="dateDebut" className="text-sm font-medium">
                                  Date de début <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="dateDebut"
                                  type="date"
                                  value={formData.dateDebut}
                                  onChange={(e) => setFormData({...formData, dateDebut: e.target.value})}
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label htmlFor="dateFin" className="text-sm font-medium">
                                  Date de fin <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="dateFin"
                                  type="date"
                                  value={formData.dateFin}
                                  onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Coordinateur et organisateurs */}
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                                <User className="w-3 h-3 text-green-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">Coordinateur et organisateurs</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="coordinateur" className="text-sm font-medium">
                                  Coordinateur <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="coordinateur"
                                  value={formData.nomPrenomCoordinateur}
                                  onChange={(e) => setFormData({...formData, nomPrenomCoordinateur: e.target.value})}
                                  placeholder="Nom et prénom du coordinateur"
                                  className="mt-1"
                                />
                              </div>

                              <div>
                                <Label className="text-sm font-medium">
                                  Statut de l'indexation
                                </Label>
                                <Select value={formData.statutIndexation} onValueChange={(value) => setFormData({...formData, statutIndexation: value as "EnCours" | "Obtenu"})}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="EnCours">En cours</SelectItem>
                                    <SelectItem value="Obtenu">Obtenu</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="md:col-span-2">
                                <Label className="text-sm font-medium">
                                  Membres participants à l'organisation
                                </Label>
                                <div className="mt-1 space-y-2">
                                  {formData.nomsEnseignantsOrganisateursUh2c.map((membre, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <Input
                                        value={membre}
                                        readOnly
                                        className="flex-1"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveOrganisateur(index)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddOrganisateur}
                                    className="w-full"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Ajouter un membre organisateur
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Partenaires et public cible */}
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                                <Target className="w-3 h-3 text-purple-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">Partenaires et public cible</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="partenaires" className="text-sm font-medium">
                                  Partenaires
                                </Label>
                                <Textarea
                                  id="partenaires"
                                  value={formData.partenaires}
                                  onChange={(e) => setFormData({...formData, partenaires: e.target.value})}
                                  placeholder="Institutions partenaires ou financeurs"
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>

                              <div>
                                <Label className="text-sm font-medium">
                                  Public cible
                                </Label>
                                <div className="mt-1 space-y-2">
                                  {publicCibleOptions.map((option) => (
                                    <div key={option} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={option}
                                        checked={formData.publicCible.includes(option)}
                                        onCheckedChange={(checked) => handlePublicCibleChange(option, checked as boolean)}
                                      />
                                      <Label htmlFor={option} className="text-sm">{option}</Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Résumé et justificatifs */}
                          <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                                <Upload className="w-3 h-3 text-orange-600" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900">Résumé et justificatifs</h3>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="resume" className="text-sm font-medium">
                                  Résumé
                                </Label>
                                <Textarea
                                  id="resume"
                                  value={formData.resume}
                                  onChange={(e) => setFormData({...formData, resume: e.target.value})}
                                  placeholder="Description de la manifestation"
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>

                              <div>
                                <Label htmlFor="justificatifs" className="text-sm font-medium">
                                  Justificatifs
                                </Label>
                                <div className="mt-1">
                                  <label htmlFor="justificatifs" className="block">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-uh2c-blue transition-colors duration-200 bg-gray-50 hover:bg-uh2c-blue/5 cursor-pointer">
                                      <div className="flex flex-col items-center space-y-2">
                                        <div className="w-10 h-10 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                                          <Upload className="h-5 w-5 text-uh2c-blue" />
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-sm font-medium text-gray-700">
                                            Glissez-déposez vos fichiers ici
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            ou cliquez pour sélectionner des fichiers
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            PDF, DOC, DOCX acceptés
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <Input
                                      id="justificatifs"
                                      type="file"
                                      multiple
                                      accept=".pdf,.doc,.docx"
                                      onChange={handleFileUpload}
                                      className="hidden"
                                    />
                                  </label>
                                  
                                  {/* Liste des fichiers sélectionnés */}
                                  {formData.justificatifs.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                      <p className="text-xs font-medium text-gray-700">Fichiers sélectionnés :</p>
                                      <div className="space-y-1">
                                        {formData.justificatifs.map((file, index) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-uh2c-blue/5 rounded border border-uh2c-blue/20">
                                            <div className="flex items-center space-x-2">
                                              <Upload className="h-4 w-4 text-uh2c-blue" />
                                              <span className="text-sm text-gray-700">{file.name}</span>
                                              <span className="text-xs text-gray-500">
                                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                              </span>
                                            </div>
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                const newFiles = formData.justificatifs.filter((_, i) => i !== index)
                                                setFormData({...formData, justificatifs: newFiles})
                                              }}
                                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
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
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des demandes */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des demandes d'organisation</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredDemandes.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune demande trouvée</p>
                    <p className="text-sm text-gray-400">Ajustez vos filtres ou ajoutez une nouvelle demande</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Intitulé</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Dates</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Lieu</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Coordinateur</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Statut</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDemandes.map((demande) => (
                          <tr key={demande.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{demande.intitule}</div>
                                <div className="text-xs text-gray-500">{demande.statutIndexation}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="text-xs">
                                {demande.type}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-gray-400" />
                                {new Date(demande.dateDebut).toLocaleDateString('fr-FR')} - {new Date(demande.dateFin).toLocaleDateString('fr-FR')}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                {demande.lieu}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-gray-400" />
                                {demande.nomPrenomCoordinateur}
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
