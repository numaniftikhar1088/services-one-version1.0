using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Response;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Interfaces
{
    public interface ILabAssignmentManagement : IDbContextInitialize
    {
        Task<LabIdentityResult> AddReferenceLabInPrimaryLabByIdAsync(ReferenceLabAssignmentViewModel referenceLabAssignment);
        IQueryable<LabAssignmentManagementViewModel> GetAllReferenceLabsAssignment();
        Task<bool> IsPrimaryLabByIdAsync(int primaryLabId);
        Task<bool> IsReferenceLabByIdAsync(int referenceLabId);
        bool IsReferenceLabExistsInPrimaryLabById(int primaryLabId, int referenceLabId);
        Task<LabIdentityResult> UpdateReferenceLabAssignmentStatusByIdAsync(
           int referenceLabId,
           int labId,
           LabApprovementStatus status, int? labType = null);
    }
}
