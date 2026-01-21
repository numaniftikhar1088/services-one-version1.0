using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SaveIDCompendiumReportingRulesRequest
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? AgeRange { get; set; }
        public string? Negative { get; set; }

        public string? Low { get; set; }
        public string? Medium { get; set; }
        public string? high { get; set; }
        public string? Criticalhigh { get; set; }
        public decimal? AmpScore { get; set; }

        public decimal? CqConf { get; set; }

    }
}
