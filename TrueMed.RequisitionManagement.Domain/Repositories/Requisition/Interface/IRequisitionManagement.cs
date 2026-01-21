
using TrueMed.Domain.Models.Identity;
using TrueMed.Domain.Models.Response;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Dtos;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Request;

namespace TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Interface
{
    public interface IRequisitionManagement
    {
        IQueryable<RequisitionTestTypeModel> GetAllTypes();
        bool IsTypeExists(string type);
        bool IsExistsTypeById(int id);
        bool IsTypeValid(KeyValuePairViewModel<int?> uniqueKeyValidation);
        Task<bool> AddOrUpdateTypeAsync(RequisitionTypeViewModel requisitionTypeViewModel);
        Task<bool> RequisitionTypeActivationByIdAsync(int reqTypeId, bool isActive);

        RequestResponse RequisitionTypeStatusChanged(int id, bool status);
     
    }
}
