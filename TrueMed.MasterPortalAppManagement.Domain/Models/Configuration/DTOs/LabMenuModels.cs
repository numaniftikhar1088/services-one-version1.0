using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs
{
    public class LabMenuModel
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; } = null!;
    }
}
