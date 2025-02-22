import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ShiftWeek, ShiftWeekStatus } from "@/types/api"
import { Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ShiftWeekTableProps {
  shiftWeeks: ShiftWeek[]
  isLoading: boolean
  onEdit: (shiftWeek: ShiftWeek) => void
  onDelete?: (shiftWeek: ShiftWeek) => void
}

export function ShiftWeekTable({ shiftWeeks, isLoading, onEdit, onDelete }: ShiftWeekTableProps) {
  const [weekToDelete, setWeekToDelete] = useState<ShiftWeek | null>(null)

  const handleDeleteClick = (shiftWeek: ShiftWeek) => {
    setWeekToDelete(shiftWeek)
  }

  const handleDeleteConfirm = () => {
    if (weekToDelete && onDelete) {
      onDelete(weekToDelete)
      setWeekToDelete(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case ShiftWeekStatus.DRAFT:
        return "#f59e0b" // Amber
      case ShiftWeekStatus.PUBLISHED: 
        return "#10b981" // Emerald
      case ShiftWeekStatus.ARCHIVED:
        return "#6b7280" // Gray
      default:
        return "#000000"
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case ShiftWeekStatus.DRAFT:
        return "Entwurf"
      case ShiftWeekStatus.PUBLISHED:
        return "Veröffentlicht"  
      case ShiftWeekStatus.ARCHIVED:
        return "Archiviert"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">KW</TableHead>
              <TableHead className="hidden sm:table-cell">Jahr</TableHead>
              <TableHead className="min-w-[150px]">Abteilung</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Notizen</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><div className="h-4 w-12 animate-pulse bg-muted rounded" /></TableCell>
                <TableCell className="hidden sm:table-cell"><div className="h-4 w-16 animate-pulse bg-muted rounded" /></TableCell>
                <TableCell><div className="h-4 w-24 animate-pulse bg-muted rounded" /></TableCell>
                <TableCell className="hidden md:table-cell"><div className="h-4 w-20 animate-pulse bg-muted rounded" /></TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="h-4 w-32 animate-pulse bg-muted rounded" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <div className="h-8 w-8 animate-pulse bg-muted rounded" />
                    <div className="h-8 w-8 animate-pulse bg-muted rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[100px]">KW</TableHead>
              <TableHead className="hidden sm:table-cell">Jahr</TableHead>
              <TableHead className="min-w-[150px]">Abteilung</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Notizen</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shiftWeeks.map((week) => (
              <TableRow key={`week-${week.id}`} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  KW {week.calendar_week}/{week.year}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {week.year}
                </TableCell>
                <TableCell>
                  {week.department?.name || "-"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge 
                    label={getStatusLabel(week.status)}
                    color={getStatusColor(week.status)}
                  />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {week.notes || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(week)}
                      className="hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteClick(week)}
                        className="hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog 
        open={!!weekToDelete} 
        onOpenChange={() => setWeekToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Schichtwoche löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diese Schichtwoche wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
