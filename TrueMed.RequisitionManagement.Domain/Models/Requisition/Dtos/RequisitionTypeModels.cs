using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.RequisitionManagement.Domain.Models.Requisition.Dtos
{
    public class RequisitionTestTypeModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreateDate { get; set; }
        public string? Type { get; internal set; }
        public bool? IsActive { get; set; }
        public string? RequisitionColor { get; set; }
        public bool IsSelected { get; set; }
        public int? RequisitionId { get; set; }

    }
}
