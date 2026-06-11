<template>
  <div class="map-wrap">
    <div v-if="loading" class="map-loading">
      <div class="spinner" />
      <span>Chargement de la carte…</span>
    </div>
    <svg
      v-show="!loading"
      ref="svgEl"
      class="map-svg"
      :viewBox="viewBoxString"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- SVG Filters -->
      <defs>
        <filter id="tooltip-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3" />
        </filter>
      </defs>

      <!-- Countries -->
      <g class="countries">
        <path
          v-for="(p, i) in countryPaths"
          :key="i"
          :d="p.d"
          :class="['country', { highlighted: effectiveHovered && findCountryByName(effectiveHovered.country)?.countryName === p.countryName }]"
        />
      </g>

      <!-- Destination pins -->
      <g class="pins">
        <g
          v-for="dest in destinations"
          :key="dest.id"
          class="pin-group"
          @mouseenter="hovered = dest"
          @mouseleave="hovered = null"
          @click="$emit('select', dest)"
        >
          <circle
            :cx="project(dest.coordinates)[0]"
            :cy="project(dest.coordinates)[1]"
            :r="hovered?.id === dest.id || highlighted?.id === dest.id ? 8 : 6"
            class="pin-circle"
            :class="{ active: highlighted?.id === dest.id }"
          />
        </g>
      </g>

      <!-- Tooltip on hover -->
      <g v-if="effectiveHovered" class="tooltip">
        <rect
          :x="clampX(project(effectiveHovered.coordinates)[0])"
          :y="project(effectiveHovered.coordinates)[1] - 50"
          width="140" height="46" rx="8"
          fill="#0a2240"
          filter="url(#tooltip-shadow)"
          opacity="0.95"
        />
        
        <!-- Destination name -->
        <text
          :x="clampX(project(effectiveHovered.coordinates)[0]) + 70"
          :y="project(effectiveHovered.coordinates)[1] - 32"
          text-anchor="middle"
          fill="white" 
          font-size="12" 
          font-weight="700" 
          font-family="Inter, sans-serif"
        >{{ effectiveHovered.name }}</text>
        
        <!-- Country -->
        <text
          :x="clampX(project(effectiveHovered.coordinates)[0]) + 70"
          :y="project(effectiveHovered.coordinates)[1] - 16"
          text-anchor="middle"
          fill="#93c5fd" 
          font-size="11" 
          font-family="Inter, sans-serif"
        >{{ effectiveHovered.country }}</text>
        
        <!-- IATA code -->
        <text
          :x="clampX(project(effectiveHovered.coordinates)[0]) + 70"
          :y="project(effectiveHovered.coordinates)[1] - 2"
          text-anchor="middle"
          fill="#60a5fa" 
          font-size="10" 
          font-family="Inter, sans-serif"
        >{{ effectiveHovered.iata.join(', ') }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { Destination } from '~/composables/useDestinations'

const props = defineProps<{
  destinations: Destination[]
  highlighted?: Destination | null
  hovered?: Destination | null
}>()
defineEmits<{ (e: 'select', d: Destination): void }>()

const W = 900
const H = 480

const hovered = ref<Destination | null>(null)
const loading = ref(true)
const countryPaths = ref<{ d: string; countryName: string; bounds?: { minX: number; maxX: number; minY: number; maxY: number } }[]>([])
const svgEl = ref<SVGSVGElement | null>(null)
const viewBoxMinX = ref(0)
const viewBoxMinY = ref(0)
const viewBoxWidth = ref(W)
const viewBoxHeight = ref(H)

// Computed hovered - use prop if provided, otherwise use internal state
const effectiveHovered = computed(() => props.hovered || hovered.value)

const viewBoxString = computed(() => 
  `${viewBoxMinX.value.toFixed(1)} ${viewBoxMinY.value.toFixed(1)} ${viewBoxWidth.value.toFixed(1)} ${viewBoxHeight.value.toFixed(1)}`
)

// Country name mapping (French names to English GeoJSON names and vice versa)
const countryNameMap: Record<string, string[]> = {
  'Maroc': ['Morocco', 'Maroc'],
  'Morocco': ['Morocco', 'Maroc'],
  'Egypte': ['Egypt', 'Égypte', 'Egypte'],
  'Egypt': ['Egypt', 'Égypte', 'Egypte'],
  'Égypte': ['Egypt', 'Égypte', 'Egypte'],
  'France': ['France', 'France'],
  'Pologne': ['Poland', 'Pologne'],
  'Poland': ['Poland', 'Pologne'],
  'Irlande': ['Ireland', 'Irlande'],
  'Ireland': ['Ireland', 'Irlande'],
  'Espagne': ['Spain', 'Espagne'],
  'Spain': ['Spain', 'Espagne'],
}

// Find country by name with fallback matching
function findCountryByName(destCountryName: string): typeof countryPaths.value[0] | null {
  // Direct match
  let country = countryPaths.value.find(c => c.countryName === destCountryName)
  if (country) return country
  
  // Try case-insensitive match
  country = countryPaths.value.find(c => c.countryName.toLowerCase() === destCountryName.toLowerCase())
  if (country) return country
  
  // Try mapped names
  const mappedNames = countryNameMap[destCountryName] || []
  for (const name of mappedNames) {
    country = countryPaths.value.find(c => c.countryName === name || c.countryName.toLowerCase() === name.toLowerCase())
    if (country) return country
  }
  
  return null
}

// Simple equirectangular projection
function project([lng, lat]: [number, number]): [number, number] {
  const x = ((lng + 180) / 360) * W
  const y = ((90 - lat) / 180) * H
  return [x, y]
}

function clampX(x: number) {
  return Math.min(Math.max(x - 65, 4), W - 134)
}

// Get bounds of a path to calculate pan/zoom
function getPathBounds(pathString: string): { minX: number; maxX: number; minY: number; maxY: number } | null {
  const regex = /(\d+(?:\.\d+)?)/g
  const matches = pathString.match(regex)
  if (!matches || matches.length < 2) return null
  
  const nums = matches.map(Number)
  let minX = nums[0], maxX = nums[0], minY = nums[1], maxY = nums[1]
  
  for (let i = 0; i < nums.length; i += 2) {
    minX = Math.min(minX, nums[i])
    maxX = Math.max(maxX, nums[i])
    minY = Math.min(minY, nums[i + 1])
    maxY = Math.max(maxY, nums[i + 1])
  }
  
  return { minX, maxX, minY, maxY }
}

// Animate pan to a specific country
function panToCountry(countryName: string) {
  const country = findCountryByName(countryName)
  if (!country) {
    console.warn(`Country not found: ${countryName}`)
    return
  }
  
  // Calculate bounds if not already cached
  let bounds = country.bounds
  if (!bounds) {
    bounds = getPathBounds(country.d)
    if (bounds) country.bounds = bounds
  }
  
  if (!bounds) return
  
  const width = bounds.maxX - bounds.minX
  const height = bounds.maxY - bounds.minY
  
  // Calculate zoom to fit country with padding
  const padding = 30
  const zoomX = (W - padding * 2) / width
  const zoomY = (H - padding * 2) / height
  const newZoom = Math.min(zoomX, zoomY, 3) // Max zoom 3x
  
  // Calculate new viewBox dimensions
  const newViewBoxWidth = W / newZoom
  const newViewBoxHeight = H / newZoom
  
  // Calculate pan to center country
  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  
  const newMinX = centerX - newViewBoxWidth / 2
  const newMinY = centerY - newViewBoxHeight / 2
  
  // Smooth animation
  const startMinX = viewBoxMinX.value
  const startMinY = viewBoxMinY.value
  const startWidth = viewBoxWidth.value
  const startHeight = viewBoxHeight.value
  const duration = 400
  const startTime = Date.now()
  
  const animate = () => {
    const now = Date.now()
    const progress = Math.min((now - startTime) / duration, 1)
    const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
    
    viewBoxMinX.value = startMinX + (newMinX - startMinX) * easeProgress
    viewBoxMinY.value = startMinY + (newMinY - startMinY) * easeProgress
    viewBoxWidth.value = startWidth + (newViewBoxWidth - startWidth) * easeProgress
    viewBoxHeight.value = startHeight + (newViewBoxHeight - startHeight) * easeProgress
    
    if (progress < 1) requestAnimationFrame(animate)
  }
  
  animate()
}

// Reset pan/zoom
function resetPan() {
  viewBoxMinX.value = 0
  viewBoxMinY.value = 0
  viewBoxWidth.value = W
  viewBoxHeight.value = H
}

// Watch hovered changes
watch(effectiveHovered, (newHovered) => {
  if (newHovered) {
    panToCountry(newHovered.country)
  } else {
    resetPan()
  }
})

// Convert GeoJSON geometry to SVG path string
function geomToPath(geometry: any): string {
  const coords = geometry.type === 'Polygon'
    ? [geometry.coordinates]
    : geometry.type === 'MultiPolygon'
    ? geometry.coordinates
    : []

  return coords.map((poly: any) =>
    poly.map((ring: [number, number][]) => {
      const pts = ring.map(([lng, lat]) => project([lng, lat]))
      return 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L') + 'Z'
    }).join(' ')
  ).join(' ')
}

onMounted(async () => {
  try {
    const geo = await $fetch<any>('https://cdn.smartvel.com/data/geo/sm_world_map.json')
    const features = geo.features ?? []
    countryPaths.value = features
      .filter((f: any) => f.geometry)
      .map((f: any) => {
        const countryName = f.properties?.name || f.properties?.ADMIN || `Country_${Math.random()}`
        return { 
          d: geomToPath(f.geometry),
          countryName: countryName
        }
      })
      .filter((p: any) => p.d)
  } catch (e) {
    console.error('GeoJSON load error', e)
  }
  loading.value = false
})
</script>

<style scoped>
.map-wrap {
  width: 100%;
  height: 480px;
  background: #dbeaf8;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  min-height: 260px;
}
.map-loading {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; color: var(--gray-text); font-size: 13px;
}
.spinner {
  width: 28px; height: 28px; border-radius: 50%;
  border: 3px solid var(--gray-border);
  border-top-color: var(--blue);
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.map-svg { 
  width: 100%; 
  height: 100%; 
  display: block;
  transition: transform 0.05s linear;
}

.country {
  fill: #1a3c6b;
  stroke: #dbeaf8;
  stroke-width: .4;
  transition: fill 0.3s ease;
}

.country.highlighted {
  fill: #ef4444;
  stroke: #dc2626;
  stroke-width: 1.2;
  filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.5));
}

.pin-circle {
  fill: #2e7fd4;
  stroke: white;
  stroke-width: 1.8;
  cursor: pointer;
  transition: r .15s;
}
.pin-circle.active {
  fill: var(--red);
}
.tooltip { 
  pointer-events: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    r: 6px;
  }
  50% {
    r: 7px;
  }
}
</style>
