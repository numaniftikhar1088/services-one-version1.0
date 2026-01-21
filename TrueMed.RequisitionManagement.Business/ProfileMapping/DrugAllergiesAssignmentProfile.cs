using AutoMapper;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;

namespace TrueMed.RequisitionManagement.Business.ProfileMapping
{
    public class DrugAllergiesAssignmentProfile
    {
        public class SaveProfile : Profile
        {
            public SaveProfile()
            {
                CreateMap<DrugAllergiesAssignmentRequest.SaveRequest, TblDrugAllergiesAssignment>()
                    .ForMember(dest => dest.Daid, opt => opt.MapFrom(src => src.Code))
                    .ForMember(dest => dest.IsStatus, opt => opt.MapFrom(src => src.Status));

            }
        }
        public class GetByIdProfile : Profile
        {
            public GetByIdProfile()
            {
                CreateProjection<DrugAllergiesAssignmentResponse.GetAllResponse, DrugAllergiesAssignmentResponse.GetByIdResponse>();
            }
        }
    }
}
