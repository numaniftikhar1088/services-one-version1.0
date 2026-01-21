using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.LookupModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface IDepartmentService
    {
        Task<RequestResponse> SaveDepartmentAsync(SaveDepartmentRequest request);
        Task<DataQueryResponse<List<GetDepartmentDetailResponse>>> GetDepartmentDetailAsync(DataQueryModel<DepartmentQueryModel> query);
        Task<RequestResponse<GetDepartmentDetailByIdResponse>> GetDepartmentDetailByIdAsync(int id);
        Task<RequestResponse> DeleteDepartmentByIdAsync(int id);
        Task<RequestResponse> ChangeDepartmentStatusAsync(ChangeDepartmentStatusRequest request);
    }
}
