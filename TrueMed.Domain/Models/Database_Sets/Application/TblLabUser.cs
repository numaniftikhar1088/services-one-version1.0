using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblLabUser
    {
        public int LabId { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsDefault { get; set; }
        public string UserId { get; set; } = null!;
        public bool IsDeleted { get; set; }

        //public virtual TblLab Lab { get; set; } = null!;
        public virtual TblUser User { get; set; } = null!;
    }

