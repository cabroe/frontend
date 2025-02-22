import { format, isValid } from 'date-fns'
import { de } from 'date-fns/locale'
import { Shift, Employee } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface CalendarDayProps {
  date: Date
  shifts: Shift[]
  employees: Employee[]
  onShiftClick: (shift: Shift) => void
  onDeleteShift: (shift: Shift) => void
}

export function CalendarDay({ 
  date, 
  shifts, 
  employees,
  onShiftClick,
  onDeleteShift 
}: CalendarDayProps) {
  // Validierung der Eingabeparameter
  const validShifts = shifts.filter(shift => {
    if (!shift?.date) {
      console.info(`Info: Shift ${shift?.id} übersprungen (kein Datum)`)
      return false
    }
    return true
  })
  // Filtern der Schichten für den aktuellen Tag
  const dayShifts = validShifts.filter(shift => {
    // Frühe Validierung der Shift-Daten
    if (!shift?.date) {
        console.info(`Info: Shift ${shift?.id} übersprungen (kein Datum)`)
        return false
    }

    // Datumsbasierte Schichten
    const shiftDate = new Date(shift.date)
    if (!isValid(shiftDate)) {
        console.info(`Info: Ungültiges Datum für Shift ${shift.id}`)
        return false
    }
    
    return format(shiftDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  })

// Gruppierung der Schichten nach Mitarbeiter mit Validierung
const shiftsByEmployee = dayShifts.reduce((acc, shift) => {
    // Validiere employee_id
    if (!shift.employee_id) {
        console.info(`Info: Shift ${shift.id} hat keine gültige employee_id`)
        return acc
    }

    // Initialisiere Array für neuen Mitarbeiter
    if (!acc[shift.employee_id]) {
        acc[shift.employee_id] = []
    }

    // Füge validierte Schicht hinzu
    acc[shift.employee_id].push({
        ...shift,
        shift_type_id: shift.shift_type_id || 0  // Numerischer Fallback-Wert
    })

    return acc
}, {} as Record<number, Shift[]>)

  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <colgroup>
          <col className="w-[180px]" />
          <col />
        </colgroup>
        <thead>
          <tr className="bg-muted">
            <th className="p-2 border-r font-medium text-left">
              <div className="truncate">Mitarbeiter</div>
            </th>
            <th className="p-2 text-center">
              {format(date, 'EEEE, d. MMMM yyyy', { locale: de })}
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-t">
              <td className="p-2 border-r">
                {employee.first_name} {employee.last_name}
              </td>
              <td className="p-2">
                {shiftsByEmployee[employee.id]?.map((shift) => (
                  <div 
                    key={shift.id}
                    className="group flex items-center justify-between gap-2 text-xs p-1 rounded-sm bg-primary/10 hover:bg-primary/20 cursor-pointer"
                    onClick={() => onShiftClick(shift)}
                  >
                    <span className="truncate">{`Schicht ${shift.shift_type_id}`}</span>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
