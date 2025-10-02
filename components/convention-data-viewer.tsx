"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  AlertCircle, 
  Edit, 
  Save, 
  X,
  DollarSign,
  Calendar,
  Users,
  FileText
} from "lucide-react"

interface ConventionDataViewerProps {
  data: any
  onSave: (data: any) => void
  onCancel: () => void
}

export function ConventionDataViewer({ data, onSave, onCancel }: ConventionDataViewerProps) {
  const [editingData, setEditingData] = useState(data)
  const [isEditing, setIsEditing] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSave = () => {
    onSave(editingData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditingData(data)
    setIsEditing(false)
  }

  const updateField = (path: string, value: any) => {
    const keys = path.split('.')
    const newData = { ...editingData }
    let current = newData
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setEditingData(newData)
  }

  const updateProjetField = (projetIndex: number, field: string, value: any) => {
    const newData = { ...editingData }
    newData.projets[projetIndex][field] = value
    setEditingData(newData)
  }

  const updateTrancheField = (projetIndex: number, trancheIndex: number, field: string, value: any) => {
    const newData = { ...editingData }
    newData.projets[projetIndex].tranches[trancheIndex][field] = value
    setEditingData(newData)
  }

  const updateUtilisationField = (projetIndex: number, utilisationIndex: number, field: string, value: any) => {
    const newData = { ...editingData }
    newData.projets[projetIndex].utilisationSubvention[utilisationIndex][field] = value
    setEditingData(newData)
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Données Extraites de la Convention</h2>
          <p className="text-gray-600 mt-1">Vérifiez et modifiez les données extraites si nécessaire</p>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Informations Générales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Programme</Label>
              {isEditing ? (
                <Input
                  value={editingData.programme}
                  onChange={(e) => updateField('programme', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium mt-1">{editingData.programme}</p>
              )}
            </div>
            
            <div>
              <Label>ID Convention</Label>
              {isEditing ? (
                <Input
                  value={editingData.conventionId}
                  onChange={(e) => updateField('conventionId', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium mt-1">{editingData.conventionId}</p>
              )}
            </div>
            
            <div>
              <Label>Date de Création</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editingData.dateCreation}
                  onChange={(e) => updateField('dateCreation', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium mt-1">{new Date(editingData.dateCreation).toLocaleDateString('fr-FR')}</p>
              )}
            </div>
            
            <div>
              <Label>Budget Total</Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editingData.budgetTotal}
                  onChange={(e) => updateField('budgetTotal', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium mt-1">{formatCurrency(editingData.budgetTotal)}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <Label>Modalité de Versement</Label>
              {isEditing ? (
                <Textarea
                  value={editingData.modaliteVersement}
                  onChange={(e) => updateField('modaliteVersement', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-600 mt-1">{editingData.modaliteVersement}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Projets Inclus ({editingData.projets?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {editingData.projets?.map((projet: any, projetIndex: number) => (
              <div key={projetIndex} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg">Projet {projetIndex + 1}</h4>
                  <Badge variant="outline">{projet.porteur}</Badge>
                </div>
                
                {/* Informations du projet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Titre du Projet</Label>
                    {isEditing ? (
                      <Input
                        value={projet.titre}
                        onChange={(e) => updateProjetField(projetIndex, 'titre', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium mt-1">{projet.titre}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Porteur de Projet</Label>
                    {isEditing ? (
                      <Input
                        value={projet.porteur}
                        onChange={(e) => updateProjetField(projetIndex, 'porteur', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium mt-1">{projet.porteur}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Budget Proposé</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={projet.budgetPropose}
                        onChange={(e) => updateProjetField(projetIndex, 'budgetPropose', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium mt-1">{formatCurrency(projet.budgetPropose)}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Budget Définitif</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={projet.budgetDefinitif}
                        onChange={(e) => updateProjetField(projetIndex, 'budgetDefinitif', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium mt-1">{formatCurrency(projet.budgetDefinitif)}</p>
                    )}
                  </div>
                </div>

                {/* Tranches de budget */}
                <div className="mb-4">
                  <Label className="text-sm font-medium">Tranches de Budget</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    {projet.tranches?.map((tranche: any, trancheIndex: number) => (
                      <div key={trancheIndex} className="border rounded p-3">
                        <div className="font-medium text-sm mb-2">Tranche {tranche.numero}</div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              type="number"
                              placeholder="Montant définitif"
                              value={tranche.montantDefinitif}
                              onChange={(e) => updateTrancheField(projetIndex, trancheIndex, 'montantDefinitif', parseFloat(e.target.value) || 0)}
                              className="text-xs"
                            />
                            <Input
                              type="date"
                              value={tranche.dateVersement}
                              onChange={(e) => updateTrancheField(projetIndex, trancheIndex, 'dateVersement', e.target.value)}
                              className="text-xs"
                            />
                          </div>
                        ) : (
                          <div className="text-xs space-y-1">
                            <div>Définitif: {formatCurrency(tranche.montantDefinitif)}</div>
                            <div>Date: {new Date(tranche.dateVersement).toLocaleDateString('fr-FR')}</div>
                            <div className="text-gray-500">{tranche.pourcentage}%</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Utilisation de la subvention */}
                <div>
                  <Label className="text-sm font-medium">Utilisation de la Subvention</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {projet.utilisationSubvention?.map((utilisation: any, utilisationIndex: number) => (
                      <div key={utilisationIndex} className="border rounded p-3">
                        <div className="font-medium text-sm mb-2">{utilisation.rubrique}</div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              type="number"
                              placeholder="Montant"
                              value={utilisation.montant}
                              onChange={(e) => updateUtilisationField(projetIndex, utilisationIndex, 'montant', parseFloat(e.target.value) || 0)}
                              className="text-xs"
                            />
                            <Input
                              placeholder="Description"
                              value={utilisation.description}
                              onChange={(e) => updateUtilisationField(projetIndex, utilisationIndex, 'description', e.target.value)}
                              className="text-xs"
                            />
                          </div>
                        ) : (
                          <div className="text-xs space-y-1">
                            <div>{formatCurrency(utilisation.montant)} ({utilisation.pourcentage}%)</div>
                            <div className="text-gray-500">{utilisation.description}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Résumé et validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Résumé et Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{editingData.nombreProjets}</div>
              <div className="text-sm text-gray-600">Projets Inclus</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(editingData.budgetTotal)}</div>
              <div className="text-sm text-gray-600">Budget Total</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{editingData.nombreTranches}</div>
              <div className="text-sm text-gray-600">Tranches de Versement</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <div className="font-medium text-yellow-800">Note importante</div>
                <div className="text-sm text-yellow-700 mt-1">
                  Le budget définitif des projets peut ne pas correspondre au budget proposé par le porteur de projet. 
                  Les montants des tranches peuvent également être ajustés selon les besoins du programme.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 