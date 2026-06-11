// composables/useDestinations.ts
// Maps API tag IDs to category labels
const TAG_MAP: Record<number, string> = {
  1:  'Plage',
  2:  'Romantique',
  3:  'Nature',
  4:  'Détente',
  5:  'Culture',
  6:  'Vie nocturne',
}

export interface Destination {
  id: number
  name: string
  country: string
  slug: string
  description: string
  cover: string
  tags: string[]
  iata: string[]
  coordinates: [number, number] // [lng, lat]
}

export const useDestinations = () => {
  const config = useRuntimeConfig()

  const { data: destinations, pending, error } = useLazyFetch<Destination[]>(
    '/api/destinations',
    { default: () => [] }
  )

  // Collect unique tags from all destinations
  const allTags = computed(() => {
    if (!destinations.value?.length) return []
    const tagSet = new Set<string>()
    destinations.value.forEach(d => d.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  })

  return { destinations, pending, error, allTags }
}

export { TAG_MAP }
