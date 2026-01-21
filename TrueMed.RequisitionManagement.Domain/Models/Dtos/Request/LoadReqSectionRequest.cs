using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class LoadReqSectionRequest
    {
        public int FacilityId { get; set; }
        public int InsuranceTypeId { get; set; }
        public int pageId { get; set; }
        public int RequisitionId { get; set; }
    }
}
