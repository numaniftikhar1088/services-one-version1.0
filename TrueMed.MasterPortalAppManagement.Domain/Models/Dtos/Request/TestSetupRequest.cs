using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class SaveTestSetupRequest
    {
        public int Id { get; set; }

        public string TestName { get; set; } 

        public string? Tmitcode { get; set; }

        public int? ReqTypeId { get; set; }
        public int? NetworkType { get; set; } 

        public bool IsActive { get; set; }
    }
    public class ChangeTestSetupStatusRequest
    {
        public int Id { get; set; }
        public bool? IsActive { get; set; }
    }
}
