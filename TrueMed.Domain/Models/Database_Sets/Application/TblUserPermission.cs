using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblUserPermission
    {
        public string UserId { get; set; } = null!;
        public int LabId { get; set; }
        public int PermissionId { get; set; }

        //public virtual TblLab Lab { get; set; } = null!;
        public virtual TblUser User { get; set; } = null!;
    }
