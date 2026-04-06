using System.Collections.Concurrent;
using System.Threading;
using DashboardAPI.Models;

namespace DashboardAPI.Data;

public class InMemoryDataStore
{
    private int _nextReadingId;

    public List<Sensor> Sensores { get; }
    public ConcurrentBag<Reading> Lecturas { get; }

    public InMemoryDataStore()
    {
        Sensores = new List<Sensor>
        {
            new Sensor { Id = 1, Name = "Sensor Temperatura Sala 1", Location = "Oficina Principal", Type = "temperatura" },
            new Sensor { Id = 2, Name = "Sensor Humedad Bodega", Location = "Bodega A", Type = "humedad" },
            new Sensor { Id = 3, Name = "Sensor Presion Laboratorio", Location = "Lab 3", Type = "presion" },
            new Sensor { Id = 4, Name = "Sensor Luz Entrada", Location = "Recepcion", Type = "luz" }
        };

        Lecturas = new ConcurrentBag<Reading>
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

        _nextReadingId = Lecturas.Max(l => l.Id);
    }

    public Reading AddReading(ReadingCreate reading)
    {
        var newReading = new Reading
        {
            Id = Interlocked.Increment(ref _nextReadingId),
            SensorId = reading.SensorId,
            Value = reading.Value,
            Timestamp = reading.Timestamp ?? DateTime.Now
        };

        Lecturas.Add(newReading);
        return newReading;
    }
}
