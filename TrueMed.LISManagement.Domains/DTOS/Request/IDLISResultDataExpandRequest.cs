using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.LISManagement.Domains.DTOS.Request
{
    public class IDLISResultDataExpandRequest
    {
        public int RequisitionOrderId { get; set; } 
        public List<Control>? Controls { get; set; } = new List<Control>();
        public List<Pathogen>? Pathogens { get; set; } = new List<Pathogen> { };
    }
}
