using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Business.Validations;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;

namespace TrueMed.FacilityManagement.Business.Services.Implementation
{
    public class FacilityOptionsService : IFacilityOptionsService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _appDbContext;
        //private readonly MasterDbContext _masterDbContext;

        public FacilityOptionsService(IConnectionManager connectionManager, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _appDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            //_masterDbContext = masterDbContext;
            LoggedInUser = connectionManager.UserId;

        }
        public string LoggedInUser { get; set; }

        public async Task<DataQueryResponse<List<FacilityOptionsResponse>>> GetAllFacilityOptions(DataQueryModel<FacilityOptionsQueryModel> query)
        {
            var response = new DataQueryResponse<List<FacilityOptionsResponse>>();

            var labID = _connectionManager.GetLabId();
            #region Source
            var tblLabFeatures = _appDbContext.TblLabFeatures.ToList();
            var tblFacilityOptions = _appDbContext.TblFacilityOptions.ToList();
            #endregion
            #region Query
            var dataSource = (tblLabFeatures
                              .Select(s => new FacilityOptionsResponse()
                              {
                                  Id = s.Id,
                                  OptionName = s.OptionName,
                                  IsEnabled = s.IsEnabled,
                                  //Facilities = _appDbContext.TblFacilities.Where(f => (tblFacilityOptions.Where(w => w.OptionId == s.Id).Select(se => se.FacilityId)).Contains(f.FacilityId))
                                  //.Select(s => new FacilityInfo() { Id = s.FacilityId, FacilityName = s.FacilityName + " - " + s.Address }).ToList(),
                                  Facilities = _appDbContext.TblFacilities
                                                .Where(f => _appDbContext.TblFacilityOptions.Any(w => w.OptionId == s.Id && w.FacilityId == f.FacilityId))
                                                .Select(f => new FacilityInfo() { Id = f.FacilityId, FacilityName = f.FacilityName + " - " + f.Address })
                                                .ToList(),

                              })).OrderByDescending(x => x.Id).ToList();
            #endregion
            #region Filter


            if (!string.IsNullOrEmpty(query.QueryModel?.OptionName))
            {
                dataSource = dataSource.Where(f => f.OptionName != null && f.OptionName.Trim().ToLower().Contains(query.QueryModel?.OptionName.Trim().ToLower())).ToList();
            }

            response.Total = dataSource.Count();


            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy("id desc").ToList();
            }

            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.StatusCode = HttpStatusCode.OK;
            response.Data = dataSource;

            return response;
        }
        public async Task<RequestResponse> SaveFacilityOption(List<SaveFacilityOptionsRequest> request)
        {
            var response = new RequestResponse();

            foreach (var item in request)
            {
                var record = _appDbContext.TblLabFeatures.FirstOrDefault(w => w.Id == item.Id);
                if (record != null)
                {
                    record.IsEnabled = item.IsEnabled;
                    _appDbContext.TblLabFeatures.Update(record);
                }

            }

            var ack = await _appDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                //response.Message = "Record Added Successfully !";
                response.StatusCode = Status.Success;
                response.ResponseStatus = "Success";
                //response.Data = JsonSerializer.Serialize(entity, jsonOptions);
            }
            return response;
        }
        public async Task<RequestResponse> SaveFacilitiesAsync(SaveFacilities request)
        {
            var response = new RequestResponse();

            var validation = new FacilitiesValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToString();
                response.StatusCode = Status.Failed;
                response.ResponseStatus = "Failed";
                response.ResponseMessage = "Request Failed !";
                return response;
            }

            _appDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            var getRecordForEditFacilityOptions = _appDbContext.TblFacilityOptions.Where(x => x.OptionId == request.Id).ToList();
            if (getRecordForEditFacilityOptions != null)
            {
                _appDbContext.TblFacilityOptions.RemoveRange(getRecordForEditFacilityOptions);
                await _appDbContext.SaveChangesAsync();
            }

            foreach (var item in request.Facilites)
            {
                var secondentity = new TblFacilityOption();
                secondentity.CreatedBy = LoggedInUser;
                secondentity.CreatedDate = DateTime.UtcNow;
                secondentity.OptionId = request.Id;
                secondentity.FacilityId = item;
                _appDbContext.TblFacilityOptions.Add(secondentity);
            }


            var ack = await _appDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.ResponseMessage = "Facilities Added Successfully !";
                response.StatusCode = Status.Success;
                response.ResponseStatus = "Success";
                //response.Data = entity;
            }
            return response;
        }
    }
}
