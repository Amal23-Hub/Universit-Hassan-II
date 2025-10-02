"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, FileText, DollarSign, Plus, Trash2, Filter, XCircle, Upload } from "lucide-react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { useRouter } from "next/navigation"
import Image from "next/image"
interface ProjetContrat {
  id: string
  typeProjetContrat: "Projet de recherche financé" | "Contrat de recherche"
  typeProjet: "National" | "International"
  coordonnateur: string
  intitule: string
  thematique: string
  organismeContractant: string
  codeReference: string
  anneeDebut: number
  anneeFin: number
  organismesPartenaires: string
  budgetTotal: number
  tranches: Array<{ 
    id: string, 
    montant: number, 
    description: string,
    recu?: boolean,
    dateReception?: string,
    envoye?: boolean,
    dateEnvoi?: string
  }>
  nombreDoctorants: number
  bourse: number
  mobilite: number
  phaseSoumission?: string
  phaseConvention?: string
  lien?: string
  justificatifs?: string
  membres?: string[]
  programme?: string
  typologie?: string
  sousProgramme?: string
  statutRetenu?: "Retenu" | "Non retenu" | "En attente"
  convention?: string
  versements?: Array<{ id: string, montant: number, date: string, description: string }>
}

export default function ProjetsContrats() {
  const router = useRouter()
  const [projets, setProjets] = useState<ProjetContrat[]>([
    {
      id: "1",
      typeProjetContrat: "Projet de recherche financé",
      typeProjet: "National",
      coordonnateur: "Dr. Ahmed BENALI",
      intitule: "Développement de technologies vertes pour la transition énergétique",
      thematique: "Énergie renouvelable",
      organismeContractant: "Ministère de l'Énergie",
      codeReference: "PR-2024-001",
      anneeDebut: 2024,
      anneeFin: 2026,
      organismesPartenaires: "Université Hassan II, CNRS",
      budgetTotal: 1500000,
      tranches: [
        { 
          id: "1", 
          montant: 500000, 
          description: "Première tranche",
          recu: true,
          dateReception: "2024-01-15",
          envoye: true,
          dateEnvoi: "2024-01-10"
        },
        { 
          id: "2", 
          montant: 1000000, 
          description: "Deuxième tranche",
          recu: false,
          envoye: true,
          dateEnvoi: "2024-06-01"
        }
      ],
      nombreDoctorants: 3,
      bourse: 120000,
      mobilite: 50000,
      statutRetenu: "Retenu",
      convention: "convention-projet-1.pdf",
      versements: [
        { id: "1", montant: 500000, date: "2024-01-15", description: "Premier versement" },
        { id: "2", montant: 300000, date: "2024-06-20", description: "Deuxième versement" }
      ]
    },
    {
      id: "2",
      typeProjetContrat: "Contrat de recherche",
      typeProjet: "International",
      coordonnateur: "Dr. Fatima EL HASSANI",
      intitule: "Intelligence artificielle pour la médecine personnalisée",
      thematique: "Intelligence artificielle",
      organismeContractant: "Institut Pasteur",
      codeReference: "CR-2024-002",
      anneeDebut: 2024,
      anneeFin: 2027,
      organismesPartenaires: "Université Hassan II, Sorbonne Université",
      budgetTotal: 2500000,
      tranches: [
        { 
          id: "1", 
          montant: 800000, 
          description: "Phase 1",
          recu: false,
          envoye: false
        },
        { 
          id: "2", 
          montant: 900000, 
          description: "Phase 2",
          recu: false,
          envoye: false
        },
        { 
          id: "3", 
          montant: 800000, 
          description: "Phase 3",
          recu: false,
          envoye: false
        }
      ],
      nombreDoctorants: 5,
      bourse: 200000,
      mobilite: 100000,
      statutRetenu: "Non retenu"
    },
    {
      id: "3",
      typeProjetContrat: "Projet de recherche financé",
      typeProjet: "National",
      coordonnateur: "Dr. Karim ALAOUI",
      intitule: "Optimisation des réseaux de transport intelligents",
      thematique: "Transport et logistique",
      organismeContractant: "Agence Nationale des Autoroutes",
      codeReference: "PR-2024-003",
      anneeDebut: 2024,
      anneeFin: 2025,
      organismesPartenaires: "Université Hassan II, École Mohammadia",
      budgetTotal: 800000,
      tranches: [
        { 
          id: "1", 
          montant: 400000, 
          description: "Étude préliminaire",
          recu: false,
          envoye: false
        },
        { 
          id: "2", 
          montant: 400000, 
          description: "Développement",
          recu: false,
          envoye: false
        }
      ],
      nombreDoctorants: 2,
      bourse: 80000,
      mobilite: 30000,
      statutRetenu: "En attente"
    }
  ])

  const [filteredProjets, setFilteredProjets] = useState<ProjetContrat[]>(projets)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterAnnee, setFilterAnnee] = useState<string>("all")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [showVersementsModal, setShowVersementsModal] = useState(false)
  const [selectedProjetForModal, setSelectedProjetForModal] = useState<ProjetContrat | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedProjetForDetails, setSelectedProjetForDetails] = useState<ProjetContrat | null>(null)
  const [newVersement, setNewVersement] = useState({
    montant: 0,
    date: "",
    description: ""
  })
  const [uploadingConvention, setUploadingConvention] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedProjetForUpload, setSelectedProjetForUpload] = useState<ProjetContrat | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  // Filter logic
  const applyFilters = () => {
    let filtered = projets

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (projet) =>
          projet.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.coordonnateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.thematique.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.organismeContractant.toLowerCase().includes(searchTerm.toLowerCase()) ||
          projet.codeReference.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((projet) => projet.typeProjet === filterType)
    }

    // Year filter
    if (filterAnnee !== "all") {
      filtered = filtered.filter((projet) => projet.anneeDebut.toString() === filterAnnee)
    }

    // Statut filter
    if (filterStatut !== "all") {
      filtered = filtered.filter((projet) => projet.statutRetenu === filterStatut)
    }

    setFilteredProjets(filtered)
  }

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterType, filterAnnee, filterStatut])

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getCurrentYear = () => new Date().getFullYear()

  const getUniqueYears = () => {
    const years = projets.map(projet => projet.anneeDebut)
    return [...new Set(years)].sort((a, b) => b - a)
  }

  const handleUploadConvention = (projet: ProjetContrat) => {
    setSelectedProjetForUpload(projet)
    setShowUploadModal(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }

  const handleConfirmUpload = () => {
    if (!selectedProjetForUpload || !uploadFile) return

    setUploadingConvention(selectedProjetForUpload.id)
    
    // Simuler l'upload (dans un vrai projet, vous enverriez le fichier au serveur)
    setTimeout(() => {
      // Mettre à jour le projet avec le nouveau nom de fichier
      const updatedProjets = projets.map(p => {
        if (p.id === selectedProjetForUpload.id) {
          return {
            ...p,
            convention: uploadFile.name
          }
        }
        return p
      })
      
      setProjets(updatedProjets)
      setUploadingConvention(null)
      setShowUploadModal(false)
      setSelectedProjetForUpload(null)
      setUploadFile(null)
      
      // Feedback utilisateur
      alert(`Convention "${uploadFile.name}" uploadée avec succès pour le projet: ${selectedProjetForUpload.intitule}`)
      console.log(`Convention uploadée: ${uploadFile.name} pour le projet: ${selectedProjetForUpload.intitule}`)
    }, 1500) // Simulation d'un délai d'upload
  }

  const handleCancelUpload = () => {
    setShowUploadModal(false)
    setSelectedProjetForUpload(null)
    setUploadFile(null)
  }

  const handleGestionVersements = (projet: ProjetContrat) => {
    router.push(`/dashboard-division-recherche/versements?projetId=${projet.id}`)
  }

  const handleVoirDetails = (projet: ProjetContrat) => {
    setSelectedProjetForDetails(projet)
    setShowDetailsModal(true)
  }

  const handleAddVersement = () => {
    if (!selectedProjetForModal || !newVersement.montant || !newVersement.date || !newVersement.description) {
      return
    }
    
    const newVersementWithId = {
      id: Date.now().toString(),
      ...newVersement
    }

    const updatedProjets = projets.map(projet => {
      if (projet.id === selectedProjetForModal.id) {
        return {
          ...projet,
          versements: [...(projet.versements || []), newVersementWithId]
        }
      }
      return projet
    })

    setProjets(updatedProjets)
    setNewVersement({ montant: 0, date: "", description: "" })
  }

  const handleRemoveVersement = (versementId: string) => {
    if (!selectedProjetForModal) return

    const updatedProjets = projets.map(projet => {
      if (projet.id === selectedProjetForModal.id) {
        return {
          ...projet,
          versements: projet.versements?.filter(v => v.id !== versementId) || []
        }
      }
      return projet
    })

    setProjets(updatedProjets)
  }

  // Fonction pour l'extraction automatique des données clés du PDF de convention
  const handleExtractConventionData = (projet: ProjetContrat) => {
    // Voir la possibilité d'extraction automatique des données clés contenues dans le PDF de convention
    console.log(`Extraction automatique des données clés de la convention pour: ${projet.intitule}`)
    
    // Simulation de l'extraction des données clés :
    // - Budget allouée (peut ne pas correspondre au budget proposé par le porteur de projet)
    // - Tranches (le budget définitif des tranches peut ne pas correspondre au budget proposé)
    // - Modalité de versement
    // - Budget prévisionnel (tableau "Utilisation de la subvention" détaillant les postes budgétaires par projet)
    
    alert(`Extraction des données clés de la convention pour ${projet.intitule}\n\nDonnées extraites:\n- Budget allouée: ${formatBudget(projet.budgetTotal)}\n- Tranches: ${projet.tranches.length} tranches\n- Modalité de versement: À définir\n- Budget prévisionnel: Correspond au programme d'emploi provisoire du projet de recherche`)
  }

  // Fonction pour marquer une tranche comme reçue
  const handleTrancheRecu = (projetId: string, trancheId: string, recu: boolean, dateReception?: string) => {
    const updatedProjets = projets.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.id === trancheId) {
              return {
                ...tranche,
                recu,
                dateReception: recu ? (dateReception || new Date().toISOString().split('T')[0]) : undefined
              }
            }
            return tranche
          })
        }
      }
      return projet
    })
    setProjets(updatedProjets)
  }

  // Fonction pour marquer une tranche comme envoyée
  const handleTrancheEnvoye = (projetId: string, trancheId: string, envoye: boolean, dateEnvoi?: string) => {
    const updatedProjets = projets.map(projet => {
      if (projet.id === projetId) {
        return {
          ...projet,
          tranches: projet.tranches.map(tranche => {
            if (tranche.id === trancheId) {
              return {
                ...tranche,
                envoye,
                dateEnvoi: envoye ? (dateEnvoi || new Date().toISOString().split('T')[0]) : undefined
              }
            }
            return tranche
          })
        }
      }
      return projet
    })
    setProjets(updatedProjets)
  }

  // Fonction pour trier les projets par tranches (ascendant/descendant)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const handleSortByTranches = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Projets retenus</h1>
                <p className="text-gray-600 mt-2">Gérez vos projets de recherche et contrats</p>
              </div>
                        </div>
                        
            {/* Filters simplifiés */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres et recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">Type de contrat</Label>
                      <Select
                        value={filterType}
                        onValueChange={(value) => {
                          setFilterType(value)
                          applyFilters()
                        }}
                      >
                      <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les types</SelectItem>
                          <SelectItem value="National">National</SelectItem>
                          <SelectItem value="International">International</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  <div>
                    <Label className="text-xs">Année</Label>
                      <Select
                        value={filterAnnee}
                        onValueChange={(value) => {
                          setFilterAnnee(value)
                          applyFilters()
                        }}
                      >
                      <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les années</SelectItem>
                          {getUniqueYears().map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  <div>
                    <Label className="text-xs">Statut</Label>
                      <Select
                        value={filterStatut}
                        onValueChange={(value) => {
                          setFilterStatut(value)
                          applyFilters()
                        }}
                      >
                      <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="Retenu">Retenu</SelectItem>
                          <SelectItem value="Non retenu">Non retenu</SelectItem>
                          <SelectItem value="En attente">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                <div className="mt-3 text-sm text-gray-600">
                      {filteredProjets.length} projet(s)
                </div>
              </CardContent>
            </Card>

            {/* Projects Table */}
            <Card>
              <CardHeader>
                <CardTitle>Liste des projets retenus</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProjets.length === 0 ? (
                  <div className="text-center py-8">
                    <Image
                      src="/empty-state.svg"
                      alt="Empty state"
                      width={120}
                      height={120}
                      className="mx-auto mb-4 opacity-50"
                    />
                    <p className="text-gray-500">Aucun projet trouvé</p>
                    <p className="text-sm text-gray-400">Ajustez vos filtres ou ajoutez un nouveau projet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 font-medium text-gray-700 w-14">ID</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700 w-72">Intitulé</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700 w-36">Coordonnateur</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700 w-32">Thématique</th>
                      <th className="text-center py-2 px-2 font-medium text-gray-700 w-16">Année</th>
                      <th className="text-center py-2 px-2 font-medium text-gray-700 w-28">Type</th>
                      <th className="text-center py-2 px-2 font-medium text-gray-700 w-40">Statut</th>
                      <th className="text-center py-2 px-2 font-medium text-gray-700 w-32">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjets.map((projet) => (
                          <tr key={projet.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-2 font-medium text-gray-900 text-xs">
                              <div className="truncate" title={projet.codeReference}>
                                {projet.codeReference.replace(/^([A-Z]{2}-\d{4})-(\d{3})$/, '$1-$2')}
                              </div>
                            </td>
                            <td className="py-2 px-2">
                              <div className="max-w-xs">
                                <div className="font-medium text-gray-900 text-xs leading-tight mb-0.5 line-clamp-2">{projet.intitule}</div>
                                <div className="text-xs text-gray-500 truncate">{projet.organismeContractant}</div>
                              </div>
                            </td>
                            <td className="py-2 px-2 text-gray-700 text-xs">
                              <div className="truncate" title={projet.coordonnateur}>{projet.coordonnateur}</div>
                            </td>
                            <td className="py-2 px-2 text-gray-700 text-xs">
                              <div className="truncate" title={projet.thematique}>{projet.thematique}</div>
                            </td>
                            <td className="py-2 px-2 text-center text-gray-700 text-xs">{projet.anneeDebut}</td>
                            <td className="py-2 px-2 text-center">
                              <span className="text-gray-900 text-xs">
                                {projet.typeProjet === "National" ? "National" : "International"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge
                                className={
                                  projet.statutRetenu === "Retenu"
                                    ? "bg-green-100 text-green-800 border-green-200 text-xs px-4 py-2 whitespace-nowrap"
                                    : projet.statutRetenu === "Non retenu"
                                    ? "bg-red-100 text-red-800 border-red-200 text-xs px-4 py-2 whitespace-nowrap"
                                    : "bg-yellow-100 text-yellow-800 border-yellow-200 text-xs px-4 py-2 whitespace-nowrap"
                                }
                              >
                                {projet.statutRetenu === "Retenu" ? "Retenu" : projet.statutRetenu === "Non retenu" ? "Non retenu" : "En attente"}
                              </Badge>
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex items-center justify-center space-x-0.5">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0" 
                                  title="Voir les détails"
                                  onClick={() => handleVoirDetails(projet)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                {projet.statutRetenu === "Retenu" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      title="Upload convention"
                                      onClick={() => handleUploadConvention(projet)}
                                      disabled={uploadingConvention === projet.id}
                                    >
                                      {uploadingConvention === projet.id ? (
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1" />
                                      ) : (
                                        <Upload className="h-3 w-3 mr-1" />
                                      )}
                                      {uploadingConvention === projet.id ? "Upload..." : "Conv."}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 opacity-50 cursor-not-allowed"
                                      title="Gestion des versements (désactivé)"
                                      disabled={true}
                                    >
                                      <DollarSign className="h-3 w-3" />
                                    </Button>
                                  </>
                                )}
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

      {/* Modal pour gestion des versements */}
      <Dialog open={showVersementsModal} onOpenChange={setShowVersementsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gestion des versements et budget allouée</DialogTitle>
            <DialogDescription>
              Gérez les versements et consultez les informations budgétaires pour le projet : {selectedProjetForModal?.intitule}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Étape 5 - Liste des projets et réception des versements */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Étape 5 - Liste des projets et réception des versements</h4>
              <p className="text-sm text-gray-600 mb-4">
                Processus itératif à effectuer à chaque instance. Affichage de la liste des projets de recherche classés par programme.
              </p>
              
              {/* Bouton de tri */}
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSortByTranches}
                  className="text-blue-600 border-blue-300"
                >
                  Trier par tranches {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>

              {/* Tableau des projets avec gestion des tranches */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-2 px-2 font-medium text-gray-700 border-r">Programme</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700 border-r">Projet</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700 border-r">Nom coordonnateur</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700 border-r">Prénom</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-700 border-r">Etablissement</th>
                      <th className="text-center py-2 px-2 font-medium text-gray-700 border-r">Budget allouée</th>
                      <th className="text-center py-2 px-2 font-medium text-gray-700 border-r">Tranche 1</th>
                      <th className="text-center py-2 px-2 font-medium text-gray-700 border-r">Tranche 2</th>
                      <th className="text-center py-2 px-2 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projets
                      .filter(projet => projet.statutRetenu === "Retenu")
                      .sort((a, b) => {
                        const aTotal = a.tranches.reduce((sum, t) => sum + t.montant, 0)
                        const bTotal = b.tranches.reduce((sum, t) => sum + t.montant, 0)
                        return sortOrder === 'asc' ? aTotal - bTotal : bTotal - aTotal
                      })
                      .map((projet) => {
                        const coordonnateurParts = projet.coordonnateur.split(' ')
                        const nom = coordonnateurParts[coordonnateurParts.length - 1] || ''
                        const prenom = coordonnateurParts.slice(0, -1).join(' ') || ''
                        
                        return (
                          <tr key={projet.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-2 px-2 text-gray-700 border-r">{projet.programme || "Programme principal"}</td>
                            <td className="py-2 px-2 text-gray-700 border-r font-medium">{projet.intitule}</td>
                            <td className="py-2 px-2 text-gray-700 border-r">{nom}</td>
                            <td className="py-2 px-2 text-gray-700 border-r">{prenom}</td>
                            <td className="py-2 px-2 text-gray-700 border-r">{projet.organismeContractant}</td>
                            <td className="py-2 px-2 text-center text-gray-700 border-r font-medium">{formatBudget(projet.budgetTotal)}</td>
                            <td className="py-2 px-2 text-center border-r">
                              <div className="space-y-1">
                                <div className="text-xs font-medium">{formatBudget(projet.tranches[0]?.montant || 0)}</div>
                                <div className="flex items-center justify-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={projet.tranches[0]?.recu || false}
                                    onChange={(e) => handleTrancheRecu(projet.id, projet.tranches[0]?.id || '', e.target.checked)}
                                    className="h-3 w-3 text-blue-600"
                                    title="Reçu"
                                  />
                                  <span className="text-xs text-gray-500">Reçu</span>
                                </div>
                                {projet.tranches[0]?.recu && (
                                  <input
                                    type="date"
                                    value={projet.tranches[0]?.dateReception || ''}
                                    onChange={(e) => handleTrancheRecu(projet.id, projet.tranches[0]?.id || '', true, e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-1 py-0.5 w-full"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <div className="space-y-1">
                                <div className="text-xs font-medium">{formatBudget(projet.tranches[1]?.montant || 0)}</div>
                                <div className="flex items-center justify-center space-x-1">
                                  <input
                                    type="checkbox"
                                    checked={projet.tranches[1]?.recu || false}
                                    onChange={(e) => handleTrancheRecu(projet.id, projet.tranches[1]?.id || '', e.target.checked)}
                                    className="h-3 w-3 text-blue-600"
                                    title="Reçu"
                                  />
                                  <span className="text-xs text-gray-500">Reçu</span>
                                </div>
                                {projet.tranches[1]?.recu && (
                                  <input
                                    type="date"
                                    value={projet.tranches[1]?.dateReception || ''}
                                    onChange={(e) => handleTrancheRecu(projet.id, projet.tranches[1]?.id || '', true, e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-1 py-0.5 w-full"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <div className="flex flex-col space-y-1">
                                {projet.tranches.map((tranche, index) => (
                                  <div key={tranche.id} className="flex items-center justify-center space-x-1">
                                    <input
                                      type="checkbox"
                                      checked={tranche.envoye || false}
                                      onChange={(e) => handleTrancheEnvoye(projet.id, tranche.id, e.target.checked)}
                                      className="h-3 w-3 text-green-600"
                                      title="Envoyé"
                                    />
                                    <span className="text-xs text-gray-500">T{index + 1} Envoyé</span>
                                  </div>
                                ))}
                                {projet.tranches.some(t => t.envoye) && (
                                  <input
                                    type="date"
                                    value={projet.tranches.find(t => t.envoye)?.dateEnvoi || ''}
                                    onChange={(e) => {
                                      const tranche = projet.tranches.find(t => t.envoye)
                                      if (tranche) {
                                        handleTrancheEnvoye(projet.id, tranche.id, true, e.target.value)
                                      }
                                    }}
                                    className="text-xs border border-gray-300 rounded px-1 py-0.5 w-full"
                                    placeholder="Date ordre virement"
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Informations budgétaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget allouée */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Budget allouée</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Le budget définitif du projet peut ne pas correspondre au budget proposé par le porteur de projet.
                </p>
                <div className="text-lg font-bold text-blue-900">
                  {formatBudget(selectedProjetForModal?.budgetTotal || 0)}
                </div>
              </div>

              {/* Tranches */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3">Tranches</h4>
                <p className="text-sm text-green-700 mb-2">
                  Le budget définitif des tranches peut ne pas correspondre au budget proposé.
                </p>
                <div className="space-y-2">
                  {selectedProjetForModal?.tranches?.map((tranche) => (
                    <div key={tranche.id} className="flex justify-between items-center">
                      <span className="text-sm text-green-700">{tranche.description}</span>
                      <span className="font-medium text-green-900">{formatBudget(tranche.montant)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modalité de versement */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-3">Modalité de versement</h4>
              <p className="text-sm text-yellow-700">
                Les modalités de versement sont définies dans la convention et peuvent varier selon le programme.
              </p>
            </div>

            {/* Budget prévisionnel */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-3">Budget prévisionnel</h4>
              <p className="text-sm text-purple-700 mb-2">
                Tableau "Utilisation de la subvention" détaillant les postes budgétaires par projet. 
                Correspond au programme d'emploi provisoire du projet de recherche.
              </p>
              <Button variant="outline" size="sm" className="text-purple-700 border-purple-300">
                Voir le détail budgétaire
              </Button>
            </div>

            {/* Liste des versements existants */}
            {selectedProjetForModal?.versements && selectedProjetForModal.versements.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Versements existants</h4>
                <div className="space-y-2">
                  {selectedProjetForModal.versements.map((versement) => (
                    <div key={versement.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-gray-900">
                            {formatBudget(versement.montant)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(versement.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-sm text-gray-700">
                            {versement.description}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveVersement(versement.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ajout d'un nouveau versement */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Ajouter un versement</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm font-medium">Montant (MAD)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={newVersement.montant}
                    onChange={(e) => setNewVersement({ ...newVersement, montant: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <Input
                    type="date"
                    value={newVersement.date}
                    onChange={(e) => setNewVersement({ ...newVersement, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <Input
                    value={newVersement.description}
                    onChange={(e) => setNewVersement({ ...newVersement, description: e.target.value })}
                    placeholder="Ex: Premier versement"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button
                  onClick={handleAddVersement}
                  disabled={!newVersement.montant || !newVersement.date || !newVersement.description}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter versement
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowVersementsModal(false)}>
                Fermer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal pour les détails du projet */}
      {showDetailsModal && selectedProjetForDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header avec couleur UH2C */}
            <div className="bg-uh2c-blue border-b border-uh2c-blue/20 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">Détails du projet</h2>
                    <p className="text-xs text-white/80">ID: {selectedProjetForDetails.codeReference}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                  className="h-5 w-5 p-0 text-white hover:bg-white/20 rounded"
                >
                  <XCircle className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-4">
                {/* Statut du projet - Banner en haut */}
                <div className={`rounded-lg p-3 border-l-4 ${
                  selectedProjetForDetails.statutRetenu === "Retenu"
                    ? "bg-green-50 border-green-500"
                    : selectedProjetForDetails.statutRetenu === "Non retenu"
                    ? "bg-red-50 border-red-500"
                    : "bg-yellow-50 border-yellow-500"
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedProjetForDetails.statutRetenu === "Retenu"
                        ? "bg-green-500"
                        : selectedProjetForDetails.statutRetenu === "Non retenu"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900">Statut du projet</h3>
                      <p className={`text-sm font-medium ${
                        selectedProjetForDetails.statutRetenu === "Retenu"
                          ? "text-green-700"
                          : selectedProjetForDetails.statutRetenu === "Non retenu"
                          ? "text-red-700"
                          : "text-yellow-700"
                      }`}>
                        {selectedProjetForDetails.statutRetenu || "Non défini"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations générales du projet */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Informations générales</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Type de projet</Label>
                      <p className="text-sm text-gray-900">{selectedProjetForDetails.typeProjetContrat}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Type</Label>
                      <Badge variant="secondary" className="bg-uh2c-blue/10 text-uh2c-blue border-uh2c-blue/20 text-xs">
                        {selectedProjetForDetails.typeProjet}
                      </Badge>
                    </div>
                    <div className="md:col-span-2 bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Intitulé du projet</Label>
                      <p className="text-sm font-medium text-gray-900">{selectedProjetForDetails.intitule}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Thématique</Label>
                      <Badge variant="outline" className="bg-uh2c-blue/5 text-uh2c-blue border-uh2c-blue/20 text-xs">
                        {selectedProjetForDetails.thematique}
                      </Badge>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Code de référence</Label>
                      <p className="text-sm font-medium text-gray-900">{selectedProjetForDetails.codeReference}</p>
                    </div>
                  </div>
                </div>

                {/* Informations du coordonnateur */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Coordonnateur</h3>
                  </div>
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-uh2c-blue rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {selectedProjetForDetails.coordonnateur.split(' ').map(n => n.charAt(0)).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{selectedProjetForDetails.coordonnateur}</p>
                        <p className="text-xs text-gray-600">Coordonnateur principal</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations de l'organisme contractant */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Organisme contractant</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Organisme</Label>
                      <p className="text-sm text-gray-900">{selectedProjetForDetails.organismeContractant}</p>
                    </div>
                    <div className="bg-white rounded p-3 border border-gray-200">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Organismes partenaires</Label>
                      <p className="text-sm text-gray-900">{selectedProjetForDetails.organismesPartenaires}</p>
                    </div>
                  </div>
                </div>

                {/* Durée et budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Durée de projet */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Durée de projet</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Année de début</Label>
                        <p className="text-sm font-medium text-gray-900">{selectedProjetForDetails.anneeDebut}</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-gray-200">
                        <Label className="text-xs font-medium text-gray-600 mb-1 block">Année de fin</Label>
                        <p className="text-sm font-medium text-gray-900">{selectedProjetForDetails.anneeFin}</p>
                      </div>
                    </div>
                  </div>

                  {/* Budget total */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Budget total</h3>
                    </div>
                    <div className="bg-white rounded p-4 border border-gray-200 text-center">
                      <Label className="text-xs font-medium text-gray-600 mb-1 block">Montant en dirhams</Label>
                      <p className="text-uh2c-blue font-bold text-xl">{formatBudget(selectedProjetForDetails.budgetTotal)}</p>
                      <p className="text-xs text-gray-500 mt-1">Budget total du projet</p>
                    </div>
                  </div>
                </div>

                {/* Tranches budgétaires */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-uh2c-blue rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Tranches budgétaires</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedProjetForDetails.tranches && selectedProjetForDetails.tranches.length > 0 ? (
                      selectedProjetForDetails.tranches.map((tranche) => {
                        // Déterminer le statut de la tranche
                        let statutTranche = "En cours"
                        let statutColor = "bg-yellow-100 text-yellow-800"
                        
                        if (tranche.recu) {
                          statutTranche = "Reçu"
                          statutColor = "bg-green-100 text-green-800"
                        } else if (tranche.envoye) {
                          statutTranche = "En cours"
                          statutColor = "bg-blue-100 text-blue-800"
                        }
                        
                        return (
                          <div key={tranche.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-sm text-gray-900">{tranche.description}</h4>
                                  <Badge className={`${statutColor} text-xs font-medium`}>
                                    {statutTranche}
                                    </Badge>
                                </div>
                                <div className="text-lg font-bold text-uh2c-blue mb-3">
                                  {formatBudget(tranche.montant)}
                              </div>
                                
                                {/* Détails des dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              {tranche.dateReception && (
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="text-gray-600">Reçu le:</span>
                                      <span className="font-medium text-gray-900">
                                        {new Date(tranche.dateReception).toLocaleDateString('fr-FR')}
                                      </span>
                                    </div>
                              )}
                              {tranche.dateEnvoi && (
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      <span className="text-gray-600">Envoyé le:</span>
                                      <span className="font-medium text-gray-900">
                                        {new Date(tranche.dateEnvoi).toLocaleDateString('fr-FR')}
                                      </span>
                                    </div>
                              )}
                            </div>
                          </div>
                        </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="bg-white rounded p-4 border border-gray-200 text-center">
                        <p className="text-sm text-gray-500">Aucune tranche budgétaire définie</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white px-4 py-2 rounded text-sm"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour upload de convention */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-uh2c-blue" />
              Upload Convention
            </DialogTitle>
            <DialogDescription>
              Sélectionnez le fichier de convention à uploader
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Sélection de fichier */}
            <div className="space-y-2">
              <Label htmlFor="convention-file">Fichier de convention</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-uh2c-blue transition-colors">
                <input
                  id="convention-file"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label htmlFor="convention-file" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {uploadFile ? (
                      <span className="text-uh2c-blue font-medium">{uploadFile.name}</span>
                    ) : (
                      <>
                        Cliquez pour sélectionner un fichier<br />
                        <span className="text-xs text-gray-500">PDF, DOC, DOCX acceptés</span>
                      </>
                    )}
                  </p>
                </label>
              </div>
            </div>

            {/* Aperçu du fichier sélectionné */}
            {uploadFile && (
              <div className="bg-uh2c-blue/5 rounded-lg p-3 border border-uh2c-blue/20">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-uh2c-blue" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-uh2c-blue">{uploadFile.name}</p>
                    <p className="text-xs text-uh2c-blue/80">
                      Taille: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancelUpload}
              disabled={uploadingConvention === selectedProjetForUpload?.id}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmUpload}
              disabled={!uploadFile || uploadingConvention === selectedProjetForUpload?.id}
              className="bg-uh2c-blue hover:bg-uh2c-blue/90 text-white"
            >
              {uploadingConvention === selectedProjetForUpload?.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Convention
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
