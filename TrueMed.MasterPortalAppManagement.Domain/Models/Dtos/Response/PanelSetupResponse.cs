using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response
{
    public class GetPanelSetupDetailResponse
    {
        public int Id { get; set; }

        public string? PanelName { get; set; }

        public string? Tmitcode { get; set; }

        public bool? IsActive { get; set; }
        public int? NetworkType { get; set; }
        public int? ReqTypeId { get; set; }
        public string? RequisitionType { get; set; }
    }
    public class GetPanelSetupDetailByIdResponse
    {
        public int Id { get; set; }

        public string PanelName { get; set; }

        public string? Tmitcode { get; set; }

        public bool? IsActive { get; set; }
        public int? NetworkType { get; set; }

        public int? ReqTypeId { get; set; }
        public string? RequisitionType { get; set; }

        //public int? DeptId { get; set; }
        //public string? DepartmentName { get; set; }
    }
}
