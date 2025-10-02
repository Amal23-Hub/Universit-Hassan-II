"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CheckSquare, FileText, Users } from "lucide-react"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Laboratory {
  id: string
  acronyme: string
  intitule: string
  directeur: string
  status: "pending" | "approved" | "rejected"
}

export default function DemandesManagement() {
  const [laboratories] = useState<Laboratory[]>([
    {
      id: "73",
      acronyme: "LISFA",
      intitule: "Laboratoire Interdisciplinaire des Sciences Fondamentales et Appliquées",
      directeur: "Pr HOUSSINE AZEDDOUG",
      status: "pending",
    },
    {
      id: "75",
      acronyme: "MINDLab",
      intitule: "Mathématiques, Intelligence artificielle et apprentissage Digital",
      directeur: "Pr MOHAMED LAHBY",
      status: "approved",
    },
    {
      id: "76",
      acronyme: "LCAE",
      intitule: "Laboratoire de Chimie Analytique et Environnementale",
      directeur: "Pr FATIMA ZAHRA BENALI",
      status: "pending",
    },
    {
      id: "77",
      acronyme: "LBCM",
      intitule: "Laboratoire de Biologie Cellulaire et Moléculaire",
      directeur: "Dr AICHA FASSI",
      status: "rejected",
    },
  ])

  const handleConsulterDemande = (labId: string) => {
    console.log("Consulter demande pour laboratoire:", labId)
  }

  const handleConsulterPorteur = (labId: string) => {
    console.log("Consulter porteur de projets pour laboratoire:", labId)
  }

  const getStatusBadge = (status: Laboratory["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approuvé</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejeté</Badge>
      default:
        return <Badge variant="secondary">Inconnu</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Validation laboratoire</h1>
              <p className="text-gray-600 mt-2">Géré par Fatima Benali - Directeur Adjoint</p>
            </div>

            <div className="space-y-8">
              {/* Section: Validation laboratoire */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <CheckSquare className="h-5 w-5 mr-2" />
                    Validation des laboratoires
                  </CardTitle>
                  <CardDescription>Validez les demandes de création et modification des laboratoires</CardDescription>
                </CardHeader>
                <CardContent>
                  {laboratories.length === 0 ? (
                    <div className="p-8 text-center">
                      <Image
                        src="/empty-state.svg"
                        alt="Empty state"
                        width={80}
                        height={80}
                        className="mx-auto mb-4 opacity-50"
                      />
                      <p className="text-gray-500">Aucune demande en cours</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">ID_LABO</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">ACRONYME</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">INTITULE</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">DIRECTEUR LABO</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">STATUT</th>
                            <th className="text-center py-3 px-2 font-medium text-gray-700">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {laboratories.map((lab, index) => {
                            const getStatusBorderColor = (status: Laboratory["status"]) => {
                              switch (status) {
                                case "pending": return "border-l-yellow-500"
                                case "approved": return "border-l-green-500"
                                case "rejected": return "border-l-red-500"
                                default: return "border-l-gray-300"
                              }
                            }
                            
                            return (
                              <tr key={lab.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-l-4 ${getStatusBorderColor(lab.status)} hover:bg-gray-100 transition-colors`}>
                              <td className="py-3 px-4 font-mono text-blue-600">{lab.id}</td>
                              <td className="py-3 px-4">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  {lab.acronyme}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 max-w-xs">
                                <div className="truncate" title={lab.intitule}>
                                  {lab.intitule}
                                </div>
                              </td>
                              <td className="py-3 px-4 font-medium">{lab.directeur}</td>
                              <td className="py-3 px-4">{getStatusBadge(lab.status)}</td>
                              <td className="py-3 px-2">
                                <div className="flex justify-center space-x-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleConsulterDemande(lab.id)}
                                          className="text-xs px-2 py-1 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800"
                                        >
                                          <FileText className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Consulter demande</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleConsulterPorteur(lab.id)}
                                          className="text-xs px-2 py-1 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800"
                                        >
                                          <Users className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Consulter porteur</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
