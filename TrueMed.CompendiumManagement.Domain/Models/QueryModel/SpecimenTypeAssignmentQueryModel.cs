using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.QueryModel
{
    public class SpecimenTypeAssignmentQueryModel
    {
        public string? SpecimenType { get; set; }
        public string? PanelDisplayName { get; set; }
        //public string? TestDisplayName { get; set; }
        public string? RequisitionTypeName { get; set; }
        public bool? Isactive { get; set; }
    }
}
