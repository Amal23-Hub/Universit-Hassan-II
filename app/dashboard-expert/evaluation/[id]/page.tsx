"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Save,
  Send,
  Crown,
  User,
  GraduationCap,
  Mail,
  Phone,
  Search,
  X,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface TeamMember {
  id: string
  name: string
  role: string
  isLeader: boolean
  email: string
  phone?: string
  specialization: string
  experience: string
  cv?: string
}

interface Team {
  id: string
  name: string
  leader: TeamMember
  members: TeamMember[]
  description: string
}

interface Publication {
  id: string
  title: string
  year: number
  journal: string
  doi: string
}

interface MemberEvaluation {
  memberId: string
  publications: Publication[]
  ouvrages: Publication[]
  communications: Publication[]
  distinctions: Publication[]
  brevets: Publication[]
  theses: Publication[]
  globalComment: "conforme" | "reserves" | "a_revoir" | ""
}

export default function EvaluationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [memberEvaluations, setMemberEvaluations] = useState<Record<string, MemberEvaluation>>({})
  const [evaluationData, setEvaluationData] = useState({
    documentsScore: 0,
    structureScore: 0,
    qcmScore: 0,
    finalDecision: "",
    comments: "",
    documentsComplete: false,
    structureValidated: false,
    qcmCompleted: false,
    memberEvaluationComplete: false,
  })

  // Mock data for teams
  const teams: Team[] = [
    {
      id: "team1",
      name: "Équipe Intelligence Artificielle",
      leader: {
        id: "leader1",
        name: "Dr. Ahmed Benali",
        role: "Chef d'équipe - Professeur",
        isLeader: true,
        email: "ahmed.benali@uh2c.ma",
        phone: "+212 522 23 45 67",
        specialization: "Intelligence Artificielle, Machine Learning",
        experience: "15 ans d'expérience en recherche IA",
        cv: "cv_ahmed_benali.pdf",
      },
      members: [
        {
          id: "member1",
          name: "Dr. Fatima Zahra",
          role: "Maître de conférences",
          isLeader: false,
          email: "fatima.zahra@uh2c.ma",
          specialization: "Traitement du langage naturel",
          experience: "8 ans d'expérience",
        },
        {
          id: "member2",
          name: "Dr. Mohammed Alami",
          role: "Professeur assistant",
          isLeader: false,
          email: "mohammed.alami@uh2c.ma",
          specialization: "Vision par ordinateur",
          experience: "6 ans d'expérience",
        },
        {
          id: "member3",
          name: "Youssef Bennani",
          role: "Doctorant",
          isLeader: false,
          email: "youssef.bennani@uh2c.ma",
          specialization: "Deep Learning",
          experience: "3 ans d'expérience",
        },
      ],
      description:
        "Équipe spécialisée dans le développement de solutions d'intelligence artificielle pour la santé et l'éducation.",
    },
    {
      id: "team2",
      name: "Équipe Cybersécurité",
      leader: {
        id: "leader2",
        name: "Prof. Laila Benkirane",
        role: "Chef d'équipe - Professeur",
        isLeader: true,
        email: "laila.benkirane@uh2c.ma",
        phone: "+212 522 23 45 68",
        specialization: "Cybersécurité, Cryptographie",
        experience: "20 ans d'expérience en sécurité informatique",
        cv: "cv_laila_benkirane.pdf",
      },
      members: [
        {
          id: "member4",
          name: "Dr. Omar Cherkaoui",
          role: "Maître de conférences",
          isLeader: false,
          email: "omar.cherkaoui@uh2c.ma",
          specialization: "Sécurité des réseaux",
          experience: "10 ans d'expérience",
        },
        {
          id: "member5",
          name: "Amina Tazi",
          role: "Doctorante",
          isLeader: false,
          email: "amina.tazi@uh2c.ma",
          specialization: "Blockchain",
          experience: "2 ans d'expérience",
        },
      ],
      description: "Équipe dédiée à la recherche en cybersécurité et protection des données.",
    },
  ]

  // Get all members from all teams
  const allMembers = teams.reduce<TeamMember[]>((acc, team) => {
    return [...acc, team.leader, ...team.members]
  }, [])

  // Filter members based on search term
  const filteredMembers = allMembers.filter((member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Mock publications data
  const getMemberPublications = (memberId: string): Publication[] => {
    return [
      {
        id: "pub1",
        title: "Advanced Machine Learning Techniques in Healthcare",
        year: 2023,
        journal: "IEEE Transactions on Medical Imaging",
        doi: "10.1109/TMI.2023.1234567",
      },
      {
        id: "pub2",
        title: "Deep Learning for Medical Diagnosis",
        year: 2022,
        journal: "Nature Medicine",
        doi: "10.1038/s41591-022-1234-5",
      },
    ]
  }

  // Calculate overall progress
  const calculateProgress = () => {
    let progress = 0
    if (evaluationData.documentsComplete) progress += 20
    if (evaluationData.structureValidated) progress += 20
    if (evaluationData.memberEvaluationComplete) progress += 20
    if (evaluationData.qcmCompleted) progress += 20
    if (evaluationData.finalDecision) progress += 20
    return progress
  }

  const handleSave = () => {
    console.log("Saving evaluation data:", evaluationData)
    // Save logic here
  }

  const handleSubmit = () => {
    console.log("Submitting evaluation:", evaluationData)
    // Submit logic here
  }

  const handleViewCV = (member: TeamMember) => {
    if (member.cv) {
      // Open CV in new tab or modal
      console.log("Opening CV for:", member.name)
    }
  }

  const handleMemberEvaluation = (memberId: string, comment: "conforme" | "reserves" | "a_revoir") => {
    setMemberEvaluations((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        memberId,
        publications: getMemberPublications(memberId),
        ouvrages: [],
        communications: [],
        distinctions: [],
        brevets: [],
        theses: [],
        globalComment: comment,
      },
    }))
  }

  const handleSaveMemberEvaluation = () => {
    setEvaluationData((prev) => ({ ...prev, memberEvaluationComplete: true }))
    console.log("Saving member evaluation:", memberEvaluations)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.back()} className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Retour</span>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Évaluation du Laboratoire</h1>
                  <p className="text-gray-600 mt-2">Laboratoire d'Intelligence Artificielle - LAB001</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                <Button onClick={handleSubmit} className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                  <Send className="h-4 w-4 mr-2" />
                  Soumettre
                </Button>
              </div>
            </div>

            {/* Progress Indicator */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Progression de l'évaluation</span>
                  <span className="text-2xl font-bold text-uh2c-blue">{calculateProgress()}%</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={calculateProgress()} className="w-full mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    {evaluationData.documentsComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <span>Documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {evaluationData.structureValidated ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <span>Structure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {evaluationData.memberEvaluationComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <span>Membres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {evaluationData.qcmCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <span>QCM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {evaluationData.finalDecision ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    <span>Décision finale</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Sections */}
            <Accordion type="single" collapsible className="space-y-4">
              {/* Documents Section */}
              <AccordionItem value="documents">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-uh2c-blue" />
                      <span className="text-lg font-semibold">Documents et Justificatifs</span>
                      {evaluationData.documentsComplete && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Fiche technique du laboratoire</Label>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Disponible
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>CV des membres</Label>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Disponible
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Commentaires sur les documents</Label>
                          <Textarea
                            placeholder="Vos commentaires sur la qualité et la complétude des documents..."
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={evaluationData.documentsComplete}
                            onCheckedChange={(checked) =>
                              setEvaluationData({ ...evaluationData, documentsComplete: checked })
                            }
                          />
                          <Label>Documents complets et conformes</Label>
                        </div>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Structure Section */}
              <AccordionItem value="structure">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-uh2c-blue" />
                      <span className="text-lg font-semibold">Structure et Équipes</span>
                      {evaluationData.structureValidated && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <div className="space-y-6">
                        {teams.map((team) => (
                          <Card key={team.id} className="border-l-4 border-l-uh2c-blue">
                            <CardHeader className="pb-3">
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Users className="h-5 w-5 text-uh2c-blue" />
                                  <span>{team.name}</span>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    {team.members.length + 1} membres
                                  </Badge>
                                </div>
                              </CardTitle>
                              <p className="text-sm text-gray-600">{team.description}</p>
                            </CardHeader>
                            <CardContent>
                              {/* Team Leader */}
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                  <Crown className="h-4 w-4 text-yellow-500 mr-2" />
                                  Chef d'équipe
                                </h4>
                                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                                            <Crown className="h-5 w-5 text-white" />
                                          </div>
                                          <div>
                                            <h5 className="font-semibold text-gray-900">{team.leader.name}</h5>
                                            <p className="text-sm text-gray-600">{team.leader.role}</p>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                          <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span>{team.leader.email}</span>
                                          </div>
                                          {team.leader.phone && (
                                            <div className="flex items-center space-x-2">
                                              <Phone className="h-4 w-4 text-gray-400" />
                                              <span>{team.leader.phone}</span>
                                            </div>
                                          )}
                                          <div className="flex items-center space-x-2">
                                            <GraduationCap className="h-4 w-4 text-gray-400" />
                                            <span>{team.leader.specialization}</span>
                                          </div>
                                          <div className="text-gray-600">{team.leader.experience}</div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col space-y-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleViewCV(team.leader)}
                                          className="bg-white hover:bg-gray-50 border-yellow-300 text-yellow-700 hover:text-yellow-800"
                                        >
                                          <FileText className="h-4 w-4 mr-2" />
                                          Voir CV
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Team Members */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                  <User className="h-4 w-4 text-gray-500 mr-2" />
                                  Membres de l'équipe
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {team.members.map((member) => (
                                    <Card key={member.id} className="hover:shadow-md transition-shadow">
                                      <CardContent className="p-4">
                                        <div className="flex items-start space-x-3">
                                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-gray-600" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h5 className="font-medium text-gray-900 truncate">{member.name}</h5>
                                            <p className="text-sm text-gray-600 truncate">{member.role}</p>
                                            <p className="text-xs text-gray-500 mt-1">{member.specialization}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                              <Mail className="h-3 w-3 text-gray-400" />
                                              <span className="text-xs text-gray-600 truncate">{member.email}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        <div className="space-y-2">
                          <Label>Commentaires sur la structure</Label>
                          <Textarea
                            placeholder="Vos commentaires sur l'organisation et la composition des équipes..."
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={evaluationData.structureValidated}
                            onCheckedChange={(checked) =>
                              setEvaluationData({ ...evaluationData, structureValidated: checked })
                            }
                          />
                          <Label>Structure validée</Label>
                        </div>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Member Evaluation Section */}
              <AccordionItem value="member-evaluation">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-uh2c-blue" />
                      <span className="text-lg font-semibold">Évaluation des Membres</span>
                      {evaluationData.memberEvaluationComplete && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                        {/* Left Sidebar - Member List */}
                        <div className="lg:col-span-1 border-r border-gray-200 pr-4">
                          <div className="space-y-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input
                                placeholder="Rechercher un membre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <div className="space-y-2 max-h-[500px] overflow-y-auto">
                              {filteredMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedMember?.id === member.id
                                      ? "bg-uh2c-blue text-white"
                                      : "bg-gray-50 hover:bg-gray-100"
                                  }`}
                                  onClick={() => setSelectedMember(member)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        member.isLeader ? "bg-yellow-500" : "bg-gray-400"
                                      }`}
                                    />
                                    <div>
                                      <p className="font-medium text-sm">{member.name}</p>
                                      <p
                                        className={`text-xs ${
                                          selectedMember?.id === member.id ? "text-blue-100" : "text-gray-500"
                                        }`}
                                      >
                                        {member.role}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Content - Member Details */}
                        <div className="lg:col-span-2">
                          {selectedMember ? (
                            <div className="space-y-4">
                              {/* Member Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-uh2c-blue rounded-full flex items-center justify-center">
                                    {selectedMember.isLeader ? (
                                      <Crown className="h-5 w-5 text-white" />
                                    ) : (
                                      <User className="h-5 w-5 text-white" />
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg">{selectedMember.name}</h3>
                                    <p className="text-sm text-gray-600">{selectedMember.role}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Tabs for different categories */}
                              <Tabs defaultValue="publications" className="w-full">
                                <TabsList className="grid w-full grid-cols-6">
                                  <TabsTrigger value="publications" className="text-xs">
                                    Publications
                                  </TabsTrigger>
                                  <TabsTrigger value="ouvrages" className="text-xs">
                                    Ouvrages
                                  </TabsTrigger>
                                  <TabsTrigger value="communications" className="text-xs">
                                    Communications
                                  </TabsTrigger>
                                  <TabsTrigger value="distinctions" className="text-xs">
                                    Distinctions
                                  </TabsTrigger>
                                  <TabsTrigger value="brevets" className="text-xs">
                                    Brevets
                                  </TabsTrigger>
                                  <TabsTrigger value="theses" className="text-xs">
                                    Thèses
                                  </TabsTrigger>
                                </TabsList>

                                <TabsContent value="publications" className="mt-4">
                                  <div className="space-y-3">
                                    <h4 className="font-medium">Liste tabulaire par type</h4>
                                    <div className="border rounded-lg overflow-hidden">
                                      <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                          <tr>
                                            <th className="text-left py-2 px-3 font-medium">Titre</th>
                                            <th className="text-center py-2 px-3 font-medium">Année</th>
                                            <th className="text-left py-2 px-3 font-medium">Revue</th>
                                            <th className="text-left py-2 px-3 font-medium">DOI</th>
                                            <th className="text-center py-2 px-3 font-medium">Action</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {getMemberPublications(selectedMember.id).map((pub) => (
                                            <tr key={pub.id} className="border-t">
                                              <td className="py-2 px-3 max-w-xs truncate" title={pub.title}>
                                                {pub.title}
                                              </td>
                                              <td className="py-2 px-3 text-center">{pub.year}</td>
                                              <td className="py-2 px-3 max-w-xs truncate" title={pub.journal}>
                                                <a 
                                                  href="#" 
                                                  className="inline-flex items-center text-blue-600 underline hover:text-blue-800"
                                                  onClick={(e) => e.preventDefault()}
                                                >
                                                {pub.journal}
                                                  <ExternalLink className="h-3 w-3 ml-1" />
                                                </a>
                                              </td>
                                              <td className="py-2 px-3 text-xs font-mono">{pub.doi}</td>
                                              <td className="py-2 px-3 text-center">
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                  <X className="h-3 w-3" />
                                                </Button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="ouvrages" className="mt-4">
                                  <div className="text-center py-8 text-gray-500">
                                    Aucun ouvrage trouvé pour ce membre
                                  </div>
                                </TabsContent>

                                <TabsContent value="communications" className="mt-4">
                                  <div className="text-center py-8 text-gray-500">
                                    Aucune communication trouvée pour ce membre
                                  </div>
                                </TabsContent>

                                <TabsContent value="distinctions" className="mt-4">
                                  <div className="text-center py-8 text-gray-500">
                                    Aucune distinction trouvée pour ce membre
                                  </div>
                                </TabsContent>

                                <TabsContent value="brevets" className="mt-4">
                                  <div className="text-center py-8 text-gray-500">
                                    Aucun brevet trouvé pour ce membre
                                  </div>
                                </TabsContent>

                                <TabsContent value="theses" className="mt-4">
                                  <div className="text-center py-8 text-gray-500">
                                    Aucune thèse trouvée pour ce membre
                                  </div>
                                </TabsContent>
                              </Tabs>

                              {/* Global Commentary */}
                              <div className="space-y-3 border-t pt-4">
                                <h4 className="font-medium">Commentaire global</h4>
                                <RadioGroup
                                  value={memberEvaluations[selectedMember.id]?.globalComment || ""}
                                  onValueChange={(value: "conforme" | "reserves" | "a_revoir") =>
                                    handleMemberEvaluation(selectedMember.id, value)
                                  }
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="conforme" id="conforme" />
                                    <Label htmlFor="conforme" className="text-green-700">
                                      Conforme
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="reserves" id="reserves" />
                                    <Label htmlFor="reserves" className="text-orange-700">
                                      Réservés
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="a_revoir" id="a_revoir" />
                                    <Label htmlFor="a_revoir" className="text-red-700">
                                      À revoir
                                    </Label>
                                  </div>
                                </RadioGroup>

                                <Button
                                  onClick={handleSaveMemberEvaluation}
                                  className="bg-uh2c-blue hover:bg-uh2c-blue/90"
                                >
                                  Enregistrer l'évaluation
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              <div className="text-center">
                                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Sélectionnez un membre pour commencer l'évaluation</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* QCM Section */}
              <AccordionItem value="qcm">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-uh2c-blue" />
                      <span className="text-lg font-semibold">Questionnaire d'Évaluation</span>
                      {evaluationData.qcmCompleted && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-base font-medium">
                              1. Nombre des enseignants par laboratoire 16 ?
                            </Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q1-yes" />
                                <Label htmlFor="q1-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q1-no" />
                                <Label htmlFor="q1-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-medium">2. Nombre d'équipes min 3?</Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q2-yes" />
                                <Label htmlFor="q2-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q2-no" />
                                <Label htmlFor="q2-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-medium">
                              3. Nombre d'enseignants par équipe minimum 4?
                            </Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q3-yes" />
                                <Label htmlFor="q3-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q3-no" />
                                <Label htmlFor="q3-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-medium">
                              4. Nombre des doctorants inscrits par laboratoire minimum 16 ?
                            </Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q4-yes" />
                                <Label htmlFor="q4-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q4-no" />
                                <Label htmlFor="q4-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-medium">
                              5. Nombre de doctorants inscrits par équipe minimum 4?
                            </Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q5-yes" />
                                <Label htmlFor="q5-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q5-no" />
                                <Label htmlFor="q5-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-medium">
                              6. Une publication indexée enseignants dans les 4 dernière années?
                            </Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q6-yes" />
                                <Label htmlFor="q6-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q6-no" />
                                <Label htmlFor="q6-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-medium">
                              7. Nombre de publications indexées par laboratoire minimum 45?
                            </Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q7-yes" />
                                <Label htmlFor="q7-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q7-no" />
                                <Label htmlFor="q7-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-medium">
                              8. Somme des H-indexs des membre du laboratoire minimum 50?
                            </Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q8-yes" />
                                <Label htmlFor="q8-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q8-no" />
                                <Label htmlFor="q8-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-medium">9. Existence du PV de rassemblée générale?</Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q9-yes" />
                                <Label htmlFor="q9-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q9-no" />
                                <Label htmlFor="q9-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div>
                            <Label className="text-base font-medium">10. Existence du règlement intérieur?</Label>
                            <RadioGroup className="mt-2">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="q10-yes" />
                                <Label htmlFor="q10-yes">Oui</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="q10-no" />
                                <Label htmlFor="q10-no">Non</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={evaluationData.qcmCompleted}
                            onCheckedChange={(checked) =>
                              setEvaluationData({ ...evaluationData, qcmCompleted: checked })
                            }
                          />
                          <Label>Évaluation complétée</Label>
                        </div>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>

              {/* Final Decision */}
              <AccordionItem value="decision">
                <Card>
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-uh2c-blue" />
                      <span className="text-lg font-semibold">Décision Finale</span>
                      {evaluationData.finalDecision && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium">Décision d'évaluation</Label>
                          <RadioGroup
                            value={evaluationData.finalDecision}
                            onValueChange={(value) => setEvaluationData({ ...evaluationData, finalDecision: value })}
                            className="mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="approved" id="decision-approved" />
                              <Label htmlFor="decision-approved" className="text-green-700">
                                Approuvé - Le laboratoire répond aux critères
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="conditional" id="decision-conditional" />
                              <Label htmlFor="decision-conditional" className="text-orange-700">
                                Approuvé sous conditions - Améliorations requises
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="rejected" id="decision-rejected" />
                              <Label htmlFor="decision-rejected" className="text-red-700">
                                Rejeté - Ne répond pas aux critères
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="deferred" id="decision-deferred" />
                              <Label htmlFor="decision-deferred" className="text-blue-700">
                                Reporté - Évaluation supplémentaire nécessaire
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="final-comments">Commentaires et recommandations</Label>
                          <Textarea
                            id="final-comments"
                            value={evaluationData.comments}
                            onChange={(e) => setEvaluationData({ ...evaluationData, comments: e.target.value })}
                            placeholder="Vos commentaires finaux, recommandations et justifications de la décision..."
                            rows={5}
                          />
                        </div>

                        {evaluationData.finalDecision && (
                          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertCircle className="h-5 w-5 text-blue-600" />
                              <span className="font-medium text-blue-900">Résumé de l'évaluation</span>
                            </div>
                            <p className="text-sm text-blue-800">
                              Décision:{" "}
                              <strong>
                                {evaluationData.finalDecision === "approved" && "Approuvé"}
                                {evaluationData.finalDecision === "conditional" && "Approuvé sous conditions"}
                                {evaluationData.finalDecision === "rejected" && "Rejeté"}
                                {evaluationData.finalDecision === "deferred" && "Reporté"}
                              </strong>
                            </p>
                            <p className="text-sm text-blue-700 mt-1">Progression: {calculateProgress()}% complété</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          </div>
        </main>
      </div>
    </div>
  )
}
