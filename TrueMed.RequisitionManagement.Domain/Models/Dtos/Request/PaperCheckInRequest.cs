using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class PaperCheckInRequest
    {
        public int? FacilityId { get; set; }
        public string PhysicianId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set;}
        public DateTime? DateOfBirth { get; set; }
        public int? ReqTypeId { get; set; }
        public int? InsuranceId { get; set; }
        public DateTime? DateOfCollection { get; set; }
        public int? PanelId { get; set; }
    }
}
