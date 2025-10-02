// Service d'extraction automatique des données PDF
// Note: En production, utilisez une bibliothèque comme pdf-parse ou pdf2json

export interface ExtractedConventionData {
  programme: string
  conventionId: string
  dateCreation: string
  budgetTotal: number
  nombreProjets: number
  nombreTranches: number
  modaliteVersement: string
  projets: ExtractedProjet[]
}

export interface ExtractedProjet {
  titre: string
  porteur: string
  budgetPropose: number
  budgetDefinitif: number
  tranches: ExtractedTranche[]
  utilisationSubvention: ExtractedUtilisation[]
}

export interface ExtractedTranche {
  numero: number
  montantPropose: number
  montantDefinitif: number
  dateVersement: string
  pourcentage: number
}

export interface ExtractedUtilisation {
  rubrique: string
  montant: number
  pourcentage: number
  description: string
}

export class PDFExtractor {
  /**
   * Extrait les données clés d'un fichier PDF de convention
   */
  static async extractConventionData(file: File): Promise<ExtractedConventionData> {
    try {
      // En production, utilisez une vraie bibliothèque PDF
      // Pour cet exemple, nous simulons l'extraction
      
      const text = await this.readPDFAsText(file)
      return this.parseConventionText(text)
    } catch (error) {
      console.error('Erreur lors de l\'extraction PDF:', error)
      throw new Error('Impossible d\'extraire les données du PDF')
    }
  }

  /**
   * Lit le contenu texte d'un PDF
   */
  private static async readPDFAsText(file: File): Promise<string> {
    // Simulation de lecture PDF
    // En production, utilisez pdf-parse ou similaire
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        // Simulation du contenu extrait
        resolve(`
          CONVENTION DE RECHERCHE
          Programme National de Recherche en Intelligence Artificielle
          
          CONVENTION N°: CONV-2024-001
          DATE: 15 janvier 2024
          
          BUDGET TOTAL ALLOUÉ: 8.500.000 MAD
          
          MODALITÉ DE VERSEMENT:
          Versement en 3 tranches :
          - 40% à la signature de la convention (3.400.000 MAD)
          - 30% à mi-parcours (2.550.000 MAD)
          - 30% à la fin du projet (2.550.000 MAD)
          
          PROJETS RETENUS:
          
          1. PROJET: IA pour la santé préventive
             PORTEUR: Dr. Ahmed Benali
             BUDGET PROPOSÉ: 450.000 MAD
             BUDGET DÉFINITIF: 420.000 MAD
             
             TRANCHES:
             - Tranche 1: 168.000 MAD (40%) - Date: 15/02/2024
             - Tranche 2: 126.000 MAD (30%) - Date: 15/08/2024
             - Tranche 3: 126.000 MAD (30%) - Date: 15/02/2025
             
             UTILISATION DE LA SUBVENTION:
             - Personnel: 168.000 MAD (40%) - Salaires chercheurs et assistants
             - Équipements: 126.000 MAD (30%) - Matériel informatique et logiciels
             - Fonctionnement: 84.000 MAD (20%) - Frais de déplacement et consommables
             - Autres: 42.000 MAD (10%) - Frais divers et imprévus
        `)
      }
      reader.readAsText(file)
    })
  }

  /**
   * Parse le texte extrait pour en déduire les données structurées
   */
  private static parseConventionText(text: string): ExtractedConventionData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    // Extraction des informations générales
    const programme = this.extractProgramme(lines)
    const conventionId = this.extractConventionId(lines)
    const dateCreation = this.extractDateCreation(lines)
    const budgetTotal = this.extractBudgetTotal(lines)
    const modaliteVersement = this.extractModaliteVersement(lines)
    const projets = this.extractProjets(lines)

    return {
      programme,
      conventionId,
      dateCreation,
      budgetTotal,
      nombreProjets: projets.length,
      nombreTranches: 3, // Par défaut
      modaliteVersement,
      projets
    }
  }

  private static extractProgramme(lines: string[]): string {
    const programmeLine = lines.find(line => line.includes('Programme'))
    if (programmeLine) {
      return programmeLine.replace('Programme', '').trim()
    }
    return 'Programme non spécifié'
  }

  private static extractConventionId(lines: string[]): string {
    const idLine = lines.find(line => line.includes('CONVENTION N°:'))
    if (idLine) {
      return idLine.split(':')[1]?.trim() || 'N/A'
    }
    return 'N/A'
  }

  private static extractDateCreation(lines: string[]): string {
    const dateLine = lines.find(line => line.includes('DATE:'))
    if (dateLine) {
      return dateLine.split(':')[1]?.trim() || new Date().toISOString().split('T')[0]
    }
    return new Date().toISOString().split('T')[0]
  }

  private static extractBudgetTotal(lines: string[]): number {
    const budgetLine = lines.find(line => line.includes('BUDGET TOTAL ALLOUÉ:'))
    if (budgetLine) {
      const match = budgetLine.match(/(\d+(?:\.\d+)?)\s*MAD/)
      if (match) {
        return parseFloat(match[1].replace('.', ''))
      }
    }
    return 0
  }

  private static extractModaliteVersement(lines: string[]): string {
    const startIndex = lines.findIndex(line => line.includes('MODALITÉ DE VERSEMENT:'))
    if (startIndex !== -1) {
      const modaliteLines = []
      for (let i = startIndex + 1; i < lines.length; i++) {
        if (lines[i].includes('PROJETS RETENUS:')) break
        if (lines[i].length > 0) {
          modaliteLines.push(lines[i])
        }
      }
      return modaliteLines.join(' ')
    }
    return 'Modalité non spécifiée'
  }

  private static extractProjets(lines: string[]): ExtractedProjet[] {
    const projets: ExtractedProjet[] = []
    const projetSections = this.splitProjetSections(lines)
    
    for (const section of projetSections) {
      const projet = this.parseProjetSection(section)
      if (projet) {
        projets.push(projet)
      }
    }
    
    return projets
  }

  private static splitProjetSections(lines: string[]): string[][] {
    const sections: string[][] = []
    let currentSection: string[] = []
    
    for (const line of lines) {
      if (line.match(/^\d+\.\s*PROJET:/)) {
        if (currentSection.length > 0) {
          sections.push(currentSection)
        }
        currentSection = [line]
      } else if (currentSection.length > 0) {
        currentSection.push(line)
      }
    }
    
    if (currentSection.length > 0) {
      sections.push(currentSection)
    }
    
    return sections
  }

  private static parseProjetSection(section: string[]): ExtractedProjet | null {
    try {
      const titre = this.extractProjetTitre(section[0])
      const porteur = this.extractProjetPorteur(section)
      const budgetPropose = this.extractBudgetPropose(section)
      const budgetDefinitif = this.extractBudgetDefinitif(section)
      const tranches = this.extractTranches(section)
      const utilisationSubvention = this.extractUtilisationSubvention(section)

      return {
        titre,
        porteur,
        budgetPropose,
        budgetDefinitif,
        tranches,
        utilisationSubvention
      }
    } catch (error) {
      console.error('Erreur parsing projet:', error)
      return null
    }
  }

  private static extractProjetTitre(line: string): string {
    const match = line.match(/PROJET:\s*(.+)/)
    return match ? match[1].trim() : 'Titre non spécifié'
  }

  private static extractProjetPorteur(section: string[]): string {
    const porteurLine = section.find(line => line.includes('PORTEUR:'))
    if (porteurLine) {
      return porteurLine.split(':')[1]?.trim() || 'Porteur non spécifié'
    }
    return 'Porteur non spécifié'
  }

  private static extractBudgetPropose(section: string[]): number {
    const budgetLine = section.find(line => line.includes('BUDGET PROPOSÉ:'))
    if (budgetLine) {
      const match = budgetLine.match(/(\d+(?:\.\d+)?)\s*MAD/)
      if (match) {
        return parseFloat(match[1].replace('.', ''))
      }
    }
    return 0
  }

  private static extractBudgetDefinitif(section: string[]): number {
    const budgetLine = section.find(line => line.includes('BUDGET DÉFINITIF:'))
    if (budgetLine) {
      const match = budgetLine.match(/(\d+(?:\.\d+)?)\s*MAD/)
      if (match) {
        return parseFloat(match[1].replace('.', ''))
      }
    }
    return 0
  }

  private static extractTranches(section: string[]): ExtractedTranche[] {
    const tranches: ExtractedTranche[] = []
    const trancheStartIndex = section.findIndex(line => line.includes('TRANCHES:'))
    
    if (trancheStartIndex !== -1) {
      for (let i = trancheStartIndex + 1; i < section.length; i++) {
        const line = section[i]
        if (line.includes('UTILISATION DE LA SUBVENTION:')) break
        
        const tranche = this.parseTrancheLine(line)
        if (tranche) {
          tranches.push(tranche)
        }
      }
    }
    
    return tranches
  }

  private static parseTrancheLine(line: string): ExtractedTranche | null {
    const match = line.match(/Tranche (\d+):\s*(\d+(?:\.\d+)?)\s*MAD\s*\((\d+)%\)\s*-\s*Date:\s*(\d{2}\/\d{2}\/\d{4})/)
    if (match) {
      return {
        numero: parseInt(match[1]),
        montantPropose: parseFloat(match[2].replace('.', '')),
        montantDefinitif: parseFloat(match[2].replace('.', '')), // Même montant pour l'exemple
        dateVersement: match[4],
        pourcentage: parseInt(match[3])
      }
    }
    return null
  }

  private static extractUtilisationSubvention(section: string[]): ExtractedUtilisation[] {
    const utilisations: ExtractedUtilisation[] = []
    const utilisationStartIndex = section.findIndex(line => line.includes('UTILISATION DE LA SUBVENTION:'))
    
    if (utilisationStartIndex !== -1) {
      for (let i = utilisationStartIndex + 1; i < section.length; i++) {
        const line = section[i]
        if (line.match(/^\d+\.\s*PROJET:/)) break
        
        const utilisation = this.parseUtilisationLine(line)
        if (utilisation) {
          utilisations.push(utilisation)
        }
      }
    }
    
    return utilisations
  }

  private static parseUtilisationLine(line: string): ExtractedUtilisation | null {
    const match = line.match(/-\s*([^:]+):\s*(\d+(?:\.\d+)?)\s*MAD\s*\((\d+)%\)\s*-\s*(.+)/)
    if (match) {
      return {
        rubrique: match[1].trim(),
        montant: parseFloat(match[2].replace('.', '')),
        pourcentage: parseInt(match[3]),
        description: match[4].trim()
      }
    }
    return null
  }

  /**
   * Valide les données extraites
   */
  static validateExtractedData(data: ExtractedConventionData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    if (!data.programme || data.programme === 'Programme non spécifié') {
      errors.push('Programme non trouvé dans le PDF')
    }
    
    if (!data.budgetTotal || data.budgetTotal <= 0) {
      errors.push('Budget total invalide ou manquant')
    }
    
    if (!data.projets || data.projets.length === 0) {
      errors.push('Aucun projet trouvé dans le PDF')
    }
    
    for (const projet of data.projets) {
      if (!projet.titre || projet.titre === 'Titre non spécifié') {
        errors.push(`Titre manquant pour un projet`)
      }
      
      if (!projet.porteur || projet.porteur === 'Porteur non spécifié') {
        errors.push(`Porteur manquant pour le projet: ${projet.titre}`)
      }
      
      if (!projet.budgetDefinitif || projet.budgetDefinitif <= 0) {
        errors.push(`Budget définitif invalide pour le projet: ${projet.titre}`)
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
} 