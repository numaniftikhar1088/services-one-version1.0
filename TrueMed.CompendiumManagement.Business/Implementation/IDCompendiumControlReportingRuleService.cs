using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Validator.CompendiumManagement;

namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class IDCompendiumControlReportingRuleService : IIDCompendiumControlReportingRuleService
    {
        private readonly IConnectionManager _connectionManager;
        //private readonly IUtilityService _utilityService;
        //private readonly IMapper _mapper;
        private ApplicationDbContext _dbContext;
        public IDCompendiumControlReportingRuleService(IConnectionManager connectionManager, IHttpContextAccessor httpContextAccessor)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            //_utilityService = utilityService;
            //_mapper = mapper;
            LoggedInUser = connectionManager.UserId;
        }
        public string LoggedInUser { get; set; }


        public async Task<RequestResponse> SaveIDCompendiumControlReportingRulesAsync(IDCompendiumControlReportingRuleResponse request)
        {
            var response = new RequestResponse();
            var labId = _connectionManager.GetLabId();
            //var validation = new IDCompendiumReportingRulesValidator();
            //var validate = await validation.ValidateAsync(request);

            //if (!validate.IsValid)
            //{
            //    response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
            //    response.HttpStatusCode = Status.Failed;
            //    response.Status = "Validation Failed !";
            //    response.Message = "Request Failed !";
            //    return response;
            //}

            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            var entity = new TblControlReportingRule();
            entity.Id = request.Id;
            entity.QccontrolName = request.QCControlName;
            entity.QccontrolType = request.QCControlType;
            entity.UndeterminedResult = request.UndeterminedResult;
            entity.LabId = labId;

            string[]? pass = request?.Pass?.Trim().Split('-');
            if (pass?.Length > 0 && pass.Length == 2 && pass[0].Length > 0 && pass[1].Length > 0)
            {
                entity.MaxPass = decimal.Parse(pass[0]);
                entity.MinPass = decimal.Parse(pass[1]);

            }
            string[]? fail = request?.Fail?.Trim().Split('-');
            if (fail?.Length > 0 && fail.Length == 2 && fail[0].Length > 0 && fail[1].Length > 0)
            {
                entity.MaxFail = decimal.Parse(fail[0]);
                entity.MinFail = decimal.Parse(fail[1]);
            }

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _dbContext.TblControlReportingRules.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {


                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;
                    entity.IsActive = getRecordForEdit.IsActive;

                    _dbContext.TblControlReportingRules.Update(entity);
                    response.Message = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.Id} in our system...";
                    response.HttpStatusCode = Status.Failed;
                    response.Status = "Failed !";
                    response.Message = "Request Failed !";
                    return response;
                }
            }
            else
            {
                entity.CreatedBy = LoggedInUser;
                entity.CreatedDate = DateTimeNow.Get;

                //entity.IsDeleted = false;
                entity.IsActive = true;

                _dbContext.TblControlReportingRules.Add(entity);
                _dbContext.SaveChanges();
                response.Message = "Record is Added...";
            }



            var existing = _dbContext.TblControlRepotingRulePanels.Where(w => w.ControlReportingRuleId == entity.Id).ToList();
            if (existing.Count() > 0)
            {
                _dbContext.RemoveRange(existing);
            }
            var secondTable = new List<TblControlRepotingRulePanel>();
            foreach (var data in request.Panels)
            {
                var rec = new TblControlRepotingRulePanel()
                {
                    ControlReportingRuleId = entity.Id,
                    PanelName = data.PanelName,
                    PanelId = data.PanelId,
                };
                secondTable.Add(rec);
            }
            _dbContext.TblControlRepotingRulePanels.AddRange(secondTable);
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }


        public async Task<DataQueryResponse<List<IDCompendiumControlReportingRuleResponse>>> GetIDCompendiumControlReportingRulesAsync(DataQueryViewModel<IDCompendiumControlReportingRulesQueryModel> query)
        {
            var response = new DataQueryResponse<List<IDCompendiumControlReportingRuleResponse>>();

            #region Source
            var tblControlReportingRules = _dbContext.TblControlReportingRules.Where(w => w.IsActive.Equals(true)).ToList();
            var tblControlRepotingRulePanels = _dbContext.TblControlRepotingRulePanels.ToList();


            var dataSource = new List<IDCompendiumControlReportingRuleResponse>();
            foreach (var data in tblControlReportingRules)
            {
                var s = new IDCompendiumControlReportingRuleResponse()
                {
                    Id = data.Id,
                    //PanelDisplayName = gpsAssignment.PanelDisplayName,
                    QCControlName = data.QccontrolName,
                    QCControlType = data.QccontrolType,
                    //Negative = compendiumReportingRules?.Negative,
                    Pass = (!string.IsNullOrEmpty(data.MaxPass?.ToString()) && !string.IsNullOrEmpty(data.MinPass?.ToString())) ? data.MaxPass?.ToString() + "-" + data.MinPass?.ToString() : "",
                    Fail = (!string.IsNullOrEmpty(data.MaxFail?.ToString()) && !string.IsNullOrEmpty(data.MinFail?.ToString())) ? data.MaxFail?.ToString() + "-" + data.MinFail?.ToString() : "",
                    UndeterminedResult = data.UndeterminedResult,
                    Panels = tblControlRepotingRulePanels.Where(w => w.ControlReportingRuleId == data.Id).Select(s => new PanelsRes() { PanelId = s.PanelId, PanelName = s.PanelName }).ToList(),
                };
                dataSource.Add(s);
            }


            #endregion

            #region Filtered
            if (!string.IsNullOrEmpty(query.QueryModel?.QCControlName))
            {
                dataSource = dataSource.Where(f => f.QCControlName != null && f.QCControlName.ToLower().Contains(query.QueryModel.QCControlName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.QCControlType))
            {
                dataSource = dataSource.Where(f => f.QCControlType != null && f.QCControlType.ToLower().Contains(query.QueryModel.QCControlType.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Pass))
            {
                dataSource = dataSource.Where(f => f.Pass != null && f.Pass.ToLower().Contains(query.QueryModel.Pass.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Fail))
            {
                dataSource = dataSource.Where(f => f.Fail != null && f.Fail.ToLower().Contains(query.QueryModel.Fail.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                dataSource = dataSource.OrderByDescending(x => x.Id).ToList();

            }
            response.TotalRecord = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }

            #endregion
            response.FilteredRecord = dataSource.Count();
            response.Result = dataSource.ToList();
            return response;
        }



        public async Task<RequestResponse> SaveIDCompendiumControlReportingRulePanels(SaveIDCompendiumControlReportingRulePanels request)
        {
            var response = new RequestResponse();


            var existing = _dbContext.TblControlRepotingRulePanels.Where(w => w.ControlReportingRuleId == request.Id).ToList();
            if (existing.Count() > 0)
            {
                _dbContext.RemoveRange(existing);
            }
            var secondTable = new List<TblControlRepotingRulePanel>();
            foreach (var data in request.Panels)
            {
                var rec = new TblControlRepotingRulePanel()
                {
                    ControlReportingRuleId = request.Id,
                    PanelName = data.PanelName,
                    PanelId = data.PanelId,
                };
                secondTable.Add(rec);
            }
            _dbContext.TblControlRepotingRulePanels.AddRange(secondTable);
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }

    }
}
