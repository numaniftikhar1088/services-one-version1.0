using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using TrueMed.CompendiumManagement.Domain.Repositories.Test.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Test.Dtos;
using TrueMed.CompendiumManagement.Domain.Models.Test.Request;
using TrueMed.CompendiumManagement.Domain.Models.Test.Response;
using TrueMed.Domain.Models.Datatable;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Business.TenantDbContext;
using TrueMed.Business.Interface;
using TrueMed.Domain.Models.Identity;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Test.Implementation
{
    public class PanelGroupManagement : IPanelGroupManagement
    {
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly IConnectionManager _connectionManager;

        public PanelGroupManagement(
            IConnectionManager connectionManager,
            ApplicationDbContext applicationDbContext
            )
        {
            this._applicationDbContext = applicationDbContext;
            this._connectionManager = connectionManager;
        }

        public IQueryable<PanelGroupModel> GetAllCompendiumGroups()
        {
            return _applicationDbContext.TblCompendiumGroups.Select(x => new PanelGroupModel
            {
                Id = x.Id,
                Name = x.GroupName,
                Description = x.Description,
                ReqTypeId = x.ReqTypeId,
                CreateBy = x.CreatedBy,
                CreateDate = x.CreatedDate,
                IsActive = x.IsActive
            }).OrderByDescending(x => x.CreateDate);
        }
        public async Task<bool> SaveOrUpdatePanelGroupAsync
            (Models.Test.Request.PanelGroupViewModel panelGroupSetupView)
        {
            var isUpdating = panelGroupSetupView is Models.Test.Request.UpdatePanelGroupViewModel;
            if (isUpdating && !await IsPanelGroupExistsByIdAsync((int)panelGroupSetupView.Id))
            {
                return false;
            }

            //name should be valid..
            if (!await IsPanelGroupNameValidAsync(new KeyValuePairViewModel<int?>
            {
                Id = panelGroupSetupView.Id,
                KeyValue = panelGroupSetupView.Name
            }))
                return false;

            var groupPanel = await _applicationDbContext.TblCompendiumGroups.FirstOrDefaultAsync(x => x.Id == panelGroupSetupView.Id);
            if (groupPanel == null)
            {
                groupPanel = new TrueMed.Domain.Models.Database_Sets.Application.TblCompendiumGroup();
                groupPanel.CreatedBy = _connectionManager.UserId;
                groupPanel.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                groupPanel.UpdatedBy = _connectionManager.UserId;
                groupPanel.UpdatedDate = DateTimeNow.Get;
            }

            groupPanel.GroupName = panelGroupSetupView.Name;
            groupPanel.Description = panelGroupSetupView.Description;
            groupPanel.ReqTypeId = panelGroupSetupView.ReqTypeId;
            groupPanel.IsActive = panelGroupSetupView.IsActive;

            if (isUpdating)
                _applicationDbContext.Update(groupPanel).State = EntityState.Modified;
            else
                _applicationDbContext.Update(groupPanel).State = EntityState.Added;

            var isAffected = await _applicationDbContext.SaveChangesAsync() > 0;
            panelGroupSetupView.Id = groupPanel.Id;
            return isAffected;
        }

        public async Task<bool> IsPanelGroupExistsByNameAsync(string name)
        {
            return await _applicationDbContext.TblCompendiumGroups.AnyAsync(x => x.GroupName.ToLower() == name.ToLower());
        }

        public async Task<bool> IsPanelGroupExistsByIdAsync(int id)
        {
            return await _applicationDbContext.TblCompendiumGroups.AnyAsync(x => x.Id == id);
        }

        public async Task<int?> GetPanelGroupIdByNameAsync(string name)
        {
            try
            {
                var res = await _applicationDbContext.TblCompendiumGroups
                .Where(x => x.GroupName.ToLower() == name.ToLower())
                .Select(x => x.Id).FirstOrDefaultAsync();
                return res;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<bool> IsPanelGroupNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {
            if (uniqueKeyValidation.Id != null && await GetPanelGroupIdByNameAsync(uniqueKeyValidation.KeyValue) == (int)uniqueKeyValidation.Id)
            {
                return true;
            }
            else
            {
                return !await IsPanelGroupExistsByNameAsync(uniqueKeyValidation.KeyValue);
            }
        }

        public async Task<bool> DeletePanelGroupByIdAsync(int id)
        {
            return await _applicationDbContext.TblCompendiumGroups
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.IsDeleted, true)) > 0;
        }

        public async Task<bool> PanelGroupActivationByIdAsync(int id, bool isActive)
        {
            return await _applicationDbContext.TblCompendiumGroups
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(x => x.SetProperty(p => p.IsActive, isActive)) > 0;
        }
        public async Task<DataQueryResponse<List<PanelGroupViewModelResp>>> SearchCompendiumGroupAsync(DataQueryViewModel<PanelGroupQueryViewModel> queryModel)
        {

            var resp = new DataQueryResponse<List<PanelGroupViewModelResp>>();
            //var panelGroupManagement = connectionManager.GetService<IPanelGroupManagement>();
            var requisitionTypeResult = await _applicationDbContext.TblLabRequisitionTypes.Where(x => x.IsDeleted == false).ToListAsync();
            var panelGroupResult = await _applicationDbContext.TblCompendiumGroups.Where(x => x.IsDeleted == false).ToListAsync();


            var dataSource = (from panelGroup in panelGroupResult
                              join requisitionType in requisitionTypeResult on panelGroup.ReqTypeId equals requisitionType.ReqTypeId
                              into panelGrouprequisitionType
                              from panelGroupPlusrequisitionType in panelGrouprequisitionType.DefaultIfEmpty()
                                  //join department in departmentResult on testSetup.DeptId equals department.DeptId
                                  //into panelSetupdepartment
                                  //from panelSetupPlusdepartment in panelSetupdepartment.DefaultIfEmpty()
                              select new PanelGroupViewModelResp()
                              {
                                  Name = panelGroup.GroupName,
                                  Description = panelGroup.Description,
                                  ReqTypeId = panelGroup.ReqTypeId,
                                  ReqTypeName = panelGroupPlusrequisitionType == null ? "NA" : panelGroupPlusrequisitionType.RequisitionTypeName,
                                  //CreateBy = x.CreateBy,
                                  //CreateDate = x.CreateDate,
                                  Id = panelGroup.Id,
                                  IsActive = panelGroup.IsActive


                              }).DistinctBy(d => d.Id).OrderByDescending(o => o.Id).ToList();
            //panelGroupManagement.GetAllCompendiumGroups()
            //.Select(x => new Domain.Models.Test.Response.PanelGroupViewModel
            //{
            //    Name = x.Name,
            //    Description = x.Description,
            //    ReqTypeId = x.ReqTypeId,
            //    //CreateBy = x.CreateBy,
            //    //CreateDate = x.CreateDate,
            //    Id = x.Id,
            //    IsActive = x.IsActive
            //});

            if (queryModel != null && queryModel.QueryModel != null)
            {
                if (!string.IsNullOrEmpty(queryModel.QueryModel?.Name))
                {
                    dataSource = dataSource.Where(f => f.Name != null && f.Name.ToLower().Contains(queryModel.QueryModel?.Name.ToLower())).ToList();
                }
                if (!string.IsNullOrEmpty(queryModel.QueryModel?.Description))
                {
                    dataSource = dataSource.Where(f => f.Description != null && f.Description.ToLower().Contains(queryModel.QueryModel?.Description.ToLower())).ToList();
                }
                if (!string.IsNullOrEmpty(queryModel.QueryModel?.ReqTypeName))
                {
                    dataSource = dataSource.Where(f => f.ReqTypeName != null && f.ReqTypeName.ToLower().Contains(queryModel.QueryModel?.ReqTypeName.ToLower())).ToList();
                }
                if (queryModel.QueryModel?.IsActive != null)
                {
                    dataSource = dataSource.Where(f => f.IsActive.Equals(queryModel.QueryModel.IsActive)).ToList();
                }
                resp.TotalRecord = dataSource.Count();


                if (!string.IsNullOrEmpty(queryModel.SortColumn) && queryModel.SortDirection != null)
                {
                    dataSource = dataSource.AsQueryable().OrderBy($"{queryModel.SortColumn} {queryModel.SortDirection}").ToList();

                }
                else
                {
                    dataSource = dataSource.AsQueryable().OrderBy($"id desc").ToList();
                }


                if (queryModel.PageNumber > 0 && queryModel.PageSize > 0)
                {
                    dataSource = dataSource.Skip((queryModel.PageNumber - 1) * queryModel.PageSize).Take(queryModel.PageSize).ToList();
                }

            }

            // var resp=  new DataReponseViewModel<Domain.Models.Test.Response.PanelGroupViewModel>(
            // dataSource.Count(),
            //await dataSource
            // .Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
            // .Take(queryModel.PageSize).ToArrayAsync());
            resp.Result = dataSource;
            return resp;
        }
    }
}
