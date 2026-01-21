using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.UserManagement.Domain.Models.Account.Request
{
    public class UserQueryViewModel
    {
        public string? Name { get; set; }
        public string? UserName { get; set; }
        public string? LabName { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        public bool? IsActive { get; set; }
        public bool? TwoFactorAuth { get; set; }
        public UserType? UserType { get; set; }
        public string? RoleName { get; set; }
        public string? NPI { get; set; }
    }

    public class UserBrief_QueryViewModel
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
    }
}
