using TrueMed.Domain.Model.Identity;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel
{

    public class RequestResponse<T>
    {
        public T Data { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public Status HttpStatusCode { get; set; }
        public object Error { get; set; }
    }
    public class RequestResponse : RequestResponse<object>
    {
    }

}
