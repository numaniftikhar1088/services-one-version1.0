using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities
{
    public partial class TblFacilityFile
    {
        public int FacilityId { get; set; }
        public string FileId { get; set; } = null!;
        public string FileType { get; set; } = null!;
        public string? Report { get; set; }
    }
}
