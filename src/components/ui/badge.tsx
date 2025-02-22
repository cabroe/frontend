interface BadgeProps {
  label: string
  color: string
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <span 
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-gray-900" 
      style={{ 
        backgroundColor: `${color}25`,
        boxShadow: 'inset 0 0 0 1px rgb(229 231 235)'
      }}
    >
      {label}
    </span>
  )
}
