using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.QueryModel
{
    public class IDCompendiumAssayDataQueryModel
    {
        public string? TestName { get; set; } = null!;
        public string? TestDisplayName { get; set; }
        public string? TestCode { get; set; }
        public string? ReferenceLabName { get; set; }
    }
}
