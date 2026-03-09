using JwtWebApi.Application.Common;
using JwtWebApi.Application.Interfaces;
using JwtWebApi.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace JwtWebApi.Application.Services
{
    public class ClaimDocumentService
    {
        private readonly IClaimDocumentRepository _repo;
        private readonly IClaimRepository _claimRepo;
        private readonly IFileService _fileService;

        public ClaimDocumentService(
            IClaimDocumentRepository repo,
            IClaimRepository claimRepo,
            IFileService fileService)
        {
            _repo = repo;
            _claimRepo = claimRepo;
            _fileService = fileService;
        }

        //  UPLOAD DOCUMENT
        public async Task<string> Upload(int userId, int claimId, IFormFile file)
        {
            //  Validate file
            if (file == null || file.Length == 0)
                throw new Exception("File is required");

            //  Validate claim
            var claim = await _claimRepo.GetByIdAsync(claimId);

            if (claim == null)
                throw new Exception("Claim not found");

            //  Check ownership
            if (claim.CustomerId != userId)
                throw new Exception("Unauthorized access to claim");

            //  Save file using FileService
            var filePath = await _fileService.SaveFileAsync(file);

            //  Create document entity
            var document = new ClaimDocument
            {
                ClaimId = claimId,
                FilePath = filePath,
                UploadedAt = DateTime.UtcNow
            };

            await _repo.AddAsync(document);
            await _repo.SaveChangesAsync();

            return "Document uploaded successfully";
        }

        // GET DOCUMENTS BY CLAIM
        public async Task<List<string>> GetDocuments(int claimId, int userId, string role)
        {
            var claim = await _claimRepo.GetByIdAsync(claimId);

            if (claim == null)
                throw new Exception("Claim not found");

            var isOfficer = role == "ClaimsOfficer" || role == "Officer";

            if (role == "Customer" && claim.CustomerId != userId)
                throw new Exception("Unauthorized access");

            if (isOfficer && claim.ClaimsOfficerId != userId)
                throw new Exception("Unauthorized access: You are not assigned to this claim");

            var documents = await _repo.GetByClaimIdAsync(claimId);

            return documents.Select(d => d.FilePath).ToList();
        }

        //  DELETE DOCUMENT
        public async Task<string> DeleteDocument(int documentId, int userId)
        {
            var document = await _repo.GetByIdAsync(documentId);

            if (document == null)
                throw new Exception("Document not found");

            var claim = await _claimRepo.GetByIdAsync(document.ClaimId);

            if (claim.CustomerId != userId)
                throw new Exception("Unauthorized");

            await _repo.DeleteAsync(document);
            await _repo.SaveChangesAsync();

            return "Document deleted successfully";
        }
    }
}




