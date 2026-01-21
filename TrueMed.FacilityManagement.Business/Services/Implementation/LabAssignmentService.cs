using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.LookUps.Common;
using TrueMed.FacilityManagement.Business.Services.Interface;
using TrueMed.FacilityManagement.Business.Validations;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Request;
using TrueMed.FacilityManagement.Domain.Models.Dtos.Response;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using TrueMed.FacilityManagement.Domain.Models.QueryModel;
using TrueMed.FacilityManagement.Domain.Models.QueryModel.Base;
using TrueMed.FacilityManagement.Domain.Models.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;

namespace TrueMed.FacilityManagement.Business.Services.Implementation
{
    public class LabAssignmentService : ILabAssignmentService
    {
        private readonly IConnectionManager _connectionManager;

        private ApplicationDbContext _applicationDbContext;
        private MasterDbContext _masterDbContext;
        public LabAssignmentService(IConnectionManager connectionManager, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
            _applicationDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            LoggedInUser = connectionManager.UserId;
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> SaveLabAssignmentAsync(AddLabAssignmentRequest request)
        {
            var response = new RequestResponse();
            //var jsonOptions = new JsonSerializerOptions
            //{
            //    ReferenceHandler = ReferenceHandler.Preserve, // Handle object cycles
            //    MaxDepth = 64 // Increase the maximum object depth if needed
            //};

            var validation = new LabAssignmentValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToString();
                response.StatusCode = Status.Failed;
                response.ResponseStatus = "Failed";
                response.ResponseMessage = "Request Failed !";
                return response;
            }
            var existingisDefault = _applicationDbContext.TblLabAssignments.FirstOrDefault(f => f.ReqTypeId == request.ReqTypeId && f.RefLabId == request.RefLabId && f.IsDefault.Equals(true));
            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var entity = new TblLabAssignment();
            //var LabAssignmentGroupentity = new TblLabAssignmentGroup();
            var labType = _masterDbContext.TblLabs.FirstOrDefault(x => x.LabId == request.RefLabId)?.LabType;
            entity.Id = request.Id;
            entity.ProfileName = request.ProfileName;
            entity.RefLabId = request.RefLabId;
            entity.LabType = labType != null ? Convert.ToInt32(labType) : 0;
            entity.ReqTypeId = request.ReqTypeId;
            entity.InsuranceId = request.InsuranceId.ToString();
            entity.InsuranceOptionId = request.InsuranceId.ToString();
            entity.Gender = request.Gender.ToString();
            entity.IsDefault = request.IsDefault;

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _applicationDbContext.TblLabAssignments.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {
                    if (request.IsDefault.Equals(true) && existingisDefault != null)
                    {
                        if (existingisDefault.Id != entity.Id)
                        {
                            response.ResponseMessage = "Only one record can be default...";
                            response.StatusCode = Status.AlreadyExists;
                        }
                    }
                    else
                    {
                        //var getexistingprofile = _applicationDbContext.TblLabAssignments.FirstOrDefault(x => x.ProfileName == request.ProfileName && x.Id == request.Id);
                        //if (getexistingprofile != null)
                        //{
                        //    response.ResponseMessage = "This profile already exists...";
                        //    response.StatusCode = Status.AlreadyExists;
                        //}
                        entity.ProfileName = getRecordForEdit.ProfileName;
                        entity.UpdatedDate = DateTimeNow.Get;
                        entity.UpdatedBy = LoggedInUser;

                        entity.CreatedDate = getRecordForEdit.CreatedDate;
                        entity.CreatedBy = getRecordForEdit.CreatedBy;
                        entity.IsActive = getRecordForEdit.IsActive;
                        entity.IsDeleted = getRecordForEdit.IsDeleted;

                        _applicationDbContext.TblLabAssignments.Update(entity);


                        var getRecordForEditInLabAssignmentGroup = _applicationDbContext.TblLabAssignmentGroups.Where(x => x.LabAssignmentId == entity.Id).ToList();
                        if (getRecordForEditInLabAssignmentGroup.Count() != 0)
                        {
                            _applicationDbContext.TblLabAssignmentGroups.RemoveRange(getRecordForEditInLabAssignmentGroup);
                            await _applicationDbContext.SaveChangesAsync();
                        }

                        if (request.GroupIds != null)
                        {
                            List<TblLabAssignmentGroup> list1 = new List<TblLabAssignmentGroup>();


                            foreach (var item in request.GroupIds)
                            {
                                var secondentity = new TblLabAssignmentGroup();
                                secondentity.LabAssignmentId = entity.Id;
                                secondentity.GroupId = item;
                                list1.Add(secondentity);
                                //await _applicationDbContext.SaveChangesAsync();
                            }
                            _applicationDbContext.TblLabAssignmentGroups.AddRange(list1);

                        }
                    }


                }
                else
                {
                    response.StatusCode = Status.Failed;
                    response.ResponseStatus = "Failed";
                    response.ResponseMessage = "Request Failed !";
                    return response;
                }
            }
            else
            {


                if (request.IsDefault == true)
                {
                    if (existingisDefault != null)
                    {
                        response.ResponseMessage = "Only one record can be default...";
                        response.StatusCode = Status.AlreadyExists;
                    }

                }
                else
                {
                    var getexistingprofile = _applicationDbContext.TblLabAssignments.FirstOrDefault(x => x.ProfileName == request.ProfileName && x.RefLabId == request.RefLabId);
                    if(getexistingprofile != null)
                    {
                        response.ResponseMessage = "This profile already exists...";
                        response.StatusCode = Status.AlreadyExists;
                    }
                    else
                    {
                        entity.CreatedBy = LoggedInUser;
                        entity.CreatedDate = DateTimeNow.Get;

                        entity.IsDeleted = false;
                        entity.IsActive = true;

                        await _applicationDbContext.TblLabAssignments.AddAsync(entity);
                        await _applicationDbContext.SaveChangesAsync();


                        if (request.GroupIds != null)
                        {
                            List<TblLabAssignmentGroup> list1 = new List<TblLabAssignmentGroup>();


                            foreach (var item in request.GroupIds)
                            {
                                var secondentity = new TblLabAssignmentGroup();
                                secondentity.LabAssignmentId = entity.Id;
                                secondentity.GroupId = item;
                                list1.Add(secondentity);
                                //await _applicationDbContext.SaveChangesAsync();
                            }
                            _applicationDbContext.TblLabAssignmentGroups.AddRange(list1);
                            //await _applicationDbContext.SaveChangesAsync();
                        }
                        if (request.IsDefault == true)
                        {
                            var getFacilityIdsAgainstUser = _applicationDbContext.TblFacilityUsers.Where(f => f.UserId == LoggedInUser).Select(s => s.FacilityId).ToList();
                            if (getFacilityIdsAgainstUser != null)
                            {

                                List<TblFacilityRefLabAssignment> list = new List<TblFacilityRefLabAssignment>();
                                foreach (var facilityId in getFacilityIdsAgainstUser)
                                {
                                    var entry = new TblFacilityRefLabAssignment();
                                    entry.LabAssignmentId = entity.Id;
                                    entry.FacilityId = facilityId;
                                    entry.IsActive = true;
                                    entry.IsDeleted = false;
                                    entry.CreatedBy = LoggedInUser;
                                    entry.CreatedDate = DateTimeNow.Get;
                                    entry.IsDefault = request.IsDefault;
                                    list.Add(entry);

                                    //await _applicationDbContext.SaveChangesAsync();
                                }
                                _applicationDbContext.TblFacilityRefLabAssignments.AddRange(list);
                            }
                        }

                        response.ResponseMessage = "Record Added Successfully...";
                    }
                   
                }

            }

            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                //response.Message = "Record Added Successfully !";
                response.StatusCode = Status.Success;
                response.ResponseStatus = "Success";
                //response.Data = JsonSerializer.Serialize(entity, jsonOptions);
            }
            return response;
        }

        public async Task<DataQueryResponse<List<LabAssignmentResponse>>> GetLabAssignmentDetailAsync(DataQueryModel<LabAssignmentQueryModel> query)
        {
            var response = new DataQueryResponse<List<LabAssignmentResponse>>();

            #region Source

            var labAssignmentsResult = await _applicationDbContext.TblLabAssignments.Where(f => f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToListAsync();
            var labAssignmentGroupsResult = await _applicationDbContext.TblLabAssignmentGroups.ToListAsync();
            var FacilityRefLabAssignmentsResult = await _applicationDbContext.TblFacilityRefLabAssignments.ToListAsync();
            //var compendiumTestConfigurationResult = await _dbContext.TblCompendiumTestConfigurations.Where(f => f.IsDeleted.Equals(false) && f.IsActive.Equals(true)).ToListAsync();
            var Gender = _masterDbContext.TblControlOptions.FirstOrDefault(x => x.ControlId == 44 && x.OptionId == Convert.ToInt32("4"))?.OptionName;
            var refLabsResult = await _masterDbContext.TblLabs.Where(f => f.IsDeleted == false && f.IsActive == true).ToListAsync();

            var dataSource = (
                from labAssignments in labAssignmentsResult
                join labAssignmentGroups in labAssignmentGroupsResult on labAssignments.Id equals labAssignmentGroups.LabAssignmentId
                into labAssignmentslabAssignmentGroups
                from labAssignmentspluslabAssignmentGroups in labAssignmentslabAssignmentGroups.DefaultIfEmpty()

                join refLabs in refLabsResult on labAssignments.RefLabId equals refLabs.LabId
                into refLabslabAssignments
                from refLabswithlabAssignments in refLabslabAssignments.DefaultIfEmpty()

                join facilityRefLabAssignments in FacilityRefLabAssignmentsResult on labAssignments.Id equals facilityRefLabAssignments.LabAssignmentId
                into facilityRefLabAssignmentslabAssignments
                //from facilityRefLabAssignmentsWithlabAssignments in facilityRefLabAssignmentslabAssignments.DefaultIfEmpty()

                select new LabAssignmentResponse()
                {
                    Id = labAssignments.Id,
                    ProfileName = labAssignments.ProfileName,
                    RefLabId = Convert.ToInt32(labAssignments.RefLabId),
                    RefLabName = refLabswithlabAssignments != null ? refLabswithlabAssignments.DisplayName : "NA",
                    ReqTypeId = labAssignments.ReqTypeId,
                    ReqTypeName = _applicationDbContext.TblLabRequisitionTypes.FirstOrDefault(x => x.ReqTypeId == labAssignments.ReqTypeId)?.RequisitionTypeName,
                    InsuranceId = Convert.ToInt32(labAssignments.InsuranceId),
                    InsuranceName = Convert.ToInt32(labAssignments.InsuranceId) == 0 ? "All" : _masterDbContext.TblControlOptions.FirstOrDefault(x => x.ControlId == 44 && x.OptionId == Convert.ToInt32(labAssignments.InsuranceId))?.OptionName,
                    GenderId = Convert.ToInt32(labAssignments.Gender),
                    GenderName = Convert.ToInt32(labAssignments.Gender) == 0 ? "All" : _masterDbContext.TblControlOptions.FirstOrDefault(x => x.ControlId == 13 && x.OptionId == Convert.ToInt32(labAssignments.Gender))?.OptionName,
                    //GroupIds = labAssignmentspluslabAssignmentGroups != null ? new List<int> { labAssignmentspluslabAssignmentGroups.GroupId } : new List<int>(),
                    GroupIds = labAssignmentslabAssignmentGroups
            .Where(g => g != null && g.LabAssignmentId == labAssignments.Id)
            .Select(g => g.GroupId)
            .ToList(),
                    //GroupNames = string.Join(", ", _applicationDbContext.TblCompendiumGroups.Where(g => labAssignmentspluslabAssignmentGroups != null && g.Id == labAssignmentspluslabAssignmentGroups.GroupId).Select(g => g.GroupName)),
                    GroupNames = string.Join(", ", labAssignmentslabAssignmentGroups
            .Where(g => g != null && g.LabAssignmentId == labAssignments.Id)
            .Join(_applicationDbContext.TblCompendiumGroups, g => g.GroupId, cg => cg.Id, (g, cg) => cg.GroupName)),
                    IsDefault = labAssignments.IsDefault,
                    //Facilities =  _applicationDbContext.TblFacilities.Where(f => f.FacilityId == )
                    //              .Select(s => new FacilityInfo() { Id = s.FacilityId, FacilityName = s.FacilityName }).ToList()


                    Facilities = _applicationDbContext.TblFacilities.Where(f => (facilityRefLabAssignmentslabAssignments.Select(f => f.FacilityId)).Contains(f.FacilityId))
                                  .Select(s => new FacilityInfo() { Id = s.FacilityId, FacilityName = s.FacilityName + " - " + s.Address }).ToList()
                    //Facilities = facilityRefLabAssignmentslabAssignments.Select(f => f.FacilityId).ToArray()


                }).DistinctBy(d => d.Id).OrderByDescending(o => o.Id).ToList();

            #endregion

            #region Filtered
            if (!string.IsNullOrEmpty(query.QueryModel?.ProfileName))
            {
                dataSource = dataSource.Where(f => f.ProfileName != null && f.ProfileName.ToLower().Contains(query.QueryModel.ProfileName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RefLabName))
            {
                dataSource = dataSource.Where(f => f.RefLabName != null && f.RefLabName.ToLower().Contains(query.QueryModel.RefLabName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ReqTypeName))
            {
                dataSource = dataSource.Where(f => f.ReqTypeName != null && f.ReqTypeName.ToLower().Contains(query.QueryModel.ReqTypeName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.InsuranceName))
            {
                dataSource = dataSource.Where(f => f.InsuranceName != null && f.InsuranceName.ToLower().Contains(query.QueryModel.InsuranceName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.GenderName))
            {
                dataSource = dataSource.Where(f => f.GenderName != null && f.GenderName.ToLower().Contains(query.QueryModel.GenderName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.GroupNames))
            {
                dataSource = dataSource.Where(f => f.GroupNames != null && f.GroupNames.ToLower().Contains(query.QueryModel.GroupNames.ToLower())).ToList();
            }
            if (query.QueryModel?.IsDefault != null)
            {
                dataSource = dataSource.Where(f => f.IsDefault.Equals(query.QueryModel.IsDefault)).ToList();
            }


            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                dataSource = dataSource.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();

            }
            else
            {
                dataSource = dataSource.AsQueryable().OrderBy($"id desc").ToList();
            }


            response.Total = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }

            #endregion
            response.Filtered = dataSource.Count();
            response.Data = dataSource.ToList();
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }
        public async Task<RequestResponse<List<ReferenceLabLookupDto>>> ReferenceLabLookupAsync()
        {
            var response = new RequestResponse<List<ReferenceLabLookupDto>>();

            var getSystemLookup = await _masterDbContext.TblOptionLookups.Where(f => f.UserType.ToUpper().Trim() == "FACILITY").Select(s => s.Id).ToListAsync();
            var getuserAdminType = Convert.ToInt32(await _masterDbContext.TblUsers.Where(f => f.Id == _connectionManager.UserId).Select(s => s.AdminType).FirstOrDefaultAsync());

            if (getSystemLookup.Contains(getuserAdminType))
            {
                var labIdsByUser = await _masterDbContext.TblLabUsers.Where(f => f.UserId.Equals(_connectionManager.UserId) && f.IsDeleted == false && f.IsActive == true).Select(s => s.LabId).ToListAsync();
                response.Data = await _masterDbContext.TblLabs.Where(f => labIdsByUser.Contains(f.LabId) && f.IsDeleted.Equals(false)).Select(s => new ReferenceLabLookupDto()
                {
                    LabId = s.LabId,
                    LabDisplayName = s.DisplayName

                }).OrderBy(o => o.LabDisplayName).ToListAsync();
            }
            else
            {
                response.Data = await _masterDbContext.TblLabs.Where(f => f.IsDeleted.Equals(false)).Select(s => new ReferenceLabLookupDto()
                {
                    LabId = s.LabId,
                    LabDisplayName = s.DisplayName

                }).ToListAsync();
            }



            response.StatusCode = Status.Success;
            //response.HttpStatusCode = Status.Success;
            response.ResponseMessage = "Request Processed";
            return response;
        }
        public async Task<List<CommonLookupResponse>> GetRequisitionTypesByLabId(int id)
        {
            var response = new List<CommonLookupResponse>();
            if (id == 0)
            {
                response = await _applicationDbContext.TblLabRequisitionTypes.Where(f => f.IsDeleted == false && f.IsSelected == true && f.IsActive.Equals(true)).Select(s => new CommonLookupResponse() { Label = s.RequisitionTypeName, Value = s.ReqTypeId }).OrderBy(o => o.Label).ToListAsync();
            }
            else
            {
                response = await _applicationDbContext.TblLabRequisitionTypes.Where(f => f.IsDeleted == false && f.IsSelected == true && f.IsActive.Equals(true) && f.LabId == id).Select(s => new CommonLookupResponse() { Label = s.RequisitionTypeName, Value = s.ReqTypeId }).OrderBy(o => o.Label).ToListAsync();

            }

            return response;
        }
        public async Task<List<CommonLookupResponse>> GetGroupsByRequisitionType(int id)
        {
            var response = new List<CommonLookupResponse>();
            if (id == 0)
            {
                response = await _applicationDbContext.TblCompendiumGroups.Where(f => f.IsDeleted == false && f.IsActive.Equals(true)).Select(s => new CommonLookupResponse() { Label = s.GroupName, Value = s.Id }).OrderBy(o => o.Label).ToListAsync();
            }
            else
            {
                response = await _applicationDbContext.TblCompendiumGroups.Where(f => f.IsDeleted == false && f.IsActive.Equals(true) && f.ReqTypeId == id).Select(s => new CommonLookupResponse() { Label = s.GroupName, Value = s.Id }).OrderBy(o => o.Label).ToListAsync();

            }

            return response;
        }
        public async Task<List<CommonLookupResponse>> GetInsuranceTypes()
        {
            var response = new List<CommonLookupResponse>();
            var lookupResponse = await _masterDbContext.TblControlOptions.Where(f => f.ControlId == 44).Select(s => new CommonLookupResponse() { Label = s.OptionName, Value = s.OptionId }).OrderBy(o => o.Label).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<CommonLookupResponse>> GetGender()
        {
            var response = new List<CommonLookupResponse>();
            var lookupResponse = await _masterDbContext.TblControlOptions.Where(f => f.ControlId == 13).Select(s => new CommonLookupResponse() { Label = s.OptionName, Value = s.OptionId }).ToListAsync();
            response = lookupResponse;

            return response;
        }


        public async Task<RequestResponse> SaveFacilitiesAsync(SaveFacilities request)
        {
            var response = new RequestResponse();

            var validation = new FacilitiesValidator();
            var validate = await validation.ValidateAsync(request);

            if (!validate.IsValid)
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage).ToString();
                response.StatusCode = Status.Failed;
                response.ResponseStatus = "Failed";
                response.ResponseMessage = "Request Failed !";
                return response;
            }

            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            var getRecordForEditFacilityRefLabAssignments = _applicationDbContext.TblFacilityRefLabAssignments.Where(x => x.LabAssignmentId == request.Id).ToList();
            if (getRecordForEditFacilityRefLabAssignments != null)
            {
                _applicationDbContext.TblFacilityRefLabAssignments.RemoveRange(getRecordForEditFacilityRefLabAssignments);
                await _applicationDbContext.SaveChangesAsync();
            }

            foreach (var item in request.Facilites)
            {
                var secondentity = new TblFacilityRefLabAssignment();
                secondentity.IsActive = true;
                secondentity.IsDeleted = false;
                secondentity.CreatedBy = LoggedInUser;
                secondentity.CreatedDate = DateTimeNow.Get;
                secondentity.LabAssignmentId = request.Id;
                secondentity.FacilityId = item;
                _applicationDbContext.TblFacilityRefLabAssignments.Add(secondentity);
            }


            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.ResponseMessage = "Facilities Added Successfully !";
                response.StatusCode = Status.Success;
                response.ResponseStatus = "Success";
                //response.Data = entity;
            }
            return response;
        }
        public async Task<RequestResponse> DeleteByIdAsync(int id)
        {
            var response = new RequestResponse();

            if (id <= 0)
            {
                response.Error = "invalid ID !";
                response.ResponseStatus = "Failed";
                response.ResponseMessage = "Request Failed !";
                response.StatusCode = Status.Failed;
                return response;

            }
            var getRecordForSoftDelete = await _applicationDbContext.TblLabAssignments.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _applicationDbContext.TblLabAssignments.Update(getRecordForSoftDelete);
                response.ResponseMessage = "Record Deleted...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {id} in our system...";
                response.StatusCode = Status.Failed;
                //response.Status = "Failed !";
                response.ResponseMessage = "Request Failed !";
                return response;
            }
            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.StatusCode = Status.Success;
                response.ResponseStatus = "Success !";
            }
            return response;
        }
        public async Task<List<CommonLookupResponse>> GetFacilitiesLookup()
        {
            var response = new List<CommonLookupResponse>();

            var LabId = _connectionManager.GetLabId();
            var lookupResponse = await _applicationDbContext.TblFacilities.Where(w => w.Status.Trim().ToLower() == "Active".ToLower() && w.IsDeleted.Equals(false)).Select(s => new CommonLookupResponse() { Label = s.FacilityName + " - " + s.Address, Value = s.FacilityId }).OrderBy(o => o.Label).ToListAsync();
            response = lookupResponse;



            var adminTypeId = (_masterDbContext.TblUsers.FirstOrDefault(f => f.Id == LoggedInUser))?.AdminType;
            var adminType = (_masterDbContext.TblOptionLookups.FirstOrDefault(f => f.Id == int.Parse(adminTypeId))).UserType.Trim().ToUpper();

            if (adminType == "FACILITY")
            {
                var facilityIdsByUser = _applicationDbContext.TblFacilityUsers.Where(f => f.UserId == LoggedInUser).Select(s => s.FacilityId).ToList();
                response = response.Where(f => facilityIdsByUser.Contains(f.Value)).ToList();
            }




            return response;

        }
    }
}
