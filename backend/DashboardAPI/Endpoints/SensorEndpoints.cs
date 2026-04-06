using DashboardAPI.Data;

namespace DashboardAPI.Endpoints;

public static class SensorEndpoints
{
    public static IEndpointRouteBuilder MapSensorEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/sensores");

        group.MapGet(string.Empty, (InMemoryDataStore dataStore) =>
            {
                return Results.Ok(dataStore.Sensores);
            })
            .WithName("GetSensores")
            .WithOpenApi();

        group.MapGet("/{id:int}", (int id, InMemoryDataStore dataStore) =>
            {
                var sensor = dataStore.Sensores.FirstOrDefault(s => s.Id == id);
                if (sensor is null)
                {
                    return Results.NotFound(new { message = "Sensor no encontrado" });
                }

                return Results.Ok(sensor);
            })
            .WithName("GetSensor")
            .WithOpenApi();

        return app;
    }
}
