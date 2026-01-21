using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Response
{
    public class GetLabFacInsTypeAssignementDetailResponse
    {
        public int LfiAssignmentId { get; set; }
        public int? RefLabId { get; set; }
        public string? LaboratoryName { get; set; }
        public string? LabType { get; set; }
        public int? FacilityId { get; set; }
        public string? FacilityName { get; set; }
        public int? ReqTypeId { get; set; }
        public string? RequisitionTypeName { get; set; }
        public int? GroupId { get; set; }
        public string? GroupName { get; set; }
        public int? InsuranceId { get; set; }
        public string? InsuranceName { get; set; }
        public string? Gender { get; set; }
        public bool? Status { get; set; }
    }
    public class GetLabFacInsTypeAssignementDetailByIdResponse
    {
        public int LfiAssignmentId { get; set; }
        public int? RefLabId { get; set; }
        public string? LaboratoryName { get; set; }
        public string? LabType { get; set; }
        public int? FacilityId { get; set; }
        public string? FacilityName { get; set; }
        public int? ReqTypeId { get; set; }
        public string? RequisitionTypeName { get; set; }
        public int? GroupId { get; set; }
        public string? GroupName { get; set; }
        public int? InsuranceId { get; set; }
        public string? InsuranceName { get; set; }
        public string? Gender { get; set; }
        public bool? Status { get; set; }
    }
}
