import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Suchen...",
  className 
}: SearchBarProps) {
  return (
    <div className={`w-full max-w-sm lg:max-w-lg ${className}`}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="w-full pl-8 pr-8"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Suche zurücksetzen</span>
          </button>
        )}
      </div>
    </div>
  )
}
