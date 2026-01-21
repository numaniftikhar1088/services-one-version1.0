using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.Identity
{
    public static class IdentityExtention
    {
        public static string GetUserId(this IPrincipal identity)
        {
            var user = identity as ClaimsPrincipal;
            var claim = user.FindFirst(ClaimTypes.NameIdentifier);
            return claim == null ? "" : claim.Value;
        }
    }
}
