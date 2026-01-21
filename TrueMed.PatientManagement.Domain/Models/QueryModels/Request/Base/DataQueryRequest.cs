namespace TrueMed.PatientManagement.Domain.Models.Response.Request.Base
{
    public class DataQueryRequest<T>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public T? RequestModel { get; set; }
        public string? SortColumn { get; set; }
        public string? SortDirection { get; set; }
    }
}
