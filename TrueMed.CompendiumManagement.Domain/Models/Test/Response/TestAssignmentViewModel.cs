using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Response
{
    public class TestAssignmentViewModel
    {
        public int Id { get; set; }
        public int PanelGroupId { get; set; }
        public string PanelGroupName { get; set; } = String.Empty;
        public int PanelId { get; set; }
        public string PanelName { get; set; } = String.Empty;
        public int TestId { get; set; }
        public string TestName { get; set; } = String.Empty; 
        public string ProcessType { get; set; } = string.Empty;
        public int LabId { get; set; }
        public bool? IsActive { get; set; }
        public string CreateBy { get; set; } = String.Empty;
        public DateTime CreateDate { get; set; }
    }
}
