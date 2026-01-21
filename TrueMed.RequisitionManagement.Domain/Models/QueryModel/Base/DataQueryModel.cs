namespace TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base
{
    public class DataQueryModel<TQueryModel>
    {
        public int PageNumber { get; set; } = 0;
        public int PageSize { get; set; }
        public TQueryModel QueryModel { get; set; }
        public string? SortColumn { get; set; }
        public string? SortDirection { get; set; }
    }
    //public enum SortDirection
    //{
    //    asc = 0,
    //    desc = 1
    //}










}
