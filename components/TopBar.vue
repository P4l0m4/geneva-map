<template>
  <div class="topbar">
    <div class="inner">
      <nav class="audience">
        <button
          v-for="tab in tabs" :key="tab"
          class="tab" :class="{ active: active === tab }"
          @click="active = tab"
        >{{ tab }}</button>
      </nav>
      <div class="lang">
        <button class="lang-btn active">FR</button>
        <span class="sep">|</span>
        <button class="lang-btn">EN</button>
        <button class="lang-btn">DE</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const tabs = ['Passagers', 'Professionnels', 'Aéroport']
const active = ref('Passagers')
</script>

<style scoped>
.topbar { background: var(--navy); }
.inner {
  max-width: 1280px; margin: 0 auto; padding: 0 32px;
  height: 40px; display: flex; align-items: center; justify-content: space-between;
}
.audience { display: flex; gap: 2px; }
.tab {
  padding: 0 14px; height: 40px; font-size: 12.5px; font-weight: 500;
  color: rgba(255,255,255,.65); border-bottom: 2px solid transparent;
  transition: color .15s, border-color .15s;
}
.tab.active { color: #fff; border-bottom-color: #fff; }
.tab:hover:not(.active) { color: rgba(255,255,255,.9); }
.lang { display: flex; align-items: center; gap: 6px; }
.lang-btn { font-size: 12px; font-weight: 600; color: rgba(255,255,255,.5); transition: color .15s; }
.lang-btn.active { color: #fff; }
.lang-btn:hover { color: rgba(255,255,255,.9); }
.sep { color: rgba(255,255,255,.2); font-size: 11px; }
</style>
