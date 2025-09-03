# Admin Norkent - Dashboard de Administración

Un dashboard completo de administración construido con Vue 3, TypeScript y Tailwind CSS para gestionar usuarios, empresas, empleados, planes, suscripciones, pagos y facturas.

## 🚀 Características

- **Dashboard Principal**: Vista general con estadísticas y resúmenes
- **Gestión de Usuarios**: Visualización y filtrado de usuarios registrados
- **Gestión de Empresas**: Administración de empresas y sus datos
- **Gestión de Empleados**: Control de empleados por empresa
- **Gestión de Planes**: Administración de planes de suscripción
- **Gestión de Suscripciones**: Seguimiento de suscripciones activas
- **Gestión de Pagos**: Historial y estado de pagos
- **Gestión de Facturas**: Control de facturación

## 🛠️ Tecnologías Utilizadas

- **Vue 3** - Framework de JavaScript
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Vue Router** - Enrutamiento
- **Vite** - Herramienta de construcción

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd admin-norkent
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 🔐 Credenciales de Acceso

Para acceder al dashboard, utiliza las siguientes credenciales:

- **Usuario**: `admin`
- **Contraseña**: `1234`

## 📊 Estructura del Proyecto

```
src/
├── components/
│   ├── Dashboard.vue      # Dashboard principal
│   ├── Usuarios.vue       # Gestión de usuarios
│   ├── Empresas.vue       # Gestión de empresas
│   ├── Empleados.vue      # Gestión de empleados
│   ├── Planes.vue         # Gestión de planes
│   ├── Suscripciones.vue  # Gestión de suscripciones
│   ├── Pagos.vue          # Gestión de pagos
│   ├── Facturas.vue       # Gestión de facturas
│   ├── Home.vue           # Layout principal
│   └── Login.vue          # Página de login
├── router/
│   └── index.ts           # Configuración de rutas
├── style.css              # Estilos globales
└── main.ts                # Punto de entrada
```

## 🎨 Características de la UI

- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Filtros Avanzados**: Búsqueda y filtrado en todas las secciones
- **Paginación**: Navegación eficiente a través de grandes conjuntos de datos
- **Estados Visuales**: Indicadores claros de estado (activo, inactivo, etc.)
- **Animaciones Suaves**: Transiciones y efectos visuales modernos

## 📱 Navegación

El dashboard incluye una navegación intuitiva con las siguientes secciones:

1. **Dashboard** - Vista general y estadísticas
2. **Usuarios** - Gestión de usuarios del sistema
3. **Empresas** - Administración de empresas
4. **Empleados** - Control de empleados
5. **Planes** - Gestión de planes de suscripción
6. **Suscripciones** - Seguimiento de suscripciones
7. **Pagos** - Historial de pagos
8. **Facturas** - Gestión de facturación

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecuta el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la construcción de producción

## 📝 Notas Importantes

- Este es un **frontend únicamente** - no incluye backend
- Los datos mostrados son **de ejemplo** para demostración
- Para producción, necesitarás conectar con una API real
- El sistema de autenticación es básico para propósitos de demostración

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda, por favor abre un issue en el repositorio.