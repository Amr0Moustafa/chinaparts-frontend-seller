"use client"
import TagBadge from '@/components/atoms/TagBadge'

type ProductBadgesProps = {
  tags: string[]
}

export default function ProductBadges({ tags }: ProductBadgesProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map((tag, index) => (
        <TagBadge key={index} label={tag} />
      ))}
    </div>
  )
}