using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Facility;

namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Response
{
    public class LabAssignmentResponse
    {
        public int Id { get; set; }

        public string ProfileName { get; set; } = null!;

        public int RefLabId { get; set; }
        public string RefLabName { get; set; }

        public int ReqTypeId { get; set; }
        public string ReqTypeName { get; set; }

        public int InsuranceId { get; set; }
        public string InsuranceName { get; set; }

        public int GenderId { get; set; }
        public string GenderName { get; set; }
        public List<int> GroupIds { get; set; }
        public string GroupNames { get; set; }
        public bool IsDefault { get; set; }
        public List<FacilityInfo> Facilities { get; set; }

    }
}
