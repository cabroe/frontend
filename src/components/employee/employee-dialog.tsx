"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ColorPicker } from "@/components/ui/color-picker"
import { DepartmentField } from "./employee-department-field"
import { Department, Employee } from "@/types/api"
import { PREDEFINED_COLORS } from '@/lib/colors'

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * PREDEFINED_COLORS.length)
  return PREDEFINED_COLORS[randomIndex].value
}

interface EmployeeFormData {
  id?: number
  first_name: string
  last_name: string
  email: string
  department_id: number | null
  color: string
  password?: string
  is_admin: boolean
}

interface EmployeeDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => void
  onDelete?: (employee: Employee) => Promise<void>
  initialData?: Employee
  departments: Department[]
}

export function EmployeeDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  departments 
}: EmployeeDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<EmployeeFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      department_id: null,
      color: getRandomColor(),
      is_admin: false
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    } else {
      reset({
        first_name: '',
        last_name: '',
        email: '',
        department_id: null,
        color: getRandomColor(),
        is_admin: false
      })
    }
  }, [initialData, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: EmployeeFormData) => {
    onSubmit({
      ...data,
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      email: data.email.trim().toLowerCase(),
      department_id: data.department_id
    })
    reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Bearbeiten Sie die Daten des bestehenden Mitarbeiters.' 
              : 'Erfassen Sie die Daten des neuen Mitarbeiters.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Vorname</Label>
              <Input 
                id="first_name" 
                {...register('first_name', { 
                  required: 'Vorname ist erforderlich'
                })} 
              />
              {errors.first_name && (
                <span className="text-sm text-red-500">{errors.first_name.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nachname</Label>
              <Input 
                id="last_name" 
                {...register('last_name', { 
                  required: 'Nachname ist erforderlich'
                })} 
              />
              {errors.last_name && (
                <span className="text-sm text-red-500">{errors.last_name.message}</span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input 
              id="email" 
              type="email" 
              {...register('email', { 
                required: 'E-Mail ist erforderlich',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Ungültige E-Mail-Adresse'
                }
              })} 
            />
            {errors.email && (
              <span className="text-sm text-red-500">{errors.email.message}</span>
            )}
          </div>

          <DepartmentField
            departments={departments}
            value={watch('department_id')}
            onChange={(value) => setValue('department_id', value)}
            error={errors.department_id?.message}
          />

          <div className="space-y-2">
            <Label htmlFor="password">Passwort {!initialData && "*"}</Label>
            <Input 
              id="password" 
              type="password" 
              {...register('password', {
                required: !initialData ? 'Passwort ist erforderlich' : false,
                minLength: { value: 6, message: 'Passwort muss mindestens 6 Zeichen lang sein' }
              })}
            />
            {errors.password && (
              <span className="text-sm text-red-500">{errors.password.message}</span>
            )}
          </div>          

          <div className="flex items-center space-x-2">
            <Switch
              id="is_admin"
              checked={watch('is_admin')}
              onCheckedChange={(checked) => setValue('is_admin', checked)}
            />
            <Label htmlFor="is_admin">Administrator</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Farbe</Label>
            <ColorPicker 
              value={watch('color')}
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
