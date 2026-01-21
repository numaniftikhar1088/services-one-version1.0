using MimeKit.Cryptography;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class DigitalCheckINRecordResponse
    {
        public int? Id { get; set; }
        public int? RequisitionID { get; set; }
        
        public string? Status { get; set; }
        public string? SpecimenID { get; set; }
        public string?   SpecimenType { get; set; }
        public string? OrderNumber { get; set; }
        public int FacilityID { get; set; }
        public string? FacilityName { get; set; }
        public int? PatientID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? PhysicianID { get; set; }
        public string? CollectorID { get; set; }
        public DateTime? DateOfCollection { get; set; }
        public DateTime? DateScanned { get; set; }
        public string? User { get; set; }
    }
}
