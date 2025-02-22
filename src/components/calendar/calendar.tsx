"use client"

import { CalendarQuartal } from './calendar-quartal'
import { CalendarMonth } from './calendar-month'
import { CalendarWeek } from './calendar-week'
import { CalendarDay } from './calendar-day'
import { ErrorBoundary } from "@/components/error-boundary"
import { Shift, Employee } from "@/types/api"

interface CalendarProps {
  shifts: Shift[]
  employees: Employee[]
  isLoading: boolean
  currentDate: Date
  viewMode: 'month' | 'week' | 'day' | 'quartal'
  onEdit: (shift: Shift) => void
  onDelete: (shift: Shift) => void
}

export function Calendar({ 
  shifts, 
  employees,
  currentDate,
  viewMode,
  onEdit, 
  onDelete 
}: CalendarProps) {
  return (
    <div className="rounded-md border shadow-sm">
      <div className="w-full transition-all duration-300">
        <ErrorBoundary>
          {viewMode === 'quartal' && (
            <CalendarQuartal
              currentDate={currentDate}
              shifts={shifts}
              employees={employees}
              onShiftClick={onEdit}
              onDeleteShift={onDelete}
            />
          )}
          {viewMode === 'month' && (
            <CalendarMonth 
              currentDate={currentDate}
              shifts={shifts}
              employees={employees}
              onShiftClick={onEdit}
              onDeleteShift={onDelete}
            />
          )}
          {viewMode === 'week' && (
            <CalendarWeek
              currentDate={currentDate}
              shifts={shifts}
              employees={employees}
              onShiftClick={onEdit}
              onDeleteShift={onDelete}
            />
          )}
          {viewMode === 'day' && (
            <CalendarDay
              date={currentDate}
              shifts={shifts}
              employees={employees}
              onShiftClick={onEdit}
              onDeleteShift={onDelete}
            />
          )}
        </ErrorBoundary>
      </div>
    </div>
  )
}