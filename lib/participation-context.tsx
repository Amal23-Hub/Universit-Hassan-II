"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { DemandeParticipation } from '@/lib/demandes-participations-member'



interface ParticipationContextType {
  demandesParticipations: DemandeParticipation[]
  addDemandeParticipation: (demande: DemandeParticipation) => void
  updateDemandeParticipation: (id: string, updates: Partial<DemandeParticipation>) => void
  deleteDemandeParticipation: (id: string) => void
}

const ParticipationContext = createContext<ParticipationContextType | undefined>(undefined)




export function ParticipationProvider({ children }: { children: ReactNode }) {
  const [demandesParticipations, setDemandesParticipations] = useState<DemandeParticipation[]>([])



  // ✅ Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedData = localStorage.getItem('demandesParticipations')
    if (savedData) {
      try {
        setDemandesParticipations(JSON.parse(savedData))
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    }
  }, [])
  // ✅ Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (demandesParticipations.length > 0) {
      localStorage.setItem('demandesParticipations', JSON.stringify(demandesParticipations))
    }
  }, [demandesParticipations])



  const addDemandeParticipation = (demande: DemandeParticipation) => {
    console.log('➕ Ajout de demande:', demande)
    setDemandesParticipations(prev => [...prev, demande])
  }

  const updateDemandeParticipation = (id: string, updates: Partial<DemandeParticipation>) => {
    setDemandesParticipations(prev => 
      prev.map(demande => demande.id === id ? { ...demande, ...updates } : demande)
    )
  }

  const deleteDemandeParticipation = (id: string) => {
    setDemandesParticipations(prev => prev.filter(demande => demande.id !== id))
  }

  return (
    <ParticipationContext.Provider value={{
      demandesParticipations,
      addDemandeParticipation,
      updateDemandeParticipation,
      deleteDemandeParticipation
    }}>

      {children}

    </ParticipationContext.Provider>
    
  
  )
}



export function useParticipation() {
  const context = useContext(ParticipationContext)
  if (context === undefined) {
    throw new Error('useParticipation must be used within a ParticipationProvider')
  }
  return context
}