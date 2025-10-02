"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { ArrowLeft, Download, FileText, Users, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function FicheTechniqueExpert({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nomLaboratoire: "Laboratoire d'Intelligence Artificielle et Systèmes",
    acronyme: "LIAS",
    etablissement: "Université Hassan II de Casablanca",
    adresse: "Km 7, Route d'El Jadida, Casablanca 20100",
    telephone: "+212 522 23 45 67",
    fax: "+212 522 23 45 68",
    email: "contact@lias.uh2c.ma",
    siteWeb: "https://lias.uh2c.ma",
    directeur: "Prof. Ahmed BENALI",
    emailDirecteur: "ahmed.benali@uh2c.ma",
    telephoneDirecteur: "+212 522 23 45 69",
    dateCreation: "2018-09-15",
    arretCreation: "Arrêté n°2018/DRSRU/456",
    domainesRecherche:
      "Intelligence Artificielle, Machine Learning, Traitement du langage naturel, Vision par ordinateur, Robotique",
    objectifs:
      "Développer des solutions innovantes en intelligence artificielle pour répondre aux défis sociétaux et économiques du Maroc et de l'Afrique.",
    equipements:
      "Serveurs de calcul haute performance, Stations de travail spécialisées, Équipements de robotique, Laboratoire de réalité virtuelle",
    partenariats: "MIT (USA), INRIA (France), Université de Toronto (Canada), IBM Research, Microsoft Research",
    projetsEnCours:
      "Système de diagnostic médical par IA, Plateforme d'apprentissage adaptatif, Robot assistant pour personnes âgées",
    publications: "125 publications dans des revues internationales, 89 communications dans des conférences",
    brevets: "12 brevets déposés, 8 brevets accordés",
    theses: "45 thèses soutenues, 23 thèses en cours",
    budget: "2,500,000 MAD (budget annuel moyen)",
    personnel: "15 enseignants-chercheurs, 8 doctorants, 3 techniciens, 2 administratifs",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Obtenir la date actuelle pour limiter la sélection
  const getCurrentDate = () => new Date().toISOString().split('T')[0] // YYYY-MM-DD

  const handleExportPDF = () => {
    // Placeholder for PDF export functionality
    console.log("Exporting to PDF...")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-6xl">
            {/* Header with back button */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.back()} className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Retour</span>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Fiche Technique du Laboratoire</h1>
                  <p className="text-gray-600 mt-2">Informations détaillées et mise à jour</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleExportPDF} className="bg-uh2c-blue hover:bg-uh2c-blue/90">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter PDF
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informations générales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-uh2c-blue" />
                      Informations Générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nomLaboratoire">Nom du laboratoire</Label>
                        <Input
                          id="nomLaboratoire"
                          value={formData.nomLaboratoire}
                          onChange={(e) => handleInputChange("nomLaboratoire", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="acronyme">Acronyme</Label>
                        <Input
                          id="acronyme"
                          value={formData.acronyme}
                          onChange={(e) => handleInputChange("acronyme", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="etablissement">Établissement de rattachement</Label>
                      <Input
                        id="etablissement"
                        value={formData.etablissement}
                        onChange={(e) => handleInputChange("etablissement", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateCreation">Date de création</Label>
                        <Input
                          id="dateCreation"
                          type="date"
                          value={formData.dateCreation}
                          max={getCurrentDate()}
                          onChange={(e) => handleInputChange("dateCreation", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="arretCreation">Arrêté de création</Label>
                        <Input
                          id="arretCreation"
                          value={formData.arretCreation}
                          onChange={(e) => handleInputChange("arretCreation", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Coordonnées */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-uh2c-blue" />
                      Coordonnées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adresse">Adresse</Label>
                      <Textarea
                        id="adresse"
                        value={formData.adresse}
                        onChange={(e) => handleInputChange("adresse", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                          id="telephone"
                          value={formData.telephone}
                          onChange={(e) => handleInputChange("telephone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fax">Fax</Label>
                        <Input
                          id="fax"
                          value={formData.fax}
                          onChange={(e) => handleInputChange("fax", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="siteWeb">Site web</Label>
                        <Input
                          id="siteWeb"
                          type="url"
                          value={formData.siteWeb}
                          onChange={(e) => handleInputChange("siteWeb", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Direction */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-uh2c-blue" />
                      Direction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="directeur">Directeur</Label>
                      <Input
                        id="directeur"
                        value={formData.directeur}
                        onChange={(e) => handleInputChange("directeur", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emailDirecteur">Email du directeur</Label>
                        <Input
                          id="emailDirecteur"
                          type="email"
                          value={formData.emailDirecteur}
                          onChange={(e) => handleInputChange("emailDirecteur", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephoneDirecteur">Téléphone du directeur</Label>
                        <Input
                          id="telephoneDirecteur"
                          value={formData.telephoneDirecteur}
                          onChange={(e) => handleInputChange("telephoneDirecteur", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activités de recherche */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activités de Recherche</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="domainesRecherche">Domaines de recherche</Label>
                      <Textarea
                        id="domainesRecherche"
                        value={formData.domainesRecherche}
                        onChange={(e) => handleInputChange("domainesRecherche", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="objectifs">Objectifs</Label>
                      <Textarea
                        id="objectifs"
                        value={formData.objectifs}
                        onChange={(e) => handleInputChange("objectifs", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projetsEnCours">Projets en cours</Label>
                      <Textarea
                        id="projetsEnCours"
                        value={formData.projetsEnCours}
                        onChange={(e) => handleInputChange("projetsEnCours", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Logo/Image */}
                <Card>
                  <CardHeader>
                    <CardTitle>Logo du laboratoire</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image src="/logo.png" alt="Logo laboratoire" width={120} height={120} className="rounded-lg" />
                      </div>
                      <Button variant="outline" size="sm">
                        Changer le logo
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistiques rapides */}
                <Card>
                  <CardHeader>
                    <CardTitle>Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Publications</span>
                      <span className="font-semibold">125</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Brevets</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Thèses</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Personnel</span>
                      <span className="font-semibold">28</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Ressources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ressources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="equipements">Équipements</Label>
                      <Textarea
                        id="equipements"
                        value={formData.equipements}
                        onChange={(e) => handleInputChange("equipements", e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget annuel</Label>
                      <Input
                        id="budget"
                        value={formData.budget}
                        onChange={(e) => handleInputChange("budget", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personnel">Personnel</Label>
                      <Textarea
                        id="personnel"
                        value={formData.personnel}
                        onChange={(e) => handleInputChange("personnel", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Partenariats et collaborations */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Partenariats et Collaborations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partenariats">Partenaires institutionnels</Label>
                  <Textarea
                    id="partenariats"
                    value={formData.partenariats}
                    onChange={(e) => handleInputChange("partenariats", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Production scientifique */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Production Scientifique</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publications">Publications</Label>
                    <Textarea
                      id="publications"
                      value={formData.publications}
                      onChange={(e) => handleInputChange("publications", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brevets">Brevets</Label>
                    <Textarea
                      id="brevets"
                      value={formData.brevets}
                      onChange={(e) => handleInputChange("brevets", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theses">Thèses</Label>
                  <Textarea
                    id="theses"
                    value={formData.theses}
                    onChange={(e) => handleInputChange("theses", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
