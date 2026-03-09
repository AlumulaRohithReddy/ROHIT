using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JwtWebApi.Application.DTOs
{
    public class CreatePaymentRequest
    {
        public int PolicyId { get; set; }

        public string PaymentMethod { get; set; }
    }
}