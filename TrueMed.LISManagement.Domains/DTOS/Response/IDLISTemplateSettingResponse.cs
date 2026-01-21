using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.LISManagement.Domains.DTOS.Response
{
    public class IDLISTemplateSettingResponse
    {
        public int TemplateId { get; set; }
        public string? TemplateName { get; set; }
        public int? LabId { get; set; }
        public string LabName { get; set; }
        public List<TemplateCells> Cells { get; set; }
    }
    public class TemplateCells
    {
        public int Id { get; set; }
        public string SystemCellName { get; set; }

        public string CustomCellName { get; set; }

        public int? CustomCellOrder { get; set; }

        public bool IsDeleted { get; set; }
    }
}
