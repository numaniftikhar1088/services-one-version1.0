using System.Net;

namespace TrueMed.FacilityManagement.Domain.Models.ResponseModel
{
    public class DataQueryResponse<TData>
    {
        public HttpStatusCode StatusCode { get; set; }
        public int Total { get; set; }
        public int Filtered { get; set; }
        public TData Data { get; set; }
    }
}
