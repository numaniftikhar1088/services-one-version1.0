using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Model.Laboratory;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab;

namespace TrueMed.Domain.Repositories.Lab.Interface
{
    public interface IDirectorManagement
    {
        bool IsDirectorExistsByLabId(int labId);
        IdentityResult UpdateDirectorInfo(int labId, LabDirectorDetailsViewModel directorInfoView);
        IQueryable<DirectorInfoViewModel> GetAllDirectors();
        bool AddDefaultLabAgainstUserById(string userId, int labId);
    }
}
