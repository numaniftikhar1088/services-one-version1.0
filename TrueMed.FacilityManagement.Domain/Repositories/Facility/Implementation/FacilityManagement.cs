using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.Linq.Dynamic;
using System.Net;
using System.Transactions;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.File;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Common;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Identity;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.FacilityManagement.Domain.Enums;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Internal;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Facility.DTOs;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using Status = TrueMed.Domain.Model.Identity.Status;

namespace TrueMed.Domain.Repositories.Lab.Implementation
{
    public class FacilityManagement : IFacilityManagement
    {
        private IFileManagement _fileManager;
        private readonly IConnectionManager _connectionManager;
        private IUserManagement _userManagement;
        private readonly ILabRoleManagement _roleManagement;
        private ApplicationDbContext _dbContext;
        private MasterDbContext _masterDbContext;
        private readonly IEmailManager _emailManager;
        public FacilityManagement(IFileManagement fileManager,
            IConnectionManager connectionManager,
            IUserManagement userManagement,
            ILabRoleManagement roleManagement,
            MasterDbContext masterDbContext,
            ApplicationDbContext applicationDbContext,
            IEmailManager emailManager
            )
        {
            _fileManager = fileManager;
            this._connectionManager = connectionManager;
            _userManagement = userManagement;
            this._roleManagement = roleManagement;
            _dbContext = applicationDbContext;
            _masterDbContext = masterDbContext;
            _emailManager = emailManager;
        }

        public async Task<FacilityResult> AddOrUpdateFacilityAsync(FacilityViewModel facility)
        {
            var isUpdating = facility.GeneralInfo.FacilityId > 0;
            var identityResult = new FacilityResult(Status.Failed, "one or more validation errors.");

            using (TransactionScope transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                TblFacility tblFacility = new TblFacility();

                #region Facility General Information

                tblFacility.FacilityId = Convert.ToInt32(facility.GeneralInfo.FacilityId);
                tblFacility.FacilityName = facility.GeneralInfo.FacilityName;
                tblFacility.Address = facility.GeneralInfo.AddressView.Address1;
                tblFacility.Address2 = facility.GeneralInfo.AddressView.Address2;
                tblFacility.City = facility.GeneralInfo.AddressView.City;
                tblFacility.State = facility.GeneralInfo.AddressView.State;
                tblFacility.ZipCode = facility.GeneralInfo.ZipCode;
                tblFacility.FacilityPhone = facility.GeneralInfo.FacilityPhone;
                tblFacility.FacilityFax = facility.GeneralInfo.FacilityFax;
                tblFacility.FacilityWebsite = facility.GeneralInfo.FacilityWebsite;

                if (facility.ProviderInfo != null && facility.ProviderInfo.ActivationType != null)
                    tblFacility.AccountActivationType = (int)facility.ProviderInfo.ActivationType;

                tblFacility.CreatedTime = DateTimeNow.Get;
                tblFacility.CreatedBy = _connectionManager.UserId;
                tblFacility.Status = facility.GeneralInfo.FacilityStatus;

                #endregion
                #region Facility Contact Information

                tblFacility.ContactFirstName = facility.ContactInfo.ContactFirstName;
                tblFacility.ContactLastName = facility.ContactInfo.ContactLastName;
                tblFacility.ContactPrimaryEmail = facility.ContactInfo.ContactPrimaryEmail;
                tblFacility.ContactPhone = facility.ContactInfo.ContactPhone;

                #endregion
                #region Facility Critical Information

                tblFacility.CriticalFirstName = facility.CriticalInfo.CriticalFirstName;
                tblFacility.CriticalLastName = facility.CriticalInfo.CriticalLastName;
                tblFacility.CriticalContactEmail = facility.CriticalInfo.CriticalEmail;
                tblFacility.CriticalPhone = facility.CriticalInfo.CriticalPhoneNo;


                tblFacility.IsActive = true;
                #endregion
                #region Facility Infomation Save
                _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;



                if (isUpdating)
                {
                    var recordBeforeEdit = await _dbContext.TblFacilities.FirstOrDefaultAsync(r => r.FacilityId.Equals(facility.GeneralInfo.FacilityId));
                    if (!tblFacility.FacilityName.Equals(recordBeforeEdit.FacilityName))
                    {
                        var facilityExist = await IsFacilityNameUniqueAsync(tblFacility.FacilityName);
                        if (facilityExist.IsExist)
                        {
                            return (FacilityResult)identityResult.MakeFailed(message: "FacilityName is already exist");
                        }
                    }
                    tblFacility.IsApproved = recordBeforeEdit.IsApproved;
                    tblFacility.IsDeleted = recordBeforeEdit.IsDeleted;
                    _dbContext.TblFacilities.Update(tblFacility);
                    identityResult.MakeSuccessed("Facility updated");
                }
                else
                {
                    #region Facility Approval
                    var loggedInuserId = _connectionManager.UserId;
                    var adminTypeId = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id == loggedInuserId)?.AdminType;
                    var adminType = _masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == Convert.ToInt32(adminTypeId))?.UserType;
                    if (adminType.Trim().ToUpper() == "FACILITY")
                    {
                        tblFacility.IsApproved = null;
                        tblFacility.Status = "Pending";
                    }
                    else
                    {
                        tblFacility.IsApproved = true;
                        tblFacility.Status = "Active";
                    }
                    #endregion

                    await _dbContext.TblFacilities.AddAsync(tblFacility);
                    identityResult.MakeSuccessed("Facility Created!");
                }

                var facilityAck = await _dbContext.SaveChangesAsync();

                #region Facility Provider Information


                var userId = string.Empty;
                if (!isUpdating)
                {
                    ApplicationUser user = new ApplicationUser()
                    {
                        FirstName = facility.ProviderInfo.PhysicianFirstName,
                        LastName = facility.ProviderInfo.PhysicianLastName,
                        Username = facility.ProviderInfo.Username,
                        Email = facility.ProviderInfo.Email,
                        Phone = facility.ProviderInfo.PhoneNumber,
                        UserType = UserType.LabUser,
                        AdminType = ((int)FacilityUserTypeEnum.Doctor).ToString(),
                        isActive = true
                    };
                    switch (facility.ProviderInfo.ActivationType)
                    {
                        case AccountActivationTypeEnum.Username:
                            user.Username = facility.ProviderInfo.Username;
                            user.Password = facility.ProviderInfo.Password;
                            user.UserAccountType = (int?)AccountActivationTypeEnum.Username;

                            break;
                        case AccountActivationTypeEnum.Email:
                            user.Email = facility.ProviderInfo.Email;
                            user.UserAccountType = (int?)AccountActivationTypeEnum.Email;


                            break;
                        default:
                            break;
                    }

                    identityResult = new FacilityResult(_userManagement.RegisterUser(user, user.Password));
                    if (!identityResult.IsSuccess)
                    {
                        if (identityResult.HasErrorKey("Email"))
                        {
                            user.Id = _masterDbContext.TblUsers.FirstOrDefault(f => f.Email == user.Email)?.Id;
                            identityResult.UpdateErrorKey("Email", "ProviderInfo.Email");
                        }
                        if (identityResult.HasErrorKey("Username"))
                        {
                            user.Id = _masterDbContext.TblUsers.FirstOrDefault(f => f.Username == user.Username)?.Id;
                            identityResult.UpdateErrorKey("Username", "ProviderInfo.Username");
                        }
                        return identityResult;
                    }
                    if(facility.ProviderInfo.ActivationType == AccountActivationTypeEnum.Username)
                    {

                    }
                    else
                    {

                    }
                    //var role = new TblUserRole()
                    //{
                    //    UserId = identityResult?.Id.ToString(),
                    //    SubRoleType = 2,
                    //    RoleId = _dbContext.TblRoles.FirstOrDefault(f => f.Name.Trim().ToLower() == "Physician".Trim().ToLower()).Id
                    //};
                    //_dbContext.TblUserRoles.Add(role);



                    var getLabId = _connectionManager.GetLabId();
                    var addFacilityUser = await AddUserInFacilityAsync(new FacilityUserViewModel()
                    {
                        FacilityId = tblFacility.FacilityId,
                        UserId = user.Id,
                        ReferenceLabId = getLabId.ToString()
                    });

                    if (!addFacilityUser.IsSuccess)
                    {
                        return addFacilityUser;
                    }
                    var addFacilityUserInLab = await AddFacilityUserInLabAsync(new AddFacilityUserInLabViewModel()
                    {
                        LabId = getLabId,
                        IsActive = true,
                        IsDefault = true,
                        UserId = user.Id,
                        IsDeleted = false
                    });
                    var role = new TblUserRole()
                    {
                        UserId = user.Id,
                        SubRoleType = 2,
                        RoleId = _dbContext.TblRoles.FirstOrDefault(f => f.Name.Trim().ToLower() == "Physician".Trim().ToLower()).Id
                    };
                    _dbContext.TblUserRoles.Add(role);
                    var userAdditionalInfos = _userManagement.UpdateUserAdditionalInfo(new UserAdditionalInfo()
                    {
                        NPI = facility.ProviderInfo.NPI,
                        StateLicenseNo = facility.ProviderInfo.StateLicense,
                        Id = user.Id
                    });

                    //if (!userAdditionalInfos.IsSuccess)
                    //{
                    //    return identityResult;
                    //}

                    //var addUserRole = _roleManagement.UpdateUserRoleByUserId(user.Id, "Physician", (int)_connectionManager.GetLabId());
                    //if (!addUserRole.IsSuccess)
                    //{
                    //    return identityResult;
                    //}
                    userId = user.Id;
                }

                //if (!identityResult.IsSuccess)
                //{
                //    return identityResult;
                //}

                #region Shipping Information

                TblShipping tblShipping = new TblShipping();
                tblShipping.FacilityId = tblFacility.FacilityId;
                tblShipping.ShippingName = facility.ShippingInfo.ShippingName;
                tblShipping.ShippingAddress = facility.ShippingInfo.ShippingAddress;
                tblShipping.ShippingPhoneNo = facility.ShippingInfo.ShippingPhoneNumber;
                tblShipping.ShippingEmail = facility.ShippingInfo.ShippingEmail;
                tblShipping.ShippingNote = facility.ShippingInfo.ShippingNote;
                if (facility.GeneralInfo.FacilityId == 0)
                { _dbContext.TblShippings.Add(tblShipping); }
                else
                {
                    var existingShipping = await _dbContext.TblShippings.FirstOrDefaultAsync(x => x.FacilityId == facility.GeneralInfo.FacilityId);
                    if (existingShipping != null)
                    {
                        existingShipping.FacilityId = tblFacility.FacilityId;
                        existingShipping.ShippingName = tblShipping.ShippingName;
                        existingShipping.ShippingAddress = tblShipping.ShippingAddress;
                        existingShipping.ShippingPhoneNo = tblShipping.ShippingPhoneNo;
                        existingShipping.ShippingEmail = tblShipping.ShippingEmail;
                        existingShipping.ShippingNote = tblShipping.ShippingNote;
                        _dbContext.TblShippings.Update(existingShipping);
                    }
                }
                #endregion


                #region Facility Options
                List<TblFacilityOption> facilityOptions = new List<TblFacilityOption>();
                foreach (var option in facility.FacilityOpt)
                {
                    TblFacilityOption tblFacilityOption = new TblFacilityOption();
                    tblFacilityOption.FacilityId = tblFacility.FacilityId;
                    tblFacilityOption.OptionId = option.OptionId;
                    tblFacilityOption.OptionValue = option.OptionValue;
                    facilityOptions.Add(tblFacilityOption);
                }
                if (facility.GeneralInfo.FacilityId == 0)
                {
                    _dbContext.TblFacilityOptions.AddRange(facilityOptions);
                }
                else
                {
                    var existingOptions = _dbContext.TblFacilityOptions.Where(o => o.FacilityId == facility.GeneralInfo.FacilityId).ToList();
                    _dbContext.RemoveRange(existingOptions);
                    var updatedOptions = facilityOptions.Except(existingOptions).ToList();
                    _dbContext.TblFacilityOptions.UpdateRange(updatedOptions);
                }
                #endregion

                #region File Saved
                List<TblFile> files = new List<TblFile>();
                foreach (var file in facility.Files)
                {
                    if (!string.IsNullOrWhiteSpace(file.FilePath))
                    {
                        var facilityFile = new TblFile()
                        {
                            CreateDate = DateTimeNow.Get,
                            FacilityId = tblFacility.FacilityId,
                            FilePath = file.FilePath,
                            Name = file.Name,
                            Length = file.FileLenght,
                            LabId = file.LabId
                        };
                        files.Add(facilityFile);
                    }
                }
                if (files.Count > 0)
                    await _dbContext.TblFiles.AddRangeAsync(files);
                #endregion

                #endregion
                #endregion
                #region Template Info Save
                var existing = _dbContext.TblFacilityReportTemplates.FirstOrDefault(f => f.FacilityId == tblFacility.FacilityId);
                if (existing != null)
                {
                    existing.TemplateId = Convert.ToInt32(facility.TemplateId);
                    _dbContext.TblFacilityReportTemplates.Update(existing);

                }
                else
                {
                    var tblFacRptTmplt = new TblFacilityReportTemplate()
                    {
                        FacilityId = tblFacility.FacilityId,
                        TemplateId = Convert.ToInt32(facility.TemplateId)
                    };
                    await _dbContext.TblFacilityReportTemplates.AddAsync(tblFacRptTmplt);

                }
                #endregion
                var labId = _connectionManager.GetLabId();
                var labAssignmentIds = _dbContext.TblLabAssignments.Where(w => w.RefLabId == labId && w.IsDefault.Equals(true)).Select(s => s.Id).ToList();

                if (facility.ProviderInfo.ActivationType == AccountActivationTypeEnum.Email && !isUpdating)
                {
                    #region facility Ref Lab Assignment Add
                    List<TblFacilityRefLabAssignment> facRefLabAssignmentList = new List<TblFacilityRefLabAssignment>();
                    foreach (var Id in labAssignmentIds)
                    {
                        var facRefLabAssignment = new TblFacilityRefLabAssignment
                        {
                            FacilityId = tblFacility.FacilityId,
                            LabAssignmentId = Id,
                            CreatedBy = _connectionManager.UserId,
                            CreatedDate = DateTimeNow.Get,
                            IsActive = true
                        };
                        facRefLabAssignmentList.Add(facRefLabAssignment);
                    }

                    //var facRefLabAssignment = new TblFacilityRefLabAssignment
                    //{
                    //    FacilityId = tblFacility.FacilityId,
                    //    LabAssignmentId = labAssignmentIds,
                    //    CreatedBy = _connectionManager.UserId,
                    //    CreatedDate = DateTimeNow.Get,
                    //    IsActive = true
                    //};
                    await _dbContext.TblFacilityRefLabAssignments.AddRangeAsync(facRefLabAssignmentList);
                    #endregion

                    if (!_masterDbContext.TblUsers.Any(a => a.Id.Trim() == userId.Trim()))
                    {
                        var isValidEmail = _emailManager.IsValidEmail(facility.ProviderInfo.Email);
                        if (isValidEmail)
                        {
                            await _emailManager.SendEmailAsync
                                (
                                    new List<string>() { facility.ProviderInfo.Email },
                                        "Password Creation",
                                        $"Please click to this Link : https://tmpotruemeditlabportal-dev.azurewebsites.net/Admin/InitializePassword?id={userId} for Password Initialized"
                                );
                        }
                    }
                }
                await _dbContext.SaveChangesAsync();
                transaction.Complete();
                facility.GeneralInfo.FacilityId = tblFacility.FacilityId;
                identityResult.UpdateIdentifier(tblFacility.FacilityId);
                if (isUpdating) identityResult.MakeSuccessed("Succesfully updated."); else identityResult.MakeSuccessed("Succesfully Created.");
                return identityResult;
            }
        }
        public IQueryable<FacilityViewModel> GetFacilities()
        {
            var facilities = _dbContext.TblFacilities.Where(f => f.IsDeleted.Equals(false))
                                                    .Include(f => f.TblFacilityOptions)
                                                    .Include(s => s.TblShipping)
                                                    .Include(x => x.TblFacilityFiles)
                                                    .Include(a => a.TblFiles)
                            .Select(f => new FacilityViewModel()
                            {
                                GeneralInfo = new General()
                                {
                                    FacilityId = f.FacilityId,
                                    FacilityName = f.FacilityName,
                                    AddressView = new AddressViewModel()
                                    {
                                        Address1 = f.Address,
                                        Address2 = f.Address2,
                                        City = f.City,
                                        State = f.State,
                                        ZipCode = f.ZipCode
                                    },
                                    ZipCode = f.ZipCode,
                                    FacilityPhone = f.FacilityPhone,
                                    FacilityFax = f.FacilityFax,
                                    FacilityWebsite = f.FacilityWebsite,
                                    FacilityStatus = f.Status,
                                    IsApproved = f.IsApproved,
                                    CreateDate = f.CreatedTime,
                                    CreateBy = f.CreatedBy,
                                },
                                ContactInfo = new ContactInformation()
                                {
                                    ContactFirstName = f.ContactFirstName,
                                    ContactLastName = f.ContactLastName,
                                    ContactPrimaryEmail = f.ContactPrimaryEmail,
                                    ContactPhone = f.ContactPhone
                                },
                                CriticalInfo = new CriticalInformation()
                                {
                                    CriticalFirstName = f.CriticalFirstName,
                                    CriticalLastName = f.CriticalLastName,
                                    CriticalEmail = f.CriticalContactEmail,
                                    CriticalPhoneNo = f.CriticalPhone
                                },
                                FacilityOpt = (List<FacilityOptions>)f.TblFacilityOptions.Select(s => new FacilityOptions()
                                {
                                    //Id = s.Id,
                                    OptionId = s.OptionId
                                    //FacilityId = s.FacilityId
                                }),
                                ShippingInfo = new ShippingInformation()
                                {
                                    ShippingName = f.TblShipping.ShippingName,
                                    ShippingAddress = f.TblShipping.ShippingAddress,
                                    ShippingPhoneNumber = f.TblShipping.ShippingPhoneNo,
                                    ShippingEmail = f.TblShipping.ShippingEmail,
                                    ShippingNote = f.TblShipping.ShippingNote
                                },
                                Files = (List<UploadFiles>)f.TblFiles.Select(f => new UploadFiles()
                                {
                                    Id = f.Id,
                                    FilePath = f.FilePath,
                                    Name = f.Name
                                }),
                            });

            //var facilityId = _connectionManager.FacilityId;
            var userId = _connectionManager.UserId;


            var adminTypeId = (_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == userId))?.AdminType;
            var adminType = (_masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == int.Parse(adminTypeId))).UserType.Trim().ToUpper();

            if (adminType == "FACILITY")
            {
                var facilityIdsByUser = _dbContext.TblFacilityUsers.Where(f => f.UserId == userId).Select(s => s.FacilityId).ToList();
                facilities = facilities.Where(f => facilityIdsByUser.Contains(f.GeneralInfo.FacilityId));
            }
            return facilities.OrderByDescending(o => o.GeneralInfo.FacilityId);
        }
        public IQueryable<DropDownResponseModel> GetActiveFacilities()
        {

            var facilities = _dbContext.TblFacilities.Where(x => x.Status == "Active").Select(x => new DropDownResponseModel
            {
                Value = x.FacilityId.ToString(),
                Label = x.FacilityName
            });

            return facilities;
        }

        public IQueryable<FacilityFileViewModel> GetFacilityFiles()
        {
            var result = _dbContext.TblFiles
                 .Join(_dbContext.TblFacilityFiles, x => x.Id, x => x.FileId, (primary, referenced) => new FacilityFileViewModel
                 {
                     Id = primary.Id,
                     ContentLength = primary.Length,
                     ContentType = primary.ContentType,
                     FilePath = primary.FilePath,
                     Name = primary.Name,
                     CreateDate = primary.CreateDate,
                     FileType = referenced.FileType/*, UserId = primary.UserId*/,
                     FacilityId = referenced.FacilityId
                 });
            return result;
        }

        public async Task<FacilityViewModel> GetFacilityByIdAsync(int facilityId)
        {

            var facility = await _dbContext.TblFacilities
                .Include(f => f.TblFacilityOptions)
                .Include(s => s.TblShipping)
                .Include(x => x.TblFacilityFiles)
                .Include(a => a.TblFiles)
                .Include(i => i.TblFacilityReportTemplates)
                .Select(f => new FacilityViewModel()
                {
                    GeneralInfo = new General()
                    {
                        FacilityId = f.FacilityId,
                        FacilityName = f.FacilityName,
                        AddressView = new AddressViewModel()
                        {
                            Address1 = f.Address,
                            Address2 = f.Address2,
                            City = f.City,
                            State = f.State,
                            ZipCode = f.ZipCode
                        },
                        ZipCode = f.ZipCode,
                        FacilityPhone = f.FacilityPhone,
                        FacilityFax = f.FacilityFax,
                        FacilityWebsite = f.FacilityWebsite,
                        FacilityStatus = f.Status,
                        CreateDate = f.CreatedTime,
                        AccountActivationType = (AccountActivationTypeEnum)Convert.ToInt32(f.AccountActivationType)
                    },
                    ContactInfo = new ContactInformation()
                    {
                        ContactFirstName = f.ContactFirstName,
                        ContactLastName = f.ContactLastName,
                        ContactPrimaryEmail = f.ContactPrimaryEmail,
                        ContactPhone = f.ContactPhone
                    },
                    CriticalInfo = new CriticalInformation()
                    {
                        CriticalFirstName = f.CriticalFirstName,
                        CriticalLastName = f.CriticalLastName,
                        CriticalEmail = f.CriticalContactEmail,
                        CriticalPhoneNo = f.CriticalPhone
                    },
                    FacilityOpt = (List<FacilityOptions>)f.TblFacilityOptions.Select(s => new FacilityOptions()
                    {
                        OptionId = s.OptionId,
                        OptionValue = s.OptionValue.Trim()

                    }),
                    ShippingInfo = new ShippingInformation()
                    {
                        ShippingName = f.TblShipping.ShippingName,
                        ShippingAddress = f.TblShipping.ShippingAddress,
                        ShippingPhoneNumber = f.TblShipping.ShippingPhoneNo,
                        ShippingEmail = f.TblShipping.ShippingEmail,
                        ShippingNote = f.TblShipping.ShippingNote
                    },
                    Files = (List<UploadFiles>)f.TblFiles.Select(f => new UploadFiles()
                    {
                        Id = f.Id,
                        FilePath = f.FilePath,
                        Name = f.Name,
                        FileLenght = f.Length

                    }),
                }).FirstOrDefaultAsync(f => f.GeneralInfo.FacilityId.Equals(facilityId)) ?? new();

            var facilityUser = _dbContext.TblFacilityUsers.FirstOrDefault(f => f.FacilityId == facility.GeneralInfo.FacilityId)?.UserId;
            var user = _masterDbContext.TblUsers.FirstOrDefault(f => f.Id.Equals(facilityUser)) ?? new();
            var userAdditionalInfos = _masterDbContext.TblUserAdditionalInfos.FirstOrDefault(f => f.UserId.Equals(user.Id)) ?? new();

            facility.ProviderInfo = new ProviderInformation()
            {
                ActivationType = (AccountActivationTypeEnum)facility.GeneralInfo.AccountActivationType,
                Email = user.Email,
                NPI = userAdditionalInfos.Npi,
                PhoneNumber = user.PhoneNumber,
                PhysicianFirstName = user.FirstName,
                PhysicianLastName = user.LastName,
                StateLicense = userAdditionalInfos.StateLicenseNo,
                Username = user.Username
            };
            facility.TemplateId = _dbContext.TblFacilityReportTemplates.FirstOrDefault(f => f.FacilityId == facilityId)?.TemplateId;
            return facility;
        }

        public async Task<ICollection<TblFacilityCheckBoxOption>> GetFacilityOptionsAsync()
        {
            return await _dbContext.TblFacilityCheckBoxOptions.ToListAsync();
        }

        public async Task<bool> IsUserExistsInFacilityByUserIdAsync(FacilityUserViewModel facilityUserView)
        {
            return await _dbContext.TblFacilityUsers.AnyAsync(x => x.UserId == facilityUserView.UserId && x.FacilityId == facilityUserView.FacilityId);
        }

        public async Task<FacilityResult> AddUserInFacilityAsync(FacilityUserViewModel viewModel)
        {
            var identityResult = new FacilityResult(Status.Failed, "One or more validation errors.");
            if (!await IsUserExistsInFacilityByUserIdAsync(viewModel))
            {
                _dbContext.TblFacilityUsers.Add(new TblFacilityUser()
                {
                    FacilityId = viewModel.FacilityId,
                    UserId = viewModel.UserId,
                    RefrenceLabId = viewModel.ReferenceLabId
                });
                var ack = await _dbContext.SaveChangesAsync();
                identityResult.MakeSuccessed();
                return identityResult;
            }
            else
            {
                identityResult.AddError(nameof(viewModel.UserId), Validator.AlreadyFound);
                return identityResult;
            }
        }
        public async Task<FacilityResult> AddFacilityUserInLabAsync(AddFacilityUserInLabViewModel viewModel)
        {
            var identityResult = new FacilityResult(Status.Failed, "One or more validation errors.");

            var tblLabUserObj = new TrueMed.Sevices.MasterEntities.TblLabUser()
            {
                LabId = Convert.ToInt32(viewModel.LabId),
                IsActive = viewModel.IsActive,
                IsDefault = viewModel.IsDefault,
                UserId = viewModel.UserId,
                IsDeleted = viewModel.IsDeleted
            };
            if (!_masterDbContext.TblLabUsers.Any(a => a.UserId == tblLabUserObj.UserId))
            {
                _masterDbContext.TblLabUsers.Add(tblLabUserObj);
                var ack = await _dbContext.SaveChangesAsync();
                identityResult.MakeSuccessed();
            }
            return identityResult;
        }

        public async Task<FacilityResult> SaveFilesAsync(int facilityId, List<FileViewModel> files, string userId, bool deleteExistingFiles = false, FacilityFileType fileType = FacilityFileType.Normal)
        {
            if (deleteExistingFiles)
            {
                _fileManager.DeleteFilesById(files.Select(x => x.Id));
            }
            foreach (var file in files)
            {
                var fileId = _fileManager.SaveFileReference(file, userId);
                _dbContext.TblFacilityFiles.Add(new TblFacilityFile()
                {
                    FacilityId = facilityId,
                    FileId = fileId,
                    FileType = Enum.GetName(fileType.GetType(), fileType)
                });
                file.Id = fileId;
            }
            var ack = await _dbContext.SaveChangesAsync();

            return new FacilityResult(Status.Success, "request success processed.");
        }

        public async Task<bool> DeleteFacilityByIdAsync(int facilityId, string userId)
        {
            return await _dbContext.Database.ExecuteSqlRawAsync("EXEC SP_DELETE_FACILITY_BY_ID @UserId  = {0}, @FacilitId = {1}", userId, facilityId) == 1;
        }

        public async Task<bool> IsFacilityExistsByIdAsync(int facilityId)
        {
            return await _dbContext.TblFacilities.AnyAsync(f => f.FacilityId == facilityId);
        }

        public async Task<FacilityResult> FacilityStatusChangeAsync(FacilityStatusChange facilityParam)
        {
            var identityResult = new FacilityResult(Status.Failed, "One or more validation errors.");
            if (string.IsNullOrWhiteSpace(facilityParam.Status))
            {
                identityResult.AddError(nameof(facilityParam.Status), Validator.Required);
            }
            if (facilityParam.FacilityId <= 0)
            {
                identityResult.AddError(nameof(facilityParam.FacilityId), Validator.Required);
            }
            if (!await IsFacilityExistsByIdAsync(facilityParam.FacilityId))
            {
                identityResult.AddError(nameof(facilityParam.FacilityId), Validator.NotFound);
            }
            if (identityResult.HasErrors)
                return identityResult;


            var existingFacility = await _dbContext.TblFacilities.FirstOrDefaultAsync(f => f.FacilityId.Equals(facilityParam.FacilityId));
            existingFacility.Status = facilityParam.Status.Trim();
            _dbContext.Entry(existingFacility).State = EntityState.Modified;
            var ack = await _dbContext.SaveChangesAsync();

            identityResult.MakeSuccessed();

            return identityResult;
        }

        public async Task<ICollection<FacilityAssignUserViewModel>> GetFacilityAssignedUserByFacilityIdAsync(int facilityId, int labId)
        {
            var facilityUsers = await _dbContext.TblFacilityUsers
                .Where(x => x.FacilityId == facilityId)
                .Select(x => x.UserId).ToListAsync();

            var users = await _masterDbContext.TblUsers
                .Where(x => facilityUsers.Contains(x.Id))
                .Select(x => new FacilityAssignUserViewModel()
                {
                    FacilityId = facilityId,
                    UserId = x.Id,
                    Username = x.Username,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Email = x.Email,
                    PhoneNo = x.PhoneNumber,
                    LabUser = x.UserType.ToString()
                }).ToListAsync();
            return users;
        }
        public async Task<ICollection<FacilityAssignUserViewModel>> GetFacilityCollectorsFacilityIdAsync(int facilityId, int labId)
        {
            var facilityUsers = await _dbContext.TblFacilityUsers.Join(_dbContext.TblUserRoles, x => x.UserId, y => y.UserId, (x, y) => new
            {
                x.UserId,
                x.FacilityId,
                y.RoleId
            })
                .Where(x => x.FacilityId == facilityId && x.RoleId == 5)
                .Select(x => x.UserId).ToListAsync();

            var users = await _masterDbContext.TblUsers
                .Where(x => facilityUsers.Contains(x.Id))
                .Select(x => new FacilityAssignUserViewModel()
                {
                    FacilityId = facilityId,
                    UserId = x.Id,
                    Username = x.Username,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Email = x.Email,
                    PhoneNo = x.PhoneNumber,
                    LabUser = x.UserType.ToString()
                }).ToListAsync();
            return users;
        }


        public async Task<bool> IsFacilityAlreadyExistsByNameAsync(string name)
        {
            return await _dbContext.TblFacilities.AnyAsync(x => x.FacilityName.Equals(name));
        }

        public async Task<string?> GetFacilityNameByIdAsync(int facilityId)
        {
            return await _dbContext.TblFacilities.Where(x => x.FacilityId == facilityId)
                .Select(x => x.FacilityName).FirstOrDefaultAsync();
        }

        public async Task<int?> GetFacilityIdByNameAsync(string name)
        {
            return await _dbContext.TblFacilities.Where(x => x.FacilityName.Equals(name))
                .Select(x => x.FacilityId).FirstOrDefaultAsync();
        }

        public async Task<bool> IsFacilityNameValidAsync(KeyValuePairViewModel<int?> uniqueKeyValidation)
        {
            if (await GetFacilityIdByNameAsync(uniqueKeyValidation.KeyValue) == Convert.ToInt32(uniqueKeyValidation.Id))
            {
                return true;
            }
            else
            {
                return !await IsFacilityAlreadyExistsByNameAsync(uniqueKeyValidation.KeyValue);
            }
        }

        public async Task<RequestResponse> GetFacilityAgainstUserIdAsync(string userId)
        {
            var response = new RequestResponse();
            if (string.IsNullOrEmpty(userId))
            {
                response.ResponseStatus = "Failed";
                response.ResponseMessage = "User ID is empty !";
                response.StatusCode = Status.Failed;
                return response;
            }
            var result = await _dbContext.TblFacilityUsers.Select(s =>
            new FacilityAgainstUserSelectedField()
            {
                UserId = s.UserId,
                FacilityId = s.FacilityId

            }).Where(f => f.UserId.Equals(userId)).ToListAsync();
            List<FacilityAgainstUser> facilities = new List<FacilityAgainstUser>();
            foreach (var item in result)
            {
                var facilityResult = await _dbContext.TblFacilities.FirstOrDefaultAsync(f => f.FacilityId.Equals(item.FacilityId));
                if (facilityResult != null)
                {
                    facilities.Add
                    (
                        new FacilityAgainstUser()
                        {
                            FacilityId = facilityResult.FacilityId,
                            FacilityName = facilityResult.FacilityName,
                            Address = facilityResult.Address,
                            Address2 = facilityResult.Address2,
                            City = facilityResult.City,
                            State = facilityResult.State
                        }
                    );
                }
            }
            response.Data = facilities;
            response.ResponseMessage = "Request Processed !";
            response.ResponseStatus = "Success";
            response.StatusCode = Status.Success;
            return response;
        }

        public async Task<RequestResponse> IsFacilityNameUniqueAsync(string facilityName)
        {
            var response = new RequestResponse();
            if (string.IsNullOrEmpty(facilityName))
            {
                response.ResponseStatus = "Failed";
                response.ResponseMessage = "FaciityName is empty !";
                response.StatusCode = Status.Failed;
                return response;
            }
            var isFacilityExist = _dbContext.TblFacilities.Any(f => f.FacilityName.ToLower().Trim() == facilityName.Trim().ToLower());
            if (isFacilityExist)
            {
                response.IsExist = true;
                response.ResponseMessage = "FacilityName is already Exist !";
                response.ResponseStatus = "Failed";
                response.StatusCode = Status.Failed;
            }
            return response;
        }
        public Models.Response.RequestResponse BulkFacilityUpload(FileDataRequest request)
        {
            var response = new Models.Response.RequestResponse();

            using var stream = new MemoryStream(request.Contents);
            using var package = new ExcelPackage(stream);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            var workSheet = package.Workbook.Worksheets[0];

            int rowLenght = workSheet.Dimension.End.Row;
            int columnLenght = workSheet.Dimension.End.Column;

            if (rowLenght == 1)
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                response.Message = "File is Empty...";
                return response;
            }
            if (columnLenght < 26 || columnLenght > 26)
            {
                response.StatusCode = HttpStatusCode.BadRequest;
                response.Message = "File Invalid...";
                return response;
            }

            string list = "";

            for (int row = 2; row <= workSheet.Dimension.End.Row; row++)
            {
                List<string> dataObjList = new List<string>();
                for (int col = 1; col <= workSheet.Dimension.End.Column; col++)
                {

                    var cellValue = workSheet.Cells[row, col].Value;
                    if ((col != 1 || col == 1) && cellValue != null)
                        dataObjList.Add(cellValue.ToString());
                    else
                        dataObjList.Add("");
                }
                BulkFacilitySaveRequest bulk = new BulkFacilitySaveRequest()
                {
                    FacilityName = dataObjList[0],
                    FacilityPhone = dataObjList[1],
                    FacilityFax = dataObjList[2],
                    FacilityAddress = dataObjList[3],
                    FacilityAddress2 = dataObjList[4],
                    FacilityCity = dataObjList[5],
                    FacilityState = dataObjList[6],
                    FacilityZipCode = dataObjList[7],
                    PrimaryContactFirstName = dataObjList[8],
                    PrimaryContactLastName = dataObjList[9],
                    PrimaryContactEmail = dataObjList[10],
                    PrimaryContactPhone = dataObjList[11],
                    CriticalContactFirstName = dataObjList[12],
                    CriticalContactLastName = dataObjList[13],
                    CriticalContactEmail = dataObjList[14],
                    CriticalContactPhone = dataObjList[15],
                    ProviderFirstName = dataObjList[16],
                    ProviderLastName = dataObjList[17],
                    ProviderPhone = dataObjList[18],
                    ProviderNPI = dataObjList[19],
                    PhysicianStateLicense = dataObjList[20],
                    ShippingName = dataObjList[21],
                    ShippingAddress = dataObjList[22],
                    ShippingPhoneNumber = dataObjList[23],
                    ShippingEmail = dataObjList[24],
                    ShippingNote = dataObjList[25],
                };
                var userId = Guid.NewGuid().ToString();
                if (!string.IsNullOrEmpty(bulk.FacilityName) && !string.IsNullOrEmpty(bulk.FacilityAddress) && !string.IsNullOrEmpty(bulk.FacilityZipCode) && !string.IsNullOrEmpty(bulk.FacilityCity) && !string.IsNullOrEmpty(bulk.FacilityState) && !string.IsNullOrEmpty(bulk.FacilityPhone) && !string.IsNullOrEmpty(bulk.FacilityFax)
                    && !string.IsNullOrEmpty(bulk.PrimaryContactFirstName) && !string.IsNullOrEmpty(bulk.PrimaryContactLastName) && !string.IsNullOrEmpty(bulk.PrimaryContactPhone) && !string.IsNullOrEmpty(bulk.PrimaryContactEmail)
                    && !string.IsNullOrEmpty(bulk.ProviderFirstName) && !string.IsNullOrEmpty(bulk.ProviderLastName) && !string.IsNullOrEmpty(bulk.ProviderPhone) && !string.IsNullOrEmpty(bulk.ProviderNPI) && !string.IsNullOrEmpty(bulk.PhysicianStateLicense))
                {
                    using (var transactionScope = new TransactionScope())
                    {

                        #region Facility Information Save Section
                        var tblFacility = new TblFacility()
                        {
                            FacilityName = bulk.FacilityName,
                            FacilityPhone = bulk.FacilityPhone,
                            FacilityFax = bulk.FacilityFax,
                            Address = bulk.FacilityAddress,
                            Address2 = bulk.FacilityAddress2,
                            City = bulk.FacilityCity,
                            State = bulk.FacilityState,
                            ZipCode = bulk.FacilityZipCode,
                            ContactFirstName = bulk.PrimaryContactFirstName,
                            ContactLastName = bulk.PrimaryContactLastName,
                            ContactPrimaryEmail = bulk.PrimaryContactEmail,
                            ContactPhone = bulk.PrimaryContactPhone,
                            CriticalFirstName = bulk.CriticalContactFirstName,
                            CriticalLastName = bulk.CriticalContactLastName,
                            CriticalContactEmail = bulk.CriticalContactEmail,
                            CriticalPhone = bulk.CriticalContactPhone,
                            Status = "Active",
                            CreatedTime = DateTimeNow.Get
                        };
                        _dbContext.TblFacilities.Add(tblFacility);
                        _dbContext.SaveChanges();
                        #endregion
                        #region Provider Information Save Section
                        var tblUser = new TrueMed.Sevices.MasterEntities.TblUser()
                        {
                            Id = userId,
                            FirstName = bulk.ProviderFirstName,
                            LastName = bulk.ProviderLastName,
                            PhoneNumber = bulk.ProviderPhone
                        };

                        _masterDbContext.TblUsers.Add(tblUser);
                        _masterDbContext.SaveChanges();
                        #endregion
                        #region User Additional Information Save Section
                        var tblUserAdditionalInfo = new TrueMed.Sevices.MasterEntities.TblUserAdditionalInfo()
                        {
                            UserId = userId,
                            Npi = bulk.ProviderNPI,
                            StateLicenseNo = bulk.PhysicianStateLicense
                        };

                        _masterDbContext.TblUserAdditionalInfos.Add(tblUserAdditionalInfo);
                        _masterDbContext.SaveChanges();
                        #endregion
                        #region FacilityUser Information Save Section
                        var tblFacilityUser = new TblFacilityUser()
                        {
                            UserId = userId,
                            FacilityId = tblFacility.FacilityId,
                            CreatedTime = DateTimeNow.Get
                        };
                        _dbContext.TblFacilityUsers.Add(tblFacilityUser);
                        _dbContext.SaveChanges();
                        #endregion
                        #region Shipping Information Save Section
                        var tblShipping = new TblShipping()
                        {
                            ShippingName = bulk.ShippingName,
                            ShippingAddress = bulk.ShippingAddress,
                            ShippingPhoneNo = bulk.ShippingPhoneNumber,
                            ShippingEmail = bulk.ShippingEmail,
                            ShippingNote = bulk.ShippingNote,
                            FacilityId = tblFacility.FacilityId
                        };
                        _dbContext.TblShippings.Add(tblShipping);
                        _dbContext.SaveChanges();
                        #endregion

                        transactionScope.Complete();
                    }
                }
                else
                {
                    //list.Add(row);
                    //list = list + "except,";

                    if (string.IsNullOrEmpty(bulk.FacilityName))
                    {
                        list = list + " Facility Name,";
                    }
                    if (string.IsNullOrEmpty(bulk.FacilityAddress))
                    {
                        list = list + " Facility Address,";
                    }
                    if (string.IsNullOrEmpty(bulk.FacilityZipCode))
                    {
                        list = list + " ZipCode,";
                    }
                    if (string.IsNullOrEmpty(bulk.FacilityCity))
                    {
                        list = list + " City,";
                    }
                    if (string.IsNullOrEmpty(bulk.FacilityState))
                    {
                        list = list + " State,";
                    }
                    if (string.IsNullOrEmpty(bulk.FacilityPhone))
                    {
                        list = list + " Facility Phone,";
                    }
                    if (string.IsNullOrEmpty(bulk.FacilityFax))
                    {
                        list = list + " Facility Fax,";
                    }
                    if (string.IsNullOrEmpty(bulk.PrimaryContactFirstName))
                    {
                        list = list + " Primary Contact First Name,";
                    }
                    if (string.IsNullOrEmpty(bulk.PrimaryContactLastName))
                    {
                        list = list + " Primary Contact Last Name,";
                    }
                    if (string.IsNullOrEmpty(bulk.PrimaryContactPhone))
                    {
                        list = list + " Primary Contact Phone,";
                    }
                    if (string.IsNullOrEmpty(bulk.PrimaryContactEmail))
                    {
                        list = list + " Primary Contact Email,";
                    }
                    if (string.IsNullOrEmpty(bulk.ProviderFirstName))
                    {
                        list = list + " Provider FirstName,";
                    }
                    if (string.IsNullOrEmpty(bulk.ProviderLastName))
                    {
                        list = list + " Provider LastName,";
                    }
                    if (string.IsNullOrEmpty(bulk.ProviderPhone))
                    {
                        list = list + " Provider Phone,";
                    }
                    if (string.IsNullOrEmpty(bulk.ProviderNPI))
                    {
                        list = list + " Provider NPI,";
                    }
                    if (string.IsNullOrEmpty(bulk.PhysicianStateLicense))
                    {
                        list = list + " Physician State License,";
                    }
                    list = list + " is Missing in row: " + row + ".\n";
                }

            }

            if (list != "")
            {
                //string s = "";
                //foreach (var r in list)
                //{
                //    s = s + ", " + r.ToString();
                //}
                response.Message = "File Upload Successfully except rows :\n" + list;
                response.StatusCode = HttpStatusCode.NoContent;
            }
            else
            {
                response.Message = "Bulk Facility Upload Successfully...";
                response.StatusCode = HttpStatusCode.OK;
            }
            
            return response;
        }

        public Models.Response.RequestResponse<FileContentResult> FacilityExportToExcel(FacilityExportTolExcelRequest request)
        {
            var response = new Models.Response.RequestResponse<FileContentResult>();

            #region DataSource
            var facilityData = _dbContext.TblFacilities.Where(w => w.Status.Trim().ToLower() == request.Status.Trim().ToLower()).ToList();
            var shippingData = _dbContext.TblShippings.ToList();
            var userData = _masterDbContext.TblUsers.ToList();
            var additionalData = _masterDbContext.TblUserAdditionalInfos.ToList();
            var facilityUserData = _dbContext.TblFacilityUsers.ToList();


            var data = (from facilityDetail in facilityData
                        join shippingDetail in shippingData on facilityDetail.FacilityId equals shippingDetail.FacilityId
                        into FacilityInfoWithShippingDetails
                        from allFacilityInfo in FacilityInfoWithShippingDetails.DefaultIfEmpty()

                        select
                        new
                        {
                            FCLTY = facilityDetail,
                            SHPNG = allFacilityInfo
                        }).Select(s => new FacilityExportToExcelInternal()
                        {
                            FacilityId = s.FCLTY.FacilityId,
                            FacilityName = s.FCLTY?.FacilityName,
                            FacilityPhone = s.FCLTY?.FacilityPhone,
                            FacilityFax = s.FCLTY?.FacilityFax,
                            FacilityAddress = s.FCLTY?.Address,
                            FacilityAddress2 = s.FCLTY?.Address2,
                            FacilityCity = s.FCLTY?.City,
                            FacilityState = s.FCLTY?.State,
                            FacilityZipCode = s.FCLTY?.ZipCode,
                            PrimaryContactFirstName = s.FCLTY?.ContactFirstName,
                            PrimaryContactLastName = s.FCLTY?.ContactLastName,
                            PrimaryContactEmail = s.FCLTY?.ContactPrimaryEmail,
                            PrimaryContactPhone = s.FCLTY?.ContactPhone,
                            CriticalContactFirstName = s.FCLTY?.CriticalFirstName,
                            CriticalContactLastName = s.FCLTY?.CriticalLastName,
                            CriticalContactEmail = s.FCLTY?.CriticalContactEmail,
                            CriticalContactPhone = s.FCLTY?.CriticalPhone,
                            ShippingName = s.SHPNG?.ShippingName,
                            ShippingAddress = s.SHPNG?.ShippingAddress,
                            ShippingPhoneNumber = s.SHPNG?.ShippingPhoneNo,
                            ShippingEmail = s.SHPNG?.ShippingEmail,
                            ShippingNote = s.SHPNG?.ShippingNote,
                            ProviderFirstName = userData.FirstOrDefault(f => f.Id == facilityUserData.FirstOrDefault(f => f.FacilityId == s.FCLTY?.FacilityId)?.UserId)?.FirstName,
                            ProviderLastName = userData.FirstOrDefault(f => f.Id == facilityUserData.FirstOrDefault(f => f.FacilityId == s.FCLTY?.FacilityId)?.UserId)?.LastName,
                            ProviderPhone = userData.FirstOrDefault(f => f.Id == facilityUserData.FirstOrDefault(f => f.FacilityId == s.FCLTY?.FacilityId)?.UserId)?.PhoneNumber,
                            ProviderNPI = additionalData.FirstOrDefault(f => f.UserId == userData.FirstOrDefault(f => f.Id == facilityUserData.FirstOrDefault(f => f.FacilityId == s.FCLTY?.FacilityId)?.UserId)?.Id)?.Npi,
                            PhysicianStateLicense = additionalData.FirstOrDefault(f => f.UserId == userData.FirstOrDefault(f => f.Id == facilityUserData.FirstOrDefault(f => f.FacilityId == s.FCLTY?.FacilityId)?.UserId)?.Id)?.StateLicenseNo

                        }).ToList();
            if (request.selectedRows.Count() > 0)
            {
                data = data.Where(f => request.selectedRows.Contains(f.FacilityId)).ToList();
            }
            #endregion

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Facilities");

            #region Header And Header Styling
            worksheet.Row(1).Style.Fill.PatternType = ExcelFillStyle.Solid;
            worksheet.Row(1).Style.Font.Bold = true;
            worksheet.Row(1).Style.Font.Color.SetColor(Color.White);
            worksheet.Row(1).Style.Fill.BackgroundColor.SetColor(Color.Black);


            worksheet.Cells[1, 1].Value = "Facility Name";
            worksheet.Cells[1, 2].Value = "Facility Phone";
            worksheet.Cells[1, 3].Value = "Facility Fax";
            worksheet.Cells[1, 4].Value = "Facility Address";
            worksheet.Cells[1, 5].Value = "Facility Address2";
            worksheet.Cells[1, 6].Value = "Facility City";
            worksheet.Cells[1, 7].Value = "Facility State";
            worksheet.Cells[1, 8].Value = "Facility Zip Code";
            worksheet.Cells[1, 9].Value = "Primary Contact FirstName";
            worksheet.Cells[1, 10].Value = "Primary Contact LastName";
            worksheet.Cells[1, 11].Value = "Primary Contact Email";
            worksheet.Cells[1, 12].Value = "Primary Contact Phone";
            worksheet.Cells[1, 13].Value = "Critical Contact FirstName";
            worksheet.Cells[1, 14].Value = "Critical Contact LastName";
            worksheet.Cells[1, 15].Value = "Critical Contact Email";
            worksheet.Cells[1, 16].Value = "Critical Contact Phone";
            worksheet.Cells[1, 17].Value = "Provider FirstName";
            worksheet.Cells[1, 18].Value = "Provider LastName";
            worksheet.Cells[1, 19].Value = "Provider Phone";
            worksheet.Cells[1, 20].Value = "Provider NPI#";
            worksheet.Cells[1, 21].Value = "Physician State License#";
            worksheet.Cells[1, 22].Value = "Shipping Name";
            worksheet.Cells[1, 23].Value = "Shipping Address";
            worksheet.Cells[1, 24].Value = "Shipping Phone Number";
            worksheet.Cells[1, 25].Value = "Shipping Email";
            worksheet.Cells[1, 26].Value = "Shipping Note";
            #endregion
            #region Add data to the worksheet
            for (var i = 0; i < data.Count; i++)
            {
                var row = i + 2;
                worksheet.Cells[row, 1].Value = data[i].FacilityName;
                worksheet.Cells[row, 2].Value = data[i].FacilityPhone;
                worksheet.Cells[row, 3].Value = data[i].FacilityFax;
                worksheet.Cells[row, 4].Value = data[i].FacilityAddress;
                worksheet.Cells[row, 5].Value = data[i].FacilityAddress2;
                worksheet.Cells[row, 6].Value = data[i].FacilityCity;
                worksheet.Cells[row, 7].Value = data[i].FacilityState;
                worksheet.Cells[row, 8].Value = data[i].FacilityZipCode;
                worksheet.Cells[row, 9].Value = data[i].PrimaryContactFirstName;
                worksheet.Cells[row, 10].Value = data[i].PrimaryContactLastName;
                worksheet.Cells[row, 11].Value = data[i].PrimaryContactEmail;
                worksheet.Cells[row, 12].Value = data[i].PrimaryContactPhone;
                worksheet.Cells[row, 13].Value = data[i].CriticalContactFirstName;
                worksheet.Cells[row, 14].Value = data[i].CriticalContactLastName;
                worksheet.Cells[row, 15].Value = data[i].CriticalContactEmail;
                worksheet.Cells[row, 16].Value = data[i].CriticalContactPhone;
                worksheet.Cells[row, 17].Value = data[i].ProviderFirstName;
                worksheet.Cells[row, 18].Value = data[i].ProviderLastName;
                worksheet.Cells[row, 19].Value = data[i].ProviderPhone;
                worksheet.Cells[row, 20].Value = data[i].ProviderNPI;
                worksheet.Cells[row, 21].Value = data[i].PhysicianStateLicense;
                worksheet.Cells[row, 22].Value = data[i].ShippingName;
                worksheet.Cells[row, 23].Value = data[i].ShippingAddress;
                worksheet.Cells[row, 24].Value = data[i].ShippingPhoneNumber;
                worksheet.Cells[row, 25].Value = data[i].ShippingEmail;
                worksheet.Cells[row, 26].Value = data[i].ShippingNote;

            }

            // Set the column widths
            worksheet.Column(1).AutoFit();
            worksheet.Column(2).AutoFit();
            worksheet.Column(3).AutoFit();
            worksheet.Column(4).AutoFit();
            worksheet.Column(5).AutoFit();
            worksheet.Column(6).AutoFit();
            worksheet.Column(7).AutoFit();
            worksheet.Column(8).AutoFit();
            worksheet.Column(9).AutoFit();
            worksheet.Column(10).AutoFit();
            worksheet.Column(11).AutoFit();
            worksheet.Column(12).AutoFit();
            worksheet.Column(13).AutoFit();
            worksheet.Column(14).AutoFit();
            worksheet.Column(15).AutoFit();
            worksheet.Column(16).AutoFit();
            worksheet.Column(17).AutoFit();
            worksheet.Column(18).AutoFit();
            worksheet.Column(19).AutoFit();
            worksheet.Column(20).AutoFit();
            worksheet.Column(21).AutoFit();
            worksheet.Column(22).AutoFit();
            worksheet.Column(23).AutoFit();
            worksheet.Column(24).AutoFit();
            worksheet.Column(25).AutoFit();
            worksheet.Column(26).AutoFit();
            #endregion

            response.Data = new FileContentResult(package.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Processed Successfully";


            return response;
        }
        public Models.Response.RequestResponse FacilityStatusChangedForApproval(FacilityStatusChangedForApprovalRequest request)
        {
            var response = new Models.Response.RequestResponse();

            var getFacilityForStatusChanged = _dbContext.TblFacilities.FirstOrDefault(f => f.FacilityId == request.FacilityId);
            if (getFacilityForStatusChanged != null)
            {
                if (request.Status.Trim().ToUpper() == "ISAPPROVED")
                {
                    getFacilityForStatusChanged.IsApproved = true;
                    getFacilityForStatusChanged.Status = "Active";
                }
                else if (request.Status.Trim().ToUpper() == "REJECTED")
                {
                    getFacilityForStatusChanged.IsApproved = false;
                    getFacilityForStatusChanged.Status = "Rejected";
                }
                _dbContext.TblFacilities.Update(getFacilityForStatusChanged);
                var ack = _dbContext.SaveChanges();
                if (ack > 0)
                {
                    response.StatusCode = HttpStatusCode.OK;
                    response.Message = "Facility Status Changed !";
                }
            }

            return response;
        }
        public Models.Response.RequestResponse<List<FacilityReportTemplateResponse>> GetFileTemplates()
        {
            var response = new Models.Response.RequestResponse<List<FacilityReportTemplateResponse>>();
            var tblLabRequisitionTypes = _dbContext.TblLabRequisitionTypes.AsNoTracking().ToList();
            var tblLisreportTemplates = _dbContext.TblLisreportTemplates.AsNoTracking().ToList();

            var data = new List<FacilityReportTemplateResponse>();
            foreach (var item in tblLisreportTemplates)
            {
                var s = new FacilityReportTemplateResponse()
                {
                    Id = item.Id,
                    TemplateName = item.TemplateName,
                    TemplateDisplayName = item.TemplateDisplayName,
                    TemplateUrl = item.TemplateUrl,
                    ReqTypeId = item.ReqTypeId,
                    ReqType = tblLabRequisitionTypes.FirstOrDefault(f => f.ReqTypeId == item.ReqTypeId).RequisitionType,
                };
                data.Add(s);

            }
            response.Data = data;
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Processed Successfully";

            return response;
        }

    }
}
