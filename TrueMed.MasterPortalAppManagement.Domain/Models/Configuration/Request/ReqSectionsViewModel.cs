using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request
{
    public class ReqSectionsViewModel
    {
        public int LabId { get; set; }
        public int PageID { get; set; }
        public int FacilityID { get; set; }
        public int InsuranceTypeId { get; set; }
    }
}
