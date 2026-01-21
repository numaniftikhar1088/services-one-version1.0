using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class SignatureInformationRequest
    {
        public string FullName { get; set; }
        public string UniqueKey { get; set; }
        public string IPAddress { get; set; }
        public string ComputerInfo { get; set; }
        public string BrowserInfo { get; set; }
        public string ControlsInfo { get; set; }
    }
}
