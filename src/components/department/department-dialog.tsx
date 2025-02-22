"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { Department, Employee, DepartmentFormData } from "@/types/api"
import { PREDEFINED_COLORS } from '@/lib/colors'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2, UserPlus } from "lucide-react"
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

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_COLORS.length)
  return PREDEFINED_COLORS[randomIndex].value
}

interface DepartmentDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DepartmentFormData) => void
  onDeleteEmployee: (employeeId: number) => Promise<void>
  initialData?: Department
  employees?: Employee[]
}

export function DepartmentDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDeleteEmployee,
  initialData, 
  employees = []
}: DepartmentDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<DepartmentFormData>({
    defaultValues: {
      name: '',
      color: getRandomColor(),
      description: '',
      employee_ids: []
    }
  })

  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)

  const departmentEmployees = useMemo(() => {
    if (!initialData?.id) return []
    return employees.filter(emp => emp.department_id === initialData.id)
  }, [employees, initialData?.id])

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        employee_ids: departmentEmployees.map(emp => emp.id)
      })
    } else {
      reset({
        name: '',
        color: getRandomColor(),
        description: '',
        employee_ids: []
      })
    }
  }, [initialData, departmentEmployees, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: DepartmentFormData) => {
    onSubmit({
      ...data,
      name: data.name.trim(),
      description: data.description.trim()
    })
  }

  const handleDeleteEmployeeClick = (employee: Employee) => {
    setEmployeeToDelete(employee)
  }

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        await onDeleteEmployee(employeeToDelete.id)
        
        // Aktualisiere die employee_ids im Formular
        const updatedEmployeeIds = departmentEmployees
          .filter(emp => emp.id !== employeeToDelete.id)
          .map(emp => emp.id)
        
        setValue('employee_ids', updatedEmployeeIds)
      } catch (error) {
        console.error('Fehler beim Entfernen des Mitarbeiters:', error)
        alert('Der Mitarbeiter konnte nicht entfernt werden. Bitte versuchen Sie es später erneut.')
      }
      setEmployeeToDelete(null)
    }
  }

  return (
    <>
      <AlertDialog open={!!employeeToDelete} onOpenChange={() => setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mitarbeiter aus Abteilung entfernen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie den Mitarbeiter {employeeToDelete?.first_name} {employeeToDelete?.last_name} wirklich aus dieser Abteilung entfernen?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Entfernen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{initialData ? 'Abteilung bearbeiten' : 'Neue Abteilung'}</DialogTitle>
            <DialogDescription>
              {initialData 
                ? 'Bearbeiten Sie die Daten der bestehenden Abteilung.' 
                : 'Erfassen Sie die Daten der neuen Abteilung.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                {...register('name', { 
                  required: 'Name ist erforderlich',
                  minLength: { value: 2, message: 'Name muss mindestens 2 Zeichen lang sein' }
                })} 
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Input 
                id="description" 
                {...register('description', { 
                  required: 'Beschreibung ist erforderlich'
                })} 
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Farbe</Label>
              <ColorPicker 
                value={watch('color') || '#000000'}
                onChange={(color) => setValue('color', color)}
              />
              {!watch('color') && (
                <span className="text-sm text-red-500">Farbe ist erforderlich</span>
              )}
            </div>

            {initialData && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Mitarbeiter ({departmentEmployees.length})</Label>
                </div>

                {departmentEmployees.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead className="hidden md:table-cell">Email</TableHead>
                          <TableHead className="w-[100px] text-center">Aktionen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departmentEmployees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell className="font-medium">
                              {employee.first_name} {employee.last_name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {employee.email}
                            </TableCell>
                            <TableCell className="flex justify-center items-center">
                              <Button
                                type="button"
                                variant="ghost"                                
                                size="sm"
                                onClick={() => handleDeleteEmployeeClick(employee)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>                        
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/50">
                    <UserPlus className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Keine Mitarbeiter in dieser Abteilung
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Abbrechen
              </Button>
              <Button type="submit">
                Speichern
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}