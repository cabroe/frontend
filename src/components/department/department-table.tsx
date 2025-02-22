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
import { Department } from "@/types/api"
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

interface DepartmentTableProps {
  departments: Department[]
  onEdit: (department: Department) => void
  onDelete?: (department: Department) => void
}

export function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null)

  const handleDeleteClick = (department: Department) => {
    setDepartmentToDelete(department)
  }

  const handleDeleteConfirm = () => {
    if (departmentToDelete) {
      onDelete?.(departmentToDelete)
      setDepartmentToDelete(null)
    }
  }

  const getColorLabel = (colorValue: string) => {
    const color = PREDEFINED_COLORS.find(c => c.value === colorValue)
    return color?.label || colorValue
  }

  return (
    <>
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Beschreibung</TableHead>
              <TableHead className="hidden md:table-cell">Mitarbeiter</TableHead>
              <TableHead className="hidden lg:table-cell">Farbe</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={`department-${department.id}`}>
                <TableCell className="font-medium">
                  {department.name}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {department.description || "-"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {department.employees?.length || 0} Mitarbeiter
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge 
                    label={getColorLabel(department.color)}
                    color={department.color}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(department)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(department)}>
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

      <AlertDialog open={!!departmentToDelete} onOpenChange={() => setDepartmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Abteilung löschen</AlertDialogTitle>
            <AlertDialogDescription>
              {departmentToDelete?.employees?.length 
                ? `Diese Abteilung enthält noch ${departmentToDelete.employees.length} Mitarbeiter. Beim Löschen werden die Mitarbeiter von der Abteilung getrennt.`
                : 'Möchten Sie diese Abteilung wirklich löschen?'}
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
