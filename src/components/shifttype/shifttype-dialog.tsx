"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { PREDEFINED_COLORS } from '@/lib/colors'
import { ShiftType } from "@/types/api"

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_COLORS.length)
  return PREDEFINED_COLORS[randomIndex].value
}

interface TimeOption {
  value: string
  label: string
}

const generateTimeOptions = (
  intervalMinutes: number = 30,  // Auf 30 Minuten geändert
  includeEndOfDay: boolean = true,
  format: (time: string) => string = (time) => `${time} Uhr`
): TimeOption[] => {
  const options: TimeOption[] = []
  const minutesInDay = 24 * 60
  
  for (let minutes = 0; minutes < minutesInDay; minutes += intervalMinutes) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    const timeValue = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    
    options.push({
      value: timeValue,
      label: format(timeValue)
    })
  }

  if (includeEndOfDay) {
    options.push({
      value: '23:59',
      label: format('23:59')
    })
  }

  return options
}

interface ShiftTypeFormData {
  name: string
  description: string
  color: string
  start_time: string
  end_time: string
}

interface ShiftTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ShiftTypeFormData) => void
  onDelete?: (shiftType: ShiftType) => Promise<void>
  initialData?: ShiftType
}

export function ShiftTypeDialog({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData 
}: ShiftTypeDialogProps) {
  const timeOptions = generateTimeOptions()
  
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ShiftTypeFormData>({
    defaultValues: {
      name: '',
      description: '',
      color: getRandomColor(),
      start_time: initialData?.start_time?.substring(0, 5) || '00:00',
      end_time: initialData?.end_time?.substring(0, 5) || '00:00'
    }
  })

  useEffect(() => {
    if (initialData) {
      const formData = {
        ...initialData,
        start_time: initialData.start_time?.substring(0, 5) || '00:00',
        end_time: initialData.end_time?.substring(0, 5) || '00:00'
      }
      reset(formData)
    } else {
      reset({
        name: '',
        description: '',
        color: getRandomColor(),
        start_time: '00:00',
        end_time: '00:00'
      })
    }
  }, [initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: ShiftTypeFormData) => {
    const submitData = {
      ...data,
      name: data.name.trim(),
      description: data.description.trim(),
      start_time: data.start_time.substring(0, 5),
      end_time: data.end_time.substring(0, 5)
    }
    onSubmit(submitData)
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Schichttyp bearbeiten' : 'Neuer Schichttyp'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Bearbeiten Sie die Daten des bestehenden Schichttyps.' 
              : 'Erfassen Sie die Daten des neuen Schichttyps.'}
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
            <Label htmlFor="start_time">Startzeit</Label>
            <select
              id="start_time"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              {...register('start_time', { required: 'Startzeit ist erforderlich' })}
            >
              {timeOptions.map(option => (
                <option key={`start-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.start_time && (
              <span className="text-sm text-red-500">{errors.start_time.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_time">Endzeit</Label>
            <select
              id="end_time"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              {...register('end_time', { required: 'Endzeit ist erforderlich' })}
            >
              {timeOptions.map(option => (
                <option key={`end-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.end_time && (
              <span className="text-sm text-red-500">{errors.end_time.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Farbe</Label>
            <ColorPicker 
              value={initialData?.color || watch('color') || '#000000'}
              onChange={(color) => setValue('color', color)}
            />
            {!watch('color') && (
              <span className="text-sm text-red-500">Farbe ist erforderlich</span>
            )}
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
