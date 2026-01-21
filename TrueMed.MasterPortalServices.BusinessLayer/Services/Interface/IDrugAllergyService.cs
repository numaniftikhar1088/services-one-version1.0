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
    public interface IDrugAllergyService
    {
        Task<DataQueryResponse<List<GetDrugAllergiesResponse>>> GetDrugAllergiesAsync(DataQueryModel<DrugAllergyQueryModel> query);
        Task<RequestResponse> ChangeDrugAllergyStatusAsync(ChangeDrugAllergyStatusRequest request);
        Task<RequestResponse> DeleteDrugAllergyByIdAsync(int id);
        Task<RequestResponse> SaveDrugAllergyAsync(SaveDrugAllergyRequest request);
        Task<bool> IsDrugAllergiesDescriptionValid(string name);
    }
}
