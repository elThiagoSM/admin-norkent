<template>
  <div class="fade-in">
    <!-- Header del Dashboard -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Resumen general del sistema</p>
    </div>

    <!-- Cards de estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dashboard-card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Usuarios</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.usuarios }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dashboard-card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Empresas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.empresas }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dashboard-card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Empleados</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.empleados }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 dashboard-card">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Suscripciones Activas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.suscripciones }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos y tablas recientes -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Usuarios recientes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 dashboard-card">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Usuarios Recientes</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="usuario in usuariosRecientes" :key="usuario.id" class="flex items-center space-x-3 table-row-hover p-2 rounded-lg">
              <img :src="usuario.imagen_url" :alt="usuario.nombre" class="w-10 h-10 rounded-full">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ usuario.nombre }}</p>
                <p class="text-sm text-gray-500 truncate">{{ usuario.correo }}</p>
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(usuario.creado_en) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empresas recientes -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 dashboard-card">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Empresas Recientes</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="empresa in empresasRecientes" :key="empresa.id" class="flex items-center space-x-3 table-row-hover p-2 rounded-lg">
              <img :src="empresa.logo_url" :alt="empresa.nombre" class="w-10 h-10 rounded-lg">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ empresa.nombre }}</p>
                <p class="text-sm text-gray-500 truncate">{{ empresa.codigo_identificador }}</p>
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(empresa.creado_en) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen de pagos -->
    <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 dashboard-card">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Resumen de Pagos</h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 rounded-lg bg-green-50">
            <p class="text-2xl font-bold text-green-600">${{ stats.ingresosMes }}</p>
            <p class="text-sm text-gray-600">Ingresos del Mes</p>
          </div>
          <div class="text-center p-4 rounded-lg bg-blue-50">
            <p class="text-2xl font-bold text-blue-600">{{ stats.pagosPendientes }}</p>
            <p class="text-sm text-gray-600">Pagos Pendientes</p>
          </div>
          <div class="text-center p-4 rounded-lg bg-red-50">
            <p class="text-2xl font-bold text-red-600">{{ stats.facturasVencidas }}</p>
            <p class="text-sm text-gray-600">Facturas Vencidas</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Datos de ejemplo (en un proyecto real vendrían de una API)
const stats = ref({
  usuarios: 1247,
  empresas: 89,
  empleados: 3456,
  suscripciones: 234,
  ingresosMes: '45,230',
  pagosPendientes: 12,
  facturasVencidas: 3
})

const usuariosRecientes = ref([
  {
    id: 1,
    nombre: 'Juan Pérez',
    correo: 'juan.perez@email.com',
    imagen_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/foto-perfil-default_yfjzx4.webp',
    creado_en: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    nombre: 'María García',
    correo: 'maria.garcia@email.com',
    imagen_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/foto-perfil-default_yfjzx4.webp',
    creado_en: '2024-01-14T15:45:00Z'
  },
  {
    id: 3,
    nombre: 'Carlos López',
    correo: 'carlos.lopez@email.com',
    imagen_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/foto-perfil-default_yfjzx4.webp',
    creado_en: '2024-01-13T09:20:00Z'
  }
])

const empresasRecientes = ref([
  {
    id: 1,
    nombre: 'TechCorp Solutions',
    codigo_identificador: 'TC01',
    logo_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    creado_en: '2024-01-15T08:15:00Z'
  },
  {
    id: 2,
    nombre: 'InnovateLab',
    codigo_identificador: 'IL02',
    logo_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    creado_en: '2024-01-14T14:30:00Z'
  },
  {
    id: 3,
    nombre: 'DigitalWorks',
    codigo_identificador: 'DW03',
    logo_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    creado_en: '2024-01-13T11:45:00Z'
  }
])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(() => {
  // Aquí se cargarían los datos reales desde la API
  console.log('Dashboard cargado')
})
</script>

