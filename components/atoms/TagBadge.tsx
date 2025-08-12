"use client";
type TagBadgeProps = {
  label: string
  color?: string 
  quantity?: number
}

export default function TagBadge({ label, color ,quantity }: TagBadgeProps) {
  return (
    <span
      className={`px-3 py-2 rounded-lg text-sm font-medium bg-[var(--theme-color-peach)]  ${
        color || ''
      }`}
    >
      {label} {quantity && `(${quantity})`}
    </span>
  )
}