using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel
{
    public class DepartmentQueryModel
    {
        public int DeptId { get; set; }

        public string? DepartmentName { get; set; }
        public bool? DeptStatus { get; set; }
    }
}
