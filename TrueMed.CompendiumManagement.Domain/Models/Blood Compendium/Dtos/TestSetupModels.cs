using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Blood_Compendium.Dtos
{
    public class TestSetupModel
    {
        public int TestId { get; set; }
        public string UOM { get; set; } = null!;
        public int DependencyTestId { get; set; }
        public string DependencyTestName { get; set; } = null!;
        public int SpecimenType { get; set; }
        public string SpecimenTypeName { get; set; } = null!;
        public string TestType { get; set; } = null!;
        public string ResultMethod { get; set; } = null!;
        public string OrderMethod { get; set; } = null!;
    }
}
