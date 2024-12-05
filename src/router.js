import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import MixedDraw from './components/MixedDraw.vue'
import StarLevelDraw from './components/StarLevelDraw.vue'
import DescriptionDraw from './components/DescriptionDraw.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/mixed-draw', component: MixedDraw },
  { path: '/star-level-draw', component: StarLevelDraw },
  { path: '/description-draw', component: DescriptionDraw },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
