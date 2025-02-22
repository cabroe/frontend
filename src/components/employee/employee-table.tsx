"use client"

import { useState } from 'react'
import { PREDEFINED_COLORS } from '@/lib/colors'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Employee } from "@/types/api"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface EmployeeTableProps {
  employees: Employee[]
  getDepartmentName: (departmentId: number) => string
  getDepartmentColor: (departmentId: number) => string
  onEdit: (employee: Employee) => void
  onDelete?: (employee: Employee) => void
}

export function EmployeeTable({ employees, getDepartmentName, getDepartmentColor, onEdit, onDelete }: EmployeeTableProps) {
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)

  const getColorLabel = (colorValue: string) => {
    const color = PREDEFINED_COLORS.find(c => c.value === colorValue)
    return color?.label || colorValue
  }

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee)
  }

  const handleDeleteConfirm = () => {
    if (employeeToDelete && onDelete) {
      onDelete(employeeToDelete)
      setEmployeeToDelete(null)
    }
  }

  return (
    <>
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Abteilung</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Farbe</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={`employee-${employee.id}`}>
                <TableCell className="font-medium">
                  {employee.first_name} {employee.last_name}
                </TableCell>
                <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                <TableCell>
                  {employee.department_id ? (
                    <Badge 
                      label={getDepartmentName(employee.department_id)}
                      color={getDepartmentColor(employee.department_id)}
                    />
                  ) : (
                    <span className="text-gray-400"></span>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {employee.is_admin ? (
                    <div className="flex items-center gap-2">
                      <Badge label="Mitarbeiter" color="#16a34a" />
                      <Badge label="Admin" color="#2563eb" />
                    </div>
                  ) : (
                    <Badge label="Mitarbeiter" color="#16a34a" />
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge 
                    label={getColorLabel(employee.color)}
                    color={employee.color}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(employee)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!employeeToDelete} onOpenChange={() => setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mitarbeiter löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diesen Mitarbeiter wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
