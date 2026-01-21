using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.QueryModel
{
    public class LabAssignmentQueryModel
    {
        public string? ProfileName { get; set; } = null!;

        public string? RefLabName { get; set; }

        public string? ReqTypeName { get; set; }

        public string? InsuranceName { get; set; }

        public string? GenderName { get; set; }
        public string? GroupNames { get; set; }
        public bool? IsDefault { get; set; }
    }
}
