using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.Facility.DTOs
{
    public enum LabApprovementStatus
    {
        Approved = 0,
        Rejected = 1,
        Pending = 2
    }

    public enum LabType
    {
        Reference,
        Primary
    }
}
