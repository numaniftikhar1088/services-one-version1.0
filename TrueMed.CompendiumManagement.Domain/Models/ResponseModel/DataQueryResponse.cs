namespace TrueMed.CompendiumManagement.Domain.Models.ResponseModel
{
    public class DataQueryResponse<TData>
    {
        public int TotalRecord { get; set; }
        public int FilteredRecord { get; set; }
        public TData Result { get; set; }
    }
}
