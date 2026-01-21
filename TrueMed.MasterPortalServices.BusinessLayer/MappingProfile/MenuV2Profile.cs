using AutoMapper;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalServices.BusinessLayer.MappingProfile
{
    public class MenuV2Profile
    {
        public class SaveRquestProfile : Profile
        {
            public SaveRquestProfile()
            {
                CreateMap<MenuRequestV2.SaveMenuRequest, TblPage>()
                    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.MenuId))
                    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.MenuName))
                    .ForMember(dest => dest.LinkUrl, opt => opt.MapFrom(src => src.MenuLink))
                    .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.DisplayOrder));
            }
        }
    }
}
