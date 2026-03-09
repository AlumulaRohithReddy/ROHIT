using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using JwtWebApi.Application.Interfaces;
using iText.Kernel.Font;
using iText.IO.Font.Constants;
using JwtWebApi.Domain.Entities;
namespace JwtWebApi.Application.Services
{
    public class InvoiceService
    {
        private readonly IPaymentRepository _paymentRepo;

        public InvoiceService(IPaymentRepository paymentRepo)
        {
            _paymentRepo = paymentRepo;
        }

        public async Task<byte[]> GenerateInvoice(int paymentId, int userId)
        {
            Payment? payment;
            try 
            {
                payment = await _paymentRepo.GetByIdAsync(paymentId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Database error while fetching payment {paymentId}: {ex.Message}");
            }

            if (payment == null)
                throw new Exception($"Payment with ID {paymentId} not found in database.");

            if (payment.Policy == null)
                throw new Exception($"Policy details missing for payment {paymentId}. Ensure policy is correctly linked.");

            if (payment.Policy.CustomerId != userId)
                throw new Exception($"Access Denied: Current User ID {userId} does not match Policy Customer ID {payment.Policy.CustomerId}.");

            try 
            {
                using var stream = new MemoryStream();

                var writer = new PdfWriter(stream);
                var pdf = new PdfDocument(writer);
                var document = new iText.Layout.Document(pdf);
                
                // Define standard font
                PdfFont? boldFont = null;
                try 
                {
                   boldFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                }
                catch (Exception fontEx) 
                {
                    // Fallback to default if font factory fails, but note it
                    Console.WriteLine($"Font load failed: {fontEx.Message}");
                }

                var title = new Paragraph("VEHICLE INSURANCE INVOICE")
                        .SetFontSize(20);
                
                if (boldFont != null) title.SetFont(boldFont);
                
                document.Add(title);
                
                // 🔹 DETAILS
                document.Add(new Paragraph($"Invoice ID: {payment.PaymentId}"));
                document.Add(new Paragraph($"Transaction ID: {payment.TransactionId ?? "N/A"}"));
                document.Add(new Paragraph($"Date: {payment.PaymentDate.ToShortDateString()}"));

                document.Add(new Paragraph("\n"));

                // 🔹 POLICY DETAILS
                var policyTitle = new Paragraph("Policy Details").SetFontSize(16);
                if (boldFont != null) policyTitle.SetFont(boldFont);
                document.Add(policyTitle);

                document.Add(new Paragraph($"Policy Number: {payment.Policy?.PolicyNumber}"));
                document.Add(new Paragraph($"Vehicle Number: {payment.Policy?.Vehicle?.RegistrationNumber ?? "N/A"}"));
                document.Add(new Paragraph($"Plan: {payment.Policy?.Plan?.PlanName ?? "N/A"}"));

                document.Add(new Paragraph("\n"));

                // 🔹 PAYMENT DETAILS
                var paymentTitle = new Paragraph("Payment Details").SetFontSize(16);
                if (boldFont != null) paymentTitle.SetFont(boldFont);
                document.Add(paymentTitle);

                document.Add(new Paragraph($"Amount Paid: INR {payment.Amount}"));
                document.Add(new Paragraph($"Status: {payment.Status}"));
                document.Add(new Paragraph($"Payment Method: {payment.PaymentMethod}"));

                document.Add(new Paragraph("\n"));
                document.Add(new Paragraph("Thank you for your payment!"));

                document.Close();
                return stream.ToArray();
            }
            catch (Exception pdfEx)
            {
                throw new Exception($"PDF Generation Error: {pdfEx.Message}. {pdfEx.InnerException?.Message}");
            }
        }
    }
}