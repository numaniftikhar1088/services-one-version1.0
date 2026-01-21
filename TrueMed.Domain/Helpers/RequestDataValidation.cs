using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Headers;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.Domain.Helpers
{
    public class RequestDataValidationAttribute : ActionFilterAttribute
    {
        public bool IsFilterActive { get; set; }
        public RequestDataValidationAttribute()
        {
            IsFilterActive = true;
        }
        public RequestDataValidationAttribute(bool isFilterActive)
        {
            IsFilterActive = isFilterActive;

        }

        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            if (IsFilterActive)
            {
                if (!actionContext.ModelState.IsValid)
                {
                    actionContext.Result = new BadRequestObjectResult(actionContext.ModelState);
                }
            }
        }
    }
}