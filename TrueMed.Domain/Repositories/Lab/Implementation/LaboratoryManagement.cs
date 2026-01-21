using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Model.Laboratory;
using TrueMed.Domain.Model.Logger;
using TrueMed.Domain.Models.Identity;
using TrueMed.Domain.Repositories.Connection.Implementation;
using TrueMed.Domain.Repositories.Connection.Interface;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.Domain.Repositories.Lab.Implementation
{
    public class LaboratoryManagement : ILaboratoryManagement
    {
        private MasterDbContext _dbContext;
        private readonly IUserManagement _userManagement;

        public DbContext DbContext => _dbContext;

        public LaboratoryManagement(MasterDbContext dbContext,
            IConnectionManager connectionManager)
        {
            this._dbContext = dbContext;
            this._userManagement = connectionManager.GetService<IUserManagement>();
        }

        public int CreateMasterPortalLab()
        {
            var tblLab = new TblLab();
            tblLab.LaboratoryName = "Master Portal";
            tblLab.DisplayName = "Master Portal";
            _dbContext.TblLabs.Add(tblLab);
            _dbContext.SaveChanges();
            return tblLab.LabId;

        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }

        public int? GetLabIdByName(string labName)
        {

            var labId = _dbContext.TblLabs.Where(x => x.LaboratoryName.ToLower() == labName.ToLower()).Select(x => x.LabId).FirstOrDefault();
            if (labId == 0)
                return null;
            return labId;

        }

        public int? GetLabIdByKey(string labKey)
        {
            var labId = _dbContext.TblLabs.Where(x => x.LabKey.ToLower() == labKey.ToLower()).Select(x => x.LabId).FirstOrDefault();
            if (labId == 0)
                return null;
            return labId;
        }

        public string? GetLabNameById(int labId)
        {

            var labName = _dbContext.TblLabs.Where(x => x.LabId == labId).Select(x => x.LaboratoryName).FirstOrDefault();
            if (string.IsNullOrWhiteSpace(labName))
                return null;
            return labName;

        }

        public bool IsUserExistsInLabByKey(string labKey, string userId)
        {
            var labId = GetLabIdByKey(labKey);
            return _dbContext.TblLabUsers.Any(x =>
            x.UserId == userId
            && x.LabId == labId);
        }

        public bool IsLabExistsById(int labId)
        {
            return _dbContext.TblLabs.Any(x => x.LabId == labId);
        }

        public bool IsLabExistsByKey(string labKey) => _dbContext.TblLabs.Any(x => x.LabKey.ToLower() == labKey.ToLower());

        public IQueryable<LabBaseViewModel> GetAllLabs(params int[] exceptLabIds)
        {
            var labs = from pri in _dbContext.TblLabs
                       join refer in GetAllDirectors()
                       on pri.LabId equals refer.LabId
                       select new LabBaseViewModel
                       {
                           Id = pri.LabId,
                           LabName = pri.LaboratoryName,
                           LabDisplayName = pri.DisplayName,
                           Address = new AddressViewModel()
                           {
                               Address1 = pri.Address1,
                               Address2 = pri.Address2,
                               City = pri.City,
                               State = pri.State,
                               ZipCode = pri.ZipCode,
                           },
                           CreateDate = pri.CreateDate,
                           Logo = pri.PortalLogo,
                           Phone = pri.PhoneNumber,
                           CLIA = pri.Cliano,
                           Email = pri.Email,
                           Fax = pri.FaxNumber,
                           LabUrl = pri.LabUrl,
                           LabKey = pri.LabKey,
                           LabDirector = new LabDirectorDetailsViewModel()
                           {
                               Address = refer.Address,
                               EmailAddress = refer.EmailAddress,
                               FirstName = refer.FirstName,
                               LastName = refer.LastName,
                               MiddleName = refer.MiddleName,
                               Mobile = refer.Mobile,
                               Phone = refer.Phone,
                           },
                           IsActive = pri.IsActive,
                           IsReferenceLab = pri.IsReferenceLab
                       };
            if (exceptLabIds != null && exceptLabIds.Count() > 0)
            {
                labs = labs.Where(x => !exceptLabIds.Contains(x.Id ?? 0));
            }
            return labs;
        }

        public string GetLabDomainUrlById(int labId)
        {
            return _dbContext.TblLabs.Where(x => x.LabId == labId).Select(x => x.LabUrl).FirstOrDefault();
        }

        public string GetLabDomainUrlByKey(string labKey)
        {
            return _dbContext.TblLabs.Where(x => x.LabKey.ToLower() == labKey.ToLower()).Select(x => x.LabUrl).FirstOrDefault();
        }

        public bool IsUserExistsInLabById(int labId, string userId)
        {
            return _dbContext.TblLabUsers.Any(x => x.LabId == labId && x.UserId == userId);
        }

        public async Task<int[]> GetUserLabIdsByUserIdAsync(string userId)
        {
            return await _dbContext.TblLabUsers
                .Where(x => x.UserId == userId)
                .Select(x => x.LabId)
                .ToArrayAsync();
        }

        public IQueryable<Model.Laboratory.LabUserViewModel> GetAllLabsUsers()
        {
            return _dbContext.TblLabUsers.Select(x => new Model.Laboratory.LabUserViewModel
            {
                IsDefault = x.IsDefault ?? false,
                IsActive = x.IsActive ?? true,
                LabId = x.LabId,
                UserId = x.UserId
            });
        }

        public async Task<ICollection<LaboratoryBriefInfoViewModel>> GetLabBriefInfoByUserIdAsync(string userId)
        {
            IQueryable<LaboratoryBriefInfoViewModel> labs;
            var labUsers = await GetAllLabsUsers()
                .Where(x => x.UserId == userId).Select(x => new
                {
                    x.LabId,
                    x.UserId,
                    x.IsDefault
                })
                .ToListAsync();

            var labIds = labUsers.Select(x => x.LabId).ToList();

            if (_userManagement.GetUserTypeById(userId) != UserType.Master)
            {
                labs = GetAllLabs().Where(x => x.IsReferenceLab == false).Where(x => labIds.Contains(x.Id)).Select(x => new LaboratoryBriefInfoViewModel
                {
                    LabKey = x.LabKey,
                    LabName = x.LabName,
                    LabUrl = x.LabUrl,
                    Logo = x.Logo,
                    IsReferenceLab = x.IsReferenceLab,
                    Id = x.Id
                });
            }
            else
            {
                labs = GetAllLabs().Where(x => x.IsReferenceLab == false).Select(lab => new
                LaboratoryBriefInfoViewModel
                {
                    LabKey = lab.LabKey,
                    LabName = lab.LabName,
                    LabUrl = lab.LabUrl,
                    Logo = lab.Logo,
                    IsReferenceLab = lab.IsReferenceLab,
                    Id = lab.Id,
                });
            }
            var labsDist = await labs.ToListAsync();
            labsDist.ForEach(x =>
            {
                var db = labUsers.FirstOrDefault(m => m.LabId == x.Id);
                if (db != null)
                    x.IsDefault = db.IsDefault ?? false;
            });
            return labsDist;
        }

        public void InitDbContext(DbContext dbContext)
        {
            _dbContext = (MasterDbContext)dbContext;
        }

        public IdentityResult UpdateDirectorInfo(int labId, LabDirectorDetailsViewModel directorInfoView)
        {
            var identity = new IdentityResult(Status.Failed, "One or more validation errors.");
            if (!IsLabExistsById(labId))
            {
                identity.AddError(nameof(labId), "Lab id is invalid.");
            }

            if (identity.HasErrors)
                return identity;

            var isUpdating = IsDirectorExistsByLabId(labId);
            var directorInformation = new TblDirectorInformation
            {
                Address1 = directorInfoView.Address.Address1,
                City = directorInfoView.Address.City,
                State = directorInfoView.Address.State,
                EmailAddress = directorInfoView.EmailAddress,
                FirstName = directorInfoView.FirstName,
                LastName = directorInfoView.LastName,
                MiddleName = directorInfoView.MiddleName,
                LabId = labId,
                Mobile = directorInfoView.Mobile,
                Phone = directorInfoView.Phone
            };


            if (isUpdating)
            {
                _dbContext.Update(directorInformation).State = EntityState.Modified;
            }
            else
            {
                _dbContext.Update(directorInformation).State = EntityState.Added;
            }

            _dbContext.SaveChanges();
            return identity.MakeSuccessed();
        }

        public bool IsDirectorExistsByLabId(int labId)
        {
            return _dbContext.TblDirectorInformations.Any(x => x.LabId == labId);
        }

        public IQueryable<DirectorInfoViewModel> GetAllDirectors()
        {
            return _dbContext.TblDirectorInformations.Select(x => new DirectorInfoViewModel
            {
                Address = new Business.Models.Identity.Request.AddressViewModel()
                {
                    Address1 = x.Address1,
                    City = x.City,
                    State = x.State,
                },
                EmailAddress = x.EmailAddress,
                FirstName = x.FirstName,
                LabId = (int)x.LabId,
                LastName = x.LastName,
                MiddleName = x.MiddleName,
                Mobile = x.Mobile,
                Phone = x.Phone
            });
        }

        public bool RemoveDefaultLabAgainstUserById(string userId)
        {
            foreach (var item in _dbContext.TblLabUsers.Where(x => x.UserId == userId && x.IsDefault == true))
            {
                item.IsDefault = false;
            }
            return _dbContext.SaveChanges() > 0;
        }

        public bool UpdateDefaultLabAgainstUserById(string userId, int labId)
        {
            RemoveDefaultLabAgainstUserById(userId);
            var labUser = _dbContext.TblLabUsers.FirstOrDefault(x => x.UserId == userId && x.LabId == labId);
            if (labUser == null)
                return false;
            labUser.IsDefault = true;
            return _dbContext.SaveChanges() > 0;
        }

        public bool AddDefaultLabAgainstUserById(string userId, int labId)
        {
            _dbContext.TblLabUsers.Add(new TblLabUser
            {
                IsDefault = true,
                LabId = labId,
                UserId = userId
            });
            return _dbContext.SaveChanges() > 0;
        }

        public bool HasDefaultLabAgainstUserById(string userId)
        {
            return _dbContext.TblLabUsers.Any(x => x.UserId == userId && x.IsDefault == true);
        }

        public string? GetLabKeyById(int labId)
        {
            return _dbContext.TblLabs.Where(x => x.LabId == labId).Select(x => x.LabKey).FirstOrDefault();
        }

        //public LaboratoryResponseViewModel VerifyLab(string labName)
        //{
        //    var lab = _dbContext.TblLabs.Select(x => new LaboratoryResponseViewModel { LabName = x.Name, LabUrl = x.Domain }).FirstOrDefault(x => x.LabName.ToLower() == labName.ToLower());
        //    return lab;
        //}
    }
}
