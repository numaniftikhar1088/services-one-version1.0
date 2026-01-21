using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.ResponseModel;

namespace TrueMed.InsuranceManagement.Business.Interface
{
    public interface IOrderInsuranceService
    {
        Task<RequestResponse> SaveOrderInsuranceAsync(OrderInsuranceSaveDto entity);
        //Task<DataQueryResponse<IQueryable<GetOrderInsuranceBriefInfoDto>>> GetOrderInsuranceBriefInfoAsync();
        //Task<RequestResponse<GetOrderInsuranceInfoByIdDto>> GetOrderInsuranceInfoByIdAsync(int id);
        Task<RequestResponse> DeleteOrderInsuranceAsync(int id);
      
    }
}
