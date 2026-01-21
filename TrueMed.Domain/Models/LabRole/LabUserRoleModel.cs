using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.Domain.Models.LabRole
{
    public class LabUserRoleModel
    {
        public string UserId { get; set; } = null!;
        public string RoleName { get; set; } = null!;
        public int RoleId { get; set; }
        public int? RoleType { get; set; }
        public string? RoleTypeName
        {
            get
            {
                if(RoleType == null) return null;
                return Enum.GetName(typeof(SubRole), RoleType);
            }
        }
    }
}
