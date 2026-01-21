using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;

namespace TrueMed_Project_One_Service.Helpers
{
    public class ClaimsAuthorizeAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private string claimType;
        private string claimValue;
        public ClaimsAuthorizeAttribute(string claimType,
           string claimValue)
        {
            this.claimType = claimType;
            this.claimValue = claimValue;
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            if (user.Identity?.IsAuthenticated == false || !user.HasClaim(claimType, claimValue))
            {
                context.Result = new UnauthorizedResult();
            }
        }
    }
}