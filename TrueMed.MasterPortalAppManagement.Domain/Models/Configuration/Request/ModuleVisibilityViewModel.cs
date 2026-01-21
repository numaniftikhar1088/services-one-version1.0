using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request
{
    public class ModuleVisibilityViewModel
    {
        public int Id { get; set; }
        public ItemType ItemType { get; set; }
    }

    public enum ItemType
    {
        Module = 0,
        Menu = 1
    }
}
