using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;

namespace TrueMed.Domain.Helpers
{
    public class Required_X_Portal_Key : ActionFilterAttribute, IActionFilter
    {
        private readonly bool _isRequired;
        public Required_X_Portal_Key(bool isRequired = true)
        {
            this._isRequired = isRequired;
        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var connectionManager = context.HttpContext.RequestServices.GetService<IConnectionManager>();
            if (_isRequired && (!connectionManager.IsPortalExist ||
                !connectionManager.HasLabAccess()))
            {
                context.Result = new ContentResult()
                {
                    StatusCode = (int)HttpStatusCode.Forbidden,
                    Content = $"You don't have access. Please check whether you'r correctly spcifying Tenant(Lab) Key \"X-Portal-Key\" in request header."
                };
                return;
            }
        }
    }
}
