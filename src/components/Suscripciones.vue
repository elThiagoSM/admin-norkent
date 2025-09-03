<template>
  <div class="fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Suscripciones</h1>
      <p class="text-gray-600">Gestiona todas las suscripciones de usuarios</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filter-section mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Buscar</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Usuario o plan..."
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
            <option value="activa">Activa</option>
            <option value="cancelada">Cancelada</option>
            <option value="vencida">Vencida</option>
            <option value="suspendida">Suspendida</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Renovación</label>
          <select
            v-model="filtros.renovacion"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            <option value="true">Automática</option>
            <option value="false">Manual</option>
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

    <!-- Tabla de suscripciones -->
    <div class="table-container">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Lista de Suscripciones ({{ suscripcionesFiltradas.length }})
          </h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">Mostrar:</span>
            <select
              v-model="itemsPorPagina"
              class="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Próximo Pago
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="suscripcion in suscripcionesPaginadas" :key="suscripcion.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ getUsuarioNombre(suscripcion.usuario_id) }}</div>
                <div class="text-sm text-gray-500">ID: {{ suscripcion.usuario_id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ getPlanNombre(suscripcion.plan_id) }}</div>
                <div class="text-sm text-gray-500" v-if="suscripcion.descuento_porcentaje > 0">
                  Descuento: {{ suscripcion.descuento_porcentaje }}%
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${{ suscripcion.precio_acordado.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  Inicio: {{ formatDate(suscripcion.fecha_inicio) }}
                </div>
                <div class="text-sm text-gray-500" v-if="suscripcion.fecha_fin">
                  Fin: {{ formatDate(suscripcion.fecha_fin) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="status-badge"
                  :class="{
                    'bg-green-100 text-green-800': suscripcion.estado === 'activa',
                    'bg-red-100 text-red-800': suscripcion.estado === 'cancelada',
                    'bg-yellow-100 text-yellow-800': suscripcion.estado === 'vencida',
                    'bg-gray-100 text-gray-800': suscripcion.estado === 'suspendida'
                  }"
                >
                  {{ suscripcion.estado }}
                </span>
                <div class="text-xs text-gray-500 mt-1" v-if="suscripcion.renovacion_automatica">
                  Renovación automática
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900" v-if="suscripcion.proximo_pago">
                  {{ formatDate(suscripcion.proximo_pago) }}
                </div>
                <div class="text-sm text-gray-500" v-else>
                  No programado
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando {{ (paginaActual - 1) * itemsPorPagina + 1 }} a
            {{ Math.min(paginaActual * itemsPorPagina, suscripcionesFiltradas.length) }} de
            {{ suscripcionesFiltradas.length }} resultados
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="paginaActual = Math.max(1, paginaActual - 1)"
              :disabled="paginaActual === 1"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span class="px-3 py-1 text-sm text-gray-700">
              Página {{ paginaActual }} de {{ totalPaginas }}
            </span>
            <button
              @click="paginaActual = Math.min(totalPaginas, paginaActual + 1)"
              :disabled="paginaActual === totalPaginas"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Suscripcion {
  id: number
  usuario_id: number
  plan_id: number
  estado: string
  fecha_inicio: string
  fecha_fin?: string
  proximo_pago?: string
  precio_acordado: number
  descuento_porcentaje: number
  cancelada_en?: string
  razon_cancelacion?: string
  renovacion_automatica: boolean
  creado_en: string
  actualizado_en: string
}

const filtros = ref({
  busqueda: '',
  estado: '',
  renovacion: ''
})

const itemsPorPagina = ref(25)
const paginaActual = ref(1)

// Datos de ejemplo
const usuarios = ref([
  { id: 1, nombre: 'Juan Pérez' },
  { id: 2, nombre: 'María García' },
  { id: 3, nombre: 'Carlos López' },
  { id: 4, nombre: 'Ana Martínez' },
  { id: 5, nombre: 'Luis Rodríguez' }
])

const planes = ref([
  { id: 1, nombre: 'Plan Básico' },
  { id: 2, nombre: 'Plan Profesional' },
  { id: 3, nombre: 'Plan Empresarial' },
  { id: 4, nombre: 'Plan Anual Básico' }
])

const suscripciones = ref<Suscripcion[]>([
  {
    id: 1,
    usuario_id: 1,
    plan_id: 2,
    estado: 'activa',
    fecha_inicio: '2024-01-01',
    proximo_pago: '2024-02-01',
    precio_acordado: 79.99,
    descuento_porcentaje: 0,
    renovacion_automatica: true,
    creado_en: '2024-01-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    usuario_id: 2,
    plan_id: 1,
    estado: 'activa',
    fecha_inicio: '2024-01-15',
    proximo_pago: '2024-02-15',
    precio_acordado: 29.99,
    descuento_porcentaje: 10,
    renovacion_automatica: true,
    creado_en: '2024-01-15T00:00:00Z',
    actualizado_en: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    usuario_id: 3,
    plan_id: 3,
    estado: 'cancelada',
    fecha_inicio: '2023-12-01',
    fecha_fin: '2024-01-01',
    precio_acordado: 199.99,
    descuento_porcentaje: 0,
    cancelada_en: '2024-01-01T00:00:00Z',
    razon_cancelacion: 'Cambio de plan',
    renovacion_automatica: false,
    creado_en: '2023-12-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    usuario_id: 4,
    plan_id: 4,
    estado: 'activa',
    fecha_inicio: '2024-01-01',
    proximo_pago: '2025-01-01',
    precio_acordado: 299.99,
    descuento_porcentaje: 17,
    renovacion_automatica: true,
    creado_en: '2024-01-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    usuario_id: 5,
    plan_id: 1,
    estado: 'vencida',
    fecha_inicio: '2023-12-01',
    fecha_fin: '2024-01-01',
    precio_acordado: 29.99,
    descuento_porcentaje: 0,
    renovacion_automatica: false,
    creado_en: '2023-12-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  }
])

const suscripcionesFiltradas = computed(() => {
  return suscripciones.value.filter(suscripcion => {
    const usuarioNombre = getUsuarioNombre(suscripcion.usuario_id)
    const planNombre = getPlanNombre(suscripcion.plan_id)
    
    const cumpleBusqueda = !filtros.value.busqueda || 
      usuarioNombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      planNombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    
    const cumpleEstado = !filtros.value.estado || 
      suscripcion.estado === filtros.value.estado
    
    const cumpleRenovacion = !filtros.value.renovacion || 
      suscripcion.renovacion_automatica.toString() === filtros.value.renovacion
    
    return cumpleBusqueda && cumpleEstado && cumpleRenovacion
  })
})

const totalPaginas = computed(() => {
  return Math.ceil(suscripcionesFiltradas.value.length / itemsPorPagina.value)
})

const suscripcionesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return suscripcionesFiltradas.value.slice(inicio, fin)
})

const getUsuarioNombre = (usuarioId: number) => {
  const usuario = usuarios.value.find(u => u.id === usuarioId)
  return usuario ? usuario.nombre : 'Usuario no encontrado'
}

const getPlanNombre = (planId: number) => {
  const plan = planes.value.find(p => p.id === planId)
  return plan ? plan.nombre : 'Plan no encontrado'
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'No especificado'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    estado: '',
    renovacion: ''
  }
  paginaActual.value = 1
}

onMounted(() => {
  console.log('Suscripciones cargadas')
})
</script>

