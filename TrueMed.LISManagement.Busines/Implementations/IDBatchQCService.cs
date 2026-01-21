using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.LISManagement.Domains.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.LISManagement.Busines.Implementations
{
    public class IDBatchQCService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _appDbContext;
        private readonly MasterDbContext _masterDbContext;
        private readonly IDapperManager _dapperManager;

        public IDBatchQCService(IConnectionManager connectionManager, ApplicationDbContext appDbContext, MasterDbContext masterDbContext, IDapperManager dapperManager)
        {
            _connectionManager = connectionManager;
            _appDbContext = appDbContext;
            _masterDbContext = masterDbContext;
            LoggedInUser = connectionManager.UserId;
            _dapperManager = dapperManager;

        }

        public string LoggedInUser { get; set; }
        //public DataQueryResponse<List<IDResultDataResponse>> CombineResultIDBatchQCWithExpand(DataQueryModel<IDResultDataQueryModel> query)
        //{
        //    var response = new DataQueryResponse<List<IDResultDataResponse>>();


        //    #region Source
        //    var tblRequisitionMaster = _appDbContext.TblRequisitionMasters.AsNoTracking().Where(f => f.IsDeleted == false && (query.QueryModel.StatusId != null ? f.RequisitionStatus == query.QueryModel.StatusId : true)).ToList();
        //    var tblRequisitionRecordInfos = _appDbContext.TblRequisitionOrders.AsNoTracking().Where(f => f.IsDeleted == false).ToList();
        //    var tblRequisitionPanels = _appDbContext.TblRequisitionPanels.AsNoTracking().ToList();
        //    var tblFacilities = _appDbContext.TblFacilities.AsNoTracking().Select(s => new { s.FacilityId, s.FacilityName }).ToList();

        //    var tblLabRequisitionType = _appDbContext.TblLabRequisitionTypes.AsNoTracking().ToList();
        //    var tblRequisitionAccessions = _appDbContext.TblRequisitionSpecimensInfos.AsNoTracking().ToList();
        //    var tblUsers = _masterDbContext.TblUsers.AsNoTracking().ToList();
        //    var tblCompendiumPanels = _appDbContext.TblCompendiumPanels.AsNoTracking().ToList();
        //    var tblLisstatuses = _appDbContext.TblLisstatuses.AsNoTracking().ToList();
        //    var tblIdlisresultInformations = _appDbContext.TblIdlisresultInformations.AsNoTracking().ToList();
        //    var LabId = _connectionManager.GetLabId();
        //    var tableLisresultFileConfigurationSetup = _appDbContext.TblLisresultFileConfigurationSetups.FirstOrDefault(f => f.LabId == LabId);
        //    #endregion
        //    #region Query
        //    var dataSource = (from Source_1 in tblRequisitionMaster
        //                      join Source_2 in tblRequisitionRecordInfos on Source_1.RequisitionId equals Source_2.RequisitionId
        //                      into Combine_1
        //                      from Source_1_2 in Combine_1.DefaultIfEmpty()

        //                      join Source_3 in tblRequisitionAccessions on Source_1.RequisitionId equals Source_3.RequisitionId
        //                      into Combine_2
        //                      from Source_1_3 in Combine_2.DefaultIfEmpty()

        //                          //join Source_4 in tblLisresultData on Source_1_2?.RequisitionOrderId equals Source_4.RequisitionId
        //                          //into Combine_3
        //                          //from Source_1_4 in Combine_3.DefaultIfEmpty()

        //                      let panel = tblRequisitionPanels.FirstOrDefault(f => f.ReqTypeId == Source_1_2?.ReqTypeId && f.RequisitionOrderId == Source_1_2?.RequisitionOrderId && f.RequisitionId == Source_1_2?.RequisitionId)
        //                      //let facility = 
        //                      where !string.IsNullOrEmpty(Source_1_3?.SpecimenId)
        //                      select new
        //                      {
        //                          ReqMaster = Source_1,
        //                          RecordInfo = Source_1_2,
        //                          Accession = Source_1_3,
        //                          //RequisitionPanel = Source_1_3,
        //                          //LisresultData = Source_1_4,
        //                          Panel = panel
        //                      })
        //                          .Select(s => new IDResultDataResponse()
        //                          {
        //                              RequisitionId = Convert.ToInt32(s.ReqMaster?.RequisitionId),
        //                              AccessionNumber = s.Accession != null ? s.Accession?.SpecimenId : null,
        //                              ReceiveDate = s.RecordInfo?.DateReceived != null ? Convert.ToDateTime(s.RecordInfo?.DateReceived).ToString("MM/dd/yyyy") : null,
        //                              PublishBy = s.RecordInfo != null ? tblUsers.FirstOrDefault(f => f.Id == s.RecordInfo.PublishBy)?.FirstName != null ? tblUsers.FirstOrDefault(f => f.Id == s.RecordInfo.PublishBy)?.FirstName + " " + tblUsers.FirstOrDefault(f => f.Id == s.RecordInfo.PublishBy)?.LastName : s.RecordInfo.PublishBy : "",
        //                              PublishDate = s.RecordInfo?.PublishedDate != null ? Convert.ToDateTime(s.RecordInfo?.PublishedDate).ToString("MM/dd/yyyy") : null,
        //                              TestType = s.Panel != null ? tblCompendiumPanels.FirstOrDefault(f => f.Id == s.Panel.PanelId)?.PanelName : null,
        //                              //ResultValue = s.LisresultData != null ? s.LisresultData.Result : "",
        //                              LisStatus = s.RecordInfo != null ? tblLisstatuses.FirstOrDefault(f => f.LisstatusId == (s.RecordInfo.Lisstatus != null ? Convert.ToInt32(s.RecordInfo.Lisstatus) : 0))?.Name : "",
        //                              FirstName = s.ReqMaster?.FirstName,
        //                              LastName = s.ReqMaster?.LastName,
        //                              DateOfBirth = s.ReqMaster?.Dob != null ? Convert.ToDateTime(s.ReqMaster?.Dob).ToString("MM/dd/yyyy") : null,
        //                              RequisitionType = tblLabRequisitionType.FirstOrDefault(f => f.ReqTypeId == Convert.ToInt32(s.RecordInfo?.ReqTypeId))?.RequisitionType,
        //                              ReqTypeId = s.RecordInfo != null ? s.RecordInfo?.ReqTypeId : null,
        //                              ValidateReport = "",
        //                              PublishReport = "",
        //                              BatchId = "",
        //                              RequisitionStatusId = s.ReqMaster?.RequisitionStatus,
        //                              RecordId = s.RecordInfo?.RecordId,
        //                              RequisitionOrderId = s.RecordInfo?.RequisitionOrderId,
        //                              FacilityId = s.ReqMaster?.FacilityId,
        //                              FacilityName = tblFacilities.FirstOrDefault(f => f.FacilityId == s.ReqMaster?.FacilityId)?.FacilityName,
        //                              Configs = new ConfigurationSettings()
        //                              {
        //                                  CalculationOnCqConf = tableLisresultFileConfigurationSetup?.CalculationOnCqConf,
        //                                  CalculationOnCt = tableLisresultFileConfigurationSetup?.CalculationOnCt,
        //                                  CalculationOnAmpScore = tableLisresultFileConfigurationSetup?.CalculationOnAmpScore

        //                              },
        //                              Controls = tblIdlisresultInformations
        //                              .Where(info => info.OrganismType.ToLower().Trim() == "control" && info.AccessionNumber == s.Accession?.SpecimenId)
        //                              .Select(controlInfo => new Control
        //                              {
        //                                  Id = controlInfo.Id,
        //                                  ControlName = controlInfo.TestName,
        //                                  Results = controlInfo.Result,
        //                                  CombinedResult = controlInfo.CombinedResult,
        //                                  CTValue = controlInfo.Ct,
        //                                  AmpScore = controlInfo.Ampscore,
        //                                  CrtSD = controlInfo.Crtsd,
        //                                  CqConf = controlInfo.CqConf,
        //                                  IsReRun = controlInfo.IsReRun
        //                              }).ToList(),

        //                              Pathogens = tblIdlisresultInformations
        //                              .Where(info => (info.OrganismType.ToLower().Trim() == "pathogen" || info.OrganismType.ToLower().Trim() == "resistance") && info.AccessionNumber == s.Accession?.SpecimenId)
        //                              .GroupBy(info => info.PanelName) // Group by PanelName
        //                              .Select(groupedInfo => new Pathogen
        //                              {
        //                                  PanelName = groupedInfo.Key,
        //                                  Organisms = groupedInfo.Where(w => w.OrganismType.ToLower().Trim() == "pathogen")
        //                                  .Select(pathogenInfo => new OrganismResistance
        //                                  {
        //                                      Id = pathogenInfo.Id,
        //                                      Organism = pathogenInfo.TestName,
        //                                      OrganismType = pathogenInfo.OrganismType,
        //                                      Results = pathogenInfo.Result,
        //                                      CombinedResult = pathogenInfo.CombinedResult,
        //                                      CTValue = pathogenInfo.Ct,
        //                                      AmpScore = pathogenInfo.Ampscore,
        //                                      CrtSD = pathogenInfo.Crtsd,
        //                                      CqConf = pathogenInfo.CqConf,
        //                                      IsReRun = pathogenInfo.IsReRun,
        //                                      Comments = pathogenInfo.Comments,
        //                                      PanelName = pathogenInfo.PanelName
        //                                  }).ToList(),
        //                                  Resistance = groupedInfo.Where(w => w.OrganismType.ToLower().Trim() == "resistance")
        //                                  .Select(s => new OrganismResistance()
        //                                  {
        //                                      Id = s.Id,
        //                                      Organism = s.TestName,
        //                                      OrganismType = s.OrganismType,
        //                                      Results = s.Result,
        //                                      CombinedResult = s.CombinedResult,
        //                                      CTValue = s.Ct,
        //                                      AmpScore = s.Ampscore,
        //                                      CrtSD = s.Crtsd,
        //                                      CqConf = s.CqConf,
        //                                      IsReRun = s.IsReRun,
        //                                      Comments = s.Comments,
        //                                      PanelName = s.PanelName

        //                                  }).ToList()
        //                              }).ToList()
        //                          }).OrderByDescending(x => x.RequisitionId).DistinctBy(d => d.RequisitionId).ToList();

        //    #endregion
        //    #region Filter

        //    if (!string.IsNullOrEmpty(query.QueryModel?.AccessionNumber))
        //    {
        //        dataSource = dataSource.Where(f => f.AccessionNumber != null && f.AccessionNumber.Trim().ToLower().Contains(query.QueryModel?.AccessionNumber.Trim().ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.ReceiveDate))
        //    {
        //        dataSource = dataSource.Where(f => f.ReceiveDate != null && f.ReceiveDate == query.QueryModel?.ReceiveDate).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.PublishDate))
        //    {
        //        dataSource = dataSource.Where(f => f.PublishDate != null && f.PublishDate == query.QueryModel?.PublishDate).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.ResultValue))
        //    {
        //        dataSource = dataSource.Where(f => f.ResultValue != null && f.ResultValue.Trim().ToLower().Contains(query.QueryModel?.ResultValue.Trim().ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.TestType))
        //    {
        //        dataSource = dataSource.Where(f => f.TestType != null && f.TestType.Trim().ToLower().Contains(query.QueryModel?.TestType.Trim().ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.LisStatus))
        //    {
        //        dataSource = dataSource.Where(f => f.LisStatus != null && f.LisStatus.Trim().ToLower().Contains(query.QueryModel?.LisStatus.Trim().ToLower())).ToList();
        //    }

        //    if (query.QueryModel?.FacilityId > 0)
        //    {
        //        dataSource = dataSource.Where(f => f.FacilityId.Equals(query.QueryModel.FacilityId)).ToList();
        //    }

        //    if (!string.IsNullOrEmpty(query.QueryModel?.FacilityName))
        //    {
        //        dataSource = dataSource.Where(f => f.FacilityName != null && f.FacilityName.Trim().ToLower().Contains(query.QueryModel?.FacilityName.Trim().ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.FirstName))
        //    {
        //        dataSource = dataSource.Where(f => f.FirstName != null && f.FirstName.Trim().ToLower().Contains(query.QueryModel?.FirstName.Trim().ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.LastName))
        //    {
        //        dataSource = dataSource.Where(f => f.LastName != null && f.LastName.Trim().ToLower().Contains(query.QueryModel?.LastName.Trim().ToLower())).ToList();
        //    }
        //    if (!string.IsNullOrEmpty(query.QueryModel?.DateOfBirth))
        //    {
        //        dataSource = dataSource.Where(f => f.DateOfBirth != null && f.DateOfBirth == query.QueryModel?.DateOfBirth).ToList();
        //    }
        //    //if (!string.IsNullOrEmpty(query.QueryModel?.re))
        //    //{
        //    //    dataSource = dataSource.Where(f => f.RequisitionType != null && f.RequisitionType.Trim().ToLower().Contains(query.QueryModel?.RequisitionType.Trim().ToLower())).ToList();
        //    //}
        //    if (!string.IsNullOrEmpty(query.QueryModel?.BatchId))
        //    {
        //        dataSource = dataSource.Where(f => f.BatchId != null && f.BatchId.Trim().ToLower().Contains(query.QueryModel?.BatchId.Trim().ToLower())).ToList();
        //    }

        //    if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
        //    {
        //        dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();

        //    }
        //    else
        //    {
        //        dataSource = dataSource.AsQueryable().OrderBy($"RequisitionId desc").ToList();
        //    }

        //    response.Total = dataSource.Count;
        //    if (query.PageNumber > 0 && query.PageSize > 0)
        //    {
        //        dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
        //    }
        //    #endregion
        //    response.StatusCode = HttpStatusCode.OK;
        //    response.Data = dataSource;

        //    return response;
        //}
    }
}
