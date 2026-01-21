using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SpecimenTypeAssignmentRequest
    {
        public int Id { get; set; }
        public int ReqTypeId { get; set; }
        public List<PanelInfo>? Panels { get; set; }
        //public int? TestId { get; set; }
        public int SpecimenTypeId { get; set; }
        public bool? Isactive { get; set; }
    }
    public class ChangeSpecimenTypeAssignmentStatusRequest
    {
        public int Id { get; set; }
        public bool? Isactive { get; set; }
    }
    public class SpecimenTypeAssignmentImportFromExcelRequest
    {
        public int GpsAssignmentId { get; set; }
        public int? SpecimenTypeId { get; set; }
        public int? PanelId { get; set; }
        public int? TestId { get; set; }
        public int? RefLabId { get; set; }
        public int? ReqTypeId { get; set; }
        public bool Status { get; set; }
    }
}
