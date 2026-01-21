using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Response;
using TrueMed.UserManagement.Domain.Enums;

namespace TrueMed.UserManagement.Domain.Models.Account.Response
{
    public class TokenResponse
    {
        public string Token { get; set; }
        public string Username { get; set; }
        public string? UserId { get; set; }
        public int ExpiresIn { get; set; }
        public DateTime? Expires { get; set; }
        public List<AuthTenant> AuthTenants { get; set; } = new();
    }
    public class AuthTenant
    {
        public int? TenantId { get; set; }
        public string? Key { get; set; }
        public string? Name { get; set; }
        public string? URL { get; set; }
        public string? Logo { get; set; }
        public bool? IsReferenceLab { get; set; }
        public bool? IsDefault { get; set; }
        public bool IsSelected { get; set; }
        public LoggedInUserInformation InfomationOfLoggedUser { get; set; }


    }
}
