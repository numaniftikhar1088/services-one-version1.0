using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel.Base;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;

namespace TrueMed.CompendiumManagement.Business.Interface
{
    public interface IPanelSetupService
    {
        Task<DataQueryResponse<List<GetPanelSetupDetailResponse>>> GetAllPanelsAsync(DataQueryModel<PanelSetupQueryModel> query);
        Task<RequestResponse> SavePanelSetupAsync(SavePanelSetupRequest request);
        Task<RequestResponse> DeletePanelSetupByIdAsync(int id);
        Task<RequestResponse> ChangePanelSetupStatusAsync(ChangePanelSetupStatusRequest request);

        //Task<int?> GetPanelIdByNameAsync(string name);
        //Task<bool> IsPanelExistsByIdAsync(int id);
        //Task<bool> IsPanelExistsByNameAsync(string name);
        //Task<bool> IsPanelNameValidAsync(UniqueKeyValidationViewModel uniqueKeyValidation);
        //Task<bool> SaveOrUpdatePanelAsync(Domain.Models.Test.Request.PanelViewModel panelSetupView);
        //Task<bool> DeletePanelByIdAsync(int panelId);
        //Task<bool> PanelActivationByIdAsync(int id, bool isActive);
    }
}
