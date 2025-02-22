import { 
  format, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isValid,
  startOfWeek,
  addWeeks
} from 'date-fns'
import { de } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Shift, Employee } from "@/types/api"

interface CalendarQuartalProps {
  currentDate: Date
  shifts: Shift[]
  employees: Employee[]
  onShiftClick: (shift: Shift) => void
  onDeleteShift: (shift: Shift) => void
}

export function CalendarQuartal({
  currentDate,
  shifts,
  employees,
  onShiftClick,
  onDeleteShift
}: CalendarQuartalProps) {
  const monthDays = Array.from({ length: 4 }, (_, index) => {
    const monthDate = addMonths(currentDate, index)
    return {
      monthLabel: format(monthDate, 'MMMM yyyy', { locale: de }),
      days: eachDayOfInterval({ 
        start: startOfMonth(monthDate), 
        end: endOfMonth(monthDate) 
      })
    }
  })

  const processShift = (shift: Shift) => {
    if (shift.calendar_week && shift.year) {
      const yearStart = new Date(shift.year, 0, 1)
      const weekStart = startOfWeek(yearStart, { weekStartsOn: 1 })
      return addWeeks(weekStart, shift.calendar_week - 1)
    }
    
    if (shift.date) {
      const shiftDate = new Date(shift.date)
      return isValid(shiftDate) ? shiftDate : null
    }
    
    return null
  }

  const shiftsByDateAndEmployee = shifts.reduce((acc, shift) => {
    const shiftDate = processShift(shift)
    if (!shiftDate) return acc

    const dateKey = format(shiftDate, 'yyyy-MM-dd')
    const employeeId = shift.employee_id

    if (!acc[employeeId]) acc[employeeId] = {}
    if (!acc[employeeId][dateKey]) acc[employeeId][dateKey] = []
    
    acc[employeeId][dateKey].push(shift)
    return acc
  }, {} as Record<number, Record<string, Shift[]>>)

  return (
    <div className="w-full overflow-auto">
      <table className="w-full border-collapse">
        <colgroup>
          <col className="w-[180px]" />
          {monthDays.flatMap(month => month.days).map(() => (
            <col className="w-[1%]" key={`col-${Math.random()}`} />
          ))}
        </colgroup>
        <thead>
          <tr className="bg-muted border-b">
            <th className="p-2 border-r font-medium text-left">Mitarbeiter</th>
            {monthDays.map(month => (
              <th 
                key={month.monthLabel} 
                colSpan={month.days.length}
                className="text-center border-r p-2"
              >
                {month.monthLabel}
              </th>
            ))}
          </tr>
          <tr className="bg-muted/50 border-b">
            <th className="p-2 border-r" />
            {monthDays.flatMap(month => month.days).map(day => (
              <th 
                key={day.toISOString()} 
                className="p-1 text-center border-r"
              >
                <div className="text-xs">{format(day, 'E', { locale: de })}</div>
                <div className="text-xs">{format(day, 'd')}</div>
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
              {monthDays.flatMap(month => month.days).map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd')
                const shifts = shiftsByDateAndEmployee[employee.id]?.[dateKey] || []
                
                return (
                  <td 
                    key={`${employee.id}-${dateKey}`} 
                    className="p-1 border-r border-b min-w-[2rem]"
                  >
                    {shifts.map((shift) => (
                      <div 
                        key={shift.id}
                        className="group flex items-center justify-between gap-1 text-[10px] p-1 rounded-sm bg-primary/10 hover:bg-primary/20 cursor-pointer"
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


