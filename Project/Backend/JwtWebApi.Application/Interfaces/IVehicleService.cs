using System.Collections.Generic;
using System.Threading.Tasks;
using JwtWebApi.Application.DTOs.Vehicle;
using JwtWebApi.Domain.Entities;

namespace JwtWebApi.Application.Interfaces
{
    public interface IVehicleService
    {
        Task<int> AddVehicle(CreateVehicleDto dto, int userId);
        Task<List<Vehicle>> GetVehicles(int userId);
        Task<Vehicle> GetVehicleById(int id);
        Task UpdateVehicle(int id, UpdateVehicleDto dto);
        Task DeleteVehicle(int id);
    }
}
