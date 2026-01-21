using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Dtos
{
    public class TestAssignmentModel
    {
        public int Id { get; set; }
        public int PanelGroupId { get; set; }
        public int PanelId { get; set; }
        public int TestId { get; set; }
        public string ProcessType { get; set; } = string.Empty;
        public int LabId { get; set; }
        public int ReqTypeId { get; set; }
        public bool? IsActive { get; set; }
        public string CreateBy { get; set; } = string.Empty;
        public DateTime CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? UpdateBy { get; set; }
    }
}
