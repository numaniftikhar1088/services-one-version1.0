using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domains.DTOS.ExportToExcel
{
    public class IDResultDataExportToExcel
    {
        public int RequisitionId { get; set; }
        public string? AccessionNumber { get; set; }
        public string? ReceiveDate { get; set; }
        public string? ReceiveTime { get; set; }
        public string? LisStatus { get; set; }
        public string? ResultValue { get; set; }
        public string? FacilityName { get; set; }
        public string? FacilityState { get; set; }
        public string? CollectionDate { get; set; }
        public string? CollectionTime { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DateOfBirth { get; set; }
        public string? TestType { get; set; }
        public string? WorkFlowStatus { get; set; }
        public string? LabName { get; set; }
        public string? RequisitionType { get; set; }


    }
}
