using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class ViewRequisitionPrinterInfoResp
    {
        public int Value { get; set; }
        public string? Label { get; set; }
        public bool? isDefault { get; set; }
    }
}
