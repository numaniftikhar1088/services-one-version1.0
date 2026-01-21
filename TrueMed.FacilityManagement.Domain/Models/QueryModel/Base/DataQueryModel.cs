using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.QueryModel.Base
{
    public class DataQueryModel<TQueryModel>
    {
        public int PageNumber { get; set; } = 0;
        public int PageSize { get; set; }
        public TQueryModel QueryModel { get; set; }
        public string? SortColumn { get; set; }
        public string? SortDirection { get; set; }
    }
}
