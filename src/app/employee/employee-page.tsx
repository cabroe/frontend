"use client"

import { useEffect, useState } from 'react'
import { Employee, Department } from "@/types/api"
import { API_ROUTES, API_CONFIG } from "@/config/api"
import { EmployeeTable } from "@/components/employee/employee-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { EmployeeDialog } from "@/components/employee/employee-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EmployeeFormData {
  id?: number
  first_name: string
  last_name: string
  email: string
  department_id: number | null
  color: string
  password?: string
  is_admin: boolean
  created_at?: string
  updated_at?: string
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [showDialog, setShowDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [employeesResponse, departmentsResponse] = await Promise.all([
        fetch(API_ROUTES.EMPLOYEES, API_CONFIG),
        fetch(API_ROUTES.DEPARTMENTS, API_CONFIG)
      ])

      const employeesResult = await employeesResponse.json()
      const departmentsResult = await departmentsResponse.json()

      setEmployees(employeesResult.data)
      setDepartments(departmentsResult.data)
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmployee = async (data: EmployeeFormData) => {
    try {
      const response = await fetch(API_ROUTES.EMPLOYEES, {
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

  const handleUpdateEmployee = async (data: EmployeeFormData & { id: number }) => {
    try {
      const response = await fetch(`${API_ROUTES.EMPLOYEES}/${data.id}`, {
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

  const handleDeleteEmployee = async (employee: Employee) => {
    try {
      const response = await fetch(`${API_ROUTES.EMPLOYEES}/${employee.id}`, {
        ...API_CONFIG,
        method: 'DELETE'
      })
      if (response.ok) {
        fetchData()
        setShowDialog(false)
        setSelectedEmployee(undefined)
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
    }
  }

  const handleSubmit = (data: EmployeeFormData) => {
    if (selectedEmployee) {
      handleUpdateEmployee({ ...data, id: selectedEmployee.id })
    } else {
      handleCreateEmployee(data)
    }
    setShowDialog(false)
    setSelectedEmployee(undefined)
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (
      employee.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    const matchesDepartment = selectedDepartment === "all" || 
      employee.department_id === Number(selectedDepartment)

    return matchesSearch && matchesDepartment
  })

  if (loading) {
    return <div className="p-6">Lade Mitarbeiterdaten...</div>
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Mitarbeiter</h1>
        <Button onClick={() => setShowDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Mitarbeiter hinzufügen</span>
          <span className="sm:hidden">Hinzufügen</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Mitarbeiter suchen..."
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
      </div>

      <EmployeeTable 
        employees={filteredEmployees}
        getDepartmentName={(id) => departments.find(d => d.id === id)?.name || ''}
        getDepartmentColor={(id) => departments.find(d => d.id === id)?.color || '#000000'}
        onEdit={(employee) => {
          setSelectedEmployee(employee)
          setShowDialog(true)
        }}
        onDelete={handleDeleteEmployee}
      />

      <EmployeeDialog 
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false)
          setSelectedEmployee(undefined)
        }}
        onSubmit={handleSubmit}
        onDelete={handleDeleteEmployee}
        initialData={selectedEmployee}
        departments={departments}
      />
    </div>
  )
}