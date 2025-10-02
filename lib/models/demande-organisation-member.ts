//model DemandeOrganisation
export interface DemandeOrganisation{
  id: string,

  intitule: string,
  type: "Colloque" | "journée d’étude" | "séminaire" | "atelier",
  lieu: string,
  dateDebut: string,
  dateFin: string,

  nomPrenomCoordinateur: string,
  nomsEnseignantsOrganisateursUh2c: string[],
  statutIndexation: "EnCours" | "Obtenu", 
  partenaires: string,
  publicCible: string[],
  
  resume: string,
  justificatifs: string[]
}



