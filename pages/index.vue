<template>
  
  <div class="page">
    <!-- Filters -->
    <CategoryFilters
      :tags="allTags"
      v-model="activeTag"
    />

    <div class="content">
     
      <!-- Left: list -->
      <aside class="list-col">
     
        <!-- Stats bar -->
        <div class="list-header">
          <span class="list-count">
            <template v-if="pending">Chargement…</template>
            <template v-else>{{ filtered.length }} destination{{ filtered.length !== 1 ? 's' : '' }}</template>
          </span>
          <span class="list-from">au départ de Genève</span>
        </div>

        <!-- Skeleton -->
        <template v-if="pending">
          <div v-for="n in 6" :key="n" class="skeleton" />
        </template>

        <!-- Error -->
        <div v-else-if="error" class="error-state">
          <p>Impossible de charger les destinations.</p>
          <button @click="refresh()">Réessayer</button>
        </div>

        <!-- Cards -->
        <template v-else>
          <TransitionGroup name="list" tag="div" class="cards">
            <DestinationCard
              v-for="dest in filtered"
              :key="dest.id"
              :destination="dest"
              :highlighted="selected?.id === dest.id"
              @select="selected = dest"
            />
          </TransitionGroup>
        </template>
      </aside>

      <!-- Right: map -->
     
      <div class="map-col">
        <WorldMap
          :destinations="destinations ?? []"
          :highlighted="selected"
          @select="selected = $event"
        />
      </div>
    </div>
    

    <!-- Detail panel -->
    <DestinationPanel
      :destination="selected"
      @close="selected = null"
    />
  </div>
</template>

<script setup lang="ts">
import type { Destination } from '~/composables/useDestinations'

const { destinations, pending, error, allTags } = useDestinations()
const activeTag = ref<string | null>(null)
const selected = ref<Destination | null>(null)

const filtered = computed(() => {
  if (!destinations.value) return []
  if (!activeTag.value) return destinations.value
  return destinations.value.filter(d => d.tags.includes(activeTag.value!))
})

// Refresh helper
async function refresh() {
  await refreshNuxtData()
}
</script>

<style scoped>
.page { background: var(--gray-bg); min-height: calc(100vh - 106px); }

.content {
  max-width: 1280px; margin: 0 auto;
  padding: 24px 32px;
  display: grid;
  grid-template-columns: 480px 1fr;
  gap: 24px;
  align-items: start;
}

.list-col { display: flex; flex-direction: column; gap: 12px; }

.list-header {
  display: flex; align-items: baseline; gap: 8px;
  padding: 2px 0 6px;
}
.list-count { font-size: 14px; font-weight: 700; color: var(--navy); }
.list-from { font-size: 13px; color: var(--gray-text); }

.cards { display: flex; flex-direction: column; gap: 10px; }

.skeleton {
  height: 100px; border-radius: 12px;
  background: linear-gradient(90deg, #e8edf3 25%, #f4f6f9 50%, #e8edf3 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }

.error-state {
  padding: 32px; text-align: center;
  color: var(--gray-text); font-size: 14px;
  display: flex; flex-direction: column; gap: 12px; align-items: center;
}
.error-state button {
  padding: 8px 20px; border-radius: 8px;
  background: var(--blue); color: white; font-size: 13px; font-weight: 600;
}

.map-col {
  position: sticky; top: 80px;
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 2px 16px rgba(10,34,64,.1);
}

/* List transition */
.list-move, .list-enter-active, .list-leave-active { transition: all .25s ease; }
.list-enter-from { opacity: 0; transform: translateY(8px); }
.list-leave-to { opacity: 0; }
.list-leave-active { position: absolute; }
</style>
