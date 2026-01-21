using System.Net;

namespace TrueMed.PatientManagement.Domain.Models.Response.Response.Base
{
    public class DataQueryResponse<T>
    {
        public string? Message { get; set; }
        public HttpStatusCode Status { get; set; }
        public int? Total { get; set; }
        public T? ResponseModel { get; set; }
    }
}
