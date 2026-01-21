using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Mapper_Profiles
{
    internal class ModuleProfile : Profile
    {
        public ModuleProfile()
        {
            CreateMap<ModuleViewModel, TblModule>().ForMember(x => x.OrderId,
                opt => opt.MapFrom(x => x.Order)).ReverseMap();
            CreateMap<UpdateModuleViewModel, TblModule>().ForMember(x => x.OrderId,
    opt => opt.MapFrom(x => x.Order)).ReverseMap();
        }
    }
}
