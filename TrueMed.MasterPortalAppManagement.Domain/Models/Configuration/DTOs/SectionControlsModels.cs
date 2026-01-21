using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs
{
    public class SectionControlsModel
    {
        public int SectionId { get; set; }
        public IEnumerable<int?> Controls { get; set; }
    }
}
