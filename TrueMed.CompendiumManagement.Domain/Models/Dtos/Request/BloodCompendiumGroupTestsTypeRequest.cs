using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SaveGroupTestsTypeRequest
    {
        public int Id { get; set; }
        public string PanelName { get; set; } = null!;
        public int? ReqTypeId { get; set; }
        public string? Tmitcode { get; set; }
        public string? Department { get; set; }
        public bool? IsActive { get; set; }
    }
}
