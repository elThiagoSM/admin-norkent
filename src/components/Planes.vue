<template>
  <div class="fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Planes</h1>
      <p class="text-gray-600">Gestiona los planes de suscripción disponibles</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filter-section mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Buscar</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Nombre del plan..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Estado</label>
          <select
            v-model="filtros.estado"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="limpiarFiltros"
            class="w-full btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de planes -->
    <div class="table-container">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Lista de Planes ({{ planesFiltrados.length }})
          </h3>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intervalo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Características
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="plan in planesFiltrados" :key="plan.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ plan.nombre }}</div>
                  <div class="text-sm text-gray-500">{{ plan.descripcion || 'Sin descripción' }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${{ plan.precio.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge bg-blue-100 text-blue-800">
                  {{ plan.intervalo }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  <div v-for="(value, key) in plan.caracteristicas" :key="key" class="mb-1">
                    <span class="font-medium">{{ key }}:</span> {{ value }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="status-badge"
                  :class="{
                    'bg-green-100 text-green-800': plan.estado === 'activo',
                    'bg-red-100 text-red-800': plan.estado === 'inactivo',
                    'bg-yellow-100 text-yellow-800': plan.estado === 'suspendido'
                  }"
                >
                  {{ plan.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(plan.creado_en) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Plan {
  id: number
  nombre: string
  descripcion?: string
  precio: number
  intervalo: string
  caracteristicas: Record<string, any>
  estado: string
  creado_en: string
  actualizado_en: string
}

const filtros = ref({
  busqueda: '',
  estado: ''
})

// Datos de ejemplo
const planes = ref<Plan[]>([
  {
    id: 1,
    nombre: 'Plan Básico',
    descripcion: 'Perfecto para pequeñas empresas',
    precio: 29.99,
    intervalo: 'mensual',
    caracteristicas: {
      'Usuarios': '5',
      'Almacenamiento': '10GB',
      'Soporte': 'Email'
    },
    estado: 'activo',
    creado_en: '2024-01-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    nombre: 'Plan Profesional',
    descripcion: 'Ideal para empresas en crecimiento',
    precio: 79.99,
    intervalo: 'mensual',
    caracteristicas: {
      'Usuarios': '25',
      'Almacenamiento': '100GB',
      'Soporte': 'Chat + Email',
      'Integraciones': 'API'
    },
    estado: 'activo',
    creado_en: '2024-01-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    nombre: 'Plan Empresarial',
    descripcion: 'Para grandes organizaciones',
    precio: 199.99,
    intervalo: 'mensual',
    caracteristicas: {
      'Usuarios': 'Ilimitados',
      'Almacenamiento': '1TB',
      'Soporte': '24/7',
      'Integraciones': 'API + Webhooks',
      'Seguridad': 'Avanzada'
    },
    estado: 'activo',
    creado_en: '2024-01-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    nombre: 'Plan Anual Básico',
    descripcion: 'Plan básico con descuento anual',
    precio: 299.99,
    intervalo: 'anual',
    caracteristicas: {
      'Usuarios': '5',
      'Almacenamiento': '10GB',
      'Soporte': 'Email',
      'Descuento': '17%'
    },
    estado: 'activo',
    creado_en: '2024-01-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    nombre: 'Plan Prueba',
    descripcion: 'Plan de prueba temporal',
    precio: 0,
    intervalo: 'mensual',
    caracteristicas: {
      'Usuarios': '2',
      'Almacenamiento': '1GB',
      'Soporte': 'Email',
      'Duración': '14 días'
    },
    estado: 'inactivo',
    creado_en: '2024-01-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  }
])

const planesFiltrados = computed(() => {
  return planes.value.filter(plan => {
    const cumpleBusqueda = !filtros.value.busqueda || 
      plan.nombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    
    const cumpleEstado = !filtros.value.estado || 
      plan.estado === filtros.value.estado
    
    return cumpleBusqueda && cumpleEstado
  })
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    estado: ''
  }
}

onMounted(() => {
  console.log('Planes cargados')
})
</script>

