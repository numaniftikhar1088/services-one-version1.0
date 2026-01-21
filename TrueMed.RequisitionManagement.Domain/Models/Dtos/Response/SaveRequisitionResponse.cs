using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class SaveRequisitionResponse
    {
        public int RequisitionID { get; set; }
        public string OrderNo { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<string> AccessionNos { get; set; }
        public string Status { get; set; }

    }
}
