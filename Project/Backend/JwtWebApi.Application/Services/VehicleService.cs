using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Application.DTOs.Vehicle;
using JwtWebApi.Application.Exceptions;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
namespace JwtWebApi.Application.Services { 
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IVehicleRiskService _riskService;
        private readonly IPolicyRepository _policyRepository;

        public VehicleService(IVehicleRepository vehicleRepository, IVehicleRiskService riskService, IPolicyRepository policyRepository)
        {
            _vehicleRepository = vehicleRepository;
            _riskService = riskService;
            _policyRepository = policyRepository;
        }

        //  Add Vehicle
        public async Task<int> AddVehicle(CreateVehicleDto dto, int userId)
        {
            if (string.IsNullOrWhiteSpace(dto.RegistrationNumber))
                throw new BadRequestException("Registration number is required");

            if (dto.Year < 1900 || dto.Year > 2026)
                throw new BadRequestException("Vehicle year must be between 1900 and 2026.");

            var vehicle = new Vehicle
            {
                CustomerId = userId,
                UserId = userId,
                RegistrationNumber = dto.RegistrationNumber,
                Make = dto.Make,
                Model = dto.Model,
                Year = dto.Year,
                FuelType = dto.FuelType,
                VehicleType = dto.VehicleType,
                CurrentMarketValue = dto.CurrentMarketValue,
            };

            // Calculate Risk Score
            vehicle.VehicleRiskScore = await _riskService.CalculateVehicleRiskScoreAsync(vehicle);

            await _vehicleRepository.AddAsync(vehicle);
            await _vehicleRepository.SaveChangesAsync();

            return vehicle.VehicleId;
        }

        //  Get Vehicles
        public async Task<List<Vehicle>> GetVehicles(int userId)
        {
            return await _vehicleRepository.GetByCustomerIdAsync(userId);
        }

        //  Get Vehicle by Id
        public async Task<Vehicle> GetVehicleById(int id)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(id);

            if (vehicle == null)
                throw new NotFoundException("Vehicle not found");

            return vehicle;
        }

        //  Update
        public async Task UpdateVehicle(int id, UpdateVehicleDto dto)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(id);

            if (vehicle == null)
                throw new NotFoundException("Vehicle not found");

            vehicle.Make = dto.Make;
            vehicle.Model = dto.Model;
            vehicle.Year = dto.Year;
            vehicle.FuelType = dto.FuelType;
            vehicle.VehicleType = dto.VehicleType;
            vehicle.CurrentMarketValue = dto.CurrentMarketValue;

            _vehicleRepository.Update(vehicle);
            await _vehicleRepository.SaveChangesAsync();
        }

        //  Delete
        public async Task DeleteVehicle(int id)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(id);

            if (vehicle == null)
                throw new NotFoundException("Vehicle not found");

            // Check if vehicle has any policies
            var policies = await _policyRepository.GetByVehicleIdAsync(id);
            if (policies.Any())
            {
                throw new BadRequestException("This vehicle cannot be deleted because it is currently linked to one or more insurance policies. Please cancel or remove the policies before deleting the vehicle.");
            }

            _vehicleRepository.Delete(vehicle);
            await _vehicleRepository.SaveChangesAsync();
        }
    }
}
