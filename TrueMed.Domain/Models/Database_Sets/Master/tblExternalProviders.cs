using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.Database_Sets.Master
{
    [Table("tblExternalProviders")]
    public class tblExternalProvider
    {
        public string UserId { get; set; }

        public string Provider { get; set; }

        public DateTime? CreateDate { get; set; }

    }
}
