"use client"

import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import { de } from 'date-fns/locale'
import { Shift, Employee } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface CalendarGridProps {
  currentDate: Date
  shifts: Shift[]
  employees: Employee[]
  onShiftClick: (shift: Shift) => void
  onDeleteShift: (shift: Shift) => void
}

export function CalendarMonth({ 
  currentDate, 
  shifts = [], 
  employees = [], 
  onShiftClick,
  onDeleteShift 
}: CalendarGridProps) {
  if (!Array.isArray(employees)) {
    throw new Error('employees must be an array')
  }

  if (!Array.isArray(shifts)) {
    throw new Error('shifts must be an array')
  }

  if (!(currentDate instanceof Date)) {
    throw new Error('currentDate must be a valid Date object')
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { locale: de })
  const calendarEnd = endOfWeek(monthEnd, { locale: de })

  const calendarDays = eachDayOfInterval({ 
    start: calendarStart, 
    end: calendarEnd 
  })

  const shiftsByDateAndEmployee = shifts.reduce((acc, shift) => {
    try {
      const shiftDate = new Date(shift.date)
      if (isNaN(shiftDate.getTime())) {
        console.warn('Invalid shift date encountered:', shift)
        return acc
      }

      const dateKey = format(shiftDate, 'yyyy-MM-dd')
      const employeeId = shift.employee_id
      
      if (!acc[employeeId]) {
        acc[employeeId] = {}
      }
      if (!acc[employeeId][dateKey]) {
        acc[employeeId][dateKey] = []
      }
      acc[employeeId][dateKey].push(shift)
      return acc
    } catch (error) {
      console.error('Error processing shift:', shift, error)
      return acc
    }
  }, {} as Record<number, Record<string, Shift[]>>)

  return (
    <div className="w-full">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="w-[120px] p-2 border-r font-medium text-left">
              Mitarbeiter
            </th>
            {calendarDays.map((day) => (
              <th 
                key={day.toISOString()} 
                className="p-1 text-center"
              >
                <div>{format(day, 'E', { locale: de })}</div>
                <div>{format(day, 'd')}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-t">
              <td className="p-2 border-r truncate">
                {employee.first_name} {employee.last_name}
              </td>
              {calendarDays.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd')
                const shifts = shiftsByDateAndEmployee[employee.id]?.[dateKey] || []
                
                return (
                  <td 
                    key={`${employee.id}-${dateKey}`} 
                    className="p-1 border-r border-b"
                  >
                    {shifts.map((shift) => (
                      <div 
                        key={shift.id}
                        className="group flex items-center justify-between gap-1 p-1 rounded-sm bg-primary/10 hover:bg-primary/20 cursor-pointer"
                        onClick={() => onShiftClick(shift)}
                      >
                        <span className="truncate">{shift.name || 'Schicht'}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-3 w-3 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteShift(shift)
                          }}
                        >
                          <Trash2 className="h-2 w-2 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
