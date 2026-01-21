using AutoMapper;

using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.Domain.Models.Database_Sets.Application;

namespace TrueMed.FacilityManagement.Business.MappingProfile
{
    public class AssignRefLabAndGroupProfile : Profile
    {
        public AssignRefLabAndGroupProfile()
        {
            CreateMap<AddAssignRefLabAndGroupRequest, TblFacilityRefLabAssignment>();
            CreateMap<EditAssignRefLabAndGroupRequest, TblFacilityRefLabAssignment>();
        }
    }
}
