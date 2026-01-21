using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.UserManagement.Domain.Models.QueryModels.Request.Base
{
    public class DataQueryRequest<TRequestModel>
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public TRequestModel? RequestModel { get; set; }
        public string? SortColumn { get; set; }
        public string? SortDirection { get; set; }
    }
    //public enum SortDirection
    //{
    //    asc = 0,
    //    desc = 1
    //}
}
