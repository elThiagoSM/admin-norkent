<template>
  <div class="fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Empleados</h1>
      <p class="text-gray-600">Gestiona todos los empleados de las empresas</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filter-section mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Buscar</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Nombre o documento..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Estado</label>
          <select
            v-model="filtros.activo"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Empresa</label>
          <select
            v-model="filtros.empresa"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
              {{ empresa.nombre }}
            </option>
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

    <!-- Tabla de empleados -->
    <div class="table-container">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Lista de Empleados ({{ empleadosFiltrados.length }})
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
                Empleado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puesto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fechas
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="empleado in empleadosPaginados" :key="empleado.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="empleado.foto_url"
                    :alt="empleado.nombre"
                    class="h-10 w-10 rounded-full"
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ empleado.nombre }}</div>
                    <div class="text-sm text-gray-500">{{ empleado.correo }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ empleado.documento_identidad }}</div>
                <div class="text-sm text-gray-500">{{ empleado.celular || 'Sin celular' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getEmpresaNombre(empleado.empresa_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getPuestoNombre(empleado.puesto_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  Ingreso: {{ formatDate(empleado.fecha_ingreso) }}
                </div>
                <div class="text-sm text-gray-500" v-if="empleado.fecha_egreso">
                  Egreso: {{ formatDate(empleado.fecha_egreso) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="status-badge"
                  :class="empleado.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ empleado.activo ? 'Activo' : 'Inactivo' }}
                </span>
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
            {{ Math.min(paginaActual * itemsPorPagina, empleadosFiltrados.length) }} de
            {{ empleadosFiltrados.length }} resultados
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

interface Empleado {
  id: number
  empresa_id: number
  puesto_id: number
  documento_identidad: string
  nombre: string
  correo: string
  celular?: string
  fecha_ingreso: string
  fecha_egreso?: string
  foto_url: string
  activo: boolean
  creado_en: string
}

interface Empresa {
  id: number
  nombre: string
}

interface Puesto {
  id: number
  nombre: string
}

const filtros = ref({
  busqueda: '',
  activo: '',
  empresa: ''
})

const itemsPorPagina = ref(25)
const paginaActual = ref(1)

// Datos de ejemplo
const empresas = ref<Empresa[]>([
  { id: 1, nombre: 'TechCorp Solutions' },
  { id: 2, nombre: 'InnovateLab' },
  { id: 3, nombre: 'DigitalWorks' },
  { id: 4, nombre: 'StartupHub' },
  { id: 5, nombre: 'CloudTech' }
])

const puestos = ref<Puesto[]>([
  { id: 1, nombre: 'Desarrollador' },
  { id: 2, nombre: 'Diseñador' },
  { id: 3, nombre: 'Gerente' },
  { id: 4, nombre: 'Analista' },
  { id: 5, nombre: 'Asistente' }
])

const empleados = ref<Empleado[]>([
  {
    id: 1,
    empresa_id: 1,
    puesto_id: 1,
    documento_identidad: '12345678',
    nombre: 'Pedro González',
    correo: 'pedro.gonzalez@techcorp.com',
    celular: '+57 300 111 2222',
    fecha_ingreso: '2023-06-15',
    foto_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    activo: true,
    creado_en: '2023-06-15T08:00:00Z'
  },
  {
    id: 2,
    empresa_id: 2,
    puesto_id: 2,
    documento_identidad: '87654321',
    nombre: 'Laura Sánchez',
    correo: 'laura.sanchez@innovatelab.com',
    celular: '+57 300 333 4444',
    fecha_ingreso: '2023-08-20',
    foto_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    activo: true,
    creado_en: '2023-08-20T09:30:00Z'
  },
  {
    id: 3,
    empresa_id: 1,
    puesto_id: 3,
    documento_identidad: '11223344',
    nombre: 'Miguel Torres',
    correo: 'miguel.torres@techcorp.com',
    celular: '+57 300 555 6666',
    fecha_ingreso: '2023-03-10',
    fecha_egreso: '2024-01-10',
    foto_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    activo: false,
    creado_en: '2023-03-10T10:15:00Z'
  },
  {
    id: 4,
    empresa_id: 3,
    puesto_id: 4,
    documento_identidad: '55667788',
    nombre: 'Carmen Ruiz',
    correo: 'carmen.ruiz@digitalworks.com',
    celular: '+57 300 777 8888',
    fecha_ingreso: '2023-11-05',
    foto_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    activo: true,
    creado_en: '2023-11-05T14:20:00Z'
  },
  {
    id: 5,
    empresa_id: 4,
    puesto_id: 5,
    documento_identidad: '99887766',
    nombre: 'Roberto Vega',
    correo: 'roberto.vega@startuphub.com',
    celular: '+57 300 999 0000',
    fecha_ingreso: '2023-09-12',
    foto_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    activo: true,
    creado_en: '2023-09-12T11:45:00Z'
  }
])

const empleadosFiltrados = computed(() => {
  return empleados.value.filter(empleado => {
    const cumpleBusqueda = !filtros.value.busqueda || 
      empleado.nombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      empleado.documento_identidad.includes(filtros.value.busqueda)
    
    const cumpleActivo = !filtros.value.activo || 
      empleado.activo.toString() === filtros.value.activo
    
    const cumpleEmpresa = !filtros.value.empresa || 
      empleado.empresa_id.toString() === filtros.value.empresa
    
    return cumpleBusqueda && cumpleActivo && cumpleEmpresa
  })
})

const totalPaginas = computed(() => {
  return Math.ceil(empleadosFiltrados.value.length / itemsPorPagina.value)
})

const empleadosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return empleadosFiltrados.value.slice(inicio, fin)
})

const getEmpresaNombre = (empresaId: number) => {
  const empresa = empresas.value.find(e => e.id === empresaId)
  return empresa ? empresa.nombre : 'Empresa no encontrada'
}

const getPuestoNombre = (puestoId: number) => {
  const puesto = puestos.value.find(p => p.id === puestoId)
  return puesto ? puesto.nombre : 'Puesto no encontrado'
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
    activo: '',
    empresa: ''
  }
  paginaActual.value = 1
}

onMounted(() => {
  console.log('Empleados cargados')
})
</script>

