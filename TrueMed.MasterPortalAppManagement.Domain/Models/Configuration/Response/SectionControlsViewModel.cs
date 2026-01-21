using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Response
{
    public class SectionControlsViewModel : SectionModel
    {
        public ICollection<ControlModel> Controls { get; set; }
    }
}
