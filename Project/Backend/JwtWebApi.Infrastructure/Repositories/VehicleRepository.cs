using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Application.Exceptions;
using JwtWebApi.Application.Interfaces;
using   JwtWebApi.Domain.Entities;
using JwtWebApi.Infrastructure.Data;
namespace JwtWebApi.Infrastructure.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly IAppDbContext _context;

        public VehicleRepository(IAppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Vehicle vehicle)
        {
            var normalizedReg = vehicle.RegistrationNumber.Replace(" ", "").Replace("-", "").ToUpper();
            if (await _context.Vehicles.AnyAsync(v => v.RegistrationNumber.Replace(" ", "").Replace("-", "").ToUpper() == normalizedReg))
                throw new BadRequestException("A vehicle with this registration already exists in our system.");
            await _context.Vehicles.AddAsync(vehicle);
        }

        public async Task<List<Vehicle>> GetByCustomerIdAsync(int customerId)
        {
            return await _context.Vehicles
                .Where(v => v.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<Vehicle?> GetByIdAsync(int id)
        {
            return await _context.Vehicles.FindAsync(id);
        }

        public void Update(Vehicle vehicle)
        {
            _context.Vehicles.Update(vehicle);
        }

        public void Delete(Vehicle vehicle)
        {
            _context.Vehicles.Remove(vehicle);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
