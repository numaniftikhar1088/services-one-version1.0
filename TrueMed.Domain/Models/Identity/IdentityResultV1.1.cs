using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.Identity
{
    public partial class IdentityResult<T> : IdentityResult where T : IdentityResult
    {
        public IdentityResult(IdentityResult identityResult) : base(identityResult)
        {
        }

        public IdentityResult(IdentityResult identityResult, string? key = "") : base(identityResult, key)
        {
        }

        public IdentityResult(Status status, string msg) : base(status, msg)
        {
        }

        public IdentityResult(Status status, string msg, string? errorKey = null, string type = "identity") : base(status, msg, errorKey, type)
        {
            
        }
        public static T Successed => SuccessResult<T>();
        public static T Failed => FailedResult<T>();
        public T Response(bool isSuccess)
        {
            return CreateResponse<T>(isSuccess);
        }
        public T MakeFailed()
        {
            return MakeFailed<T>();
        }
        public T MakeSuccessed()
        {
            return MakeSuccessed<T>();
        }
    }

}
