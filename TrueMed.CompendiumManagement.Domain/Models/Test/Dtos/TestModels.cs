using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Dtos
{
    public class TestModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool? IsActive { get; internal set; }
        public string? TmitCode { get; internal set; }
        public DateTime CreateDate { get; internal set; }
        public string CreateBy { get; internal set; }
        public string DepartmentName { get; internal set; }
        public int? Department { get; internal set; }
        public int? RequisitionType { get; internal set; }
        public string RequisitionTypeName { get; internal set; }
    }
}
