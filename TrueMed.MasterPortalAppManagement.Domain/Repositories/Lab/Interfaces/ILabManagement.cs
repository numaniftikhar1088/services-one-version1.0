using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Interfaces
{
    public interface ILabManagement : ILaboratoryManagement, IDisposable
    {
        void AddUsersInLab(int labId, params string[] userIds);
        LabIdentityResult AssociateUsersInLab(int labId, params string[] userIds);
        LabIdentityResult CreateLab(LabViewModel labViewModel);
        bool DeleteLabById(int labId);
        Task<bool> LabActivationAsync(int labId, bool isActive);
        int LabsCount();
        LabIdentityResult RemoveLabUsersByLabId(int labId, params string[] userIds);
        LabIdentityResult UpdateLab(UpdateLabViewModel labViewModel);
    }
}
