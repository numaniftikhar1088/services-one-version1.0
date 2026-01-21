using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Request
{
    public class AddLabAssignmentRequest
    {
        public int Id { get; set; }

        public string ProfileName { get; set; } = null!;

        public int RefLabId { get; set; }

        public int ReqTypeId { get; set; }

        public int InsuranceId { get; set; }

        public int Gender { get; set; }
        public List<int> GroupIds { get; set; }
        public bool IsDefault { get; set; }

    }
    public class SaveFacilities
    {
        public int Id { get; set; }

        public int[] Facilites { get; set; }
    }
}
