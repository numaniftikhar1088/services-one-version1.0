using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Datatable;

using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Response;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Interfaces;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Implementations
{
    public class LabAssignmentManagement : ILabAssignmentManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ILabManagement _labManagement;
        private  MasterDbContext _masterDbContext;

        public DbContext DbContext => _masterDbContext;

        public LabAssignmentManagement(IConnectionManager connectionManager, ILabManagement labManagement, MasterDbContext masterDbContext)
        {
            this._connectionManager = connectionManager;
            this._labManagement = labManagement;
            this._masterDbContext = masterDbContext;
        }

        public async Task<LabIdentityResult> AddReferenceLabInPrimaryLabByIdAsync(ReferenceLabAssignmentViewModel referenceLabAssignment)
        {
            var identity = new LabIdentityResult(TrueMed.Domain.Model.Identity.Status.Failed, "One or more validation errors");

            if (!await IsReferenceLabByIdAsync(referenceLabAssignment.ReferenceLabId))
                identity.AddError(nameof(referenceLabAssignment.ReferenceLabId), $"The reference lab id \"{referenceLabAssignment.ReferenceLabId}\" is incorrect (might be, not a reference lab type)");
            if (!await IsPrimaryLabByIdAsync(referenceLabAssignment.PrimaryLabId))
                identity.AddError(nameof(referenceLabAssignment.PrimaryLabId), $"The primary lab id \"{referenceLabAssignment.PrimaryLabId}\" is incorrect (might be, not a primary lab type)");
            if (identity.HasErrors)
                return identity;

            if (IsReferenceLabExistsInPrimaryLabById(referenceLabAssignment.PrimaryLabId, referenceLabAssignment.ReferenceLabId))
            {
                return await UpdateReferenceLabAssignmentStatusByIdAsync(
                    referenceLabAssignment.ReferenceLabId, 
                    referenceLabAssignment.PrimaryLabId,
                    (LabApprovementStatus)referenceLabAssignment.LabApprovementStatus, 
                    referenceLabAssignment.LabType);
            }
            else
            {
                _masterDbContext.TblRefLabAssignments.Add(new Sevices.MasterEntities.TblRefLabAssignment
                {
                    LabId = referenceLabAssignment.PrimaryLabId,
                    RefLabId = referenceLabAssignment.ReferenceLabId,
                    LabType = (int)referenceLabAssignment.LabType,
                    CreateDate = DateTimeNow.Get,
                    CreatedBy = _connectionManager.UserId,
                    Status = (int)referenceLabAssignment.LabApprovementStatus
                });
                await _masterDbContext.SaveChangesAsync();
                return new LabIdentityResult(TrueMed.Domain.Model.Identity.Status.Success, "Successfully Assigned");
            }
        }

        public bool IsReferenceLabExistsInPrimaryLabById(int primaryLabId, int referenceLabId)
        {
            return _masterDbContext.TblRefLabAssignments.Any(x => x.LabId == primaryLabId && x.RefLabId == referenceLabId);
        }

        public async Task<bool> IsReferenceLabByIdAsync(int referenceLabId)
        {
            return await _masterDbContext.TblLabs.AnyAsync(x => x.IsEnableReferenceId == true && x.LabId == referenceLabId);
        }

        public async Task<bool> IsPrimaryLabByIdAsync(int primaryLabId)
        {
            return await _masterDbContext.TblLabs.AnyAsync(x => x.IsReferenceLab == false && x.LabId == primaryLabId);
        }

        public async Task<LabIdentityResult> UpdateReferenceLabAssignmentStatusByIdAsync(
            int referenceLabId,
            int labId,
            LabApprovementStatus status, int? labType = null)
        {
            var refereceLab = await _masterDbContext.TblRefLabAssignments.FirstOrDefaultAsync(x => x.RefLabId == referenceLabId && x.LabId == labId);
            if (labType != null)
            {
                refereceLab.LabType = (int)labType;
            }
            refereceLab.UpdateDate = DateTimeNow.Get;
            refereceLab.UpdateBy = _connectionManager.UserId;
            refereceLab.Status = (int)status;
            await _masterDbContext.SaveChangesAsync();
            return new LabIdentityResult(TrueMed.Domain.Model.Identity.Status.Success, "Successfully Updated");
        }

        public IQueryable<LabAssignmentManagementViewModel> GetAllReferenceLabsAssignment()
        {
            return _masterDbContext.TblRefLabAssignments.Select(x => new LabAssignmentManagementViewModel
            {
                PrimaryLabId = x.LabId,
                ReferenceLabId = x.RefLabId,
                CreateByUserId = x.CreatedBy,
                CreateTime = x.CreateDate,
                LabType = (LabType)x.LabType,
                LastUpdateTime = x.UpdateDate,
                LastUpdateByUserId = x.UpdateBy,
                Status = (LabApprovementStatus)x.Status
            });
        }

        public void InitDbContext(DbContext dbContext)
        {
            _masterDbContext = (MasterDbContext)dbContext;
        }
    }
}
