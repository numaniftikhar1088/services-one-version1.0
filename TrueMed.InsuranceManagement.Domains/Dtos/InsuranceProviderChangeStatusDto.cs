using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.InsuranceManagement.Domains.Dtos
{
    public class InsuranceProviderChangeStatusDto
    {
        public int InsuranceProviderId { get; set; }
        public bool? NewStatus { get; set; }
    }
}
