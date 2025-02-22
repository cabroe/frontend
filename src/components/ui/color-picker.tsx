"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { useState, useEffect } from 'react'
import { PREDEFINED_COLORS } from '@/lib/colors'

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
}

export function ColorPicker({ value = '#FF0000', onChange }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(value)

  useEffect(() => {
    setSelectedColor(value)
  }, [value])

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor)
    onChange?.(newColor)
  }

  const currentColor = PREDEFINED_COLORS.find(c => c.value === selectedColor)

  return (
    <Select value={selectedColor} onValueChange={handleColorChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: selectedColor }} />
            {currentColor?.label || selectedColor}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {PREDEFINED_COLORS.map((color) => (
          <SelectItem key={color.value} value={color.value}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color.value }} />
              {color.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
