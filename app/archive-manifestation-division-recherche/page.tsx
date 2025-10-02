"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Edit, Trash2, Upload, ExternalLink, FileText, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { paysMonde, villesMonde } from "@/lib/pays-villes"
import { Textarea } from "@/components/ui/textarea"
import { etabUh2c } from "@/lib/etab-uh2c"






/***************Models+DATA****************/
//Models
interface ManifestationScientifique {
  id: string
  intitule: string
  type: "Colloque" | "journée d’étude" | "séminaire" | "atelier"
  dateDebut: string
  dateFin: string
  organisateur: "UH2C" | "Autre"
  lieu: string
  participant: string
  pays: string
  ville: string
  lienOrSiteweb: string
  indexations: string
  resume: string
  justificatifs: string[]
  decision: "Accepté" | "Refusé" | "En attente"
  commentaireExpert: string
}

//DATA
const mockData: ManifestationScientifique[] = [
  {
    id: "1",
    intitule: "Conférence Internationale sur l'IA",
    type: "Colloque",
    dateDebut: "2024-03-15",
    dateFin: "2024-03-17",
    organisateur: "Autre",
    lieu: "FSJES-Aïn Chock",
    participant: "Naciri Mohamed",
    pays: "Maroc",
    ville: "Casablanca",
    lienOrSiteweb: "https://conference-ia.ma",
    indexations: "IEEE, Scopus",
    resume: "La manif d'IA était pleinne d'activitées importantes",
    justificatifs: ["programme.pdf"],
    decision: "Accepté",
    commentaireExpert: "Excellente organisation",
  },
  {
    id: "2",
    intitule: "Workshop sur les Réseaux",
    type: "Colloque",
    dateDebut: "2024-05-20",
    dateFin: "2024-05-22",
    organisateur: "UH2C",
    lieu: "FSJES-Aïn Chock",
    participant: "Amrani Lamia",
    pays: "Maroc",
    ville: "Rabat",
    lienOrSiteweb: "https://workshop-reseaux.ma",
    indexations: "ACM",
    resume: "Le manif du Workshop sur les Réseaux était importante",
    justificatifs: ["certificat.pdf"],
    decision: "En attente",
    commentaireExpert: "",
  },
]



//DATA chercheurs
const chercheurs: string[] = [
  "Naciri Mohamed", "Kadiri Jawad", "Amrani Lamia", "yhyawi Fouad", "Amrawi Imane"
]








export default function ArchiveManifestationDivisionRecherche() {

/***************Traitement****************/
  const [manifestations, setManifestations] = useState<ManifestationScientifique[]>(mockData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ManifestationScientifique | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const { toast } = useToast()

  
  

  const [formData, setFormData] = useState({
    intitule: "",
    type: "Colloque" as "Colloque" | "journée d’étude" | "séminaire" | "atelier",
    dateDebut: "",
    dateFin: "",
    organisateur: "UH2C" as "UH2C"  | "Autre", 
    lieu: "",
    participant: "",
    pays: "",
    ville: "",
    lienOrSiteweb: "",
    indexations: "",
    resume: "",
    justificatifs: [] as File[],
  })

  const filteredManifestations = manifestations.filter((item) => {
    const matchesSearch =
      item.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ville.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesYear = yearFilter === "all" || item.dateDebut.startsWith(yearFilter)
    return matchesSearch && matchesType && matchesYear
  })
  
  //trait ajout manifestation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation conditionnelle : lien OU justificatifs obligatoire
    if (!formData.lienOrSiteweb && formData.justificatifs.length === 0) {
      toast({ 
        title: "Erreur de validation", 
        description: "Veuillez fournir soit un lien, soit un justificatif",
        variant: "destructive"
      })
      return
    }

    const newManifestation: ManifestationScientifique = {
      id: editingItem?.id || Date.now().toString(),
      intitule: formData.intitule,
      type: formData.type,
      dateDebut: formData.dateDebut,
      dateFin: formData.dateFin,
      organisateur: formData.organisateur,
      lieu: formData.lieu,
      participant: formData.participant,
      pays: formData.pays,
      ville: formData.ville,
      indexations: formData.indexations,
      resume: formData.resume,
      lienOrSiteweb: formData.lienOrSiteweb,
      justificatifs: formData.justificatifs.map((f) => f.name),
      decision: "Accepté",
      commentaireExpert: "",
    }
    

    if (editingItem) {
      setManifestations((prev) => prev.map((item) => (item.id === editingItem.id ? newManifestation : item)))
      toast({ title: "Manifestation modifiée avec succès" })
    } else {
  
    setManifestations((prev) => [...prev, newManifestation])
    toast({ title: "Nouvelle manifestation ajoutée avec succès" })   
    }

    setIsModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      intitule: "",
      type: "Colloque",
      dateDebut: "",
      dateFin: "",
      organisateur: "UH2C",
      lieu: "FSJES-Aïn Chock",
      participant: "",
      pays: "",
      ville: "",
      indexations: "",
      resume: "",
      lienOrSiteweb: "",
      justificatifs: [],
    })
    setEditingItem(null)
  }

  const handleEdit = (item: ManifestationScientifique) => {
    setEditingItem(item)
    setFormData({
      intitule: item.intitule,
      type: item.type,
      dateDebut: item.dateDebut,
      dateFin: item.dateDebut,
      organisateur: "UH2C",
      lieu: "FSJES-Aïn Chock",
      participant: "",
      pays: item.pays,
      ville: item.ville,
      indexations: item.indexations,
      resume: item.resume,
      lienOrSiteweb: item.lienOrSiteweb,
      justificatifs: [],
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setManifestations((prev) => prev.filter((item) => item.id !== id))
    toast({ title: "Manifestation supprimée avec succès" })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        justificatifs: Array.from(e.target.files || []),
      }))
    }
  }

  // Obtenir la date actuelle pour limiter la sélection
  const getCurrentDate = () => new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const years = Array.from(new Set(manifestations.map((item) => item.dateDebut.split("-")[0]))).sort()

  





/***************vue****************/
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Archives des Manifestations Scientifiques</h1>
              <p className="text-gray-600 mt-2">Renseigner les anciennes manifetstations de l'UH2C</p>
            </div>


            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Liste des anciennes manifestations de l'UH2C</CardTitle>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={resetForm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Renseigner ancienne manifetstation de l'UH2C
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem ? "Modifier la manifestation" : "Ajouter une nouvelle manifestation"}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="intitule">Intitulé *</Label>
                            <Input
                              id="intitule"
                              value={formData.intitule}
                              onChange={(e) => setFormData((prev) => ({ ...prev, intitule: e.target.value }))}
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="type">Type</Label>
                            <Select
                              value={formData.type}
                              onValueChange={(value: "Colloque" | "journée d’étude" | "séminaire" | "atelier") =>
                                setFormData((prev) => ({ ...prev, type: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Colloque">Colloque</SelectItem>
                                <SelectItem value="journée d’étude">journée d’étude</SelectItem>
                                <SelectItem value="séminaire">séminaire</SelectItem>
                                <SelectItem value="atelier">atelier</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="dateDebut">Date début</Label>
                            <Input
                              id="dateDebut"
                              type="date"
                              value={formData.dateDebut}
                              max={getCurrentDate()}
                              onChange={(e) => setFormData((prev) => ({ ...prev, dateDebut: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="dateFin">Date fin</Label>
                            <Input
                              id="dateFin"
                              type="date"
                              value={formData.dateFin}
                              max={getCurrentDate()}
                              onChange={(e) => setFormData((prev) => ({ ...prev, dateFin: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="organisateur">Organisateur</Label>
                            <Select
                              value={formData.organisateur}
                              onValueChange={(value: "UH2C" | "Autre") =>
                                setFormData((prev) => ({ ...prev, organisateur: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UH2C">UH2C</SelectItem>
                                <SelectItem value="Autre">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="lieu">Lieu</Label>
                            {formData.organisateur === "UH2C" ? (
                              // Composant Select pour les établissements UH2C
                              <Select
                              value={formData.lieu}
                              onValueChange={(value: string ) =>
                                setFormData((prev) => ({ ...prev, lieu: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {etabUh2c.map((etab) => ( 
                                  <SelectItem key={etab} value={etab}>{etab}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                              ) : (
                                // Composant Input pour saisir le lieu librement quand organisateur est "Autre"
                                <Input
                                  id="lieu"
                                  type="text"
                                  value={formData.lieu}
                                  onChange={(e) => setFormData((prev) => ({ ...prev, lieu: e.target.value }))}
                                  placeholder="Saisir le lieu de la manifestation"
                            />
                              )}
                          </div>

                        </div>

                        <div>
                          <Label htmlFor="participant">participant</Label>
                          <Select
                              value={formData.participant}
                              onValueChange={(value: string ) =>
                                setFormData((prev) => ({ ...prev, participant: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {chercheurs.map((chercheur) => ( 
                                  <SelectItem key={chercheur} value={chercheur}>{chercheur}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        </div>
                          
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="pays">Pays</Label>
                            <Select
                              value={formData.pays}
                              onValueChange={(value: string) =>
                                setFormData((prev) => ({ ...prev, pays: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un pays" />
                              </SelectTrigger>
                              <SelectContent>
                                {paysMonde.map((p) => (
                                  <SelectItem key={p} value={p}>
                                    {p}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="ville">Ville</Label>
                            <Select
                              value={formData.ville}
                              onValueChange={(value: string) =>
                                setFormData((prev) => ({ ...prev, ville: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une ville" />
                              </SelectTrigger>
                              <SelectContent>
                                {villesMonde.map((v) => (
                                  <SelectItem key={v} value={v}>
                                    {v}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                        </div>
                         
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="lienOrSiteweb">
                              Lien | Siteweb
                              <span className={`ml-1 ${!formData.lienOrSiteweb && formData.justificatifs.length === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                {!formData.lienOrSiteweb && formData.justificatifs.length === 0 ? '*' : '(optionnel)'}
                              </span>
                            </Label>
                            <Input
                              id="lienOrSiteweb"
                              type="url"
                              value={formData.lienOrSiteweb}
                              onChange={(e) => setFormData((prev) => ({ ...prev, lienOrSiteweb: e.target.value }))}
                              placeholder="https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Fournissez un lien OU un justificatif (au moins l'un des deux est requis)
                            </p>
                          </div>

                          <div>
                            <Label htmlFor="organisateur">Indexations</Label>
                            <Select
                              value={formData.indexations}
                              onValueChange={(value: string) =>
                                setFormData((prev) => ({ ...prev, indexations: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Wos">Wos</SelectItem>
                                <SelectItem value="Scopus">Scopus</SelectItem>
                                <SelectItem value="ORCID">ORCID</SelectItem>
                                <SelectItem value="SCIMAGO">SCIMAGO</SelectItem>
                                <SelectItem value="PubMed">PubMed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div> 
                        

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="resume">Resume</Label>
                            <Textarea
                              id="resume"
                              value={formData.resume}
                              onChange={(e) => setFormData((prev) => ({ ...prev, resume: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="justificatifs">
                              Pices Jointes 
                              <span className={`ml-1 ${!formData.lienOrSiteweb && formData.justificatifs.length === 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                {!formData.lienOrSiteweb && formData.justificatifs.length === 0 ? '*' : '(optionnels)'}
                              </span>
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 hover:bg-gray-50 cursor-pointer">
                              <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                                id="file-upload"
                              />
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="space-y-3">
                                  <div className="mx-auto w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">
                                      Cliquez pour télécharger ou glissez-déposez
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      PDF, DOC, DOCX jusqu'à 10MB
                                    </p>
                                  </div>
                                </div>
                                <div>
                               </div>
                                
                              </label>
                              {formData.justificatifs.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  {formData.justificatifs.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                      <FileText className="h-5 w-5 text-blue-600" />
                                      <span className="flex-1 text-sm text-gray-700 truncate">
                                        {file.name}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newFiles = formData.justificatifs.filter((_, i) => i !== index)
                                          setFormData(prev => ({ ...prev, piecesJointes: newFiles }))
                                        }}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Annuler
                          </Button>
                          <Button type="submit">{editingItem ? "Modifier" : "Ajouter"}</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                
              </CardHeader>


              
              <CardContent >
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher par intitulé ou ville..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="Organisée">Organisée</SelectItem>
                      <SelectItem value="Participation">Participation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>



                {//liste manifestations
                filteredManifestations.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Intitulé</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date début</TableHead>
                          <TableHead>Date fin</TableHead>
                          <TableHead>Organisateur</TableHead>
                          <TableHead>Participant</TableHead>
                          <TableHead>Lieu</TableHead>
                          <TableHead>Pays</TableHead>
                          <TableHead>Ville</TableHead>
                          <TableHead>Lien|Site web</TableHead>
                          <TableHead>indexation</TableHead>
                          <TableHead>Resumé\Objectifs</TableHead>
                          <TableHead>Programme\Justif</TableHead>
                          <TableHead>Décision</TableHead>
                          <TableHead>Commentaire expert</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredManifestations.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.intitule}>
                                {item.intitule}
                              </div>
                              <div className="text-sm text-gray-500">{item.type}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.type}</Badge>
                            </TableCell>
                            <TableCell>{new Date(item.dateDebut).toLocaleDateString("fr-FR")}</TableCell>
                            <TableCell>{new Date(item.dateFin).toLocaleDateString("fr-FR")}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.organisateur}>
                                {item.organisateur}
                              </div>
                            </TableCell>
                            <TableCell>{item.participant}</TableCell>
                            <TableCell>{item.lieu}</TableCell>
                            <TableCell>{item.pays}</TableCell>
                            <TableCell>{item.ville}</TableCell>
                            <TableCell>
                              {item.lienOrSiteweb && (
                                  <a href={item.lienOrSiteweb} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 underline hover:text-blue-800">
                                    lienOrSiteweb
                                    <ExternalLink className="h-4 w-4 ml-1" />
                                    </a>
                                )}
                            </TableCell>
                            <TableCell>{item.indexations}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.resume}>
                                {item.resume}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.justificatifs.length > 0 ? (
                                <Badge variant="outline">{item.justificatifs.length} fichier(s)</Badge>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.decision === "Accepté"
                                    ? "default"
                                    : item.decision === "Refusé"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {item.decision}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate" title={item.commentaireExpert}>
                                {item.commentaireExpert || "-"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {item.lienOrSiteweb && (
                                  <a href={item.lienOrSiteweb} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 underline hover:text-blue-800">
                                    Lien
                                    <ExternalLink className="h-4 w-4 ml-1" />
                                    </a>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune manifestation trouvée</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm || typeFilter !== "all" || yearFilter !== "all"
                        ? "Essayez de modifier vos filtres"
                        : "Commencez par ajouter une nouvelle manifestation"}
                    </p>
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
