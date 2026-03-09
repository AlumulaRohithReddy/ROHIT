using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.DTOs
{
    public class ClaimDocumentResponse
    {
        public int DocumentId { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
    }
}
