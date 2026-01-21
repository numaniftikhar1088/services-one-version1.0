using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblMasterRefLabAssignment
    {
        /// <summary>
        /// Auto Generated ID/Number
        /// </summary>
        public int RefLabAssignmentId { get; set; }
        /// <summary>
        /// Master / Parent Lab ID
        /// </summary>
        public int? MasterLabId { get; set; }
        /// <summary>
        /// Reference Lab ID
        /// </summary>
        public int? RefLabId { get; set; }
        /// <summary>
        /// Status (Active, Inactive)
        /// </summary>
        public bool? Status { get; set; }
    }
