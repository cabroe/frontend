"use client"

import { useState, useEffect } from "react"
import { Shift, Department, Employee } from "@/types/api"
import { API_ROUTES, API_CONFIG } from "@/config/api"
import { Button } from "@/components/ui/button"
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/calendar/calendar"

export default function CalendarPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedShift, setSelectedShift] = useState<Shift | undefined>()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [shiftsResponse, shiftTypesResponse, departmentsResponse, employeesResponse] = await Promise.all([
        fetch(`${API_ROUTES.SHIFT_WEEKS}?month=${format(currentDate, 'yyyy-MM')}`, API_CONFIG),
        fetch(API_ROUTES.SHIFTTYPES, API_CONFIG),
        fetch(API_ROUTES.DEPARTMENTS, API_CONFIG),
        fetch(API_ROUTES.EMPLOYEES, API_CONFIG)
      ])

      const [shiftsResult, shiftTypesResult, departmentsResult, employeesResult] = await Promise.all([
        shiftsResponse.json(),
        shiftTypesResponse.json(),
        departmentsResponse.json(),
        employeesResponse.json()
      ])

      setShifts(shiftsResult.data)
      setShifts(shiftTypesResult.data)
      setDepartments(departmentsResult.data)
      setEmployees(employeesResult.data)
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    } finally {
      setLoading(false)
    }
  }
  
  interface ShiftFormData {
    [key: string]: any;
  }

  const handleCreateShift = async (data: ShiftFormData) => {
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
  const handleUpdateShift = async (data: ShiftFormData & { id: number }) => {
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
  const handleDeleteShift = async (shift: Shift) => {
    try {
      const response = await fetch(`${API_ROUTES.SHIFT_WEEKS}/${shift.id}`, {
        ...API_CONFIG,
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchData()
        setShowDialog(false)
        setSelectedShift(undefined)
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
    }
  }

  const handleSubmit = (data: ShiftFormData) => {
    if (selectedShift) {
      handleUpdateShift({ ...data, id: selectedShift.id })
    } else {
      handleCreateShift(data)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        // Setze auf den ersten Tag des vorherigen Monats
        newDate.setMonth(newDate.getMonth() - 1, 1)
      } else {
        // Setze auf den ersten Tag des nächsten Monats
        newDate.setMonth(newDate.getMonth() + 1, 1)
      }
      return newDate
    })
  }

  const filteredShifts = shifts.filter(shift => {
    const matchesDepartment = selectedDepartment === "all" || 
      shift.department_id === Number(selectedDepartment)

    return matchesDepartment
  })

  const calendarProps = {
    shifts: filteredShifts,
    employees: employees,
    isLoading: loading,
    currentDate: currentDate,
    viewMode: viewMode,
    onEdit: (shift: Shift) => {
      setSelectedShift(shift);
      setShowDialog(true);
    },
    onDelete: handleDeleteShift
  };

  if (loading) {
    return <div className="p-6">Lade Kalender...</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Kalender</h1>
        <Button onClick={() => setShowDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Schicht hinzufügen</span>
          <span className="sm:hidden">Hinzufügen</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[150px] text-center font-medium">
            {format(currentDate, 'MMMM yyyy', { locale: de })}
          </span>
          <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={viewMode}
          onValueChange={(value: 'month' | 'week' | 'day' | 'quartal') => setViewMode(value)}
        >
          <SelectTrigger className="md:w-[200px]">
            <SelectValue placeholder="Ansicht wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quartal">Quartal</SelectItem>
            <SelectItem value="month">Monat</SelectItem>
            <SelectItem value="week">Woche</SelectItem>
            <SelectItem value="day">Tag</SelectItem>
          </SelectContent>
        </Select>

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
          value={selectedEmployee}
          onValueChange={setSelectedEmployee}
        >
          <SelectTrigger className="md:w-[200px]">
            <SelectValue placeholder="Mitarbeiter wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Mitarbeiter</SelectItem>
            {employees.map((employee) => (
              <SelectItem 
                key={employee.id} 
                value={employee.id.toString()}
              >
                {employee.first_name} {employee.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <Calendar {...calendarProps} />
      </div>
    </div>
  )
}