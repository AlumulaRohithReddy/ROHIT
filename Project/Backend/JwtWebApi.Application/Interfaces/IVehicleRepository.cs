using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Domain.Entities;
namespace JwtWebApi.Application.Interfaces
{
    

    public interface IVehicleRepository
    {
        Task AddAsync(Vehicle vehicle);

        Task<List<Vehicle>> GetByCustomerIdAsync(int customerId);

        Task<Vehicle?> GetByIdAsync(int id);

        void Update(Vehicle vehicle);

        void Delete(Vehicle vehicle);

        Task SaveChangesAsync();
    }
}
