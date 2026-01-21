using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Sevices.MasterEntities
{
    public partial class TblControlOption
    {
        public int OptionId { get; set; }

        public int ControlId { get; set; }

        public string? OptionName { get; set; }

        public string? OptionValue { get; set; }

        public bool? IsVisible { get; set; }

        public string CreatedBy { get; set; } = null!;

        public DateTime CreatedDate { get; set; }

        public int? SortOrder { get; set; }
        public bool IsDefaultSelected { get; set; }
    }
}
