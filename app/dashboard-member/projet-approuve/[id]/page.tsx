"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  Upload, 
  Save, 
  ArrowLeft,
  Building,
  User,
  Clock,
  Award
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectDetails {
  id: string
  title: string
  researcher: string
  laboratory: string
  program: string
  budget: number
  duration: string
  approvalDate: string
  approvalComments: string
}

interface AdditionalInfo {
  startDate: string
  endDate: string
  teamMembers: string[]
  budgetBreakdown: {
    personnel: number
    equipment: number
    travel: number
    other: number
  }
  milestones: string[]
  deliverables: string[]
  riskAssessment: string
  ethicalConsiderations: string
  dataManagementPlan: string
  disseminationPlan: string
  collaborationAgreements: string[]
  requiredDocuments: string[]
}

export default function ProjetApprouvePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null)
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    startDate: "",
    endDate: "",
    teamMembers: [],
    budgetBreakdown: {
      personnel: 0,
      equipment: 0,
      travel: 0,
      other: 0
    },
    milestones: [],
    deliverables: [],
    riskAssessment: "",
    ethicalConsiderations: "",
    dataManagementPlan: "",
    disseminationPlan: "",
    collaborationAgreements: [],
    requiredDocuments: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simuler le chargement des détails du projet
  useEffect(() => {
    // Simulation des données du projet approuvé
    setProjectDetails({
      id: projectId,
      title: "Développement d'algorithmes d'IA pour l'éducation",
      researcher: "Prof. Mohamed Lahby",
      laboratory: "MINDLab",
      program: "Programme National de Recherche en IA",
      budget: 500000,
      duration: "24 mois",
      approvalDate: "2024-01-15",
      approvalComments: "Excellent projet, approuvé avec quelques modifications mineures. Veuillez compléter les informations supplémentaires pour finaliser le processus."
    })
  }, [projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulation de l'envoi des données
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    // Redirection vers le dashboard après soumission
    router.push("/dashboard-member")
  }

  const addTeamMember = () => {
    setAdditionalInfo(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, ""]
    }))
  }

  const updateTeamMember = (index: number, value: string) => {
    setAdditionalInfo(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => i === index ? value : member)
    }))
  }

  const removeTeamMember = (index: number) => {
    setAdditionalInfo(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }))
  }

  const addMilestone = () => {
    setAdditionalInfo(prev => ({
      ...prev,
      milestones: [...prev.milestones, ""]
    }))
  }

  const updateMilestone = (index: number, value: string) => {
    setAdditionalInfo(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => i === index ? value : milestone)
    }))
  }

  const removeMilestone = (index: number) => {
    setAdditionalInfo(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  if (!projectDetails) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des détails du projet...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Projet Approuvé</h1>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  ID: {projectDetails.id}
                </Badge>
              </div>
              <p className="text-gray-600">Complétez les informations supplémentaires pour finaliser votre projet</p>
            </div>

            {/* Détails du projet */}
            <Card className="mb-6 border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-green-700">{projectDetails.title}</CardTitle>
                <CardDescription>{projectDetails.approvalComments}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Chercheur:</span>
                    <span className="text-sm font-medium">{projectDetails.researcher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Laboratoire:</span>
                    <span className="text-sm font-medium">{projectDetails.laboratory}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Budget:</span>
                    <span className="text-sm font-medium">{projectDetails.budget.toLocaleString()} MAD</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulaire de complément d'informations */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations de base */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Informations de base
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Date de début</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={additionalInfo.startDate}
                          onChange={(e) => setAdditionalInfo(prev => ({ ...prev, startDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Date de fin</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={additionalInfo.endDate}
                          onChange={(e) => setAdditionalInfo(prev => ({ ...prev, endDate: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Membres de l'équipe</Label>
                      <div className="space-y-2">
                        {additionalInfo.teamMembers.map((member, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={member}
                              onChange={(e) => updateTeamMember(index, e.target.value)}
                              placeholder="Nom et prénom du membre"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTeamMember(index)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addTeamMember}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Ajouter un membre
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Répartition budgétaire */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Répartition budgétaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="personnel">Personnel (MAD)</Label>
                      <Input
                        id="personnel"
                        type="number"
                        value={additionalInfo.budgetBreakdown.personnel}
                        onChange={(e) => setAdditionalInfo(prev => ({
                          ...prev,
                          budgetBreakdown: { ...prev.budgetBreakdown, personnel: Number(e.target.value) }
                        }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="equipment">Équipement (MAD)</Label>
                      <Input
                        id="equipment"
                        type="number"
                        value={additionalInfo.budgetBreakdown.equipment}
                        onChange={(e) => setAdditionalInfo(prev => ({
                          ...prev,
                          budgetBreakdown: { ...prev.budgetBreakdown, equipment: Number(e.target.value) }
                        }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="travel">Voyages (MAD)</Label>
                      <Input
                        id="travel"
                        type="number"
                        value={additionalInfo.budgetBreakdown.travel}
                        onChange={(e) => setAdditionalInfo(prev => ({
                          ...prev,
                          budgetBreakdown: { ...prev.budgetBreakdown, travel: Number(e.target.value) }
                        }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="other">Autres dépenses (MAD)</Label>
                      <Input
                        id="other"
                        type="number"
                        value={additionalInfo.budgetBreakdown.other}
                        onChange={(e) => setAdditionalInfo(prev => ({
                          ...prev,
                          budgetBreakdown: { ...prev.budgetBreakdown, other: Number(e.target.value) }
                        }))}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Jalons et livrables */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Jalons du projet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Jalons principaux</Label>
                      <div className="space-y-2">
                        {additionalInfo.milestones.map((milestone, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={milestone}
                              onChange={(e) => updateMilestone(index, e.target.value)}
                              placeholder="Description du jalon"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeMilestone(index)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addMilestone}
                        >
                          Ajouter un jalon
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Considérations éthiques et gestion des risques */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Considérations éthiques et risques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="riskAssessment">Évaluation des risques</Label>
                      <Textarea
                        id="riskAssessment"
                        value={additionalInfo.riskAssessment}
                        onChange={(e) => setAdditionalInfo(prev => ({ ...prev, riskAssessment: e.target.value }))}
                        placeholder="Décrivez les risques potentiels et les mesures de mitigation"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ethicalConsiderations">Considérations éthiques</Label>
                      <Textarea
                        id="ethicalConsiderations"
                        value={additionalInfo.ethicalConsiderations}
                        onChange={(e) => setAdditionalInfo(prev => ({ ...prev, ethicalConsiderations: e.target.value }))}
                        placeholder="Décrivez les aspects éthiques de votre recherche"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Plan de gestion des données */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Gestion des données
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="dataManagementPlan">Plan de gestion des données</Label>
                      <Textarea
                        id="dataManagementPlan"
                        value={additionalInfo.dataManagementPlan}
                        onChange={(e) => setAdditionalInfo(prev => ({ ...prev, dataManagementPlan: e.target.value }))}
                        placeholder="Décrivez comment vous allez collecter, stocker et partager les données"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="disseminationPlan">Plan de diffusion</Label>
                      <Textarea
                        id="disseminationPlan"
                        value={additionalInfo.disseminationPlan}
                        onChange={(e) => setAdditionalInfo(prev => ({ ...prev, disseminationPlan: e.target.value }))}
                        placeholder="Décrivez comment vous allez diffuser les résultats"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer et finaliser
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
} 