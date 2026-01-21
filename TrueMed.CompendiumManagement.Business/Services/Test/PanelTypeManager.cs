using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.Domain.Model.Identity;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Business.Services.Test
{
    public static class PanelTypeManager
    {
        public static async Task<DataReponseViewModel<Domain.Models.Test.Response.PanelTypeViewModel>>
           SearchPanelTypeAsync(DataQueryViewModel<PanelTypeQueryViewModel> queryModel, IConnectionManager connectionManager)
        {
            var PanelTypeManagement = connectionManager.GetService<IPanelTypeManagement>();

            var PanelTypes = PanelTypeManagement.GetAllPanelTypes()
                .Select(x => new Domain.Models.Test.Response.PanelTypeViewModel
                {
                    Name = x.Name,
                    CreateBy = x.CreateBy,
                    CreateDate = x.CreateDate,
                    Id = x.Id,
                    IsActive = x.IsActive
                });

            if (queryModel != null && queryModel.QueryModel != null)
            {
                var query = queryModel.QueryModel;
                if (query.Id != null)
                    PanelTypes = PanelTypes.Where(x => x.Id == query.Id);
                if (!string.IsNullOrEmpty(query.Name))
                    PanelTypes = PanelTypes.Where(x => EF.Functions.Like(x.Name, $"%{query.Name}%"));
                if (query.IsActive != null)
                    PanelTypes = PanelTypes.Where(x => x.IsActive == query.IsActive);
            }

            return new DataReponseViewModel
                <Domain.Models.Test.Response.PanelTypeViewModel>(
                PanelTypes.Count(),
               await PanelTypes
                .Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToArrayAsync());
        }

        public async static Task<CompendiumResult> SaveOrUpdatePanelTypeAsync(PanelTypeViewModel groupPanelTypeSetupView, IConnectionManager connectionManager)
        {
            var identityResult = CompendiumResult.Failed;

            var PanelTypeManagement = connectionManager.GetService<IPanelTypeManagement>();

            var isUpdating = groupPanelTypeSetupView is UpdatePanelTypeViewModel;

            if (isUpdating && !await PanelTypeManagement.IsPanelTypeExistsByIdAsync((int)groupPanelTypeSetupView.Id))
            {
                identityResult.AddError(nameof(groupPanelTypeSetupView.Id), "Invalid Id (might be not found).");
            }

            if (!await PanelTypeManagement.IsPanelTypeNameValidAsync(new KeyValuePairViewModel<int?>
            {
                Id = groupPanelTypeSetupView.Id,
                KeyValue = groupPanelTypeSetupView.Name
            }))
            {
                identityResult.AddError(nameof(groupPanelTypeSetupView.Name), "Invalid value (might be already taken).");
            }

            if (identityResult.HasErrors)
            {
                return identityResult;
            }

            var isDone = await PanelTypeManagement.SaveOrUpdatePanelTypeAsync(groupPanelTypeSetupView);
            if (isDone)
            {
                identityResult.UpdateIdentifier(groupPanelTypeSetupView.Id);
                return identityResult.MakeSuccessed();
            }
            else
            {
                return identityResult.MakeFailed();
            }
        }
    }
}
