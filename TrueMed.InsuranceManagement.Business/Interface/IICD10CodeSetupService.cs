using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Common;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.InsuranceManagement.Business.Interface
{
    public interface IICD10CodeSetupService
    {
        Task<DataQueryResponse<List<GetICD10CodeSetupBriefInfoDto>>> GetICD10CodeSetupBriefInfoAsync();
        Task<DataQueryResponse<List<GetICD10CodeDetailInfoDto>>> GetICD10CodeDetailInfoAsync(DataQueryModel<ICD10CodeSetupQueryModel> query);
        Task<RequestResponse<GetICD10CodeSetupBriefInfoDto>> GetICD10CodeSetupBriefInfoByIdAsync(int id);
        Task<RequestResponse<GetICD10CodeDetailInfoDto>> GetICD10CodeDetailInfoByIdAsync(int id);
        Task<RequestResponse> SaveICD10CodeSetupAsync(SaveICD10CodeSetupDto entity);
        Task<RequestResponse> StatusChangedICD10CodeSetupAsync(StatusChangedICD10CodeSetupDto entity);
        Task<RequestResponse> DeleteICD10CodeSetupByIdAsync(int id);
        Task<List<ICD10CodeModel>> ICD10CodesSearch(string query, int Key);
    }
}
