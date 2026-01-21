using TrueMed.Domain.Helpers;

namespace TrueMed.Domain.Model.Identity
{
    public partial class IdentityResult
    {
        public static T GenerateResult<T>(Status status, string msg) where T : IdentityResult
        {
            var parameters = ReflectionHelper.GetConstructorParamters<T>(typeof(Status), typeof(string), typeof(string), typeof(string));
            return (T)Activator
                .CreateInstance(typeof(T),
                new object[] { status, msg,
                    parameters.GetDefultValue<string>("errorKey"),
                    parameters.GetDefultValue<string>("type")
                });
        }

        public static T FailedResult<T>(string msg = "One or more validation errors.") where T : IdentityResult
        {
            return GenerateResult<T>(Status.Failed, msg);
        }

        public static T SuccessResult<T>(string msg = "request successfully processed.") where T : IdentityResult
        {
            return GenerateResult<T>(Status.Success, msg);
        }

        public static IdentityResult FailedResult(string msg = "One or more validation errors.")
        {
            return FailedResult<IdentityResult>(msg);
        }

        public T MakeSuccessed<T>(string message = "request successfully processed.") where T : IdentityResult
        {
            return (T)MakeSuccessed(message);
        }

        public T MakeFailed<T>(string message = "something went wrong during request processing.") where T : IdentityResult
        {
            return (T)MakeFailed(message);
        }

        public IdentityResult CreateResponse(bool isSuccess)
        {
            if (isSuccess)
                return this.MakeSuccessed();
            else
                return this.MakeFailed();
        }

        public T CreateResponse<T>(bool isSuccess) where T : IdentityResult
        {
            if (isSuccess)
                return (T)this.MakeSuccessed();
            else
                return (T)this.MakeFailed();
        }

        public IdentityResult MakeFailed(string message = "Something went wrong, please contact to administrator.")
        {
            Status = Status.Failed;
            if (Errors.Count > 0)
                Message = "One or more validation errors.";
            else
                Message = message;
            return this;
        }

        public IdentityResult MakeSuccessed(string message = "request successfully processed.")
        {
            Status = Status.Success;
            Message = message;
            Errors.Clear();
            return this;
        }

    }
}
