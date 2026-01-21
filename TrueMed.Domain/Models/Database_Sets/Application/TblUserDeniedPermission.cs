using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblUserDeniedPermission
    {
        public string UserId { get; set; } = null!;
        public int? LabId { get; set; }
        public int? PermissionId { get; set; }
        public DateTime CreateDate { get; set; }
    }
