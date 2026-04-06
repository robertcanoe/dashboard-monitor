namespace DashboardAPI.Extensions;

public static class CorsExtensions
{
    public const string AllowAngularPolicy = "AllowAngular";

    public static IServiceCollection AddDashboardCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(AllowAngularPolicy, policy =>
            {
                policy.WithOrigins("http://localhost:4200", "http://localhost:38041")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        return services;
    }

    public static IApplicationBuilder UseDashboardCors(this IApplicationBuilder app)
    {
        return app.UseCors(AllowAngularPolicy);
    }
}
