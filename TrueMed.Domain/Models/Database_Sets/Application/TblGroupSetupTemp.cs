namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblGroupSetupTemp
    {
        public TblGroupSetupTemp()
        {
            TblLabFacInsAssignments = new HashSet<TblLabFacInsAssignment>();
        }

        /// <summary>
        /// Auto Generated Number
        /// </summary>
        public int GroupId { get; set; }
        /// <summary>
        /// Group Name - Compendium Data
        /// </summary>
        public string? GroupName { get; set; }
        /// <summary>
        /// Display Name (How client want to see name on report)
        /// </summary>
        public string? GroupDisplayName { get; set; }
        /// <summary>
        /// Status (Active, Inactive)
        /// </summary>
        public bool? GroupStatus { get; set; }
        /// <summary>
        /// Login ID
        /// </summary>
        public string? CreatedBy { get; set; }
        /// <summary>
        /// Current Created Data and Time of login user time zone
        /// </summary>
        public DateTime? CreatedDate { get; set; }
        /// <summary>
        /// Login ID
        /// </summary>
        public string? UpdatedBy { get; set; }
        /// <summary>
        /// Current Modify Date and Time of login user time zone
        /// </summary>
        public DateTime? UpdatedDate { get; set; }
        /// <summary>
        /// Login ID
        /// </summary>
        public string? DeletedBy { get; set; }
        /// <summary>
        /// Current Delete Date and Time of login user time zone
        /// </summary>
        public DateTime? DeletedDate { get; set; }


        public virtual ICollection<TblLabFacInsAssignment> TblLabFacInsAssignments { get; set; }
    }

