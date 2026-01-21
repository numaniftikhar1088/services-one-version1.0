using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Dtos
{
    public class PanelTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; } = string.Empty;
    }
}
