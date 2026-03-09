using JwtWebApi.Domain.Entities;
using System.Threading.Tasks;

namespace JwtWebApi.Application.Interfaces
{
    public interface IFraudDetectionService
    {
        Task<(int Score, string Level)> DetectFraudAsync(Claim claim);
    }
}
