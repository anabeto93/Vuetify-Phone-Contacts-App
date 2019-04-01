import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Home from '@/components/Home'

Vue.use(Router)

let router = new Router({
    routes: [
        {
            path: '/signup',
            name: 'signup',
            component: SignUp
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/logout',
            name: 'logout',
            component: Logout
        },
        {
            path: '/home',
            name: 'home',
            component: Home
        }
    ]
})

const guestRoutes = ['login','signup'];
router.beforeEach((to, from, next) => {
    console.log('Coming from ',from.name,' and going to ',to.name)
    if(!window.token) {
        window.token = localStorage.getItem('token')
    }
    if(guestRoutes.includes(to.name)) {
        next()
    }else if(window.token) {
        next()
    }else {
        next('/login')
    }
})

export default router