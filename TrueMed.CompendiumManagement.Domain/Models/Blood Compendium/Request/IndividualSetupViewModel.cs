using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Blood_Compendium.Request
{
    public class IndividualSetupViewModel
    {
        [Required]
        public int? TestId { get; set; }
        [Required]
        public string? UOM { get; set; }
        [Required]
        public int? DependencyTestId { get; set; }
        [Required]
        public int? SpecimenType { get; set; }
        [Required]
        public string? ResultMethod { get; set; }
        [Required]
        public int? OrderMethod { get; set; }
        public string? CPTCode { get; set; }
        public string? InstrumentResultingMethod { get; internal set; }
        public string? InstrumentName { get; internal set; }
        public int? CalcuationFormula { get; internal set; }
    }


    public class UpdateIndividualSetupViewModel : IndividualSetupViewModel
    {

    }
}
