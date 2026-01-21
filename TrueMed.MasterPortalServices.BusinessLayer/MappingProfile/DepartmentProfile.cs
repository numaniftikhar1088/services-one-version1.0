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
    public class DepartmentProfile : Profile
    {
        public DepartmentProfile()
        {
            //CreateMap<SaveDepartmentRequest, TblDepartment>()
            //     .ForMember(dest => dest.DeptId, opt => opt.MapFrom(src => src.DeptId))
            //      .ForMember(dest => dest.DeptStatus, opt => opt.MapFrom(src => src.DeptStatus))
            //       .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.DepartmentName));
        }
    }
}
