using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class OrderViewPanelShowResponse
    {
        public string PanelName { get; set; }
        public List<string> TestingOptions { get; set; }
    }
}
