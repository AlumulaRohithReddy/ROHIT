using JwtWebApi.Application.DTOs;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;

namespace JwtWebApi.Application.Services
{
    public class PaymentService
    {
        private readonly IPaymentRepository _paymentRepo;
        private readonly IPolicyRepository _policyRepo;

        public PaymentService(IPaymentRepository paymentRepo, IPolicyRepository policyRepo)
        {
            _paymentRepo = paymentRepo;
            _policyRepo = policyRepo;
        }

        //  MAKE PAYMENT
        public async Task<string> MakePayment(int userId, CreatePaymentRequest request)
        {
            var policy = await _policyRepo.GetByIdAsync(request.PolicyId);

            if (policy == null)
                throw new Exception("Policy not found");

            if (policy.CustomerId != userId)
                throw new Exception("Unauthorized access");

            if (policy.Status == "Active")
                throw new Exception("Policy already active");

            //  simulate payment success
            var payment = new Payment
            {
                PolicyId = policy.PolicyId,
                Amount = policy.PremiumAmount,
                PaymentMethod = request.PaymentMethod,
                Status = "Success",
                TransactionId = Guid.NewGuid().ToString()
            };

            await _paymentRepo.AddAsync(payment);

            // Activate policy
            policy.Status = "Active";

            await _paymentRepo.SaveChangesAsync();

            return "Payment successful. Policy activated.";
        }

        //  GET USER PAYMENTS
        public async Task<List<PaymentResponse>> GetMyPayments(int userId)
        {
            var payments = await _paymentRepo.GetByUserIdAsync(userId);

            return payments.Select(p => new PaymentResponse
            {
                PaymentId = p.PaymentId,
                PolicyId = p.PolicyId,
                Amount = p.Amount,
                Status = p.Status,
                TransactionId = p.TransactionId,
                PaymentDate = p.PaymentDate
            }).ToList();
        }

        //  GET PAYMENT BY ID
        public async Task<PaymentResponse> GetPayment(int id)
        {
            var payment = await _paymentRepo.GetByIdAsync(id);

            if (payment == null)
                throw new Exception("Payment not found");

            return new PaymentResponse
            {
                PaymentId= payment.PaymentId,
                PolicyId = payment.PolicyId,
                Amount = payment.Amount,
                Status = payment.Status,
                TransactionId = payment.TransactionId,
                PaymentDate = payment.PaymentDate
            };
        }
    }
}