import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login/Login.vue'
import Dashboard from '../components/Dashboard/Index.vue'
import Users from '../components/Users/User.vue'
import Request from '../components/Requests/Index.vue'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Login,
      meta: {
        showMenu: false
      }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: {
        showMenu: true
      }
    },
    {
      path: '/users',
      component: Users,
      meta: {
        showMenu: true
      }
    },
    {
      path: '/requests',
      component: Request,
      meta: {
        showMenu: true
      }
    },
  ]
});

export default router;