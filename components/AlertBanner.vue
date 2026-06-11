<template>
  <Transition name="slide">
    <div v-if="visible" class="alert">
      <span class="alert-icon">⚠</span>
      <span class="alert-text">Perturbations liées aux travaux — des modifications de terminaux sont possibles</span>
      <button class="alert-close" @click="visible = false" aria-label="Fermer">✕</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const visible = ref(true)
</script>

<style scoped>
.alert {
  background: var(--red);
  color: #fff;
  padding: 9px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  font-weight: 500;
}
.alert-icon { font-size: 15px; flex-shrink: 0; }
.alert-text { flex: 1; }
.alert-close {
  color: #fff;
  opacity: .75;
  font-size: 14px;
  padding: 4px 8px;
  transition: opacity .15s;
}
.alert-close:hover { opacity: 1; }

.slide-enter-active, .slide-leave-active { transition: all .25s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; }
.slide-enter-to, .slide-leave-from { max-height: 60px; opacity: 1; }
</style>
