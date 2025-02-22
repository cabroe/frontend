"use client"

import { useState, useEffect } from 'react'
import { Department } from "@/types/api"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DepartmentFieldProps {
  value?: number | null
  onChange?: (departmentId: number) => void
  departments: Department[]
  error?: string
}

export function DepartmentField({ 
  value = null, 
  onChange, 
  departments, 
  error 
}: DepartmentFieldProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(value)
  const currentDepartment = departments.find(d => d.id === selectedDepartment)

  useEffect(() => {
    setSelectedDepartment(value)
  }, [value])

  const handleDepartmentChange = (newValue: string) => {
    const departmentId = parseInt(newValue)
    setSelectedDepartment(departmentId)
    onChange?.(departmentId)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="department">Abteilung</Label>
      <Select value={selectedDepartment?.toString() || ""} onValueChange={handleDepartmentChange}>
        <SelectTrigger className="w-full">
          <SelectValue>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: currentDepartment?.color }} />
              {currentDepartment?.name || "Abteilung wählen"}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id.toString()}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: dept.color }} />
                {dept.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  )
}
