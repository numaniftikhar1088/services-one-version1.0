using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs
{
    public class SystemFieldModel : ControlModel
    {
        public SystemFieldModel()
        {
            base.IsSystemDefined = true;
        }
    }
}
