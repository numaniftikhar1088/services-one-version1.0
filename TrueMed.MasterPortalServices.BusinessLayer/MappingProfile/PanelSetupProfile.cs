using AutoMapper;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalServices.BusinessLayer.MappingProfile
{
    internal class PanelSetupProfile : Profile
    {
        public PanelSetupProfile()
        {
            CreateMap<SavePanelSetupRequest, TblCompendiumPanel>();
                //.ForMember(dest => dest.IsActive,opt => opt.MapFrom(src => src.IsActive));
        }
    }
}
