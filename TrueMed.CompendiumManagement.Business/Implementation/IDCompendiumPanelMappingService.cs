using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.Transactions;
using System.Linq.Dynamic.Core;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.LookupModel;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Business.Interface;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.Validator.CompendiumManagement;
using static TrueMed.CompendiumManagement.Domain.Models.Dtos.Response.IDCompendiumPanelMappingResponse;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Datatable;
using System.Net;

namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class IDCompendiumPanelMappingService : IIDCompendiumPanelMappingService
    {
        private readonly IConnectionManager _connectionManager;

        private ApplicationDbContext _applicationDbContext;
        private MasterDbContext _masterDbContext;
        public IDCompendiumPanelMappingService(
            IConnectionManager connectionManager,
            MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;

            _applicationDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            LoggedInUser = connectionManager.UserId;
            _masterDbContext = masterDbContext;
        }
        public string LoggedInUser { get; set; }
        #region Queries
        //public DataQueryResponse<List<IDCompendiumPanelMappingResponse.GetAll>> GetAll(DataQueryModel<IDCompendiumPanelMappingQM> query)
        //{
        //    var response = new DataQueryResponse<List<IDCompendiumPanelMappingResponse.GetAll>>();

        //    var compendiumPanelsResult = _applicationDbContext.TblCompendiumPanels.Where(f => f.ReqTypeId == 29).ToList();

        //    #region Source
        //    var dataSource = (from CompendiumPanel in compendiumPanelsResult
        //                      join CompendiumGroupPanelsAssignment in _applicationDbContext.TblCompendiumGroupPanelsAssignments on CompendiumPanel.Id equals CompendiumGroupPanelsAssignment.PanelId into CompendiumPanelCompendiumGroupPanelsAssignment
        //                      from CompendiumPanelWithCompendiumGroupPanelsAssignment in CompendiumPanelCompendiumGroupPanelsAssignment.DefaultIfEmpty()
        //                      join CompendiumPanelTestAssignments in _applicationDbContext.TblCompendiumPanelTestAssignments on CompendiumPanel.Id equals CompendiumPanelTestAssignments.PanelId into CompendiumPanelCompendiumPanelTestAssignments
        //                      from CompendiumPanelWithCompendiumPanelTestAssignments in CompendiumPanelCompendiumPanelTestAssignments.DefaultIfEmpty()
        //                      join CompendiumTestConfigurations in _applicationDbContext.TblCompendiumTestConfigurations on CompendiumPanelWithCompendiumPanelTestAssignments?.TestId equals CompendiumTestConfigurations.TestId into CompendiumPanelCompendiumTestConfigurations
        //                      from CompendiumPanelWithCompendiumTestConfigurations in CompendiumPanelCompendiumTestConfigurations.DefaultIfEmpty()
        //                      join CompendiumTests in _applicationDbContext.TblCompendiumTests on CompendiumPanelWithCompendiumPanelTestAssignments?.TestId equals CompendiumTests.Id into CompendiumTestCompendiumPanelTestAssignments
        //                      from CompendiumTestWithCompendiumPanelTestAssignments in CompendiumTestCompendiumPanelTestAssignments.DefaultIfEmpty()
        //                      join CompendiumTestReportingRule in _applicationDbContext.TblCompenduimTestReportingRules on CompendiumPanelWithCompendiumPanelTestAssignments?.TestConfigId equals CompendiumTestReportingRule.TestConfigId into CompendiumTestReportingRuleTblCompenduimTestReportingRules
        //                      from CompendiumTestReportingRuleWithTblCompenduimTestReportingRules in CompendiumTestReportingRuleTblCompenduimTestReportingRules.DefaultIfEmpty()
        //                      join CompendiumPanelAssignments in _applicationDbContext.TblCompendiumPanelAssignments on CompendiumPanel?.Id equals CompendiumPanelAssignments.ParentPanelId into CompendiumPanelAssignmentsCompendiumPanel
        //                      from CompendiumPanelWithAssignmentsCompendiumPanel in CompendiumPanelAssignmentsCompendiumPanel.DefaultIfEmpty()
        //                      join CompendiumReportingRule in _applicationDbContext.TblCompendiumReportingRules on CompendiumTestReportingRuleWithTblCompenduimTestReportingRules?.ReportingRuleId equals CompendiumReportingRule.Id into CompendiumReportingRuleTblCompendiumTestReportingRules
        //                      from CompendiumReportingRuleWithTblCompendiumTestReportingRules in CompendiumReportingRuleTblCompendiumTestReportingRules.DefaultIfEmpty()
        //                      join Labs in _applicationDbContext.TblLabs on CompendiumPanelWithAssignmentsCompendiumPanel.ReferenceLabId equals Labs.LabId into LabsCompendiumPanelWithAssignmentsCompendiumPanel
        //                      from LabsWithCompendiumPanelWithAssignmentsCompendiumPanel in LabsCompendiumPanelWithAssignmentsCompendiumPanel.DefaultIfEmpty()
        //                      select new
        //                      {
        //                          CompendiumPanelResult = CompendiumPanel,
        //                          CompendiumGroupPanelsAssignmentsResult = CompendiumPanelWithCompendiumGroupPanelsAssignment,
        //                          CompendiumPanelTestAssignmentsResult = CompendiumPanelWithCompendiumPanelTestAssignments,
        //                          CompendiumTestConfigurationsResult = CompendiumPanelWithCompendiumTestConfigurations,
        //                          CompendiumTestResult = CompendiumTestWithCompendiumPanelTestAssignments,
        //                          CompendiumReportingRuleResult = CompendiumReportingRuleWithTblCompendiumTestReportingRules,
        //                          LabResult = LabsWithCompendiumPanelWithAssignmentsCompendiumPanel
        //                      }).GroupBy(s => new
        //                      {
        //                          s.CompendiumPanelResult,
        //                          s.CompendiumGroupPanelsAssignmentsResult,
        //                          s.CompendiumPanelTestAssignmentsResult,
        //                          s.CompendiumTestConfigurationsResult,
        //                          s.CompendiumReportingRuleResult,
        //                          s.LabResult
        //                      }).SelectMany(g => g.Select((item, index) => new IDCompendiumPanelMappingResponse.GetAll()
        //                      {
        //                          Id = index + 1, // Generate unique ID
        //                          PanelId = item.CompendiumPanelResult?.Id ?? 0,
        //                          PerformingLabId = item.LabResult?.LabId ?? 0,
        //                          PerformingLabName = item.LabResult?.DisplayName ?? "",
        //                          PanelName = item.CompendiumPanelResult?.PanelName ?? "",
        //                          PanelCode = item.CompendiumPanelResult?.Tmitcode ?? "",
        //                          AssayNameId = item.CompendiumTestResult?.Id ?? 0,
        //                          AssayName = item.CompendiumTestResult?.TestName ?? "",
        //                          Organism = item.CompendiumTestConfigurationsResult?.TestDisplayName ?? "",
        //                          TestCode = item.CompendiumTestConfigurationsResult?.TestCode ?? "",
        //                          ReportingRuleId = item.CompendiumReportingRuleResult?.Id ?? 0,
        //                          ReportingRuleName = item.CompendiumReportingRuleResult?.Name ?? "",
        //                          GroupNameId = item.CompendiumGroupPanelsAssignmentsResult != null ? item.CompendiumGroupPanelsAssignmentsResult.GroupId : 0,
        //                          GroupName = item.CompendiumGroupPanelsAssignmentsResult != null ? _applicationDbContext.TblCompendiumGroups.FirstOrDefault(f => f.Id == item.CompendiumGroupPanelsAssignmentsResult.GroupId)?.GroupName : "",
        //                          AntibioticClass = item.CompendiumPanelResult?.AntibioticClass ?? "",
        //                          Resistance = item.CompendiumPanelResult?.IsResistance,
        //                          ReportingRuleInfos = new List<ReportingRuleInfo>()
        //              {
        //                  new ReportingRuleInfo()
        //                  {
        //                      ReportingRuleName = item.CompendiumReportingRuleResult?.Name ?? "",
        //                      AgeRange = $"{item.CompendiumReportingRuleResult?.AgeFrom}-{item.CompendiumReportingRuleResult?.AgeTo}",
        //                      Low = $"{item.CompendiumReportingRuleResult?.MinLow}-{item.CompendiumReportingRuleResult?.MaxLow}",
        //                      Medium = $"{item.CompendiumReportingRuleResult?.MinInter}-{item.CompendiumReportingRuleResult?.MaxInter}",
        //                      High = $"{item.CompendiumReportingRuleResult?.MinHigh}-{item.CompendiumReportingRuleResult?.MaxHigh}",
        //                      AmpScore = item.CompendiumReportingRuleResult?.AmpScore ?? 0,
        //                      CqConf = item.CompendiumReportingRuleResult?.CqConf ?? 0,
        //                  }
        //              }
        //                      }));
        //    dataSource = dataSource.OrderByDescending(d => d.Id).ToList();
        //    #region Filtered
        //    if (query.QueryModel?.PerformingLabId > 0)
        //    {
        //        dataSource = dataSource.Where(f => f.PerformingLabId != null && f.PerformingLabId == query.QueryModel.PerformingLabId).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.PerformingLabName))
        //    {
        //        dataSource = dataSource.Where(f => f.PerformingLabName != null && f.PerformingLabName.ToLower().Contains(query.QueryModel.PerformingLabName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.PanelName))
        //    {
        //        dataSource = dataSource.Where(f => f.PanelName != null && f.PanelName.ToLower().Contains(query.QueryModel.PanelName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.PanelCode))
        //    {
        //        dataSource = dataSource.Where(f => f.PanelCode != null && f.PanelCode.ToLower().Contains(query.QueryModel.PanelCode.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.AssayName))
        //    {
        //        dataSource = dataSource.Where(f => f.AssayName != null && f.AssayName.ToLower().Contains(query.QueryModel.AssayName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.Organism))
        //    {
        //        dataSource = dataSource.Where(f => f.Organism != null && f.Organism.ToLower().Contains(query.QueryModel.Organism.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.TestCode))
        //    {
        //        dataSource = dataSource.Where(f => f.TestCode != null && f.TestCode.ToLower().Contains(query.QueryModel.TestCode.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.ReportingRuleName))
        //    {
        //        dataSource = dataSource.Where(f => f.ReportingRuleName != null && f.ReportingRuleName.ToLower().Contains(query.QueryModel.ReportingRuleName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.GroupName))
        //    {
        //        dataSource = dataSource.Where(f => f.GroupName != null && f.GroupName.ToLower().Contains(query.QueryModel.GroupName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.AntibioticClass))
        //    {
        //        dataSource = dataSource.Where(f => f.AntibioticClass != null && f.AntibioticClass.ToLower().Contains(query.QueryModel.AntibioticClass.ToLower())).ToList();
        //    }
        //    if (query.QueryModel?.Resistance != null)
        //    {
        //        dataSource = dataSource.Where(f => f.Resistance.Equals(query.QueryModel.Resistance)).ToList();
        //    }
        //    response.TotalRecord = dataSource.Count();
        //    if (query.PageNumber > 0 && query.PageSize > 0)
        //    {
        //        dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
        //    }

        //    #endregion
        //    //dataSource = dataSource.DistinctBy(d => d.Id).OrderByDescending(d => d.Id).ToList();

        //    #endregion
        //    response.Result = dataSource.ToList();
        //    return response;
        //}


        public DataQueryResponse<List<GetAll>> GetAll(DataQueryViewModel<IDCompendiumPanelMappingQM> query)
        {
            var response = new DataQueryResponse<List<GetAll>>();
            var reqTypeId = _applicationDbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.MasterRequisitionTypeId == 4)?.ReqTypeId;
            var compendiumPanelsResult = _applicationDbContext.TblCompendiumPanels.Where(f => f.ReqTypeId == reqTypeId).ToList();
            var tblCompendiumGroupPanelsAssignments = _applicationDbContext.TblCompendiumGroupPanelsAssignments.ToList();
            var tblCompendiumPanelTestAssignments = _applicationDbContext.TblCompendiumPanelTestAssignments.ToList();
            var tblCompendiumTestConfigurations = _applicationDbContext.TblCompendiumTestConfigurations.ToList();
            var tblCompendiumTests = _applicationDbContext.TblCompendiumTests.ToList();
            var tblCompendiumPanelAssignments = _applicationDbContext.TblCompendiumPanelAssignments.ToList();
            var tblCompendiumReportingRules = _applicationDbContext.TblCompendiumReportingRules.ToList();
            var tblLabs = _applicationDbContext.TblLabs.ToList();
            var tblCompenduimGroups = _applicationDbContext.TblCompendiumGroups.ToList();

            var dataSource1 = (from CompendiumPanel in compendiumPanelsResult
                               join CompendiumGroupPanelsAssignment in tblCompendiumGroupPanelsAssignments on CompendiumPanel?.Id equals CompendiumGroupPanelsAssignment?.PanelId into CompendiumPanelCompendiumGroupPanelsAssignment
                               from CompendiumPanelWithCompendiumGroupPanelsAssignment in CompendiumPanelCompendiumGroupPanelsAssignment.DefaultIfEmpty()
                               join CompendiumPanelTestAssignments in tblCompendiumPanelTestAssignments on CompendiumPanel?.Id equals CompendiumPanelTestAssignments?.PanelId into CompendiumPanelCompendiumPanelTestAssignments
                               from CompendiumPanelWithCompendiumPanelTestAssignments in CompendiumPanelCompendiumPanelTestAssignments.DefaultIfEmpty()
                               join CompendiumTestConfigurations in tblCompendiumTestConfigurations on CompendiumPanelWithCompendiumPanelTestAssignments?.TestId equals CompendiumTestConfigurations?.TestId into CompendiumPanelCompendiumTestConfigurations
                               from CompendiumPanelWithCompendiumTestConfigurations in CompendiumPanelCompendiumTestConfigurations.DefaultIfEmpty()
                               join CompendiumTests in tblCompendiumTests on CompendiumPanelWithCompendiumPanelTestAssignments?.TestId equals CompendiumTests?.Id into CompendiumTestCompendiumPanelTestAssignments
                               from CompendiumTestWithCompendiumPanelTestAssignments in CompendiumTestCompendiumPanelTestAssignments.DefaultIfEmpty()


                                   //join CompendiumTestReportingRule in _applicationDbContext.TblCompenduimTestReportingRules on CompendiumPanelWithCompendiumPanelTestAssignments?.TestConfigId equals CompendiumTestReportingRule.TestConfigId into CompendiumTestReportingRuleTblCompenduimTestReportingRules
                                   //from CompendiumTestReportingRuleWithTblCompenduimTestReportingRules in CompendiumTestReportingRuleTblCompenduimTestReportingRules.DefaultIfEmpty()
                               join CompendiumPanelAssignments in tblCompendiumPanelAssignments on CompendiumPanel?.Id equals CompendiumPanelAssignments?.ParentPanelId into CompendiumPanelAssignmentsCompendiumPanel
                               from CompendiumPanelWithAssignmentsCompendiumPanel in CompendiumPanelAssignmentsCompendiumPanel.DefaultIfEmpty()
                               join CompendiumReportingRule in tblCompendiumReportingRules on CompendiumPanelWithCompendiumPanelTestAssignments?.ReportingRuleId equals CompendiumReportingRule?.Id into CompendiumReportingRuleTblCompendiumTestReportingRules
                               from CompendiumReportingRuleWithTblCompendiumTestReportingRules in CompendiumReportingRuleTblCompendiumTestReportingRules.DefaultIfEmpty()
                               join Labs in tblLabs on CompendiumPanelWithAssignmentsCompendiumPanel?.ReferenceLabId equals Labs?.LabId into LabsCompendiumPanelWithAssignmentsCompendiumPanel
                               from LabsWithCompendiumPanelWithAssignmentsCompendiumPanel in LabsCompendiumPanelWithAssignmentsCompendiumPanel.DefaultIfEmpty()
                               select new
                               {
                                   CompendiumPanelResult = CompendiumPanel,
                                   CompendiumGroupPanelsAssignmentsResult = CompendiumPanelWithCompendiumGroupPanelsAssignment,
                                   CompendiumPanelTestAssignmentsResult = CompendiumPanelWithCompendiumPanelTestAssignments,
                                   CompendiumTestConfigurationsResult = CompendiumPanelWithCompendiumTestConfigurations,
                                   CompendiumTestResult = CompendiumTestWithCompendiumPanelTestAssignments,
                                   CompendiumReportingRuleResult = CompendiumReportingRuleWithTblCompendiumTestReportingRules,
                                   LabResult = LabsWithCompendiumPanelWithAssignmentsCompendiumPanel
                               })
                              .Select((item, index) => new IDCompendiumPanelMappingResponse.GetAll()
                              {
                                  Id = index + 1, // Generate unique ID
                                  PanelId = item.CompendiumPanelResult?.Id ?? 0,
                                  PerformingLabId = item.LabResult?.LabId ?? 0,
                                  PerformingLabName = item.LabResult?.DisplayName ?? "",
                                  PanelName = item.CompendiumPanelResult?.PanelName ?? "",
                                  PanelCode = item.CompendiumPanelResult?.Tmitcode ?? "",
                                  AssayNameId = item.CompendiumTestResult?.Id ?? 0,
                                  AssayName = item.CompendiumTestResult?.TestName ?? "",
                                  Organism = item.CompendiumTestConfigurationsResult?.TestDisplayName ?? "",
                                  TestCode = item.CompendiumTestConfigurationsResult?.TestCode ?? "",
                                  ReportingRuleId = item.CompendiumReportingRuleResult?.Id ?? 0,
                                  ReportingRuleName = item.CompendiumReportingRuleResult?.Name ?? "",
                                  GroupNameId = item.CompendiumGroupPanelsAssignmentsResult != null ? item.CompendiumGroupPanelsAssignmentsResult?.GroupId : 0,
                                  GroupName = item.CompendiumGroupPanelsAssignmentsResult?.GroupId != null ? tblCompenduimGroups.FirstOrDefault(f => f.Id == item.CompendiumGroupPanelsAssignmentsResult?.GroupId)?.GroupName : "",
                                  AntibioticClass = item.CompendiumPanelTestAssignmentsResult?.AntibioticClass ?? "",
                                  Resistance = item.CompendiumPanelTestAssignmentsResult?.IsResistance,
                                  NumberOfDetected = item.CompendiumPanelTestAssignmentsResult?.NumberOfDetected,
                                  NumberOfRepeated = item.CompendiumPanelTestAssignmentsResult?.NumberOfRepeated,
                                  ReportingRuleInfos = new List<ReportingRuleInfo>()
                                  {
                                         new ReportingRuleInfo()
                                         {
                                             ReportingRuleName = item.CompendiumReportingRuleResult?.Name ?? "",
                                             AgeRange = $"{item.CompendiumReportingRuleResult?.AgeFrom}-{item.CompendiumReportingRuleResult?.AgeTo}",
                                             Low = $"{item.CompendiumReportingRuleResult?.MinLow}-{item.CompendiumReportingRuleResult?.MaxLow}",
                                             Medium = $"{item.CompendiumReportingRuleResult?.MinInter}-{item.CompendiumReportingRuleResult?.MaxInter}",
                                             High = $"{item.CompendiumReportingRuleResult?.MinHigh}-{item.CompendiumReportingRuleResult?.MaxHigh}",
                                             AmpScore = item.CompendiumReportingRuleResult?.AmpScore ?? 0,
                                             CqConf = item.CompendiumReportingRuleResult?.CqConf ?? 0,
                                         }
                                  }
                              }).Distinct().ToList();
            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource1 = dataSource1.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                dataSource1 = dataSource1.OrderByDescending(x => x.Id).ToList();

            }
            //AsQueryable().ToList();
            var dataSource = dataSource1
       .GroupBy(item => new
       {
           PanelId = item?.PanelId ?? 0, // Use 0 as a default value if PanelId is null
           PerformingLabId = item?.PerformingLabId ?? 0, // Use 0 as a default value if PerformingLabId is null
           PanelName = item?.PanelName ?? "", // Use an empty string as a default value if PanelName is null
           PanelCode = item?.PanelCode ?? "", // Use an empty string as a default value if PanelCode is null
           AssayNameId = item?.AssayNameId ?? 0, // Use 0 as a default value if AssayNameId is null
           AssayName = item?.AssayName ?? "", // Use an empty string as a default value if AssayName is null
           Organism = item?.Organism ?? "", // Use an empty string as a default value if Organism is null
           TestCode = item?.TestCode ?? "", // Use an empty string as a default value if TestCode is null
           ReportingRuleId = item?.ReportingRuleId ?? 0, // Use 0 as a default value if ReportingRuleId is null
           GroupNameId = item?.GroupNameId ?? 0, // Use 0 as a default value if GroupNameId is null
           AntibioticClass = item?.AntibioticClass ?? "", // Use an empty string as a default value if AntibioticClass is null
           Resistance = item?.Resistance ?? false // Use false as a default value if Resistance is null

       })
       .Select(group => group.First())
       .ToList();

            if (query.QueryModel?.PerformingLabId > 0)
            {
                dataSource = dataSource.Where(f => f.PerformingLabId != null && f.PerformingLabId == query.QueryModel.PerformingLabId).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.PerformingLabName))
            {
                dataSource = dataSource.Where(f => f.PerformingLabName != null && f.PerformingLabName.ToLower().Contains(query.QueryModel.PerformingLabName.ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.PanelName))
            {
                dataSource = dataSource.Where(f => f.PanelName != null && f.PanelName.ToLower().Contains(query.QueryModel.PanelName.ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.PanelCode))
            {
                dataSource = dataSource.Where(f => f.PanelCode != null && f.PanelCode.ToLower().Contains(query.QueryModel.PanelCode.ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.AssayName))
            {
                dataSource = dataSource.Where(f => f.AssayName != null && f.AssayName.ToLower().Contains(query.QueryModel.AssayName.ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.Organism))
            {
                dataSource = dataSource.Where(f => f.Organism != null && f.Organism.ToLower().Contains(query.QueryModel.Organism.ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.TestCode))
            {
                dataSource = dataSource.Where(f => f.TestCode != null && f.TestCode.ToLower().Contains(query.QueryModel.TestCode.ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.ReportingRuleName))
            {
                dataSource = dataSource.Where(f => f.ReportingRuleName != null && f.ReportingRuleName.ToLower().Contains(query.QueryModel.ReportingRuleName.ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.GroupName))
            {
                dataSource = dataSource.Where(f => f.GroupName != null && f.GroupName.ToLower().Contains(query.QueryModel.GroupName.ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.AntibioticClass))
            {
                dataSource = dataSource.Where(f => f.AntibioticClass != null && f.AntibioticClass.ToLower().Contains(query.QueryModel.AntibioticClass.ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.Resistance))
            {
                if (query.QueryModel.Resistance.Trim().ToLower() == "yes")
                {
                    dataSource = dataSource.Where(f => f.Resistance.Equals(true)).ToList();
                }
                if (query.QueryModel.Resistance.Trim().ToLower() == "no")
                {
                    dataSource = dataSource.Where(f => f.Resistance.Equals(false)).ToList();
                }
            }
            //if (query.QueryModel?.Resistance != null)
            //{
            //    dataSource = dataSource.Where(f => f.Resistance.Equals(query.QueryModel.Resistance)).ToList();
            //}

            response.TotalRecord = dataSource.Count();

            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }

            response.Result = dataSource.ToList();
            return response;
        }



        //public DataQueryResponse<List<IDCompendiumPanelMappingResponse.GetAll>> GetAll(DataQueryModel<IDCompendiumPanelMappingQM> query)
        //{
        //    var response = new DataQueryResponse<List<IDCompendiumPanelMappingResponse.GetAll>>();

        //    var compendiumPanelsResult = _applicationDbContext.TblCompendiumPanels.Where(f => f.ReqTypeId == 29).ToList();

        //    var dataSource = (from CompendiumPanel in compendiumPanelsResult
        //                      join CompendiumGroupPanelsAssignment in _applicationDbContext.TblCompendiumGroupPanelsAssignments on CompendiumPanel.Id equals CompendiumGroupPanelsAssignment.PanelId into CompendiumPanelCompendiumGroupPanelsAssignment
        //                      from CompendiumPanelWithCompendiumGroupPanelsAssignment in CompendiumPanelCompendiumGroupPanelsAssignment.DefaultIfEmpty()
        //                      join CompendiumPanelTestAssignments in _applicationDbContext.TblCompendiumPanelTestAssignments on CompendiumPanel.Id equals CompendiumPanelTestAssignments.PanelId into CompendiumPanelCompendiumPanelTestAssignments
        //                      from CompendiumPanelWithCompendiumPanelTestAssignments in CompendiumPanelCompendiumPanelTestAssignments.DefaultIfEmpty()
        //                      join CompendiumTestConfigurations in _applicationDbContext.TblCompendiumTestConfigurations on CompendiumPanelWithCompendiumPanelTestAssignments?.TestId equals CompendiumTestConfigurations.TestId into CompendiumPanelCompendiumTestConfigurations
        //                      from CompendiumPanelWithCompendiumTestConfigurations in CompendiumPanelCompendiumTestConfigurations.DefaultIfEmpty()
        //                      join CompendiumTests in _applicationDbContext.TblCompendiumTests on CompendiumPanelWithCompendiumPanelTestAssignments?.TestId equals CompendiumTests.Id into CompendiumTestCompendiumPanelTestAssignments
        //                      from CompendiumTestWithCompendiumPanelTestAssignments in CompendiumTestCompendiumPanelTestAssignments.DefaultIfEmpty()
        //                      join CompendiumTestReportingRule in _applicationDbContext.TblCompenduimTestReportingRules on CompendiumPanelWithCompendiumPanelTestAssignments?.TestConfigId equals CompendiumTestReportingRule.TestConfigId into CompendiumTestReportingRuleTblCompenduimTestReportingRules
        //                      from CompendiumTestReportingRuleWithTblCompenduimTestReportingRules in CompendiumTestReportingRuleTblCompenduimTestReportingRules.DefaultIfEmpty()
        //                      join CompendiumPanelAssignments in _applicationDbContext.TblCompendiumPanelAssignments on CompendiumPanel?.Id equals CompendiumPanelAssignments.ParentPanelId into CompendiumPanelAssignmentsCompendiumPanel
        //                      from CompendiumPanelWithAssignmentsCompendiumPanel in CompendiumPanelAssignmentsCompendiumPanel.DefaultIfEmpty()
        //                      join CompendiumReportingRule in _applicationDbContext.TblCompendiumReportingRules on CompendiumTestReportingRuleWithTblCompenduimTestReportingRules?.ReportingRuleId equals CompendiumReportingRule.Id into CompendiumReportingRuleTblCompendiumTestReportingRules
        //                      from CompendiumReportingRuleWithTblCompendiumTestReportingRules in CompendiumReportingRuleTblCompendiumTestReportingRules.DefaultIfEmpty()
        //                      join Labs in _applicationDbContext.TblLabs on CompendiumPanelWithAssignmentsCompendiumPanel.ReferenceLabId equals Labs.LabId into LabsCompendiumPanelWithAssignmentsCompendiumPanel
        //                      from LabsWithCompendiumPanelWithAssignmentsCompendiumPanel in LabsCompendiumPanelWithAssignmentsCompendiumPanel.DefaultIfEmpty()
        //                      select new
        //                      {
        //                          CompendiumPanelResult = CompendiumPanel,
        //                          CompendiumGroupPanelsAssignmentsResult = CompendiumPanelWithCompendiumGroupPanelsAssignment,
        //                          CompendiumPanelTestAssignmentsResult = CompendiumPanelWithCompendiumPanelTestAssignments,
        //                          CompendiumTestConfigurationsResult = CompendiumPanelWithCompendiumTestConfigurations,
        //                          CompendiumTestResult = CompendiumTestWithCompendiumPanelTestAssignments,
        //                          CompendiumReportingRuleResult = CompendiumReportingRuleWithTblCompendiumTestReportingRules,
        //                          LabResult = LabsWithCompendiumPanelWithAssignmentsCompendiumPanel
        //                      }).GroupBy(s => new
        //                      {
        //                          s.CompendiumPanelResult,
        //                          s.CompendiumGroupPanelsAssignmentsResult,
        //                          s.CompendiumPanelTestAssignmentsResult,
        //                          s.CompendiumTestConfigurationsResult,
        //                          s.CompendiumTestResult,
        //                          s.CompendiumReportingRuleResult,
        //                          s.LabResult
        //                      }).SelectMany(g => g.Select((item, index) => new IDCompendiumPanelMappingResponse.GetAll()
        //                      {
        //                          Id = item.CompendiumPanelResult?.Id ?? 0,
        //                          UniqueId = index + 1, // Generate unique ID
        //                          PerformingLabId = item.LabResult?.LabId ?? 0,
        //                          PerformingLabName = item.LabResult?.DisplayName ?? "",
        //                          PanelName = item.CompendiumPanelResult?.PanelName ?? "",
        //                          PanelCode = item.CompendiumPanelResult?.Tmitcode ?? "",
        //                          AssayNameId = item.CompendiumTestResult?.Id ?? 0,
        //                          AssayName = item.CompendiumTestResult?.TestName ?? "",
        //                          Organism = item.CompendiumTestConfigurationsResult?.TestDisplayName ?? "",
        //                          TestCode = item.CompendiumTestConfigurationsResult?.TestCode ?? "",
        //                          ReportingRuleId = item.CompendiumReportingRuleResult?.Id ?? 0,
        //                          ReportingRuleName = item.CompendiumReportingRuleResult?.Name ?? "",
        //                          GroupNameId = item.CompendiumGroupPanelsAssignmentsResult != null ? item.CompendiumGroupPanelsAssignmentsResult.GroupId : 0,
        //                          GroupName = item.CompendiumGroupPanelsAssignmentsResult != null ? _applicationDbContext.TblCompendiumGroups.FirstOrDefault(f => f.Id == item.CompendiumGroupPanelsAssignmentsResult.GroupId)?.GroupName : "",
        //                          AntibioticClass = item.CompendiumPanelResult?.AntibioticClass ?? "",
        //                          Resistance = item.CompendiumPanelResult?.IsResistance,
        //                          ReportingRuleInfos = new List<ReportingRuleInfo>()
        //              {
        //                  new ReportingRuleInfo()
        //                  {
        //                      ReportingRuleName = item.CompendiumReportingRuleResult?.Name ?? "",
        //                      AgeRange = $"{item.CompendiumReportingRuleResult?.AgeFrom}-{item.CompendiumReportingRuleResult?.AgeTo}",
        //                      Low = $"{item.CompendiumReportingRuleResult?.MinLow}-{item.CompendiumReportingRuleResult?.MaxLow}",
        //                      Medium = $"{item.CompendiumReportingRuleResult?.MinInter}-{item.CompendiumReportingRuleResult?.MaxInter}",
        //                      High = $"{item.CompendiumReportingRuleResult?.MinHigh}-{item.CompendiumReportingRuleResult?.MaxHigh}",
        //                      AmpScore = item.CompendiumReportingRuleResult?.AmpScore ?? 0,
        //                      CqConf = item.CompendiumReportingRuleResult?.CqConf ?? 0,
        //                  }
        //              }
        //                      })).ToList();

        //    dataSource = dataSource.DistinctBy(d => new { d.Id, d.UniqueId }).OrderByDescending(d => d.Id).ToList();


        //    #region Filtered
        //    if (query.QueryModel?.PerformingLabId > 0)
        //    {
        //        dataSource = dataSource.Where(f => f.PerformingLabId == query.QueryModel.PerformingLabId).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.PerformingLabName))
        //    {
        //        dataSource = dataSource.Where(f => f.PerformingLabName != null && f.PerformingLabName.ToLower().Contains(query.QueryModel.PerformingLabName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.PanelName))
        //    {
        //        dataSource = dataSource.Where(f => f.PanelName != null && f.PanelName.ToLower().Contains(query.QueryModel.PanelName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.PanelCode))
        //    {
        //        dataSource = dataSource.Where(f => f.PanelCode != null && f.PanelCode.ToLower().Contains(query.QueryModel.PanelCode.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.AssayName))
        //    {
        //        dataSource = dataSource.Where(f => f.AssayName != null && f.AssayName.ToLower().Contains(query.QueryModel.AssayName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.Organism))
        //    {
        //        dataSource = dataSource.Where(f => f.Organism != null && f.Organism.ToLower().Contains(query.QueryModel.Organism.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.TestCode))
        //    {
        //        dataSource = dataSource.Where(f => f.TestCode != null && f.TestCode.ToLower().Contains(query.QueryModel.TestCode.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.ReportingRuleName))
        //    {
        //        dataSource = dataSource.Where(f => f.ReportingRuleName != null && f.ReportingRuleName.ToLower().Contains(query.QueryModel.ReportingRuleName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.GroupName))
        //    {
        //        dataSource = dataSource.Where(f => f.GroupName != null && f.GroupName.ToLower().Contains(query.QueryModel.GroupName.ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.AntibioticClass))
        //    {
        //        dataSource = dataSource.Where(f => f.AntibioticClass != null && f.AntibioticClass.ToLower().Contains(query.QueryModel.AntibioticClass.ToLower())).ToList();
        //    }
        //    if (query.QueryModel?.Resistance != null)
        //    {
        //        dataSource = dataSource.Where(f => f.Resistance == query.QueryModel.Resistance).ToList();
        //    }
        //    response.TotalRecord = dataSource.Count();
        //    if (query.PageNumber > 0 && query.PageSize > 0)
        //    {
        //        dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
        //    }
        //    #endregion

        //    response.Result = dataSource;
        //    return response;
        //}


        public async Task<RequestResponse<List<ReportingRuleInfo>>> GetById(int id)
        {
            var res = GetAll(new()).Result.FirstOrDefault(s => s.Id == id).ReportingRuleInfos;

            var response = new RequestResponse<List<ReportingRuleInfo>>();

            response.Data = res;
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed...";
            return response;
        }
        #endregion

        public async Task<RequestResponse> SavePanelMapping(SaveIDCompendiumPanelMappingRequest request)
        {
            var response = new RequestResponse();

            var validation = new IDCompendiumPanelMappingValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
                response.HttpStatusCode = Status.Failed;
                response.Status = "Validation Failed !";
                response.Message = "Request Failed !";
                return response;
            }

            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var CompendiumPanelentity = new TblCompendiumPanel();
            var CompendiumPanelAssignmententity = new TblCompendiumPanelAssignment();
            var CompendiumGroupPanelsAssignment = new TblCompendiumGroupPanelsAssignment();
            var CompendiumPanelTestAssignmententity = new TblCompendiumPanelTestAssignment();
            var CompenduimTestReportingRuleentity = new TblCompenduimTestReportingRule();

            //entity.Id = request.Id;
            CompendiumPanelentity.PanelName = request.PanelName;
            CompendiumPanelentity.ReqTypeId = _applicationDbContext.TblLabRequisitionTypes.FirstOrDefault(x => x.MasterRequisitionTypeId == 4)?.ReqTypeId;

            CompendiumPanelentity.Tmitcode = request.PanelCode;

            //CompendiumPanelAssignmententity.ParentPanelId
            CompendiumPanelAssignmententity.PanelDisplayName = request.PanelName;
            CompendiumPanelAssignmententity.ReferenceLabId = request.PerformingLabId;
            CompendiumPanelAssignmententity.RequsitionDispalyType = "ID";

            //CompendiumGroupPanelsAssignment.PanelId
            CompendiumGroupPanelsAssignment.GroupId = request.GroupNameId;
            CompendiumGroupPanelsAssignment.PanelDisplayName = request.PanelName;

            CompendiumPanelTestAssignmententity.TestConfigId = _applicationDbContext.TblCompendiumTestConfigurations.FirstOrDefault(x => x.TestId == request.AssayNameId && x.ReferenceLabId == request.PerformingLabId && x.ReqTypeId == CompendiumPanelentity.ReqTypeId)?.Id;
            //CompendiumPanelTestAssignmententity.PanelId =;
            CompendiumPanelTestAssignmententity.IsResistance = request.Resistance;
            CompendiumPanelTestAssignmententity.AntibioticClass = request.AntibioticClass;
            CompendiumPanelTestAssignmententity.ReportingRuleId = request.ReportingRuleId;
            CompendiumPanelTestAssignmententity.NumberOfDetected = request.NumberOfDetected;
            CompendiumPanelTestAssignmententity.NumberOfRepeated = request.NumberOfRepeated;
            CompendiumPanelTestAssignmententity.TestId = request.AssayNameId;
            if (request.NumberOfRepeated == null)
            {
                CompendiumPanelTestAssignmententity.NumberOfRepeated = 1;

            }
            if (request.NumberOfDetected == null)
            {
                CompendiumPanelTestAssignmententity.NumberOfDetected = 1;

            }


            CompenduimTestReportingRuleentity.TestConfigId = CompendiumPanelTestAssignmententity.TestConfigId;
            CompenduimTestReportingRuleentity.ReportingRuleId = request.ReportingRuleId;

            if (request.Id > 0)
            {
                var getRecordForEdit = await _applicationDbContext.TblCompendiumPanels.FindAsync(request.PanelId);
                if (getRecordForEdit != null)
                {
                    CompendiumPanelentity.UpdatedDate = DateTimeNow.Get;
                    CompendiumPanelentity.UpdatedBy = LoggedInUser;

                    CompendiumPanelentity.CreatedDate = getRecordForEdit.CreatedDate;
                    CompendiumPanelentity.CreatedBy = getRecordForEdit.CreatedBy;
                    CompendiumPanelentity.IsActive = getRecordForEdit.IsActive;
                    CompendiumPanelentity.IsDeleted = getRecordForEdit.IsDeleted;
                    CompendiumPanelentity.Id = request.PanelId;
                    _applicationDbContext.TblCompendiumPanels.Update(CompendiumPanelentity);

                    var getRecordForEdit2 = _applicationDbContext.TblCompendiumPanelAssignments.FirstOrDefault(x => x.ParentPanelId == request.PanelId);
                    if (getRecordForEdit2 != null)
                    {
                        CompendiumPanelAssignmententity.UpdatedDate = DateTimeNow.Get;
                        CompendiumPanelAssignmententity.UpdatedBy = LoggedInUser;

                        CompendiumPanelAssignmententity.CreatedDate = getRecordForEdit2.CreatedDate;
                        CompendiumPanelAssignmententity.CreatedBy = getRecordForEdit2.CreatedBy;

                        CompendiumPanelAssignmententity.IsActive = getRecordForEdit2.IsActive;
                        CompendiumPanelAssignmententity.IsDeleted = getRecordForEdit2.IsDeleted;
                        CompendiumPanelAssignmententity.ParentPanelId = getRecordForEdit2.ParentPanelId;
                        CompendiumPanelAssignmententity.Id = getRecordForEdit2.Id;

                        _applicationDbContext.TblCompendiumPanelAssignments.Update(CompendiumPanelAssignmententity);
                        response.Message = "Record is Updated...";

                    }
                    var getRecordForEditCompendiumGroupPanelsAssignment = _applicationDbContext.TblCompendiumGroupPanelsAssignments.FirstOrDefault(x => x.PanelId == request.PanelId);
                    if (getRecordForEditCompendiumGroupPanelsAssignment != null)
                    {
                        CompendiumGroupPanelsAssignment.UpdatedDate = DateTimeNow.Get;
                        CompendiumGroupPanelsAssignment.UpdatedBy = LoggedInUser;
                        CompendiumGroupPanelsAssignment.CreatedDate = getRecordForEditCompendiumGroupPanelsAssignment.CreatedDate;
                        CompendiumGroupPanelsAssignment.CreatedBy = getRecordForEditCompendiumGroupPanelsAssignment.CreatedBy;
                        CompendiumGroupPanelsAssignment.IsActive = getRecordForEditCompendiumGroupPanelsAssignment.IsActive;
                        CompendiumGroupPanelsAssignment.IsDeleted = getRecordForEditCompendiumGroupPanelsAssignment.IsDeleted;
                        CompendiumGroupPanelsAssignment.PanelId = getRecordForEditCompendiumGroupPanelsAssignment.PanelId;
                        CompendiumGroupPanelsAssignment.Id = getRecordForEditCompendiumGroupPanelsAssignment.Id;

                        _applicationDbContext.TblCompendiumGroupPanelsAssignments.Update(CompendiumGroupPanelsAssignment);
                    }

                    var getRecordForEditCompendiumPanelTestAssignmententity = _applicationDbContext.TblCompendiumPanelTestAssignments.FirstOrDefault(x => x.TestId == request.AssayNameId && x.PanelId == request.PanelId);
                    if (getRecordForEditCompendiumPanelTestAssignmententity != null)
                    {
                        CompendiumPanelTestAssignmententity.UpdatedDate = DateTimeNow.Get;
                        CompendiumPanelTestAssignmententity.UpdatedBy = LoggedInUser;
                        CompendiumPanelTestAssignmententity.CreatedDate = getRecordForEditCompendiumPanelTestAssignmententity.CreatedDate;
                        CompendiumPanelTestAssignmententity.CreatedBy = getRecordForEditCompendiumPanelTestAssignmententity.CreatedBy;
                        CompendiumPanelTestAssignmententity.IsActive = getRecordForEditCompendiumPanelTestAssignmententity.IsActive;
                        CompendiumPanelTestAssignmententity.IsDeleted = getRecordForEditCompendiumPanelTestAssignmententity.IsDeleted;
                        CompendiumPanelTestAssignmententity.PanelId = getRecordForEditCompendiumPanelTestAssignmententity.PanelId;
                        CompendiumPanelTestAssignmententity.Id = getRecordForEditCompendiumPanelTestAssignmententity.Id;

                        _applicationDbContext.TblCompendiumPanelTestAssignments.Update(CompendiumPanelTestAssignmententity);
                    }

                    var getRecordForEditCompenduimTestReportingRuleentity = _applicationDbContext.TblCompenduimTestReportingRules.FirstOrDefault(x => x.ReportingRuleId == request.ReportingRuleId);
                    if (getRecordForEditCompenduimTestReportingRuleentity != null)
                    {
                        CompenduimTestReportingRuleentity.UpdatedDate = DateTimeNow.Get;
                        CompenduimTestReportingRuleentity.UpdatedBy = LoggedInUser;
                        CompenduimTestReportingRuleentity.CreatedDate = getRecordForEditCompenduimTestReportingRuleentity.CreatedDate;
                        CompenduimTestReportingRuleentity.CreatedBy = getRecordForEditCompenduimTestReportingRuleentity.CreatedBy;
                        CompenduimTestReportingRuleentity.IsActive = getRecordForEditCompenduimTestReportingRuleentity.IsActive;
                        CompenduimTestReportingRuleentity.IsDeleted = getRecordForEditCompenduimTestReportingRuleentity.IsDeleted;
                        CompenduimTestReportingRuleentity.Id = getRecordForEditCompenduimTestReportingRuleentity.Id;
                        //getRecordForEditCompenduimTestReportingRuleentity.PanelId = getRecordForEditCompenduimTestReportingRuleentity.PanelId;

                        _applicationDbContext.TblCompenduimTestReportingRules.Update(CompenduimTestReportingRuleentity);
                    }

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {CompendiumPanelentity.Id} in our system...";
                    response.HttpStatusCode = Status.Failed;
                    response.Status = "Failed !";
                    response.Message = "Request Failed !";
                    return response;
                }
            }
            else
            {
                CompendiumPanelentity.CreatedBy = LoggedInUser;
                CompendiumPanelentity.CreatedDate = DateTimeNow.Get;
                CompendiumPanelentity.IsDeleted = false;
                CompendiumPanelentity.IsActive = true;

                var isPanelNameExist = _applicationDbContext.TblCompendiumPanels.FirstOrDefault(a => a.PanelName.ToLower().Trim() == CompendiumPanelentity.PanelName.ToLower().Trim());
                if (isPanelNameExist != null)
                {
                    CompendiumPanelentity = isPanelNameExist;
                }
                else
                {
                    await _applicationDbContext.TblCompendiumPanels.AddAsync(CompendiumPanelentity);
                    await _applicationDbContext.SaveChangesAsync();
                }

                CompendiumPanelAssignmententity.CreatedBy = LoggedInUser;
                CompendiumPanelAssignmententity.CreatedDate = DateTimeNow.Get;
                CompendiumPanelAssignmententity.IsDeleted = false;
                CompendiumPanelAssignmententity.IsActive = true;
                CompendiumPanelAssignmententity.ParentPanelId = CompendiumPanelentity.Id;

                var isPerformingLabExistAgainstPanel = _applicationDbContext.TblCompendiumPanelAssignments.FirstOrDefault(a => a.ParentPanelId == CompendiumPanelentity.Id && a.ReferenceLabId == request.PerformingLabId);
                if (isPerformingLabExistAgainstPanel != null)
                {
                    CompendiumPanelAssignmententity = isPerformingLabExistAgainstPanel;
                }
                else
                {
                    await _applicationDbContext.TblCompendiumPanelAssignments.AddAsync(CompendiumPanelAssignmententity);
                }

                //if(request.GroupNameId != 0)
                //{
                CompendiumGroupPanelsAssignment.CreatedBy = LoggedInUser;
                CompendiumGroupPanelsAssignment.CreatedDate = DateTimeNow.Get;
                CompendiumGroupPanelsAssignment.IsDeleted = false;
                CompendiumGroupPanelsAssignment.IsActive = true;
                CompendiumGroupPanelsAssignment.PanelId = CompendiumPanelentity.Id;


                var isGroupAgainstPanel = _applicationDbContext.TblCompendiumGroupPanelsAssignments.FirstOrDefault(a => a.PanelId == CompendiumPanelentity.Id && a.GroupId == request.GroupNameId);
                if (isGroupAgainstPanel != null)
                {
                    CompendiumGroupPanelsAssignment = isGroupAgainstPanel;
                }
                else
                {
                    await _applicationDbContext.TblCompendiumGroupPanelsAssignments.AddAsync(CompendiumGroupPanelsAssignment);
                }

                //}
                //if(request.AssayNameId != 0)
                //{
                CompendiumPanelTestAssignmententity.CreatedBy = LoggedInUser;
                CompendiumPanelTestAssignmententity.CreatedDate = DateTimeNow.Get;
                CompendiumPanelTestAssignmententity.IsDeleted = false;
                CompendiumPanelTestAssignmententity.IsActive = true;
                CompendiumPanelTestAssignmententity.PanelId = CompendiumPanelentity.Id;
                await _applicationDbContext.TblCompendiumPanelTestAssignments.AddAsync(CompendiumPanelTestAssignmententity);
                _applicationDbContext.SaveChanges();
                //}
                //if (request.ReportingRuleId != 0)
                //{
                CompenduimTestReportingRuleentity.PanelTestAssignmentId = CompendiumPanelTestAssignmententity.Id;
                CompenduimTestReportingRuleentity.CreatedBy = LoggedInUser;
                CompenduimTestReportingRuleentity.CreatedDate = DateTimeNow.Get;
                CompenduimTestReportingRuleentity.IsDeleted = false;
                CompenduimTestReportingRuleentity.IsActive = true;
                await _applicationDbContext.TblCompenduimTestReportingRules.AddAsync(CompenduimTestReportingRuleentity);
                //}

                response.Message = "Record is Added...";
            }

            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }

            return response;
        }
        public async Task<RequestResponse<List<AssayDataLookup>>> assayDataLookupAsync()
        {
            var response = new RequestResponse<List<AssayDataLookup>>();
            var reqtypeid = _applicationDbContext.TblLabRequisitionTypes.FirstOrDefault(x => x.MasterRequisitionTypeId == 4)?.ReqTypeId;
            var dataSource = await _applicationDbContext.TblCompendiumTests.Where(f => f.IsDeleted == false && f.IsActive == true && f.ReqTypeId == reqtypeid)
                .Select(s => new AssayDataLookup()
                {
                    AssayNameId = s.Id,
                    AssayName = s.TestName,
                    Organism = _applicationDbContext.TblCompendiumTestConfigurations.FirstOrDefault(x => x.TestId == s.Id).TestDisplayName,
                    TestCode = _applicationDbContext.TblCompendiumTestConfigurations.FirstOrDefault(x => x.TestId == s.Id).TestCode

                }).OrderBy(o => o.AssayName).ToListAsync();

            response.Data = dataSource;
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed...";

            return response;
        }

        public async Task<RequestResponse<List<ReportingRulesLookup>>> ReportingRulesLookupAsync()
        {
            var response = new RequestResponse<List<ReportingRulesLookup>>();
            var reqtypeid = _applicationDbContext.TblLabRequisitionTypes.FirstOrDefault(x => x.MasterRequisitionTypeId == 4)?.ReqTypeId;
            var dataSource = await _applicationDbContext.TblCompendiumReportingRules.Where(f => f.IsDeleted == false && f.IsActive == true && f.ReqTypeId == reqtypeid)
                .Select(s => new ReportingRulesLookup()
                {
                    ReportingRuleId = s.Id,
                    ReportingRuleName = s.Name

                }).OrderBy(o => o.ReportingRuleName).ToListAsync();

            response.Data = dataSource;
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed...";

            return response;
        }
        public async Task<RequestResponse<List<ReferenceLabLookupDto>>> ReferenceLabLookupAsync()
        {
            var response = new RequestResponse<List<ReferenceLabLookupDto>>();

            var getSystemLookup = await _masterDbContext.TblOptionLookups.Where(f => f.UserType.ToUpper().Trim() == "FACILITY").Select(s => s.Id).ToListAsync();
            var getuserAdminType = Convert.ToInt32(await _masterDbContext.TblUsers.Where(f => f.Id == _connectionManager.UserId).Select(s => s.AdminType).FirstOrDefaultAsync());

            if (getSystemLookup.Contains(getuserAdminType))
            {
                var labIdsByUser = await _masterDbContext.TblLabUsers.Where(f => f.UserId.Equals(_connectionManager.UserId) && f.IsDeleted == false && f.IsActive == true).Select(s => s.LabId).ToListAsync();
                response.Data = await _masterDbContext.TblLabs.Where(f => labIdsByUser.Contains(f.LabId) && f.IsDeleted.Equals(false)).Select(s => new ReferenceLabLookupDto()
                {
                    LabId = s.LabId,
                    LabDisplayName = s.DisplayName

                }).OrderBy(o => o.LabDisplayName).ToListAsync();
            }
            else
            {
                response.Data = await _masterDbContext.TblLabs.Where(f => f.IsDeleted.Equals(false)).Select(s => new ReferenceLabLookupDto()
                {
                    LabId = s.LabId,
                    LabDisplayName = s.DisplayName

                }).OrderBy(o => o.LabDisplayName).ToListAsync();
            }
            response.HttpStatusCode = Status.Success;
            response.Status = "Success";
            response.Message = "Request Processed...";

            return response;
        }


        public RequestResponse<FileContentResult> PanelExportToExcel(int[]? selectedRow)
        {
            var response = new RequestResponse<FileContentResult>();

            #region DataSource
            var reqTypeId = _applicationDbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.MasterRequisitionTypeId == 4)?.ReqTypeId;
            var compendiumPanelsResult = _applicationDbContext.TblCompendiumPanels.Where(f => f.ReqTypeId == reqTypeId).ToList();
            var tblCompendiumGroupPanelsAssignments = _applicationDbContext.TblCompendiumGroupPanelsAssignments.ToList();
            var tblCompendiumPanelTestAssignments = _applicationDbContext.TblCompendiumPanelTestAssignments.ToList();
            var tblCompendiumTestConfigurations = _applicationDbContext.TblCompendiumTestConfigurations.ToList();
            var tblCompendiumTests = _applicationDbContext.TblCompendiumTests.ToList();
            var tblCompendiumPanelAssignments = _applicationDbContext.TblCompendiumPanelAssignments.ToList();
            var tblCompendiumReportingRules = _applicationDbContext.TblCompendiumReportingRules.ToList();
            var tblLabs = _applicationDbContext.TblLabs.ToList();
            var tblCompenduimGroups = _applicationDbContext.TblCompendiumGroups.ToList();

            var data = (from CompendiumPanel in compendiumPanelsResult
                        join CompendiumGroupPanelsAssignment in tblCompendiumGroupPanelsAssignments on CompendiumPanel?.Id equals CompendiumGroupPanelsAssignment?.PanelId into CompendiumPanelCompendiumGroupPanelsAssignment
                        from CompendiumPanelWithCompendiumGroupPanelsAssignment in CompendiumPanelCompendiumGroupPanelsAssignment.DefaultIfEmpty()
                        join CompendiumPanelTestAssignments in tblCompendiumPanelTestAssignments on CompendiumPanel?.Id equals CompendiumPanelTestAssignments?.PanelId into CompendiumPanelCompendiumPanelTestAssignments
                        from CompendiumPanelWithCompendiumPanelTestAssignments in CompendiumPanelCompendiumPanelTestAssignments.DefaultIfEmpty()
                        join CompendiumTestConfigurations in tblCompendiumTestConfigurations on CompendiumPanelWithCompendiumPanelTestAssignments?.TestId equals CompendiumTestConfigurations?.TestId into CompendiumPanelCompendiumTestConfigurations
                        from CompendiumPanelWithCompendiumTestConfigurations in CompendiumPanelCompendiumTestConfigurations.DefaultIfEmpty()
                        join CompendiumTests in tblCompendiumTests on CompendiumPanelWithCompendiumPanelTestAssignments?.TestId equals CompendiumTests?.Id into CompendiumTestCompendiumPanelTestAssignments
                        from CompendiumTestWithCompendiumPanelTestAssignments in CompendiumTestCompendiumPanelTestAssignments.DefaultIfEmpty()


                            //join CompendiumTestReportingRule in _applicationDbContext.TblCompenduimTestReportingRules on CompendiumPanelWithCompendiumPanelTestAssignments?.TestConfigId equals CompendiumTestReportingRule.TestConfigId into CompendiumTestReportingRuleTblCompenduimTestReportingRules
                            //from CompendiumTestReportingRuleWithTblCompenduimTestReportingRules in CompendiumTestReportingRuleTblCompenduimTestReportingRules.DefaultIfEmpty()
                        join CompendiumPanelAssignments in tblCompendiumPanelAssignments on CompendiumPanel?.Id equals CompendiumPanelAssignments?.ParentPanelId into CompendiumPanelAssignmentsCompendiumPanel
                        from CompendiumPanelWithAssignmentsCompendiumPanel in CompendiumPanelAssignmentsCompendiumPanel.DefaultIfEmpty()
                        join CompendiumReportingRule in tblCompendiumReportingRules on CompendiumPanelWithCompendiumPanelTestAssignments?.ReportingRuleId equals CompendiumReportingRule?.Id into CompendiumReportingRuleTblCompendiumTestReportingRules
                        from CompendiumReportingRuleWithTblCompendiumTestReportingRules in CompendiumReportingRuleTblCompendiumTestReportingRules.DefaultIfEmpty()
                        join Labs in tblLabs on CompendiumPanelWithAssignmentsCompendiumPanel?.ReferenceLabId equals Labs?.LabId into LabsCompendiumPanelWithAssignmentsCompendiumPanel
                        from LabsWithCompendiumPanelWithAssignmentsCompendiumPanel in LabsCompendiumPanelWithAssignmentsCompendiumPanel.DefaultIfEmpty()
                        select new
                        {
                            CompendiumPanelResult = CompendiumPanel,
                            CompendiumGroupPanelsAssignmentsResult = CompendiumPanelWithCompendiumGroupPanelsAssignment,
                            CompendiumPanelTestAssignmentsResult = CompendiumPanelWithCompendiumPanelTestAssignments,
                            CompendiumTestConfigurationsResult = CompendiumPanelWithCompendiumTestConfigurations,
                            CompendiumTestResult = CompendiumTestWithCompendiumPanelTestAssignments,
                            CompendiumReportingRuleResult = CompendiumReportingRuleWithTblCompendiumTestReportingRules,
                            LabResult = LabsWithCompendiumPanelWithAssignmentsCompendiumPanel
                        })
                              .Select((item, index) => new IDCompendiumPanelMappingResponse.GetAll()
                              {
                                  Id = index + 1, // Generate unique ID
                                  PanelId = item.CompendiumPanelResult?.Id ?? 0,
                                  PerformingLabId = item.LabResult?.LabId ?? 0,
                                  PerformingLabName = item.LabResult?.DisplayName ?? "",
                                  PanelName = item.CompendiumPanelResult?.PanelName ?? "",
                                  PanelCode = item.CompendiumPanelResult?.Tmitcode ?? "",
                                  AssayNameId = item.CompendiumTestResult?.Id ?? 0,
                                  AssayName = item.CompendiumTestResult?.TestName ?? "",
                                  Organism = item.CompendiumTestConfigurationsResult?.TestDisplayName ?? "",
                                  TestCode = item.CompendiumTestConfigurationsResult?.TestCode ?? "",
                                  ReportingRuleId = item.CompendiumReportingRuleResult?.Id ?? 0,
                                  ReportingRuleName = item.CompendiumReportingRuleResult?.Name ?? "",
                                  GroupNameId = item.CompendiumGroupPanelsAssignmentsResult != null ? item.CompendiumGroupPanelsAssignmentsResult?.GroupId : 0,
                                  GroupName = item.CompendiumGroupPanelsAssignmentsResult?.GroupId != null ? tblCompenduimGroups.FirstOrDefault(f => f.Id == item.CompendiumGroupPanelsAssignmentsResult?.GroupId)?.GroupName : "",
                                  AntibioticClass = item.CompendiumPanelTestAssignmentsResult?.AntibioticClass ?? "",
                                  Resistance = item.CompendiumPanelTestAssignmentsResult?.IsResistance,
                                  NumberOfDetected = item.CompendiumPanelTestAssignmentsResult?.NumberOfDetected,
                                  NumberOfRepeated = item.CompendiumPanelTestAssignmentsResult?.NumberOfRepeated,
                                  ReportingRuleInfos = new List<ReportingRuleInfo>()
                                  {
                                         new ReportingRuleInfo()
                                         {
                                             ReportingRuleName = item.CompendiumReportingRuleResult?.Name ?? "",
                                             AgeRange = $"{item.CompendiumReportingRuleResult?.AgeFrom}-{item.CompendiumReportingRuleResult?.AgeTo}",
                                             Low = $"{item.CompendiumReportingRuleResult?.MinLow}-{item.CompendiumReportingRuleResult?.MaxLow}",
                                             Medium = $"{item.CompendiumReportingRuleResult?.MinInter}-{item.CompendiumReportingRuleResult?.MaxInter}",
                                             High = $"{item.CompendiumReportingRuleResult?.MinHigh}-{item.CompendiumReportingRuleResult?.MaxHigh}",
                                             AmpScore = item.CompendiumReportingRuleResult?.AmpScore ?? 0,
                                             CqConf = item.CompendiumReportingRuleResult?.CqConf ?? 0,
                                         }
                                  }
                              }).Distinct().OrderByDescending(d => d.Id)
                        .GroupBy(item => new
                        {
                            PanelId = item?.PanelId ?? 0, // Use 0 as a default value if PanelId is null
                            PerformingLabId = item?.PerformingLabId ?? 0, // Use 0 as a default value if PerformingLabId is null
                            PanelName = item?.PanelName ?? "", // Use an empty string as a default value if PanelName is null
                            PanelCode = item?.PanelCode ?? "", // Use an empty string as a default value if PanelCode is null
                            AssayNameId = item?.AssayNameId ?? 0, // Use 0 as a default value if AssayNameId is null
                            AssayName = item?.AssayName ?? "", // Use an empty string as a default value if AssayName is null
                            Organism = item?.Organism ?? "", // Use an empty string as a default value if Organism is null
                            TestCode = item?.TestCode ?? "", // Use an empty string as a default value if TestCode is null
                            ReportingRuleId = item?.ReportingRuleId ?? 0, // Use 0 as a default value if ReportingRuleId is null
                            GroupNameId = item?.GroupNameId ?? 0, // Use 0 as a default value if GroupNameId is null
                            AntibioticClass = item?.AntibioticClass ?? "", // Use an empty string as a default value if AntibioticClass is null
                            Resistance = item?.Resistance ?? false // Use false as a default value if Resistance is null

                        })
                        .Select(group => group.First())
                        .ToList();
            if (selectedRow?.Count() > 0)
            {
                data = data.Where(f => selectedRow.Contains(f.Id)).ToList();
            }
            #endregion

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Panel Test Code");

            #region Header And Header Styling
            //worksheet.Row(1).Style.Fill.PatternType = ExcelFillStyle.Solid;
            //worksheet.Row(1).Style.Font.Bold = true;
            //worksheet.Row(1).Style.Font.Color.SetColor(Color.White);
            //worksheet.Row(1).Style.Fill.BackgroundColor.SetColor(Color.Black);


            worksheet.Cells[1, 1].Value = "Performing Lab";
            worksheet.Cells[1, 2].Value = "Panel Name";
            worksheet.Cells[1, 3].Value = "Panel Code";
            worksheet.Cells[1, 4].Value = "Assay Name";
            worksheet.Cells[1, 5].Value = "Organism";
            worksheet.Cells[1, 6].Value = "Test Code";
            worksheet.Cells[1, 7].Value = "Reporting Rule";
            worksheet.Cells[1, 8].Value = "Group Name";
            worksheet.Cells[1, 9].Value = "Antibiotic Class";
            worksheet.Cells[1, 10].Value = "Resistance";
            worksheet.Cells[1, 11].Value = "Number Of Repeated";
            worksheet.Cells[1, 12].Value = "Number Of Detected";
            using (var range = worksheet.Cells[1, 1, 1, 3])
            {
                worksheet.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#333F4F"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = worksheet.Cells[1, 4, 1, 6])
            {
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#2F75B5"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = worksheet.Cells[1, 7, 1, 8])
            {
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#203764"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            #endregion
            #region Add data to the worksheet
            for (var i = 0; i < data.Count; i++)
            {
                var row = i + 2;
                worksheet.Cells[row, 1].Value = data[i].PerformingLabName;
                worksheet.Cells[row, 2].Value = data[i].PanelName;
                worksheet.Cells[row, 3].Value = data[i].PanelCode;
                worksheet.Cells[row, 4].Value = data[i].AssayName;
                worksheet.Cells[row, 5].Value = data[i].Organism;
                worksheet.Cells[row, 6].Value = data[i].TestCode;
                worksheet.Cells[row, 7].Value = data[i].ReportingRuleName;
                worksheet.Cells[row, 8].Value = data[i].GroupName;
                worksheet.Cells[row, 9].Value = data[i].AntibioticClass;
                worksheet.Cells[row, 10].Value = data[i].Resistance;
                worksheet.Cells[row, 11].Value = data[i].NumberOfRepeated;
                worksheet.Cells[row, 12].Value = data[i].NumberOfDetected;

            }

            // Set the column widths
            worksheet.Column(1).AutoFit();
            worksheet.Column(2).AutoFit();
            worksheet.Column(3).AutoFit();
            worksheet.Column(4).AutoFit();
            worksheet.Column(5).AutoFit();
            worksheet.Column(6).AutoFit();
            worksheet.Column(7).AutoFit();
            worksheet.Column(8).AutoFit();
            worksheet.Column(9).AutoFit();
            worksheet.Column(10).AutoFit();
            worksheet.Column(11).AutoFit();
            worksheet.Column(12).AutoFit();

            #endregion

            response.Data = new FileContentResult(package.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed Successfully";


            return response;
        }

        public RequestResponse BulkPanelMappingUpload(FileDataRequest request)
        {
            var response = new RequestResponse();
            string list = "";
            using var stream = new MemoryStream(request.Contents);
            using var package = new ExcelPackage(stream);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            #region==========================worksheet 1
            var workSheet = package.Workbook.Worksheets[0];

            int rowLenght = workSheet.Dimension.End.Row;
            int columnLenght = workSheet.Dimension.End.Column;

            if (rowLenght == 1)
            {
                //response.HttpStatusCode = Status.Failed;
                response.Message = response.Message + "First Sheet is Empty ";
                //return response;
            }
            else if (columnLenght < 11 || columnLenght > 11)
            {
                response.HttpStatusCode = Status.Failed;
                response.Message = response.Message + "First Sheet is Invalid ";
                //return response;
            }
            else
            {
                
                for (int row = 2; row <= workSheet.Dimension.End.Row; row++)
                {
                    List<string> dataObjList = new List<string>();
                    for (int col = 1; col <= workSheet.Dimension.End.Column; col++)
                    {

                        var cellValue = workSheet.Cells[row, col].Value;
                        if ((col != 1 || col == 1) && cellValue != null)
                            dataObjList.Add(cellValue.ToString());
                        else
                            dataObjList.Add("");
                    }
                    IDCompendiumPanelMappingBulkSaveRequest bulk = new IDCompendiumPanelMappingBulkSaveRequest()
                    {
                        PerformingLab = dataObjList[0],
                        PanelName = dataObjList[1],
                        PanelCode = dataObjList[2],
                        AssayName = dataObjList[3],
                        Organisim = dataObjList[4],
                        TestCode = dataObjList[5],
                        GroupName = dataObjList[6],
                        AntibioticClass = dataObjList[7],
                        Resistance = dataObjList[8],
                        NumberOfDetected = dataObjList[9],
                        NumberOfRepeated = dataObjList[10],

                    };

                    if (!string.IsNullOrEmpty(bulk.PerformingLab) && !string.IsNullOrEmpty(bulk.PanelName) && !string.IsNullOrEmpty(bulk.PanelCode) && !string.IsNullOrEmpty(bulk.AssayName) && !string.IsNullOrEmpty(bulk.Organisim) &&
                        !string.IsNullOrEmpty(bulk.TestCode) && !string.IsNullOrEmpty(bulk.GroupName))
                    {
                        using (var transactionScope = new TransactionScope())
                        {
                            var tblTempCompendiumPanelTestUpload = new TblTempCompendiumPanelTestUpload()
                            {
                                PerformingLab = bulk.PerformingLab,
                                PanelName = bulk.PanelName,
                                PanelCode = bulk.PanelCode,
                                AntibiotecClass = bulk.AntibioticClass,
                                AssayName = bulk.AssayName,
                                Organisim = bulk.Organisim,
                                TestCode = bulk.TestCode,
                                Resistance = bulk.Resistance,
                                CreatedBy = LoggedInUser,
                                CreatedDate = DateTimeNow.Get,
                                UploadStatus = "pending",
                                GroupName = bulk.GroupName,
                                //NumberOfDetected = Convert.ToInt32(bulk.NumberOfDetected),
                                //NumberOfRepeated = Convert.ToInt32(bulk.NumberOfRepeated),
                            };
                            _applicationDbContext.TblTempCompendiumPanelTestUploads.AddAsync(tblTempCompendiumPanelTestUpload);
                            _applicationDbContext.SaveChanges();

                            transactionScope.Complete();
                        }
                    }
                    else
                    {
                        //list.Add(row);
                        //list = list + "except,";

                        if (string.IsNullOrEmpty(bulk.PerformingLab))
                        {
                            list = list + " Performing Lab,";
                        }
                        if (string.IsNullOrEmpty(bulk.PanelName))
                        {
                            list = list + " Panel Name,";
                        }
                        if (string.IsNullOrEmpty(bulk.PanelCode))
                        {
                            list = list + " Panel Code,";
                        }
                        if (string.IsNullOrEmpty(bulk.AssayName))
                        {
                            list = list + " Assay Name,";
                        }
                        if (string.IsNullOrEmpty(bulk.Organisim))
                        {
                            list = list + " Organism,";
                        }
                        if (string.IsNullOrEmpty(bulk.TestCode))
                        {
                            list = list + " Test Code,";
                        }
                        if (string.IsNullOrEmpty(bulk.GroupName))
                        {
                            list = list + " Group Name,";
                        }
                        //if (string.IsNullOrEmpty(bulk.PrimaryContactLastName))
                        //{
                        //    list = list + " Primary Contact Last Name,";
                        //}
                        //if (string.IsNullOrEmpty(bulk.PrimaryContactPhone))
                        //{
                        //    list = list + " Primary Contact Phone,";
                        //}
                        //if (string.IsNullOrEmpty(bulk.PrimaryContactEmail))
                        //{
                        //    list = list + " Primary Contact Email,";
                        //}
                        //if (string.IsNullOrEmpty(bulk.ProviderFirstName))
                        //{
                        //    list = list + " Provider FirstName,";
                        //}
                        list = list + " is Missing in row: " + row + ".\n";
                    }

                }

                if (list != "")
                {
                    //string s = "";
                    //foreach (var r in list)
                    //{
                    //    s = s + ", " + r.ToString();
                    //}
                    response.Message = "First Sheet Uploaded Successfully except rows :\n" + list;
                    response.HttpStatusCode = Status.DataNotFound;
                }
                else
                {
                    response.Message = "First Sheet Uploaded Successfully...";
                    response.HttpStatusCode = Status.Success;
                }
                //response.HttpStatusCode = Status.Success;
                //response.Message = response.Message + "First Sheet Uploaded Successfully ";
            }


            #endregion==========================worksheet1

            #region==========================worksheet 2

            var workSheet1 = package.Workbook.Worksheets[1];

            int rowLenght1 = workSheet1.Dimension.End.Row;
            int columnLenght1 = workSheet1.Dimension.End.Column;

            if (rowLenght1 == 1)
            {
                //response.HttpStatusCode = Status.Failed;
                response.Message = response.Message + "Second Sheet is Empty ";
                //return response;
            }
            else if (columnLenght1 < 14 || columnLenght1 > 14)
            {
                response.HttpStatusCode = Status.Failed;
                response.Message = response.Message + "Second Sheet is Invalid ";
                //return response;
            }
            else
            {
                string list1 = "";
                for (int row = 2; row <= workSheet1.Dimension.End.Row; row++)
                {
                    List<string> dataObjList = new List<string>();
                    for (int col = 1; col <= workSheet1.Dimension.End.Column; col++)
                    {

                        var cellValue = workSheet1.Cells[row, col].Value;
                        if ((col != 1 || col == 1) && cellValue != null)
                            dataObjList.Add(cellValue.ToString());
                        else
                            dataObjList.Add("");
                    }
                    IDCompendiumReportingRulesBulkSaveRequest bulk = new IDCompendiumReportingRulesBulkSaveRequest();

                    bulk.TestCode = dataObjList[0];
                    bulk.AgeFrom = string.IsNullOrEmpty(dataObjList[1]) ? null : Convert.ToInt32(dataObjList[1]);
                    bulk.AgeTo = string.IsNullOrEmpty(dataObjList[2]) ? null : Convert.ToInt32(dataObjList[2]);
                    bulk.Negative = dataObjList[3];
                    bulk.MaxLow = string.IsNullOrEmpty(dataObjList[4]) ? null : Convert.ToDecimal(dataObjList[4]);
                    bulk.MinLow = string.IsNullOrEmpty(dataObjList[5]) ? null : Convert.ToDecimal(dataObjList[5]);
                    bulk.MaxInter = string.IsNullOrEmpty(dataObjList[6]) ? null : Convert.ToDecimal(dataObjList[6]);
                    bulk.MinInter = string.IsNullOrEmpty(dataObjList[7]) ? null : Convert.ToDecimal(dataObjList[7]);
                    bulk.MaxHigh = string.IsNullOrEmpty(dataObjList[8]) ? null : Convert.ToDecimal(dataObjList[8]);
                    bulk.MinHigh = string.IsNullOrEmpty(dataObjList[9]) ? null : Convert.ToDecimal(dataObjList[9]);
                    bulk.MaxCriticalHigh = string.IsNullOrEmpty(dataObjList[10]) ? null : Convert.ToDecimal(dataObjList[10]);
                    bulk.MinCriticalHigh = string.IsNullOrEmpty(dataObjList[11]) ? null : Convert.ToDecimal(dataObjList[11]);
                    bulk.AmpScore = string.IsNullOrEmpty(dataObjList[12]) ? null : Convert.ToDecimal(dataObjList[12]);
                    bulk.CqConf = string.IsNullOrEmpty(dataObjList[13]) ? null : Convert.ToDecimal(dataObjList[13]);

                    if (!string.IsNullOrEmpty(bulk.TestCode))
                    {
                        using (var transactionScope = new TransactionScope())
                        {
                            var entity = new TblTempReportingRulesUpload()
                            {
                                TestCode = bulk.TestCode,
                                AgeFrom = bulk.AgeFrom != null ? Convert.ToInt32(bulk.AgeFrom) : 0,
                                AgeTo = bulk.AgeTo != null ? Convert.ToInt32(bulk.AgeTo) : 999,
                                Negative = bulk.Negative,
                                MaxLow = bulk.MaxLow,
                                MinLow = bulk.MinLow,
                                MaxMedium = bulk.MaxInter,
                                MinMedium = bulk.MinInter,
                                MaxHigh = bulk.MaxHigh,
                                MinHigh = bulk.MinHigh,
                                MaxCrticalHigh = bulk.MaxCriticalHigh,
                                MinCriticalHigh = bulk.MinCriticalHigh,
                                AmpScore = bulk.AmpScore != null ? Convert.ToInt32(bulk.AmpScore) : null,
                                CqConf = bulk.AmpScore != null ? Convert.ToInt32(bulk.CqConf) : null,
                                CreatedBy = LoggedInUser,
                                CreatedDate = DateTimeNow.Get,
                                UploadStatus = "pending"
                            };
                            _applicationDbContext.TblTempReportingRulesUploads.Add(entity);
                            _applicationDbContext.SaveChanges();
                            transactionScope.Complete();
                        }
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(bulk.TestCode))
                        {
                            list1 = list1 + " Test Code,";
                        }

                    }
                }

                if (list1 != "")
                {
                    //string s = "";
                    //foreach (var r in list)
                    //{
                    //    s = s + ", " + r.ToString();
                    //}
                    response.Message = list + "\nSecond Sheet Uploaded except rows :\n" + list1;
                    response.HttpStatusCode = Status.DataNotFound;
                }
                else
                {
                    response.Message = response.Message + "\n Second Sheet Uploaded Successfully...";
                    response.HttpStatusCode = Status.Success;
                }

                //response.HttpStatusCode = Status.Success;
                //response.Message = response.Message + "Second Sheet Uploaded Successfully ";
            }


            #endregion=============================worksheet2

            //response.HttpStatusCode = Status.Success;
            //response.Message = response.Message + "Bulk Uploaded Successfully ";
            return response;
        }
    }

}
