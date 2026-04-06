using DashboardAPI.Data;
using DashboardAPI.Endpoints;
using DashboardAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDashboardCors();
builder.Services.AddSingleton<InMemoryDataStore>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDashboardCors();
// Deshabilitado en desarrollo - solo usamos HTTP
// app.UseHttpsRedirection();

app.MapSensorEndpoints();
app.MapReadingEndpoints();

app.Run();
