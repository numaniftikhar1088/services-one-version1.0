using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.Sevices.MasterEntities;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class MenuManagement : IMenuManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IMapper _mapper;
        private readonly ILookupManager _lookupManager;
        private readonly MasterDbContext _masterDbContext;

        public MenuManagement(MasterDbContext masterDbContext, IMapper mapper,ILookupManager lookupManager ,IConnectionManager connectionManager)
        {
            _masterDbContext = masterDbContext;
            _mapper = mapper;
            _lookupManager = lookupManager;
            _connectionManager = connectionManager;
        }
        #region Previous Code
        //public Task<RequestResponse<List<ModuleLookupModel>>> ModuleLookupAsync()
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<RequestResponse> SaveOrUpdatMenuAsync(MenuRequest request)
        //{
        //    throw new NotImplementedException();
        //}
        //public async Task<DataQueryResponse<List<GetMenuResponse>>> GetMenusbyModule(DataQueryModel<MenuSetupQueryModel> query)
        //{
        //    var response = new DataQueryResponse<List<GetMenuResponse>>();
        //    var list = new List<GetMenuResponse>();
        //    var dataSource = _masterDbContext.TblModules.Include(i => i.Pages).ToList();

        //    foreach (var module in dataSource)
        //    {

        //        foreach (var page in module.Pages)
        //        {
        //            var res = new GetMenuResponse();
        //            res.MenuId = page.Id;
        //            res.MenuName = page.Name;
        //            res.DisplayOrder = page.OrderId;
        //            res.ModuleId = module.Id;
        //            res.ModuleName = module.Name;
        //            res.IsVisible = page.IsVisible;
        //            res.IsActive = page.IsActive;
        //            res.LinkUrl = page.LinkUrl;
        //            res.MenuIcon = page.MenuIcon;
        //            res.ChildId = page.ChildId;

        //            list.Add(res);
        //        }

        //    }
        //    #region Filtered
        //    if (!string.IsNullOrEmpty(query.QueryModel?.MenuName))
        //    {
        //        list = list.Where(f => f.MenuName != null && f.MenuName.Trim().ToLower().Contains(query.QueryModel?.MenuName.Trim().ToLower())).ToList();
        //    }
        //    if (query.QueryModel?.DisplayOrder != 0)
        //    {
        //        list = list.Where(f => f.DisplayOrder != null && f.DisplayOrder.Equals(query.QueryModel?.DisplayOrder)).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.ModuleName))
        //    {
        //        list = list.Where(f => f.ModuleName != null && f.ModuleName.Trim().ToLower().Contains(query.QueryModel?.ModuleName.Trim().ToLower())).ToList();
        //    }
        //    if (query.QueryModel?.IsVisible != null)
        //    {
        //        list = list.Where(f => f.IsVisible.Equals(query.QueryModel.IsVisible)).ToList();
        //    }
        //    if (query.QueryModel?.IsActive != null)
        //    {
        //        list = list.Where(f => f.IsActive.Equals(query.QueryModel.IsActive)).ToList();
        //    }
        //    response.Total = list.Count;
        //    if (query.PageNumber > 0 && query.PageSize > 0)
        //    {
        //        list = list.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
        //    }
        //    #endregion
        //    response.Data = list;
        //    //response.Total = list.Count;

        //    return response;

        //}
        //public async Task<RequestResponse> ChangeStatusAsync(ChangeMenuStatusRequest request)
        //{
        //    var response = new RequestResponse();

        //    //var validation = new ChangeTestSetupStatusValidator();
        //    //var validate = await validation.ValidateAsync(request);

        //    //if (!validate.IsValid)
        //    //{
        //    //    response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
        //    //    response.HttpStatusCode = Status.Failed;
        //    //    response.Status = "Validation Failed !";
        //    //    response.Message = "Request Failed !";
        //    //    return response;
        //    //}
        //    var getRecordForStatusChanged = await _masterDbContext.TblPages.FindAsync(request.MenuId);
        //    if (getRecordForStatusChanged != null)
        //    {
        //        getRecordForStatusChanged.UpdatedBy = LoggedInUser;
        //        getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

        //        getRecordForStatusChanged.IsActive = request.IsActive;
        //        _masterDbContext.Update(getRecordForStatusChanged);
        //        response.Message = "Status Changed...";
        //    }
        //    else
        //    {
        //        response.Error = $"Record is not exist against ID : {request.MenuId} in our system...";
        //        response.HttpStatusCode = Status.Failed;
        //        response.Status = "Failed !";
        //        response.Message = "Request Failed !";
        //        return response;
        //    }
        //    var ack = await _masterDbContext.SaveChangesAsync();
        //    if (ack > 0)
        //    {
        //        response.HttpStatusCode = Status.Success;
        //        response.Status = "Success !";
        //    }
        //    return response;

        //}
        //public async Task<RequestResponse> ChangeVisibilityAsync(ChangeMenuVisibilityRequest request)
        //{
        //    var response = new RequestResponse();

        //    //var validation = new ChangeTestSetupStatusValidator();
        //    //var validate = await validation.ValidateAsync(request);

        //    //if (!validate.IsValid)
        //    //{
        //    //    response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
        //    //    response.HttpStatusCode = Status.Failed;
        //    //    response.Status = "Validation Failed !";
        //    //    response.Message = "Request Failed !";
        //    //    return response;
        //    //}
        //    var getRecordForStatusChanged = await _masterDbContext.TblPages.FindAsync(request.MenuId);
        //    if (getRecordForStatusChanged != null)
        //    {
        //        getRecordForStatusChanged.UpdatedBy = LoggedInUser;
        //        getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

        //        getRecordForStatusChanged.IsVisible = request.IsVisible;
        //        _masterDbContext.Update(getRecordForStatusChanged);
        //        response.Message = "Status Changed...";
        //    }
        //    else
        //    {
        //        response.Error = $"Record is not exist against ID : {request.MenuId} in our system...";
        //        response.HttpStatusCode = Status.Failed;
        //        response.Status = "Failed !";
        //        response.Message = "Request Failed !";
        //        return response;
        //    }
        //    var ack = await _masterDbContext.SaveChangesAsync();
        //    if (ack > 0)
        //    {
        //        response.HttpStatusCode = Status.Success;
        //        response.Status = "Success !";
        //    }
        //    return response;

        //}
        //public async Task<RequestResponse<List<ModuleLookupModel>>> ModuleLookupAsync()
        //{
        //    var response = new RequestResponse<List<ModuleLookupModel>>();

        //    var data = await _masterDbContext.TblModules.Select(s => new ModuleLookupModel()
        //    {
        //        ModuleId = s.Id,
        //        ModuleName = s.Name
        //    }).ToListAsync();

        //    response.Status = "Success";
        //    response.HttpStatusCode = Status.Success;
        //    response.Message = "Request Processed...";
        //    response.Data = data;

        //    return response;
        //}
        //public async Task<RequestResponse> SaveOrUpdatMenuAsync(MenuRequest request)
        //{
        //    var response = new RequestResponse();

        //    _masterDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        //    var entity = _mapper.Map<TblPage>(request);

        //    if (entity.Id > 0)
        //    {
        //        var getRecordForEdit = await _masterDbContext.TblPages.FindAsync(entity.Id);
        //        if (getRecordForEdit != null)
        //        {
        //            //entity.TestDisplayName = entity.TestName;
        //            entity.UpdatedDate = DateTimeNow.Get;
        //            entity.UpdatedBy = LoggedInUser;

        //            entity.CreatedDate = getRecordForEdit.CreatedDate;
        //            entity.CreatedBy = getRecordForEdit.CreatedBy;

        //            _masterDbContext.TblPages.Update(entity);
        //            await _masterDbContext.SaveChangesAsync();


        //            var getRecordForUpdate = await _masterDbContext.TblModulePages.FirstOrDefaultAsync(x=> x.PageId == request.MenuId);

        //            _masterDbContext.TblModulePages.Remove(getRecordForUpdate);
        //            await _masterDbContext.SaveChangesAsync();

        //            getRecordForUpdate.ModuleId= Convert.ToInt32(request.ModuleId);
        //            getRecordForUpdate.PageId= Convert.ToInt32(request.MenuId);
        //            await _masterDbContext.TblModulePages.AddAsync(getRecordForUpdate);

        //            response.Message = "Record is Updated...";

        //        }
        //        else
        //        {
        //            response.Error = $"Record is not exist against ID : {entity.Id} in our system...";
        //            response.HttpStatusCode = Status.Failed;
        //            response.Status = "Failed !";
        //            response.Message = "Request Failed !";
        //            return response;
        //        }
        //    }
        //    else
        //    {

        //        //entity.TestDisplayName = entity.TestName;

        //        entity.CreatedBy = LoggedInUser;
        //        entity.CreatedDate = DateTimeNow.Get;


        //        if (entity.IsActive == null)
        //            entity.IsActive = true;

        //        await _masterDbContext.TblPages.AddAsync(entity);
        //        await _masterDbContext.SaveChangesAsync();


        //        //var newrec = await _masterDbContext.TblPages.FindAsync(entity.Id);


        //        //var entity2 = _mapper.Map<TblModulePage>(modulePageRequest);
        //        var tblModulePage = new TblModulePage()
        //        {
        //            ModuleId = Convert.ToInt32(request.ModuleId),
        //            PageId = entity.Id,

        //        };

        //        await _masterDbContext.TblModulePages.AddAsync(tblModulePage);

        //        //newrec.Dacode = "DA" + newrec.Id.ToString().PadLeft(6, '0');

        //        //_masterDbContext.TblDrugAllergies.Update(newrec);
        //        response.Message = "Record is Added...";

        //    }

        //    var ack = await _masterDbContext.SaveChangesAsync();
        //    if (ack > 0)
        //    {
        //        response.HttpStatusCode = Status.Success;
        //        response.Status = "Success !";
        //    }
        //    return response;

        //}
        #endregion

        #region Commands
        public RequestResponse<int> Save(MenuRequestV2.SaveMenuRequest request)
        {
            var response = new RequestResponse<int>();

            var getModuleInfo = _masterDbContext.TblModules.FirstOrDefault(m => m.Id == request.ModuleId);

            var entity = _mapper.Map<TblPage>(request);

            if (!IsMenuOrderUnique(entity.OrderId))
            {
                response.Message = $"Menu Order ID : {entity.OrderId} is already exist !";
                response.HttpStatusCode = Domain.Model.Identity.Status.Success;
                return response;
            }
            if (entity.Id == 0)
            {
                if (!IsMenuNameUnique(entity.Name))
                {
                    response.Message = $"Menu Name : {entity.Name} is already exist !";
                    response.HttpStatusCode = Domain.Model.Identity.Status.Success;
                    return response;
                }
                entity.CreatedBy = _connectionManager.UserId;
                entity.CreatedDate = DateTimeNow.Get;

                entity.IsActive = true;
                entity.IsVisible = true;

                getModuleInfo.Pages.Add(entity);

                _masterDbContext.TblModules.Add(getModuleInfo);
                response.Message = "Menu Added Successfully !";
            }
            else
            {
                var existingEntry = _masterDbContext.TblPages.AsNoTracking().Where(f => f.Id == entity.Id).Select(s => new { CreatedBy = s.CreatedBy, CreatedDate = s.CreatedDate,MenuName = s.Name});

                var menuName = existingEntry.FirstOrDefault()?.MenuName;
                var createdBy = existingEntry.FirstOrDefault()?.CreatedBy;
                var createdDate = existingEntry.FirstOrDefault()?.CreatedDate;

                if (entity.Name.Trim().ToLower() != menuName.Trim().ToLower())
                {
                    if (!IsMenuNameUnique(entity.Name))
                    {
                        response.Message = $"Menu Name : {entity.Name} is already exist !";
                        response.HttpStatusCode = Domain.Model.Identity.Status.Success;
                        return response;
                    }
                }

                entity.CreatedBy = createdBy;
                entity.CreatedDate = createdDate;

                entity.UpdatedDate = DateTimeNow.Get;
                entity.UpdatedBy = _connectionManager.UserId;

                _masterDbContext.TblPages.Update(entity);
                response.Message = "Menu Update Successfully !";
            }
            _masterDbContext.SaveChanges();

            response.HttpStatusCode = Domain.Model.Identity.Status.Success;
            response.Data = entity.Id;

            return response;
        }
        #endregion
        #region Queries
        #endregion
        #region Private Internal Methods
        private bool IsMenuNameUnique(string? menuName)
        {
            var isUnique = false;

            if (!string.IsNullOrEmpty(menuName))
            {
                isUnique = _masterDbContext.TblPages.Any(m => m.Name.Trim().ToLower() == menuName.Trim().ToLower());
                if (isUnique)
                    isUnique = false;
                else
                    isUnique = true;
            }
            return isUnique;
        }
        private bool IsMenuOrderUnique(int? order)
        {
            var isUnique = false;

            if (order > 0)
            {
                isUnique = _masterDbContext.TblPages.Any(m => m.OrderId == order);
                if (isUnique)
                    isUnique = false;
                else
                    isUnique = true;
            }
            return isUnique;
        }
        #endregion
        #region Lookups
        public async Task<List<CommonLookupResponse>> Module_Lookup()
        {
            return await _lookupManager.Module_Lookup();
        }
        #endregion
    }
}
