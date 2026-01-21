namespace TrueMed.UserManagement.Domain.Models.QueryModels.Response.Base
{
    public class DataQueryResponse<TResponseModel>
    {
        public int Total { get; set; }
        public TResponseModel? Result { get; set; }
    }
}
