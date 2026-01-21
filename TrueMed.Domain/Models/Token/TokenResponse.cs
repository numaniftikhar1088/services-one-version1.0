using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Response;

namespace TrueMed.Domain.Models.Token
{
    public class TokenResponse
    {
        public string Token { get; set; }
        public string Username { get; set; }
        public string? UserId { get; set; }
        public int ExpiresIn { get; set; }
        public DateTime? Expires { get; set; }
        public UserType UserType { get; set; }
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
