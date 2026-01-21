using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Interface;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Business.Services.Test
{
    public static class PanelManager
    {

        public static async Task<DataReponseViewModel<Domain.Models.Test.Response.PanelViewModel>>
            SearchPanelAsync(DataQueryViewModel<PanelQueryViewModel> queryModel, IConnectionManager connectionManager)
        {
            var panelManagement = connectionManager.GetService<IPanelManagement>();
            var requisitionManagement = connectionManager.GetService<IRequisitionManagement>();
            var requisitionTypes = await requisitionManagement.GetAllTypes().Select(x => new { x.Name, x.Id }).ToListAsync();


            var panels = panelManagement.GetAllPanels()
                .Select(x => new Domain.Models.Test.Response.PanelViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    IsActive = x.IsActive,
                    TmitCode = x.TmitCode,
                    Department = x.Department,
                    DepartmentName = x.DepartmentName,
                    RequisitionType = x.RequisitionType,
                    RequisitionTypeName = x.RequisitionTypeName,
                    CreateDate = x.CreateDate

                   
                });

            if (queryModel != null && queryModel.QueryModel != null)
            {
                var query = queryModel.QueryModel;
                if (!string.IsNullOrEmpty(query.Name))
                    panels = panels.Where(x => EF.Functions.Like(x.Name, $"%{query.Name}%"));
                //if (!string.IsNullOrEmpty(query.DisplayName))
                //    panels = panels.Where(x => EF.Functions.Like(x.DisplayName, $"%{query.DisplayName}%"));
                if (!string.IsNullOrEmpty(query.TMITCode))
                    panels = panels.Where(x => EF.Functions.Like(x.TmitCode, $"%{query.TMITCode}%"));
                if (query.IsActive != null)
                    panels = panels.Where(x => x.IsActive == query.IsActive);
                if (query.RequisitionType != null)
                    panels = panels.Where(x => x.RequisitionType == query.RequisitionType);
                //if (query.Department != null)
                //    panels = panels.Where(x => x.Department == query.Department);

            }

            var requisitionTypeIds = requisitionTypes.Select(x => x.Id).ToList();

            var panelsResult = await panels.Where(x => requisitionTypeIds.Contains(x.RequisitionType ?? 0))
                .Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToListAsync();

            panelsResult.ForEach(x => x.RequisitionTypeName = requisitionTypes
            .Where(_ => _.Id == x.RequisitionType)
            .Select(x => x.Name)
            .FirstOrDefault());

            return new DataReponseViewModel
                <Domain.Models.Test.Response.PanelViewModel>(
                panels.Count(),
                panelsResult
              );
        }

        public async static Task<CompendiumResult> SaveOrUpdatePanelAsync(PanelViewModel panelSetupView, IConnectionManager connectionManager)
        {
            var identityResult = CompendiumResult.Failed;

            var PanelManagement = connectionManager.GetService<IPanelManagement>();

            var isUpdating = panelSetupView is UpdatePanelViewModel;

            if (isUpdating && !await PanelManagement.IsPanelExistsByIdAsync((int)panelSetupView.Id))
            {
                identityResult.AddError(nameof(panelSetupView.Id), "Invalid Id (might be not found).");
            }

            if (!await PanelManagement.IsPanelNameValidAsync(new KeyValuePairViewModel<int?>
            {
                Id = panelSetupView.Id,
                KeyValue = panelSetupView.Name
            }))
            {
                identityResult.AddError(nameof(panelSetupView.Name), "Invalid value (might be already taken).");
            }

            if (identityResult.HasErrors)
            {
                return identityResult;
            }

            var isDone = await PanelManagement.SaveOrUpdatePanelAsync(panelSetupView);
            if (isDone)
            {
                identityResult.UpdateIdentifier(panelSetupView.Id);
                return identityResult.MakeSuccessed();
            }
            else
            {
                return identityResult.MakeFailed();
            }
        }
    }
}
