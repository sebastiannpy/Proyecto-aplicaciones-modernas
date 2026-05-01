import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/css/estilos.css'

// Crear la app
const app = createApp(App)

// Usar router
app.use(router)

// Montar la app
app.mount('#app')