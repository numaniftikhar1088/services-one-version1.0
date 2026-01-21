using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using TrueMed.Domain.Models.Database_Sets.BaseEntity;

namespace TrueMed.Domain.Models.Database_Sets.Application;


public partial class TblFacilityRefLabAssignment : IGlobalFilterBaseProp
{
    [NotMapped]
    public int LabId { get; set; }
    [NotMapped]
    public int? ReferenceLabId { get; set; }
    [NotMapped]
    public int RefLabId { get; set; }
}
