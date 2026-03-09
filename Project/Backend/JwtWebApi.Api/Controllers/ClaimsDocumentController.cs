using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using JwtWebApi.Application.Common;
namespace JwtWebApi.Controllers
{
    using JwtWebApi.Application.Services;
    using JwtWebApi.Domain.Entities;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using System.Security.Claims;

    [ApiController]
    [Route("api/claim-documents")]
    [Authorize]
    public class ClaimDocumentController : ControllerBase
    {
        private readonly ClaimDocumentService _service;

        public ClaimDocumentController(ClaimDocumentService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        private string GetRole()
        {
            return User.FindFirst(ClaimTypes.Role)!.Value;
        }

        //  UPLOAD
        [HttpPost("{claimId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Upload(int claimId, IFormFile file)
        {
            var result = await _service.Upload(GetUserId(), claimId, file);
            return Ok(new ApiResponse<string> { Success = true, Message = result });
        }

        //  GET DOCUMENTS
        [HttpGet("{claimId}")]
        public async Task<IActionResult> GetDocuments(int claimId)
        {   var userId = GetUserId();
            var role = GetRole();
            var docs = await _service.GetDocuments(claimId, userId, role);
            return Ok(new ApiResponse<List<string>> { Success = true, Data = docs });
        }
    }
}
