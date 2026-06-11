export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      smartvelKey: 'cf99d851-8d40-4545-8362-ecf283c8d63d',
      smartvelBase: 'https://api.smartvel.com/v3',
      geoJsonUrl: 'https://cdn.smartvel.com/data/geo/sm_world_map.json'
    }
  },
  app: {
    head: {
      title: 'Genève Aéroport – Vols & Destinations',
      meta: [{ name: 'description', content: 'Explorez toutes les destinations au départ de Genève' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  }
})
