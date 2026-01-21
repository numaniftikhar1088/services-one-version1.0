using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Globalization;
using TrueMed.Business.Helpers;
using TrueMed.Business.Interface;

namespace TrueMed_Project_One_Service.Helpers
{

    public class RequestValidateMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestValidateMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IConnectionManager connectionManager)
        {
            var cultureQuery = context.Request.Query["culture"];
            if (!string.IsNullOrWhiteSpace(cultureQuery))
            {
                var culture = new CultureInfo(cultureQuery);

                CultureInfo.CurrentCulture = culture;
                CultureInfo.CurrentUICulture = culture;
            }

            if (!connectionManager.IsPortalExist && !connectionManager.IsMasterUser)
            {
                context.Response.StatusCode = (int)System.Net.HttpStatusCode.Forbidden;
                if (string.IsNullOrWhiteSpace(connectionManager.X_Portal_Key_Value))
                    await context.Response.WriteAsync($"You don't have access. Please check whether you'r correctly spcifying Tenant(Lab) Key \"X-Portal-Key\" in request header.");
                else
                    await context.Response.WriteAsync($"Tenant(Lab) '{connectionManager.X_Portal_Key_Value}' doesn't exist.");
                return;
            } 

            ThreadPool.QueueUserWorkItem((state) =>
            {
                try
                {
                    LogVerificationService.VerifyLogs(connectionManager);
                }
                catch (Exception ec) { }
            });

            // Call the next delegate/middleware in the pipeline.
            await _next(context);
        }
    }


    public static class MyRequestValidateMiddleware
    {
        public static IApplicationBuilder UseRequestValidateMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RequestValidateMiddleware>();
        }
    }
}
