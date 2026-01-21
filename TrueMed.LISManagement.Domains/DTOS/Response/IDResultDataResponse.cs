using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domains.DTOS.Response
{
    public class IDResultDataResponse
    {
        public int RequisitionId { get; set; }
        public string? AccessionNumber { get; set; }
        public string? ReceiveDate { get; set; }
        public string? PublishBy { get; set; }
        public string? PublishDate { get; set; }
        public string? TestType { get; set; }
        public string? ResultValue { get; set; }
        public string? LisStatus { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string? DateOfBirth { get; set; }
        public string? RequisitionType { get; set; }
        public int? ReqTypeId { get; set; }
        public string? BatchId { get; set; }
        public string? ValidateReport { get; set; }
        public string? PublishReport { get; set; }
        public int? RequisitionStatusId { get; set; }
        public string? RecordId { get; set; }
        public int? RequisitionOrderId { get; set; }
        public int? FacilityId { get; set; }
        public string? FacilityName { get; set; }
        public List<Control>? Controls { get; set; } = new List<Control>();
        public List<Pathogen>? Pathogens { get; set; } = new List<Pathogen> { };
        public ConfigurationSettings Configs { get; set; } = new ConfigurationSettings();
    }
}
