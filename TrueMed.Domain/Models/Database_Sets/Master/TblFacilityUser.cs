using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities
{
    public partial class TblFacilityUser
    {
        public string UserId { get; set; } = null!;
        public int FacilityId { get; set; }
    }
}
