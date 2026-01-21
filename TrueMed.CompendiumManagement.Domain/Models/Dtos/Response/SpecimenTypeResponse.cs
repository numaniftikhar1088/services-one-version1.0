using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Response
{
    public class GetSpecimenTypeDetailResponse
    {
        public int SpecimenTypeId { get; set; }
        public string SpecimenType { get; set; }
        public string? SpecimenPreFix { get; set; }
        public bool? SpecimenStatus { get; set; }
    }
}
