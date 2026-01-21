using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel
{
    public  class MenuSetupQueryModel
    {
        public string? MenuName { get; set; }
        public int? DisplayOrder { get; set; }
        public string? ModuleName { get; set; }
        public bool? IsVisible { get; set; }
        public bool? IsActive { get; set; }
    }
}
