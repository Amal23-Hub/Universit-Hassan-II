"use client"

import { useState } from 'react'
import { useApiGet, useApiPost, useApiDelete } from '@/hooks/use-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Project {
  id: string
  title: string
  description: string
  category: string
  status: string
  budget?: number
  created_at: string
}

export default function ProjectsList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  
  // Utiliser le hook pour récupérer les projets
  const { 
    data: projects, 
    loading, 
    error, 
    refetch 
  } = useApiGet<Project[]>('/api/projects', {
    status: selectedStatus || undefined,
    search: searchTerm || undefined
  })

  // Utiliser le hook pour créer un projet
  const { execute: createProject, loading: creating } = useApiPost<Project>()

  // Utiliser le hook pour supprimer un projet
  const { execute: deleteProject, loading: deleting } = useApiDelete()

  // Gérer la création d'un projet
  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'created_at'>) => {
    const response = await createProject('/api/projects', projectData)
    
    if (response.success) {
      toast.success('Projet créé avec succès!')
      refetch() // Recharger la liste
    } else {
      toast.error(response.error || 'Erreur lors de la création')
    }
  }

  // Gérer la suppression d'un projet
  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      const response = await deleteProject(`/api/projects/${projectId}`)
      
      if (response.success) {
        toast.success('Projet supprimé avec succès!')
        refetch() // Recharger la liste
      } else {
        toast.error(response.error || 'Erreur lors de la suppression')
      }
    }
  }

  // Gérer la recherche
  const handleSearch = () => {
    refetch()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Chargement des projets...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500 mb-4">Erreur: {error}</div>
        <Button onClick={refetch}>Réessayer</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Rechercher un projet..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">Tous les statuts</option>
          <option value="soumis">Soumis</option>
          <option value="en_cours">En cours</option>
          <option value="approuvé">Approuvé</option>
          <option value="rejeté">Rejeté</option>
        </select>
        
        <Button onClick={handleSearch}>
          Rechercher
        </Button>
      </div>

      {/* Liste des projets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project: Project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">
                {project.title}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{project.category}</Badge>
                <Badge 
                  variant={
                    project.status === 'approuvé' ? 'default' :
                    project.status === 'en_cours' ? 'secondary' :
                    project.status === 'rejeté' ? 'destructive' : 'outline'
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>
              
              {project.budget && (
                <p className="text-sm font-medium mb-4">
                  Budget: {project.budget.toLocaleString()} MAD
                </p>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Modifier
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={deleting}
                  >
                    {deleting ? 'Suppression...' : 'Supprimer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucun projet */}
      {projects && projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun projet trouvé
        </div>
      )}
    </div>
  )
}

