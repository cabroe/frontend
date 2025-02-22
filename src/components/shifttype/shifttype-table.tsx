"use client"

import { useState } from 'react'
import { PREDEFINED_COLORS } from '@/lib/colors'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ShiftType } from "@/types/api"
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

interface ShiftTypeTableProps {
  shiftTypes: ShiftType[]
  onEdit: (shiftType: ShiftType) => void
  onDelete?: (shiftType: ShiftType) => void
}

export function ShiftTypeTable({ shiftTypes, onEdit, onDelete }: ShiftTypeTableProps) {
  const [shiftTypeToDelete, setShiftTypeToDelete] = useState<ShiftType | null>(null)

  const getColorLabel = (colorValue: string) => {
    const color = PREDEFINED_COLORS.find(c => c.value === colorValue)
    return color?.label || colorValue
  }

  const handleDeleteClick = (shiftType: ShiftType) => {
    setShiftTypeToDelete(shiftType)
  }

  const handleDeleteConfirm = () => {
    if (shiftTypeToDelete && onDelete) {
      onDelete(shiftTypeToDelete)
      setShiftTypeToDelete(null)
    }
  }

  return (
    <>
      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Beschreibung</TableHead>
              <TableHead className="hidden md:table-cell">Startzeit</TableHead>
              <TableHead className="hidden md:table-cell">Endzeit</TableHead>
              <TableHead className="hidden lg:table-cell">Farbe</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shiftTypes.map((shiftType) => (
              <TableRow key={`shifttype-${shiftType.id}`}>
                <TableCell className="font-medium">
                  {shiftType.name}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {shiftType.description}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {shiftType.start_time}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {shiftType.end_time}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge 
                    label={getColorLabel(shiftType.color)}
                    color={shiftType.color}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(shiftType)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {onDelete && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(shiftType)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!shiftTypeToDelete} onOpenChange={() => setShiftTypeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Schichttyp löschen</AlertDialogTitle>
            <AlertDialogDescription>
              Möchten Sie diesen Schichttyp wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
