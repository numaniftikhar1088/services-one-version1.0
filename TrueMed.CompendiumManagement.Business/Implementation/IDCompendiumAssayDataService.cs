using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Validator.CompendiumManagement;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Datatable;

namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class IDCompendiumAssayDataService : IIDCompendiumAssayDataService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IMapper _mapper;
        private ApplicationDbContext _dbContext;
        public IDCompendiumAssayDataService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor, IMapper mapper, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _utilityService = utilityService;
            _mapper = mapper;
            LoggedInUser = connectionManager.UserId;
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> SaveIDCompendiumAssayDataAsync(SaveIDCompendiumAssayDataRequest request)
        {
            var response = new RequestResponse();

            var validation = new IDCompendiumAssayDataValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }

            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            //var entity = _mapper.Map<SaveIDCompendiumAssayDataRequest, TblCompendiumTest>(request);
            //var entity = _utilityService.Converstion<SaveIDCompendiumAssayDataRequest, TblCompendiumTest>(request);
            var entity = new TblCompendiumTest();
            entity.Id = request.Id;
            entity.TestName = request.TestName;
            entity.ReqTypeId = _dbContext.TblLabRequisitionTypes.FirstOrDefault(x => x.MasterRequisitionTypeId == 4)?.ReqTypeId; ;

            var entityforsecondTable = new TblCompendiumTestConfiguration();
            entityforsecondTable.TestId = request.Id;
            if (string.IsNullOrEmpty(request.TestDisplayName))
            {
                entityforsecondTable.TestDisplayName = request.TestName;
            }
            else
            {
                entityforsecondTable.TestDisplayName = request.TestDisplayName;
            }
            entityforsecondTable.ReqTypeId = _dbContext.TblLabRequisitionTypes.FirstOrDefault(x => x.MasterRequisitionTypeId == 4)?.ReqTypeId; ;
            entityforsecondTable.TestCode = request.TestCode;
            entityforsecondTable.ReferenceLabId = request.ReferenceLabId;
            if (entity.Id > 0)
            {
                var getRecordForEdit = await _dbContext.TblCompendiumTests.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {
                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;
                    entity.IsActive = getRecordForEdit.IsActive;
                    entity.IsDeleted = getRecordForEdit.IsDeleted;

                    _dbContext.TblCompendiumTests.Update(entity);

                    var getRecordForEditInChildTable = _dbContext.TblCompendiumTestConfigurations.FirstOrDefault(x => x.TestId == request.Id);
                    if (getRecordForEditInChildTable != null)
                    {
                        entityforsecondTable.UpdatedDate = DateTimeNow.Get;
                        entityforsecondTable.UpdatedBy = LoggedInUser;

                        entityforsecondTable.CreatedDate = getRecordForEditInChildTable.CreatedDate;
                        entityforsecondTable.CreatedBy = getRecordForEditInChildTable.CreatedBy;


                        entityforsecondTable.IsActive = getRecordForEditInChildTable.IsActive;
                        entityforsecondTable.IsDeleted = getRecordForEditInChildTable.IsDeleted;
                        entityforsecondTable.Id = getRecordForEditInChildTable.Id;

                        _dbContext.TblCompendiumTestConfigurations.Update(entityforsecondTable);

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

                entity.IsDeleted = false;
                entity.IsActive = true;

                await _dbContext.TblCompendiumTests.AddAsync(entity);
                await _dbContext.SaveChangesAsync();

                entityforsecondTable.CreatedBy = LoggedInUser;
                entityforsecondTable.CreatedDate = DateTimeNow.Get;
                entityforsecondTable.IsDeleted = false;
                entityforsecondTable.IsActive = true;
                entityforsecondTable.TestId = entity.Id;
                await _dbContext.TblCompendiumTestConfigurations.AddAsync(entityforsecondTable);
                response.Message = "Record is Added...";
            }

            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<DataQueryResponse<List<IDCompendiumAssayDataDetailedResponse>>> GetIDCompendiumAssayDataDetailAsync(DataQueryViewModel<IDCompendiumAssayDataQueryModel> query)
        {
            var response = new DataQueryResponse<List<IDCompendiumAssayDataDetailedResponse>>();

            #region Source
            var reqTypeId = _dbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.MasterRequisitionTypeId == 4)?.ReqTypeId;
            var compendiumTestResult = await _dbContext.TblCompendiumTests.Where(f => f.ReqTypeId == reqTypeId && f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).Select(s => new { Id = s.Id, TestName = s.TestName }).ToListAsync();
            var compendiumTestConfigurationResult = await _dbContext.TblCompendiumTestConfigurations.Where(f => f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToListAsync();

            var refLabsResult = await _dbContext.TblLabs.Select(s => new { RefLabID = s.LabId, s.DisplayName }).ToListAsync();

            var dataSource = (
                from compendiumTest in compendiumTestResult
                join compendiumTestConfiguration in compendiumTestConfigurationResult on compendiumTest.Id equals compendiumTestConfiguration.TestId
                into compendiumTestcompendiumTestConfiguration
                from compendiumTestpluscompendiumTestConfiguration in compendiumTestcompendiumTestConfiguration.DefaultIfEmpty()
                    //select new
                    //{
                    //    CompendiumTestResult = compendiumTest,
                    //    compendiumTestpluscompendiumTestConfigurationResult = compendiumTestpluscompendiumTestConfiguration
                    //}).OrderByDescending(x => x.CompendiumTestResult.Id).Select(s => new IDCompendiumAssayDataDetailedResponse()
                    //{
                    //    Id = s.CompendiumTestResult.Id,
                    //    //PanelDisplayName = gpsAssignment.PanelDisplayName,
                    //    TestName = s.CompendiumTestResult.TestName,
                    //    TestDisplayName = compendiumTestpluscompendiumTestConfiguration == null ? "NA" : compendiumTestpluscompendiumTestConfiguration.TestDisplayName,
                    //    TestCode = compendiumTestpluscompendiumTestConfiguration == null ? "NA" : compendiumTestpluscompendiumTestConfiguration.TestCode,
                    //    ReferenceLabId = compendiumTestConfiguration,
                    //    ReferenceLabName = refLabsResult.FirstOrDefault(x => x.RefLabID == s.compendiumTestpluscompendiumTestConfigurationResult.ReferenceLabId)?.DisplayName;
                    //}
                    //from compendiumTestConfiguration in compendiumTestConfigurationResult
                    //join refLabs in refLabsResult on compendiumTestConfiguration.ReferenceLabId equals refLabs.RefLabID
                    //into compendiumTestConfigurationrefLabs
                    //from compendiumTestConfigurationplusrefLabs in compendiumTestConfigurationrefLabs.DefaultIfEmpty()

                select new IDCompendiumAssayDataDetailedResponse()
                {
                    Id = compendiumTest.Id,
                    //PanelDisplayName = gpsAssignment.PanelDisplayName,
                    TestName = compendiumTest.TestName,
                    TestDisplayName = compendiumTestpluscompendiumTestConfiguration == null ? "NA" : compendiumTestpluscompendiumTestConfiguration.TestDisplayName,
                    TestCode = compendiumTestpluscompendiumTestConfiguration == null ? "NA" : compendiumTestpluscompendiumTestConfiguration.TestCode,
                    ReferenceLabId = compendiumTestpluscompendiumTestConfiguration?.ReferenceLabId,
                    ReferenceLabName = refLabsResult.FirstOrDefault(x => x?.RefLabID == compendiumTestpluscompendiumTestConfiguration?.ReferenceLabId)?.DisplayName,



                }).DistinctBy(d => d.Id).ToList();
            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                dataSource = dataSource.OrderByDescending(x => x.Id).ToList();
            }
            #endregion

            #region Filtered
            if (!string.IsNullOrEmpty(query.QueryModel?.TestName))
            {
                dataSource = dataSource.Where(f => f.TestName != null && f.TestName.ToLower().Contains(query.QueryModel.TestName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestDisplayName))
            {
                dataSource = dataSource.Where(f => f.TestDisplayName != null && f.TestDisplayName.ToLower().Contains(query.QueryModel.TestDisplayName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestCode))
            {
                dataSource = dataSource.Where(f => f.TestCode != null && f.TestCode.ToLower().Contains(query.QueryModel.TestCode.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ReferenceLabName))
            {
                dataSource = dataSource.Where(f => f.ReferenceLabName != null && f.ReferenceLabName.ToLower().Contains(query.QueryModel.ReferenceLabName.ToLower())).ToList();
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
        public async Task<RequestResponse> DeleteIDCompendiumAssayDataByIdAsync(int id)
        {
            var response = new RequestResponse();

            if (id <= 0)
            {
                response.Error = "invalid ID !";
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;

            }
            var getRecordForSoftDelete = await _dbContext.TblCompendiumTests.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _dbContext.TblCompendiumTests.Update(getRecordForSoftDelete);
                var getRecordForSoftDeleteInChildTable = _dbContext.TblCompendiumTestConfigurations.FirstOrDefault(x => x.TestId == id);
                if (getRecordForSoftDeleteInChildTable != null)
                {
                    getRecordForSoftDeleteInChildTable.DeletedDate = DateTimeNow.Get;
                    getRecordForSoftDeleteInChildTable.DeletedBy = LoggedInUser;

                    getRecordForSoftDeleteInChildTable.IsDeleted = true;

                    _dbContext.TblCompendiumTestConfigurations.Update(getRecordForSoftDeleteInChildTable);

                    response.Message = "Record Deleted...";
                }
                else
                {
                    response.Error = $"Record is not exist against ID : {id} in our system...";
                    response.HttpStatusCode = Status.Failed;
                    response.Status = "Failed !";
                    response.Message = "Request Failed !";
                    return response;
                }
                response.Message = "Record Deleted...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {id} in our system...";
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }

        public async Task<RequestResponse<List<PanelAndReportingRulesResponse>>> GetPanelsAndReportingRulesByIdAsync(int Id)
        {
            var response = new RequestResponse<List<PanelAndReportingRulesResponse>>();

            #region Source

            var compendiumPanelTestAssignmentsResult = await _dbContext.TblCompendiumPanelTestAssignments.Where(f => f.TestId == Id).Where(f => f.IsDeleted.Equals(false)).Where(f => f.IsActive.Equals(true)).ToListAsync();

            var compendiumPanelsResult = await _dbContext.TblCompendiumPanels.Where(f => f.IsDeleted.Equals(false)).Where(f => f.IsActive.Equals(true)).ToListAsync();

            //var compendiumTestReportingRulesResult = await _dbContext.TblCompenduimTestReportingRules.Where(f => f.IsDeleted.Equals(false)).Where(f => f.IsActive.Equals(true)).ToListAsync();
            var compendiumReportingRulesResult = await _dbContext.TblCompendiumReportingRules.Where(f => f.IsDeleted.Equals(false)).Where(f => f.IsActive.Equals(true)).ToListAsync();


            var dataSource1 = (
                from compendiumPanelTestAssignments in compendiumPanelTestAssignmentsResult
                    //join compendiumTestReportingRules in compendiumTestReportingRulesResult on compendiumPanelTestAssignments.TestConfigId equals compendiumTestReportingRules.TestConfigId
                    //into compendiumPanelTestAssignmentscompendiumTestReportingRules
                    //from compendiumPanelTestAssignmentspluscompendiumTestReportingRules in compendiumPanelTestAssignmentscompendiumTestReportingRules.DefaultIfEmpty()

                    //from compendiumPanelTestAssignments2 in compendiumPanelTestAssignmentsResult
                join compendiumPanels in compendiumPanelsResult on compendiumPanelTestAssignments.PanelId equals compendiumPanels.Id
                into compendiumPanelTestAssignmentscompendiumPanels
                from compendiumPanelTestAssignmentspluscompendiumPanels in compendiumPanelTestAssignmentscompendiumPanels.DefaultIfEmpty()

                    //from PanelTestAssignmentsTestReportingRules in compendiumPanelTestAssignmentscompendiumTestReportingRules
                    //join compendiumReportingRules in compendiumReportingRulesResult on compendiumPanelTestAssignments?.ReportingRuleId equals compendiumReportingRules.Id
                    //into PanelTestAssignmentsTestReportingRulescompendiumReportingRules
                    //from PanelTestAssignmentsTestReportingRulespluscompendiumReportingRules in PanelTestAssignmentsTestReportingRulescompendiumReportingRules.DefaultIfEmpty()


                select new PanelAndReportingRulesResponse()
                {
                    PanelId = compendiumPanelTestAssignments == null ? 0 : Convert.ToInt32(compendiumPanelTestAssignments.PanelId),
                    PanelName = compendiumPanelTestAssignmentspluscompendiumPanels == null ? "" : compendiumPanelTestAssignmentspluscompendiumPanels.PanelName,
                    RuleId = compendiumPanelTestAssignments == null ? 0 : Convert.ToInt32(compendiumPanelTestAssignments.ReportingRuleId),
                    RuleName = compendiumPanelTestAssignments == null ? "" : compendiumReportingRulesResult.FirstOrDefault(x => x?.Id == Convert.ToInt32(compendiumPanelTestAssignments.ReportingRuleId))?.Name,

                    //RuleName = PanelTestAssignmentsTestReportingRulespluscompendiumReportingRules == null ? "NA" : PanelTestAssignmentsTestReportingRulespluscompendiumReportingRules.Name,
                    //PanelDisplayName = gpsAssignment.PanelDisplayName,



                }).ToList();
            #endregion

            response.Data = dataSource1;
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Successfully Processed...";
            response.Status = "Success !";
            return response;
        }


        public async Task<RequestResponse<List<ReferenceLabLookup>>> referenceLabLookupAsync()
        {
            var response = new RequestResponse<List<ReferenceLabLookup>>();

            var dataSource = await _dbContext.TblLabs.Where(f => f.IsDeleted == false && f.IsActive == true)
                .Select(s => new ReferenceLabLookup()
                {
                    ReferenceLabId = s.LabId,
                    ReferenceLabName = s.DisplayName,

                }).OrderBy(o => o.ReferenceLabName).ToListAsync();

            response.Data = dataSource;
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed...";

            return response;
        }
    }
}
