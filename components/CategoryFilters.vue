<template>
  <div class="filters">
    <div class="inner">
      <button class="pill" :class="{ active: modelValue === null }" @click="$emit('update:modelValue', null)">
        Toutes
      </button>
      <button
        v-for="tag in tags" :key="tag"
        class="pill"
        :class="{ active: modelValue === tag }"
        @click="$emit('update:modelValue', tag)"
      >
        <span class="pill-icon" v-html="iconFor(tag)" />
        {{ tag }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ tags: string[]; modelValue: string | null }>()
defineEmits<{ (e: 'update:modelValue', v: string | null): void }>()

const ICONS: Record<string, string> = {
  'Plage':       `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M1 12c1-3.5 3-5.5 6-5.5s5 2 6 5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="7" cy="4" r="2.5" stroke="currentColor" stroke-width="1.4"/></svg>`,
  'Culture':     `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><rect x="2" y="7" width="10" height="5" rx="1" stroke="currentColor" stroke-width="1.4"/><path d="M1 7l6-5 6 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  'Nature':      `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 13V7M7 7C7 4 4.5 2 1.5 2 2.5 6 5 7 7 7zM7 7c0-3 2.5-5 5.5-5C11.5 6 9 7 7 7z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  'Romantique':  `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 12S1 8 1 4.5a3 3 0 016-0A3 3 0 0113 4.5C13 8 7 12 7 12z" stroke="currentColor" stroke-width="1.4"/></svg>`,
  'Vie nocturne':`<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M3 2.5A5.5 5.5 0 1011.5 11 4.5 4.5 0 013 2.5z" stroke="currentColor" stroke-width="1.4"/></svg>`,
  'Détente':     `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.4"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  'Urbain':      `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><rect x="1" y="5" width="5" height="8" rx=".5" stroke="currentColor" stroke-width="1.4"/><rect x="8" y="2" width="5" height="11" rx=".5" stroke="currentColor" stroke-width="1.4"/><path d="M1 13h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  'Aventure':    `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1l1.7 4.8H14L9.9 8.5l1.7 4.8L7 10.6l-4.6 2.7 1.7-4.8L0 5.8h5.3z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
  'Famille':     `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><circle cx="4" cy="3.5" r="1.5" stroke="currentColor" stroke-width="1.3"/><circle cx="10" cy="3.5" r="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 12c0-2.5 1.1-4 2.5-4s2.5 1.5 2.5 4M7.5 12c0-2.5 1.1-4 2.5-4s2.5 1.5 2.5 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  'LGBTQIA+':    `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M2 11c2-5 8-5 10 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M4 9c1-3 5-3 6 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
  'Gastronomie': `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M5 1v4a2 2 0 01-4 0V1M3 5v8M9 1c0 0 2 2 2 5H7c0-3 2-5 2-5zM9 6v7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  'Shopping':    `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M2 2h2l2 7h5l1.5-5H5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.5" cy="11.5" r="1" fill="currentColor"/><circle cx="11.5" cy="11.5" r="1" fill="currentColor"/></svg>`,
}

function iconFor(tag: string) {
  return ICONS[tag] ?? ''
}
</script>

<style scoped>
.filters {
  background: var(--white);
  border-bottom: 1px solid var(--gray-border);
  padding: 10px 32px;
  overflow-x: auto;
}
.inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; gap: 8px; flex-wrap: nowrap;
}
.pill {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 16px; border-radius: 999px;
  border: 1.5px solid var(--gray-border);
  font-size: 13px; font-weight: 500; color: var(--navy);
  background: var(--white); white-space: nowrap;
  transition: all .15s; flex-shrink: 0;
}
.pill:hover { border-color: var(--blue-light); color: var(--blue); }
.pill.active { background: var(--blue); border-color: var(--blue); color: #fff; }
.pill-icon { display: flex; align-items: center; }
</style>
