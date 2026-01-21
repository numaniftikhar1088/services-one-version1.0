using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.Services.Common.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.InsuranceManagement.Business.Interface;
using TrueMed.InsuranceManagement.Domain.Dtos;
using TrueMed.InsuranceManagement.Domain.QueryModel.Base;
using TrueMed.InsuranceManagement.Domain.ResponseModel;
using TrueMed.InsuranceManagement.Domains.Dtos;
using TrueMed.InsuranceManagement.Domains.QueryModel;
using TrueMed.InsuranceManagement.Domains.ResponseModel;
using TrueMed.Validator.InsuranceManagement;

namespace TrueMed.InsuranceManagement.Business.Implementations
{
    public class ICD10CodeAssignmentService : IICD10CodeAssignmentService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IUtilityService _utilityService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private ApplicationDbContext _dbContext;
        private MasterDbContext _masterDbContext;
        public ICD10CodeAssignmentService(IConnectionManager connectionManager, IUtilityService utilityService, IHttpContextAccessor httpContextAccessor, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
            _utilityService = utilityService;
            _httpContextAccessor = httpContextAccessor;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
            _masterDbContext = masterDbContext;
        }
        public string LoggedInUser { get; set; }

        public async Task<RequestResponse> DeleteICD10CodeAssignmentAsync(int id)
        {
            var response = new RequestResponse();
            if (id <= 0)
            {
                response.Error = "Invalid ID !";
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            var recordForEdit = await _dbContext.TblIcd10assignments.FindAsync(id);
            if (recordForEdit == null)
            {
                response.Error = $"Record is not exist against ID : {id} in our system !";
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            recordForEdit.IsDeleted = true;
            _dbContext.TblIcd10assignments.Update(recordForEdit);
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Status = "Success !";
                response.Message = "Record Deleted !";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }
        public async Task<DataQueryResponse<List<GetICD10CodeAssignmentDetailDto>>> GetICD10CodeAssignmentAsync(DataQueryModel<ICD10CodeAssignmentQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetICD10CodeAssignmentDetailDto>>();
            #region DataSource


            var icd10CodeSetupDataFromMasterDb = await _masterDbContext.TblIcd10codes.Where(f => f.IsDeleted.Equals(false)).Select(s =>
            new
            {
                ICD10Id = s.Icd10id,
                ICD10Code = s.Icd10code,
                ICD10Description = s.Description

            }).ToListAsync();

            var icd10CodeAssignmentDataFromDemoDb = await _dbContext.TblIcd10assignments.Where(f => f.IsDeleted.Equals(false) || f.IsDeleted == null).Select(s =>
            new
            {
                ICD10AssignmentId = s.Icd10assignment,
                ICD10CodeId = s.Icd10id,
                LabType = s.LabType,
                ReqTypeId = s.ReqTypeId,
                FacilityId = s.FacilityId,
                RefLabId = s.RefLabId,
                Status = s.Status,
                PanelId = s.PanelId

            }).ToListAsync();

            var tblCompendiumPanelsFromDemoLab = await _dbContext.TblCompendiumPanels.Where(f => f.IsDeleted.Equals(false) || f.IsDeleted == null).Select(s =>
           new
           {
               PanelId = s.Id,
               PanelName = s.PanelName

           }).ToListAsync();

            var refLabsDataFromMasterDb = await _masterDbContext.TblLabs.Where(f => f.IsDeleted.Equals(false)).Select(s =>
            new
            {
                RefLabId = s.LabId,
                ReferenceLab = s.DisplayName

            }).ToListAsync();

            var facilityDataFromDemoDb = await _dbContext.TblFacilities.Where(f => f.IsDeleted.Equals(false)).Select(s =>
            new
            {
                FacilityId = s.FacilityId,
                FacilityName = s.FacilityName

            }).ToListAsync();

            var reqTypeDataFromMasterDb = await _dbContext.TblLabRequisitionTypes.Where(f => f.IsDeleted.Equals(false)).Select(s =>
            new
            {
                ReqTypeId = s.ReqTypeId,
                RequisitionTypeName = s.RequisitionTypeName

            }).ToListAsync();

            #endregion
            var result = new List<GetICD10CodeAssignmentDetailDto>();
            result = (
                from ICD10CodeAssignment in icd10CodeAssignmentDataFromDemoDb
                join ICD10CodeSetup in icd10CodeSetupDataFromMasterDb on ICD10CodeAssignment.ICD10CodeId equals ICD10CodeSetup.ICD10Id
                into ICD10CodeAssignmentICD10CodeSetup
                from ICD10CodePlusAssignment in ICD10CodeAssignmentICD10CodeSetup.DefaultIfEmpty()
                join ReqType in reqTypeDataFromMasterDb on ICD10CodeAssignment.ReqTypeId equals ReqType.ReqTypeId
                into ICD10CodeAssignmentReqType
                from ReqTypePlusICD10CodeAssignment in ICD10CodeAssignmentReqType.DefaultIfEmpty()
                join Facility in facilityDataFromDemoDb on ICD10CodeAssignment.FacilityId equals Facility.FacilityId
                into ICD10CodeAssignmentFacility
                from FacilityPlusICD10CodeAssignment in ICD10CodeAssignmentFacility.DefaultIfEmpty()
                join RefLab in refLabsDataFromMasterDb on ICD10CodeAssignment.RefLabId equals RefLab.RefLabId
                into ICD10CodeAssignmentRefLab
                from RefLabPlusICD10CodeAssignment in ICD10CodeAssignmentRefLab.DefaultIfEmpty()
                join CompediumPnl in tblCompendiumPanelsFromDemoLab on ICD10CodeAssignment.PanelId equals CompediumPnl.PanelId
                into ICD10CodeAssignmentCompediumPnl
                from CompediumPnlPlusICD10CodeAssignment in ICD10CodeAssignmentCompediumPnl.DefaultIfEmpty()


                select new GetICD10CodeAssignmentDetailDto
                {
                    Icd10assignmentId = ICD10CodeAssignment == null ? 0 : ICD10CodeAssignment.ICD10AssignmentId,
                    Icd10id = ICD10CodePlusAssignment == null ? 0 : ICD10CodePlusAssignment.ICD10Id,
                    ICD10Code = ICD10CodePlusAssignment == null ? "NA" : ICD10CodePlusAssignment.ICD10Code,
                    ICD10CodeDescription = ICD10CodePlusAssignment == null ? "NA" : ICD10CodePlusAssignment?.ICD10Description,
                    RefLabId = RefLabPlusICD10CodeAssignment == null ? 0 : RefLabPlusICD10CodeAssignment.RefLabId,
                    ReferenceLab = RefLabPlusICD10CodeAssignment == null ? "NA" : RefLabPlusICD10CodeAssignment?.ReferenceLab,
                    LabType = ICD10CodeAssignment == null ? "NA" : ICD10CodeAssignment.LabType,
                    ReqTypeId = ReqTypePlusICD10CodeAssignment == null ? 0 : ReqTypePlusICD10CodeAssignment.ReqTypeId,
                    RequisitionType = ReqTypePlusICD10CodeAssignment == null ? "NA" : ReqTypePlusICD10CodeAssignment.RequisitionTypeName,
                    FacilityId = FacilityPlusICD10CodeAssignment == null ? 0 : FacilityPlusICD10CodeAssignment.FacilityId,
                    Facility = FacilityPlusICD10CodeAssignment == null ? "NA" : FacilityPlusICD10CodeAssignment.FacilityName,
                    Status = ICD10CodeAssignment == null ? false : ICD10CodeAssignment.Status,
                    PanelId = CompediumPnlPlusICD10CodeAssignment == null ? 0 : CompediumPnlPlusICD10CodeAssignment.PanelId,
                    PanelName = CompediumPnlPlusICD10CodeAssignment == null ? "NA" : CompediumPnlPlusICD10CodeAssignment.PanelName,
                }).DistinctBy(d => d.Icd10assignmentId).OrderByDescending(o => o.Icd10assignmentId).ToList();

            #region Filtered
            if (!string.IsNullOrEmpty(query.QueryModel?.Facility))
            {
                result = result.Where(f => f.Facility != null && f.Facility.ToLower().Contains(query.QueryModel.Facility.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.RequisitionType))
            {
                result = result.Where(f => f.RequisitionType != null && f.RequisitionType.ToLower().Contains(query.QueryModel.RequisitionType.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ICD10Code))
            {
                result = result.Where(f => f.ICD10Code != null && f.ICD10Code.ToLower().Contains(query.QueryModel.ICD10Code.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ReferenceLab))
            {
                result = result.Where(f => f.ReferenceLab != null && f.ReferenceLab.ToLower().Contains(query.QueryModel.ReferenceLab.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.ICD10CodeDescription))
            {
                result = result.Where(f => f.ICD10CodeDescription != null && f.ICD10CodeDescription.ToLower().Contains(query.QueryModel.ICD10CodeDescription.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.PanelName))
            {
                result = result.Where(f => f.PanelName != null && f.PanelName.ToLower().Contains(query.QueryModel.PanelName.ToLower())).ToList();
            }
            if (query.QueryModel?.Status != null)
            {
                result = result.Where(f => f.Status.Equals(query.QueryModel.Status)).ToList();
            }


            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                result = result.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
            }
            else
            {
                result = result.AsQueryable().OrderBy($"icd10assignmentId desc").ToList();
            }


            response.Total = result.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                result = result.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }

            #endregion
            response.Data = result;
            return response;
        }
        public async Task<RequestResponse<GetICD10CodeAssignmentByIdDto>> GetICD10CodeAssignmentByIdAsync(int id)
        {
            var response = new RequestResponse<GetICD10CodeAssignmentByIdDto>();
            if (id <= 0)
            {
                response.Error = "Invalid ID !";
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            var icd10CodeSetupDataFromMasterDb = await _masterDbContext.TblIcd10codes.Where(f => f.IsDeleted.Equals(false)).Select(s =>
          new
          {
              ICD10Id = s.Icd10id,
              ICD10Code = s.Icd10code,
              ICD10Description = s.Description

          }).ToListAsync();

            var icd10CodeAssignmentDataFromDemoDb = await _dbContext.TblIcd10assignments.Where(f => f.IsDeleted.Equals(false) || f.IsDeleted == null).Select(s =>
            new
            {
                ICD10AssignmentId = s.Icd10assignment,
                ICD10CodeId = s.Icd10id,
                LabType = s.LabType,
                ReqTypeId = s.ReqTypeId,
                FacilityId = s.FacilityId,
                RefLabId = s.RefLabId,
                Status = s.Status

            }).ToListAsync();

            var refLabsDataFromMasterDb = await _masterDbContext.TblLabs.Where(f => f.IsDeleted.Equals(false)).Select(s =>
            new
            {
                RefLabId = s.LabId,
                ReferenceLab = s.DisplayName

            }).ToListAsync();

            var facilityDataFromDemoDb = await _dbContext.TblFacilities.Where(f => f.IsDeleted.Equals(false)).Select(s =>
            new
            {
                FacilityId = s.FacilityId,
                FacilityName = s.FacilityName

            }).ToListAsync();

            var reqTypeDataFromMasterDb = await _dbContext.TblLabRequisitionTypes.Where(f => f.IsDeleted.Equals(false)).Select(s =>
            new
            {
                ReqTypeId = s.ReqTypeId,
                RequisitionTypeName = s.RequisitionTypeName

            }).ToListAsync();

            var result = (
                from ICD10CodeAssignment in icd10CodeAssignmentDataFromDemoDb
                join ICD10CodeSetup in icd10CodeSetupDataFromMasterDb on ICD10CodeAssignment.ICD10CodeId equals ICD10CodeSetup.ICD10Id
                into ICD10CodeAssignmentICD10CodeSetup
                from ICD10CodePlusAssignment in ICD10CodeAssignmentICD10CodeSetup.DefaultIfEmpty()
                join ReqType in reqTypeDataFromMasterDb on ICD10CodeAssignment.ReqTypeId equals ReqType.ReqTypeId
                into ICD10CodeAssignmentReqType
                from ReqTypePlusICD10CodeAssignment in ICD10CodeAssignmentReqType.DefaultIfEmpty()
                join Facility in facilityDataFromDemoDb on ICD10CodeAssignment.FacilityId equals Facility.FacilityId
                into ICD10CodeAssignmentFacility
                from FacilityPlusICD10CodeAssignment in ICD10CodeAssignmentFacility.DefaultIfEmpty()
                join RefLab in refLabsDataFromMasterDb on ICD10CodeAssignment.RefLabId equals RefLab.RefLabId
                into ICD10CodeAssignmentRefLab
                from RefLabPlusICD10CodeAssignment in ICD10CodeAssignmentRefLab.DefaultIfEmpty()
                select new GetICD10CodeAssignmentByIdDto()
                {
                    Icd10assignmentId = ICD10CodeAssignment == null ? 0 : ICD10CodeAssignment.ICD10AssignmentId,
                    Icd10id = ICD10CodePlusAssignment == null ? 0 : ICD10CodePlusAssignment.ICD10Id,
                    ICD10Code = ICD10CodePlusAssignment == null ? "NA" : ICD10CodePlusAssignment.ICD10Code,
                    ICD10CodeDescription = ICD10CodePlusAssignment == null ? "NA" : ICD10CodePlusAssignment?.ICD10Description,
                    RefLabId = RefLabPlusICD10CodeAssignment == null ? 0 : RefLabPlusICD10CodeAssignment.RefLabId,
                    ReferenceLab = RefLabPlusICD10CodeAssignment == null ? "NA" : RefLabPlusICD10CodeAssignment?.ReferenceLab,
                    LabType = ICD10CodeAssignment == null ? "NA" : ICD10CodeAssignment.LabType,
                    ReqTypeId = ReqTypePlusICD10CodeAssignment == null ? 0 : ReqTypePlusICD10CodeAssignment.ReqTypeId,
                    RequisitionType = ReqTypePlusICD10CodeAssignment == null ? "NA" : ReqTypePlusICD10CodeAssignment.RequisitionTypeName,
                    FacilityId = FacilityPlusICD10CodeAssignment == null ? 0 : FacilityPlusICD10CodeAssignment.FacilityId,
                    Facility = FacilityPlusICD10CodeAssignment == null ? "NA" : FacilityPlusICD10CodeAssignment.FacilityName,
                    Status = ICD10CodeAssignment == null ? false : ICD10CodeAssignment.Status
                }).DistinctBy(d => d.Icd10assignmentId).FirstOrDefault(f => f.Icd10assignmentId.Equals(id));

            response.Data = result;
            response.Status = "Success !";
            response.Message = "Request Processed !";
            response.HttpStatusCode = Status.Success;
            return response;
        }
        public async Task<RequestResponse> SaveICD10CodeAssignmentAsync(SaveICD10CodeAssignmentDto entity)
        {
            var response = new RequestResponse();

            var validator = new SaveICD10CodeAssignmentValidator();
            var validate = await validator.ValidateAsync(entity);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(s => s.ErrorMessage);
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;
            }
            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var ConvertedEntity = _utilityService.Converstion<SaveICD10CodeAssignmentDto, TblIcd10assignment>(entity);
            ConvertedEntity.Icd10code = entity.icD10Code;
            ConvertedEntity.Icd10description = entity.icD10CodeDescription;
            if (entity.Icd10assignmentId > 0)
            {
                var recordForEdit = await _dbContext.TblIcd10assignments.FindAsync(entity.Icd10assignmentId);
                if (recordForEdit != null)
                {
                    ConvertedEntity.Icd10assignment = entity.Icd10assignmentId;
                    ConvertedEntity.CreatedBy = recordForEdit.CreatedBy;
                    ConvertedEntity.CreatedDate = recordForEdit.CreatedDate;
                    //recordForEdit = ConvertedEntity;
                    ConvertedEntity.IsDeleted = recordForEdit.IsDeleted;
                    ConvertedEntity.UpdatedBy = LoggedInUser;
                    ConvertedEntity.UpdatedDate = DateTimeNow.Get;
                    _dbContext.TblIcd10assignments.Update(ConvertedEntity);
                    response.Message = "Record is Updated !";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.Icd10assignmentId} in our system !";
                    response.Message = "Request Processed !";
                    response.Status = "Failed 1";
                    response.HttpStatusCode = Status.Failed;
                    return response;
                }
            }
            else
            {
                ConvertedEntity.CreatedBy = LoggedInUser;
                ConvertedEntity.CreatedDate = DateTimeNow.Get;
                ConvertedEntity.IsDeleted = false;
                await _dbContext.TblIcd10assignments.AddAsync(ConvertedEntity);
                response.Message = "Record is Added !";
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Status = "Success";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }
        public async Task<RequestResponse<List<ICD10CodeLookupDto>>> ICD10CodeLookupAsync(int icd10codeid)
        {
            var response = new RequestResponse<List<ICD10CodeLookupDto>>();

            //var icd10CodeAssignmentDataFromDemoDb = await _dbContext.TblIcd10assignments.ToListAsync().ConfigureAwait(false);
            //var dataSource = await _masterDbContext.TblIcd10codes
            //    .Select(s =>
            //    new
            //    {
            //        Description = s.Description,
            //        ICD10Code = s.Icd10code,
            //        ICD10Id = s.Icd10id,
            //        IsDeleted = s.IsDeleted

            //    }).Where(f => f.IsDeleted.Equals(false)).ToListAsync();

            var result = await _masterDbContext.TblIcd10codes.Where(f => f.IsDeleted.Equals(false)).Select(s => new ICD10CodeLookupDto()
            {
                Description = s.Description,
                ICD10Code = s.Icd10code,
                ICD10Id = s.Icd10id

            }).ToListAsync();

            //var result = (
            //  from ICD10CodeAssignment in icd10CodeAssignmentDataFromDemoDb
            //  join ICD10Code in icd10CodeSetupDataFromMasterDb on ICD10CodeAssignment.Icd10id equals ICD10Code.Icd10id
            //  select new ICD10CodeLookupDto()
            //  {
            //      //ICD10CodeAssignmentId = ICD10CodeAssignment.Icd10assignment,
            //      Description = ICD10Code.Description,
            //      ICD10Code = ICD10Code.Icd10code,
            //      ICD10Id = ICD10Code.Icd10id

            //  }).DistinctBy(d => d.ICD10Id).ToList();

            if (icd10codeid > 0)
            {
                result = result.Where(f => f.ICD10Id.Equals(icd10codeid)).ToList();
            }

            response.Data = result;
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed";
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

                }).ToListAsync();
            }
            else
            {
                response.Data = await _masterDbContext.TblLabs.Where(f => f.IsDeleted.Equals(false)).Select(s => new ReferenceLabLookupDto()
                {
                    LabId = s.LabId,
                    LabDisplayName = s.DisplayName

                }).ToListAsync();
            }



            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed";
            return response;
        }
        public async Task<RequestResponse<string>> GetLabTypeAgainstReferenceLabIdAsync(int refLabId)
        {
            var response = new RequestResponse<string>();

            var result = await _dbContext.TblIcd10assignments.Where(f => f.RefLabId.Equals(refLabId)).Select(s => s.LabType).FirstOrDefaultAsync();
            response.Data = result ?? "";
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed";
            return response;

        }
        public async Task<RequestResponse<List<FacilityLookupDto>>> FacilityLookupAsync()
        {
            var response = new RequestResponse<List<FacilityLookupDto>>();

            //var dataSource = await _dbContext.TblFacilities
            //    .Select(s =>
            //    new
            //    {
            //        FacilityId = s.FacilityId,
            //        Facility = s.FacilityName,
            //        IsDeleted = s.IsDeleted

            //    }).Where(f => f.IsDeleted.Equals(false)).ToListAsync();

            var result = await _dbContext.TblFacilities.Where(f => f.IsDeleted.Equals(false)).Select(s => new FacilityLookupDto()
            {
                FacilityId = s.FacilityId,
                Facility = s.FacilityName + " - " + s.Address

            }).OrderBy(o => o.Facility).ToListAsync();

            response.Data = result;
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed !";
            return response;
        }
        public async Task<RequestResponse<List<RequsitionTypeLookupDto>>> RequsitionTypeLookupAsync()
        {
            var response = new RequestResponse<List<RequsitionTypeLookupDto>>();

            ////var icd10CodeAssignmentDataFromDemoDb = await _dbContext.TblIcd10assignments.ToListAsync().ConfigureAwait(false);
            //var dataSource = await _masterDbContext.TblRequisitionTypes
            //    .Select(s => 
            //    new
            //    { 
            //        RequisitionTypeId = s.ReqTypeId,
            //        RequisitionType = s.RequisitionType,
            //        IsDeleted = s.IsDeleted

            //    }).Where(f => f.IsDeleted.Equals(false)).ToListAsync();

            var result = await _dbContext.TblLabRequisitionTypes.Where(f => f.IsDeleted.Equals(false) && f.IsActive.Equals(true) && f.IsSelected.Equals(true)).Select(s => new RequsitionTypeLookupDto()
            {
                RequisitionTypeId = s.ReqTypeId,
                RequisitionType = s.RequisitionTypeName

            }).OrderBy(o => o.RequisitionType).ToListAsync();

            //var result = (
            //   from ICD10CodeAssignment in icd10CodeAssignmentDataFromDemoDb
            //   join ReqType in reqTypeDataFromMasterDb on ICD10CodeAssignment.ReqTypeId equals ReqType.ReqTypeId
            //   select new RequsitionTypeLookupDto()
            //   {
            //       RequisitionTypeId = ICD10CodeAssignment.ReqTypeId,
            //       RequisitionType = ReqType.RequisitionType

            //   }).DistinctBy(d => d.RequisitionType).ToList();

            response.Data = result;
            response.Status = "Success";
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed";
            return response;
        }
        public async Task<RequestResponse> ICD10CodeAssignmentStatusChangedAsync(ChangeICD10CodeAssignmentStatusDto entity)
        {
            var response = new RequestResponse();
            var validation = new ICD10CodeAssignmentChangeStatusValidator();
            var validate = await validation.ValidateAsync(entity);
            if (validate.Errors.Any())
            {
                response.Error = validate.Errors.Select(e => e.ErrorMessage);
                response.Status = "Validation Failed !";
                response.HttpStatusCode = Status.Failed;
                response.Message = "Request failed !";
                return response;
            }
            var recordForStatusChange = await _dbContext.TblIcd10assignments.FindAsync(entity.ICD10CodeAssignmentId);
            if (recordForStatusChange != null)
            {
                recordForStatusChange.UpdatedBy = LoggedInUser;
                recordForStatusChange.UpdatedDate = DateTimeNow.Get;
                recordForStatusChange.Status = entity.NewStatus;
                _dbContext.TblIcd10assignments.Update(recordForStatusChange);
                response.Message = "Status Changed !";
            }
            else
            {
                response.Status = "Failed";
                response.HttpStatusCode = Status.Failed;
                response.Message = "Request Failed !";
                response.Error = "Record is not exist in our system !";
            }
            var ack = await _dbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.Status = "Success";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }

    }
}
