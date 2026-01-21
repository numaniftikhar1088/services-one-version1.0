using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.Facility.Response
{
    public class FacilityReportTemplateResponse
    {
        public int Id { get; set; }
        public string TemplateName { get; set; }
        public string TemplateDisplayName { get; set; }
        public string TemplateUrl { get; set; }
        public int? ReqTypeId { get; set; }
        public string ReqType { get; set; }
    }
}
