using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.UserManagement.Domain.Models.Dtos.Request
{
    public class AddProviderRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? NPI { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public int[]? Facilities { get; set; }
    }
}
