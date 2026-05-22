import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import { createNotivue } from 'notivue'
import App from './App.vue'
import router from './router'

import './assets/css/estilos.css'
import 'notivue/notification.css'
import 'notivue/animations.css'

// Crear la app
const app = createApp(App)
const notivue = createNotivue({
  position: 'top-right',
  limit: 4,
  enqueue: true,
})

// Usar router
app.use(router)
app.use(MotionPlugin)
app.use(notivue)

// Montar la app
app.mount('#app')
