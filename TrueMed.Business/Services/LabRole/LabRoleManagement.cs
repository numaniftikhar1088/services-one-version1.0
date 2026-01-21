using Microsoft.EntityFrameworkCore;
using System.Transactions;
using System.Linq.Dynamic.Core;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Identity;
using TrueMed.Domain.Models.LabRole;

namespace TrueMed.Business.Services.LabRole
{
    public class LabRoleManagement : ILabRoleManagement
    {
        private ApplicationDbContext _dbContext;
        private readonly IConnectionManager _connectionManager;
        private readonly MasterDbContext _masterDbContext;
        private readonly IUserManagement _userManagement;
        public LabRoleManagement(ApplicationDbContext dbContext,
            IConnectionManager connectionManager,
            MasterDbContext masterDbContext)
        {
            this._dbContext = dbContext;
            this._connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
            _userManagement = connectionManager.GetService<IUserManagement>();
        }

        public IQueryable<LabRoleModel> GetAllRoles()
        {
            return from p in _dbContext.TblRoles.Where(w => w.IsDeleted.Equals(false))
                   select new LabRoleModel
                   {
                       Id = p.Id,
                       Name = p.Name,
                       CreateBy = p.CreateBy,
                       CreateDate = p.CreateDate,
                       ClaimsIds = p.TblRoleClaims.Select(x => x.ClaimId)
                   };
        }

        public async Task<IdentityResult> UpdateUserClaimsByUserIdAsync(string userId, params int[] claimsIds)
        {
            using (TransactionScope transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                await _dbContext.TblUserClaims.Where(x => x.UserId == userId).ExecuteDeleteAsync();
                foreach (var claimId in claimsIds)
                {
                    _dbContext.TblUserClaims.Add(new TblUserClaim
                    {
                        ClaimId = claimId,
                        UserId = userId
                    });
                }
                await _dbContext.SaveChangesAsync();
                transaction.Complete();
                return new IdentityResult(Status.Success, "Claims are successfully updated.");
            }
        }

        public async Task<bool> IsUserAnyRoleExistsByUserIdAsync(string userId)
        {
            return await _dbContext.TblUserRoles.AnyAsync(x => x.UserId == userId);
        }

        public async Task<bool> IsRoleExistsByNameAsync(string roleName)
        {
            return await _dbContext.TblRoles.AnyAsync(x =>
            x.Name.ToLower().Trim() == roleName.ToLower().Trim());
        }

        public async Task<bool> IsRoleExistsByIdAsync(int roleId)
        {
            return await _dbContext.TblRoles.AnyAsync(x => x.Id == roleId);
        }

        public async Task<LabRoleModel?> GetRoleByUserIdAsync(string userId)
        {
            return await (from p in _dbContext.TblUserRoles
                          join role in GetAllRoles()
                          on p.RoleId equals role.Id
                          where p.UserId == userId
                          select role).FirstOrDefaultAsync();
        }

        public async Task<int?> GetRoleIdByNameAsync(string roleName)
        {
            return await _dbContext.TblRoles
                .Where(x => x.Name == roleName).Select(x => x.Id).FirstOrDefaultAsync();
        }

        public async Task<bool> HasAllClaimsByIdAsync(params int[] claimIds)
        {
            return await _masterDbContext.TblClaims.AllAsync(x => claimIds.Contains(x.Id));
        }

        public async Task<IdentityResult> SaveOrUpdateRoleAndClaimsAsync(RoleViewModel roleViewModel)
        {
            using (TransactionScope transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var identityResult = IdentityResult.FailedResult();
                var isUpdating = roleViewModel is UpdateRoleViewModel;
                if (isUpdating)
                {
                    if (!await IsRoleExistsByIdAsync((int)roleViewModel.RoleId))
                        identityResult.AddError(nameof(roleViewModel.RoleId), Validator.NotFound);
                }

                if (!await IsRoleNameValidAsync(new KeyValuePairViewModel<int>
                {
                    Id = (int)roleViewModel.RoleId,
                    KeyValue = roleViewModel.RoleName
                }))
                    identityResult.AddError(nameof(roleViewModel.RoleName), Validator.AlreadyFound);


                if (identityResult.HasErrors)
                    return identityResult;

                TblRole role = null;
                if (isUpdating && (role = await _dbContext.TblRoles.FirstOrDefaultAsync(x => x.Id == roleViewModel.RoleId)) != null)
                {
                    await _dbContext.TblRoleClaims.Where(x => x.RoleId == role.Id).ExecuteDeleteAsync();
                    role.UpdateDate = DateTimeNow.Get;
                    role.UpdateBy = _connectionManager.UserId;
                }
                else
                {
                    role = new TblRole();
                    role.CreateDate = DateTimeNow.Get;
                    role.CreateBy = _connectionManager.UserId;
                }

                role.Name = roleViewModel.RoleName;

                if (isUpdating)
                    _dbContext.TblRoles.Update(role).State = EntityState.Modified;
                else
                    _dbContext.TblRoles.Update(role).State = EntityState.Added;

                await _dbContext.SaveChangesAsync();

                await _dbContext.TblRoleClaims.AddRangeAsync(roleViewModel.ClaimsIds.Select(claimId => new TblRoleClaim { ClaimId = claimId, RoleId = role.Id }));
                await _dbContext.SaveChangesAsync();
                identityResult.UpdateIdentifier(role.Id);
                roleViewModel.RoleId = role.Id;
                transaction.Complete();
                return identityResult.MakeSuccessed("Successfully updated.");
            }
        }

        public async Task<int> GetUserCountByRoleIdAsync(int roleId)
        {
            return await _dbContext.TblUserRoles.Where(x => x.RoleId == roleId).CountAsync();
        }

        public async Task<int[]> GetClaimsByRoleIdAsync(int roleId)
        {
            return await _dbContext.TblRoleClaims
                .Where(x => x.RoleId == roleId)
                .Select(x => x.ClaimId).ToArrayAsync();
        }

        public async Task<int[]> GetClaimsIdsByUserIdAsync(string userId)
        {
            //var claims = await _dbContext.TblUserClaims
            //    .Where(x => x.UserId == userId)
            //    .Select(x => x.ClaimId).ToArrayAsync();
            //return await _masterDbContext.TblPages.Where(x => claims.Contains(x.Id))
            //    .Select(x => x.Id)
            //    .ToArrayAsync();
            return await _dbContext.TblUserClaims
                .Where(x => x.UserId == userId)
                .Select(x => x.ClaimId).ToArrayAsync();
        }

        public async Task<string[]> GetClaimsNamesByUserIdAsync(string userId)
        {
            var claims = await GetClaimsIdsByUserIdAsync(userId);

            var clamNames = await _masterDbContext.TblClaims
                .Where(x => claims.Contains(x.Id))
                .Select(x => x.Name).ToArrayAsync();
            return clamNames;
        }

        public async Task<LabRoleModel?> GetRoleByNameAsync(string roleName)
        {
            return await GetAllRoles().FirstOrDefaultAsync(x => x.Name.ToLower().Trim() == roleName.ToLower().Trim());
        }

        public async Task<LabRoleModel?> GetRoleByIdAsync(int roleId)
        {
            return await GetAllRoles().FirstOrDefaultAsync(x => x.Id == roleId);
        }

        public async Task<ICollection<ClaimModel>> GetClaimsByIdsAsync(params int[] claimIds)
        {
            var claims = _masterDbContext.TblClaims
                .Where(x => claimIds.Contains(x.Id))
                .Select(x => new ClaimModel
                {
                    Id = x.Id,
                    Name = x.Name
                });
            return await claims.ToListAsync();
        }

        public async Task<bool> DeleteUserRoleByUserIdAsync(string userId)
        {
            return await _dbContext.TblUserRoles.Where(x => x.UserId == userId).ExecuteDeleteAsync() > 0;
        }

        public async Task<IdentityResult> UpdateUserRoleAndClaimsByUserIdAsync(UserRoleClaimViewModel userRoleClaimViewModel)
        {
            using (TransactionScope transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var identityResult = IdentityResult.FailedResult();

                if (!_userManagement.IsUserExistsById(userRoleClaimViewModel.UserId))
                    identityResult.AddError(nameof(userRoleClaimViewModel.UserId), Validator.NotFound);

                if (!await IsRoleExistsByIdAsync(userRoleClaimViewModel.RoleId))
                    identityResult.AddError(nameof(userRoleClaimViewModel.RoleId), Validator.NotFound);

                //if (userRoleClaimViewModel.ClaimsIds.Length > 0 && !await HasAllClaimsByIdAsync(userRoleClaimViewModel.ClaimsIds.ToArray()))
                //    identityResult.AddError(nameof(userRoleClaimViewModel.RoleId), Validator.InvalidValue);

                if (identityResult.HasErrors)
                    return identityResult;

                await _dbContext.TblUserRoles.Where(x => x.UserId == userRoleClaimViewModel.UserId)
                     .ExecuteDeleteAsync();

                await _dbContext.TblUserRoles.AddAsync(new TblUserRole
                {
                    UserId = userRoleClaimViewModel.UserId,
                    RoleId = userRoleClaimViewModel.RoleId,
                    SubRoleType = userRoleClaimViewModel.SubRoleType
                });

                await _dbContext.TblUserClaims.Where(x => x.UserId == userRoleClaimViewModel.UserId).ExecuteDeleteAsync();

                _dbContext.TblUserClaims.AddRange(userRoleClaimViewModel.ClaimsIds.Select(claimId => new TblUserClaim
                {
                    UserId = userRoleClaimViewModel.UserId,
                    ClaimId = claimId
                }));
                var isAffected = await _dbContext.SaveChangesAsync() > 0;
                transaction.Complete();
                return identityResult.CreateResponse(isAffected);

            }
        }

        public async Task<bool> IsRoleNameValidAsync(KeyValuePairViewModel<int> uniqueKeyValidation)
        {
            if (uniqueKeyValidation.Id != null && await GetRoleIdByNameAsync(uniqueKeyValidation.KeyValue) == (int)uniqueKeyValidation.Id)
            {
                return true;
            }
            else
            {
                return !await IsRoleExistsByNameAsync(uniqueKeyValidation.KeyValue);
            }
        }

        public async Task<int?> GetModuleIdByClaimId(int claimId)
        {
            var pageId = await _masterDbContext.TblPages
                 .Where(x => x.Claims.Any(_ => _.Id == claimId))
                 .Select(x => x.Id).FirstOrDefaultAsync();
            if (pageId != 0)
                return await _masterDbContext.TblModules.Where(x => x.Pages.Any(_ => _.Id == pageId))
                    .Select(x => x.Id)
                    .FirstOrDefaultAsync();
            return null;
        }

        public async Task<ModuleAndClaimsModel[]> GetModuleWithClaimsAsync()
        {
            //return await _masterDbContext.TblModules.Select(x => new ModuleAndClaimsModel
            //{
            //    Claims = x.Pages.Where(w => w.IsActive.Equals(true)).Select(_ => _.Claims.Select(ine => new ClaimModel
            //    {
            //        Id = ine.Id,
            //        Name = ine.Name
            //    })).SelectMany(x => x)
            //    ,
            //    ModuleId = x.Id,
            //    ModuleName = x.Name
            //}).ToArrayAsync();
            var AllowedModules = _dbContext.TblModules.AsNoTracking().Select(x => x.ModuleId).ToList();
            var AllowedPages = _dbContext.TblPages.AsNoTracking().Select(x => x.Id).ToList();

            return await _masterDbContext.TblModules.AsNoTracking().Where(x => AllowedModules.Contains(x.Id)).Select(x => new ModuleAndClaimsModel
            {
                Claims = x.Pages.Where(w => w.IsActive.Equals(true) && AllowedPages.Contains(w.Id)).Select(ine => new ClaimModel
                {
                    Id = ine.Id,
                    Name = ine.Name
                }),
                ModuleId = x.Id,
                ModuleName = x.Name
            }).ToArrayAsync();





        }

        public async Task<RoleWithClaimsModel?> GetClaimsAndModulesWithRoleByRoleIdAsync(int roleId)
        {
            var role = await GetAllRoles().Select(x => new RoleWithClaimsModel
            {
                RoleId = x.Id,
                RoleName = x.Name
            }).FirstOrDefaultAsync(x => x.RoleId == roleId);

            if (role != null)
            {
                var selectedClaims = await GetClaimsByIdsAsync(await GetClaimsByRoleIdAsync(roleId));
                var moduleWithClaims = await GetModuleWithClaimsAsync();
                foreach (var item in moduleWithClaims)
                {
                    var module = new ModuleAndClaimsWithSelectionModel
                    {
                        ModuleId = item.ModuleId,
                        ModuleName = item.ModuleName,
                    };
                    foreach (var claim in item.Claims)
                    {
                        if (selectedClaims.Any(x => x.Id == claim.Id))
                            module.Claims.Add(new ClaimWithSelectionModel
                            {
                                Claim = claim,
                                IsSelected = true
                            });
                        else
                            module.Claims.Add(new ClaimWithSelectionModel
                            {
                                Claim = claim,
                                IsSelected = false
                            });
                    }
                    role.Modules.Add(module);
                }
                return role;
            }
            return null;
        }
        public async Task<List<RoleWithClaimsModel>> GetRoleWihClaimsAsync(string? roleName, string? SortDirection)
        {
            List<RoleWithClaimsModel> lst = new List<RoleWithClaimsModel>();
            var roles = new List<RoleWithClaimsModel>();
            if (!string.IsNullOrEmpty(roleName))
            {
                roles = await GetAllRoles().Select(x => new RoleWithClaimsModel
                {
                    RoleId = x.Id,
                    RoleName = x.Name
                }).Where(f => f.RoleName != null && f.RoleName.ToLower().Contains(roleName)).ToListAsync();
            }
            else
            {
                roles = await GetAllRoles().Select(x => new RoleWithClaimsModel
                {
                    RoleId = x.Id,
                    RoleName = x.Name
                }).ToListAsync();
            }
            foreach (var role in roles)
            {

                var selectedClaims = await GetClaimsByIdsAsync(await GetClaimsByRoleIdAsync(role.RoleId));
                var moduleWithClaims = await GetModuleWithClaimsAsync();
                foreach (var item in moduleWithClaims)
                {
                    var module = new ModuleAndClaimsWithSelectionModel
                    {
                        ModuleId = item.ModuleId,
                        ModuleName = item.ModuleName,
                    };
                    foreach (var claim in item.Claims)
                    {
                        if (selectedClaims.Any(x => x.Id == claim.Id))
                            module.Claims.Add(new ClaimWithSelectionModel
                            {
                                Claim = claim,
                                IsSelected = true
                            });
                        //else
                        //    module.Claims.Add(new ClaimWithSelectionModel
                        //    {
                        //        Claim = claim,
                        //        IsSelected = false
                        //    });
                    }
                    role.Modules.Add(module);
                }
                lst.Add(role);
            }
            if (SortDirection != null)
            {
                lst = lst.AsQueryable().OrderBy($"roleName {SortDirection}").ToList();
            }
            else
            {
                lst = lst.AsQueryable().OrderBy($"roleId desc").ToList();
            }
            return lst;
        }


        public async Task<bool> DeleteRoleByIdAsync(int roleId)
        {
            return await _dbContext.TblRoles.Where(x => x.Id == roleId)
                 .ExecuteUpdateAsync(x => x
                 .SetProperty(p => p.IsDeleted, true)
                 .SetProperty(p => p.UpdateBy, _connectionManager.UserId)
                 .SetProperty(p => p.UpdateDate, DateTimeNow.Get)
                 ) > 0;
        }

        public IQueryable<LabUserRoleModel> GetAllUserRoles()
        {
            return _dbContext.TblUserRoles.Select(x => new LabUserRoleModel
            {
                RoleId = x.RoleId,
                UserId = x.UserId,
                RoleName = x.Role.Name,
                RoleType = x.SubRoleType
            });
        }
    }
}



