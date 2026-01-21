using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.UserManagement.Domain.Models.Dtos.Request
{
    public class InitializePasswordRequest
    {
        public string? UserId { get; set; }
        public string? Password { get; set; }
    }
}
