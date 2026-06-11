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
      :viewBox="`0 0 ${W} ${H}`"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Countries -->
      <g class="countries">
        <path
          v-for="(p, i) in countryPaths"
          :key="i"
          :d="p.d"
          class="country"
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
      <g v-if="hovered" class="tooltip">
        <rect
          :x="clampX(project(hovered.coordinates)[0])"
          :y="project(hovered.coordinates)[1] - 46"
          width="130" height="38" rx="6"
          fill="#0a2240"
        />
        <text
          :x="clampX(project(hovered.coordinates)[0]) + 65"
          :y="project(hovered.coordinates)[1] - 30"
          text-anchor="middle"
          fill="white" font-size="11" font-weight="700" font-family="Inter, sans-serif"
        >{{ hovered.name }}</text>
        <text
          :x="clampX(project(hovered.coordinates)[0]) + 65"
          :y="project(hovered.coordinates)[1] - 14"
          text-anchor="middle"
          fill="#93c5fd" font-size="10" font-family="Inter, sans-serif"
        >{{ hovered.country }} · {{ hovered.iata[0] }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { Destination } from '~/composables/useDestinations'

const props = defineProps<{
  destinations: Destination[]
  highlighted?: Destination | null
}>()
defineEmits<{ (e: 'select', d: Destination): void }>()

const W = 900
const H = 480

const hovered = ref<Destination | null>(null)
const loading = ref(true)
const countryPaths = ref<{ d: string }[]>([])
const svgEl = ref<SVGSVGElement | null>(null)

// Simple equirectangular projection
function project([lng, lat]: [number, number]): [number, number] {
  const x = ((lng + 180) / 360) * W
  const y = ((90 - lat) / 180) * H
  return [x, y]
}

function clampX(x: number) {
  return Math.min(Math.max(x - 65, 4), W - 134)
}

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
      .map((f: any) => ({ d: geomToPath(f.geometry) }))
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

.map-svg { width: 100%; height: 100%; display: block; }
.country {
  fill: #1a3c6b;
  stroke: #dbeaf8;
  stroke-width: .4;
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
.tooltip { pointer-events: none; }
</style>
