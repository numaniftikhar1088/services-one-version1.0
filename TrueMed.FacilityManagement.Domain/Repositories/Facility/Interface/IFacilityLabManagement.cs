using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;
using TrueMed.FacilityManagement.Domain.Models.Facility.Request;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;

namespace TrueMed.FacilityManagement.Domain.Repositories.Facility.Interface
{
    public interface IFacilityLabManagement
    {
        //Task<FacilityResult> AddReferenceLabInFacilityByIdAsync(FacilityReferenceLabAssignmentViewModel referenceLabAssignment);
        //Task<FacilityResult> DeleteReferenceLabAssignmentAsync(int facilityId, int refLabId);
        //IQueryable<FacilityAssignmentManagementViewModel> GetAllReferenceLabsAssignment();
        Task<bool> IsPrimaryLabByIdAsync(int primaryLabId);
        Task<bool> IsReferenceLabByIdAsync(int referenceLabId);
        //bool IsReferenceLabExistsAgainstFacilityById(int facilityId, int referenceLabId);
        //Task<FacilityResult> UpdateReferenceLabAssignmentStatusByIdAsync(
        //   int referenceLabId,
        //   int facilityId,
        //    int reqTypeId,
        //   LabApprovementStatus status, 
        //   LabType? labType = null);
        Task<TrueMed.Domain.Models.Response.RequestResponse> FacilityFileUploads(FacilityFileUploadRequest request);
        Task<TrueMed.Domain.Models.Response.RequestResponse> RemoveFacilityUploads(string? id, int? facilityId);
    }
}
