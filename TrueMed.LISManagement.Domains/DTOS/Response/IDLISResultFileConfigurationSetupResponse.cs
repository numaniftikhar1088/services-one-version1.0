using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domains.DTOS.Response
{
    public class IDLISResultFileConfigurationSetupResponse
    {
        public int Id { get; set; }

        public int? LabId { get; set; }
        public string LabName { get; set; }

        public bool? CalculationOnCt { get; set; }

        public bool? CalculationOnAmpScore { get; set; }

        public bool? CalculationOnCqConf { get; set; }
    }
}
