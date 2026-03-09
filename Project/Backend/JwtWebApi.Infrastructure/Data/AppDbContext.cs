using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace JwtWebApi.Infrastructure.Data
{
    public class AppDbContext : DbContext,IAppDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Vehicle> Vehicles => Set<Vehicle>();
        public DbSet<PolicyPlan> PolicyPlans => Set<PolicyPlan>();
        public DbSet<Policy> Policies => Set<Policy>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Claim> Claims => Set<Claim>();
        public DbSet<ClaimDocument> ClaimDocuments => Set<ClaimDocument>();
        public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // USER
            modelBuilder.Entity<User>()
                .HasKey(u => u.UserId);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // VEHICLE
            modelBuilder.Entity<Vehicle>()
                .HasKey(v => v.VehicleId);

            modelBuilder.Entity<Vehicle>()
                .Property(v => v.CurrentMarketValue)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Vehicle>()
                .Property(v => v.VehicleRiskScore)
                .IsRequired();

            modelBuilder.Entity<Vehicle>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(v => v.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            // POLICY PLAN
            modelBuilder.Entity<PolicyPlan>()
                .HasKey(p => p.PlanId);

            modelBuilder.Entity<PolicyPlan>()
                .Property(p => p.BasePremium)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PolicyPlan>()
                .Property(p => p.MaxCoverageAmount)
                .HasPrecision(18, 2);

            // POLICY
            modelBuilder.Entity<Policy>(entity =>
            {
                entity.HasKey(p => p.PolicyId);

                entity.Property(p => p.PremiumAmount)
                      .HasPrecision(18, 2);

                entity.Property(p => p.IDV)
                      .HasPrecision(18, 2);

                // Customer
                entity.HasOne(p => p.Customer)
                      .WithMany(u => u.Policies)
                      .HasForeignKey(p => p.CustomerId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Agent
                entity.HasOne(p => p.Agent)
                      .WithMany()
                      .HasForeignKey(p => p.AgentId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Vehicle
                entity.HasOne(p => p.Vehicle)
                      .WithMany(v => v.Policies)
                      .HasForeignKey(p => p.VehicleId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Plan
                entity.HasOne(p => p.Plan)
                      .WithMany(pl => pl.Policies)
                      .HasForeignKey(p => p.PlanId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<ClaimDocument>(entity =>
            {
                entity.HasKey(x => x.DocumentId);

                entity.HasOne(cd => cd.Claim)
                      .WithMany(c => c.ClaimDocuments)
                      .HasForeignKey(cd => cd.ClaimId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // PAYMENT
            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            // CLAIM
            modelBuilder.Entity<Claim>(entity =>
            {
                entity.Property(c => c.ClaimedAmount).HasPrecision(18, 2);
                entity.Property(c => c.ApprovedAmount).HasPrecision(18, 2);
                entity.Property(c => c.FraudScore).IsRequired();
                entity.Property(c => c.FraudRiskLevel).HasMaxLength(20);

                // Claim -> Customer (no cascade to avoid multiple cascade paths)
                entity.HasOne(c => c.Customer)
                      .WithMany()
                      .HasForeignKey(c => c.CustomerId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(c => c.Policy)
                      .WithMany()
                      .HasForeignKey(c => c.PolicyId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // SYSTEM SETTINGS
            modelBuilder.Entity<SystemSetting>()
                .HasKey(s => s.SettingKey);
        }
    }
}
