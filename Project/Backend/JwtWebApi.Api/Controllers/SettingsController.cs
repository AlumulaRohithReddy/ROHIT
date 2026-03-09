using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace JwtWebApi.Api.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly IAppDbContext _context;

        public SettingsController(IAppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SystemSetting>>> GetSettings()
        {
            return await _context.SystemSettings.ToListAsync();
        }

        [HttpPut("{key}")]
        public async Task<IActionResult> UpdateSetting(string key, [FromBody] string value)
        {
            var setting = await _context.SystemSettings.FindAsync(key);
            if (setting == null)
            {
                return NotFound();
            }

            setting.SettingValue = value;
            await _context.SaveChangesAsync();

            return Ok(new { Success = true, Message = "Setting updated successfully" });
        }
        
        [HttpPost("bulk-update")]
        public async Task<IActionResult> BulkUpdateSettings([FromBody] List<SystemSetting> settings)
        {
            foreach (var setting in settings)
            {
                var existing = await _context.SystemSettings.FindAsync(setting.SettingKey);
                if (existing != null)
                {
                    existing.SettingValue = setting.SettingValue;
                }
            }
            
            await _context.SaveChangesAsync();
            return Ok(new { Success = true, Message = "Settings updated successfully" });
        }
    }
}
