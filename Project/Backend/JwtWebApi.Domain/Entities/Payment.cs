using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JwtWebApi.Domain.Enums;
using System.ComponentModel.DataAnnotations;
namespace JwtWebApi.Domain.Entities
{
        public class Payment
        {
            [Key]
            public int PaymentId { get; set; }

            public int PolicyId { get; set; }

            public decimal Amount { get; set; }

            public string PaymentMethod { get; set; } // UPI, Card, NetBanking

            public string Status { get; set; } // Success, Failed

            public string TransactionId { get; set; }

            public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

            // Navigation
            public Policy Policy { get; set; }
        }
    }

