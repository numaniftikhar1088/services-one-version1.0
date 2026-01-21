namespace TrueMed.Domain.Models.Database_Sets.BaseEntity
{
    public interface IGlobalFilterBaseProp
    {
        public bool? IsActive { get; set; }
        public bool? IsDeleted { get; set; }
        public int FacilityId { get; set; }
        public int LabId { get; set; }
        public int? ReferenceLabId { get; set; }
        public int RefLabId { get; set; }
    }
}
