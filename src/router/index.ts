import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import Usuarios from '../components/Usuarios.vue'
import Empresas from '../components/Empresas.vue'
import Empleados from '../components/Empleados.vue'
import Planes from '../components/Planes.vue'
import Suscripciones from '../components/Suscripciones.vue'
import Pagos from '../components/Pagos.vue'
import Facturas from '../components/Facturas.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: Dashboard
            },
            {
                path: 'usuarios',
                name: 'Usuarios',
                component: Usuarios
            },
            {
                path: 'empresas',
                name: 'Empresas',
                component: Empresas
            },
            {
                path: 'empleados',
                name: 'Empleados',
                component: Empleados
            },
            {
                path: 'planes',
                name: 'Planes',
                component: Planes
            },
            {
                path: 'suscripciones',
                name: 'Suscripciones',
                component: Suscripciones
            },
            {
                path: 'pagos',
                name: 'Pagos',
                component: Pagos
            },
            {
                path: 'facturas',
                name: 'Facturas',
                component: Facturas
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Guard de navegación para verificar autenticación
router.beforeEach((to: any, _from: any, next: any) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Si la ruta requiere autenticación y el usuario no está autenticado
        next('/login')
    } else if (to.path === '/login' && isAuthenticated) {
        // Si el usuario ya está autenticado y trata de ir al login
        next('/')
    } else {
        next()
    }
})

export default router
