# Backend - Sistema de Monitorización de Sensores

## 📁 Descripción

Este directorio contiene el **backend** del sistema de monitorización de sensores, desarrollado con **.NET 8** y **C#**.

El backend proporciona una **API REST** que permite gestionar sensores y sus lecturas, con endpoints para crear, leer y filtrar datos.

---

## 🏗️ Tecnologías

- **.NET 8** - Framework principal
- **ASP.NET Core Web API** - Para crear la API REST
- **Swagger/OpenAPI** - Documentación automática de la API
- **CORS** - Configurado para permitir peticiones desde el frontend Angular

---

## 🚀 Inicialización del Proyecto

El proyecto fue creado con los siguientes comandos:

```bash
# Crear el proyecto Web API
dotnet new webapi -n DashboardAPI

# Navegar al directorio
cd DashboardAPI

# Ejecutar el proyecto
dotnet run
```

---

## 📋 Funcionalidades del Backend

### Endpoints Disponibles:

#### **Sensores**
- `GET /api/sensores` - Lista todos los sensores
- `GET /api/sensores/{id}` - Obtiene un sensor específico por ID

#### **Lecturas**
- `GET /api/lecturas?sensorId={id}&desde={fecha}&hasta={fecha}` - Obtiene lecturas filtradas por sensor y rango de fechas
- `POST /api/lecturas` - Crea una nueva lectura

### Modelos de Datos:

**Sensor:**
```csharp
{
  "id": 1,
  "name": "Sensor Temperatura Sala 1",
  "location": "Oficina Principal",
  "type": "temperatura"
}
```

**Lectura:**
```csharp
{
  "id": 1,
  "sensorId": 1,
  "value": 24.5,
  "timestamp": "2026-01-20T10:30:00"
}
```

---

## ⚙️ Configuración

### CORS
El backend está configurado para aceptar peticiones desde:
- `http://localhost:4200` (Angular development server)
- `http://localhost:38041` (Puerto alternativo)

### Puerto por defecto
El servidor se ejecuta en: **http://localhost:5024**

---

## 🔧 Comandos Útiles

```bash
# Restaurar dependencias
dotnet restore

# Compilar el proyecto
dotnet build

# Ejecutar el proyecto
dotnet run

# Ejecutar en modo watch (recarga automática)
dotnet watch run

# Limpiar archivos compilados
dotnet clean
```

---

## 📊 Swagger/OpenAPI

Una vez ejecutado el proyecto, puedes acceder a la documentación interactiva de la API en:

**http://localhost:5024/swagger/index.html**

Desde Swagger puedes:
- Ver todos los endpoints disponibles
- Probar las peticiones directamente
- Ver los modelos de datos

---

## 🗂️ Estructura del Proyecto

```
DashboardAPI/
├── Program.cs                 # Punto de entrada y configuración de la API
├── appsettings.json          # Configuración de la aplicación
├── DashboardAPI.csproj       # Archivo de proyecto .NET
└── Properties/
    └── launchSettings.json   # Configuración de lanzamiento
```

---

## 📝 Datos de Ejemplo

El backend incluye datos simulados en memoria con:
- **4 sensores** (temperatura, humedad, presión, luz)
- **17 lecturas** de ejemplo distribuidas entre los sensores

Estos datos son solo para desarrollo y se pierden al reiniciar el servidor.

---

## 🔒 Seguridad

- **CORS** configurado para dominios específicos
- **HTTPS Redirect** deshabilitado en desarrollo para facilitar las pruebas
- Validaciones básicas en los endpoints

---

## 🐛 Solución de Problemas

### Puerto en uso
Si el puerto 5024 está ocupado:
```bash
# Ver qué proceso usa el puerto
sudo lsof -i :5024

# Matar el proceso
kill -9 PID
```

### Error de CORS
Verifica que el frontend esté corriendo en uno de los puertos permitidos (4200 o 38041).

