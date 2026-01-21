using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblClaim
    {
        public TblClaim()
        {
            TblMenus = new HashSet<TblMenu>();
            TblPermissions = new HashSet<TblPermission>();
            TblRevokeAndAvailClaims = new HashSet<TblRevokeAndAvailClaim>();
        }

        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string? Name { get; set; }

        public virtual ICollection<TblMenu> TblMenus { get; set; }
        public virtual ICollection<TblPermission> TblPermissions { get; set; }
        public virtual ICollection<TblRevokeAndAvailClaim> TblRevokeAndAvailClaims { get; set; }
    }

