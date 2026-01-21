using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.RequisitionManagement.Domain.Models
{
    public class RequisitionResult : IdentityResult<RequisitionResult>
    {
        public RequisitionResult(IdentityResult identityResult) : base(identityResult)
        {
        }

        public RequisitionResult(IdentityResult identityResult, string? key = "") : base(identityResult, key)
        {
        }

        public RequisitionResult(Status status, string msg) : base(status, msg)
        {
        }

        public RequisitionResult(Status status, string msg, string? errorKey = null, string type = "Requisition") : base(status, msg, errorKey, type)
        {
        }
    }
}
