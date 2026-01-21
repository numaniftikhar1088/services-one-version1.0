using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface IRequisitionTypeService
    {
        Task<RequestResponse> SaveRequisitionTypeAsync(SaveRequisitionTypeRequest request);
        Task<DataQueryResponse<List<GetRequisitionTypeResponse>>> GetRequisitionTypesAsync(DataQueryModel<RequisitionTypeQueryModel> query);
        Task<RequestResponse> ChangeRequisitionTypeStatusAsync(ChangeRequisitionTypeStatusRequest request);
        Task<RequestResponse> DeleteRequisitionTypeByIdAsync(int id);
        Task<bool> IsRequisitionNameValid(string name);
    }
}
