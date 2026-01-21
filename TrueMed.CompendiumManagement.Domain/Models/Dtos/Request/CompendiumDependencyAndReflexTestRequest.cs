using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SaveCompendiumDependencyReflexRequest
    {
        public int Id { get; set; }
        public int? ParentTestAssignmentId { get; set; }
        public int? ChildTestAssignmentId { get; set; }
        public string? ChildType { get; set; }
        public int? SortOrder { get; set; }
        public bool? IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}
