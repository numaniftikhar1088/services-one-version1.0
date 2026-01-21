using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SaveDepartmentRequest
    {
        public int DeptId { get; set; }

        public string? DepartmentName { get; set; }
        public bool? DeptStatus { get; set; }
    }
    public class ChangeDepartmentStatusRequest
    {
        public int DepId { get; set; }
        public bool? DeptStatus { get; set; }
    }
}
