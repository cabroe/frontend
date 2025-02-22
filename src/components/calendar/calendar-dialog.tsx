"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Department, ShiftType, Shift, CalendarFormData } from "@/types/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ShiftFormData {
  date: string
  shift_type_id: number
  department_id: number
  employee_id: number
  notes?: string
}

interface CalendarDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CalendarFormData) => void
  onDelete?: (shift: Shift) => void
  initialData?: Shift
  departments: Department[]
  shiftTypes: ShiftType[]
}

export function CalendarDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete,
  initialData, 
  departments,
  shiftTypes
}: CalendarDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ShiftFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      shift_type_id: 0,
      department_id: 0,
      employee_id: 0,  // Neue Zeile
      notes: ''
    }
  })

  useEffect(() => {
    if (initialData) {
      reset({
        date: initialData.date,
        shift_type_id: initialData.shift_type_id,
        department_id: initialData.department_id,
        employee_id: initialData.employee_id,  // Neue Zeile
        notes: initialData.notes || ''
      })
    } else {
      reset({
        date: new Date().toISOString().split('T')[0],
        shift_type_id: 0,
        department_id: 0, 
        employee_id: 0,  // Neue Zeile
        notes: ''
      })
    }
  }, [initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: ShiftFormData) => {
    onSubmit({
      date: data.date,
      shift_type_id: data.shift_type_id,
      employee_id: data.employee_id,
      department_id: data.department_id,
      notes: data.notes?.trim()  // Saubere Notizverarbeitung
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Schicht bearbeiten' : 'Neue Schicht'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Bearbeiten Sie die Details der bestehenden Schicht.' 
              : 'Erfassen Sie die Details der neuen Schicht.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Datum</Label>
            <Input 
              id="date" 
              type="date"
              {...register('date', { required: 'Datum ist erforderlich' })} 
            />
            {errors.date && (
              <span className="text-sm text-red-500">{errors.date.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shift_type_id">Schichttyp</Label>
            <Select
              value={watch('shift_type_id').toString()}
              onValueChange={(value) => setValue('shift_type_id', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Schichttyp wählen" />
              </SelectTrigger>
              <SelectContent>
                {shiftTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!watch('shift_type_id') && (
              <span className="text-sm text-red-500">Schichttyp ist erforderlich</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department_id">Abteilung</Label>
            <Select
              value={watch('department_id').toString()}
              onValueChange={(value) => setValue('department_id', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Abteilung wählen" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!watch('department_id') && (
              <span className="text-sm text-red-500">Abteilung ist erforderlich</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notizen</Label>
            <Input 
              id="notes" 
              {...register('notes')} 
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Abbrechen
            </Button>
            {initialData && onDelete && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => onDelete(initialData)}
              >
                Löschen
              </Button>
            )}
            <Button type="submit">
              Speichern
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
