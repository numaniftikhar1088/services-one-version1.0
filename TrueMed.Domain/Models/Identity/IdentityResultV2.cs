using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.UserManagement.Domain.Models.Identity
{
    public class IdentityResultV2 : IdentityResult
    {
        public IdentityResultV2(IdentityResult identityResult, ApplicationUser user) : base(identityResult)
        {
            this.User = user;
        }

        public IdentityResultV2(IdentityResult identityResult, string? key = "") : base(identityResult, key)
        {
        }

        public IdentityResultV2(Status status, string msg) : base(status, msg)
        {
        }

        public IdentityResultV2(Status status, string msg, string? errorKey = null, string type = "identity") : base(status, msg, errorKey, type)
        {
        }

        public ApplicationUser? User { get; }
    }

    public static class IdentityResultExtention
    {
        public static IdentityResultV2 GenerateV2(this IdentityResult identityResult, ApplicationUser user)
        {
            return new IdentityResultV2(identityResult, user);
        }

        public static IdentityResultV2 GenerateV2(this IdentityResult identityResult)
        {
            return new IdentityResultV2(identityResult);
        }
    }
}
