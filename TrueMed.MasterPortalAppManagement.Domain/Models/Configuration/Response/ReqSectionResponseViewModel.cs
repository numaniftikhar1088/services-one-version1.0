using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Response
{
   
    public class ReqSectionResponseViewModel
    {
        public int Id { get; set;}
        public string ReqName { get; set;}
        public string ReqDisplayName { get; set; }
        public bool isSelected { get; set; }
        public string Color { get; set; }
        public List<SectionWithControlsAndDependencies> Sections { get; set; }
    }
}
