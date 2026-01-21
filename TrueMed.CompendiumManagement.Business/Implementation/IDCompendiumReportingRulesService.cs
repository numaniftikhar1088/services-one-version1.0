using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml.Style;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Response;
using TrueMed.CompendiumManagement.Domain.Models.QueryModel;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Validator.CompendiumManagement;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Datatable;

namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class IDCompendiumReportingRulesService : IIDCompendiumReportingRulesService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IMapper _mapper;
        private ApplicationDbContext _dbContext;
        public IDCompendiumReportingRulesService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor, IMapper mapper, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _utilityService = utilityService;
            _mapper = mapper;
            LoggedInUser = connectionManager.UserId;
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> SaveIDCompendiumReportingRulesAsync(SaveIDCompendiumReportingRulesRequest request)
        {
            var response = new RequestResponse();

            var validation = new IDCompendiumReportingRulesValidator();
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
            var entity = new TblCompendiumReportingRule();
            entity.Id = request.Id;
            entity.Name = request.Name;
            if(request.AgeRange.ToLower() == "all")
            {
                entity.AgeFrom = 0;
                entity.AgeTo = 999;
            }
            else
            {
                if(string.IsNullOrEmpty(request.AgeRange))
                {
                    entity.AgeFrom = 0;
                    entity.AgeTo = 999;
                }
                string[]? ageRange = request?.AgeRange?.Trim().Split('-');
                if (ageRange?.Length > 0 && ageRange.Length == 2 && ageRange[0].Length > 0 && ageRange[1].Length > 0)
                {
                    //if (ageRange.Length == 1)
                    //{
                    //    entity.AgeFrom = int.Parse(ageRange[0]);
                    //    entity.AgeTo = int.Parse(ageRange[0]);
                    //}
                    //if (ageRange.Length == 2)
                    //{
                        entity.AgeFrom = int.Parse(ageRange[0]);
                        entity.AgeTo = int.Parse(ageRange[1]);
                    //}

                }
            }
            
            string[]? min = request?.Low?.Trim().Split('-');
            if(min?.Length > 0 && min.Length == 2 && min[0].Length > 0 && min[1].Length > 0)
            {
                entity.MaxLow = decimal.Parse(min[0]);
                entity.MinLow = decimal.Parse(min[1]);
                
            }
            string[]? inter = request?.Medium?.Trim().Split('-');
            if (inter?.Length > 0 && inter.Length == 2 && inter[0].Length > 0 && inter[1].Length > 0)
            {
                entity.MaxInter = decimal.Parse(inter[0]);
                entity.MinInter = decimal.Parse(inter[1]);
            }
            string[]? high = request?.high?.Trim().Split('-');
            if (high?.Length > 0 && high.Length == 2 && high[0].Length > 0 && high[1].Length > 0)
            {
                entity.MaxHigh = decimal.Parse(high[0]);
                entity.MinHigh = decimal.Parse(high[1]);
            }
            string[]? criticalHigh = request?.Criticalhigh?.Trim().Split('-');
            if (criticalHigh?.Length > 0 && criticalHigh.Length == 2 && criticalHigh[0].Length > 0 && criticalHigh[1].Length > 0)
            {
                entity.MaxCriticalHigh = decimal.Parse(criticalHigh[0]);
                entity.MinCriticalHigh  = decimal.Parse(criticalHigh[1]);
            }
            entity.Negative = request.Negative;
            entity.AmpScore = request.AmpScore;
            entity.CqConf = request.CqConf;
            entity.ReqTypeId = _dbContext.TblLabRequisitionTypes.FirstOrDefault(x => x.MasterRequisitionTypeId == 4)?.ReqTypeId; ;

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _dbContext.TblCompendiumReportingRules.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {
                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;
                    entity.IsActive = getRecordForEdit.IsActive;
                    entity.IsDeleted = getRecordForEdit.IsDeleted;

                    _dbContext.TblCompendiumReportingRules.Update(entity);
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

                entity.IsDeleted = false;
                entity.IsActive = true;

                await _dbContext.TblCompendiumReportingRules.AddAsync(entity);
                
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


        public async Task<DataQueryResponse<List<IDCompendiumReportingRulesDetailedResponse>>> GetIDCompendiumReportingRulesDetailAsync(DataQueryViewModel<IDCompendiumReportingRulesQueryModel> query)
        {
            var response = new DataQueryResponse<List<IDCompendiumReportingRulesDetailedResponse>>();

            #region Source
            var reqTypeId = _dbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.MasterRequisitionTypeId == 4)?.ReqTypeId;
            var compendiumReportingRulesResult = await _dbContext.TblCompendiumReportingRules.Where(f => f.ReqTypeId == reqTypeId && f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToListAsync();


            var dataSource = (
                from compendiumReportingRules in compendiumReportingRulesResult
                    

                select new IDCompendiumReportingRulesDetailedResponse()
                {
                    Id = compendiumReportingRules.Id,
                    //PanelDisplayName = gpsAssignment.PanelDisplayName,
                    Name = compendiumReportingRules.Name,
                    AgeRange = (compendiumReportingRules.AgeFrom == 0 && compendiumReportingRules.AgeTo == 999)? "All" :compendiumReportingRules.AgeFrom?.ToString() + "-" + compendiumReportingRules.AgeTo?.ToString(),
                    Negative = compendiumReportingRules?.Negative,
                    Low = (!string.IsNullOrEmpty(compendiumReportingRules.MaxLow?.ToString()) && !string.IsNullOrEmpty(compendiumReportingRules.MinLow?.ToString()))? compendiumReportingRules.MaxLow?.ToString() + "-" + compendiumReportingRules.MinLow?.ToString(): "",
                    Medium = (!string.IsNullOrEmpty(compendiumReportingRules.MaxInter?.ToString()) && !string.IsNullOrEmpty(compendiumReportingRules.MinInter?.ToString())) ? compendiumReportingRules.MaxInter?.ToString() + "-" + compendiumReportingRules.MinInter?.ToString(): "",
                    high = (!string.IsNullOrEmpty(compendiumReportingRules.MaxHigh?.ToString()) && !string.IsNullOrEmpty(compendiumReportingRules.MinHigh?.ToString())) ?compendiumReportingRules.MaxHigh?.ToString() + "-" + compendiumReportingRules.MinHigh?.ToString(): "",
                    Criticalhigh = (!string.IsNullOrEmpty(compendiumReportingRules.MaxCriticalHigh?.ToString()) && !string.IsNullOrEmpty(compendiumReportingRules.MinCriticalHigh?.ToString())) ? compendiumReportingRules.MaxCriticalHigh?.ToString() + "-" + compendiumReportingRules.MinCriticalHigh?.ToString(): "",
                    //Criticalhigh = compendiumReportingRules
                    AmpScore = compendiumReportingRules.AmpScore,
                    CqConf = compendiumReportingRules.CqConf,


                }).DistinctBy(d => d.Id).OrderByDescending(o => o.Id).ToList();
            
            
            #endregion

            #region Filtered
            if (!string.IsNullOrEmpty(query.QueryModel?.Name))
            {
                dataSource = dataSource.Where(f => f.Name != null && f.Name.ToLower().Contains(query.QueryModel.Name.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Negative))
            {
                dataSource = dataSource.Where(f => f.Negative != null && f.Negative.ToLower().Contains(query.QueryModel.Negative.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.AgeRange))
            {
                dataSource = dataSource.Where(f => f.AgeRange != null && f.AgeRange.ToLower().Contains(query.QueryModel.AgeRange.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Low))
            {
                dataSource = dataSource.Where(f => f.Low != null && f.Low.ToLower().Contains(query.QueryModel.Low.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Medium))
            {
                dataSource = dataSource.Where(f => f.Medium != null && f.Medium.ToLower().Contains(query.QueryModel.Medium.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.high))
            {
                dataSource = dataSource.Where(f => f.high != null && f.high.ToLower().Contains(query.QueryModel.high.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Criticalhigh))
            {
                dataSource = dataSource.Where(f => f.Criticalhigh != null && f.Criticalhigh.ToLower().Contains(query.QueryModel.Criticalhigh.ToLower())).ToList();
            }
            if (query.QueryModel?.AmpScore > 0)
            {
                dataSource = dataSource.Where(f => f.AmpScore != null && f.AmpScore == query.QueryModel.AmpScore).ToList();
            }
            if (query.QueryModel?.CqConf > 0)
            {
                dataSource = dataSource.Where(f => f.CqConf != null && f.CqConf == query.QueryModel.CqConf).ToList();
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

        public async Task<RequestResponse<List<PanelAndTestResponse>>> GetPanelsAndTestsByIdAsync(int Id)
        {
            var response = new RequestResponse<List<PanelAndTestResponse>>();

            #region Source

           // var compendiumTestReportingRulesResult = await _dbContext.TblCompenduimTestReportingRules.Where(f => f.ReportingRuleId == Id && f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToListAsync();
            var compendiumPanelTestAssignmentsResult = await _dbContext.TblCompendiumPanelTestAssignments.Where(f => f.ReportingRuleId == Id && f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToListAsync();
            var compendiumPanelsResult = await _dbContext.TblCompendiumPanels.Where(f => f.IsDeleted.Equals(false)).Where(f => f.IsActive.Equals(true)).ToListAsync();
            var compendiumTestsResult = await _dbContext.TblCompendiumTests.Where(f => f.IsDeleted.Equals(false)).Where(f => f.IsActive.Equals(true)).ToListAsync();


            var dataSource1 = (
                //from compendiumTestReportingRules in compendiumTestReportingRulesResult
                //join compendiumPanelTestAssignments in compendiumPanelTestAssignmentsResult on compendiumTestReportingRules.TestConfigId equals compendiumPanelTestAssignments.TestConfigId
                //into compendiumTestReportingRulescompendiumPanelTestAssignments
                //from compendiumTestReportingRulespluscompendiumPanelTestAssignments in compendiumTestReportingRulescompendiumPanelTestAssignments.DefaultIfEmpty()

                from compendiumPanelTestAssignments in compendiumPanelTestAssignmentsResult
                join compendiumPanels in compendiumPanelsResult on compendiumPanelTestAssignments?.PanelId equals compendiumPanels.Id
                into compendiumPanelTestAssignmentscompendiumPanels
                from compendiumPanelTestAssignmentspluscompendiumPanels in compendiumPanelTestAssignmentscompendiumPanels.DefaultIfEmpty()


                join compendiumTests in compendiumTestsResult on compendiumPanelTestAssignments?.TestId equals compendiumTests.Id
                into compendiumTestscompendiumPanelTestAssignments
                from compendiumTestspluscompendiumPanelTestAssignments in compendiumTestscompendiumPanelTestAssignments.DefaultIfEmpty()
                    


                select new PanelAndTestResponse()
                {
                    PanelId = compendiumPanelTestAssignments == null ? 0 :  Convert.ToInt32(compendiumPanelTestAssignments.PanelId),
                    PanelName = compendiumPanelTestAssignmentspluscompendiumPanels == null ? "" : compendiumPanelTestAssignmentspluscompendiumPanels.PanelName,
                    TestId = compendiumPanelTestAssignments == null ? 0 : Convert.ToInt32(compendiumPanelTestAssignments.TestId),
                    TestName = compendiumTestspluscompendiumPanelTestAssignments == null ? "" : compendiumTestspluscompendiumPanelTestAssignments.TestName,

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
        public byte[] IDCompendiumDataReportingRuleTemplateDownload()
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            // Add a worksheet
            ExcelWorksheet PanelTestCode = package.Workbook.Worksheets.Add("Panel Test Code");
            ExcelWorksheet PanelReportingRule = package.Workbook.Worksheets.Add("Panel Reporting Rule");

            #region PanelTestCode
            PanelTestCode.Cells["A1"].Value = "Performing Lab";
            PanelTestCode.Cells["B1"].Value = "Panel Name";
            PanelTestCode.Cells["C1"].Value = "Panel Code";
            PanelTestCode.Cells["D1"].Value = "Assay Name";
            PanelTestCode.Cells["E1"].Value = "Organisim";
            PanelTestCode.Cells["F1"].Value = "Test Code";
            PanelTestCode.Cells["G1"].Value = "Group Name";
            PanelTestCode.Cells["H1"].Value = "Antibiotic Class";
            PanelTestCode.Cells["I1"].Value = "Resistance";
            PanelTestCode.Cells["J1"].Value = "NoOfRepeated";
            PanelTestCode.Cells["K1"].Value = "NoOfDetected";

            PanelTestCode.Cells["A2"].Value = "Demo Lab";
            PanelTestCode.Cells["B2"].Value = "Vaginitis, NAAT";
            PanelTestCode.Cells["C2"].Value = "TMTID0537";
            PanelTestCode.Cells["D2"].Value = "Ureaplasma urealyticum, parvum";
            PanelTestCode.Cells["E2"].Value = "Ureaplasma urealyticum, parvum";
            PanelTestCode.Cells["F2"].Value = "U. urealyticum_U. parvum";
            PanelTestCode.Cells["G2"].Value = "Default";
            PanelTestCode.Cells["H2"].Value = "Vancomycin Resistance";
            PanelTestCode.Cells["I2"].Value = "True";
            PanelTestCode.Cells["J2"].Value = "2";
            PanelTestCode.Cells["K2"].Value = "1";

            using (var range = PanelTestCode.Cells[1, 1, 1, 3])
            {
                PanelTestCode.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#333F4F"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = PanelTestCode.Cells[1, 4, 1, 6])
            {
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#2F75B5"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = PanelTestCode.Cells[1, 7, 1, 11])
            {
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#203764"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            #endregion
            #region PanelReportingRule
            PanelReportingRule.Cells["A1"].Value = "Test Code";
            PanelReportingRule.Cells["B1"].Value = "Age From";
            PanelReportingRule.Cells["C1"].Value = "Age To";
            PanelReportingRule.Cells["D1"].Value = "Negative";
            PanelReportingRule.Cells["E1"].Value = "Max Low";
            PanelReportingRule.Cells["F1"].Value = "Min Low";
            PanelReportingRule.Cells["G1"].Value = "Max Medium";
            PanelReportingRule.Cells["H1"].Value = "Min Medium";
            PanelReportingRule.Cells["I1"].Value = "Max High";
            PanelReportingRule.Cells["J1"].Value = "Min High";
            PanelReportingRule.Cells["K1"].Value = "Max Critical High";
            PanelReportingRule.Cells["L1"].Value = "Min Critical High";
            PanelReportingRule.Cells["M1"].Value = "Amp Score";
            PanelReportingRule.Cells["N1"].Value = "Cq Conf";


            PanelReportingRule.Cells["A2"].Value = "U. urealyticum_U. parvum";
            PanelReportingRule.Cells["B2"].Value = "0";
            PanelReportingRule.Cells["C2"].Value = "999";
            PanelReportingRule.Cells["D2"].Value = "";
            PanelReportingRule.Cells["E2"].Value = "34";
            PanelReportingRule.Cells["F2"].Value = "29";
            PanelReportingRule.Cells["G2"].Value = "29";
            PanelReportingRule.Cells["H2"].Value = "20";
            PanelReportingRule.Cells["I2"].Value = "20";
            PanelReportingRule.Cells["J2"].Value = "5";
            PanelReportingRule.Cells["K2"].Value = "";
            PanelReportingRule.Cells["L2"].Value = "";
            PanelReportingRule.Cells["M2"].Value = "1";
            PanelReportingRule.Cells["N2"].Value = "1";


            using (var range = PanelReportingRule.Cells[1, 1, 1, 4])
            {
                PanelReportingRule.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#333F4F"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = PanelReportingRule.Cells[1, 5, 1, 6])
            {
                PanelReportingRule.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#7B7B7B"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = PanelReportingRule.Cells[1, 7, 1, 8])
            {
                PanelReportingRule.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#806000"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = PanelReportingRule.Cells[1, 9, 1, 10])
            {
                PanelReportingRule.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#203764"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = PanelReportingRule.Cells[1, 11, 1, 12])
            {
                PanelReportingRule.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#FF0000"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = PanelReportingRule.Cells[1, 13, 1, 14])
            {
                PanelReportingRule.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#92D050"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            #endregion
            // Save the Excel package to a byte array
            return package.GetAsByteArray();
        }
        public RequestResponse<FileContentResult> ReportingRulesExportToExcel(int[]? selectedRow)
        {
            var response = new RequestResponse<FileContentResult>();

            #region DataSource
            var reqTypeId = _dbContext.TblLabRequisitionTypes.FirstOrDefault(f => f.MasterRequisitionTypeId == 4)?.ReqTypeId;

            var compendiumReportingRulesResult = _dbContext.TblCompendiumReportingRules.Where(f => f.ReqTypeId == reqTypeId && f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToList();
            var tblCompendiumPanelTestAssignmentsResult = _dbContext.TblCompendiumPanelTestAssignments.Where(f => f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToList();

            //var tblCompenduimTestReportingRules = _dbContext.TblCompenduimTestReportingRules.Where(f => f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToList();
            var tblCompendiumTestConfigurations = _dbContext.TblCompendiumTestConfigurations.Where(f => f.ReqTypeId == reqTypeId &&  f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToList();

            var data = (
                from compendiumReportingRules in compendiumReportingRulesResult
                join CompendiumPanelTestAssignments in tblCompendiumPanelTestAssignmentsResult on compendiumReportingRules.Id equals CompendiumPanelTestAssignments.ReportingRuleId 
                into compendiumReportingRulesCompendiumPanelTestAssignments
                from compendiumReportingRules_compendiumPanelTestAssignments in compendiumReportingRulesCompendiumPanelTestAssignments.DefaultIfEmpty()

                join compendiumTestConfigurations in tblCompendiumTestConfigurations on compendiumReportingRules_compendiumPanelTestAssignments?.TestConfigId equals compendiumTestConfigurations.Id
                into compendiumTestConfigurationscompendiumReportingRules_compendiumPanelTestAssignments
                from compendiumTestConfigurations_compendiumReportingRules_compendiumPanelTestAssignments in compendiumTestConfigurationscompendiumReportingRules_compendiumPanelTestAssignments.DefaultIfEmpty()

                select new ReportingRulesExportToExcelResponse()
                {
                    Id = compendiumReportingRules.Id,
                    //PanelDisplayName = gpsAssignment.PanelDisplayName,
                    //TestCode = compendiumTestConfigurations_compendiumReportingRules_compendiumPanelTestAssignments != null ? compendiumTestConfigurations_compendiumReportingRules_compendiumPanelTestAssignments.TestCode : "",
                    ReportingRuleName = compendiumReportingRules?.Name,
                    AgeFrom = compendiumReportingRules?.AgeFrom,
                    AgeTo = compendiumReportingRules?.AgeTo,
                    Negative = compendiumReportingRules?.Negative,
                    MaxLow = compendiumReportingRules?.MaxLow,
                    MinLow = compendiumReportingRules?.MinLow,
                    MaxInter = compendiumReportingRules?.MaxInter,
                    MinInter = compendiumReportingRules?.MinInter,
                    MaxHigh = compendiumReportingRules?.MaxHigh,
                    MinHigh = compendiumReportingRules?.MinHigh,
                    MaxCriticalHigh = compendiumReportingRules?.MaxCriticalHigh,
                    MinCriticalHigh = compendiumReportingRules?.MinCriticalHigh,
                    AmpScore = compendiumReportingRules?.AmpScore,
                    CqConf = compendiumReportingRules?.CqConf,
                    
                }).DistinctBy(d => d.Id).OrderByDescending(o => o.Id).ToList();

            if (selectedRow?.Count() > 0)
            {
                data = data.Where(f => selectedRow.Contains(f.Id)).ToList();
            }
            #endregion

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Panel Reporting Rule");

            #region Header And Header Styling
            worksheet.Row(1).Style.Fill.PatternType = ExcelFillStyle.Solid;
            worksheet.Row(1).Style.Font.Bold = true;
            worksheet.Row(1).Style.Font.Color.SetColor(Color.White);
            worksheet.Row(1).Style.Fill.BackgroundColor.SetColor(Color.Black);


            worksheet.Cells[1, 1].Value = "Reporting Rule Name";
            worksheet.Cells[1, 2].Value = "Age From";
            worksheet.Cells[1, 3].Value = "Age To";
            worksheet.Cells[1, 4].Value = "Negative";
            worksheet.Cells[1, 5].Value = "Max Low";
            worksheet.Cells[1, 6].Value = "Min Low";
            worksheet.Cells[1, 7].Value = "Max Medium";
            worksheet.Cells[1, 8].Value = "Min Medium";
            worksheet.Cells[1, 9].Value = "Max High";
            worksheet.Cells[1, 10].Value = "Min High";
            worksheet.Cells[1, 11].Value = "Max Critical High";
            worksheet.Cells[1, 12].Value = "Min Critical High";
            worksheet.Cells[1, 13].Value = "Amp Score";
            worksheet.Cells[1, 14].Value = "Cq Conf";


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
            using (var range = worksheet.Cells[1, 4, 1, 5])
            {
                worksheet.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#7B7B7B"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = worksheet.Cells[1, 6, 1, 7])
            {
                worksheet.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#806000"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = worksheet.Cells[1, 8, 1, 9])
            {
                worksheet.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#203764"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = worksheet.Cells[1, 10, 1, 11])
            {
                worksheet.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#FF0000"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }
            using (var range = worksheet.Cells[1, 12, 1, 13])
            {
                worksheet.Row(1).Height = 25;
                range.Style.Font.Bold = true;
                range.AutoFitColumns();
                range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                range.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml("#92D050"));
                range.Style.Font.Color.SetColor(Color.White);
                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            }

            #endregion
            #region Add data to the worksheet
            for (var i = 0; i < data.Count; i++)
            {
                var row = i + 2;
                worksheet.Cells[row, 1].Value = data[i].ReportingRuleName;
                worksheet.Cells[row, 2].Value = data[i].AgeFrom;
                worksheet.Cells[row, 3].Value = data[i].AgeTo;
                worksheet.Cells[row, 4].Value = data[i].Negative;
                worksheet.Cells[row, 5].Value = data[i].MaxLow;
                worksheet.Cells[row, 6].Value = data[i].MinLow;
                worksheet.Cells[row, 7].Value = data[i].MaxInter;
                worksheet.Cells[row, 8].Value = data[i].MinInter;
                worksheet.Cells[row, 9].Value = data[i].MaxHigh;
                worksheet.Cells[row, 10].Value = data[i].MinHigh;
                worksheet.Cells[row, 11].Value = data[i].MaxCriticalHigh;
                worksheet.Cells[row, 12].Value = data[i].MinCriticalHigh;
                worksheet.Cells[row, 13].Value = data[i].AmpScore;
                worksheet.Cells[row, 14].Value = data[i].CqConf;

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
            worksheet.Column(13).AutoFit();
            worksheet.Column(14).AutoFit();

            #endregion

            response.Data = new FileContentResult(package.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed Successfully";


            return response;
        }
    }
}
