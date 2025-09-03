<template>
  <div class="fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Facturas</h1>
      <p class="text-gray-600">Gestiona todas las facturas emitidas</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filter-section mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Buscar</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Número de factura o usuario..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Estado</label>
          <select
            v-model="filtros.estado"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            <option value="emitida">Emitida</option>
            <option value="pagada">Pagada</option>
            <option value="vencida">Vencida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Rango de Fechas</label>
          <select
            v-model="filtros.rango"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="año">Este año</option>
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

    <!-- Tabla de facturas -->
    <div class="table-container">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Lista de Facturas ({{ facturasFiltradas.length }})
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
                Factura
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montos
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fechas
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="factura in facturasPaginadas" :key="factura.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ factura.numero_factura }}</div>
                <div class="text-sm text-gray-500">ID: {{ factura.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ getUsuarioNombre(factura.suscripcion_id) }}</div>
                <div class="text-sm text-gray-500">Suscripción #{{ factura.suscripcion_id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">Total: ${{ factura.total.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">
                  Subtotal: ${{ factura.subtotal.toLocaleString() }}
                  <span v-if="factura.impuestos > 0"> | Imp: ${{ factura.impuestos.toLocaleString() }}</span>
                  <span v-if="factura.descuentos > 0"> | Desc: ${{ factura.descuentos.toLocaleString() }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  Emisión: {{ formatDate(factura.fecha_emision) }}
                </div>
                <div class="text-sm text-gray-500">
                  Vencimiento: {{ formatDate(factura.fecha_vencimiento) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="status-badge"
                  :class="{
                    'bg-blue-100 text-blue-800': factura.estado === 'emitida',
                    'bg-green-100 text-green-800': factura.estado === 'pagada',
                    'bg-red-100 text-red-800': factura.estado === 'vencida',
                    'bg-gray-100 text-gray-800': factura.estado === 'cancelada'
                  }"
                >
                  {{ factura.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  v-if="factura.archivo_url"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Ver PDF
                </button>
                <button class="text-gray-600 hover:text-gray-900">
                  Detalles
                </button>
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
            {{ Math.min(paginaActual * itemsPorPagina, facturasFiltradas.length) }} de
            {{ facturasFiltradas.length }} resultados
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

interface Factura {
  id: number
  suscripcion_id: number
  pago_id?: number
  numero_factura: string
  fecha_emision: string
  fecha_vencimiento: string
  subtotal: number
  impuestos: number
  descuentos: number
  total: number
  estado: string
  notas?: string
  datos_facturacion?: Record<string, any>
  archivo_url?: string
  creado_en: string
  actualizado_en: string
}

const filtros = ref({
  busqueda: '',
  estado: '',
  rango: ''
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

const facturas = ref<Factura[]>([
  {
    id: 1,
    suscripcion_id: 1,
    pago_id: 1,
    numero_factura: 'FAC-2024-001',
    fecha_emision: '2024-01-01',
    fecha_vencimiento: '2024-01-31',
    subtotal: 79.99,
    impuestos: 0,
    descuentos: 0,
    total: 79.99,
    estado: 'pagada',
    archivo_url: '/facturas/fac-2024-001.pdf',
    creado_en: '2024-01-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    suscripcion_id: 2,
    pago_id: 2,
    numero_factura: 'FAC-2024-002',
    fecha_emision: '2024-01-15',
    fecha_vencimiento: '2024-02-14',
    subtotal: 29.99,
    impuestos: 0,
    descuentos: 2.99,
    total: 27.00,
    estado: 'pagada',
    archivo_url: '/facturas/fac-2024-002.pdf',
    creado_en: '2024-01-15T00:00:00Z',
    actualizado_en: '2024-01-15T00:00:00Z'
  },
  {
    id: 3,
    suscripcion_id: 3,
    pago_id: 3,
    numero_factura: 'FAC-2023-120',
    fecha_emision: '2023-12-01',
    fecha_vencimiento: '2023-12-31',
    subtotal: 199.99,
    impuestos: 0,
    descuentos: 0,
    total: 199.99,
    estado: 'pagada',
    archivo_url: '/facturas/fac-2023-120.pdf',
    creado_en: '2023-12-01T00:00:00Z',
    actualizado_en: '2023-12-01T00:00:00Z'
  },
  {
    id: 4,
    suscripcion_id: 4,
    pago_id: 4,
    numero_factura: 'FAC-2024-003',
    fecha_emision: '2024-01-01',
    fecha_vencimiento: '2024-12-31',
    subtotal: 299.99,
    impuestos: 0,
    descuentos: 50.99,
    total: 249.00,
    estado: 'pagada',
    archivo_url: '/facturas/fac-2024-003.pdf',
    creado_en: '2024-01-01T00:00:00Z',
    actualizado_en: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    suscripcion_id: 5,
    numero_factura: 'FAC-2023-121',
    fecha_emision: '2023-12-01',
    fecha_vencimiento: '2023-12-31',
    subtotal: 29.99,
    impuestos: 0,
    descuentos: 0,
    total: 29.99,
    estado: 'vencida',
    notas: 'Pago fallido - tarjeta vencida',
    creado_en: '2023-12-01T00:00:00Z',
    actualizado_en: '2023-12-01T00:00:00Z'
  },
  {
    id: 6,
    suscripcion_id: 1,
    numero_factura: 'FAC-2024-004',
    fecha_emision: '2024-02-01',
    fecha_vencimiento: '2024-02-29',
    subtotal: 79.99,
    impuestos: 0,
    descuentos: 0,
    total: 79.99,
    estado: 'emitida',
    creado_en: '2024-02-01T00:00:00Z',
    actualizado_en: '2024-02-01T00:00:00Z'
  }
])

const facturasFiltradas = computed(() => {
  return facturas.value.filter(factura => {
    const cumpleBusqueda = !filtros.value.busqueda || 
      factura.numero_factura.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      getUsuarioNombre(factura.suscripcion_id).toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    
    const cumpleEstado = !filtros.value.estado || 
      factura.estado === filtros.value.estado
    
    const cumpleRango = !filtros.value.rango || 
      cumpleRangoFecha(factura.fecha_emision, filtros.value.rango)
    
    return cumpleBusqueda && cumpleEstado && cumpleRango
  })
})

const totalPaginas = computed(() => {
  return Math.ceil(facturasFiltradas.value.length / itemsPorPagina.value)
})

const facturasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return facturasFiltradas.value.slice(inicio, fin)
})

const getUsuarioNombre = (suscripcionId: number) => {
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
    year: 'numeric'
  })
}

const cumpleRangoFecha = (fecha: string, rango: string) => {
  const fechaFactura = new Date(fecha)
  const hoy = new Date()
  
  switch (rango) {
    case 'hoy':
      return fechaFactura.toDateString() === hoy.toDateString()
    case 'semana':
      const inicioSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay()))
      return fechaFactura >= inicioSemana
    case 'mes':
      return fechaFactura.getMonth() === hoy.getMonth() && fechaFactura.getFullYear() === hoy.getFullYear()
    case 'año':
      return fechaFactura.getFullYear() === hoy.getFullYear()
    default:
      return true
  }
}

const limpiarFiltros = () => {
  filtros.value = {
    busqueda: '',
    estado: '',
    rango: ''
  }
  paginaActual.value = 1
}

onMounted(() => {
  console.log('Facturas cargadas')
})
</script>

