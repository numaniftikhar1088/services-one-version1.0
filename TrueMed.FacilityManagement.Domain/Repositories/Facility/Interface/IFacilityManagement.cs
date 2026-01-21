using Microsoft.AspNetCore.Mvc;
using TrueMed.Domain.Model.File;
using TrueMed.Domain.Models.Common;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Identity;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;

namespace TrueMed.Domain.Repositories.Lab.Interface
{
    public interface IFacilityManagement
    {
        Task<FacilityResult> AddUserInFacilityAsync(FacilityUserViewModel viewModel);
        Task<FacilityResult> AddFacilityUserInLabAsync(AddFacilityUserInLabViewModel viewModel);
        Task<bool> DeleteFacilityByIdAsync(int facilityId, string userId);
        IQueryable<DropDownResponseModel> GetActiveFacilities();
        Task<FacilityResult> FacilityStatusChangeAsync(FacilityStatusChange facilityParam);
        IQueryable<FacilityViewModel> GetFacilities();
        Task<bool> IsFacilityExistsByIdAsync(int facilityId);
        Task<bool> IsFacilityAlreadyExistsByNameAsync(string name);
        Task<bool> IsUserExistsInFacilityByUserIdAsync(FacilityUserViewModel facilityUserView);
        Task<FacilityResult> SaveFilesAsync(int facilityId, List<FileViewModel> files, string userId, bool deleteExistingFiles = false, FacilityFileType fileType = FacilityFileType.Normal);
        Task<ICollection<FacilityAssignUserViewModel>> GetFacilityAssignedUserByFacilityIdAsync(int facilityId, int labId);
        Task<ICollection<FacilityAssignUserViewModel>> GetFacilityCollectorsFacilityIdAsync(int facilityId, int labId);


        IQueryable<FacilityFileViewModel> GetFacilityFiles();
        Task<FacilityResult> AddOrUpdateFacilityAsync(FacilityViewModel facility);
        Task<ICollection<TblFacilityCheckBoxOption>> GetFacilityOptionsAsync();
        Task<bool> IsFacilityNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation);
        Task<int?> GetFacilityIdByNameAsync(string name);
        Task<string?> GetFacilityNameByIdAsync(int facilityId);
        Task<RequestResponse> GetFacilityAgainstUserIdAsync(string userId);
        Task<RequestResponse> IsFacilityNameUniqueAsync(string facilityName);
        Task<FacilityViewModel> GetFacilityByIdAsync(int facilityId);
        Models.Response.RequestResponse BulkFacilityUpload(FileDataRequest request);
        Models.Response.RequestResponse<FileContentResult> FacilityExportToExcel(FacilityExportTolExcelRequest request);
        Models.Response.RequestResponse FacilityStatusChangedForApproval(FacilityStatusChangedForApprovalRequest request);
        Models.Response.RequestResponse<List<FacilityReportTemplateResponse>> GetFileTemplates();
    }

    public enum FacilityFileType
    {
        Normal,
        Bulk
    }
}
