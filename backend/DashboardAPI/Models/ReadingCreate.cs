namespace DashboardAPI.Models;

public class ReadingCreate
{
    public int SensorId { get; set; }
    public double Value { get; set; }
    public DateTime? Timestamp { get; set; }
}
