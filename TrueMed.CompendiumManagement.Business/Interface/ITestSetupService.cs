using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface ITestSetupService
    {
        Task<RequestResponse> SaveTestSetupAsync(SaveTestSetupRequest request);
        Task<RequestResponse> ChangeTestSetupStatusAsync(ChangeTestSetupStatusRequest request);
        Task<RequestResponse> DeleteTestSetupByIdAsync(int id);
        Task<DataQueryResponse<List<GetTestSetupDetailResponse>>> GetTestSetupDetailAsync(DataQueryModel<TestSetupQueryModel> query);
        Task<RequestResponse<List<TestSetupLookup>>> TestSetupLookupAsync();
        Task<RequestResponse<List<RequisitionTypeLookup>>> RequisitionTypeLookupAsync();
    }
}
