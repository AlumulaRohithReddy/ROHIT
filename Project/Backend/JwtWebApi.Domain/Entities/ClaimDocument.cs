using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Domain.Entities
{
    
    public class ClaimDocument
    {
        public int DocumentId { get; set; }
        public int ClaimId { get; set; }

        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;

        public DateTime UploadedAt { get; set; }

        public Claim Claim { get; set; } = null!;
    }
}
