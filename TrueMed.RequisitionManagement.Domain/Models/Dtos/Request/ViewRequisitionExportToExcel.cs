using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Request
{
    public class ViewRequisitionExportToExcel
    {
        public int[]? selectedRow { get; set; }
        public int tabId { get; set; }  
    }
}
