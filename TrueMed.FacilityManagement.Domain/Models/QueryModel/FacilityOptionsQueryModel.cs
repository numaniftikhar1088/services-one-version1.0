using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.QueryModel
{
    public class FacilityOptionsQueryModel
    {
        public string? OptionName { get; set; }
        public bool? IsEnabled { get; set; }
    }
}
