<template>
  <div class="fade-in">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Usuarios</h1>
      <p class="text-gray-600">Gestiona todos los usuarios del sistema</p>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="filter-section mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Buscar</label>
          <input
            v-model="filtros.busqueda"
            type="text"
            placeholder="Nombre o correo..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Estado</label>
          <select
            v-model="filtros.verificado"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="true">Verificados</option>
            <option value="false">No verificados</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Proveedor</label>
          <select
            v-model="filtros.proveedor"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="credenciales">Credenciales</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
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

    <!-- Tabla de usuarios -->
    <div class="table-container">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Lista de Usuarios ({{ usuariosFiltrados.length }})
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
                Contacto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="usuario in usuariosPaginados" :key="usuario.id" class="table-row-hover">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <img
                    :src="usuario.imagen_url"
                    :alt="usuario.nombre"
                    class="h-10 w-10 rounded-full"
                  />
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ usuario.nombre }}</div>
                    <div class="text-sm text-gray-500">ID: {{ usuario.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ usuario.correo }}</div>
                <div class="text-sm text-gray-500">{{ usuario.celular || 'Sin celular' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="status-badge"
                  :class="usuario.verificado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ usuario.verificado ? 'Verificado' : 'No verificado' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="status-badge bg-blue-100 text-blue-800"
                >
                  {{ usuario.proveedor }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(usuario.creado_en) }}
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
            {{ Math.min(paginaActual * itemsPorPagina, usuariosFiltrados.length) }} de
            {{ usuariosFiltrados.length }} resultados
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

interface Usuario {
  id: number
  nombre: string
  correo: string
  celular?: string
  contraseña_hash: string
  verificado: boolean
  proveedor: string
  imagen_url: string
  creado_en: string
}

const filtros = ref({
  busqueda: '',
  verificado: '',
  proveedor: ''
})

const itemsPorPagina = ref(25)
const paginaActual = ref(1)

// Datos de ejemplo (en un proyecto real vendrían de una API)
const usuarios = ref<Usuario[]>([
  {
    id: 1,
    nombre: 'Juan Pérez',
    correo: 'juan.perez@email.com',
    celular: '+57 300 123 4567',
    contraseña_hash: 'hashed_password',
    verificado: true,
    proveedor: 'credenciales',
    imagen_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/foto-perfil-default_yfjzx4.webp',
    creado_en: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    nombre: 'María García',
    correo: 'maria.garcia@email.com',
    celular: '+57 300 234 5678',
    contraseña_hash: 'hashed_password',
    verificado: false,
    proveedor: 'google',
    imagen_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/foto-perfil-default_yfjzx4.webp',
    creado_en: '2024-01-14T15:45:00Z'
  },
  {
    id: 3,
    nombre: 'Carlos López',
    correo: 'carlos.lopez@email.com',
    celular: '+57 300 345 6789',
    contraseña_hash: 'hashed_password',
    verificado: true,
    proveedor: 'facebook',
    imagen_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/foto-perfil-default_yfjzx4.webp',
    creado_en: '2024-01-13T09:20:00Z'
  },
  {
    id: 4,
    nombre: 'Ana Martínez',
    correo: 'ana.martinez@email.com',
    celular: '+57 300 456 7890',
    contraseña_hash: 'hashed_password',
    verificado: true,
    proveedor: 'credenciales',
    imagen_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/foto-perfil-default_yfjzx4.webp',
    creado_en: '2024-01-12T14:15:00Z'
  },
  {
    id: 5,
    nombre: 'Luis Rodríguez',
    correo: 'luis.rodriguez@email.com',
    celular: '+57 300 567 8901',
    contraseña_hash: 'hashed_password',
    verificado: false,
    proveedor: 'google',
    imagen_url: 'https://res.cloudinary.com/du3wmddpg/image/upload/v1750993897/foto-perfil-default_yfjzx4.webp',
    creado_en: '2024-01-11T11:30:00Z'
  }
])

const usuariosFiltrados = computed(() => {
  return usuarios.value.filter(usuario => {
    const cumpleBusqueda = !filtros.value.busqueda || 
      usuario.nombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    
    const cumpleVerificado = !filtros.value.verificado || 
      usuario.verificado.toString() === filtros.value.verificado
    
    const cumpleProveedor = !filtros.value.proveedor || 
      usuario.proveedor === filtros.value.proveedor
    
    return cumpleBusqueda && cumpleVerificado && cumpleProveedor
  })
})

const totalPaginas = computed(() => {
  return Math.ceil(usuariosFiltrados.value.length / itemsPorPagina.value)
})

const usuariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina.value
  const fin = inicio + itemsPorPagina.value
  return usuariosFiltrados.value.slice(inicio, fin)
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
    verificado: '',
    proveedor: ''
  }
  paginaActual.value = 1
}

onMounted(() => {
  // Aquí se cargarían los datos reales desde la API
  console.log('Usuarios cargados')
})
</script>

