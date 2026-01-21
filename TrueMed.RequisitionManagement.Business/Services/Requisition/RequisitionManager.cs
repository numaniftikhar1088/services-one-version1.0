using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using TrueMed.Business.Interface;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Domain.Models.Identity;
using TrueMed.RequisitionManagement.Domain.Models;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Request;
using TrueMed.RequisitionManagement.Domain.Repositories.Requisition.Interface;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TrueMed.RequisitionManagement.Business.Services.Requisition
{
    public static class RequisitionManager
    {
        public static async Task<DataReponseViewModel<Domain.Models.Requisition.Response.RequisitionTypeViewModel>>
            SearchRequisitionAsync(DataQueryViewModel<RequisionTypeQueryViewModel> queryModel, IConnectionManager connectionManager)
        {
            var requisitionManagement = connectionManager.GetService<IRequisitionManagement>();

            var RequisitionTypes = requisitionManagement.GetAllTypes()
                .Select(x => new Domain.Models.Requisition.Response.RequisitionTypeViewModel
                {
                    Name = x.Name,
                    Type = x.Type,
                    Id = x.Id,
                    IsActive = x.IsActive,
                    RequisitionColor = x.RequisitionColor,
                    IsSelected = x.IsSelected,
                    RequisitionId = x.RequisitionId
                });
            RequisitionTypes = RequisitionTypes.OrderByDescending(o => o.Id);
            if (queryModel != null && queryModel.QueryModel != null)
            {
                var query = queryModel.QueryModel;
                if (!string.IsNullOrEmpty(query.Name))
                    RequisitionTypes = RequisitionTypes.Where(x => EF.Functions.Like(x.Name, $"%{query.Name}%"));
                if (!string.IsNullOrEmpty(query.Type))
                    RequisitionTypes = RequisitionTypes.Where(x => EF.Functions.Like(x.Type, $"%{query.Type}%"));
                if (query.IsActive != null)
                    RequisitionTypes = RequisitionTypes.Where(x => x.IsActive == query.IsActive);
                if (!string.IsNullOrEmpty(query.RequisitionColor))
                    RequisitionTypes = RequisitionTypes.Where(x => x.RequisitionColor != null && x.RequisitionColor.Trim().ToLower().Contains(query.RequisitionColor.Trim().ToLower()));
            }
            if (!string.IsNullOrEmpty(queryModel.SortColumn) && queryModel.SortDirection != null)
            {
                RequisitionTypes = RequisitionTypes.OrderBy($"{queryModel.SortColumn} {queryModel.SortDirection}");
            }
            else
            {
                RequisitionTypes = RequisitionTypes.OrderBy($"id desc");
            }
            var RequisitionTypesResult = await RequisitionTypes
                .Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToListAsync();

            return new DataReponseViewModel
                <Domain.Models.Requisition.Response.RequisitionTypeViewModel>(
                RequisitionTypes.Count(),
                RequisitionTypesResult
              );
        }

        public static async Task<RequisitionResult> AddOrUpdateTypeAsync(IConnectionManager connectionManager
            , RequisitionTypeViewModel requisitionTypeView)
        {
            var requisitionManagement = connectionManager.GetService<IRequisitionManagement>();
            var identityResult = RequisitionResult.Failed;

            //if (!requisitionManagement.IsTypeValid(new TrueMed.Business.Models.Identity.Request.KeyValuePairViewModel<int?>
            //{
            //    Id = requisitionTypeView.Id,
            //    KeyValue = requisitionTypeView.Type
            //}))
            //{
            //    identityResult.AddError(nameof(requisitionTypeView.Type), "Invalid type, might be already exists against different identifier.");
            //}

            if (identityResult.HasErrors)
                return identityResult;

            var typeDone = await requisitionManagement.AddOrUpdateTypeAsync(requisitionTypeView);
            identityResult.UpdateIdentifier(requisitionTypeView.Id);
            return identityResult.Response(typeDone);
        }

        public async static Task<IList<KeyValuePairViewModel<string>>> GetCollectorLookupByFacilityIdAsync(int facilityId, IConnectionManager connectionManager)
        {
            var labRoleManagement = connectionManager.GetService<ILabRoleManagement>();
            var userManagement = connectionManager.GetService<IUserManagement>();
            return await labRoleManagement.GetAllUserRoles()
                .Where(x => x.RoleName.ToLower().Trim() == "Collector".ToLower().Trim())
                .Join(userManagement.GetAllUsers(null), x => x.UserId, x => x.Id,
                 (pri, refe) => new KeyValuePairViewModel<string>()
                 {
                     Id = pri.UserId,
                     KeyValue = refe.FirstName + " " + refe.LastName,
                 }).ToListAsync();
        }
    }
}
