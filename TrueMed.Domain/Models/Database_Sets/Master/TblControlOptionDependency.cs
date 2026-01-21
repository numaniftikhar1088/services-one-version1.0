using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Sevices.MasterEntities;
    public partial class TblControlOptionDependency
    {
        public int Id { get; set; }

        public int? ControlId { get; set; }

        public int? OptionId { get; set; }

        public int? DependentControlId { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
    }


