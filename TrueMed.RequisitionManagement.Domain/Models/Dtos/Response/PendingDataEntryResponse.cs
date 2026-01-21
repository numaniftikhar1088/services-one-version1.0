using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class PendingDataEntryResponse
    {
        public int? RequisitionOrderId { get; set; }
        public int? RequisitionID { get; set; }
        public string? SpecimenID { get; set; }
        public int? StatusId { get; set; }
        public string? StatusName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DateOfBirth { get; set; }
        public string? DateOfCollection { get; set; }
        public string? FacilityName { get; set; }
        public string? PhysicianName { get; set; }
        public string? UpdatedBy { get; set; }
        public string? UpdatedDate { get; set; }
    }
    public class PendingDataEntryQueryModel : PendingDataEntryResponse
    {

    }
}

