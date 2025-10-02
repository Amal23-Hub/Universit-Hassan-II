"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Trash2, AlertTriangle, Search, UserPlus, Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ProjectHolder {
  id: string
  pprSom: string
  nom: string
  prenom: string
  grade: string
  etablissement: string
  validated: boolean
  enabled: boolean
}

export default function UsersManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [projectHolders, setProjectHolders] = useState<ProjectHolder[]>([
    {
      id: "1608",
      pprSom: "1278660",
      nom: "LAHBY",
      prenom: "MOHAMED",
      grade: "MCH",
      etablissement: "ENS",
      validated: true,
      enabled: true,
    },
    {
      id: "1609",
      pprSom: "1234567",
      nom: "ALAMI",
      prenom: "HASSAN",
      grade: "PR",
      etablissement: "FST",
      validated: false,
      enabled: true,
    },
    {
      id: "1610",
      pprSom: "2345678",
      nom: "BENALI",
      prenom: "FATIMA",
      grade: "MCH",
      etablissement: "ENS",
      validated: true,
      enabled: false,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<ProjectHolder | null>(null)

  const handleValidateUser = (user: ProjectHolder) => {
    setProjectHolders(
      projectHolders.map((holder) => (holder.id === user.id ? { ...holder, validated: !holder.validated } : holder)),
    )
  }

  const handleToggleUserStatus = (user: ProjectHolder) => {
    setProjectHolders(
      projectHolders.map((holder) => (holder.id === user.id ? { ...holder, enabled: !holder.enabled } : holder)),
    )
  }

  const handleDeleteUser = (user: ProjectHolder) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setProjectHolders(projectHolders.filter((holder) => holder.id !== userToDelete.id))
      setUserToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const filteredHolders = projectHolders.filter(
    (holder) =>
      holder.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holder.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holder.pprSom.includes(searchTerm),
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Demandes d'inscription</h1>
              <p className="text-gray-600 mt-2">Géré par Fatima Benali - Directeur Adjoint</p>
            </div>

            <div className="space-y-8">
              {/* Section: Gestion des comptes - Full width */}
              <Card className="border-l-4 border-l-uh2c-blue">
                <CardHeader>
                  <CardTitle className="flex items-center text-uh2c-blue">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Gestion des comptes porteurs de projets
                  </CardTitle>
                  <CardDescription>Gérez et validez les comptes des porteurs de projets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search for existing accounts */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Filtrer les comptes existants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Existing accounts table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2">
                      <h4 className="font-medium text-gray-700">Comptes des porteurs de projet:</h4>
                    </div>
                    {filteredHolders.length === 0 ? (
                      <div className="p-8 text-center">
                        <Image
                          src="/empty-state.svg"
                          alt="Empty state"
                          width={80}
                          height={80}
                          className="mx-auto mb-4 opacity-50"
                        />
                        <p className="text-gray-500">Aucun compte trouvé</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left py-2 px-3 font-medium text-gray-700">PPR/SOM</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-700">NOM</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-700">PRÉNOM</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-700">GRADE</th>
                              <th className="text-left py-2 px-3 font-medium text-gray-700">ÉTABLISSEMENT</th>
                              <th className="text-center py-2 px-3 font-medium text-gray-700">STATUT</th>
                              <th className="text-center py-2 px-3 font-medium text-gray-700">ÉTAT</th>
                              <th className="text-center py-2 px-3 font-medium text-gray-700">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredHolders.map((holder, index) => (
                              <tr key={holder.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="py-2 px-3 font-mono">{holder.pprSom}</td>
                                <td className="py-2 px-3 font-medium">{holder.nom}</td>
                                <td className="py-2 px-3">{holder.prenom}</td>
                                <td className="py-2 px-3">
                                  <Badge variant="outline">{holder.grade}</Badge>
                                </td>
                                <td className="py-2 px-3">{holder.etablissement}</td>
                                <td className="py-2 px-3 text-center">
                                  <Badge
                                    variant={holder.validated ? "default" : "secondary"}
                                    className={
                                      holder.validated
                                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                    }
                                  >
                                    {holder.validated ? "Validé" : "En attente"}
                                  </Badge>
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <Badge
                                    variant={holder.enabled ? "default" : "secondary"}
                                    className={
                                      holder.enabled
                                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                        : "bg-red-100 text-red-800 hover:bg-red-200"
                                    }
                                  >
                                    {holder.enabled ? "Activé" : "Désactivé"}
                                  </Badge>
                                </td>
                                <td className="py-2 px-3 text-center">
                                  <div className="flex items-center justify-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleValidateUser(holder)}
                                      className={cn(
                                        "h-8 w-8 p-0",
                                        holder.validated
                                          ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                                          : "text-gray-400 hover:text-green-600 hover:bg-green-50",
                                      )}
                                      title={holder.validated ? "Membre validé" : "Valider membre"}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleToggleUserStatus(holder)}
                                      className={cn(
                                        "h-8 w-8 p-0",
                                        holder.enabled
                                          ? "text-blue-600 hover:text-red-600 hover:bg-red-50"
                                          : "text-red-600 hover:text-blue-600 hover:bg-blue-50",
                                      )}
                                      title={holder.enabled ? "Désactiver compte" : "Activer compte"}
                                    >
                                      {holder.enabled ? (
                                        <PowerOff className="h-4 w-4" />
                                      ) : (
                                        <Power className="h-4 w-4" />
                                      )}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteUser(holder)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      title="Supprimer membre"
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer le compte de{" "}
              <span className="font-medium">
                {userToDelete?.prenom} {userToDelete?.nom}
              </span>{" "}
              ?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Cette action est irréversible.</p>
                <p>Le compte utilisateur sera définitivement supprimé du système.</p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
