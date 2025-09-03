<template>
  <div class="fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Pagos</h1>
      <p class="text-gray-600">Gestiona todos los pagos realizados</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filter-section mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Buscar</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Referencia o usuario..."
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
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="fallido">Fallido</option>
            <option value="reembolsado">Reembolsado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Método</label>
          <select
            v-model="filtros.metodo"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="tarjeta_credito">Tarjeta de Crédito</option>
            <option value="tarjeta_debito">Tarjeta de Débito</option>
            <option value="transferencia">Transferencia</option>
            <option value="paypal">PayPal</option>
            <option value="efectivo">Efectivo</option>
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

    <!-- Tabla de pagos -->
    <div class="table-container">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Lista de Pagos ({{ pagosFiltrados.length }})
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
                Pago
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="pago in pagosPaginados" :key="pago.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ pago.id }}</div>
                <div class="text-sm text-gray-500" v-if="pago.referencia_externa">
                  Ref: {{ pago.referencia_externa }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ getUsuarioNombre(pago.suscripcion_id) }}</div>
                <div class="text-sm text-gray-500">Suscripción #{{ pago.suscripcion_id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${{ pago.monto.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge bg-blue-100 text-blue-800">
                  {{ pago.metodo_pago }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="status-badge"
                  :class="{
                    'bg-green-100 text-green-800': pago.estado === 'completado',
                    'bg-yellow-100 text-yellow-800': pago.estado === 'pendiente',
                    'bg-red-100 text-red-800': pago.estado === 'fallido',
                    'bg-gray-100 text-gray-800': pago.estado === 'reembolsado'
                  }"
                >
                  {{ pago.estado }}
                </span>
                <div class="text-xs text-gray-500 mt-1" v-if="pago.intentos > 0">
                  Intentos: {{ pago.intentos }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(pago.fecha_pago) }}</div>
                <div class="text-sm text-gray-500" v-if="pago.ultimo_intento">
                  Último intento: {{ formatDate(pago.ultimo_intento) }}
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
            {{ Math.min(paginaActual * itemsPorPagina, pagosFiltrados.length) }} de
            {{ pagosFiltrados.length }} resultados
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

interface Pago {
  id: number
  suscripcion_id: number
  monto: number
  fecha_pago: string
  metodo_pago: string
  estado: string
  referencia_externa?: string
  datos_pago?: Record<string, any>
  intentos: number
  ultimo_intento?: string
  creado_en: string
  actualizado_en: string
}

const filtros = ref({
  busqueda: '',
  estado: '',
  metodo: ''
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

const pagos = ref<Pago[]>([
  {
    id: 1,
    suscripcion_id: 1,
    monto: 79.99,
    fecha_pago: '2024-01-01T10:30:00Z',
    metodo_pago: 'tarjeta_credito',
    estado: 'completado',
    referencia_externa: 'TXN123456789',
    intentos: 1,
    creado_en: '2024-01-01T10:30:00Z',
    actualizado_en: '2024-01-01T10:30:00Z'
  },
  {
    id: 2,
    suscripcion_id: 2,
    monto: 29.99,
    fecha_pago: '2024-01-15T14:45:00Z',
    metodo_pago: 'paypal',
    estado: 'completado',
    referencia_externa: 'PP987654321',
    intentos: 1,
    creado_en: '2024-01-15T14:45:00Z',
    actualizado_en: '2024-01-15T14:45:00Z'
  },
  {
    id: 3,
    suscripcion_id: 3,
    monto: 199.99,
    fecha_pago: '2023-12-01T09:15:00Z',
    metodo_pago: 'transferencia',
    estado: 'completado',
    referencia_externa: 'TRF456789123',
    intentos: 1,
    creado_en: '2023-12-01T09:15:00Z',
    actualizado_en: '2023-12-01T09:15:00Z'
  },
  {
    id: 4,
    suscripcion_id: 4,
    monto: 299.99,
    fecha_pago: '2024-01-01T16:20:00Z',
    metodo_pago: 'tarjeta_credito',
    estado: 'completado',
    referencia_externa: 'TXN789123456',
    intentos: 1,
    creado_en: '2024-01-01T16:20:00Z',
    actualizado_en: '2024-01-01T16:20:00Z'
  },
  {
    id: 5,
    suscripcion_id: 5,
    monto: 29.99,
    fecha_pago: '2023-12-01T11:30:00Z',
    metodo_pago: 'tarjeta_debito',
    estado: 'fallido',
    referencia_externa: 'TXN321654987',
    intentos: 3,
    ultimo_intento: '2023-12-01T11:35:00Z',
    creado_en: '2023-12-01T11:30:00Z',
    actualizado_en: '2023-12-01T11:35:00Z'
  },
  {
    id: 6,
    suscripcion_id: 1,
    monto: 79.99,
    fecha_pago: '2024-02-01T10:30:00Z',
    metodo_pago: 'tarjeta_credito',
    estado: 'pendiente',
    referencia_externa: 'TXN654987321',
    intentos: 0,
    creado_en: '2024-02-01T10:30:00Z',
    actualizado_en: '2024-02-01T10:30:00Z'
  }
])

const pagosFiltrados = computed(() => {
  return pagos.value.filter(pago => {
    const cumpleBusqueda = !filtros.value.busqueda || 
      pago.referencia_externa?.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      getUsuarioNombre(pago.suscripcion_id).toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    
    const cumpleEstado = !filtros.value.estado || 
      pago.estado === filtros.value.estado
    
    const cumpleMetodo = !filtros.value.metodo || 
      pago.metodo_pago === filtros.value.metodo
    
    return cumpleBusqueda && cumpleEstado && cumpleMetodo
  })
})

const totalPaginas = computed(() => {
  return Math.ceil(pagosFiltrados.value.length / itemsPorPagina.value)
})

const pagosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return pagosFiltrados.value.slice(inicio, fin)
})

const getUsuarioNombre = (suscripcionId: number) => {
  // En un proyecto real, esto vendría de una relación con la base de datos
  const usuarioMap: Record<number, string> = {
    1: 'Juan Pérez',
    2: 'María García',
    3: 'Carlos López',
    4: 'Ana Martínez',
    5: 'Luis Rodríguez'
  }
  return usuarioMap[suscripcionId] || 'Usuario no encontrado'
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'No especificado'
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
    estado: '',
    metodo: ''
  }
  paginaActual.value = 1
}

onMounted(() => {
  console.log('Pagos cargados')
})
</script>

