import { createRouter, createWebHashHistory } from 'vue-router'
import EthersExample from '../views/EthersExample.vue'

const routes = [
  {
    path: '/',
    name: 'ethers',
    component: EthersExample
  },
  {
    path: '/web3',
    name: 'web3',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Web3Example.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
