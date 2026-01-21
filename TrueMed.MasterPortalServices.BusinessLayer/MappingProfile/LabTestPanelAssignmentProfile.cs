using AutoMapper;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalServices.BusinessLayer.MappingProfile
{
    public class LabTestPanelAssignmentProfile : Profile
    {
        public LabTestPanelAssignmentProfile()
        {
            CreateMap<LabTestPanelAssignmentSaveRequest,TblLabTestPanelAssignment>();
        }
    }
}
