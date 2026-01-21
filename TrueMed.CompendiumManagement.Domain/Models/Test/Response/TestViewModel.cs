using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Response
{
    public class TestViewModel
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public bool? IsActive { get; set; }
        public int? Department { get; set; }
        public string? TmitCode { get; set; }
        public string DepartmentName { get; set; }
        public int? RequisitionType { get; set; }
        public DateTime CreateDate { get; set; }
        public string RequisitionTypeName { get; set; }
    }
}
