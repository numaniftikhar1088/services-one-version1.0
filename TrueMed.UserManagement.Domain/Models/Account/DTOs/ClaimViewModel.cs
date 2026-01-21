using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.UserManagement.Domain.Models.Account.DTOs
{
    public class ClaimModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
