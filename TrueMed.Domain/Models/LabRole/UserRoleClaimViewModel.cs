using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Models.LabRole
{
    public class UserRoleClaimViewModel
    {
        public int? SubRoleType { get; set; }
        public int RoleId { get; set; }
        public string UserId { get; set; } = null!;
        public int[] ClaimsIds { get; set; } = new int[] { };
    }
}
