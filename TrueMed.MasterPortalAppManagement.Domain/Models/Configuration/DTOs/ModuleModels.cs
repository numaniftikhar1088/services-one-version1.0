using Azure.Storage.Blobs.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs
{
    public class ModuleModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Icon { get; set; }
        public DateTime? CreateDate { get; set; }
        public string CreateBy { get; set; } = string.Empty;
        public int Order { get; set; }
    }

    
}
