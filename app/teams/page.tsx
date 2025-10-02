"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Plus, UserPlus, Crown, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { dataService, type Team, type Member } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

export default function Teams() {
  const [teams, setTeams] = useState<(Team & { members: Member[] })[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const teamsData = await dataService.getTeams()
      setTeams(teamsData)
    } catch (error) {
      console.error("Error fetching teams:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les équipes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteTeam = async (teamId: string) => {
    try {
      await dataService.deleteTeam(teamId)
      toast({
        title: "Succès",
        description: "Équipe supprimée avec succès",
      })
      fetchTeams()
    } catch (error) {
      console.error("Error deleting team:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'équipe",
        variant: "destructive",
      })
    }
  }

  const EmptyState = () => (
    <Card className="text-center py-12">
      <CardContent>
        <Image src="/empty-state.svg" alt="Empty state" width={120} height={120} className="mx-auto mb-4 opacity-50" />
        <CardTitle className="mb-2">Aucune équipe créée</CardTitle>
        <CardDescription className="mb-6">Commencez par créer votre première équipe de recherche</CardDescription>
        <Link href="/teams/create">
          <Button className="bg-uh2c-blue hover:bg-uh2c-blue/90">
            <Plus className="h-4 w-4 mr-2" />
            Créer une équipe
          </Button>
        </Link>
      </CardContent>
    </Card>
  )

  const TeamCard = ({ team }: { team: Team & { members: Member[] } }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{team.name}</CardTitle>
            <CardDescription className="mt-1">{team.description}</CardDescription>
            {team.research_area && (
              <Badge variant="outline" className="mt-2">
                {team.research_area}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {team.members.length} membre{team.members.length > 1 ? "s" : ""}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteTeam(team.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Team Leader */}
          {team.members.find((m) => m.is_leader) && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Crown className="h-4 w-4 mr-1 text-yellow-500" />
                Chef d'équipe
              </h4>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {team.members
                      .find((m) => m.is_leader)
                      ?.name.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{team.members.find((m) => m.is_leader)?.name}</p>
                  <p className="text-xs text-gray-500">{team.members.find((m) => m.is_leader)?.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Other Members */}
          {team.members.filter((m) => !m.is_leader).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Membres</h4>
              <div className="space-y-2">
                {team.members
                  .filter((m) => !m.is_leader)
                  .map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Link href={`/teams/${team.id}/members`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <UserPlus className="h-4 w-4 mr-1" />
                Gérer membres
              </Button>
            </Link>
            <Link href={`/teams/${team.id}/edit`}>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
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
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Composition des Équipes</h1>
                <p className="text-gray-600 mt-2">Gérez les équipes de votre laboratoire</p>
              </div>
              <Link href="/teams/create">
                <Button className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle équipe
                </Button>
              </Link>
            </div>

            {teams.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
