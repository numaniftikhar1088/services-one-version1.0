using System.Net;
using TrueMed.Domain.Databases;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class LabManagementService_v2 : ILabManagementService_v2
    {
        private readonly IConnectionManager _connectionManager;

        private MasterDbContext _masterDbContext;

        public LabManagementService_v2(IConnectionManager connectionManager, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
        }

        public DataQueryResponse<List<LabManagementRespone_v2.GetReferenceLabAssignmentResponse>> GetReferenceLabAssignment(DataQueryModel<LabManagementQueryModel.GetReferenceLabAssignmentQM> query)
        {
            var response = new DataQueryResponse<List<LabManagementRespone_v2.GetReferenceLabAssignmentResponse>>();

            var LabApprovementStatusEnuType = typeof(LabApprovementStatus);
            var labs = _masterDbContext.TblLabs.Where(f => f.IsReferenceLab == false).Select(s => new LabManagementRespone_v2.GetReferenceLabAssignmentResponse()
            {
                LabId = s.LabId,
                CLIA = s.Cliano,
                CreatedDate = s.CreateDate.ToString("d"),
                PrimaryLab = $"{s.DisplayName} ({s.LaboratoryName})",
                ReferenceLab = $"{s.DisplayName} ({s.LaboratoryName})",
                Status = Enum.GetName(LabApprovementStatusEnuType, s.Status == null ? (int?)LabApprovementStatus.Pending : s.Status),
                CreatedBy = $"{_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == s.CreatedBy).FirstName} {_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == s.CreatedBy).LastName}"

            }).OrderByDescending(o => o.LabId).ToList();

            #region Filters
            if (query.QueryModel?.LabId > 0)
                labs = labs.Where(f => f.LabId == query.QueryModel.LabId).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.ReferenceLab))
                labs = labs.Where(f => f.ReferenceLab != null && f.ReferenceLab.Trim().ToLower().Contains(query.QueryModel.ReferenceLab.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.PrimaryLab))
                labs = labs.Where(f => f.PrimaryLab != null && f.PrimaryLab.Trim().ToLower().Contains(query.QueryModel.PrimaryLab.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.CLIA))
                labs = labs.Where(f => f.CLIA != null && f.CLIA.Trim().ToLower().Contains(query.QueryModel.CLIA.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.CreatedBy))
                labs = labs.Where(f => f.CreatedBy != null && f.CreatedBy.Trim().ToLower().Contains(query.QueryModel.CreatedBy.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.Status))
                labs = labs.Where(f => f.Status != null && f.Status.Trim().ToLower().Contains(query.QueryModel.Status.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.CreatedDate))
                labs = labs.Where(f => f.CreatedDate != null && f.CreatedDate.Trim().ToLower().Contains(query.QueryModel.CreatedDate.Trim().ToLower())).ToList();

            response.Total = labs.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
                labs = labs.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            #endregion
            response.Data = labs;

            return response;
        }

        public RequestResponse ReferenceAssignmentStatusChanged(LabManagementRequest_v2.StatusChangedRequest request)
        {
            var response = new RequestResponse();

            var getLabForStatusChanged = _masterDbContext.TblLabs.FirstOrDefault(f => f.LabId == request.LabId);
            if (getLabForStatusChanged != null)
            {
                getLabForStatusChanged.Status = request.Status;
                _masterDbContext.TblLabs.Update(getLabForStatusChanged);
            }
            _masterDbContext.SaveChanges();

            response.HttpStatusCode = Domain.Model.Identity.Status.Success;
            response.Status = "Success";
            response.Message = "Status Chnaged Successfully !";

            return response;
        }
    }
}
