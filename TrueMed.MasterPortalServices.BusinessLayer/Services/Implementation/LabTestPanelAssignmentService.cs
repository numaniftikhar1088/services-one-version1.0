using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Response;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.Sevices.MasterEntities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class LabTestPanelAssignmentService : ILabTestPanelAssignmentService
    {
        private readonly MasterDbContext _masterDbContext;
        private readonly IConnectionManager _connectionManager;
        private readonly IMapper _mapper;

        public LabTestPanelAssignmentService(MasterDbContext masterDbContext, IMapper mapper, IConnectionManager connectionManager)
        {
            _masterDbContext = masterDbContext;
            _mapper = mapper;
            _connectionManager = connectionManager;
        }

        #region Commands
        public TrueMed.Domain.Models.Response.RequestResponse Save(LabTestPanelAssignmentSaveRequest request)
        {
            var response = new TrueMed.Domain.Models.Response.RequestResponse();

            var entity = _mapper.Map<LabTestPanelAssignmentSaveRequest,TblLabTestPanelAssignment>(request);
            if (entity.Id == 0)
            {
                entity.CreatedBy = _connectionManager.UserId;
                entity.CreatedDate = DateTimeNow.Get;
                entity.IsDeleted = false;

                _masterDbContext.TblLabTestPanelAssignments.Add(entity);
                response.Message = "Record Saved Successfully...";
            }
            else
            {
                var existingEntity = _masterDbContext.TblLabTestPanelAssignments.AsNoTracking().FirstOrDefault(f => f.Id == entity.Id);
                if (existingEntity != null)
                {
                    var createdBy = existingEntity.CreatedBy;
                    var createdDate = existingEntity.CreatedDate;

                    existingEntity = entity;
                    existingEntity.UpdatedBy = _connectionManager.UserId;
                    existingEntity.UpdatedDate = DateTimeNow.Get;

                    existingEntity.CreatedBy = createdBy;
                    existingEntity.CreatedDate = createdDate;

                    _masterDbContext.TblLabTestPanelAssignments.Update(existingEntity);
                    response.Message = "Record Updated Successfully...";
                }
            }
            var ack = _masterDbContext.SaveChanges();
            if (ack > 0)
                response.StatusCode = HttpStatusCode.OK;

            return response;
        }
        public Domain.Models.Response.RequestResponse DeleteById(int id)
        {
            var response = new Domain.Models.Response.RequestResponse();

            var entityForDelete = _masterDbContext.TblLabTestPanelAssignments.FirstOrDefault(f => f.Id == id);
            if (entityForDelete !=null)
            {
                entityForDelete.IsDeleted = true;
                entityForDelete.DeletedDate = DateTimeNow.Get;
                entityForDelete.DeletedBy = _connectionManager.UserId;

                _masterDbContext.TblLabTestPanelAssignments.Update(entityForDelete);
            }
            var ack = _masterDbContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "Record Deleted Successfully...";
                response.StatusCode= HttpStatusCode.OK;
            }
            return response;
        }
        #endregion
        #region Queries
        public Domain.Models.Response.RequestResponse<LabTestPanelAssignmentSaveResponse> GetById(int id)
        {
            var response = new Domain.Models.Response.RequestResponse<LabTestPanelAssignmentSaveResponse>();

            var dataSource = _masterDbContext.TblLabTestPanelAssignments
                .Include(p => p.Panel)
                .Include(t => t.Test)
                .Include(rt => rt.ReqType)
                .Include(l => l.Lab).Select(s => new LabTestPanelAssignmentSaveResponse()
                {
                    Id = s.Id,
                    PanelId = s.Panel != null ? s.Panel.PanelId : 0,
                    PanelName = s.Panel != null ? s.Panel.PanelName : "",
                    PanelDisplayName = s.Panel != null ? s.Panel.PanelDisplayName : "",
                    PanelTMITCode = s.Panel != null ? s.Panel.Tmitcode : "",
                    PanelNetworkType = s.Panel != null ? s.Panel.NetworkType : "",
                    TestId = s.Test != null ? s.Test.TestId : 0,
                    TestName = s.Test != null ? s.Test.TestName : "",
                    TestDisplayName = s.Test != null ? s.Test.TestDisplayName : "",
                    TestTMITCode = s.Test != null ? s.Test.Tmitcode : "",
                    TestNetworkType = s.Test != null ? s.Test.NetworkType : "",
                    ReqTypeId = s.ReqType != null ? s.ReqType.ReqTypeId : 0,
                    RequisitionType = s.ReqType != null ? s.ReqType.RequisitionType : "",
                    RequisitionTypeName = s.ReqType != null ? s.ReqType.RequisitionTypeName : "",
                    RequisitionColor = s.ReqType != null ? s.ReqType.RequisitionColor : "",
                    LabId = s.Lab != null ? s.Lab.LabId : 0,
                    LaboratoryName = s.Lab != null ? s.Lab.LaboratoryName : "",
                    LaboratoryDiplayName = s.Lab != null ? s.Lab.DisplayName : ""

                }).FirstOrDefault(f => f.Id == id);
            response.Data = dataSource;
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Proccessed Successfully...";
            return response;
        }
        public DataQueryResponse<List<LabTestPanelAssignmentSaveResponse>> GetAll(DataQueryModel<LabTestPanelAssignmentQueryModel> query)
        {
            var response = new DataQueryResponse<List<LabTestPanelAssignmentSaveResponse>>();

            var dataSource = _masterDbContext.TblLabTestPanelAssignments
                .Include(p => p.Panel)
                .Include(t => t.Test)
                .Include(rt => rt.ReqType)
                .Include(l => l.Lab).Select(s => new LabTestPanelAssignmentSaveResponse() 
                {
                    Id = s.Id,
                    PanelId = s.Panel !=null ? s.Panel.PanelId : 0,
                    PanelName = s.Panel != null ? s.Panel.PanelName : "",
                    PanelDisplayName = s.Panel != null ? s.Panel.PanelDisplayName : "",
                    PanelTMITCode = s.Panel != null ? s.Panel.Tmitcode : "",
                    PanelNetworkType = s.Panel != null ? s.Panel.NetworkType : "",
                    TestId = s.Test != null ? s.Test.TestId : 0,
                    TestName = s.Test != null ? s.Test.TestName : "",
                    TestDisplayName = s.Test != null ? s.Test.TestDisplayName : "",
                    TestTMITCode = s.Test != null ? s.Test.Tmitcode : "",
                    TestNetworkType = s.Test != null ? s.Test.NetworkType : "",
                    ReqTypeId = s.ReqType != null ? s.ReqType.ReqTypeId : 0,
                    RequisitionType = s.ReqType != null ? s.ReqType.RequisitionType : "",
                    RequisitionTypeName = s.ReqType != null ? s.ReqType.RequisitionTypeName : "",
                    RequisitionColor = s.ReqType != null ? s.ReqType.RequisitionColor : "",
                    LabId = s.Lab != null ? s.Lab.LabId : 0,
                    LaboratoryName = s.Lab != null ? s.Lab.LaboratoryName : "",
                    LaboratoryDiplayName = s.Lab != null ? s.Lab.DisplayName : ""

                }).OrderByDescending(o => o.Id).ToList();
            #region Filter
            if (query.QueryModel?.Id > 0)
            {
                dataSource = dataSource.Where(f => f.Id == query.QueryModel?.Id).ToList();
            }
            if (query.QueryModel?.PanelId > 0)
            {
                dataSource = dataSource.Where(f => f.PanelId == query.QueryModel?.PanelId).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PanelName))
            {
                dataSource = dataSource.Where(f => f.PanelName != null && f.PanelName.Trim().ToLower().Contains(query.QueryModel?.PanelName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PanelDisplayName))
            {
                dataSource = dataSource.Where(f => f.PanelDisplayName != null && f.PanelDisplayName.Trim().ToLower().Contains(query.QueryModel?.PanelDisplayName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PanelTMITCode))
            {
                dataSource = dataSource.Where(f => f.PanelTMITCode != null && f.PanelTMITCode.Trim().ToLower().Contains(query.QueryModel?.PanelTMITCode.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PanelNetworkType))
            {
                dataSource = dataSource.Where(f => f.PanelNetworkType != null && f.PanelNetworkType.Trim().ToLower().Contains(query.QueryModel?.PanelNetworkType.Trim().ToLower())).ToList();
            }
            if (query.QueryModel?.TestId > 0)
            {
                dataSource = dataSource.Where(f => f.TestId == query.QueryModel?.TestId).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestName))
            {
                dataSource = dataSource.Where(f => f.TestName != null && f.TestName.Trim().ToLower().Contains(query.QueryModel?.TestName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestDisplayName))
            {
                dataSource = dataSource.Where(f => f.TestDisplayName != null && f.TestDisplayName.Trim().ToLower().Contains(query.QueryModel?.TestDisplayName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestTMITCode))
            {
                dataSource = dataSource.Where(f => f.TestTMITCode != null && f.TestTMITCode.Trim().ToLower().Contains(query.QueryModel?.TestTMITCode.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.TestNetworkType))
            {
                dataSource = dataSource.Where(f => f.TestNetworkType != null && f.TestNetworkType.Trim().ToLower().Contains(query.QueryModel?.TestNetworkType.Trim().ToLower())).ToList();
            }
            if (query.QueryModel?.ReqTypeId > 0)
            {
                dataSource = dataSource.Where(f => f.ReqTypeId == query.QueryModel?.ReqTypeId).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionType))
            {
                dataSource = dataSource.Where(f => f.RequisitionType != null && f.RequisitionType.Trim().ToLower().Contains(query.QueryModel?.RequisitionType.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionTypeName))
            {
                dataSource = dataSource.Where(f => f.RequisitionTypeName != null && f.RequisitionTypeName.Trim().ToLower().Contains(query.QueryModel?.RequisitionTypeName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionColor))
            {
                dataSource = dataSource.Where(f => f.RequisitionColor != null && f.RequisitionColor.Trim().ToLower().Contains(query.QueryModel?.RequisitionColor.Trim().ToLower())).ToList();
            }
            if (query.QueryModel?.LabId > 0)
            {
                dataSource = dataSource.Where(f => f.LabId == query.QueryModel?.LabId).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LaboratoryName))
            {
                dataSource = dataSource.Where(f => f.LaboratoryName != null && f.LaboratoryName.Trim().ToLower().Contains(query.QueryModel?.LaboratoryName.Trim().ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.LaboratoryDiplayName))
            {
                dataSource = dataSource.Where(f => f.LaboratoryDiplayName != null && f.LaboratoryDiplayName.Trim().ToLower().Contains(query.QueryModel?.LaboratoryDiplayName.Trim().ToLower())).ToList();
            }
            response.Total = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion
            response.Data = dataSource;
            return response;
        }
        #endregion
    }
}
