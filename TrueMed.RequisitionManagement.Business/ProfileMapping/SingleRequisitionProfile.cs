using AutoMapper;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;

namespace TrueMed.RequisitionManagement.Business.ProfileMapping
{
    public class SingleRequisitionProfile : Profile
    {
        public SingleRequisitionProfile()
        {
            CreateMap<SaveSingleRequistionRequest, TblRequisitionMaster>();
        }
    }
}
