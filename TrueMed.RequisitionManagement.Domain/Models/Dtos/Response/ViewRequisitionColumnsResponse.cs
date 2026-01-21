using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class ViewRequisitionColumnsResponse
    {
        public int Id { get; set; }
        public string? ColumnLabel { get;set; }
        public string? ColumnName { get; set; }
        public bool IsShow { get; set; }
        public string? ColumnValue { get; set; }

        public bool? IsShowOnUi { get; set; }
        public string? FilterColumns { get; set; }
        public string? FilterColumnsType { get; set; }
        public int ColumnOrder { get; set; }
    }
}
