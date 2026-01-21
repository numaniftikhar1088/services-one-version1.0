using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.FacilityManagement.Domain.Models.Facility.DTOs
{
    public class FacilityResult : IdentityResult<FacilityResult>
    {
        public FacilityResult(IdentityResult identityResult) : base(identityResult)
        {
        }

        public FacilityResult(IdentityResult identityResult, string? key = "") : base(identityResult, key)
        {
        }

        public FacilityResult(Status status, string msg) : base(status, msg)
        {
        }

        public FacilityResult(Status status, string msg, string? errorKey = null, string type = "facility") : base(status, msg, errorKey, type)
        {
        }
    }

    public class FacilityBulkResult : FacilityResult
    {
        public FacilityBulkResult(Status status, string msg, string? errorKey = null) : base(status, msg, errorKey)
        {
            ErrorResults = new List<ErrorResult>();
            SuccessResults = new List<object>();
        }

        public List<ErrorResult> ErrorResults { get; set; }
        public List<object> SuccessResults { get; set; }
    }

    public class ErrorResult
    {
        public object? Errors { get; set; }
        public object? ErrorProneItem { get; set; }
    }

}
