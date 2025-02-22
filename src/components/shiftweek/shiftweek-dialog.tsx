"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Department, ShiftWeek, ShiftWeekFormData, ShiftWeekStatus, ShiftWeekStatusType } from "@/types/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ShiftWeekDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ShiftWeekFormData) => void  // Now using imported type
  departments: Department[]
  initialData?: ShiftWeek
}

function getCurrentCalendarWeek(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime()
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  return Math.ceil((diff + start.getDay() + 1) / oneWeek)
}

export function ShiftWeekDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  departments,
  initialData 
}: ShiftWeekDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ShiftWeekFormData>({
    defaultValues: {
      calendar_week: getCurrentCalendarWeek(),
      year: new Date().getFullYear(),
      department_id: 0,
      status: ShiftWeekStatus.DRAFT as ShiftWeekStatusType,  // Explicit type casting
      notes: ''
    }
  })
  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: ShiftWeekFormData) => {
    onSubmit(data)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Schichtwoche bearbeiten' : 'Neue Schichtwoche'}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Bearbeiten Sie die Daten der bestehenden Schichtwoche.' 
              : 'Erfassen Sie die Daten der neuen Schichtwoche.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calendar_week">Kalenderwoche</Label>
              <Input 
                id="calendar_week"
                type="number"
                min={1}
                max={53}
                {...register('calendar_week', { 
                  required: 'KW ist erforderlich',
                  min: { value: 1, message: 'KW muss zwischen 1 und 53 liegen' },
                  max: { value: 53, message: 'KW muss zwischen 1 und 53 liegen' }
                })} 
              />
              {errors.calendar_week && (
                <span className="text-sm text-red-500">{errors.calendar_week.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Jahr</Label>
              <Input 
                id="year"
                type="number"
                min={2024}
                max={2030}
                {...register('year', { 
                  required: 'Jahr ist erforderlich',
                  min: { value: 2024, message: 'Jahr muss größer als 2023 sein' }
                })} 
              />
              {errors.year && (
                <span className="text-sm text-red-500">{errors.year.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Abteilung</Label>
            <Select 
              onValueChange={(value) => setValue('department_id', Number(value))}
              value={watch('department_id')?.toString()}
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
            {errors.department_id && (
              <span className="text-sm text-red-500">{errors.department_id.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              onValueChange={(value: ShiftWeekStatusType) => setValue('status', value)}
              value={watch('status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ShiftWeekStatus.DRAFT}>Entwurf</SelectItem>
                <SelectItem value={ShiftWeekStatus.PUBLISHED}>Veröffentlicht</SelectItem>
                <SelectItem value={ShiftWeekStatus.ARCHIVED}>Archiviert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notizen</Label>
            <Input 
              id="notes"
              {...register('notes')}
              placeholder="Optionale Notizen zur Schichtwoche"
            />
          </div>

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
  )
}