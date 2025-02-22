// Gemeinsame Basis-Interfaces
export interface BaseModel {
  id: number
  created_at: string
  updated_at: string
}

// Erweiterte Interfaces
export interface Department extends BaseModel {
  name: string
  color: string
  description: string
  employees?: Employee[]
  shiftWeeks?: ShiftWeek[]
}

export interface DepartmentFormData {
  id?: number
  name: string
  description: string
  color: string
  employee_ids: number[]
}

// Employee Interfaces
export interface Employee {
  id: number
  first_name: string
  last_name: string
  email: string
  password: string
  color: string
  is_admin: boolean
  department_id: number
  shift_days?: ShiftDay[]
  created_at: string
  updated_at: string
}

export interface EmployeeFormData {
  id?: number
  first_name: string
  last_name: string
  email: string
  department_id: number | null
  color: string
  password?: string
  is_admin: boolean
}

// ShiftType Interfaces
export interface ShiftType {
  id: number
  name: string
  description: string
  color: string
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
}

export interface ShiftTypeFormData {
  name: string
  description: string
  color: string
  start_time: string
  end_time: string
}

// ShiftWeek Interfaces
export const ShiftWeekStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const

export type ShiftWeekStatusType = typeof ShiftWeekStatus[keyof typeof ShiftWeekStatus]

export interface ShiftWeek {
  id: number
  calendar_week: number
  year: number
  department_id: number
  department?: Department
  shift_days?: ShiftDay[]
  status: ShiftWeekStatusType
  notes: string
  created_at: string
  updated_at: string
}

export interface ShiftWeekFormData {
  id?: number
  calendar_week: number
  year: number
  department_id: number
  status: ShiftWeekStatusType
  notes?: string
}

// ShiftDay Interfaces
export interface ShiftDay {
  id: number
  date: string
  shift_week_id: number
  shift_type_id: number
  shift_type?: ShiftType
  employee_id: number
  employee?: Employee
  notes: string
  status: string
  created_at: string
  updated_at: string
}

export interface ShiftDayFormData {
  date: string
  shift_week_id: number
  shift_type_id: number
  employee_id: number
  notes?: string
}

export interface Shift {
  id: number
  date: string
  name?: string
  employee_id: number
  shift_type_id: number
  department_id: number
  notes?: string
  calendar_week?: number  // Neue Eigenschaft
  year?: number          // Neue Eigenschaft
}

export interface CalendarFormData {
  date: string
  shift_type_id: number
  employee_id: number
  department_id: number
  notes?: string         // Hinzugefügt für Notizfunktionalität
}
