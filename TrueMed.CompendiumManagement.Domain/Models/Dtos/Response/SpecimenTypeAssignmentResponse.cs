using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Response
{
    public class GetSpecimenTypeAssignmentDetailResponse
    {
        public int Id { get; set; }
        public int? SpecimenTypeId { get; set; }
        public string? SpecimenType { get; set; }
        public List<PanelInfo>? Panels{ get; set; }
        //public int? TestId { get; set; }
        //public string? TestDisplayName { get; set; }
        public int? ReqTypeId { get; set; }
        public string? RequisitionTypeName { get; set; }
        public bool Isactive { get; set; }
    }
    public class PanelInfo
    {
        public int PanelId { get; set; }
        public string? PanelDisplayName { get; set; }
    }
}
