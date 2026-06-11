// server/api/destinations.ts
const TAG_MAP: Record<number, string> = {
  1:  'Plage',
  2:  'Romantique',
  5:  'Urbain',
  7:  'Nature',
  8:  'LGBTQIA+',
  9:  'Détente',
  10: 'Culture',
  11: 'Vie nocturne',
  12: 'Aventure',
  24: 'Gastronomie',
  68: 'Famille',
  69: 'Shopping',
}

export default defineEventHandler(async () => {
  const API_URL =
    'https://api.smartvel.com/v3/exploreandgo/regions' +
    '?key=cf99d851-8d40-4545-8362-ecf283c8d63d&lang=fr&format=json&config_name=GenevaAirport'

  const raw: any[] = await $fetch(API_URL)

  return raw.map((r) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    slug: r.slug,
    description: r.description ?? '',
    cover: r.cover?.cc_photo ?? '',
    tags: (r.tags ?? []).map((t: number) => TAG_MAP[t]).filter(Boolean),
    iata: (r.iata ?? []).map((i: any) => i.code),
    coordinates: r.center?.coordinates ?? [0, 0], // [lng, lat]
  }))
})
