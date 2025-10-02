"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { dataService } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export default function CreateTeam() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    researchArea: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create team only
      const newTeam = await dataService.createTeam({
        name: teamData.name,
        description: teamData.description || null,
        research_area: teamData.researchArea || null,
      })

      toast({
        title: "Succès",
        description: "Équipe créée avec succès",
      })

      // Redirect to team members page to add members
      router.push(`/teams/${newTeam.id}/members`)
    } catch (error) {
      console.error("Error creating team:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer l'équipe",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
              <h1 className="text-3xl font-bold text-gray-900">Créer une Équipe</h1>
              <p className="text-gray-600 mt-2">Ajoutez une nouvelle équipe à votre laboratoire</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Team Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de l'Équipe</CardTitle>
                  <CardDescription>Détails généraux sur l'équipe de recherche</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="teamName">Nom de l'équipe *</Label>
                    <Input
                      id="teamName"
                      value={teamData.name}
                      onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                      placeholder="Équipe Intelligence Artificielle"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="researchArea">Domaine de recherche</Label>
                    <Select
                      value={teamData.researchArea}
                      onValueChange={(value) => setTeamData({ ...teamData, researchArea: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un domaine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Intelligence Artificielle">Intelligence Artificielle</SelectItem>
                        <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                        <SelectItem value="Traitement du Langage Naturel">Traitement du Langage Naturel</SelectItem>
                        <SelectItem value="Vision par Ordinateur">Vision par Ordinateur</SelectItem>
                        <SelectItem value="Robotique">Robotique</SelectItem>
                        <SelectItem value="Cybersécurité">Cybersécurité</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={teamData.description}
                      onChange={(e) => setTeamData({ ...teamData, description: e.target.value })}
                      placeholder="Décrivez les objectifs et activités de l'équipe..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading} className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                  {loading ? "Création..." : "Créer l'équipe"}
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Après avoir créé l'équipe, vous pourrez ajouter des membres dans l'étape
                suivante.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
