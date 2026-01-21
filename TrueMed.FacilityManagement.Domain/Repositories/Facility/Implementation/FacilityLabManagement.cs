using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Repositories.Facility.Interface;

namespace TrueMed.FacilityManagement.Domain.Repositories.Facility.Implementation
{
    public class FacilityLabManagement : IFacilityLabManagement
    {
        private readonly IConnectionManager _connectionManager;
        private readonly MasterDbContext _masterDbContext;
        private readonly IFacilityManagement _facilityManagement;
        private readonly ApplicationDbContext? _applicationDbContext;
        private readonly IBlobStorageManager _blobStorageManager;

        public FacilityLabManagement(IConnectionManager connectionManager,
            MasterDbContext masterDbContext, ApplicationDbContext applicationDbContext, IBlobStorageManager blobStorageManager)
        {
            this._connectionManager = connectionManager;
            this._masterDbContext = masterDbContext;
            this._facilityManagement = connectionManager.GetService<IFacilityManagement>();
            _applicationDbContext = applicationDbContext;
            _blobStorageManager = blobStorageManager;
        }

        //public async Task<FacilityResult> AddReferenceLabInFacilityByIdAsync(FacilityReferenceLabAssignmentViewModel referenceLabAssignment)
        //{
        //    var identity = new FacilityResult(TrueMed.Domain.Model.Identity.Status.Failed, "One or more validation errors");

        //    if (!await IsReferenceLabByIdAsync((int)referenceLabAssignment.ReferenceLabId))
        //        identity.AddError(nameof(referenceLabAssignment.ReferenceLabId), $"The reference lab id \"{referenceLabAssignment.ReferenceLabId}\" is incorrect (might be, not a reference lab type)");
        //    if (!await _facilityManagement.IsFacilityExistsByIdAsync((int)referenceLabAssignment.FacilityId))
        //        identity.AddError(nameof(referenceLabAssignment.FacilityId), $"The facility id \"{referenceLabAssignment.FacilityId}\" is incorrect.");
        //    if (identity.HasErrors)
        //        return identity;

        //    var isApproved = (referenceLabAssignment.LabApprovementStatus == true ? LabApprovementStatus.Approved : LabApprovementStatus.Pending);

        //    if (IsReferenceLabExistsAgainstFacilityById((int)referenceLabAssignment.FacilityId, (int)referenceLabAssignment.ReferenceLabId))
        //    {
        //        return await UpdateReferenceLabAssignmentStatusByIdAsync(
        //            (int)referenceLabAssignment.ReferenceLabId,
        //            (int)referenceLabAssignment.FacilityId,
        //            (int)referenceLabAssignment.ReqTypeId,
        //            isApproved,
        //            referenceLabAssignment.LabType);
        //    }
        //    else
        //    {
        //        var statusId = (int)isApproved;
        //        _applicationDbContext.TblFacilityRefLabAssignments.Add(new TblFacilityRefLabAssignment
        //        {
        //            FacilityId = (int)referenceLabAssignment.FacilityId,
        //            //RefLabId = (int)referenceLabAssignment.ReferenceLabId,
        //            //ReqTypeId = (int)referenceLabAssignment.ReqTypeId,
        //            //LabType = (int)referenceLabAssignment.LabType,
        //            CreatedDate = DateTimeNow.Get,
        //            CreatedBy = _connectionManager.UserId,
        //            //IsActive = Convert.ToBoolean(statusId)
        //        });
        //        await _applicationDbContext.SaveChangesAsync();
        //        return new FacilityResult(TrueMed.Domain.Model.Identity.Status.Success, "Successfully Assigned");
        //    }
        //}

        //public bool IsReferenceLabExistsAgainstFacilityById(int facilityId, int referenceLabId)
        //{
        //    return _applicationDbContext.TblFacilityRefLabAssignments.Any(x => x.FacilityId == facilityId && x.RefLabId == referenceLabId);
        //}

        public async Task<bool> IsReferenceLabByIdAsync(int referenceLabId)
        {
            return await _masterDbContext.TblLabs.AnyAsync(x => x.IsReferenceLab == true && x.LabId == referenceLabId);
        }

        public async Task<bool> IsPrimaryLabByIdAsync(int primaryLabId)
        {
            return await _masterDbContext.TblLabs.AnyAsync(x => x.IsReferenceLab == false && x.LabId == primaryLabId);
        }

        //public async Task<FacilityResult>
        //    UpdateReferenceLabAssignmentStatusByIdAsync(
        //    int referenceLabId,
        //    int facilityId,
        //    int reqTypeId,
        //    LabApprovementStatus status, LabType? labType = null)
        //{
        //    var refereceLab = await _applicationDbContext
        //        .TblFacilityRefLabAssignments.FirstOrDefaultAsync(x => x.RefLabId == referenceLabId && x.FacilityId == facilityId);
        //    if (labType != null)
        //    {
        //        refereceLab.LabType = (int)labType;
        //    }
        //    refereceLab.ReqTypeId = reqTypeId;
        //    refereceLab.UpdatedDate = DateTimeNow.Get;
        //    refereceLab.UpdatedBy = _connectionManager.UserId;
        //    //refereceLab.IsActive = (int)status;
        //    await _applicationDbContext.SaveChangesAsync();
        //    return new FacilityResult(TrueMed.Domain.Model.Identity.Status.Success, "Successfully Updated");
        //}

        //public IQueryable<FacilityAssignmentManagementViewModel> GetAllReferenceLabsAssignment()
        //{
        //    return _applicationDbContext.TblFacilityRefLabAssignments.Select(x =>
        //    new FacilityAssignmentManagementViewModel
        //    {
        //        FacilityId = (int)x.FacilityId,
        //        ReferenceLabId = (int)x.RefLabId,
        //        ReqTypeId = (int)x.ReqTypeId,
        //        CreateByUserId = x.CreatedBy,
        //        CreateTime = x.CreatedDate,
        //        LabType = (LabType)x.LabType,
        //        LastUpdateTime = x.UpdatedDate,
        //        LastUpdateByUserId = x.UpdatedBy,
        //        //Status = (LabApprovementStatus)x.Status
        //    });
        //}

        //public async Task<FacilityResult> DeleteReferenceLabAssignmentAsync(int facilityId, int refLabId)
        //{
        //    if (!IsReferenceLabExistsAgainstFacilityById(facilityId, refLabId))
        //    {
        //        return new FacilityResult(TrueMed.Domain.Model.Identity.Status.DataNotFound, "Facility reference lab assignment not found.");
        //    }

        //    var referenceLabAssignment = await _applicationDbContext.TblFacilityRefLabAssignments.FirstOrDefaultAsync(x => x.FacilityId == facilityId && x.RefLabId == refLabId);
        //    _applicationDbContext.TblFacilityRefLabAssignments.Remove(referenceLabAssignment);
        //    await _applicationDbContext.SaveChangesAsync();
        //    return new FacilityResult(TrueMed.Domain.Model.Identity.Status.Success, "Assignment successfully deleted.");
        //}
        public async Task<TrueMed.Domain.Models.Response.RequestResponse> FacilityFileUploads(FacilityFileUploadRequest request)
        {
            var response = new TrueMed.Domain.Models.Response.RequestResponse();

            foreach (var file in request.Files)
            {
                var extension = Path.GetExtension(file.FileName);
                var uniqueFileName = $"{Path.GetFileNameWithoutExtension(file.FileName)}_{Guid.NewGuid()}.{extension}";
                var blobResponse = await _blobStorageManager.UploadAsync("FacilityFiles".ToLower(), uniqueFileName, file);
                if (!string.IsNullOrEmpty(blobResponse.uri))
                {
                    var tblFile = new TblFile()
                    {
                        Name = file.FileName,
                        ContentType = file.ContentType,
                        CreateDate = DateTimeNow.Get,
                        FilePath = blobResponse.uri,
                        Length = file.Length.ToString(),
                        IsDeleted = false,
                        FacilityId = Convert.ToInt32(request.FacilityId)
                    };
                    await _applicationDbContext.TblFiles.AddAsync(tblFile);
                }
            }
            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Message = "Files Uploads Successfully...";
                response.StatusCode = HttpStatusCode.OK;
            }
            return response;
        }
        public async Task<TrueMed.Domain.Models.Response.RequestResponse> RemoveFacilityUploads(string? id, int? facilityId)
        {
            var response = new TrueMed.Domain.Models.Response.RequestResponse();

            if (!string.IsNullOrEmpty(id))
            {
                var existingFile = await _applicationDbContext.TblFiles.AsNoTracking().FirstOrDefaultAsync(f => f.Id == id);
                if (existingFile != null)
                {
                    existingFile.IsDeleted = true;
                    _applicationDbContext.TblFiles.Update(existingFile);
                }
            }
            else
            {
                var existingFile = await _applicationDbContext.TblFiles.AsNoTracking().Where(f => f.FacilityId == facilityId).ToListAsync();
                if (existingFile != null)
                {
                    foreach (var record in existingFile)
                    {
                        record.IsDeleted = true;
                        _applicationDbContext.TblFiles.Update(record);
                    }
                }
            }
            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Message = "File Deleted Successfully...";
                response.StatusCode = HttpStatusCode.OK;
            }
            return response;
        }
    }
}
