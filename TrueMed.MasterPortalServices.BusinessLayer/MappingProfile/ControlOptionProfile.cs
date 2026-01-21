using AutoMapper;
using TrueMed.Domain.Models.Database_Sets.Application;

namespace TrueMed.MasterPortalServices.BusinessLayer.MappingProfile
{
    public class ControlOptionProfile : Profile
    {
        public ControlOptionProfile()
        {
            CreateMap<TblLabControlOption, Sevices.MasterEntities.TblControlOption>().ReverseMap();
        }
    }
}
