using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request
{
    public class SaveDrugAllergyRequest
    {
        public int Id { get; set; }
        //public string? Dacode { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }
    public class ChangeDrugAllergyStatusRequest
    {
        public int Id { get; set; }
        public bool? IsActive { get; set; }
    }
}
