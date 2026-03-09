using JwtWebApi.Application.Exceptions;
using System.Net;
using JwtWebApi.Application.Common;
using Microsoft.AspNetCore.Diagnostics;

namespace JwtWebApi.Api.Middlewares
{
    public class ExceptionMiddleware : IExceptionHandler
    {
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(ILogger<ExceptionMiddleware> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

            var (statusCode, message) = exception switch
            {
                NotFoundException => (HttpStatusCode.NotFound, exception.Message),
                BadRequestException => (HttpStatusCode.BadRequest, exception.Message),
                UnauthorizedException => (HttpStatusCode.Unauthorized, exception.Message),
                _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred")
            };

            var response = new ApiResponse<object>
            {
                Success = false,
                Message = statusCode == HttpStatusCode.InternalServerError 
                    ? $"Internal Server Error: {exception.Message}" 
                    : message,
                Errors = new List<string> { exception.Message }
            };

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)statusCode;

            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

            return true;
        }
    }
}
