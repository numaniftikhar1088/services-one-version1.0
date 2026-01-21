using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class SignatureInformationResponse
    {
        public string FullName { get; set; }
        public string UniqueKey { get; set; }
        public string Time { get; set; }
        public string Date { get; set; }
    }
}
