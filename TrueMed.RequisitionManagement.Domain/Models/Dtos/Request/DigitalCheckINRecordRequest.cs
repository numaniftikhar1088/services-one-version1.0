using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class DigitalCheckINRecordRequest
    {
        public string Number { get; set; }
        public bool IsOrder { get; set; }
    }
}
