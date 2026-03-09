using JwtWebApi.Application.Common;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Application.Services;
using JwtWebApi.Infrastructure.Authentication;
using JwtWebApi.Infrastructure.Data;
using JwtWebApi.Infrastructure.Repositories;
using JwtWebApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace JwtWebApi.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<IAppDbContext, AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("Jwts")));
            
            services.AddSingleton<IJwtService, JwtService>();
            services.AddScoped<VehicleService>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IVehicleRepository, VehicleRepository>(); 
            services.AddScoped<IPolicyPlanRepository, PolicyPlanRepository>();
            services.AddScoped<IPolicyRepository, PolicyRepository>();
            services.AddScoped<PolicyPlanService>();
            services.AddScoped<PolicyService>();
            services.AddScoped<IClaimRepository, ClaimRepository>();
            services.AddScoped<ClaimService>();
            services.AddScoped<IClaimDocumentRepository, ClaimDocumentRepository>();
            services.AddScoped<ClaimDocumentService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<PaymentService>();
            services.AddScoped<InvoiceService>();
            services.AddScoped<IFraudDetectionService, FraudDetectionService>();
            services.AddScoped<IPremiumCalculationService, PremiumCalculationService>();
            services.AddScoped<IVehicleRiskService, VehicleRiskService>();
            var jwtKey = configuration["Jwt:Key"]!;
            var jwtIssuer = configuration["Jwt:Issuer"]!;
            var jwtAudience = configuration["Jwt:Audience"]!;
            var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(keyBytes),

                    ValidateIssuer = true,
                    ValidIssuer = jwtIssuer,

                    ValidateAudience = true,
                    ValidAudience = jwtAudience,

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            return services;
        }
    }
}
