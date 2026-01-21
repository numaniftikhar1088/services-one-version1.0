using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class LoadCommonRequisitionRequest
    {
        public int PageId { get; set; }
        public int RequisitionId { get; set; }
    }
}
