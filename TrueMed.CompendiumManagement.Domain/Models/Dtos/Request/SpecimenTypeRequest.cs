using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SaveSpecimenTypeRequest
    {
        public int SpecimenTypeId { get; set; }
        public string SpecimenType { get; set; } = null!;
        public string? SpecimenPreFix { get; set; }
        public bool? SpecimenStatus { get; set; }
    }
    public class ChangeSpecimenTypeStatusRequest
    {
        public int SpecimenTypeId { get; set; }
        public bool? SpecimenStatus { get; set; }
    }
}
