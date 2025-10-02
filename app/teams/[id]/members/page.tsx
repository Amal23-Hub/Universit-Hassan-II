"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Plus, Trash2, Crown, ArrowLeft } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { dataService, type Team, type Member } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function TeamMembers() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
  })

  useEffect(() => {
    if (params.id) {
      fetchTeamAndMembers()
    }
  }, [params.id])

  const fetchTeamAndMembers = async () => {
    try {
      const [teamData, membersData] = await Promise.all([
        dataService.getTeam(params.id as string),
        dataService.getMembers(params.id as string),
      ])

      setTeam(teamData)
      setMembers(membersData)
    } catch (error) {
      console.error("Error fetching team and members:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMember.name.trim()) return

    try {
      await dataService.createMember({
        name: newMember.name,
        email: newMember.email || null,
        role: newMember.role || null,
        is_leader: false,
        team_id: params.id as string,
      })

      toast({
        title: "Succès",
        description: "Membre ajouté avec succès",
      })

      setNewMember({ name: "", email: "", role: "" })
      fetchTeamAndMembers()
    } catch (error) {
      console.error("Error adding member:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
        variant: "destructive",
      })
    }
  }

  const deleteMember = async (memberId: string) => {
    try {
      await dataService.deleteMember(memberId)

      toast({
        title: "Succès",
        description: "Membre supprimé avec succès",
      })

      fetchTeamAndMembers()
    } catch (error) {
      console.error("Error deleting member:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive",
      })
    }
  }

  const toggleLeader = async (memberId: string, isCurrentlyLeader: boolean) => {
    try {
      if (isCurrentlyLeader) {
        // Remove leader status
        await dataService.updateMember(memberId, { is_leader: false })
      } else {
        // Set as leader (this will remove leader status from others)
        await dataService.setTeamLeader(params.id as string, memberId)
      }

      toast({
        title: "Succès",
        description: isCurrentlyLeader ? "Chef d'équipe retiré" : "Nouveau chef d'équipe désigné",
      })

      fetchTeamAndMembers()
    } catch (error) {
      console.error("Error updating leader:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le chef d'équipe",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <div className="mx-auto">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
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
          <div className="mx-auto">
            <div className="mb-8 flex items-center space-x-4">
              <Link href="/teams">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Membres de l'équipe</h1>
                <p className="text-gray-600 mt-2">{team?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Member Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un membre</CardTitle>
                  <CardDescription>Ajoutez un nouveau membre à cette équipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addMember} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        placeholder="Dr. Fatima Zahra"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        placeholder="fatima.zahra@uh2c.ma"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Fonction/Rôle</Label>
                      <Select
                        value={newMember.role}
                        onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une fonction" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professeur">Professeur</SelectItem>
                          <SelectItem value="Maître Assistant">Maître Assistant</SelectItem>
                          <SelectItem value="Doctorant">Doctorant</SelectItem>
                          <SelectItem value="Post-Doctorant">Post-Doctorant</SelectItem>
                          <SelectItem value="Ingénieur de Recherche">Ingénieur de Recherche</SelectItem>
                          <SelectItem value="Technicien">Technicien</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-uh2c-blue hover:bg-uh2c-blue/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter le membre
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Members List */}
              <Card>
                <CardHeader>
                  <CardTitle>Membres actuels ({members.length})</CardTitle>
                  <CardDescription>Gérez les membres de cette équipe</CardDescription>
                </CardHeader>
                <CardContent>
                  {members.length === 0 ? (
                    <div className="text-center py-8">
                      <Image
                        src="/empty-state.svg"
                        alt="Empty state"
                        width={80}
                        height={80}
                        className="mx-auto mb-4 opacity-50"
                      />
                      <p className="text-gray-500">Aucun membre dans cette équipe</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium">{member.name}</p>
                                {member.is_leader && <Crown className="h-4 w-4 text-yellow-500" />}
                              </div>
                              <p className="text-sm text-gray-500">{member.role}</p>
                              {member.email && <p className="text-xs text-gray-400">{member.email}</p>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleLeader(member.id, member.is_leader)}
                              className={member.is_leader ? "bg-yellow-50 border-yellow-200" : ""}
                            >
                              <Crown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMember(member.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
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
