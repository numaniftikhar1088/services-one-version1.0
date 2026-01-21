using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Dtos.Response
{
    public class PrinterSetupResponse: PrinterSetupQueryModel
    {
        public int Id { get; set; }

       
    }
    public class PrinterSetupQueryModel
    {
        public string? PrinterName { get; set; }

        public string? BrandName { get; set; }

        public string? ModelNumber { get; set; }

        public string? LabelSize { get; set; }

        public string? LabelType { get; set; }

        public int? LabId { get; set; }
        public string? LabName { get; set; }
        public bool? IsDefault { get; set; }
    }
    public class PrinterSetupRequest: PrinterSetupResponse
    {

    }
}
