"use client"

import { useState, useEffect } from "react"
import { ShiftWeek, ShiftWeekStatus, Department, ShiftWeekFormData, ShiftWeekStatusType } from "@/types/api"
import { API_ROUTES, API_CONFIG } from "@/config/api"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ShiftWeekTable } from "@/components/shiftweek/shiftweek-table"
import { ShiftWeekDialog } from "@/components/shiftweek/shiftweek-dialog"

export default function ShiftWeekPage() {
  const [shiftWeeks, setShiftWeeks] = useState<ShiftWeek[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<ShiftWeekStatusType | "all">("all")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState<ShiftWeek | undefined>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [weeksResponse, departmentsResponse] = await Promise.all([
        fetch(API_ROUTES.SHIFT_WEEKS, API_CONFIG),
        fetch(API_ROUTES.DEPARTMENTS, API_CONFIG)
      ])

      const weeksResult = await weeksResponse.json()
      const departmentsResult = await departmentsResponse.json()

      setShiftWeeks(weeksResult.data)
      setDepartments(departmentsResult.data)
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWeek = async (data: ShiftWeekFormData) => {
    try {
      const response = await fetch(API_ROUTES.SHIFT_WEEKS, {
        ...API_CONFIG,
        method: 'POST',
        body: JSON.stringify(data)
      })
      if (response.ok) {
        await fetchData()
        setShowDialog(false)
      }
    } catch (error) {
      console.error('Fehler beim Erstellen:', error)
    }
  }

  const handleUpdateWeek = async (data: ShiftWeekFormData & { id: number }) => {
    try {
      const response = await fetch(`${API_ROUTES.SHIFT_WEEKS}/${data.id}`, {
        ...API_CONFIG,
        method: 'PUT',
        body: JSON.stringify(data)
      })
      if (response.ok) {
        await fetchData()
        setShowDialog(false)
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error)
    }
  }

  const handleDeleteWeek = async (week: ShiftWeek) => {
    try {
      const response = await fetch(`${API_ROUTES.SHIFT_WEEKS}/${week.id}`, {
        ...API_CONFIG,
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchData()
        setShowDialog(false)
        setSelectedWeek(undefined)
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
    }
  }

  const handleSubmit = (data: ShiftWeekFormData) => {
    if (selectedWeek) {
      handleUpdateWeek({ ...data, id: selectedWeek.id })
    } else {
      handleCreateWeek(data)
    }
  }

  const filteredWeeks = shiftWeeks.filter(week => {
    const matchesSearch = week.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || false
    const matchesDepartment = selectedDepartment === "all" || 
      week.department_id === Number(selectedDepartment)
    const matchesStatus = selectedStatus === "all" || 
      week.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Schichtwochen</h1>
        <Button onClick={() => setShowDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Schichtwoche hinzufügen</span>
          <span className="sm:hidden">Hinzufügen</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Schichtwochen suchen..."
          className="md:w-64"
        />
        <Select 
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
        >
          <SelectTrigger className="md:w-[200px]">
            <SelectValue placeholder="Abteilung wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Abteilungen</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept.id} value={dept.id.toString()}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={selectedStatus}
          onValueChange={(value: ShiftWeekStatusType | "all") => setSelectedStatus(value)}
        >
          <SelectTrigger className="md:w-[200px]">
            <SelectValue placeholder="Status wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value={ShiftWeekStatus.DRAFT}>Entwurf</SelectItem>
            <SelectItem value={ShiftWeekStatus.PUBLISHED}>Veröffentlicht</SelectItem>
            <SelectItem value={ShiftWeekStatus.ARCHIVED}>Archiviert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ShiftWeekTable 
        shiftWeeks={filteredWeeks}
        isLoading={loading}
        onEdit={(week) => {
          setSelectedWeek(week)
          setShowDialog(true)
        }}
        onDelete={handleDeleteWeek}
      />

      <ShiftWeekDialog
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false)
          setSelectedWeek(undefined)
        }}
        onSubmit={(data: ShiftWeekFormData) => handleSubmit(data)}
        departments={departments}
        initialData={selectedWeek}
      />
    </div>
  )
}