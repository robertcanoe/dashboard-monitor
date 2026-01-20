var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:38041")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngular");
// Deshabilitado en desarrollo - solo usamos HTTP
// app.UseHttpsRedirection();

// Datos en memoria (simulación)
var sensores = new List<Sensor>
{
    new Sensor { Id = 1, Name = "Sensor Temperatura Sala 1", Location = "Oficina Principal", Type = "temperatura" },
    new Sensor { Id = 2, Name = "Sensor Humedad Bodega", Location = "Bodega A", Type = "humedad" },
    new Sensor { Id = 3, Name = "Sensor Presión Laboratorio", Location = "Lab 3", Type = "presión" },
    new Sensor { Id = 4, Name = "Sensor Luz Entrada", Location = "Recepción", Type = "luz" }
};

var lecturas = new List<Reading>
{
    new Reading { Id = 1, SensorId = 1, Value = 22.5, Timestamp = DateTime.Now.AddMinutes(-30) },
    new Reading { Id = 2, SensorId = 1, Value = 23.1, Timestamp = DateTime.Now.AddMinutes(-25) },
    new Reading { Id = 3, SensorId = 1, Value = 22.8, Timestamp = DateTime.Now.AddMinutes(-20) },
    new Reading { Id = 4, SensorId = 1, Value = 23.5, Timestamp = DateTime.Now.AddMinutes(-15) },
    new Reading { Id = 5, SensorId = 1, Value = 24.0, Timestamp = DateTime.Now.AddMinutes(-10) },
    new Reading { Id = 6, SensorId = 1, Value = 23.7, Timestamp = DateTime.Now.AddMinutes(-5) },
    new Reading { Id = 7, SensorId = 1, Value = 24.2, Timestamp = DateTime.Now },
    
    new Reading { Id = 8, SensorId = 2, Value = 65.0, Timestamp = DateTime.Now.AddMinutes(-30) },
    new Reading { Id = 9, SensorId = 2, Value = 67.5, Timestamp = DateTime.Now.AddMinutes(-20) },
    new Reading { Id = 10, SensorId = 2, Value = 66.2, Timestamp = DateTime.Now.AddMinutes(-10) },
    new Reading { Id = 11, SensorId = 2, Value = 68.0, Timestamp = DateTime.Now },
    
    new Reading { Id = 12, SensorId = 3, Value = 1013.2, Timestamp = DateTime.Now.AddMinutes(-25) },
    new Reading { Id = 13, SensorId = 3, Value = 1012.8, Timestamp = DateTime.Now.AddMinutes(-15) },
    new Reading { Id = 14, SensorId = 3, Value = 1013.5, Timestamp = DateTime.Now.AddMinutes(-5) },
    
    new Reading { Id = 15, SensorId = 4, Value = 450.0, Timestamp = DateTime.Now.AddMinutes(-20) },
    new Reading { Id = 16, SensorId = 4, Value = 520.0, Timestamp = DateTime.Now.AddMinutes(-10) },
    new Reading { Id = 17, SensorId = 4, Value = 480.0, Timestamp = DateTime.Now }
};

// GET /api/sensores - Listar todos los sensores
app.MapGet("/api/sensores", () =>
{
    return Results.Ok(sensores);
})
.WithName("GetSensores")
.WithOpenApi();

// GET /api/sensores/{id} - Obtener detalle de un sensor
app.MapGet("/api/sensores/{id}", (int id) =>
{
    var sensor = sensores.FirstOrDefault(s => s.Id == id);
    if (sensor == null)
        return Results.NotFound(new { message = "Sensor no encontrado" });
    
    return Results.Ok(sensor);
})
.WithName("GetSensor")
.WithOpenApi();

// GET /api/lecturas - Filtrar lecturas por sensor y fechas
app.MapGet("/api/lecturas", (int sensorId, DateTime? desde, DateTime? hasta) =>
{
    var query = lecturas.Where(l => l.SensorId == sensorId);
    
    if (desde.HasValue)
        query = query.Where(l => l.Timestamp >= desde.Value);
    
    if (hasta.HasValue)
        query = query.Where(l => l.Timestamp <= hasta.Value);
    
    return Results.Ok(query.OrderByDescending(l => l.Timestamp).ToList());
})
.WithName("GetLecturas")
.WithOpenApi();

// POST /api/lecturas - Crear nueva lectura
app.MapPost("/api/lecturas", (ReadingCreate reading) =>
{
    var newReading = new Reading
    {
        Id = lecturas.Max(l => l.Id) + 1,
        SensorId = reading.SensorId,
        Value = reading.Value,
        Timestamp = reading.Timestamp ?? DateTime.Now
    };
    
    lecturas.Add(newReading);
    return Results.Created($"/api/lecturas/{newReading.Id}", newReading);
})
.WithName("CreateLectura")
.WithOpenApi();

app.Run();

// Modelos
public class Sensor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
}

public class Reading
{
    public int Id { get; set; }
    public int SensorId { get; set; }
    public double Value { get; set; }
    public DateTime Timestamp { get; set; }
}

public class ReadingCreate
{
    public int SensorId { get; set; }
    public double Value { get; set; }
    public DateTime? Timestamp { get; set; }
}
