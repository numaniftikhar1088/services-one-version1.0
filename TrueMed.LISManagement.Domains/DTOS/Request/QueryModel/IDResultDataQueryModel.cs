using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domains.DTOS.Request.QueryModel
{
    public class IDResultDataQueryModel
    {
        public string? AccessionNumber { get; set; }
        public string? ReceiveDate { get; set; }
        public string? PublishDate { get; set; }
        public string? TestType { get; set; }
        public string? ResultValue { get; set; }
        public string? LisStatus { get; set; }
        public int? FacilityId { get; set; }
        public string? FacilityName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DateOfBirth { get; set; }
        //public string? RequisitionType { get; set; }
        public string? BatchId { get; set; }
        public int? StatusId { get; set; }
    }
}
