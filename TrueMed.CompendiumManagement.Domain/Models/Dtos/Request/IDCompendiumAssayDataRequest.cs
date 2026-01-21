using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SaveIDCompendiumAssayDataRequest
    {
        public int Id { get; set; }
        public string TestName { get; set; } = null!;
        public string? TestDisplayName { get; set; }
        public string TestCode { get; set; }
        public int ReferenceLabId { get; set; }
    }
}
