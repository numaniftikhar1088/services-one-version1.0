using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalServices.BusinessLayer.MappingProfile
{
    public class SaveTestSetupProfile : Profile
    {
        public SaveTestSetupProfile()
        {
            CreateMap<SaveTestSetupRequest, TblCompendiumTest>();
                //.ForMember(dest => dest.IsActive,opt => opt.MapFrom(src => src.TestStatus));
        }
    }
}
