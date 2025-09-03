<template>
  <div class="fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Empresas</h1>
      <p class="text-gray-600">Gestiona todas las empresas registradas</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filter-section mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Buscar</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Nombre o código..."
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
            <option value="true">Activas</option>
            <option value="false">Inactivas</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Tipo</label>
          <select
            v-model="filtros.tipo"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="corporacion">Corporación</option>
            <option value="sociedad_anonima">Sociedad Anónima</option>
            <option value="sociedad_limitada">Sociedad Limitada</option>
            <option value="empresa_unipersonal">Empresa Unipersonal</option>
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

    <!-- Tabla de empresas -->
    <div class="table-container">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Lista de Empresas ({{ empresasFiltradas.length }})
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
                Empresa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="empresa in empresasPaginadas" :key="empresa.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="empresa.logo_url"
                    :alt="empresa.nombre"
                    class="h-10 w-10 rounded-lg"
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ empresa.nombre }}</div>
                    <div class="text-sm text-gray-500">ID: {{ empresa.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge bg-blue-100 text-blue-800">
                  {{ empresa.codigo_identificador }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ empresa.tipo_empresa || 'No especificado' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ empresa.pais || 'No especificado' }}</div>
                <div class="text-sm text-gray-500">{{ empresa.direccion || 'Sin dirección' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="status-badge"
                  :class="empresa.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ empresa.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(empresa.creado_en) }}
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
            {{ Math.min(paginaActual * itemsPorPagina, empresasFiltradas.length) }} de
            {{ empresasFiltradas.length }} resultados
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

interface Empresa {
  id: number
  usuario_id: number
  nombre: string
  codigo_identificador: string
  logo_url: string
  tipo_empresa?: string
  pais?: string
  direccion?: string
  activo: boolean
  creado_en: string
}

const filtros = ref({
  busqueda: '',
  activo: '',
  tipo: ''
})

const itemsPorPagina = ref(25)
const paginaActual = ref(1)

// Datos de ejemplo (en un proyecto real vendrían de una API)
const empresas = ref<Empresa[]>([
  {
    id: 1,
    usuario_id: 1,
    nombre: 'TechCorp Solutions',
    codigo_identificador: 'TC01',
    logo_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    tipo_empresa: 'corporacion',
    pais: 'Colombia',
    direccion: 'Calle 123 #45-67, Bogotá',
    activo: true,
    creado_en: '2024-01-15T08:15:00Z'
  },
  {
    id: 2,
    usuario_id: 2,
    nombre: 'InnovateLab',
    codigo_identificador: 'IL02',
    logo_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    tipo_empresa: 'sociedad_anonima',
    pais: 'Colombia',
    direccion: 'Carrera 45 #78-90, Medellín',
    activo: true,
    creado_en: '2024-01-14T14:30:00Z'
  },
  {
    id: 3,
    usuario_id: 3,
    nombre: 'DigitalWorks',
    codigo_identificador: 'DW03',
    logo_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    tipo_empresa: 'sociedad_limitada',
    pais: 'Colombia',
    direccion: 'Avenida 30 #12-34, Cali',
    activo: false,
    creado_en: '2024-01-13T11:45:00Z'
  },
  {
    id: 4,
    usuario_id: 4,
    nombre: 'StartupHub',
    codigo_identificador: 'SH04',
    logo_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    tipo_empresa: 'empresa_unipersonal',
    pais: 'Colombia',
    direccion: 'Calle 80 #23-45, Barranquilla',
    activo: true,
    creado_en: '2024-01-12T16:20:00Z'
  },
  {
    id: 5,
    usuario_id: 5,
    nombre: 'CloudTech',
    codigo_identificador: 'CT05',
    logo_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/logo-empresa-default_yfjzx4.webp',
    tipo_empresa: 'corporacion',
    pais: 'Colombia',
    direccion: 'Carrera 15 #67-89, Bucaramanga',
    activo: true,
    creado_en: '2024-01-11T09:30:00Z'
  }
])

const empresasFiltradas = computed(() => {
  return empresas.value.filter(empresa => {
    const cumpleBusqueda = !filtros.value.busqueda || 
      empresa.nombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      empresa.codigo_identificador.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    
    const cumpleActivo = !filtros.value.activo || 
      empresa.activo.toString() === filtros.value.activo
    
    const cumpleTipo = !filtros.value.tipo || 
      empresa.tipo_empresa === filtros.value.tipo
    
    return cumpleBusqueda && cumpleActivo && cumpleTipo
  })
})

const totalPaginas = computed(() => {
  return Math.ceil(empresasFiltradas.value.length / itemsPorPagina.value)
})

const empresasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return empresasFiltradas.value.slice(inicio, fin)
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
    activo: '',
    tipo: ''
  }
  paginaActual.value = 1
}

onMounted(() => {
  // Aquí se cargarían los datos reales desde la API
  console.log('Empresas cargadas')
})
</script>

