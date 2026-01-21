using System.ComponentModel.DataAnnotations.Schema;
using TrueMed.Domain.Models.Database_Sets.BaseEntity;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblLabUser : IGlobalFilterBaseProp
{
    [NotMapped]
    public int FacilityId { get; set; }
    [NotMapped]
    public int? ReferenceLabId { get; set; }
    [NotMapped]
    public int RefLabId { get; set; }
}
