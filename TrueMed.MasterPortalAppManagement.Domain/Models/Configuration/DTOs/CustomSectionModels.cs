using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs
{
    internal class CustomSectionModel : SectionModel
    {
        public CustomSectionModel()
        {
            base.IsSystemDefined = false;
        }
    }
}
