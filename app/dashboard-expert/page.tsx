"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, FileText, Search, Filter, Clock, CheckCircle, AlertCircle, Building2, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ProjectHolder {
  id: string
  laboratoryName: string
  projectTitle: string
  coordinator: string
  submissionDate: string
  status: "pending" | "in_progress" | "completed"
  budget: number
  teamSize: number
  validated?: boolean
}

export default function DashboardExpert() {
  const [projects, setProjects] = useState<ProjectHolder[]>([
    {
      id: "LAB001",
      laboratoryName: "Laboratoire d'Intelligence Artificielle",
      projectTitle: "Développement d'un système IA pour la santé",
      coordinator: "Dr. Ahmed Benali",
      submissionDate: "2024-01-15",
      status: "in_progress",
      budget: 500000,
      teamSize: 12,
      validated: false,
    },
    {
      id: "LAB002",
      laboratoryName: "Centre de Recherche en Cybersécurité",
      projectTitle: "Sécurisation des réseaux IoT",
      coordinator: "Dr. Fatima Zahra",
      submissionDate: "2024-01-10",
      status: "pending",
      budget: 350000,
      teamSize: 8,
      validated: false,
    },
    {
      id: "LAB003",
      laboratoryName: "Laboratoire de Biotechnologie",
      projectTitle: "Développement de biomarqueurs",
      coordinator: "Prof. Mohammed Alami",
      submissionDate: "2023-12-20",
      status: "completed",
      budget: 750000,
      teamSize: 15,
      validated: true,
    },
  ])

  const [filteredProjects, setFilteredProjects] = useState<ProjectHolder[]>(projects)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Apply filters
  const applyFilters = () => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.laboratoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.coordinator.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter)
    }

    setFilteredProjects(filtered)
  }

  // Stats calculations
  const totalLabs = projects.length
  const pendingLabs = projects.filter((p) => p.status === "pending").length
  const inProgressLabs = projects.filter((p) => p.status === "in_progress").length
  const completedLabs = projects.filter((p) => p.status === "completed").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Expert</h1>
              <p className="text-gray-600 mt-2">Évaluez et gérez les dossiers de laboratoires</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total des laboratoires</p>
                      <p className="text-3xl font-bold text-uh2c-blue">{totalLabs}</p>
                    </div>
                    <Building2 className="h-8 w-8 text-uh2c-blue" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">En attente</p>
                      <p className="text-3xl font-bold text-gray-600">{pendingLabs}</p>
                    </div>
                    <Clock className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">En cours d'évaluation</p>
                      <p className="text-3xl font-bold text-blue-600">{inProgressLabs}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Évaluations terminées</p>
                      <p className="text-3xl font-bold text-green-600">{completedLabs}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          applyFilters()
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => {
                        setStatusFilter(value)
                        applyFilters()
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 pt-2">{filteredProjects.length} laboratoire(s) trouvé(s)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects Table */}
            <Card>
              <CardHeader>
                <CardTitle>Dossiers de laboratoires</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <Image
                      src="/empty-state.svg"
                      alt="Empty state"
                      width={120}
                      height={120}
                      className="mx-auto mb-4 opacity-50"
                    />
                    <p className="text-gray-500">Aucun laboratoire trouvé</p>
                    <p className="text-sm text-gray-400">Ajustez vos filtres pour voir plus de résultats</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Laboratoire</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Projet</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Coordonnateur</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Date</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Statut</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-700">Budget</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Équipe</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((project, index) => (
                          <tr key={project.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                            <td className="py-3 px-4 font-mono text-sm">{project.id}</td>
                            <td className="py-3 px-4">
                              <div className="max-w-xs">
                                <p className="font-medium truncate" title={project.laboratoryName}>
                                  {project.laboratoryName}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="max-w-xs">
                                <p className="truncate" title={project.projectTitle}>
                                  {project.projectTitle}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="max-w-xs truncate" title={project.coordinator}>
                                {project.coordinator}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center text-xs">
                              {new Date(project.submissionDate).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className={getStatusColor(project.status)}>
                                {project.status === "pending" && "En attente"}
                                {project.status === "in_progress" && "En cours"}
                                {project.status === "completed" && "Terminé"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-xs">{formatBudget(project.budget)}</td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center">
                                <Users className="h-4 w-4 mr-1 text-gray-400" />
                                <span className="text-sm">{project.teamSize}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center space-x-2">
                                <Link href={`/dashboard-expert/evaluation/${project.id}`}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/dashboard-expert/fiche-technique/${project.id}`}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </Link>
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
