using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.File
{
    public class FileViewModel
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? ContentType { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? FilePath { get; set; }
        public string? ContentLength { get; set; }
        public bool IsDeleted { get; set; }
        public string? UserId { get; set; }
    }
}
