using System.ComponentModel.DataAnnotations.Schema;
using TrueMed.Domain.Models.Database_Sets.BaseEntity;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblLabRequisitionType : IGlobalFilterBaseProp
{
    [NotMapped]
    public int FacilityId { get; set; }
    [NotMapped]
    public int? ReferenceLabId { get; set; }
    [NotMapped]
    public int RefLabId { get; set; }
}
