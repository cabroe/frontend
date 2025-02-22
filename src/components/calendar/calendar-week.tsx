"use client"

import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  getWeek, 
  addWeeks,
  isValid 
} from 'date-fns'
import { de } from 'date-fns/locale'
import { Shift, Employee } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface CalendarWeekProps {
  currentDate: Date
  shifts: Shift[]
  employees: Employee[]
  onShiftClick: (shift: Shift) => void
  onDeleteShift: (shift: Shift) => void
}

export function CalendarWeek({
  currentDate,
  shifts,
  employees,
  onShiftClick,
  onDeleteShift
}: CalendarWeekProps) {
  const weekStart = startOfWeek(currentDate, { locale: de })
  const weekEnd = endOfWeek(currentDate, { locale: de })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
  const weekNumber = getWeek(currentDate, { locale: de })

  const shiftsByDateAndEmployee = shifts.reduce((acc, shift) => {
    try {
      let shiftDate

      // Handle shifts with calendar week format
      if ('calendar_week' in shift && 'year' in shift) {
        const yearStart = new Date(shift.year as number, 0, 1)
        const weekStart = startOfWeek(yearStart, { weekStartsOn: 1 })
        shiftDate = addWeeks(weekStart, (shift.calendar_week as number) - 1)
      } 
      // Handle shifts with direct date
      else if (shift.date) {
        shiftDate = new Date(shift.date)
      }
      
      // Validate date before using
      if (shiftDate && isValid(shiftDate)) {
        const dateKey = format(shiftDate, 'yyyy-MM-dd')
        const employeeId = shift.employee_id
        
        if (!acc[employeeId]) acc[employeeId] = {}
        if (!acc[employeeId][dateKey]) acc[employeeId][dateKey] = []
        
        acc[employeeId][dateKey].push(shift)
      }
      
      return acc
    } catch (error) {
      console.warn('Error processing shift:', shift, error)
      return acc
    }
  }, {} as Record<number, Record<string, Shift[]>>)
  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <colgroup>
          <col className="w-[180px]" />
          {weekDays.map(() => (
            <col className="w-[1%]" key={`col-${Math.random()}`} />
          ))}
        </colgroup>
        <thead>
          <tr className="bg-muted border-b">
            <th className="p-2 border-r font-medium text-left">
              <div className="truncate text-sm text-muted-foreground">KW {weekNumber}</div>
            </th>
            {weekDays.map(day => (
              <th key={day.toISOString()} className="p-2 text-center text-sm">
                <div>{format(day, 'EEEE', { locale: de })}</div>
                <div>{format(day, 'd.MM.')}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-t">
              <td className="p-2 border-r">
                {employee.first_name} {employee.last_name}
              </td>
              {weekDays.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd')
                const shifts = shiftsByDateAndEmployee[employee.id]?.[dateKey] || []
                
                return (
                  <td 
                    key={`${employee.id}-${dateKey}`} 
                    className="p-2 border-r border-b"
                  >
                    {shifts.map((shift) => (
                      <div 
                        key={shift.id}
                        className="group flex items-center justify-between gap-2 text-xs p-1 rounded-sm bg-primary/10 hover:bg-primary/20 cursor-pointer"
                        onClick={() => onShiftClick(shift)}
                      >
                        <span className="truncate">{shift.name || 'Schicht'}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteShift(shift)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
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
