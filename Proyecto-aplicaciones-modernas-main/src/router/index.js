import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Registration from '@/views/Registration.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Registration }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router