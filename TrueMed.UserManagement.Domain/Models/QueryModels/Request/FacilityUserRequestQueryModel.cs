using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.UserManagement.Domain.Models.QueryModels.Request
{
    public class FacilityUserRequestQueryModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Username { get; set; }
        public string? AdminType { get; set; }
        public string? NPINo { get; set; }
        public bool? Status { get; set; }
        public string? userGroup { get; set; }
    }
}
