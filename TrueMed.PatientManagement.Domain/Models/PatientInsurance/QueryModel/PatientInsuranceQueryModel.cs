using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.QueryModel
{
    public class PatientInsuranceQueryModel
    {
        public string? GroupNumber { get; set; }
        public string? PolicyId { get; set; }
      
    }
}
