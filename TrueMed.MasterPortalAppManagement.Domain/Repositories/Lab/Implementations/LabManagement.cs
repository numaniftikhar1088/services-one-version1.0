using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using TrueMed.Domain.Databases;

using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Model.Laboratory;
using TrueMed.Domain.Models.Datatable;

using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Interfaces;
using TrueMed.Sevices.MasterEntities;
using TrueMed.Business.Services.Lab;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Implementations
{
    public class LabManagement : LaboratoryManagement, ILabManagement
    {
        private MasterDbContext _dbContext;
        private readonly IConnectionManager _connectionManager;
        private readonly IUserManagement _userManagement;

        public LabManagement(MasterDbContext dbContext,
            IConnectionManager connectionManager)
            : base(dbContext, connectionManager)
        {
            this._dbContext = dbContext;
            this._connectionManager = connectionManager;
            this._userManagement = connectionManager.GetService<IUserManagement>();
        }

        public LabIdentityResult CreateLab(LabViewModel labViewModel)
        {
            using (TransactionScope transactionScope = new TransactionScope(TransactionScopeOption.Required,
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadUncommitted }))
            {
                var lab = new TblLab
                {
                    LaboratoryName = labViewModel.LabName,
                    PortalLogo = labViewModel.Logo,
                    LabKey = labViewModel.LabKey,
                    IsReferenceLab = labViewModel.IsReferenceLab ?? false,
                    MobileNumber = labViewModel.Mobile,
                    DisplayName = labViewModel.LabDisplayName,
                    Cliano = labViewModel.CLIA,
                    Email = labViewModel.Email,
                    PhoneNumber = labViewModel.Phone,
                    FaxNumber = labViewModel.Fax,
                    Address1 = labViewModel?.Address?.Address1,
                    Address2 = labViewModel?.Address?.Address2,
                    State = labViewModel?.Address?.State,
                    IsActive = labViewModel.IsActive ?? true,
                    ZipCode = labViewModel?.Address?.ZipCode,
                    City = labViewModel?.Address?.City,
                    CreateDate = DateTime.UtcNow,
                    LabUrl = labViewModel.LabUrl,
                    CopyFromLab = labViewModel.CopyFromLab,
                    Dbname = labViewModel.DbName,
                    IsDeleteAssignedInsurances = labViewModel.isDeleteAssignedInsurances,
                    IsDeleteAssignedReferenceLabs = labViewModel.isDeleteAssignedReferenceLabs,
                    IsDeleteFacilities = labViewModel.isDeleteFacilities,
                    IsDeletePatients = labViewModel.isDeletePatients,
                    IsDeleteUsers = labViewModel.isDeleteUsers,
                    IsDeleteIcd10assignment = labViewModel.isDeleteICD10Assignment,
                    IsDeleteInsuranceAssignment = labViewModel.isDeleteInsuranceAssignment,
                    CreatedBy = _connectionManager.UserId

                };

                _dbContext.TblLabs.Add(lab);
                var isAffected = _dbContext.SaveChanges();

                var directorIdentityResult = UpdateDirectorInfo(lab.LabId, labViewModel.LabDirector);
                if (!directorIdentityResult.IsSuccess)
                {
                    return new LabIdentityResult(directorIdentityResult, "labdirector");
                }


                transactionScope.Complete();
                return new LabIdentityResult(Status.Success, "Lab is successfully created.")
                {
                    LabId = lab.LabId
                };
            }
        }

        public LabIdentityResult AssociateUsersInLab(int labId, params string[] userIds)
        {
            if (!IsLabExistsById(labId))
            {
                return new LabIdentityResult(Status.DataNotFound, "lab not found.", "labId");
            }
            var invalidUsersIds =
                  userIds.Where(x => !_userManagement.IsUserExistsById(x)).ToList();

            if (invalidUsersIds.Count > 0)
            {
                var errorResponse = new LabIdentityResult(Status.Failed, "Users ids are invalid.");
                errorResponse.AddError("userIds", invalidUsersIds);
                return errorResponse;
            }

            RemoveLabUsersByLabId(labId, userIds);
            AddUsersInLab(labId, userIds);
            return new LabIdentityResult(Status.Success, "Successfully associated.");
        }

        public void AddUsersInLab(int labId, params string[] userIds)
        {
            foreach (var id in userIds)
            {
                if (!IsUserExistsInLabById(labId, id))
                {
                    _dbContext.TblLabUsers.Add(new TblLabUser()
                    {
                        LabId = labId,
                        UserId = id,
                    });
                }
            }
            _dbContext.SaveChanges();
        }

        public LabIdentityResult RemoveLabUsersByLabId(int labId, params string[] userIds)
        {
            var existedUsers = _dbContext.TblLabUsers.Where(x => x.LabId == labId && userIds.Contains(x.UserId));
            _dbContext.TblLabUsers.RemoveRange(existedUsers);
            _dbContext.SaveChanges();
            return new LabIdentityResult(Status.Success, "Successfully deleted.");
        }

        public LabIdentityResult UpdateLab(UpdateLabViewModel labViewModel)
        {
            using (TransactionScope transactionScope = new TransactionScope(TransactionScopeOption.Required,
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadUncommitted }))
            {
                var lab = _dbContext.TblLabs.FirstOrDefault(x => x.LabId == labViewModel.LabId);

                if (lab == null)
                {
                    return new LabIdentityResult(Status.DataNotFound, "Invalid Lab Id.", nameof(labViewModel.LabId));
                }

                var directorIdentityResult = UpdateDirectorInfo(lab.LabId, labViewModel.LabDirector);
                if (!directorIdentityResult.IsSuccess)
                {
                    return new LabIdentityResult(directorIdentityResult, "labdirector");
                }

                if (!string.IsNullOrWhiteSpace(labViewModel.Logo))
                    lab.PortalLogo = labViewModel.Logo;

                lab.LaboratoryName = labViewModel.LabName;
                lab.DisplayName = labViewModel.LabDisplayName;
                lab.Cliano = labViewModel.CLIA;
                lab.Email = labViewModel.Email;
                lab.PhoneNumber = labViewModel.Phone;
                lab.FaxNumber = labViewModel.Fax;
                lab.Address1 = labViewModel.Address.Address1;
                lab.Address2 = labViewModel.Address.Address2;
                lab.ZipCode = labViewModel.Address.ZipCode;
                lab.City = labViewModel.Address.City;
                lab.State = labViewModel.Address.State;

                lab.LabKey = labViewModel.LabKey;
                lab.IsReferenceLab = labViewModel.IsReferenceLab ?? false;
                lab.MobileNumber = labViewModel.Mobile;

                lab.LabUrl = labViewModel.LabUrl;
                lab.CopyFromLab = labViewModel.CopyFromLab;
                lab.Dbname = labViewModel.DbName;

                lab.IsActive = labViewModel.IsActive ?? true;

                var isAffected = _dbContext.SaveChanges();
                transactionScope.Complete();
                return new LabIdentityResult(Status.Success, "Lab is successfully updated.")
                {
                    LabId = lab.LabId
                };
            }
        }

        public new void Dispose()
        {
            _dbContext.Dispose();
        }

        public bool DeleteLabById(int labId)
        {
            return _dbContext.Database.ExecuteSqlRaw("EXEC SP_DELETE_LAB_BY_ID @labId  = {0}", labId) == 1;
        }

        public int LabsCount()
        {
            return _dbContext.TblLabs.Count();
        }

        public async Task<bool> LabActivationAsync(int labId, bool isActive)
        {
            return await _dbContext.Database
                .ExecuteSqlRawAsync("EXEC SP_LAB_ACTIVATION_BY_ID @labId  = {0}, @isActive = {1}, @UserId = {2}", labId, isActive, _connectionManager.UserId) == 1;
        }
    }
}

