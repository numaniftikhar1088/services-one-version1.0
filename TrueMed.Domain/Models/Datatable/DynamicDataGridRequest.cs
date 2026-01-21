using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.Datatable
{
    public class DynamicDataGridRequest<T>
    {
        public int TabId { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public string SortColumn { get; set; }
        public string SortDirection { get; set; }
        public List<T> Filters { get; set; }
        public int[]? selectedRow { get; set; }


    }
    public class DynamicDataFilter
    {
        public string ColumnName { get; set; }
        public string FilterValue { get; set; }
        public string ColumnType { get; set; }
    }
}
