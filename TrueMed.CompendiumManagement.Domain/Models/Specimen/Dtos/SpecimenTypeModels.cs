using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Specimen.Dtos
{
    public class SpecimenTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
