<template>
  <div class="filters">
    <div class="inner">
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
  'detente':     `<svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M2.5 7h9M7 2.5v9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
}

function iconFor(tag: string) {
  return ICONS[tag] ?? ''
}
</script>

<style scoped>
.filters {
  padding: 10px 32px;
  overflow-x: auto;
}
.inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; gap: 8px; flex-wrap: nowrap;
}
.pill {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 18px;
  border: none;
  border-radius: 999px;
  font-size: 15px; font-weight: 500; color: var(--navy);
  background: var(--white); white-space: nowrap;
  transition: all .15s; flex-shrink: 0;
  color: #0077b6;  
}
.pill:hover { border-color: var(--blue-light); color: var(--blue); }
.pill.active { background: var(--blue); border-color: var(--blue); color: #fff; }
.pill-icon { display: flex; align-items: center; }
</style>
