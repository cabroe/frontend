"use client"

import { useEffect, useState } from 'react'
import { API_ROUTES, API_CONFIG } from "@/config/api"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { ShiftTypeDialog } from "@/components/shifttype/shifttype-dialog"
import { ShiftTypeTable } from "@/components/shifttype/shifttype-table"
import { ShiftType } from "@/types/api"

interface ShiftTypeFormData {
  id?: number
  name: string
  description: string
  color: string
  start_time: string
  end_time: string
}

export default function ShiftTypePage() {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedShiftType, setSelectedShiftType] = useState<ShiftType | undefined>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch(API_ROUTES.SHIFTTYPES, API_CONFIG)
      const result = await response.json()
      setShiftTypes(result.data)
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShiftType = async (data: ShiftTypeFormData) => {
    try {
      const response = await fetch(API_ROUTES.SHIFTTYPES, {
        ...API_CONFIG,
        method: 'POST',
        body: JSON.stringify(data)
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Fehler beim Erstellen:', error)
    }
  }

  const handleUpdateShiftType = async (data: ShiftTypeFormData & { id: number }) => {
    try {
      const response = await fetch(`${API_ROUTES.SHIFTTYPES}/${data.id}`, {
        ...API_CONFIG,
        method: 'PUT',
        body: JSON.stringify(data)
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error)
    }
  }

  const handleDeleteShiftType = async (shiftType: ShiftType) => {
    try {
      const response = await fetch(`${API_ROUTES.SHIFTTYPES}/${shiftType.id}`, {
        ...API_CONFIG,
        method: 'DELETE'
      })
      if (response.ok) {
        fetchData()
        setShowDialog(false)
        setSelectedShiftType(undefined)
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
    }
  }

  const handleSubmit = (data: ShiftTypeFormData) => {
    if (selectedShiftType) {
      handleUpdateShiftType({ ...data, id: selectedShiftType.id })
    } else {
      handleCreateShiftType(data)
    }
    setShowDialog(false)
    setSelectedShiftType(undefined)
  }

  const filteredShiftTypes = shiftTypes.filter(shiftType => 
    shiftType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shiftType.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="p-6">Lade Schichttypen...</div>
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Schichttypen</h1>
        <Button onClick={() => setShowDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Schichttyp hinzufügen</span>
          <span className="sm:hidden">Hinzufügen</span>
        </Button>
      </div>

      <div className="mb-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Schichttyp suchen..."
          className="md:w-64"
        />
      </div>

      <ShiftTypeTable 
        shiftTypes={filteredShiftTypes}
        onEdit={(shiftType) => {
          setSelectedShiftType(shiftType)
          setShowDialog(true)
        }}
        onDelete={handleDeleteShiftType}
      />

      <ShiftTypeDialog 
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false)
          setSelectedShiftType(undefined)
        }}
        onSubmit={handleSubmit}
        onDelete={handleDeleteShiftType}
        initialData={selectedShiftType}
      />
    </div>
  )
}
