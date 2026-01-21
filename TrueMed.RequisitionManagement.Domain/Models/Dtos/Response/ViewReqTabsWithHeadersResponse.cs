using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class ViewReqTabsWithHeadersResponse
    {
        public int TabID { get; set; }
        public string TabName { get; set; }
        public List<TabHeader> TabHeaders { get; set; }
    }
    public class TabHeader
    {
        public string ColumnLabel { get; set; }
        public string FilterColumns { get; set; }
        public string FilterColumnsType { get; set; }
        public bool IsShowOnUI { get; set; }
        public string ColumnKey { get; set; }
    }

    public class ViewReqTabsWithHeadersStoreProcedureResponse
    {
        public int TabID { get; set; }
        public string TabName { get; set; }
        public string ColumnLabel { get; set; }
        public string FilterColumns { get; set; }
        public string FilterColumnsType { get; set; }
        public bool IsShowOnUI { get; set; }
        public string ColumnKey { get; set; }

    }
   

}
