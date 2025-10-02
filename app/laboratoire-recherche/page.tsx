"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { 
  FlaskConical, 
  Microscope, 
  TestTube, 
  Beaker, 
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Upload,
  Send,
  User,
  Building,
  Mail,
  Phone
} from "lucide-react"

export default function LaboratoireRecherchePage() {
  const [formData, setFormData] = useState({
    nomPrenom: "",
    grade: "",
    email: "",
    telephone: "",
    establishment: "",
    discipline: "",
    dateRecrutement: "",
    typeIntegration: "",
    premiereDemande: "",
    anciensLaboratoires: "",
    laboratoireDemande: "",
    equipeDemande: "",
    etablissementAttache: "",
    cv: null as File | null,
    pvConseil: null as File | null
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulaire soumis:", formData)
    // Ici vous pouvez ajouter la logique pour envoyer les données
    setIsDialogOpen(false)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
    // Réinitialiser le formulaire
    setFormData({
      nomPrenom: "",
      grade: "",
      email: "",
      telephone: "",
      establishment: "",
      discipline: "",
      dateRecrutement: "",
      typeIntegration: "",
      premiereDemande: "",
      anciensLaboratoires: "",
      laboratoireDemande: "",
      equipeDemande: "",
      etablissementAttache: "",
      cv: null,
      pvConseil: null
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
          <div className="w-full max-w-6xl mx-auto">
            {/* En-tête */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Laboratoire de Recherche</h1>
                <p className="text-muted-foreground">
                  Gérez vos projets de recherche et vos expérimentations en laboratoire
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                    <FlaskConical className="mr-2 h-4 w-4" />
                    Demande d'Intégration
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="sr-only">
                      Formulaire de demande d'intégration d'un laboratoire de recherche UH2C
                    </DialogTitle>
                  </DialogHeader>
                  
                  {/* En-tête unifié du formulaire */}
                  <div className="mb-4">
                    <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-3 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                          <FlaskConical className="h-3 w-3 text-uh2c-blue" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-uh2c-blue">
                            FORMULAIRE DE DEMANDE D'INTÉGRATION D'UN LABORATOIRE DE RECHERCHE UH2C
                          </h2>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Remplissez tous les champs obligatoires (*) pour votre demande d'intégration
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 rounded-lg p-4 bg-white">
                    {/* Informations personnelles */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nomPrenom" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nom et Prénom <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="nomPrenom"
                          value={formData.nomPrenom}
                          onChange={(e) => handleInputChange("nomPrenom", e.target.value)}
                          placeholder="Entrez votre nom et prénom..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade <span className="text-red-500">*</span></Label>
                        <Input
                          id="grade"
                          value={formData.grade}
                          onChange={(e) => handleInputChange("grade", e.target.value)}
                          placeholder="Entrez votre grade..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Entrez votre adresse email..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telephone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Tél <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="telephone"
                          value={formData.telephone}
                          onChange={(e) => handleInputChange("telephone", e.target.value)}
                          placeholder="Entrez votre numéro de téléphone..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="establishment" className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Establishment <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="establishment"
                          value={formData.establishment}
                          onChange={(e) => handleInputChange("establishment", e.target.value)}
                          placeholder="Entrez votre établissement..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discipline">Discipline / Spécialité <span className="text-red-500">*</span></Label>
                        <Input
                          id="discipline"
                          value={formData.discipline}
                          onChange={(e) => handleInputChange("discipline", e.target.value)}
                          placeholder="Entrez votre discipline ou spécialité..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateRecrutement" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date de recrutement <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="dateRecrutement"
                          type="date"
                          value={formData.dateRecrutement}
                          onChange={(e) => handleInputChange("dateRecrutement", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Type d'intégration */}
                    <div className="space-y-3">
                      <Label>Type d'intégration <span className="text-red-500">*</span></Label>
                      <RadioGroup
                        value={formData.typeIntegration}
                        onValueChange={(value) => handleInputChange("typeIntegration", value)}
                        required
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="permanent" id="permanent" />
                          <Label htmlFor="permanent">Membre Permanent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="associe" id="associe" />
                          <Label htmlFor="associe">Membre Associé</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* 1ère demande d'adhésion */}
                    <div className="space-y-3">
                      <Label>1ère demande d'adhésion <span className="text-red-500">*</span></Label>
                      <RadioGroup
                        value={formData.premiereDemande}
                        onValueChange={(value) => handleInputChange("premiereDemande", value)}
                        required
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="oui" id="premiere-oui" />
                          <Label htmlFor="premiere-oui">Oui</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="non" id="premiere-non" />
                          <Label htmlFor="premiere-non">Non</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Anciens laboratoires */}
                    {formData.premiereDemande === "non" && (
                      <div className="space-y-2">
                        <Label htmlFor="anciensLaboratoires">
                          Si Non, précisez les anciens Laboratoires :
                        </Label>
                        <Textarea
                          id="anciensLaboratoires"
                          value={formData.anciensLaboratoires}
                          onChange={(e) => handleInputChange("anciensLaboratoires", e.target.value)}
                          placeholder="Listez vos anciens laboratoires..."
                          rows={3}
                        />
                      </div>
                    )}

                    {/* Laboratoire et équipe demandés */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="laboratoireDemande">Laboratoire demandé <span className="text-red-500">*</span></Label>
                        <Input
                          id="laboratoireDemande"
                          value={formData.laboratoireDemande}
                          onChange={(e) => handleInputChange("laboratoireDemande", e.target.value)}
                          placeholder="Entrez le nom du laboratoire..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="equipeDemande">Équipe demandée <span className="text-red-500">*</span></Label>
                        <Input
                          id="equipeDemande"
                          value={formData.equipeDemande}
                          onChange={(e) => handleInputChange("equipeDemande", e.target.value)}
                          placeholder="Entrez le nom de l'équipe..."
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="etablissementAttache">Établissement d'attache <span className="text-red-500">*</span></Label>
                      <Input
                        id="etablissementAttache"
                        value={formData.etablissementAttache}
                        onChange={(e) => handleInputChange("etablissementAttache", e.target.value)}
                        placeholder="Entrez le nom de l'établissement..."
                        required
                      />
                    </div>

                    {/* Pièces jointes */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Upload className="h-5 w-5 text-uh2c-blue" />
                        <Label className="text-base font-semibold text-gray-900">Pièces jointes (PJ)</Label>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cv" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FileText className="h-4 w-4 text-uh2c-blue" />
                            CV <span className="text-red-500">*</span>
                          </Label>
                          <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-uh2c-blue transition-colors">
                            <input
                              id="cv"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleFileChange("cv", e.target.files?.[0] || null)}
                              className="hidden"
                              required
                            />
                            <label htmlFor="cv" className="cursor-pointer">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                                  <Upload className="h-5 w-5 text-uh2c-blue" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-700">
                                    Glissez-déposez votre CV ici
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ou cliquez pour sélectionner un fichier
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PDF, DOC, DOCX acceptés (Max 5MB)
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                          {formData.cv && (
                            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-700 font-medium">
                                {formData.cv.name}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pvConseil" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FileText className="h-4 w-4 text-uh2c-blue" />
                            PV du conseil du laboratoire <span className="text-red-500">*</span>
                          </Label>
                          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border-l-2 border-uh2c-blue/20">
                            Signé par les membres du conseil et visé par le chef d'établissement
                          </p>
                          <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-uh2c-blue transition-colors">
                            <input
                              id="pvConseil"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleFileChange("pvConseil", e.target.files?.[0] || null)}
                              className="hidden"
                              required
                            />
                            <label htmlFor="pvConseil" className="cursor-pointer">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="w-10 h-10 bg-uh2c-blue/10 rounded-full flex items-center justify-center">
                                  <Upload className="h-5 w-5 text-uh2c-blue" />
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-700">
                                    Glissez-déposez le PV ici
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ou cliquez pour sélectionner un fichier
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PDF, DOC, DOCX acceptés (Max 5MB)
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                          {formData.pvConseil && (
                            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-700 font-medium">
                                {formData.pvConseil.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Signature */}
                    <div className="space-y-2">
                      <Label htmlFor="signature">Signature du demandeur <span className="text-red-500">*</span></Label>
                      <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <p className="text-muted-foreground">
                          Signature électronique - En soumettant ce formulaire, vous confirmez l'exactitude des informations fournies
                        </p>
                      </div>
                    </div>



                                       </form>

                   {/* Boutons de soumission */}
                   <div className="flex justify-end gap-4 mt-6">
                     <Button type="button" variant="outline" size="lg" onClick={handleCancel}>
                       Annuler
                     </Button>
                     <Button type="submit" size="lg" className="flex items-center gap-2 bg-uh2c-blue hover:bg-uh2c-blue/90" onClick={handleSubmit}>
                       <Send className="h-4 w-4" />
                       Soumettre la demande
                     </Button>
                   </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
