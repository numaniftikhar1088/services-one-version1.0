using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Dtos
{
    public class CompendiumResult : IdentityResult<CompendiumResult>
    {
        public CompendiumResult(IdentityResult identityResult) : base(identityResult)
        {
        }

        public CompendiumResult(IdentityResult identityResult, string? key = "") : base(identityResult, key)
        {
        }

        public CompendiumResult(Status status, string msg) : base(status, msg)
        {
        }

        public CompendiumResult(Status status, string msg, string? errorKey = null, string type = "compndium") : base(status, msg, errorKey, type)
        {
        }
    }
}
