using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Laboratory;
using TrueMed.Domain.Repositories.Lab.Interface;

namespace TrueMed.Business.Interface
{
    public interface ILaboratoryManagement : IDirectorManagement, IDisposable,
       IDbContextInitialize
    {
        int CreateMasterPortalLab();
        //LaboratoryResponseViewModel VerifyLab(string labName);
        int? GetLabIdByName(string labName);
        string? GetLabNameById(int labId);
        bool IsLabExistsById(int labId);
        int? GetLabIdByKey(string labKey);
        string? GetLabKeyById(int labId);
        string GetLabDomainUrlById(int labId);
        string GetLabDomainUrlByKey(string labKey);
        bool IsUserExistsInLabByKey(string labKey, string userId);
        bool IsUserExistsInLabById(int labId, string userId);
        bool IsLabExistsByKey(string labKey);
        Task<int[]> GetUserLabIdsByUserIdAsync(string userId);
        IQueryable<LabBaseViewModel> GetAllLabs(params int[] exceptLabIds);
        Task<ICollection<LaboratoryBriefInfoViewModel>> GetLabBriefInfoByUserIdAsync(string userId);
        bool RemoveDefaultLabAgainstUserById(string userId);
        bool UpdateDefaultLabAgainstUserById(string userId, int labId);
        bool HasDefaultLabAgainstUserById(string userId);
        IQueryable<LabUserViewModel> GetAllLabsUsers();
    }
}
