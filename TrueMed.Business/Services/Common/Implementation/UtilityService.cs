using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Domain.Helpers;

namespace TrueMed.Business.Services.Common.Implementation
{
    public class UtilityService : IUtilityService
    {
        public Destination Converstion<Source, Destination>(Source s)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<Source, Destination>());
            var mapper = new Mapper(config);
            var resultItem = mapper.Map<Destination>(s);
            return resultItem;
        }
    }
}
