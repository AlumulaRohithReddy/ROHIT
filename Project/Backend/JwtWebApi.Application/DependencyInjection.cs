using JwtWebApi.Application.Interfaces;
using JwtWebApi.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace JwtWebApi.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IVehicleService, VehicleService>();
            services.AddScoped<IPolicyPlanService, PolicyPlanService>();

            return services;
        }
    }
}
