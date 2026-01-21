using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.InsuranceManagement.Business.Interface
{
    public interface IInsuranceProviderService
    {
        Task<RequestResponse> SaveInsuranceProviderAsync(SaveInsuranceProviderDto saveInsuranceProvider);
        Task<RequestResponse> ChangeInsuranceProviderStatusAsync(InsuranceProviderChangeStatusDto statusChangeDto);
        //Task<DataQueryResponse<IQueryable>> GetInsuranceProviderAsync(DataQueryModel<InsuranceProviderQueryModel> dataQueryModel);
        Task<RequestResponse<GetInsuranceProviderDetailByidDto>> GetInsuranceProviderByIdAsync(int id);
        Task<RequestResponse> DeleteInsuranceProviderByIdAsync(int id);
        Task<RequestResponse<List<InuranceProviderLookupDto>>> GetProviderLookupAsync();
        Task<RequestResponse<string>> GetProviderCodeAgainstProviderIdAsync(int providerId);
        Task<DataQueryResponse<List<GetInsuranceProviderDetailDto>>> GetInsuranceProviderDetailAsync(DataQueryModel<InsuranceProviderQueryModel> query);
        bool IsProviderNameUnique(string name);
    }
}
