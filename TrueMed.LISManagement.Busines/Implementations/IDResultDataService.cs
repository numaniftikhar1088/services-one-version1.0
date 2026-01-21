using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Data;
using System.Drawing;
using System.Net;
using System.Linq.Dynamic.Core;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Busines.Interfaces;
using TrueMed.LISManagement.Domain.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domain.DTOS.Response;
using TrueMed.LISManagement.Domains.DTOS.ExportToExcel;
using TrueMed.LISManagement.Domains.DTOS.Request;
using TrueMed.LISManagement.Domains.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domains.DTOS.Response;
using System;

namespace TrueMed.LISManagement.Busines.Implementations
{
    public class IDResultDataService : IIDResultDataService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _appDbContext;
        private readonly MasterDbContext _masterDbContext;
        private readonly IDapperManager _dapperManager;

        public IDResultDataService(IConnectionManager connectionManager, ApplicationDbContext appDbContext, MasterDbContext masterDbContext, IDapperManager dapperManager)
        {
            _connectionManager = connectionManager;
            _appDbContext = appDbContext;
            _masterDbContext = masterDbContext;
            LoggedInUser = connectionManager.UserId;
            _dapperManager = dapperManager;

        }

        public string LoggedInUser { get; set; }
        #region Queries
        public DataQueryResponse<List<IDResultDataResponse>> GetIdResultData(DataQueryModel<IDResultDataQueryModel> query)
        {
            var response = new DataQueryResponse<List<IDResultDataResponse>>();


            #region Source
            var tblRequisitionMaster = _appDbContext.TblRequisitionMasters.Where(f => f.IsDeleted == false && (query.QueryModel.StatusId != null ? f.RequisitionStatus == query.QueryModel.StatusId : true)).ToList();
            var tblRequisitionRecordInfos = _appDbContext.TblRequisitionOrders.Where(f => f.IsDeleted == false).ToList();
            var tblRequisitionPanels = _appDbContext.TblRequisitionPanels.ToList();
            //var tblLisresultData = _appDbContext.TblLisresultData.ToList();

            var tblLabRequisitionType = _appDbContext.TblLabRequisitionTypes.ToList();
            var tblRequisitionAccessions = _appDbContext.TblRequisitionSpecimensInfos.ToList();
            var tblUsers = _masterDbContext.TblUsers.ToList();
            var tblCompendiumPanels = _appDbContext.TblCompendiumPanels.ToList();
            var tblLisstatuses = _appDbContext.TblLisstatuses.ToList();


            #endregion
            #region Query
            var dataSource = (from Source_1 in tblRequisitionMaster
                              join Source_2 in tblRequisitionRecordInfos on Source_1.RequisitionId equals Source_2.RequisitionId
                              into Combine_1
                              from Source_1_2 in Combine_1.DefaultIfEmpty()

                              join Source_3 in tblRequisitionAccessions on Source_1.RequisitionId equals Source_3.RequisitionId
                              into Combine_2
                              from Source_1_3 in Combine_2.DefaultIfEmpty()

                                  //join Source_4 in tblLisresultData on Source_1_2?.RequisitionOrderId equals Source_4.RequisitionId
                                  //into Combine_3
                                  //from Source_1_4 in Combine_3.DefaultIfEmpty()

                              let panel = tblRequisitionPanels.FirstOrDefault(f => f.ReqTypeId == Source_1_2?.ReqTypeId && f.RequisitionOrderId == Source_1_2?.RequisitionOrderId && f.RequisitionId == Source_1_2?.RequisitionId)
                              where !string.IsNullOrEmpty(Source_1_3?.SpecimenId)
                              select new
                              {
                                  ReqMaster = Source_1,
                                  RecordInfo = Source_1_2,
                                  Accession = Source_1_3,
                                  //RequisitionPanel = Source_1_3,
                                  //LisresultData = Source_1_4,
                                  Panel = panel
                              })
                                  .Select(s => new IDResultDataResponse()
                                  {
                                      RequisitionId = Convert.ToInt32(s.ReqMaster?.RequisitionId),
                                      AccessionNumber = s.Accession != null ? s.Accession?.SpecimenId : null,
                                      ReceiveDate = s.RecordInfo?.DateReceived != null ? Convert.ToDateTime(s.RecordInfo?.DateReceived).ToString("MM/dd/yyyy") : null,
                                      PublishBy = s.RecordInfo != null ? tblUsers.FirstOrDefault(f => f.Id == s.RecordInfo.PublishBy)?.FirstName != null ? tblUsers.FirstOrDefault(f => f.Id == s.RecordInfo.PublishBy)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == s.RecordInfo.PublishBy)?.LastName : s.RecordInfo.PublishBy : "",
                                      PublishDate = s.RecordInfo?.PublishedDate != null ? Convert.ToDateTime(s.RecordInfo?.PublishedDate).ToString("MM/dd/yyyy") : null,
                                      TestType = s.Panel != null ? tblCompendiumPanels.FirstOrDefault(f => f.Id == s.Panel.PanelId)?.PanelName : null,
                                      //ResultValue = s.LisresultData != null ? s.LisresultData.Result : "",
                                      LisStatus = s.RecordInfo != null ? tblLisstatuses.FirstOrDefault(f => f.LisstatusId == (s.RecordInfo.Lisstatus != null ? Convert.ToInt32(s.RecordInfo.Lisstatus) : 0))?.Name : "",
                                      FirstName = s.ReqMaster?.FirstName,
                                      LastName = s.ReqMaster?.LastName,
                                      DateOfBirth = s.ReqMaster?.Dob != null ? Convert.ToDateTime(s.ReqMaster?.Dob).ToString("MM/dd/yyyy") : null,
                                      RequisitionType = tblLabRequisitionType.FirstOrDefault(f => f.ReqTypeId == Convert.ToInt32(s.RecordInfo?.ReqTypeId))?.RequisitionType,
                                      ReqTypeId = s.RecordInfo != null ? s.RecordInfo?.ReqTypeId : null,
                                      ValidateReport = "",
                                      PublishReport = "",
                                      BatchId = "",
                                      RequisitionStatusId = s.ReqMaster?.RequisitionStatus,
                                      RecordId = s.RecordInfo?.RecordId,
                                      RequisitionOrderId = s.RecordInfo?.RequisitionOrderId,
                                  }).OrderByDescending(x => x.RequisitionId).DistinctBy(d => d.RequisitionId).ToList();

            #endregion
            #region Filter

            if (!string.IsNullOrEmpty(query.QueryModel?.AccessionNumber))
            {
                dataSource = dataSource.Where(f => f.AccessionNumber != null && f.AccessionNumber.Trim().ToLower().Contains(query.QueryModel?.AccessionNumber.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ReceiveDate))
            {
                dataSource = dataSource.Where(f => f.ReceiveDate != null && f.ReceiveDate == query.QueryModel?.ReceiveDate).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PublishDate))
            {
                dataSource = dataSource.Where(f => f.PublishDate != null && f.PublishDate == query.QueryModel?.PublishDate).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ResultValue))
            {
                dataSource = dataSource.Where(f => f.ResultValue != null && f.ResultValue.Trim().ToLower().Contains(query.QueryModel?.ResultValue.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestType))
            {
                dataSource = dataSource.Where(f => f.TestType != null && f.TestType.Trim().ToLower().Contains(query.QueryModel?.TestType.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LisStatus))
            {
                dataSource = dataSource.Where(f => f.LisStatus != null && f.LisStatus.Trim().ToLower().Contains(query.QueryModel?.LisStatus.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.FirstName))
            {
                dataSource = dataSource.Where(f => f.FirstName != null && f.FirstName.Trim().ToLower().Contains(query.QueryModel?.FirstName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LastName))
            {
                dataSource = dataSource.Where(f => f.LastName != null && f.LastName.Trim().ToLower().Contains(query.QueryModel?.LastName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.DateOfBirth))
            {
                dataSource = dataSource.Where(f => f.DateOfBirth != null && f.DateOfBirth == query.QueryModel?.DateOfBirth).ToList();
            }
            //if (!string.IsNullOrEmpty(query.QueryModel?.re))
            //{
            //    dataSource = dataSource.Where(f => f.RequisitionType != null && f.RequisitionType.Trim().ToLower().Contains(query.QueryModel?.RequisitionType.Trim().ToLower())).ToList();
            //}
            if (!string.IsNullOrEmpty(query.QueryModel?.BatchId))
            {
                dataSource = dataSource.Where(f => f.BatchId != null && f.BatchId.Trim().ToLower().Contains(query.QueryModel?.BatchId.Trim().ToLower())).ToList();
            }

            response.Total = dataSource.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.StatusCode = HttpStatusCode.OK;
            response.Data = dataSource;

            return response;
        }
        public RequestResponse<IDResultDataExpandResponse> GetIdResultDataExpand(string accessionNo)
        {
            var response = new RequestResponse<IDResultDataExpandResponse>();

            var res = new IDResultDataExpandResponse();
            #region Source

            var tblIdlisresultInformations = _appDbContext.TblIdlisresultInformations.Where(f => f.AccessionNumber == accessionNo).ToList();
            var LabId = _connectionManager.GetLabId();
            var tableLisresultFileConfigurationSetup = _appDbContext.TblLisresultFileConfigurationSetups.FirstOrDefault(f => f.LabId == LabId);
            #endregion
            #region Query
            res.Configs.CalculationOnCqConf = tableLisresultFileConfigurationSetup?.CalculationOnCqConf;
            res.Configs.CalculationOnCt = tableLisresultFileConfigurationSetup?.CalculationOnCt;
            res.Configs.CalculationOnAmpScore = tableLisresultFileConfigurationSetup?.CalculationOnAmpScore;
            var dataSource2 = (tblIdlisresultInformations
                              ).Where(w => w.OrganismType.ToLower().Trim() == "control")
                                  .Select(s => new Control()
                                  {
                                      Id = s.Id,
                                      ControlName = s.TestName,
                                      Results = s.Result,
                                      CombinedResult = s.CombinedResult,
                                      CTValue = s.Ct,
                                      AmpScore = s.Ampscore,
                                      CrtSD = s.Crtsd,
                                      CqConf = s.CqConf,
                                      IsReRun = s.IsReRun
                                  }).ToList();
            res.Controls.AddRange(dataSource2);
            var distinctPanelNames = tblIdlisresultInformations
                .Where(w => w.OrganismType.Trim().ToLower() == "pathogen" || w.OrganismType.Trim().ToLower() == "resistance").ToList();
            var ss = distinctPanelNames
                .Select(x => x.PanelName)
                                                .Distinct()
                                                .ToList();
            foreach (var panel in ss)
            {
                var test = tblIdlisresultInformations.Where(x => x.OrganismType.ToLower().Trim() == "pathogen" && x.PanelName == panel)
                    .Select(s => new OrganismResistance()
                    {
                        Id = s.Id,
                        Organism = s.TestName,
                        OrganismType = s.OrganismType,
                        Results = s.Result,
                        CombinedResult = s.CombinedResult,
                        CTValue = s.Ct,
                        AmpScore = s.Ampscore,
                        CrtSD = s.Crtsd,
                        CqConf = s.CqConf,
                        IsReRun = s.IsReRun,
                        Comments = s.Comments,
                        PanelName = s.PanelName

                    }).ToList();
                var resistance = (tblIdlisresultInformations
                              ).Where(w => w.OrganismType.ToLower().Trim() == "resistance" && w.PanelName == panel)
                                  .Select(s => new OrganismResistance()
                                  {
                                      Id = s.Id,
                                      Organism = s.TestName,
                                      OrganismType = s.OrganismType,
                                      Results = s.Result,
                                      CombinedResult = s.CombinedResult,
                                      CTValue = s.Ct,
                                      AmpScore = s.Ampscore,
                                      CrtSD = s.Crtsd,
                                      CqConf = s.CqConf,
                                      IsReRun = s.IsReRun,
                                      Comments = s.Comments,
                                      PanelName = s.PanelName

                                  }).ToList();
                var pathogen = new Pathogen();
                pathogen.PanelName = panel;
                pathogen.Organisms.AddRange(test);
                pathogen.Resistance.AddRange(resistance);

                res?.Pathogens?.Add(pathogen);
            }

            #endregion

            response.StatusCode = HttpStatusCode.OK;
            response.Data = res;

            return response;
        }

        public DataQueryResponse<List<IDResultDataResponse>> CombineResultDataWithExpand(DataQueryModel<IDResultDataQueryModel> query)
        {
            var response = new DataQueryResponse<List<IDResultDataResponse>>();


            #region Source
            var tblRequisitionMaster = _appDbContext.TblRequisitionMasters.AsNoTracking().Where(f => f.IsDeleted == false && (query.QueryModel.StatusId != null ? f.RequisitionStatus == query.QueryModel.StatusId : true)).ToList();
            var tblRequisitionRecordInfos = _appDbContext.TblRequisitionOrders.AsNoTracking().Where(f => f.IsDeleted == false).ToList();
            var tblRequisitionPanels = _appDbContext.TblRequisitionPanels.AsNoTracking().ToList();
            var tblFacilities = _appDbContext.TblFacilities.AsNoTracking().Select(s => new { s.FacilityId, s.FacilityName }).ToList();

            var tblLabRequisitionType = _appDbContext.TblLabRequisitionTypes.AsNoTracking().ToList();
            var tblRequisitionAccessions = _appDbContext.TblRequisitionSpecimensInfos.AsNoTracking().ToList();
            var tblUsers = _masterDbContext.TblUsers.AsNoTracking().ToList();
            var tblCompendiumPanels = _appDbContext.TblCompendiumPanels.AsNoTracking().ToList();
            var tblLisstatuses = _appDbContext.TblLisstatuses.AsNoTracking().ToList();
            var tblIdlisresultInformations = _appDbContext.TblIdlisresultInformations.AsNoTracking().ToList();
            var LabId = _connectionManager.GetLabId();
            var tableLisresultFileConfigurationSetup = _appDbContext.TblLisresultFileConfigurationSetups.FirstOrDefault(f => f.LabId == LabId);
            #endregion
            #region Query
            var dataSource = (from Source_1 in tblRequisitionMaster
                              join Source_2 in tblRequisitionRecordInfos on Source_1.RequisitionId equals Source_2.RequisitionId
                              into Combine_1
                              from Source_1_2 in Combine_1.DefaultIfEmpty()

                              join Source_3 in tblRequisitionAccessions on Source_1.RequisitionId equals Source_3.RequisitionId
                              into Combine_2
                              from Source_1_3 in Combine_2.DefaultIfEmpty()

                                  //join Source_4 in tblLisresultData on Source_1_2?.RequisitionOrderId equals Source_4.RequisitionId
                                  //into Combine_3
                                  //from Source_1_4 in Combine_3.DefaultIfEmpty()

                              let panel = tblRequisitionPanels.FirstOrDefault(f => f.ReqTypeId == Source_1_2?.ReqTypeId && f.RequisitionOrderId == Source_1_2?.RequisitionOrderId && f.RequisitionId == Source_1_2?.RequisitionId)
                              //let facility = 
                              where !string.IsNullOrEmpty(Source_1_3?.SpecimenId)
                              select new
                              {
                                  ReqMaster = Source_1,
                                  RecordInfo = Source_1_2,
                                  Accession = Source_1_3,
                                  //RequisitionPanel = Source_1_3,
                                  //LisresultData = Source_1_4,
                                  Panel = panel
                              })
                                  .Select(s => new IDResultDataResponse()
                                  {
                                      RequisitionId = Convert.ToInt32(s.ReqMaster?.RequisitionId),
                                      AccessionNumber = s.Accession != null ? s.Accession?.SpecimenId : null,
                                      ReceiveDate = s.RecordInfo?.DateReceived != null ? Convert.ToDateTime(s.RecordInfo?.DateReceived).ToString("MM/dd/yyyy") : null,
                                      PublishBy = s.RecordInfo != null ? tblUsers.FirstOrDefault(f => f.Id == s.RecordInfo.PublishBy)?.FirstName != null ? tblUsers.FirstOrDefault(f => f.Id == s.RecordInfo.PublishBy)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == s.RecordInfo.PublishBy)?.LastName : s.RecordInfo.PublishBy : "",
                                      PublishDate = s.RecordInfo?.PublishedDate != null ? Convert.ToDateTime(s.RecordInfo?.PublishedDate).ToString("MM/dd/yyyy") : null,
                                      TestType = s.Panel != null ? tblCompendiumPanels.FirstOrDefault(f => f.Id == s.Panel.PanelId)?.PanelName : null,
                                      //ResultValue = s.LisresultData != null ? s.LisresultData.Result : "",
                                      LisStatus = s.RecordInfo != null ? tblLisstatuses.FirstOrDefault(f => f.LisstatusId == (s.RecordInfo.Lisstatus != null ? Convert.ToInt32(s.RecordInfo.Lisstatus) : 0))?.Name : "",
                                      FirstName = s.ReqMaster?.FirstName,
                                      LastName = s.ReqMaster?.LastName,
                                      DateOfBirth = s.ReqMaster?.Dob != null ? Convert.ToDateTime(s.ReqMaster?.Dob).ToString("MM/dd/yyyy") : null,
                                      RequisitionType = tblLabRequisitionType.FirstOrDefault(f => f.ReqTypeId == Convert.ToInt32(s.RecordInfo?.ReqTypeId))?.RequisitionType,
                                      ReqTypeId = s.RecordInfo != null ? s.RecordInfo?.ReqTypeId : null,
                                      ValidateReport = "",
                                      PublishReport = "",
                                      BatchId = "",
                                      RequisitionStatusId = s.ReqMaster?.RequisitionStatus,
                                      RecordId = s.RecordInfo?.RecordId,
                                      RequisitionOrderId = s.RecordInfo?.RequisitionOrderId,
                                      FacilityId = s.ReqMaster?.FacilityId,
                                      FacilityName = tblFacilities.FirstOrDefault(f => f.FacilityId == s.ReqMaster?.FacilityId)?.FacilityName,
                                      Configs = new ConfigurationSettings()
                                      {
                                          CalculationOnCqConf = tableLisresultFileConfigurationSetup?.CalculationOnCqConf,
                                          CalculationOnCt = tableLisresultFileConfigurationSetup?.CalculationOnCt,
                                          CalculationOnAmpScore = tableLisresultFileConfigurationSetup?.CalculationOnAmpScore

                                      },
                                      Controls = tblIdlisresultInformations
                                      .Where(info => info.OrganismType.ToLower().Trim() == "control" && info.AccessionNumber == s.Accession?.SpecimenId)
                                      .Select(controlInfo => new Control
                                      {
                                          Id = controlInfo.Id,
                                          ControlName = controlInfo.TestName,
                                          Results = controlInfo.Result,
                                          CombinedResult = controlInfo.CombinedResult,
                                          CTValue = controlInfo.Ct,
                                          AmpScore = controlInfo.Ampscore,
                                          CrtSD = controlInfo.Crtsd,
                                          CqConf = controlInfo.CqConf,
                                          IsReRun = controlInfo.IsReRun
                                      }).ToList(),

                                      Pathogens = tblIdlisresultInformations
                                      .Where(info => (info.OrganismType.ToLower().Trim() == "pathogen" || info.OrganismType.ToLower().Trim() == "resistance") && info.AccessionNumber == s.Accession?.SpecimenId)
                                      .GroupBy(info => info.PanelName) // Group by PanelName
                                      .Select(groupedInfo => new Pathogen
                                      {
                                          PanelName = groupedInfo.Key,
                                          Organisms = groupedInfo.Where(w => w.OrganismType.ToLower().Trim() == "pathogen")
                                          .Select(pathogenInfo => new OrganismResistance
                                          {
                                              Id = pathogenInfo.Id,
                                              Organism = pathogenInfo.TestName,
                                              OrganismType = pathogenInfo.OrganismType,
                                              Results = pathogenInfo.Result,
                                              CombinedResult = pathogenInfo.CombinedResult,
                                              RepetitionNo = pathogenInfo.RepetitionNo,
                                              CTValue = pathogenInfo.Ct,
                                              AmpScore = pathogenInfo.Ampscore,
                                              CrtSD = pathogenInfo.Crtsd,
                                              CqConf = pathogenInfo.CqConf,
                                              IsReRun = pathogenInfo.IsReRun,
                                              Comments = pathogenInfo.Comments,
                                              PanelName = pathogenInfo.PanelName
                                          }).ToList(),
                                          Resistance = groupedInfo.Where(w => w.OrganismType.ToLower().Trim() == "resistance")
                                          .Select(s => new OrganismResistance()
                                          {
                                              Id = s.Id,
                                              Organism = s.TestName,
                                              OrganismType = s.OrganismType,
                                              Results = s.Result,
                                              CombinedResult = s.CombinedResult,
                                              CTValue = s.Ct,
                                              AmpScore = s.Ampscore,
                                              RepetitionNo = s.RepetitionNo,
                                              CrtSD = s.Crtsd,
                                              CqConf = s.CqConf,
                                              IsReRun = s.IsReRun,
                                              Comments = s.Comments,
                                              PanelName = s.PanelName

                                          }).ToList()
                                      }).ToList()
                                  }).OrderByDescending(x => x.RequisitionId).DistinctBy(d => d.RequisitionId).ToList();

            #endregion
            #region Filter

            if (!string.IsNullOrEmpty(query.QueryModel?.AccessionNumber))
            {
                dataSource = dataSource.Where(f => f.AccessionNumber != null && f.AccessionNumber.Trim().ToLower().Contains(query.QueryModel?.AccessionNumber.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ReceiveDate))
            {
                dataSource = dataSource.Where(f => f.ReceiveDate != null && f.ReceiveDate == query.QueryModel?.ReceiveDate).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PublishDate))
            {
                dataSource = dataSource.Where(f => f.PublishDate != null && f.PublishDate == query.QueryModel?.PublishDate).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ResultValue))
            {
                dataSource = dataSource.Where(f => f.ResultValue != null && f.ResultValue.Trim().ToLower().Contains(query.QueryModel?.ResultValue.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestType))
            {
                dataSource = dataSource.Where(f => f.TestType != null && f.TestType.Trim().ToLower().Contains(query.QueryModel?.TestType.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LisStatus))
            {
                dataSource = dataSource.Where(f => f.LisStatus != null && f.LisStatus.Trim().ToLower().Contains(query.QueryModel?.LisStatus.Trim().ToLower())).ToList();
            }

            if (query.QueryModel?.FacilityId > 0)
            {
                dataSource = dataSource.Where(f => f.FacilityId.Equals(query.QueryModel.FacilityId)).ToList();
            }

            if (!string.IsNullOrEmpty(query.QueryModel?.FacilityName))
            {
                dataSource = dataSource.Where(f => f.FacilityName != null && f.FacilityName.Trim().ToLower().Contains(query.QueryModel?.FacilityName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.FirstName))
            {
                dataSource = dataSource.Where(f => f.FirstName != null && f.FirstName.Trim().ToLower().Contains(query.QueryModel?.FirstName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LastName))
            {
                dataSource = dataSource.Where(f => f.LastName != null && f.LastName.Trim().ToLower().Contains(query.QueryModel?.LastName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.DateOfBirth))
            {
                dataSource = dataSource.Where(f => f.DateOfBirth != null && f.DateOfBirth == query.QueryModel?.DateOfBirth).ToList();
            }
            //if (!string.IsNullOrEmpty(query.QueryModel?.re))
            //{
            //    dataSource = dataSource.Where(f => f.RequisitionType != null && f.RequisitionType.Trim().ToLower().Contains(query.QueryModel?.RequisitionType.Trim().ToLower())).ToList();
            //}
            if (!string.IsNullOrEmpty(query.QueryModel?.BatchId))
            {
                dataSource = dataSource.Where(f => f.BatchId != null && f.BatchId.Trim().ToLower().Contains(query.QueryModel?.BatchId.Trim().ToLower())).ToList();
            }

            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();

            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy($"RequisitionId desc").ToList();
            }

            response.Total = dataSource.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.StatusCode = HttpStatusCode.OK;
            response.Data = dataSource;

            return response;
        }
        #endregion
        public RequestResponse ChangeControlsStatus(ChangeControlsStatusRequest request)
        {
            var response = new RequestResponse();

            var IdsList = request?.Controls?.Select(s => s.Id).ToList();
            var existingrows = _appDbContext.TblIdlisresultInformations.Where(w => IdsList.Contains(w.Id)).ToList();
            foreach (var item in existingrows)
            {
                if (string.IsNullOrEmpty(item.Result))
                {
                    if (request.Status.Trim().ToLower() == "pass")
                    {
                        item.Result = "Pass";
                    }
                    if (request.Status.Trim().ToLower() == "fail")
                    {
                        item.Result = "Fail";
                    }
                }
            }
            _appDbContext.TblIdlisresultInformations.UpdateRange(existingrows);
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Successfully Processed...";
            }
            return response;
        }
        public RequestResponse ChangeOrganismStatus(ChangeOrganismStatusRequest request)
        {
            var response = new RequestResponse();

            var pathogenIdsList = request?.Pathogens?.Organisms?.Select(s => s.Id).ToList();//SelectMany(p => p.Organisms.Select(o => o.Id)).ToList();
            var resistanceIdsList = request?.Pathogens?.Resistance?.Select(s => s.Id).ToList();
            var existingrows = _appDbContext.TblIdlisresultInformations.Where(w => pathogenIdsList.Contains(w.Id) || resistanceIdsList.Contains(w.Id)).ToList();
            foreach (var item in existingrows)
            {
                if (string.IsNullOrEmpty(item.Result))
                {
                    if (request.Status.Trim().ToLower() == "undetermined")
                    {
                        item.Ct = "Undetermined";
                    }
                    if (request.Status.Trim().ToLower() == "inconclusive")
                    {
                        item.Result = "Inconclusive";
                    }
                }
            }
            _appDbContext.TblIdlisresultInformations.UpdateRange(existingrows);
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Successfully Processed...";
            }
            return response;
        }
        public RequestResponse PublishAndValidate(IDLISResultDataValidateRequest request)
        {
            var response = new RequestResponse();
            var existingRecord = _appDbContext.TblRequisitionOrders.FirstOrDefault(w => w.RequisitionId == request.RequisitionId && w.RecordId == request.RecordId);
            if (existingRecord != null)
            {
                existingRecord.ValidatedBy = LoggedInUser;
                existingRecord.ValidationDate = DateTime.UtcNow;
                existingRecord.PublishedDate = DateTime.UtcNow;
                existingRecord.PublishBy = LoggedInUser;
                existingRecord.Lisstatus = "3";
                _appDbContext.TblRequisitionOrders.Update(existingRecord);
                var existingRecord2 = _appDbContext.TblRequisitionMasters.FirstOrDefault(w => w.RequisitionId == request.RequisitionId);
                if (existingRecord2 != null)
                {
                    existingRecord2.RequisitionStatus = 3;
                    _appDbContext.TblRequisitionMasters.Update(existingRecord2);

                }

            }

            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Successfully Processed...";
            }
            return response;
        }
        public RequestResponse BulkPublishAndValidate(IDLISResultDataValidateRequest[] request)
        {
            var response = new RequestResponse();
            var tblRequisitionOrdersrows = _appDbContext.TblRequisitionOrders.ToList();
            var tblRequisitionMastersrows = _appDbContext.TblRequisitionMasters.ToList();
            foreach (var temp in request)
            {
                var existingRecord = tblRequisitionOrdersrows.FirstOrDefault(w => w.RequisitionId == temp.RequisitionId && w.RecordId == temp.RecordId);
                if (existingRecord != null)
                {
                    existingRecord.ValidatedBy = LoggedInUser;
                    existingRecord.ValidationDate = DateTime.UtcNow;
                    existingRecord.PublishedDate = DateTime.UtcNow;
                    existingRecord.PublishBy = LoggedInUser;
                    existingRecord.Lisstatus = "3";
                    _appDbContext.TblRequisitionOrders.Update(existingRecord);
                    var existingRecord2 = tblRequisitionMastersrows.FirstOrDefault(w => w.RequisitionId == temp.RequisitionId);
                    if (existingRecord2 != null)
                    {
                        existingRecord2.RequisitionStatus = 3;
                        _appDbContext.TblRequisitionMasters.Update(existingRecord2);

                    }

                }
            }

            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Successfully Processed...";
            }
            return response;
        }
        public RequestResponse Archive(int[] selectedRow)
        {
            RequestResponse response = new RequestResponse();
            foreach (int row in selectedRow)
            {
                var existing = _appDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == row);
                if (existing != null)
                {
                    existing.RequisitionStatus = 5;
                    existing.UpdatedBy = LoggedInUser;
                    existing.UpdatedDate = DateTimeNow.Get;
                    _appDbContext.TblRequisitionMasters.Update(existing);
                    //var existinginChild = _appDbContext.TblRequisitionRecordInfos.FirstOrDefault(f => f.RequisitionId == row);
                    //if (existinginChild != null)
                    //{
                    //    existinginChild.IsDeleted = true;
                    //    existinginChild.DeletedBy = LoggedInUser;
                    //    existinginChild.DeletedDate = DateTimeNow.Get;
                    //    _appDbContext.TblRequisitionRecordInfos.Update(existinginChild);

                    //}
                }
            }
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Successfully Processed.";

            }
            return response;
        }
        public RequestResponse Restore(int[] selectedRow)
        {
            RequestResponse response = new RequestResponse();
            foreach (int id in selectedRow)
            {
                var existingRecord = _appDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == id);
                if (existingRecord != null)
                {
                    existingRecord.RequisitionStatus = 1;
                    existingRecord.UpdatedBy = LoggedInUser;
                    existingRecord.UpdatedDate = DateTimeNow.Get;
                    _appDbContext.TblRequisitionMasters.Update(existingRecord);
                }
            }
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "Request Proccessed Successfully...";
                response.StatusCode = HttpStatusCode.OK;
                //response.Status = "Success";
            }
            return response;
        }
        public RequestResponse<FileContentResult> IDResultDataExportToExcel(int[]? selectedRow)
        {
            var response = new RequestResponse<FileContentResult>();

            #region Source

            var tblRequisitionMaster = _appDbContext.TblRequisitionMasters.Where(f => f.IsDeleted == false).ToList();
            var tblRequisitionRecordInfos = _appDbContext.TblRequisitionOrders.Where(f => f.IsDeleted == false).ToList();
            var tblRequisitionPanels = _appDbContext.TblRequisitionPanels.ToList();
            //var tblLisresultData = _appDbContext.TblLisresultData.ToList();
            var tblRequisitionAccessions = _appDbContext.TblRequisitionSpecimensInfos.AsNoTracking().ToList();
            var tblLabRequisitionType = _appDbContext.TblLabRequisitionTypes.ToList();
            var tblCompendiumPanels = _appDbContext.TblCompendiumPanels.ToList();
            var tblLisstatuses = _appDbContext.TblLisstatuses.ToList();
            var tblWorkFlowStatuses = _appDbContext.TblWorkFlowStatuses.ToList();
            var tblFacilities = _appDbContext.TblFacilities.ToList();

            #endregion
            #region Query
            var data = (from Source_1 in tblRequisitionMaster
                        join Source_2 in tblRequisitionRecordInfos on Source_1.RequisitionId equals Source_2.RequisitionId
                        into Combine_1
                        from Source_1_2 in Combine_1.DefaultIfEmpty()
                            // need to add TblrequisitionAccsssion in Join
                            //join Source_3 in tblLisresultData on Source_1_2?.AccessionNumber equals Source_3.AccessionNumber// requi
                            //into Combine_2
                            //from Source_1_3 in Combine_2.DefaultIfEmpty()

                        join Source_3 in tblRequisitionAccessions on Source_1.RequisitionId equals Source_3.RequisitionId
                             into Combine_2
                        from Source_1_3 in Combine_2.DefaultIfEmpty()

                        let panel = tblRequisitionPanels.FirstOrDefault(f => f.ReqTypeId == Source_1_2?.ReqTypeId && f.RequisitionId == Source_1_2?.RequisitionId)
                        where !string.IsNullOrEmpty(Source_1_3?.SpecimenId)

                        select new
                        {
                            ReqMaster = Source_1,
                            RecordInfo = Source_1_2,
                            Accession = Source_1_3,
                            //RequisitionPanel = Source_1_3,
                            //LisresultData = Source_1_3, 
                            Panel = panel
                        })
                                  .Select(s => new IDResultDataExportToExcel()
                                  {
                                      RequisitionId = Convert.ToInt32(s.ReqMaster?.RequisitionId),
                                      AccessionNumber = s.Accession != null ? s.Accession?.SpecimenId : null,
                                      ReceiveDate = s.RecordInfo?.DateReceived != null ? Convert.ToDateTime(s.RecordInfo?.DateReceived).ToString("MM/dd/yyyy") : null,
                                      ReceiveTime = s.RecordInfo?.DateReceived != null ? Convert.ToDateTime(s.RecordInfo?.DateReceived).ToString("hh:mm:ss") : null,
                                      LisStatus = s.RecordInfo != null ? tblLisstatuses.FirstOrDefault(f => f.LisstatusId == (s.RecordInfo.Lisstatus != null ? Convert.ToInt32(s.RecordInfo.Lisstatus) : 0))?.Name : "",
                                      //ResultValue = s.LisresultData != null ? s.LisresultData.Result : "",
                                      FacilityName = s.ReqMaster?.FacilityId != null ? _appDbContext.TblFacilities.FirstOrDefault(f => f.FacilityId == s.ReqMaster.FacilityId)?.FacilityName : "",
                                      FacilityState = s.ReqMaster?.FacilityId != null ? _appDbContext.TblFacilities.FirstOrDefault(f => f.FacilityId == s.ReqMaster.FacilityId)?.State : "",
                                      CollectionDate = s.ReqMaster?.DateofCollection != null ? Convert.ToDateTime(s.ReqMaster?.DateofCollection).ToString("MM/dd/yyyy") : null,
                                      CollectionTime = s.ReqMaster?.TimeofCollection != null ? s.ReqMaster.TimeofCollection.ToString() : null,
                                      FirstName = s.ReqMaster?.FirstName,
                                      LastName = s.ReqMaster?.LastName,
                                      DateOfBirth = s.ReqMaster?.Dob != null ? Convert.ToDateTime(s.ReqMaster?.Dob).ToString("MM/dd/yyyy") : null,
                                      TestType = s.Panel != null ? tblCompendiumPanels.FirstOrDefault(f => f.Id == s.Panel.PanelId)?.PanelName : null,
                                      WorkFlowStatus = s.RecordInfo != null ? tblWorkFlowStatuses.FirstOrDefault(f => f.Id == Convert.ToInt32(s.RecordInfo.WorkFlowStatus))?.WorkFlowDisplayName : null,
                                      LabName = s.RecordInfo != null ? _masterDbContext.TblLabs.FirstOrDefault(f => f.LabId == s.RecordInfo.LabId)?.DisplayName : "",
                                      RequisitionType = tblLabRequisitionType.FirstOrDefault(f => f.ReqTypeId == Convert.ToInt32(s.RecordInfo?.ReqTypeId))?.RequisitionType,

                                  }).OrderByDescending(x => x.RequisitionId).DistinctBy(d => d.RequisitionId).ToList();


            if (selectedRow?.Count() > 0)
            {
                data = data.Where(f => selectedRow.Contains(f.RequisitionId)).ToList();
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


            worksheet.Cells[1, 1].Value = "Accession Number";
            worksheet.Cells[1, 2].Value = "Received Date";
            worksheet.Cells[1, 3].Value = "Received Time";
            worksheet.Cells[1, 4].Value = "LIS Status";
            worksheet.Cells[1, 5].Value = "Result Value";
            worksheet.Cells[1, 6].Value = "Facility Name";
            worksheet.Cells[1, 7].Value = "Facility State";
            worksheet.Cells[1, 8].Value = "Date Of Collection";
            worksheet.Cells[1, 9].Value = "Time Of Collection";
            worksheet.Cells[1, 10].Value = "First Name";
            worksheet.Cells[1, 11].Value = "Last Name";
            worksheet.Cells[1, 12].Value = "Patient DOB";
            worksheet.Cells[1, 13].Value = "PanelTestName";
            worksheet.Cells[1, 14].Value = "Status";
            worksheet.Cells[1, 15].Value = "Reference Lab";
            worksheet.Cells[1, 16].Value = "Requisition Type";

            #endregion
            #region Add data to the worksheet
            for (var i = 0; i < data.Count(); i++)
            {
                var row = i + 2;
                worksheet.Cells[row, 1].Value = data[i].AccessionNumber;
                worksheet.Cells[row, 2].Value = data[i].ReceiveDate;
                worksheet.Cells[row, 3].Value = data[i].ReceiveTime;
                worksheet.Cells[row, 4].Value = data[i].LisStatus;
                worksheet.Cells[row, 5].Value = data[i].ResultValue;
                worksheet.Cells[row, 6].Value = data[i].FacilityName;
                worksheet.Cells[row, 7].Value = data[i].FacilityState;
                worksheet.Cells[row, 8].Value = data[i].CollectionDate;
                worksheet.Cells[row, 9].Value = data[i].CollectionTime;
                worksheet.Cells[row, 10].Value = data[i].FirstName;
                worksheet.Cells[row, 11].Value = data[i].LastName;
                worksheet.Cells[row, 12].Value = data[i].DateOfBirth;
                worksheet.Cells[row, 13].Value = data[i].TestType;
                worksheet.Cells[row, 14].Value = data[i].WorkFlowStatus;
                worksheet.Cells[row, 15].Value = data[i].LabName;
                worksheet.Cells[row, 16].Value = data[i].RequisitionType;

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
            worksheet.Column(15).AutoFit();
            worksheet.Column(16).AutoFit();

            #endregion

            response.Data = new FileContentResult(package.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Processed Successfully";

            return response;
        }
        public RequestResponse SaveIdResultDataExpand(IDLISResultDataExpandRequest request)
        {
            var response = new RequestResponse();

            List<OrganismResistance> data = new List<OrganismResistance>();
            foreach (var temp in request.Controls)
            {
                var organismResistance = new OrganismResistance();
                organismResistance.Id = temp.Id;
                organismResistance.Organism = temp.ControlName;
                organismResistance.Results = temp.Results;
                organismResistance.CombinedResult = temp.CombinedResult;
                organismResistance.CTValue = temp.CTValue;
                organismResistance.AmpScore = temp.AmpScore;
                organismResistance.CrtSD = temp.CrtSD;
                organismResistance.CqConf = temp.CqConf;
                organismResistance.IsReRun = temp.IsReRun;
                //organismResistance.OrganismType = "Control";
                data.Add(organismResistance);
            }
            foreach (var temp in request.Pathogens)
            {
                data.AddRange(temp.Organisms);
                data.AddRange(temp.Resistance);
            }
            var tblIdlisresultInformations = _appDbContext.TblIdlisresultInformations.ToList();

            foreach (var row in data)
            {
                var existingRow = tblIdlisresultInformations.FirstOrDefault(w => w.Id == row.Id);
                if (existingRow != null)
                {
                    existingRow.Result = row.Results;
                    existingRow.CombinedResult = row.CombinedResult;
                    existingRow.Ct = row.CTValue;
                    existingRow.Ampscore = row.AmpScore;
                    existingRow.Crtsd = row.CrtSD;
                    existingRow.CqConf = row.CqConf;
                    existingRow.IsReRun = row.IsReRun;
                    if (existingRow.OrganismType.Trim().ToLower() != "control")
                    {
                        existingRow.Comments = row.Comments;
                    }
                    _appDbContext.TblIdlisresultInformations.Update(existingRow);
                }
            }
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                var param = new DynamicParameters();
                param.Add("@RequisitionOrderId", request?.RequisitionOrderId ?? 0);

                var execute_sp = _dapperManager.SP_Execute<bool>("[dbo].[sp_CalculateIDManualResults]", param).GetAwaiter().GetResult().FirstOrDefault();
                if (execute_sp)
                {
                    response.StatusCode = HttpStatusCode.OK;
                    response.Message = "Request Proccessed Successfully...";
                }
                else
                {
                    response.StatusCode = HttpStatusCode.BadRequest;
                    response.Message = "Something went wrong...";
                }
            }

            return response;
        }

        public RequestResponse GenerateBlanksAgainstReqOrderId(int reqOrderId)
        {
            var response = new RequestResponse();

            var param = new DynamicParameters();
            param.Add("@RequisitionOrderID", reqOrderId, dbType: DbType.Int32);


            var execute_sp = _dapperManager.SP_ExecuteNoReturnAsync("[dbo].[sp_InsertIDBlanks]", param).GetAwaiter().GetResult();
            if (execute_sp == 1)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Proccessed Successfully...";
            }
            else
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Something went wrong...";
            }

            return response;
        }
    }
}
