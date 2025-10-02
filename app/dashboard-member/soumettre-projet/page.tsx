"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  FileText, 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  Target, 
  Plus, 
  X, 
  Upload,
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

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
  criteres?: string[]
  documents?: string[]
}

interface FormData {
  appelProjet: string
  intitule: string
  description: string
  motsCles: string
  objectifs: string
  methodologie: string
  resultatsAttendus: string
  impact: string
  budgetDemande: string
  duree: string
  thematique: string
  domaine: string
  niveauInnovation: string
  partenariats: string
  risques: string
  planCommunication: string
  planDissemination: string
  planFormation: string
  planEvaluation: string
  planDurabilite: string
}

interface FormErrors {
  [key: string]: boolean
}

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
    criteres: [
      "Expertise en IA et santé",
      "Validation clinique préliminaire",
      "Équipe pluridisciplinaire"
    ],
    documents: [
      "Projet détaillé",
      "CV des chercheurs",
      "Lettre de motivation",
      "Budget détaillé"
    ]
  },
  {
    id: "AP2",
    titre: "Appel à projets - Énergies renouvelables",
    programme: "Programme de Recherche en Énergie",
    organisme: "Ministère de l'Énergie",
    dateOuverture: "2024-02-01",
    dateLimite: "2024-07-31",
    description: "Développement de technologies innovantes pour les énergies renouvelables",
    budget: 1200000,
    nombreProjetsAttendus: 3,
    statut: "ouvert",
    criteres: [
      "Expertise en énergies renouvelables",
      "Potentiel d'industrialisation",
      "Impact environnemental positif"
    ],
    documents: [
      "Projet détaillé",
      "Étude de faisabilité",
      "Plan de développement",
      "Budget détaillé"
    ]
  }
]

const thematiques = [
  "Intelligence Artificielle",
  "Énergies Renouvelables",
  "Santé et Médecine",
  "Environnement",
  "Éducation",
  "Agriculture",
  "Transport",
  "Télécommunications",
  "Finance",
  "Sécurité",
  "Culture",
  "Sport",
  "Tourisme",
  "Industrie",
  "Autre"
]

const domaines = [
  "Sciences et Technologies",
  "Sciences Humaines et Sociales",
  "Sciences de la Vie",
  "Sciences de l'Ingénieur",
  "Sciences Économiques",
  "Sciences Juridiques",
  "Sciences Médicales",
  "Sciences Agronomiques",
  "Sciences de l'Environnement",
  "Autre"
]

const niveauxInnovation = [
  "Innovation de rupture",
  "Innovation incrémentale",
  "Innovation de processus",
  "Innovation organisationnelle",
  "Innovation sociale",
  "Innovation technologique"
]

export default function SoumettreProjet() {
  const [formData, setFormData] = useState<FormData>({
    appelProjet: "",
    intitule: "",
    description: "",
    motsCles: "",
    objectifs: "",
    methodologie: "",
    resultatsAttendus: "",
    impact: "",
    budgetDemande: "",
    duree: "",
    thematique: "",
    domaine: "",
    niveauInnovation: "",
    partenariats: "",
    risques: "",
    planCommunication: "",
    planDissemination: "",
    planFormation: "",
    planEvaluation: "",
    planDurabilite: ""
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedAppel, setSelectedAppel] = useState<AppelProjet | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 5

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Effacer l'erreur pour ce champ
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: false
      }))
    }
  }

  const handleAppelChange = (appelId: string) => {
    const appel = appelsProjets.find(a => a.id === appelId)
    setSelectedAppel(appel || null)
    handleInputChange("appelProjet", appelId)
  }

  const validateStep = (step: number): boolean => {
    const errors: FormErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.appelProjet) errors.appelProjet = true
        if (!formData.intitule) errors.intitule = true
        if (!formData.description) errors.description = true
        if (!formData.motsCles) errors.motsCles = true
        break
      case 2:
        if (!formData.objectifs) errors.objectifs = true
        if (!formData.methodologie) errors.methodologie = true
        if (!formData.resultatsAttendus) errors.resultatsAttendus = true
        if (!formData.impact) errors.impact = true
        break
      case 3:
        if (!formData.budgetDemande) errors.budgetDemande = true
        if (!formData.duree) errors.duree = true
        if (!formData.thematique) errors.thematique = true
        if (!formData.domaine) errors.domaine = true
        if (!formData.niveauInnovation) errors.niveauInnovation = true
        break
      case 4:
        if (!formData.partenariats) errors.partenariats = true
        if (!formData.risques) errors.risques = true
        break
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) return
    
    setIsSubmitting(true)
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setShowSuccess(true)
  }

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              i + 1 < currentStep 
                ? 'bg-green-500 border-green-500 text-white' 
                : i + 1 === currentStep 
                ? 'bg-uh2c-blue border-uh2c-blue text-white' 
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              {i + 1 < currentStep ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{i + 1}</span>
              )}
            </div>
            {i < totalSteps - 1 && (
              <div className={`w-16 h-0.5 mx-2 ${
                i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Sélection de l'appel</span>
        <span>Description du projet</span>
        <span>Informations générales</span>
        <span>Partenariats & Risques</span>
        <span>Documents</span>
      </div>
    </div>
  )

  if (showSuccess) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Projet soumis avec succès !
            </h2>
            <p className="text-green-700 mb-6">
              Votre projet "{formData.intitule}" a été soumis avec succès. 
              Vous recevrez une confirmation par email.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/mes-projets/projets-soumis">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Voir mes projets
                </Button>
              </Link>
              <Button onClick={() => window.location.reload()}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau projet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header amélioré */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/appels-projets">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-200 border border-gray-200">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Retour</span>
            </Button>
          </Link>
        </div>
        
        {/* En-tête unifié */}
        <div className="mb-6">
          {/* En-tête principal */}
          <div className="bg-gradient-to-r from-uh2c-blue/5 to-uh2c-blue/10 border-l-4 border-uh2c-blue rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-center">
              <span className="text-base font-bold text-uh2c-blue">
                Soumettre un projet - Programme National de Recherche en IA
              </span>
            </div>
          </div>
          
          {/* Section d'instructions */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-1.5 h-1.5 bg-uh2c-blue rounded-full"></div>
              <span className="text-sm text-gray-600 font-medium">
                Remplissez tous les champs obligatoires (*) pour votre projet. Assurez-vous que toutes les informations sont exactes et complètes.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur d'étapes */}
      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Étape 1: Sélection de l'appel et informations de base */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Étape 1: Sélection de l'appel et informations de base
              </CardTitle>
              <CardDescription>
                Sélectionnez l'appel à projets et fournissez les informations de base de votre projet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélection de l'appel */}
              <div>
                <Label htmlFor="appelProjet" className={`text-sm font-medium ${formErrors.appelProjet ? 'text-red-600' : 'text-gray-700'}`}>
                  Appel à projets <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.appelProjet} onValueChange={handleAppelChange}>
                  <SelectTrigger className={`mt-1 ${formErrors.appelProjet ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Sélectionnez un appel à projets" />
                  </SelectTrigger>
                  <SelectContent>
                    {appelsProjets.filter(appel => appel.statut === "ouvert").map((appel) => (
                      <SelectItem key={appel.id} value={appel.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{appel.titre}</span>
                          <span className="text-xs text-gray-500">
                            Budget: {appel.budget.toLocaleString()} MAD | 
                            Date limite: {new Date(appel.dateLimite).toLocaleDateString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.appelProjet && (
                  <p className="text-red-500 text-xs mt-1">Veuillez sélectionner un appel à projets</p>
                )}
              </div>

              {/* Informations de l'appel sélectionné */}
              {selectedAppel && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">{selectedAppel.titre}</h3>
                    <p className="text-blue-800 text-sm mb-3">{selectedAppel.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700 font-medium">Programme:</span>
                        <p className="text-blue-800">{selectedAppel.programme}</p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Budget max:</span>
                        <p className="text-blue-800">{selectedAppel.budget.toLocaleString()} MAD</p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Date limite:</span>
                        <p className="text-blue-800">{new Date(selectedAppel.dateLimite).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">Projets attendus:</span>
                        <p className="text-blue-800">{selectedAppel.nombreProjetsAttendus}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Intitulé du projet */}
              <div>
                <Label htmlFor="intitule" className={`text-sm font-medium ${formErrors.intitule ? 'text-red-600' : 'text-gray-700'}`}>
                  Intitulé du projet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="intitule"
                  value={formData.intitule}
                  onChange={(e) => handleInputChange("intitule", e.target.value)}
                  placeholder="Titre concis et descriptif du projet"
                  className={`mt-1 ${formErrors.intitule ? 'border-red-500' : ''}`}
                />
                {formErrors.intitule && (
                  <p className="text-red-500 text-xs mt-1">L'intitulé du projet est obligatoire</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className={`text-sm font-medium ${formErrors.description ? 'text-red-600' : 'text-gray-700'}`}>
                  Description du projet <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Description détaillée du projet (max 500 caractères)"
                  className={`mt-1 ${formErrors.description ? 'border-red-500' : ''}`}
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Description claire et concise</span>
                  <span>{formData.description.length}/500</span>
                </div>
                {formErrors.description && (
                  <p className="text-red-500 text-xs mt-1">La description du projet est obligatoire</p>
                )}
              </div>

              {/* Mots-clés */}
              <div>
                <Label htmlFor="motsCles" className={`text-sm font-medium ${formErrors.motsCles ? 'text-red-600' : 'text-gray-700'}`}>
                  Mots-clés <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="motsCles"
                  value={formData.motsCles}
                  onChange={(e) => handleInputChange("motsCles", e.target.value)}
                  placeholder="Mots-clés séparés par des virgules (ex: IA, santé, prévention)"
                  className={`mt-1 ${formErrors.motsCles ? 'border-red-500' : ''}`}
                />
                {formErrors.motsCles && (
                  <p className="text-red-500 text-xs mt-1">Les mots-clés sont obligatoires</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Description détaillée */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Étape 2: Description détaillée du projet
              </CardTitle>
              <CardDescription>
                Décrivez en détail les objectifs, la méthodologie et les résultats attendus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Objectifs */}
              <div>
                <Label htmlFor="objectifs" className={`text-sm font-medium ${formErrors.objectifs ? 'text-red-600' : 'text-gray-700'}`}>
                  Objectifs du projet <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="objectifs"
                  value={formData.objectifs}
                  onChange={(e) => handleInputChange("objectifs", e.target.value)}
                  placeholder="Décrivez les objectifs spécifiques et mesurables du projet"
                  className={`mt-1 ${formErrors.objectifs ? 'border-red-500' : ''}`}
                  rows={4}
                />
                {formErrors.objectifs && (
                  <p className="text-red-500 text-xs mt-1">Les objectifs du projet sont obligatoires</p>
                )}
              </div>

              {/* Méthodologie */}
              <div>
                <Label htmlFor="methodologie" className={`text-sm font-medium ${formErrors.methodologie ? 'text-red-600' : 'text-gray-700'}`}>
                  Méthodologie <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="methodologie"
                  value={formData.methodologie}
                  onChange={(e) => handleInputChange("methodologie", e.target.value)}
                  placeholder="Décrivez l'approche méthodologique et les étapes du projet"
                  className={`mt-1 ${formErrors.methodologie ? 'border-red-500' : ''}`}
                  rows={4}
                />
                {formErrors.methodologie && (
                  <p className="text-red-500 text-xs mt-1">La méthodologie est obligatoire</p>
                )}
              </div>

              {/* Résultats attendus */}
              <div>
                <Label htmlFor="resultatsAttendus" className={`text-sm font-medium ${formErrors.resultatsAttendus ? 'text-red-600' : 'text-gray-700'}`}>
                  Résultats attendus <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="resultatsAttendus"
                  value={formData.resultatsAttendus}
                  onChange={(e) => handleInputChange("resultatsAttendus", e.target.value)}
                  placeholder="Décrivez les résultats concrets attendus du projet"
                  className={`mt-1 ${formErrors.resultatsAttendus ? 'border-red-500' : ''}`}
                  rows={4}
                />
                {formErrors.resultatsAttendus && (
                  <p className="text-red-500 text-xs mt-1">Les résultats attendus sont obligatoires</p>
                )}
              </div>

              {/* Impact */}
              <div>
                <Label htmlFor="impact" className={`text-sm font-medium ${formErrors.impact ? 'text-red-600' : 'text-gray-700'}`}>
                  Impact et retombées <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="impact"
                  value={formData.impact}
                  onChange={(e) => handleInputChange("impact", e.target.value)}
                  placeholder="Décrivez l'impact scientifique, économique et social attendu"
                  className={`mt-1 ${formErrors.impact ? 'border-red-500' : ''}`}
                  rows={4}
                />
                {formErrors.impact && (
                  <p className="text-red-500 text-xs mt-1">L'impact du projet est obligatoire</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 3: Informations générales */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Étape 3: Informations générales
              </CardTitle>
              <CardDescription>
                Spécifiez les informations budgétaires, temporelles et de classification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget demandé */}
                <div>
                  <Label htmlFor="budgetDemande" className={`text-sm font-medium ${formErrors.budgetDemande ? 'text-red-600' : 'text-gray-700'}`}>
                    Budget demandé (MAD) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="budgetDemande"
                    type="number"
                    value={formData.budgetDemande}
                    onChange={(e) => handleInputChange("budgetDemande", e.target.value)}
                    placeholder="Montant en MAD"
                    className={`mt-1 ${formErrors.budgetDemande ? 'border-red-500' : ''}`}
                  />
                  {selectedAppel && (
                    <p className="text-xs text-gray-500 mt-1">
                      Budget maximum: {selectedAppel.budget.toLocaleString()} MAD
                    </p>
                  )}
                  {formErrors.budgetDemande && (
                    <p className="text-red-500 text-xs mt-1">Le budget demandé est obligatoire</p>
                  )}
                </div>

                {/* Durée */}
                <div>
                  <Label htmlFor="duree" className={`text-sm font-medium ${formErrors.duree ? 'text-red-600' : 'text-gray-700'}`}>
                    Durée du projet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duree"
                    value={formData.duree}
                    onChange={(e) => handleInputChange("duree", e.target.value)}
                    placeholder="Ex: 24 mois"
                    className={`mt-1 ${formErrors.duree ? 'border-red-500' : ''}`}
                  />
                  {formErrors.duree && (
                    <p className="text-red-500 text-xs mt-1">La durée du projet est obligatoire</p>
                  )}
                </div>

                {/* Thématique */}
                <div>
                  <Label htmlFor="thematique" className={`text-sm font-medium ${formErrors.thematique ? 'text-red-600' : 'text-gray-700'}`}>
                    Thématique <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.thematique} onValueChange={(value) => handleInputChange("thematique", value)}>
                    <SelectTrigger className={`mt-1 ${formErrors.thematique ? 'border-red-500' : ''}`}>
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
                    <p className="text-red-500 text-xs mt-1">La thématique est obligatoire</p>
                  )}
                </div>

                {/* Domaine */}
                <div>
                  <Label htmlFor="domaine" className={`text-sm font-medium ${formErrors.domaine ? 'text-red-600' : 'text-gray-700'}`}>
                    Domaine scientifique <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.domaine} onValueChange={(value) => handleInputChange("domaine", value)}>
                    <SelectTrigger className={`mt-1 ${formErrors.domaine ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Sélectionnez un domaine" />
                    </SelectTrigger>
                    <SelectContent>
                      {domaines.map((domaine) => (
                        <SelectItem key={domaine} value={domaine}>
                          {domaine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.domaine && (
                    <p className="text-red-500 text-xs mt-1">Le domaine scientifique est obligatoire</p>
                  )}
                </div>

                {/* Niveau d'innovation */}
                <div className="md:col-span-2">
                  <Label htmlFor="niveauInnovation" className={`text-sm font-medium ${formErrors.niveauInnovation ? 'text-red-600' : 'text-gray-700'}`}>
                    Niveau d'innovation <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.niveauInnovation} onValueChange={(value) => handleInputChange("niveauInnovation", value)}>
                    <SelectTrigger className={`mt-1 ${formErrors.niveauInnovation ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Sélectionnez le niveau d'innovation" />
                    </SelectTrigger>
                    <SelectContent>
                      {niveauxInnovation.map((niveau) => (
                        <SelectItem key={niveau} value={niveau}>
                          {niveau}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.niveauInnovation && (
                    <p className="text-red-500 text-xs mt-1">Le niveau d'innovation est obligatoire</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 4: Partenariats et Risques */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Étape 4: Partenariats et Gestion des Risques
              </CardTitle>
              <CardDescription>
                Décrivez les partenariats prévus et les risques identifiés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Partenariats */}
              <div>
                <Label htmlFor="partenariats" className={`text-sm font-medium ${formErrors.partenariats ? 'text-red-600' : 'text-gray-700'}`}>
                  Partenariats prévus <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="partenariats"
                  value={formData.partenariats}
                  onChange={(e) => handleInputChange("partenariats", e.target.value)}
                  placeholder="Décrivez les partenariats académiques, industriels ou institutionnels prévus"
                  className={`mt-1 ${formErrors.partenariats ? 'border-red-500' : ''}`}
                  rows={4}
                />
                {formErrors.partenariats && (
                  <p className="text-red-500 text-xs mt-1">Les partenariats prévus sont obligatoires</p>
                )}
              </div>

              {/* Risques */}
              <div>
                <Label htmlFor="risques" className={`text-sm font-medium ${formErrors.risques ? 'text-red-600' : 'text-gray-700'}`}>
                  Risques identifiés et mesures de mitigation <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="risques"
                  value={formData.risques}
                  onChange={(e) => handleInputChange("risques", e.target.value)}
                  placeholder="Identifiez les risques potentiels et les mesures pour les atténuer"
                  className={`mt-1 ${formErrors.risques ? 'border-red-500' : ''}`}
                  rows={4}
                />
                {formErrors.risques && (
                  <p className="text-red-500 text-xs mt-1">L'identification des risques est obligatoire</p>
                )}
              </div>

              {/* Plans additionnels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="planCommunication" className="text-sm font-medium text-gray-700">
                    Plan de communication
                  </Label>
                  <Textarea
                    id="planCommunication"
                    value={formData.planCommunication}
                    onChange={(e) => handleInputChange("planCommunication", e.target.value)}
                    placeholder="Stratégie de communication du projet"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="planDissemination" className="text-sm font-medium text-gray-700">
                    Plan de diffusion
                  </Label>
                  <Textarea
                    id="planDissemination"
                    value={formData.planDissemination}
                    onChange={(e) => handleInputChange("planDissemination", e.target.value)}
                    placeholder="Stratégie de diffusion des résultats"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="planFormation" className="text-sm font-medium text-gray-700">
                    Plan de formation
                  </Label>
                  <Textarea
                    id="planFormation"
                    value={formData.planFormation}
                    onChange={(e) => handleInputChange("planFormation", e.target.value)}
                    placeholder="Activités de formation prévues"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="planEvaluation" className="text-sm font-medium text-gray-700">
                    Plan d'évaluation
                  </Label>
                  <Textarea
                    id="planEvaluation"
                    value={formData.planEvaluation}
                    onChange={(e) => handleInputChange("planEvaluation", e.target.value)}
                    placeholder="Méthodes d'évaluation du projet"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="planDurabilite" className="text-sm font-medium text-gray-700">
                    Plan de durabilité
                  </Label>
                  <Textarea
                    id="planDurabilite"
                    value={formData.planDurabilite}
                    onChange={(e) => handleInputChange("planDurabilite", e.target.value)}
                    placeholder="Stratégie pour assurer la durabilité des résultats"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 5: Documents */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Étape 5: Documents et Soumission
              </CardTitle>
              <CardDescription>
                Téléchargez les documents requis et soumettez votre projet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Documents requis */}
              {selectedAppel && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Documents requis pour cet appel :</h3>
                  <ul className="space-y-2">
                    {selectedAppel.documents?.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2 text-blue-800">
                        <FileText className="h-4 w-4" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Zone de téléchargement */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Téléchargez vos documents
                </h3>
                <p className="text-gray-600 mb-4">
                  Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Sélectionner des fichiers
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    // Gestion des fichiers
                    console.log("Fichiers sélectionnés:", e.target.files)
                  }}
                />
              </div>

              {/* Résumé du projet */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Résumé de votre projet :</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Intitulé:</span>
                    <p className="text-gray-900">{formData.intitule}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Thématique:</span>
                    <p className="text-gray-900">{formData.thematique}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Budget demandé:</span>
                    <p className="text-gray-900">{formData.budgetDemande} MAD</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Durée:</span>
                    <p className="text-gray-900">{formData.duree}</p>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important :</p>
                  <p>Veuillez vérifier toutes les informations avant de soumettre votre projet. 
                  Une fois soumis, vous ne pourrez plus modifier le projet.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation entre les étapes */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>
          
          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Suivant
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Soumission en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre le projet
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
} 