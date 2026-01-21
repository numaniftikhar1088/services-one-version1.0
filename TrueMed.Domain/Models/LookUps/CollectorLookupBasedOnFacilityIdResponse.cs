using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.LookUps
{
    public class CollectorLookupBasedOnFacilityIdResponse
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
    }
    public class AllFacilityUserResponse
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public int FacilityID { get; set; }
    }
}
