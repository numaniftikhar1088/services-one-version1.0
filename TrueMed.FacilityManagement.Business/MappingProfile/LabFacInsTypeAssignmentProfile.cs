using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.Domain.Models.Database_Sets.Application;

namespace TrueMed.FacilityManagement.Business.MappingProfile
{
    public class LabFacInsTypeAssignmentProfile : Profile
    {
        public LabFacInsTypeAssignmentProfile()
        {
            CreateMap<SaveLabFacInsTypeAssignementRequest, TblLabFacInsAssignment>();
        }
    }
}
