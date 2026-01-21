using TrueMed.InsuranceManagement.Domain.Dtos;
using TrueMed.InsuranceManagement.Domain.QueryModel;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.InsuranceManagement.Business.Interface
{
    public interface IInsuranceAssignmentService
    {
        Task<RequestResponse> SaveInsuranceAssignmentAsync(SaveInsuranceAssignmentDto insuranceAssignmentDto);
        Task<RequestResponse> ChangeInsuranceAssignmentStatusAsync(ChangeInsuranceAssignmentStatusDto statusChangeDto);
        Task<DataQueryResponse<IQueryable>> GetInsuranceAssignmentAsync(DataQueryModel<InsuranceAssignmentQueryModel> dataQueryModel);
        Task<RequestResponse<GetInsuranceAssignmentDetailsByIdDto>> GetInsuranceAssignmentByIdAsync(int id);
        Task<RequestResponse> DeleteInsuranceAssignmentByIdAsync(int id);
        Task<DataQueryResponse<List<GetInsuranceAssignmentDetailsDto>>> GetInsuranceAssignmentDetailBasedOnSearchAsync(DataQueryModel<GetInsuranceAssignmentDetailsQueryModel> query);

    }
}
