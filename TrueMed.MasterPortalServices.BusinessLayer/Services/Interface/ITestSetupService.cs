using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.LookupModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface ITestSetupService
    {
        Task<RequestResponse> SaveTestSetupAsync(SaveTestSetupRequest request);
        Task<DataQueryResponse<List<GetTestSetupDetailResponse>>> GetTestSetupDetailAsync(DataQueryModel<TestSetupQueryModel> query);
        Task<RequestResponse<GetTestSetupDetailByIdResponse>> GetTestSetupDetailByIdAsync(int id);
        Task<RequestResponse> ChangeTestSetupStatusAsync(ChangeTestSetupStatusRequest request);
        Task<RequestResponse> DeleteTestSetupByIdAsync(int id);


        Task<RequestResponse<List<TestSetupLookup>>> TestSetupLookupAsync();
    }
}
