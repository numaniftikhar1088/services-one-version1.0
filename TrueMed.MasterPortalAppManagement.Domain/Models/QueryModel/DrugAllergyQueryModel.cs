using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel
{
    public class DrugAllergyQueryModel
    {
        public string? Dacode { get; set; }

        public string? Description { get; set; }

        public bool? IsActive { get; set; }
    }
}
