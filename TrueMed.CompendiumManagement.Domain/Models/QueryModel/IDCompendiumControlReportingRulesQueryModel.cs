using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.QueryModel
{
    public class IDCompendiumControlReportingRulesQueryModel
    {

        public string? QCControlName { get; set; }
        public string? QCControlType { get; set; }
        public string? Pass { get; set; }
        public string? Fail { get; set; }
    }
}
