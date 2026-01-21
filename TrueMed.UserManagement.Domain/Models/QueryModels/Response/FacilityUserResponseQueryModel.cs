using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.UserManagement.Domain.Models.QueryModels.Response
{
    public class FacilityUserResponseQueryModel
    {
        public string? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Username { get; set; }
        public int? AdminTypeId { get; set; }
        public string? AdminType { get; set; }
        public int? userGroupId { get; set; }
        public string? userGroup { get; set; }
        public string? NPINo { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool? Status { get; set; }
    }
}
