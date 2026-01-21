using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.FacilityManagement.Domain.Models.Dtos.Request
{
    public class SaveFacilityOptionsRequest
    {
        public int Id { get; set; }
        public bool IsEnabled { get; set; }
    }
}
