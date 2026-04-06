# Frontend - Sistema de Monitorización de Sensores

## Descripción

Este directorio contiene el **frontend** del sistema de monitorización de sensores, desarrollado con **Angular 21** y **TypeScript**.

El frontend proporciona una interfaz web corporativa para visualizar sensores, sus lecturas en tiempo real, estadísticas y permite exportar datos a CSV.

---

## Tecnologías

- **Angular 21** - Framework frontend
- **TypeScript** - Lenguaje de programación
- **Signals (Angular)** - Estado reactivo local y derivado
- **Control Flow Blocks** - `@if`, `@else`, `@for`
- **RxJS** - Polling y peticiones HTTP
- **Standalone Components** - Arquitectura moderna de Angular
- **PNPM** - Gestor de paquetes

---

## Inicialización del Proyecto

El proyecto fue creado con los siguientes comandos:

```bash
# Crear el proyecto Angular
ng new dashboard-monitor --standalone --style=css

# Navegar al directorio
cd dashboard-monitor

# Instalar dependencias
pnpm install

# Ejecutar el servidor de desarrollo
pnpm start
```

---

## Funcionalidades del Frontend

### Componentes Principales:

#### **Dashboard Component**
- Vista principal del sistema
- Header operativo con estado de selección y fecha
- Layout en grid responsive (inventario + analítica)

#### **Sensor List Component**
- Lista todos los sensores disponibles
- Estado activo con resumen de inventario
- Indicadores visuales por tipo de sensor
- Selección de sensor para ver detalles

#### **Sensor Detail Component**
- Muestra información detallada del sensor seleccionado
- **Estadísticas en tiempo real:**
  - Última lectura
  - Promedio
  - Máximo
  - Mínimo
- Tendencia (al alza, a la baja, estable)
- **Filtros de búsqueda** por rango de fechas
- **Historial de lecturas** en tabla
- **Exportación a CSV** de todas las lecturas
- **Auto-actualización** cada 15 segundos (modo manual opcional)

### Servicios:

#### **SensorService**
- Gestiona todas las peticiones HTTP al backend
- Endpoints:
  - `getSensors()` - Obtiene lista de sensores
  - `getSensorById(id)` - Obtiene un sensor específico
  - `getReadingsBySensor(sensorId, desde?, hasta?)` - Obtiene lecturas filtradas
  - `createReading()` - Crea una nueva lectura
- Estado seleccionado con `signal` y `computed`
- Helpers de dominio para icono/unidad por tipo de sensor

---

## Diseño Corporativo

La interfaz actual usa un sistema visual profesional orientado a panel de control:

- Tipografía combinada: **Manrope** + **Space Grotesk**
- Sistema de superficies translúcidas con jerarquía clara
- Fondo con capas de gradientes y acentos suaves
- Microanimaciones funcionales (entrada y carga)
- Layout responsive para escritorio y móvil

---

## Configuración

### Conexión al Backend
El frontend se conecta al backend en: **http://localhost:5024**

Configurado en: `src/app/services/sensor.service.ts`

```typescript
private readonly apiUrl = 'http://localhost:5024/api';
```

### Puerto de Desarrollo
El servidor de desarrollo se ejecuta en: **http://localhost:4200**

---

## Comandos Útiles

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm start
# o
ng serve

# Compilar para producción
pnpm build
# o
ng build

# Ejecutar tests
pnpm test
# o
ng test

# Linting
ng lint

# Formato de código
npx prettier --write .
```

---

## Estructura del Proyecto

```
dashboard-monitor/
├── src/
│   ├── app/
│   │   ├── components/              # Componentes de la aplicación
│   │   │   ├── dashboard/          # Componente principal
│   │   │   ├── sensor-list/        # Lista de sensores
│   │   │   └── sensor-detail/      # Detalles y lecturas
│   │   ├── models/                  # Interfaces TypeScript
│   │   │   ├── sensor.ts           # Modelo de Sensor
│   │   │   └── reading.ts          # Modelo de Lectura
│   │   ├── services/                # Servicios HTTP
│   │   │   └── sensor.service.ts   # Servicio principal
│   │   ├── app.config.ts           # Configuración de la app
│   │   ├── app.routes.ts           # Rutas de la aplicación
│   │   └── app.ts                  # Componente raíz
│   ├── styles.css                   # Estilos globales
│   └── index.html                   # HTML principal
├── angular.json                     # Configuración de Angular
├── package.json                     # Dependencias
├── tsconfig.json                    # Configuración TypeScript
└── README.md                        # Este archivo
```

---

## Características Destacadas

### 1. **Auto-actualización**
Los datos se actualizan automáticamente cada 15 segundos cuando un sensor está seleccionado. También puedes alternar a modo manual.

### 2. **Exportación a CSV**
Botón "Exportar CSV" que genera un archivo con:
- Fecha/Hora
- Nombre del sensor
- Ubicación
- Tipo
- Valor
- Unidad de medida

### 3. **Filtros Avanzados**
Permite filtrar lecturas por:
- Fecha desde
- Fecha hasta

### 4. **Indicadores Visuales**
- Sensor activo/seleccionado con color corporativo
- Loading states con spinners
- Error states con mensajes claros
- Empty states informativos
- Métrica de tendencia basada en últimas lecturas

---

## Variables de Entorno

Para configurar el backend en producción, actualiza la URL en:

`src/app/services/sensor.service.ts`

```typescript
private apiUrl = environment.apiUrl; // Usar environment
```

---

## Solución de Problemas

### Los sensores no se muestran
1. Verifica que el backend esté corriendo en http://localhost:5024
2. Abre la consola del navegador (F12)
3. Revisa la pestaña Network para ver errores de CORS
4. Recarga con Ctrl + Shift + R

### Error de CORS
Verifica que el backend permita el origen http://localhost:4200 en su configuración de CORS.

### Dependencias no instaladas
```bash
Remove-Item -Recurse -Force node_modules
pnpm install
```
---

## Recursos

- [Angular Documentation](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
