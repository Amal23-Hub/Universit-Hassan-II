"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { DemandeOrganisation } from "./models/demande-organisation-member";

  





//interface stateM DemandesOrganisation
interface OrganisationContextType{
    demandesOrganisation: DemandeOrganisation[],
    addDemandeOrganisation: (demandeOrganisation: DemandeOrganisation) => void,
    updateDemandeOrganisation: (id:string, updates: Partial<DemandeOrganisation>) => void,
    deleteDemandeOrganisation: (id: string) => void
}



//variable Context
const OrganisationContext = createContext<OrganisationContextType | undefined>(undefined)



//service StateM DemandesOrganisation
export function OrganisationProvider({children} : {children: ReactNode}){
    const [demandesOrganisation, setDemandesOrganisation] = useState<DemandeOrganisation[]>([])


    // ✅ Charger les données depuis localStorage au démarrage
    useEffect(() => {
        const savedData=localStorage.getItem('demandesOrganisation')
        if(savedData){
            setDemandesOrganisation(JSON.parse(savedData))
        }
    }, [])
    // ✅ Sauvegarder dans localStorage à chaque changement
    useEffect(() => {
        if(demandesOrganisation.length>0){
            try {
                localStorage.setItem('demandesOrganisation', JSON.stringify(demandesOrganisation))
            } catch (error) {
                console.error('DATA vide:', error)
            }
        }
    }, [demandesOrganisation])


    const addDemandeOrganisation = (demandeOrganisation: DemandeOrganisation) => {
        setDemandesOrganisation(prev => [...prev, demandeOrganisation])
    }

    const updateDemandeOrganisation = (id:string, updates: Partial<DemandeOrganisation>) => {
        setDemandesOrganisation(prev => 
            prev.map(demande => demande.id===id ? {...demande, ...updates} : demande)
        )
    
    const deleteDemandeOrganisation = (id: string) => {
        setDemandesOrganisation(prev =>
            prev.filter(demande => demande.id!=id)
        )
    }

    return(
        <OrganisationContext.Provider value={{
            demandesOrganisation,
            addDemandeOrganisation,
            updateDemandeOrganisation,
            deleteDemandeOrganisation
        }}>

            {children}

        </OrganisationContext.Provider>
    )

}

}



//front fonction useState
export function useOrganisation(){
    const context=useContext(OrganisationContext)
    if(context==undefined){
        console.log("useOrganisation doit être utilisé avec providerOrganisation!")
    }

    return context
}