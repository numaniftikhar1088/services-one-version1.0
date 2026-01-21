using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.Facility.Request
{
    public class FacilityQueryViewModel
    {
        public string? ContactName { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactEmail { get; set; }
        public string? ClientName { get; set; }
        public string? ClientID { get; set; }
        public string? StatuID { get; set; }
        public string? Phone { get; set; }
        public string? PrimaryContactName { get; set; }
        public string? PrimaryContactEmail { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? ZipCode { get; set; }
        public bool? IsApproved { get; set; }

    }
}
