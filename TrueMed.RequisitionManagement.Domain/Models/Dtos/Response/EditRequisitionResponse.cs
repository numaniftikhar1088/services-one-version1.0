using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Response;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class EditRequisitionResponse
    {
        public List<LoadReqSectionResponse> CommonSections { get; set; }
        public List<LoadReqSectionResponse> ReqSections { get; set; }
    }
}
