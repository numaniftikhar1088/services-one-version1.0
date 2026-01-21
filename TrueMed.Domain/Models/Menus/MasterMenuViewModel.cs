using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.Menus
{
    public class MasterMenuViewModel
    {
        public int ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string ModuleIcon { get; set; }
        public int PageId { get; set; }
        public string PageName { get; set; }
        public string MenuIcon { get; set; }
        public int ChildID { get; set; }
        public string LinkUrl { get; set; }
        public int ModuleOrderId { get; set; }
        public int PageOrderId { get; set; }



    }
}
