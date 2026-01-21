using System.Net;
using System.Linq.Dynamic.Core;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Busines.Interfaces;
using TrueMed.LISManagement.Domain.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domain.DTOS.Response;
using TrueMed.LISManagement.Domains.DTOS.Request;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.LISManagement.Busines.Implementations
{
    public class IDLISPreConfiguration : IIDLISPreConfiguration
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ApplicationDbContext _appDbContext;
        private readonly MasterDbContext _masterDbContext;
        private readonly IDapperManager _dapperManager;

        public IDLISPreConfiguration(IConnectionManager connectionManager, ApplicationDbContext appDbContext, MasterDbContext masterDbContext, IDapperManager dapperManager)
        {
            _connectionManager = connectionManager;
            _appDbContext = appDbContext;
            _masterDbContext = masterDbContext;
            LoggedInUser = connectionManager.UserId;
            _dapperManager = dapperManager;

        }
        public string LoggedInUser { get; set; }

        public DataQueryResponse<List<IDLISTemplateSettingResponse>> GetTemplateSettings(DataQueryModel<IDLISTemplateSettingsQM> query)
        {
            var response = new DataQueryResponse<List<IDLISTemplateSettingResponse>>();

            var labID = _connectionManager.GetLabId();
            #region Source
            var tblLisresultFileTemplates = _appDbContext.TblLisresultFileTemplates.Where(w=> w.LabId == labID).ToList();
            var tblLisresultFileTemplateSetups = _appDbContext.TblLisresultFileTemplateSetups.ToList();
            var TblLabs = _masterDbContext.TblLabs.ToList();
            #endregion
            #region Query
            var dataSource = (tblLisresultFileTemplates
                              .Select(s => new IDLISTemplateSettingResponse()
                              {
                                  TemplateId = s.TemplateId,
                                  TemplateName = s.TemplateName,
                                  LabId = s.LabId,
                                  LabName = TblLabs.FirstOrDefault(f=> f.LabId == s.LabId).DisplayName,
                                  Cells = tblLisresultFileTemplateSetups.Where(w=> w.TemplateId == s.TemplateId).Select(st => new TemplateCells()
                                  {
                                      Id = st.Id,
                                      CustomCellName = st.CustomCellName,
                                      SystemCellName = st.SystemCellName,
                                      CustomCellOrder = st.CustomCellOrder,
                                      IsDeleted = st.IsDeleted,

                                  }).ToList()

                              })).OrderByDescending(x => x.TemplateId).ToList();
            #endregion
            #region Filter
            if (query.QueryModel?.LabId > 0)
            {
                dataSource = dataSource.Where(f => f.LabId.Equals(query.QueryModel.LabId)).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TemplateName))
            {
                dataSource = dataSource.Where(f => f.TemplateName!= null && f.TemplateName.Trim().ToLower().Contains(query.QueryModel?.TemplateName.Trim().ToLower())).ToList();
            }
            response.Total = dataSource.Count();



            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                dataSource.AsQueryable().OrderBy("templateId desc").ToList();
            }



            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.StatusCode = HttpStatusCode.OK;
            response.Data = dataSource;

            return response;

           // return new DataQueryResponse<List<IDLISTemplateSettingResponse>>();
        }
        public RequestResponse AddTemplateSettings(AddTemplateSettingRequest request)
        {
            var response = new RequestResponse();

            var tblLisresultFileTemplateSetups = _appDbContext.TblLisresultFileTemplateSetups.ToList();
            var tempId = tblLisresultFileTemplateSetups.First().Id;
            var allCells = tblLisresultFileTemplateSetups.Where(w=> w.TemplateId == tempId).ToList();

            var entity = new TblLisresultFileTemplate();
            entity.TemplateName = request.TemplateName;
            entity.LabId = request.LabId;
            entity.CreatedBy = LoggedInUser;
            entity.CreatedDate = DateTime.UtcNow;

            _appDbContext.TblLisresultFileTemplates.Add(entity);
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                List<TblLisresultFileTemplateSetup> list = new List<TblLisresultFileTemplateSetup>();
                int sortOder = 1;
                foreach (var cell in allCells)
                {
                    TblLisresultFileTemplateSetup obj = new TblLisresultFileTemplateSetup();
                    obj.CustomCellName = cell.SystemCellName;
                    obj.TemplateId = entity.TemplateId;
                    obj.LabId = entity.LabId;
                    obj.CreatedDate = DateTime.UtcNow;
                    obj.SystemCellName = cell.SystemCellName;
                    obj.CustomCellOrder = sortOder++;
                    obj.IsDeleted = false;
                    list.Add(obj);
                }
                _appDbContext.TblLisresultFileTemplateSetups.AddRange(list);
                var ack1 = _appDbContext.SaveChanges();
                if (ack1 > 0)
                {
                    response.StatusCode = HttpStatusCode.OK;
                    response.Message = "Request Successfully Processed...";
                }
            }
            return response;
        }
        public RequestResponse SaveCells(List<TemplateCells> request)
        {
            var response = new RequestResponse();
            var tblLisresultFileTemplateSetups = _appDbContext.TblLisresultFileTemplateSetups.ToList();

            List<TblLisresultFileTemplateSetup> list = new List<TblLisresultFileTemplateSetup>();
            foreach (var cell in request)
            {
                var rec = tblLisresultFileTemplateSetups.FirstOrDefault(f => f.Id == cell.Id);
                if(rec != null)
                {
                    rec.IsDeleted = cell.IsDeleted;
                    rec.CustomCellOrder = cell.CustomCellOrder;
                    rec.CustomCellName = cell.CustomCellName;
                    list.Add(rec);
                }
            }
            _appDbContext.TblLisresultFileTemplateSetups.UpdateRange(list);
            var ack1 = _appDbContext.SaveChanges();
            if (ack1 > 0)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Successfully Processed...";
            }
            return response;
        }

        public RequestResponse<List<IDLISResultFileConfigurationSetupResponse>> GetResultDataSettings()
        {
            var response = new RequestResponse<List<IDLISResultFileConfigurationSetupResponse>>();
            var tblLisresultFileTemplateSetups = _appDbContext.TblLisresultFileConfigurationSetups.ToList();
            var TblLabs = _masterDbContext.TblLabs.ToList();

            var list = new List<IDLISResultFileConfigurationSetupResponse>();
            foreach(var item in tblLisresultFileTemplateSetups)
            {
                var s = new IDLISResultFileConfigurationSetupResponse();
                s.Id = item.Id;
                s.LabId = item.LabId;
                s.LabName = TblLabs.FirstOrDefault(f => f.LabId == item.LabId).LaboratoryName;
                s.CalculationOnCt = item.CalculationOnCt;
                s.CalculationOnCqConf = item.CalculationOnCqConf;
                s.CalculationOnAmpScore = item.CalculationOnAmpScore;
                list.Add(s);
            }
            
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Successfully Processed...";
            response.Data = list;
            return response;
        }
        public RequestResponse SaveResultDataSettings(List<IDLISResultFileConfigurationSetupResponse> request)
        {
            var response = new RequestResponse();
            //var tblLisresultFileTemplateSetups = _appDbContext.TblLisresultFileConfigurationSetups.ToList();
            //var TblLabs = _masterDbContext.TblLabs.ToList();

            var list = new List<TblLisresultFileConfigurationSetup>();
            foreach (var item in request)
            {
                var s = new TblLisresultFileConfigurationSetup();
                s.Id = item.Id;
                s.LabId = item.LabId;
                s.CalculationOnCt = item.CalculationOnCt;
                s.CalculationOnCqConf = item.CalculationOnCqConf;
                s.CalculationOnAmpScore = item.CalculationOnAmpScore;
                list.Add(s);
            }
            _appDbContext.TblLisresultFileConfigurationSetups.UpdateRange(list);
            var ack = _appDbContext.SaveChanges();
            if (ack > 0)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Successfully Processed...";
            }
            return response;
        }
    }
}
