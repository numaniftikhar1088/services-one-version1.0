using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.LabRole
{
    public class LabRoleModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string CreateBy { get; set; } = null!;
        public DateTime CreateDate { get; set; }
        public IEnumerable<int> ClaimsIds { get; set; }
    }

    public class ModuleAndClaimsModel
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public IEnumerable<ClaimModel> Claims { get; set; }
    }

    public class RoleWithClaimsModel
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public List<ModuleAndClaimsWithSelectionModel> Modules { get; set; } = new();
    }

    public class ModuleAndClaimsWithSelectionModel
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public List<ClaimWithSelectionModel> Claims { get; set; } = new();
    }

    public class ClaimWithSelectionModel 
    {
        public ClaimModel Claim { get; set; }
        public bool IsSelected { get; set; }
    }

    
}
