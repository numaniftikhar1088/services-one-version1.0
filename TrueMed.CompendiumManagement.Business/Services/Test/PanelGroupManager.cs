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
using TrueMed.CompendiumManagement.Domain.Models;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.Domain.Models.Identity;

namespace TrueMed.CompendiumManagement.Business.Services.Test
{
    public static class PanelGroupManager
    {


        //public static async Task<DataReponseViewModel<Domain.Models.Test.Response.PanelGroupViewModel>>
        //   SearchCompendiumGroupAsync(DataQueryViewModel<PanelGroupQueryViewModel> queryModel, IConnectionManager connectionManager)
        //{
        //    var panelGroupManagement = connectionManager.GetService<IPanelGroupManagement>();

        //    var panelGroups = panelGroupManagement.GetAllCompendiumGroups()
        //        .Select(x => new Domain.Models.Test.Response.PanelGroupViewModel
        //        {
        //            Name = x.Name,
        //            Description = x.Description,
        //            //CreateBy = x.CreateBy,
        //            //CreateDate = x.CreateDate,
        //            Id = x.Id,
        //            IsActive = x.IsActive
        //        });

        //     if (queryModel != null && queryModel.QueryModel != null)
        //    {
        //        var query = queryModel.QueryModel;
        //        //if (query.Id != null)
        //        //    panelGroups = panelGroups.Where(x => x.Id == query.Id);
        //        if (!string.IsNullOrEmpty(query.Name))
        //            panelGroups = panelGroups.Where(x => EF.Functions.Like(x.Name, $"%{query.Name}%"));
        //        if (!string.IsNullOrEmpty(query.Description))
        //            panelGroups = panelGroups.Where(x => EF.Functions.Like(x.Description, $"%{query.Description}%"));
        //        if (query.IsActive != null)
        //            panelGroups = panelGroups.Where(x => x.IsActive == query.IsActive);

        //    }

        //        var resp=  new DataReponseViewModel<Domain.Models.Test.Response.PanelGroupViewModel>(
        //        panelGroups.Count(),
        //       await panelGroups
        //        .Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
        //        .Take(queryModel.PageSize).ToArrayAsync());
        //    return resp;
        //}

        public async static Task<CompendiumResult> SaveOrUpdatePanelGroupAsync(PanelGroupViewModel groupPanelSetupView, IConnectionManager connectionManager)
        {
            var identityResult = CompendiumResult.Failed;
            var panelGroupManagement = connectionManager.GetService<IPanelGroupManagement>();

            var isUpdating = groupPanelSetupView is UpdatePanelGroupViewModel;
            if(groupPanelSetupView.Description== null || groupPanelSetupView.Description == "")
            {
                groupPanelSetupView.Description = groupPanelSetupView.Name;
            }

            if (isUpdating && !await panelGroupManagement.IsPanelGroupExistsByIdAsync((int)groupPanelSetupView.Id))
            {
                identityResult.AddError(nameof(groupPanelSetupView.Id), "Invalid Id (might be not found).");
            }

            if (!await panelGroupManagement.IsPanelGroupNameValidAsync(new KeyValuePairViewModel<int?>
            {
                Id = groupPanelSetupView.Id,
                KeyValue = groupPanelSetupView.Name
            }))
            {
                identityResult.AddError(nameof(groupPanelSetupView.Name), "Invalid value (might be already taken).");
            }

            if (identityResult.HasErrors)
            {
                return identityResult;
            }

            var isDone = await panelGroupManagement.SaveOrUpdatePanelGroupAsync(groupPanelSetupView);
            if (isDone)
            {
                identityResult.UpdateIdentifier(groupPanelSetupView.Id);
                return identityResult.MakeSuccessed();
            }
            else
            {
                return identityResult.MakeFailed();
            }
        }
        public static async Task<RequestResponse<List<CompendiumGroupLookup>>>GetCompendiumGroupLookupAsync(IConnectionManager connectionManager)
        {
            var response = new RequestResponse<List<CompendiumGroupLookup>>();

            var panelGroupManagement = connectionManager.GetService<IPanelGroupManagement>();

            var lookupData =await panelGroupManagement.GetAllCompendiumGroups()
                .Select(x => new CompendiumGroupLookup
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToListAsync();

            response.Data = lookupData;
            response.Status = "Success";
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;

            return response;
        }

    }
}
