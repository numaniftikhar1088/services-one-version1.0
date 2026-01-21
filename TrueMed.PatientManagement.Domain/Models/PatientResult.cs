using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.PatientManagement.Domain.Models
{
    public class PatientResult : IdentityResult
    {
        public PatientResult(IdentityResult identityResult) : base(identityResult)
        {
        }

        public PatientResult(IdentityResult identityResult, string? key = "") : base(identityResult, key)
        {
        }

        public PatientResult(Status status, string msg) : base(status, msg, null, "patient")
        {

        }

        public PatientResult(Status status, string msg, string? errorKey = null, string type = "identity") : base(status, msg, errorKey, type)
        {
        }
    }
}
