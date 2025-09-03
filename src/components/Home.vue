<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">Admin Norkent</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">Bienvenido, Admin</span>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
            :class="[
              $route.path === item.href
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigationItems = [
  { name: 'Dashboard', href: '/' },
  { name: 'Usuarios', href: '/usuarios' },
  { name: 'Empresas', href: '/empresas' },
  { name: 'Empleados', href: '/empleados' },
  { name: 'Planes', href: '/planes' },
  { name: 'Suscripciones', href: '/suscripciones' },
  { name: 'Pagos', href: '/pagos' },
  { name: 'Facturas', href: '/facturas' }
]

const handleLogout = () => {
  // Limpiar cualquier dato de sesión
  localStorage.removeItem('isAuthenticated')
  // Redirigir al login
  router.push('/login')
}
</script>
