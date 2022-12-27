// Home
import Home from './home/pages/Home.vue'

// User
import Login from './user/pages/Login.vue'
import SignUp from './user/pages/SignUp.vue'
import Settings from './user/pages/Settings.vue'

// Channels
import App from './app/pages/App.vue'

// Invite
import Invite from './servers/pages/Invite.vue'

// Server Finder
import Servers from './servers/pages/Servers.vue'

import * as VueRouter from 'vue-router'

const routes = [
  // Home
  { path: '/', component: Home },

  // User
  { path: "/login", component: Login },
  { path: "/signup", component: SignUp },
  { path: "/settings", component: Settings },

  // Channels
  { path: "/app", component: App },
  
  // Invite
  { path: "/i/:id", component: Invite },

  // Server Finder
  { path: "/servers", component: Servers }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {

    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth',
        offset: { y: 80 }
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.afterEach((to, from, fail) => {
  if(fail)
    console.log(fail)
})

export default router
