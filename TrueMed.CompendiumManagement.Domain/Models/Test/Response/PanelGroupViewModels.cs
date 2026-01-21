using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Response
{
    public class PanelGroupViewModelResp
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int? ReqTypeId { get; set; }
        public string? ReqTypeName { get; set; }

        public bool? IsActive { get; set; }
        //public DateTime CreateDate { get; set; }
        //public string CreateBy { get; set; } = string.Empty;
    }
}
