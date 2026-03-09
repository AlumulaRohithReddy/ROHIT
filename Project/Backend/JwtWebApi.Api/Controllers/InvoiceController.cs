using JwtWebApi.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JwtWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly InvoiceService _service;

        public InvoiceController(InvoiceService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        //  DOWNLOAD INVOICE
        [HttpGet("{paymentId}")]
        public async Task<IActionResult> DownloadInvoice(int paymentId)
        {
            var userId = GetUserId();

            var pdf = await _service.GenerateInvoice(paymentId, userId);

            return File(pdf, "application/pdf", $"Invoice_{paymentId}.pdf");
        }
    }
}