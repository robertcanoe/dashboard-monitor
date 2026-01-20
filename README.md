# 📊 Sistema de Monitorización de Sensores

Sistema completo de monitorización de sensores en tiempo real con **backend en .NET 8** y **frontend en Angular 21**.

---

## Descripción General

Este proyecto es un **dashboard corporativo** para la monitorización de sensores IoT que permite:

- Visualizar sensores activos en el sistema
- Consultar lecturas en tiempo real
- Ver estadísticas (promedio, máximo, mínimo)
- Filtrar lecturas por rango de fechas
- Exportar datos a CSV
- Auto-actualización automática cada 15 segundos

---

## Arquitectura del Proyecto

```
dashboard-project/
├── backend/                 # API REST en .NET 8
│   └── DashboardAPI/       # Proyecto Web API
│       ├── Program.cs      # Configuración y endpoints
│       └── README.md       # Documentación del backend
│
├── frontend/               # Aplicación Angular 21
│   └── dashboard-monitor/  # Proyecto Angular
│       ├── src/           # Código fuente
│       └── README.md      # Documentación del frontend
│
├── README-enunciado.md    # Enunciado original del proyecto
├── README.md              # Este archivo
└── .gitignore             # Archivos ignorados por Git
```

---

## Inicio Rápido

### Prerrequisitos

- **.NET 8 SDK** - [Descargar](https://dotnet.microsoft.com/download)
- **Node.js** (v18+) - [Descargar](https://nodejs.org/)
- **PNPM** - `npm install -g pnpm`

### 1. Clonar el Repositorio

```bash
git clone https://github.com/robertcanoe/dashboard-project.git
cd dashboard-project
```

### 2. Ejecutar el Backend

```bash
# Navegar al backend
cd backend/DashboardAPI

# Restaurar dependencias
dotnet restore

# Ejecutar el servidor
dotnet run
```

El backend estará disponible en: **http://localhost:5024**  
Swagger UI: **http://localhost:5024/swagger**

### 3. Ejecutar el Frontend

En una **nueva terminal**:

```bash
# Navegar al frontend
cd frontend/dashboard-monitor

# Instalar dependencias
pnpm install

# Ejecutar el servidor de desarrollo
pnpm start
```

El frontend estará disponible en: **http://localhost:4200**

---

## Tecnologías Utilizadas

### Backend
- **.NET 8** - Framework principal
- **ASP.NET Core Web API** - API REST
- **Swagger/OpenAPI** - Documentación automática
- **CORS** - Configurado para Angular

### Frontend
- **Angular 21** - Framework frontend
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Standalone Components** - Arquitectura moderna
- **PNPM** - Gestor de paquetes

---

## Funcionalidades Principales

### Backend (API REST)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/sensores` | Lista todos los sensores |
| `GET` | `/api/sensores/{id}` | Obtiene un sensor específico |
| `GET` | `/api/lecturas?sensorId={id}&desde={fecha}&hasta={fecha}` | Lecturas filtradas |
| `POST` | `/api/lecturas` | Crea una nueva lectura |

### Frontend (Dashboard)

- **Vista de Sensores:** Lista con iconos dinámicos por tipo
- **Panel de Detalles:** Estadísticas y lecturas del sensor seleccionado
- **Filtros:** Búsqueda por rango de fechas
- **Exportación:** Descarga de datos en formato CSV
- **Auto-refresh:** Actualización automática cada 15 segundos

---

## Diseño Corporativo

El frontend utiliza un **diseño corporativo profesional** inspirado en empresas tecnológicas como Indra:

- **Paleta de colores:** Azul corporativo (#003d82) y grises
- **Tipografía:** Roboto (profesional y legible)
- **Layout:** Grid responsivo
- **Componentes:** Cards con bordes sutiles y sombras
- **Estilo:** Minimalista, sin animaciones excesivas

---

## Modelos de Datos

### Sensor
```json
{
  "id": 1,
  "name": "Sensor Temperatura Sala 1",
  "location": "Oficina Principal",
  "type": "temperatura"
}
```

### Lectura
```json
{
  "id": 1,
  "sensorId": 1,
  "value": 24.5,
  "timestamp": "2026-01-20T10:30:00"
}
```

---

## Configuración

### Puertos por Defecto

- **Backend:** `http://localhost:5024`
- **Frontend:** `http://localhost:4200`

### CORS

El backend está configurado para permitir peticiones desde:
- `http://localhost:4200`
- `http://localhost:38041`

Para añadir más orígenes, edita `backend/DashboardAPI/Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://nuevo-origen")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

---

## Documentación Detallada

Para más información sobre cada parte del proyecto:

- **Backend:** [backend/README.md](backend/README.md)
- **Frontend:** [frontend/README.md](frontend/README.md)
- **Enunciado Original:** [README-enunciado.md](README-enunciado.md)

---

## Solución de Problemas

### El backend no inicia
```bash
# Verificar que el puerto 5024 esté libre
sudo lsof -i :5024

# Matar el proceso si está ocupado
kill -9 PID
```

### El frontend no se conecta al backend
1. Verifica que el backend esté corriendo
2. Comprueba la consola del navegador (F12)
3. Revisa errores de CORS

### Los sensores no aparecen
1. Recarga con `Ctrl + Shift + R`
2. Verifica la consola del navegador
3. Prueba el endpoint directamente: `curl http://localhost:5024/api/sensores`

---

## Despliegue

### Backend (Producción)

```bash
cd backend/DashboardAPI
dotnet publish -c Release -o ./publish
```

### Frontend (Producción)

```bash
cd frontend/dashboard-monitor
pnpm build
# Los archivos estarán en dist/
```
---

## Autores

- **Roberto Cano Estévez** - Desarrollo inicial
