using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Dtos
{
    public class PanelModel
    {

        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? RequisitionType { get; set; }
        public string? RequisitionTypeName { get; set; }
        public string? Department { get; set; }
        public string? TmitCode { get; set; }
        public string DepartmentName { get; set; }
        public bool? IsActive { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; } = string.Empty;
        //public int Id { get; set; }
        //public string Name { get; set; } = string.Empty;
        ////public string? DisplayName { get; set; }
        //public string? Department { get; set; }
        //public int? RequisitionType { get; set; }
        ////public int? PanelType { get; set; }
        //public string? TMIT_Code { get; set; }
        //public bool? IsActive { get; set; }
        //public DateTime CreateDate { get; set; }
        //public string CreateBy { get; set; } = string.Empty;
    }
}
