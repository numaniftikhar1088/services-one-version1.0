using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblRefLabAssignment
    {
        public int RefLabAssignmentId { get; set; }
        public int? RefLabId { get; set; }
        public int? LabId { get; set; }
        public string? LabType { get; set; }
        public bool Status { get; set; }
    }
