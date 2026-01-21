using System.ComponentModel.DataAnnotations.Schema;
using TrueMed.Domain.Models.Database_Sets.BaseEntity;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblIcd10assignment : IGlobalFilterBaseProp
{
    [NotMapped]
    public bool? IsActive { get; set; }
    [NotMapped]
    public int LabId { get; set; }
    [NotMapped]
    public int? ReferenceLabId { get; set; }
}
