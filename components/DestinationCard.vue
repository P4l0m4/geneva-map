<template>
  <div class="card" @click="$emit('select', destination)" :class="{ highlighted }">
    <div class="card-img">
      <img :src="destination.cover" :alt="destination.name" loading="lazy" />
      <div class="card-iata" v-if="destination.iata.length">
        {{ destination.iata[0] }}
      </div>
    </div>
    <div class="card-body">
      <div>
        <h3 class="card-city">{{ destination.name }}</h3>
        <p class="card-country">{{ destination.country }}</p>
        <div class="card-tags">
          <span v-for="tag in destination.tags.slice(0,3)" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      <button class="card-arrow" aria-label="Voir la destination">
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
          <path d="M6 4l4 4-4 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Destination } from '~/composables/useDestinations'
defineProps<{ destination: Destination; highlighted?: boolean }>()
defineEmits<{ (e: 'select', d: Destination): void }>()
</script>

<style scoped>
.card {
  display: flex;
  background: var(--white);
  border: 1.5px solid var(--gray-border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow .2s, transform .2s, border-color .2s;
}
.card:hover, .card.highlighted {
  box-shadow: 0 6px 24px rgba(10,34,64,.12);
  transform: translateY(-2px);
  border-color: var(--blue-light);
}
.card-img {
  position: relative;
  width: 130px;
  flex-shrink: 0;
  background: var(--gray-bg);
}
.card-img img {
  width: 100%; height: 100%; object-fit: cover;
}
.card-iata {
  position: absolute; bottom: 8px; left: 8px;
  background: rgba(10,34,64,.75); color: #fff;
  font-size: 10px; font-weight: 700; letter-spacing: .1em;
  padding: 2px 7px; border-radius: 4px;
}
.card-body {
  flex: 1; padding: 14px 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.card-city { font-size: 17px; font-weight: 700; color: var(--navy); margin-bottom: 2px; }
.card-country { font-size: 12px; color: var(--gray-text); margin-bottom: 8px; }
.card-tags { display: flex; gap: 5px; flex-wrap: wrap; }
.tag {
  font-size: 11px; font-weight: 500; color: var(--blue);
  background: rgba(26,95,168,.08);
  padding: 2px 8px; border-radius: 999px;
}
.card-arrow {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--blue); display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background .15s;
}
.card-arrow:hover { background: var(--navy); }
</style>
