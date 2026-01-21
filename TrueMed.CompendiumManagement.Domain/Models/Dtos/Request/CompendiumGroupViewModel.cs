using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class CompendiumGroupViewModel
    {

        public int Id { get; set; }
        public string GroupName { get; set; } = null!;
        public string Description { get; set; }=null!;
        public bool? IsActive { get; set; }


    }
}
