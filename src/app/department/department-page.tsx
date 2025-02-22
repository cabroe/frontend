"use client"

import { useEffect, useState } from 'react'
import { Department, Employee, DepartmentFormData } from "@/types/api"
import { API_ROUTES, API_CONFIG } from "@/config/api"
import { DepartmentTable } from "@/components/department/department-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { DepartmentDialog } from "@/components/department/department-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [departmentsResponse, employeesResponse] = await Promise.all([
        fetch(API_ROUTES.DEPARTMENTS, API_CONFIG),
        fetch(API_ROUTES.EMPLOYEES, API_CONFIG)
      ])

      const departmentsResult = await departmentsResponse.json()
      const employeesResult = await employeesResponse.json()

      setDepartments(departmentsResult.data)
      setEmployees(employeesResult.data)
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDepartment = async (data: DepartmentFormData) => {
    try {
      const response = await fetch(API_ROUTES.DEPARTMENTS, {
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

  const handleUpdateDepartment = async (data: DepartmentFormData & { id: number }) => {
    try {
      const response = await fetch(`${API_ROUTES.DEPARTMENTS}/${data.id}`, {
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

  const handleDeleteDepartment = async (department: Department) => {
    try {
      const response = await fetch(`${API_ROUTES.DEPARTMENTS}/${department.id}`, {
        ...API_CONFIG,
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchData()
        setShowDialog(false)
        setSelectedDepartment(undefined)
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
    }
  }

  const handleDeleteEmployee = async (employeeId: number) => {
    try {
      const response = await fetch(`${API_ROUTES.EMPLOYEES}/${employeeId}`, {
        ...API_CONFIG,
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Mitarbeiters:', error)
    }
  }

  const handleSubmit = (data: DepartmentFormData) => {
    if (selectedDepartment) {
      handleUpdateDepartment({ ...data, id: selectedDepartment.id })
    } else {
      handleCreateDepartment(data)
    }
  }

  const filteredDepartments = departments.filter(department => {
    const matchesSearch = (
      department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      department.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    const matchesEmployee = selectedEmployee === "all" || 
      department.employees?.some(emp => emp.id === Number(selectedEmployee))

    return matchesSearch && matchesEmployee
  })

  if (loading) {
    return <div className="p-6">Lade Abteilungen...</div>
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Abteilungen</h1>
        <Button onClick={() => setShowDialog(true)} className="shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Abteilung hinzufügen</span>
          <span className="sm:hidden">Hinzufügen</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Abteilungen suchen..."
          className="md:w-64"
        />
        <Select
          value={selectedEmployee}
          onValueChange={setSelectedEmployee}
        >
          <SelectTrigger className="md:w-[200px]">
            <SelectValue placeholder="Nach Mitarbeiter filtern" />
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

      <div className="rounded-md border">
        <DepartmentTable 
          departments={filteredDepartments}
          onEdit={(department) => {
            setSelectedDepartment(department)
            setShowDialog(true)
          }}
          onDelete={handleDeleteDepartment}
        />
      </div>

      <DepartmentDialog 
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false)
          setSelectedDepartment(undefined)
        }}
        onSubmit={handleSubmit}
        initialData={selectedDepartment}
        employees={employees}
        onDeleteEmployee={handleDeleteEmployee}
      />
    </div>
  )
}