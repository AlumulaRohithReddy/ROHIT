using JwtWebApi.Domain.Entities;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Interfaces
{
    public interface IVehicleRiskService
    {
        Task<int> CalculateVehicleRiskScoreAsync(Vehicle vehicle);
    }
}
