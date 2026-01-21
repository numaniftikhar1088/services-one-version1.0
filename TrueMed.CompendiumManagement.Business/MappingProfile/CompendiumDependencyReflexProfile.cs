using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.Domain.Models.Database_Sets.Application;

namespace TrueMed.CompendiumManagement.Business.MappingProfile
{
    public class CompendiumDependencyReflexProfile : Profile
    {
        public CompendiumDependencyReflexProfile()
        {
            CreateMap<SaveCompendiumDependencyReflexRequest, TblCompendiumDependencyAndReflexTest>();
        }
    }
}
