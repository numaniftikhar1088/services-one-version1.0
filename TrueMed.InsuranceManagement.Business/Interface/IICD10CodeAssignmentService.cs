using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domain.Dtos;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.InsuranceManagement.Business.Interface
{
    public interface IICD10CodeAssignmentService
    {
        Task<RequestResponse> SaveICD10CodeAssignmentAsync(SaveICD10CodeAssignmentDto entity);
        Task<DataQueryResponse<List<GetICD10CodeAssignmentDetailDto>>> GetICD10CodeAssignmentAsync(DataQueryModel<ICD10CodeAssignmentQueryModel> query);

        Task<RequestResponse<GetICD10CodeAssignmentByIdDto>> GetICD10CodeAssignmentByIdAsync(int id);
        Task<RequestResponse> DeleteICD10CodeAssignmentAsync(int id);
        Task<RequestResponse<List<ICD10CodeLookupDto>>> ICD10CodeLookupAsync(int icd10codeid);
        Task<RequestResponse<List<ReferenceLabLookupDto>>> ReferenceLabLookupAsync();
        Task<RequestResponse<string>> GetLabTypeAgainstReferenceLabIdAsync(int refLabId);
        Task<RequestResponse<List<FacilityLookupDto>>> FacilityLookupAsync();
        Task<RequestResponse<List<RequsitionTypeLookupDto>>> RequsitionTypeLookupAsync();
        Task<RequestResponse> ICD10CodeAssignmentStatusChangedAsync(ChangeICD10CodeAssignmentStatusDto entity);
    }
}
