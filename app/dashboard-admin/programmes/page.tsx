"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, Building, DollarSign } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

interface Programme {
  id: string
  libelle: string
  descriptif: string
  sousProgramme: string
  descriptifSousProgramme: string
  typologie: string
  dateOuverture: string
  dateLimite: string
  organismeContractant: string
  financement: number
  statut: "en_cours" | "inactif" | "termine"
  createdAt: string
}

export default function ProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProgramme, setEditingProgramme] = useState<Programme | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatut, setFilterStatut] = useState<string>("all")

  const [formData, setFormData] = useState({
    libelle: "",
    descriptif: "",
    sousProgramme: "",
    descriptifSousProgramme: "",
    typologie: "",
    dateOuverture: "",
    dateLimite: "",
    organismeContractant: "",
    financement: 0
  })

  const [errors, setErrors] = useState({
    libelle: false,
    descriptif: false,
    sousProgramme: false,
    descriptifSousProgramme: false,
    typologie: false,
    dateOuverture: false,
    dateLimite: false,
    organismeContractant: false,
    financement: false
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

  const handleSubmit = () => {
    // Validation
    const newErrors = {
      libelle: !formData.libelle,
      descriptif: !formData.descriptif,
      sousProgramme: !formData.sousProgramme,
      descriptifSousProgramme: !formData.descriptifSousProgramme,
      typologie: !formData.typologie,
      dateOuverture: !formData.dateOuverture,
      dateLimite: !formData.dateLimite,
      organismeContractant: !formData.organismeContractant,
      financement: formData.financement <= 0
    }

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors)
      return
    }

    // Validation des dates
    const dateOuverture = new Date(formData.dateOuverture)
    const dateLimite = new Date(formData.dateLimite)
    const dateActuelle = new Date()
    
    // Calcul de la date maximale (2 ans après la date d'ouverture)
    const dateMaximale = new Date(dateOuverture)
    dateMaximale.setFullYear(dateMaximale.getFullYear() + 2)
    
    // La date d'ouverture ne doit pas dépasser la date actuelle
    if (dateOuverture > dateActuelle) {
      alert("La date d'ouverture des appels ne peut pas dépasser la date actuelle")
      return
    }
    
    // La date limite doit être postérieure à la date d'ouverture
    if (dateLimite <= dateOuverture) {
      alert("La date limite doit être postérieure à la date d'ouverture")
      return
    }
    
    // La date limite ne doit pas dépasser la date maximale (2 ans après l'ouverture)
    if (dateLimite > dateMaximale) {
      alert(`La date limite ne peut pas dépasser ${dateMaximale.toLocaleDateString('fr-FR')} (2 ans après la date d'ouverture)`)
      return
    }

    if (editingProgramme) {
      // Mise à jour
      const updatedProgrammes = programmes.map(p => 
        p.id === editingProgramme.id 
          ? { ...formData, id: p.id, statut: p.statut, createdAt: p.createdAt }
          : p
      )
      setProgrammes(updatedProgrammes)
    } else {
      // Ajout
      const newProgramme: Programme = {
        id: `PROG${String(programmes.length + 1).padStart(3, "0")}`,
        ...formData,
        statut: "en_cours",
        createdAt: new Date().toISOString()
      }
      setProgrammes([...programmes, newProgramme])
    }

    handleClose()
  }

  const handleEdit = (programme: Programme) => {
    setEditingProgramme(programme)
    setFormData({
      libelle: programme.libelle,
      descriptif: programme.descriptif,
      sousProgramme: programme.sousProgramme,
      descriptifSousProgramme: programme.descriptifSousProgramme,
      typologie: programme.typologie,
      dateOuverture: programme.dateOuverture,
      dateLimite: programme.dateLimite,
      organismeContractant: programme.organismeContractant,
      financement: programme.financement
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
      setProgrammes(programmes.filter(p => p.id !== id))
    }
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingProgramme(null)
    setFormData({
      libelle: "",
      descriptif: "",
      sousProgramme: "",
      descriptifSousProgramme: "",
      typologie: "",
      dateOuverture: "",
      dateLimite: "",
      organismeContractant: "",
      financement: 0
    })
    setErrors({
      libelle: false,
      descriptif: false,
      sousProgramme: false,
      descriptifSousProgramme: false,
      typologie: false,
      dateOuverture: false,
      dateLimite: false,
      organismeContractant: false,
      financement: false
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR")
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "en_cours":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>
      case "inactif":
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
      case "termine":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{statut}</Badge>
    }
  }

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.sousProgramme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.organismeContractant.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatut = filterStatut === "all" || programme.statut === filterStatut
    
    return matchesSearch && matchesStatut
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Programmes</h1>
                <p className="text-gray-600 mt-2">Ajoutez et gérez les programmes de recherche</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau programme
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProgramme ? "Modifier le programme" : "Ajouter un nouveau programme"}
                    </DialogTitle>
                    <DialogDescription>
                      Remplissez les informations du programme de recherche
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    {/* Profil concerné */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Profil concerné</h3>
                      <p className="text-sm text-blue-700">UH2C</p>
                    </div>

                    {/* Programme */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Programme - Libellé du programme <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        value={formData.libelle}
                        onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                        placeholder="Ex: Programme National de Recherche en IA"
                        className={errors.libelle ? "border-red-500" : ""}
                      />
                      {errors.libelle && (
                        <p className="text-sm text-red-600">Le libellé du programme est requis</p>
                      )}
                    </div>

                    {/* Descriptif du programme */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Descriptif du programme <span className="text-red-600">*</span>
                      </Label>
                      <Textarea
                        value={formData.descriptif}
                        onChange={(e) => setFormData({ ...formData, descriptif: e.target.value })}
                        placeholder="Description détaillée du programme..."
                        rows={3}
                        className={errors.descriptif ? "border-red-500" : ""}
                      />
                      {errors.descriptif && (
                        <p className="text-sm text-red-600">Le descriptif du programme est requis</p>
                      )}
                    </div>

                    {/* Sous programme */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Sous programme <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        value={formData.sousProgramme}
                        onChange={(e) => setFormData({ ...formData, sousProgramme: e.target.value })}
                        placeholder="Ex: Intelligence artificielle appliquée"
                        className={errors.sousProgramme ? "border-red-500" : ""}
                      />
                      {errors.sousProgramme && (
                        <p className="text-sm text-red-600">Le sous programme est requis</p>
                      )}
                    </div>

                    {/* Descriptif du sous programme */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Descriptif du sous programme <span className="text-red-600">*</span>
                      </Label>
                      <Textarea
                        value={formData.descriptifSousProgramme}
                        onChange={(e) => setFormData({ ...formData, descriptifSousProgramme: e.target.value })}
                        placeholder="Description détaillée du sous programme..."
                        rows={3}
                        className={errors.descriptifSousProgramme ? "border-red-500" : ""}
                      />
                      {errors.descriptifSousProgramme && (
                        <p className="text-sm text-red-600">Le descriptif du sous programme est requis</p>
                      )}
                    </div>

                    {/* Typologie des projets */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Typologie des projets <span className="text-red-600">*</span>
                      </Label>
                      <Select
                        value={formData.typologie}
                        onValueChange={(value) => setFormData({ ...formData, typologie: value })}
                      >
                        <SelectTrigger className={errors.typologie ? "border-red-500" : ""}>
                          <SelectValue placeholder="Sélectionnez une typologie" />
                        </SelectTrigger>
                        <SelectContent>
                          {typologies.map((typologie) => (
                            <SelectItem key={typologie} value={typologie}>
                              {typologie}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.typologie && (
                        <p className="text-sm text-red-600">La typologie est requise</p>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Date d'ouverture des appels <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          type="date"
                          value={formData.dateOuverture}
                          onChange={(e) => setFormData({ ...formData, dateOuverture: e.target.value })}
                          max={new Date().toISOString().split('T')[0]}
                          className={errors.dateOuverture ? "border-red-500" : ""}
                        />
                        <p className="text-xs text-gray-500">La date d'ouverture ne peut pas dépasser la date actuelle</p>
                        {errors.dateOuverture && (
                          <p className="text-sm text-red-600">La date d'ouverture est requise</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Date limite de soumission <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          type="date"
                          value={formData.dateLimite}
                          onChange={(e) => setFormData({ ...formData, dateLimite: e.target.value })}
                          min={formData.dateOuverture}
                          max={formData.dateOuverture ? (() => {
                            const dateMax = new Date(formData.dateOuverture)
                            dateMax.setFullYear(dateMax.getFullYear() + 2)
                            return dateMax.toISOString().split('T')[0]
                          })() : undefined}
                          className={errors.dateLimite ? "border-red-500" : ""}
                        />
                        <p className="text-xs text-gray-500">
                          {formData.dateOuverture 
                            ? `Doit être entre ${formData.dateOuverture} et ${(() => {
                                const dateMax = new Date(formData.dateOuverture)
                                dateMax.setFullYear(dateMax.getFullYear() + 2)
                                return dateMax.toISOString().split('T')[0]
                              })()} (max 2 ans après l'ouverture)`
                            : "Sélectionnez d'abord une date d'ouverture"
                          }
                        </p>
                        {errors.dateLimite && (
                          <p className="text-sm text-red-600">La date limite est requise</p>
                        )}
                      </div>
                    </div>

                    {/* Organisme contractant */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Organisme contractant <span className="text-red-600">*</span>
                      </Label>
                      <Select
                        value={formData.organismeContractant}
                        onValueChange={(value) => setFormData({ ...formData, organismeContractant: value })}
                      >
                        <SelectTrigger className={errors.organismeContractant ? "border-red-500" : ""}>
                          <SelectValue placeholder="Sélectionnez un organisme" />
                        </SelectTrigger>
                        <SelectContent>
                          {organismes.map((organisme) => (
                            <SelectItem key={organisme} value={organisme}>
                              {organisme}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.organismeContractant && (
                        <p className="text-sm text-red-600">L'organisme contractant est requis</p>
                      )}
                    </div>

                    {/* Financement */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Financement (MAD) <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        type="number"
                        value={formData.financement}
                        onChange={(e) => setFormData({ ...formData, financement: Number(e.target.value) })}
                        placeholder="Montant en dirhams"
                        className={errors.financement ? "border-red-500" : ""}
                      />
                      {errors.financement && (
                        <p className="text-sm text-red-600">Le financement doit être supérieur à 0</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={handleClose}>
                      Annuler
                    </Button>
                    <Button onClick={handleSubmit} className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                      {editingProgramme ? "Modifier" : "Ajouter"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filtres */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher par libellé, sous programme ou organisme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select value={filterStatut} onValueChange={setFilterStatut}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="termine">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des programmes */}
            {filteredProgrammes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Building className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun programme trouvé</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    {programmes.length === 0 
                      ? "Commencez par ajouter votre premier programme de recherche."
                      : "Aucun programme ne correspond à vos critères de recherche."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredProgrammes.map((programme) => (
                  <Card key={programme.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{programme.libelle}</CardTitle>
                          <CardDescription className="mb-3">{programme.descriptif}</CardDescription>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {programme.organismeContractant}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatBudget(programme.financement)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(programme.dateLimite)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatutBadge(programme.statut)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(programme)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(programme.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Sous programme</h4>
                          <p className="text-sm text-gray-600">{programme.sousProgramme}</p>
                          <p className="text-xs text-gray-500 mt-1">{programme.descriptifSousProgramme}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Typologie</h4>
                          <p className="text-sm text-gray-600">{programme.typologie}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Ouverture: {formatDate(programme.dateOuverture)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 