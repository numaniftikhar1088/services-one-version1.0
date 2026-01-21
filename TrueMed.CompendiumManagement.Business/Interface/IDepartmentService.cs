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
    public interface IDepartmentService
    {
        Task<RequestResponse<List<DepartmentLookup>>> DepartmentLookupAsync();
        Task<RequestResponse> SaveDepartmentAsync(SaveDepartmentRequest request);
        Task<DataQueryResponse<List<GetDepartmentDetailResponse>>> GetDepartmentDetailAsync(DataQueryModel<DepartmentQueryModel> query);
        Task<RequestResponse<GetDepartmentDetailResponse>> GetDepartmentDetailByIdAsync(int id);
        Task<RequestResponse> DeleteDepartmentByIdAsync(int id);
        Task<RequestResponse> ChangeDepartmentStatusAsync(ChangeDepartmentStatusRequest request);
    }
}
