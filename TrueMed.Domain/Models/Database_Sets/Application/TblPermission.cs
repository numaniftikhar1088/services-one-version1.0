using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblPermission
    {
        public int? ClaimId { get; set; }
        public string? Name { get; set; }
        public int Id { get; set; }

        public virtual TblClaim? Claim { get; set; }
    }
