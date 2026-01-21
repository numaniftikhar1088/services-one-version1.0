
using Azure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using TrueMed.Domain.Helpers;

namespace TrueMed_Project_One_Service.Helpers
{
    public class HandleExceptionAttribute : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            if(context.Exception is InvalidOperationException 
                && context.Exception.InnerException!=null 
                && context.Exception.InnerException is X_Portal_Key_EXCEPTION)
            {
                context.Result = new ObjectResult("Invalid Tenant(Lab) Key \"LabKey\"") { StatusCode = (int)HttpStatusCode.BadRequest };
                return;
            }
            else if (context.Exception is X_Portal_Key_EXCEPTION)
            {
                context.Result = new ObjectResult("You don't have access. Please check whether you'r correctly spcifying Tenant(Lab) Key \"X-Portal-Key\" in request header.") { StatusCode = (int)HttpStatusCode.Forbidden };
                return;
            }
            else
            {
                context.Result = new ObjectResult(context.Exception.ToString()) { StatusCode = (int)HttpStatusCode.InternalServerError };
                return;
            }
        }
    }
}