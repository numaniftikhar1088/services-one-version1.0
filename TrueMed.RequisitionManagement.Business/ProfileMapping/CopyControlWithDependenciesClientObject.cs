using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Response;

namespace TrueMed.RequisitionManagement.Business.ProfileMapping
{
    public class CopyControlWithDependenciesClientObject:Profile
    {
        public CopyControlWithDependenciesClientObject()
        {
            CreateMap<ControlWithDependenciesClient, ControlWithDependenciesClient>();
               
        }
    }
}
