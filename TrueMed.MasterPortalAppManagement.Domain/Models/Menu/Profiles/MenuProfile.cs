using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Menu.Profiles
{
    public class MenuProfile : Profile
    {
        public MenuProfile()
        {
            CreateMap<MenuRequest, TblPage>()
                .ForMember(x => x.Id, prop => prop.MapFrom(x => x.MenuId))
                .ForMember(x => x.Name, prop => prop.MapFrom(x => x.MenuName))
                .ForMember(x => x.OrderId, prop => prop.MapFrom(x => x.DisplayOrder));
            //CreateMap<UpdateMenuViewModel, MenuViewModel>().ReverseMap();
        }
    }
}
