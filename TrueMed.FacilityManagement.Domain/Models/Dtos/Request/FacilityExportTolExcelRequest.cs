using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Request
{
    public class FacilityExportTolExcelRequest
    {
        public string Status { get; set; }
        public int[]? selectedRows { get; set; }
    }
}
