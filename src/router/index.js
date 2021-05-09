import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth from '../views/Auth.vue'
import Register from '../components/Register.vue'
import PageNotFound from '../components/PageNotFound.vue'
import UserMain from '../components/UserMain.vue'
import RepMain from '../components/RepMain.vue'
import AdminMain from '../components/AdminMain.vue'
import BecomeRep from '../components/BecomeRep.vue'
import RepetitorInfo from '../components/RepetitorInfo.vue'
import RepetitorGraph from '../components/RepetitorGraph.vue'
import UserSub from '../components/UserSub.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/user-main',
    name: 'UserMain',
    component: UserMain
  },
  {
    path: '/rep-main',
    name: 'RepMain',
    component: RepMain
  },
  {
    path: '/admin-main',
    name: 'AdminMain',
    component: AdminMain
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  },
  {
    path: '/become-rep',
    name: 'BecomeRep',
    component: BecomeRep
  },
  {
    path: '/userSub',
    name: 'UserSub',
    component: UserSub
  },
  { 
    path: '/repetitor/:id',
    component: RepetitorInfo,
    props: route => ({ idRep: route.params.id }), 
  },
  { 
    path: '/repGraph/:id',
    component: RepetitorGraph,
    props: route => ({ idRep: route.params.id }), 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const allowedRoutes = [
  "/login",
  "/register"
]

router.beforeEach(async function(to, from, next) {

  if (!allowedRoutes.includes(to.path)) {
    
    if (localStorage.getItem('user')) {
      next();
    }
    else next('/login');
  }
  else next();
})

export default router
