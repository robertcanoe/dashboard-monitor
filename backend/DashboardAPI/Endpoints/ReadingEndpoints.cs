using DashboardAPI.Data;
using DashboardAPI.Models;

namespace DashboardAPI.Endpoints;

public static class ReadingEndpoints
{
    public static IEndpointRouteBuilder MapReadingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/lecturas");

        group.MapGet(string.Empty, (int sensorId, DateTime? desde, DateTime? hasta, InMemoryDataStore dataStore) =>
            {
                var query = dataStore.Lecturas.Where(l => l.SensorId == sensorId);

                if (desde.HasValue)
                {
                    query = query.Where(l => l.Timestamp >= desde.Value);
                }

                if (hasta.HasValue)
                {
                    query = query.Where(l => l.Timestamp <= hasta.Value);
                }

                return Results.Ok(query.OrderByDescending(l => l.Timestamp).ToList());
            })
            .WithName("GetLecturas");

        group.MapPost(string.Empty, (ReadingCreate reading, InMemoryDataStore dataStore) =>
            {
                if (!dataStore.Sensores.Any(s => s.Id == reading.SensorId))
                {
                    return Results.BadRequest(new { message = "Sensor no encontrado" });
                }

                if (reading.Value < 0)
                {
                    return Results.BadRequest(new { message = "El valor de la lectura no puede ser negativo" });
                }

                var newReading = dataStore.AddReading(reading);
                return Results.Created($"/api/lecturas/{newReading.Id}", newReading);
            })
            .WithName("CreateLectura");

        return app;
    }
}
