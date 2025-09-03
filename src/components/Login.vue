<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 border border-gray-200 rounded-lg bg-white">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          Iniciar Sesión
        </h2>
        <p class="text-gray-600">
          Ingresa tus credenciales para acceder
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Ingresa tu usuario"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Ingresa tu contraseña"
            />
          </div>
        </div>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  // Validar credenciales
  if (username.value === 'admin' && password.value === '1234') {
    // Credenciales correctas
    localStorage.setItem('isAuthenticated', 'true')
    errorMessage.value = ''
    // Redirigir al inicio
    router.push('/')
  } else {
    // Credenciales incorrectas
    errorMessage.value = 'Usuario o contraseña incorrectos'
    username.value = ''
    password.value = ''
  }
}
</script>
