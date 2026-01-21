using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.Database_Sets.Master
{
    [Table("tblLabUsers")]
    public class tblLabUser
    {
        public int LabId { get; set; }

        public bool IsActive { get; set; }

        public bool? IsDefault { get; set; }

        public string UserId { get; set; } = string.Empty;

        public bool IsDeleted { get; set; }
    }
}
