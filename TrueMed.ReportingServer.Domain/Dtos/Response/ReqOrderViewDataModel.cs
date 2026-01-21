using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.ReportingServer.Domain.Dtos.Response
{
    public class ReqOrderViewDataModel
    {
        public ReqOrderViewResponse Content { get; set; } = new ReqOrderViewResponse();
        public ReqOrderViewHeader Header { get; set; } = new ReqOrderViewHeader();
    }
    public class ReqOrderViewHeader
    {
        public byte[] Logo { get; set; }
        public string Title { get; set; }
    }
    public class ReqOrderViewResponse
    {
        public int ReqtypeID { get; set; }
        public string ReqDisplayName { get; set; }
        public List<ReqOrderViewSections> Sections { get; set; }


    }
    public class ReqOrderViewSections
    {
        public int SectionId { get; set; }
        public string SectionDisplayName { get; set; }
        public string SectionDisplayType { get; set; }
        public int SortOrder { get; set; }
        public List<ReqOrderViewResponse> Requistions { get; set; }
        public List<ReqOrderViewField> Fields { get; set; }


    }
    public class ReqOrderViewField
    {
        public int ControlId { get; set; }
        public string SystemFieldName { get; set; }
        public string FieldName { get; set; }
        public dynamic FieldValue { get; set; }
        public string DisplayType { get; set; }
        public int SortOrder { get; set; }

    }
}
