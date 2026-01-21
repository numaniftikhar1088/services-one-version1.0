using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.LabRole;

namespace TrueMed.UserManagement.Domain.Models.Account.Response
{
    public class UserInfoViewModel
    {
        public ApplicationUserBase User { get; set; } = new();
        public RoleAndClaimsViewModel? RoleAndClaims { get; set; } = new();
        public ICollection<PageWithClaimViewModel>? PageAccess { get; set; }
    }

    public class RoleAndClaimsViewModel
    {
        public LabRoleModel? Role { get; set; }
        public string[]? Claims { get; set; }
    }

    public class PageWithClaimViewModel
    {
        public string Name { get; set; }
    }

}
