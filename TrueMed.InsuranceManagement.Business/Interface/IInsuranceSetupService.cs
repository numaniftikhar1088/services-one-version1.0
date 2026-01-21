using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.QueryModel;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.InsuranceManagement.Business.Interface
{
    public interface IInsuranceSetupService
    {
        Task<RequestResponse> SaveInsuranceSetupAsync(SaveInsuranceSetupDto saveInsuranceTypeDto);
        Task<RequestResponse> ChangeInsuranceSetupStatusAsync(ChangeInsuranceSetupStatusDto statusChangeDto);
        Task<DataQueryResponse<IQueryable>> GetInsuranceSetupAsync(DataQueryModel<InsuranceSetupQueryModel> dataQueryModel);
        Task<RequestResponse<GetInsuranceSetupByIdDto>> GetInsuranceSetupByIdAsync(int id);
        Task<RequestResponse> DeleteInsuranceSetupByIdAsync(int id);
        Task<RequestResponse<List<GetInsuranceTypeLookupDto>>> GetInsuranceTypeLookup();
        Task<DataQueryResponse<List<GetInsuranceTypeDetailBasedOnSearchDto>>> GetInsuranceTypeDetailAsync(DataQueryModel<InsuranceSetupQueryModel> query);
        bool IsInsuranceNameUnique(string name);
    }
}
