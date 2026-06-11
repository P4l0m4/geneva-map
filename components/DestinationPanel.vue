<template>
  <Transition name="panel">
    <div v-if="destination" class="panel-overlay" @click.self="$emit('close')">
      <div class="panel">
        <button class="panel-close" @click="$emit('close')" aria-label="Fermer">✕</button>
        <div class="panel-hero">
          <img :src="destination.cover" :alt="destination.name" />
          <div class="panel-overlay-text">
            <span class="panel-country">{{ destination.country }}</span>
            <h2 class="panel-city">{{ destination.name }}</h2>
            <div class="panel-iata">
              <span v-for="code in destination.iata" :key="code" class="iata-badge">{{ code }}</span>
            </div>
          </div>
        </div>
        <div class="panel-body">
          <div class="panel-tags">
            <span v-for="tag in destination.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <!-- Strip HTML tags from description -->
          <div class="panel-desc" v-html="destination.description" />
          <a
            :href="`https://www.gva.ch/fr/destinations/${destination.slug}`"
            target="_blank"
            rel="noopener"
            class="panel-cta"
          >
            Voir les vols vers {{ destination.name }}
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Destination } from '~/composables/useDestinations'
defineProps<{ destination: Destination | null }>()
defineEmits<{ (e: 'close'): void }>()
</script>

<style scoped>
.panel-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(10,34,64,.45);
  display: flex; align-items: flex-start; justify-content: flex-end;
}
.panel {
  width: 420px; height: 100vh; overflow-y: auto;
  background: var(--white);
  box-shadow: -8px 0 40px rgba(10,34,64,.2);
  position: relative;
}
.panel-close {
  position: absolute; top: 14px; right: 14px; z-index: 10;
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(10,34,64,.6); color: white;
  font-size: 14px; display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.panel-close:hover { background: rgba(10,34,64,.9); }
.panel-hero { position: relative; height: 240px; overflow: hidden; }
.panel-hero img { width: 100%; height: 100%; object-fit: cover; }
.panel-overlay-text {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(10,34,64,.85));
  padding: 40px 24px 20px;
}
.panel-country { font-size: 12px; font-weight: 500; color: rgba(255,255,255,.7); text-transform: uppercase; letter-spacing: .08em; }
.panel-city { font-size: 28px; font-weight: 800; color: white; line-height: 1.1; }
.panel-iata { display: flex; gap: 6px; margin-top: 8px; }
.iata-badge {
  background: rgba(255,255,255,.2); color: white;
  font-size: 11px; font-weight: 700; letter-spacing: .1em;
  padding: 3px 9px; border-radius: 4px;
}
.panel-body { padding: 24px; }
.panel-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
.tag {
  font-size: 12px; font-weight: 500; color: var(--blue);
  background: rgba(26,95,168,.08);
  padding: 4px 10px; border-radius: 999px;
}
.panel-desc {
  font-size: 14px; line-height: 1.65; color: var(--text);
  margin-bottom: 24px;
}
.panel-desc :deep(p) { margin-bottom: 10px; }
.panel-desc :deep(p:last-child) { margin-bottom: 0; }
.panel-cta {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--blue); color: white;
  font-size: 14px; font-weight: 600;
  padding: 13px 24px; border-radius: 10px;
  transition: background .15s;
}
.panel-cta:hover { background: var(--navy); }

.panel-enter-active, .panel-leave-active { transition: all .3s ease; }
.panel-enter-from, .panel-leave-to { opacity: 0; }
.panel-enter-from .panel, .panel-leave-to .panel { transform: translateX(40px); }
</style>
