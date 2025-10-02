"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DivisionRechercheSidebar } from "@/components/division-recherche-sidebar"
import { Header } from "@/components/header"
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  Users,
  BarChart3,
  Search,
  Filter,
  X,
  XCircle
} from "lucide-react"
import jsPDF from 'jspdf'

interface ConventionData {
  id: string
  programme: string
  dateCreation: string
  statut: "draft" | "final" | "signed"
  budgetTotal: number
  nombreProjets: number
  nombreTranches: number
  modaliteVersement: string
  projets: ProjetConvention[]
}

interface ProjetConvention {
  id: string
  titre: string
  porteur: string
  budgetPropose: number
  budgetDefinitif: number
  tranches: TrancheBudget[]
  utilisationSubvention: UtilisationSubvention[]
}

interface TrancheBudget {
  numero: number
  montantPropose: number
  montantDefinitif: number
  dateVersement: string
  statut: "pending" | "paid" | "overdue"
}

interface UtilisationSubvention {
  rubrique: string
  montant: number
  pourcentage: number
  description: string
}

export default function ConventionsPage() {
  const [conventions, setConventions] = useState<ConventionData[]>([
    {
      id: "CONV-2024-001",
      programme: "Programme National de Recherche en IA",
      dateCreation: "2024-01-15",
      statut: "final",
      budgetTotal: 8500000,
      nombreProjets: 12,
      nombreTranches: 3,
      modaliteVersement: "Versement en 3 tranches : 40% à la signature, 30% à mi-parcours, 30% à la fin",
      projets: [
        {
          id: "PROJ-001",
          titre: "IA pour la santé préventive",
          porteur: "Dr. Ahmed Benali",
          budgetPropose: 450000,
          budgetDefinitif: 420000,
          tranches: [
            { numero: 1, montantPropose: 180000, montantDefinitif: 168000, dateVersement: "2024-02-15", statut: "paid" },
            { numero: 2, montantPropose: 135000, montantDefinitif: 126000, dateVersement: "2024-08-15", statut: "pending" },
            { numero: 3, montantPropose: 135000, montantDefinitif: 126000, dateVersement: "2025-02-15", statut: "pending" }
          ],
          utilisationSubvention: [
            { rubrique: "Personnel", montant: 168000, pourcentage: 40, description: "Salaires chercheurs et assistants" },
            { rubrique: "Équipements", montant: 126000, pourcentage: 30, description: "Matériel informatique et logiciels" },
            { rubrique: "Fonctionnement", montant: 84000, pourcentage: 20, description: "Frais de déplacement et consommables" },
            { rubrique: "Autres", montant: 42000, pourcentage: 10, description: "Frais divers et imprévus" }
          ]
        },
        {
          id: "PROJ-002",
          titre: "Cybersécurité avancée",
          porteur: "Dr. Fatima El Mansouri",
          budgetPropose: 320000,
          budgetDefinitif: 300000,
          tranches: [
            { numero: 1, montantPropose: 128000, montantDefinitif: 120000, dateVersement: "2024-02-15", statut: "paid" },
            { numero: 2, montantPropose: 96000, montantDefinitif: 90000, dateVersement: "2024-08-15", statut: "pending" },
            { numero: 3, montantPropose: 96000, montantDefinitif: 90000, dateVersement: "2025-02-15", statut: "pending" }
          ],
          utilisationSubvention: [
            { rubrique: "Personnel", montant: 120000, pourcentage: 40, description: "Salaires chercheurs" },
            { rubrique: "Équipements", montant: 90000, pourcentage: 30, description: "Serveurs et équipements réseau" },
            { rubrique: "Fonctionnement", montant: 60000, pourcentage: 20, description: "Licences et maintenance" },
            { rubrique: "Autres", montant: 30000, pourcentage: 10, description: "Frais divers" }
          ]
        }
      ]
    },
    {
      id: "CONV-2024-002",
      programme: "Programme Énergies Renouvelables et Développement Durable",
      dateCreation: "2024-02-20",
      statut: "signed",
      budgetTotal: 12000000,
      nombreProjets: 8,
      nombreTranches: 4,
      modaliteVersement: "Versement en 4 tranches : 25% à la signature, 25% à mi-parcours, 25% à 75% d'avancement, 25% à la fin",
      projets: [
        {
          id: "PROJ-003",
          titre: "Optimisation des panneaux solaires nouvelle génération",
          porteur: "Dr. Karim Alami",
          budgetPropose: 680000,
          budgetDefinitif: 650000,
          tranches: [
            { numero: 1, montantPropose: 170000, montantDefinitif: 162500, dateVersement: "2024-03-20", statut: "paid" },
            { numero: 2, montantPropose: 170000, montantDefinitif: 162500, dateVersement: "2024-09-20", statut: "pending" },
            { numero: 3, montantPropose: 170000, montantDefinitif: 162500, dateVersement: "2025-03-20", statut: "pending" },
            { numero: 4, montantPropose: 170000, montantDefinitif: 162500, dateVersement: "2025-09-20", statut: "pending" }
          ],
          utilisationSubvention: [
            { rubrique: "Personnel", montant: 195000, pourcentage: 30, description: "Salaires chercheurs et techniciens" },
            { rubrique: "Équipements", montant: 260000, pourcentage: 40, description: "Panneaux solaires et équipements de test" },
            { rubrique: "Fonctionnement", montant: 130000, pourcentage: 20, description: "Frais de laboratoire et consommables" },
            { rubrique: "Autres", montant: 65000, pourcentage: 10, description: "Frais divers et imprévus" }
          ]
        },
        {
          id: "PROJ-004",
          titre: "Éoliennes offshore pour le littoral marocain",
          porteur: "Dr. Sara El Harti",
          budgetPropose: 520000,
          budgetDefinitif: 500000,
          tranches: [
            { numero: 1, montantPropose: 130000, montantDefinitif: 125000, dateVersement: "2024-03-20", statut: "paid" },
            { numero: 2, montantPropose: 130000, montantDefinitif: 125000, dateVersement: "2024-09-20", statut: "pending" },
            { numero: 3, montantPropose: 130000, montantDefinitif: 125000, dateVersement: "2025-03-20", statut: "pending" },
            { numero: 4, montantPropose: 130000, montantDefinitif: 125000, dateVersement: "2025-09-20", statut: "pending" }
          ],
          utilisationSubvention: [
            { rubrique: "Personnel", montant: 150000, pourcentage: 30, description: "Salaires chercheurs spécialisés" },
            { rubrique: "Équipements", montant: 200000, pourcentage: 40, description: "Modèles d'éoliennes et capteurs" },
            { rubrique: "Fonctionnement", montant: 100000, pourcentage: 20, description: "Frais de simulation et tests" },
            { rubrique: "Autres", montant: 50000, pourcentage: 10, description: "Frais divers" }
          ]
        },
        {
          id: "PROJ-005",
          titre: "Biomasse et valorisation des déchets agricoles",
          porteur: "Dr. Youssef Benjelloun",
          budgetPropose: 380000,
          budgetDefinitif: 360000,
          tranches: [
            { numero: 1, montantPropose: 95000, montantDefinitif: 90000, dateVersement: "2024-03-20", statut: "paid" },
            { numero: 2, montantPropose: 95000, montantDefinitif: 90000, dateVersement: "2024-09-20", statut: "pending" },
            { numero: 3, montantPropose: 95000, montantDefinitif: 90000, dateVersement: "2025-03-20", statut: "pending" },
            { numero: 4, montantPropose: 95000, montantDefinitif: 90000, dateVersement: "2025-09-20", statut: "pending" }
          ],
          utilisationSubvention: [
            { rubrique: "Personnel", montant: 108000, pourcentage: 30, description: "Salaires chercheurs en biologie" },
            { rubrique: "Équipements", montant: 144000, pourcentage: 40, description: "Réacteurs et équipements de fermentation" },
            { rubrique: "Fonctionnement", montant: 72000, pourcentage: 20, description: "Substrats et réactifs" },
            { rubrique: "Autres", montant: 36000, pourcentage: 10, description: "Frais divers" }
          ]
        }
      ]
    },
    {
      id: "CONV-2024-003",
      programme: "Programme Biotechnologie et Santé",
      dateCreation: "2024-03-10",
      statut: "draft",
      budgetTotal: 6500000,
      nombreProjets: 6,
      nombreTranches: 3,
      modaliteVersement: "Versement en 3 tranches : 50% à la signature, 30% à mi-parcours, 20% à la fin",
      projets: [
        {
          id: "PROJ-006",
          titre: "Thérapie génique pour maladies rares",
          porteur: "Dr. Leila Mansouri",
          budgetPropose: 420000,
          budgetDefinitif: 400000,
          tranches: [
            { numero: 1, montantPropose: 210000, montantDefinitif: 200000, dateVersement: "2024-04-10", statut: "pending" },
            { numero: 2, montantPropose: 126000, montantDefinitif: 120000, dateVersement: "2024-10-10", statut: "pending" },
            { numero: 3, montantPropose: 84000, montantDefinitif: 80000, dateVersement: "2025-04-10", statut: "pending" }
          ],
          utilisationSubvention: [
            { rubrique: "Personnel", montant: 160000, pourcentage: 40, description: "Salaires chercheurs en génétique" },
            { rubrique: "Équipements", montant: 120000, pourcentage: 30, description: "Équipements de séquençage et PCR" },
            { rubrique: "Fonctionnement", montant: 80000, pourcentage: 20, description: "Réactifs et consommables" },
            { rubrique: "Autres", montant: 40000, pourcentage: 10, description: "Frais divers" }
          ]
        },
        {
          id: "PROJ-007",
          titre: "Nanomédicaments pour le traitement du cancer",
          porteur: "Dr. Omar Tazi",
          budgetPropose: 380000,
          budgetDefinitif: 360000,
          tranches: [
            { numero: 1, montantPropose: 190000, montantDefinitif: 180000, dateVersement: "2024-04-10", statut: "pending" },
            { numero: 2, montantPropose: 114000, montantDefinitif: 108000, dateVersement: "2024-10-10", statut: "pending" },
            { numero: 3, montantPropose: 76000, montantDefinitif: 72000, dateVersement: "2025-04-10", statut: "pending" }
          ],
          utilisationSubvention: [
            { rubrique: "Personnel", montant: 144000, pourcentage: 40, description: "Salaires chercheurs en nanotechnologie" },
            { rubrique: "Équipements", montant: 108000, pourcentage: 30, description: "Microscopes électroniques et équipements" },
            { rubrique: "Fonctionnement", montant: 72000, pourcentage: 20, description: "Réactifs et cellules de culture" },
            { rubrique: "Autres", montant: 36000, pourcentage: 10, description: "Frais divers" }
          ]
        },
        {
          id: "PROJ-008",
          titre: "Biocapteurs pour diagnostic précoce",
          porteur: "Dr. Amina Benjelloun",
          budgetPropose: 280000,
          budgetDefinitif: 260000,
          tranches: [
            { numero: 1, montantPropose: 140000, montantDefinitif: 130000, dateVersement: "2024-04-10", statut: "pending" },
            { numero: 2, montantPropose: 84000, montantDefinitif: 78000, dateVersement: "2024-10-10", statut: "pending" },
            { numero: 3, montantPropose: 56000, montantDefinitif: 52000, dateVersement: "2025-04-10", statut: "pending" }
          ],
          utilisationSubvention: [
            { rubrique: "Personnel", montant: 104000, pourcentage: 40, description: "Salaires chercheurs en biotechnologie" },
            { rubrique: "Équipements", montant: 78000, pourcentage: 30, description: "Équipements de détection et capteurs" },
            { rubrique: "Fonctionnement", montant: 52000, pourcentage: 20, description: "Réactifs et échantillons" },
            { rubrique: "Autres", montant: 26000, pourcentage: 10, description: "Frais divers" }
          ]
        }
      ]
    }
  ])

  const [selectedConvention, setSelectedConvention] = useState<ConventionData | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (statut: string) => {
    const config = {
      draft: { label: "Signée", color: "bg-green-100 text-green-800" },
      final: { label: "Final", color: "bg-blue-100 text-blue-800" },
      signed: { label: "Signée", color: "bg-green-100 text-green-800" }
    }
    const configItem = config[statut as keyof typeof config]
    return (
      <Badge className={configItem.color}>
        {configItem.label}
      </Badge>
    )
  }



  const downloadConvention = (convention: ConventionData) => {
    // Création du PDF avec jsPDF
    const doc = new jsPDF()
    
    // Configuration des couleurs
    const primaryColor = [0, 0, 0] // Noir pour un style simple
    const secondaryColor = [100, 100, 100] // Gris foncé
    
    // Fonction pour dessiner une ligne horizontale
    const drawLine = (y: number) => {
      doc.setDrawColor(200, 200, 200)
      doc.line(20, y, 190, y)
    }
    
    // Fonction pour ajouter un titre de section
    const addSectionTitle = (title: string, y: number) => {
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
      doc.text(title, 20, y)
      drawLine(y + 2)
      return y + 6
    }
    
    // En-tête avec bordure
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.5)
    doc.rect(15, 15, 180, 20)
    
    // Titre principal
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text('CONVENTION DE RECHERCHE', 105, 23, { align: 'center' })
    
    // Programme
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    doc.text(convention.programme, 105, 30, { align: 'center' })
    
    let yPosition = 45
    
    // Section Informations Générales
    yPosition = addSectionTitle('INFORMATIONS GÉNÉRALES', yPosition)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    
    // Informations en colonnes
    doc.text(`Convention N°: ${convention.id}`, 25, yPosition)
    doc.text(`Date: ${new Date(convention.dateCreation).toLocaleDateString('fr-FR')}`, 120, yPosition)
    yPosition += 6
    
    doc.text(`Budget Total: ${formatCurrency(convention.budgetTotal)}`, 25, yPosition)
    doc.text(`Nombre de Projets: ${convention.nombreProjets}`, 120, yPosition)
    yPosition += 8
    
    // Modalité de versement
    doc.setFont('helvetica', 'bold')
    doc.text('Modalité de Versement:', 25, yPosition)
    yPosition += 4
    
    doc.setFont('helvetica', 'normal')
    const modaliteLines = doc.splitTextToSize(convention.modaliteVersement, 150)
    doc.text(modaliteLines, 25, yPosition)
    yPosition += modaliteLines.length * 4 + 8
    
    // Section Projets
    yPosition = addSectionTitle('PROJETS RETENUS', yPosition)
    
    convention.projets.forEach((projet, index) => {
      // Vérifier si on doit passer à la page suivante
      if (yPosition > 260) {
        doc.addPage()
        yPosition = 20
      }
      
      // Encadré pour chaque projet
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.2)
      doc.rect(20, yPosition - 3, 170, 45)
      
      // Titre du projet
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text(`${index + 1}. ${projet.titre}`, 25, yPosition)
      yPosition += 5
      
      // Informations du projet
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text(`Porteur: ${projet.porteur}`, 30, yPosition)
      yPosition += 4
      
      doc.text(`Budget Proposé: ${formatCurrency(projet.budgetPropose)}`, 30, yPosition)
      doc.text(`Budget Définitif: ${formatCurrency(projet.budgetDefinitif)}`, 120, yPosition)
      yPosition += 6
      
      // Tranches de budget
      doc.setFont('helvetica', 'bold')
      doc.text('Tranches:', 30, yPosition)
      yPosition += 4
      doc.setFont('helvetica', 'normal')
      
      projet.tranches.forEach(tranche => {
        doc.text(`• Tranche ${tranche.numero}: ${formatCurrency(tranche.montantDefinitif)} (${new Date(tranche.dateVersement).toLocaleDateString('fr-FR')})`, 35, yPosition)
        yPosition += 3
      })
      yPosition += 3
      
      // Utilisation de la subvention
      doc.setFont('helvetica', 'bold')
      doc.text('Utilisation:', 30, yPosition)
      yPosition += 4
      doc.setFont('helvetica', 'normal')
      
      projet.utilisationSubvention.forEach(rubrique => {
        doc.text(`• ${rubrique.rubrique}: ${formatCurrency(rubrique.montant)} (${rubrique.pourcentage}%)`, 35, yPosition)
        yPosition += 3
        const descLines = doc.splitTextToSize(`  ${rubrique.description}`, 120)
        doc.text(descLines, 35, yPosition)
        yPosition += descLines.length * 3
      })
      
      yPosition += 8
    })
    
    // Section Récapitulatif
    if (yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }
    
    yPosition = addSectionTitle('RÉCAPITULATIF DES PROJETS', yPosition)
    
    // Tableau simple
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Projet', 25, yPosition)
    doc.text('Porteur', 70, yPosition)
    doc.text('Budget Proposé', 120, yPosition)
    doc.text('Budget Définitif', 160, yPosition)
    yPosition += 4
    
    drawLine(yPosition)
    yPosition += 4
    
    doc.setFont('helvetica', 'normal')
    convention.projets.forEach((projet, index) => {
      if (yPosition > 260) {
        doc.addPage()
        yPosition = 20
      }
      
      // Titre du projet (tronqué si nécessaire)
      const titreLines = doc.splitTextToSize(projet.titre, 40)
      doc.text(titreLines, 25, yPosition)
      
      // Porteur
      const porteurLines = doc.splitTextToSize(projet.porteur, 40)
      doc.text(porteurLines, 70, yPosition)
      
      // Budgets
      doc.text(formatCurrency(projet.budgetPropose), 120, yPosition)
      doc.text(formatCurrency(projet.budgetDefinitif), 160, yPosition)
      
      yPosition += Math.max(titreLines.length, porteurLines.length) * 3 + 2
    })
    
    // Signature
    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }
    
    yPosition = addSectionTitle('SIGNATURE', yPosition)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Directeur Division Recherche:', 25, yPosition)
    doc.text('_________________', 80, yPosition)
    yPosition += 8
    
    doc.text('Date:', 25, yPosition)
    doc.text(new Date().toLocaleDateString('fr-FR'), 80, yPosition)
    yPosition += 8
    
    doc.text('Cachet:', 25, yPosition)
    doc.text('_________________', 80, yPosition)
    
    // Pied de page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(7)
      doc.setTextColor(150, 150, 150)
      doc.text(`Page ${i} sur ${pageCount}`, 105, 290, { align: 'center' })
    }
    
    // Téléchargement du PDF
    doc.save(`convention-${convention.id}.pdf`)
  }



  return (
    <div className="flex h-screen bg-gray-50">
      <DivisionRechercheSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-3">
          <div className="mx-auto max-w-5xl">
            {/* En-tête simplifié */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gestion des Conventions</h1>
                </div>
              </div>
            </div>

            {/* Statistiques compactes */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Conventions</p>
                      <p className="text-lg font-bold">{conventions.length}</p>
                    </div>
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-600 mb-1">Budget Total</p>
                      <p className="text-lg font-bold truncate">{formatCurrency(conventions.reduce((sum, c) => sum + c.budgetTotal, 0))}</p>
                    </div>
                    <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0 ml-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Projets Inclus</p>
                      <p className="text-lg font-bold">{conventions.reduce((sum, c) => sum + c.nombreProjets, 0)}</p>
                    </div>
                    <Users className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Conventions Signées</p>
                      <p className="text-lg font-bold">{conventions.filter(c => c.statut === "signed").length}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-20">
                <CardContent className="p-3 h-full flex items-center">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Rejetés</p>
                      <p className="text-lg font-bold">9</p>
                    </div>
                    <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Barre de recherche */}
            <div className="mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une convention..."
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>

            {/* Liste des conventions */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Conventions Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {conventions.map((convention, index) => (
                    <div 
                      key={convention.id} 
                      className={`p-4 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate text-sm">
                                {convention.programme}
                              </h3>
                            </div>
                            {getStatusBadge(convention.statut)}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">ID:</span>
                              <span className="font-medium text-gray-700">{convention.id}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Date:</span>
                              <span className="font-medium text-gray-700">
                                {new Date(convention.dateCreation).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Budget:</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(convention.budgetTotal)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">Projets:</span>
                              <span className="font-medium text-blue-600">
                                {convention.nombreProjets}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedConvention(convention)}
                            className="h-8 px-2 text-xs hover:bg-blue-100 hover:text-blue-700"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Détails
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadConvention(convention)}
                            className="h-8 px-2 text-xs hover:bg-green-100 hover:text-green-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Convention
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modal de détails simplifié */}
          {selectedConvention && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold">Détails de la Convention</h2>
                      <p className="text-sm text-gray-600">{selectedConvention.programme}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedConvention(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Informations générales */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Informations Générales</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs font-medium">Programme</Label>
                          <p className="font-medium">{selectedConvention.programme}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Statut</Label>
                          <div className="mt-1">{getStatusBadge(selectedConvention.statut)}</div>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Budget Total</Label>
                          <p className="font-medium">{formatCurrency(selectedConvention.budgetTotal)}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium">Modalité de Versement</Label>
                          <p className="text-xs text-gray-600">{selectedConvention.modaliteVersement}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Projets inclus */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Projets Inclus ({selectedConvention.projets.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {selectedConvention.projets.map((projet, index) => (
                          <div key={projet.id} className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{projet.titre}</h4>
                              <Badge variant="outline" className="text-xs">{projet.porteur}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-2 text-xs">
                              <div>
                                <span className="text-gray-600">Budget Proposé:</span>
                                <span className="ml-1 font-medium">{formatCurrency(projet.budgetPropose)}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Budget Définitif:</span>
                                <span className="ml-1 font-medium text-blue-600">{formatCurrency(projet.budgetDefinitif)}</span>
                              </div>
                            </div>

                            {/* Tranches de budget */}
                            <div className="mb-2">
                              <Label className="text-xs font-medium">Tranches de Budget</Label>
                              <div className="grid grid-cols-3 gap-2 mt-1">
                                {projet.tranches.map((tranche) => (
                                  <div key={tranche.numero} className="bg-gray-50 rounded p-2 text-xs">
                                    <div className="font-medium">Tranche {tranche.numero}</div>
                                    <div>Définitif: {formatCurrency(tranche.montantDefinitif)}</div>
                                    <div className="text-gray-500">{new Date(tranche.dateVersement).toLocaleDateString('fr-FR')}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Utilisation de la subvention */}
                            <div>
                              <Label className="text-xs font-medium">Utilisation de la Subvention</Label>
                              <div className="grid grid-cols-2 gap-2 mt-1">
                                {projet.utilisationSubvention.map((rubrique, index) => (
                                  <div key={index} className="bg-blue-50 rounded p-2 text-xs">
                                    <div className="font-medium">{rubrique.rubrique}</div>
                                    <div>{formatCurrency(rubrique.montant)} ({rubrique.pourcentage}%)</div>
                                    <div className="text-gray-600">{rubrique.description}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}


        </main>
      </div>
    </div>
  )
} 