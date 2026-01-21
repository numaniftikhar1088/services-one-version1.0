using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Facility;

namespace TrueMed.UserManagement.Domain.Models.Dtos.Response
{
    public class GetFacilityUserInfoAgainstUserIdResponse
    {
        public string? Id { get; set; }
        public int? UserTypeId { get; set; }
        public string? UserType { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? NPINo { get; set; }
        public string? StateLicense { get; set; }
        public int? AccountType { get; set; }
        //public string? AccountType { get; set; }
        public string? PhoneNo { get; set; }
        public string? Gender { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? UserTitle { get; set; }
        public int? userGroupId { get; set; }
        public string? userGroup { get; set; }
        public List<FacilityInfo> Facilities { get; set; }
    }
   
}
