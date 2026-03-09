using System.ComponentModel.DataAnnotations;

namespace JwtWebApi.Domain.Entities
{
    public class SystemSetting
    {
        [Key]
        public string SettingKey { get; set; } = string.Empty;
        public string SettingValue { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Group { get; set; } = "General";
    }
}
