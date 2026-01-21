using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class RequisitionOrderViewResponse
    {
        public int ReqtypeID { get; set; }
        public string ReqDisplayName { get; set; }
        public List<ReqOrderViewSections> Sections { get; set; }
       

    }
}
