using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;
using TrueMed.UserManagement.Domain.Models.Identity;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos
{
    public class LabIdentityResult : IdentityResult
    {
        public LabIdentityResult(IdentityResult identityResult) : base(identityResult)
        {
        }

        public LabIdentityResult(IdentityResult identityResult, string? key = "") : base(identityResult, key)
        {
        }

        public LabIdentityResult(Status status, string msg, string? errorKey = null, string type = "lab") : base(status, msg, errorKey, type)
        {
        }

        public int? LabId { get; set; }
    }
}
