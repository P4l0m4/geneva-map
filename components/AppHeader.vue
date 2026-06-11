<template>
  <header class="header">
    <div class="inner">
      <a href="/" class="logo">
        <div class="logo-main">GENÈVE</div>
        <div class="logo-sub">AÉROPORT</div>
      </a>
      <nav class="nav">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="nav-link" active-class="active">
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="actions">
        <button class="icon-btn" aria-label="Rechercher">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.7"/>
            <path d="M13 13l3.5 3.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="icon-btn" aria-label="Mon compte">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.7"/>
            <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const navItems = [
  { label: 'Vols & destinations', to: '/' },
  { label: 'Accès & transports', to: '/transports' },
  { label: 'Préparation voyage', to: '/preparation' },
  { label: 'Commerces & services', to: '/commerces' },
]
</script>

<style scoped>
.header {
  background: var(--white);
  border-bottom: 1px solid var(--gray-border);
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 1px 8px rgba(10,34,64,.06);
}
.inner {
  max-width: 1280px; margin: 0 auto; padding: 0 32px;
  height: 66px; display: flex; align-items: center; gap: 32px;
}
.logo { flex-shrink: 0; line-height: 1; }
.logo-main { font-size: 22px; font-weight: 800; color: var(--navy); letter-spacing: .06em; }
.logo-sub { font-size: 8.5px; font-weight: 700; color: var(--blue); letter-spacing: .22em; margin-top: 1px; }
.nav { display: flex; flex: 1; gap: 2px; }
.nav-link {
  padding: 0 14px; height: 66px; display: flex; align-items: center;
  font-size: 14px; font-weight: 500; color: var(--navy);
  border-bottom: 2.5px solid transparent;
  transition: color .15s, border-color .15s;
  white-space: nowrap;
}
.nav-link:hover { color: var(--blue); }
.nav-link.active { color: var(--blue); border-bottom-color: var(--blue); font-weight: 600; }
.actions { display: flex; gap: 4px; margin-left: auto; }
.icon-btn {
  width: 40px; height: 40px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: var(--navy); transition: background .15s, color .15s;
}
.icon-btn:hover { background: var(--gray-bg); color: var(--blue); }
</style>
