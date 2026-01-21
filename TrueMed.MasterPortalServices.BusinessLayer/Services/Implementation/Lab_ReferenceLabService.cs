using AutoMapper;
using System.Net;
using TrueMed.Domain.Databases;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.Sevices.MasterEntities;
using RequestResponse = TrueMed.Domain.Models.Response.RequestResponse;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class Lab_ReferenceLabService : ILab_ReferenceLabService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IMapper _mapper;

        private MasterDbContext _masterDbContext;

        public Lab_ReferenceLabService(IConnectionManager connectionManager, MasterDbContext masterDbContext, IMapper mapper)
        {
            _connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
            _mapper = mapper;
        }
        #region Commands
        public RequestResponse Save(ReferenceLabRequest request)
        {
            var response = new RequestResponse();

            var labInfo = _mapper.Map<ReferenceLabRequest, TblLab>(request);
            var directorInfo = _mapper.Map<ReferenceLabRequest, TblDirectorInformation>(request);
            var refLabAssignment = new TblRefLabAssignment();

            labInfo.TblDirectorInformations.Add(directorInfo);

            if (request?.LabInformation?.ReferenceLabId == 0)
            {
                labInfo.CreatedBy = _connectionManager.UserId;
                labInfo.CreateDate = DateTimeNow.Get;
                labInfo.IsActive = true;
                labInfo.IsDeleted = false;
                labInfo.Status = (int?)LabApprovementStatus.Pending;

                _masterDbContext.TblLabs.Add(labInfo);
                _masterDbContext.SaveChanges();

                refLabAssignment.LabId = _connectionManager.GetLabId() != null ? Convert.ToInt32(_connectionManager.GetLabId()) : 0;
                refLabAssignment.RefLabId = labInfo.LabId;
                //refLabAssignment.RefLabId = request.LabInformation.ReferenceLabId;
                refLabAssignment.CreatedBy = _connectionManager.UserId;
                refLabAssignment.CreateDate = DateTimeNow.Get;
                refLabAssignment.LabType = Convert.ToInt32(request.LabInformation.LabType);
                refLabAssignment.Status = (int?)LabApprovementStatus.Pending;
                _masterDbContext.TblRefLabAssignments.Add(refLabAssignment);
                response.Message = "Reference Lab Created Successfully !";
            }
            else
            {
                var creationInfo = _masterDbContext.TblLabs.Where(f => f.LabId == labInfo.LabId).Select(s => new { CreatedBy = s.CreatedBy, CreatedDate = s.CreateDate });

                labInfo.CreateDate = creationInfo.FirstOrDefault().CreatedDate;
                labInfo.CreatedBy = creationInfo.FirstOrDefault().CreatedBy;

                labInfo.UpdatedBy = _connectionManager.UserId;
                labInfo.UpdatedDate = DateTimeNow.Get;
                labInfo.IsActive = true;

                _masterDbContext.TblLabs.Update(labInfo);
                response.Message = "Reference Lab Updated Successfully !";
            }
            _masterDbContext.SaveChanges();

            response.StatusCode = HttpStatusCode.OK;
            response.Data = labInfo.LabId;

            return response;
        }
        public RequestResponse Delete(int id)
        {
            var response = new RequestResponse();

            var getRecordForSoftDel = _masterDbContext.TblLabs.FirstOrDefault(f => f.LabId == id);
            if (getRecordForSoftDel != null)
            {
                getRecordForSoftDel.IsDeleted = true;
                _masterDbContext.TblLabs.Update(getRecordForSoftDel);
            }
            _masterDbContext.SaveChanges();

            response.Message = "Reference Lab Is Deleted !";
            response.StatusCode = HttpStatusCode.OK;
            response.Data = getRecordForSoftDel.LabId;

            return response;
        }
        public RequestResponse StatusChanged(int id, bool status)
        {
            var response = new RequestResponse();

            var getRecordForStatusChange = _masterDbContext.TblLabs.Where(f => f.LabId == id).FirstOrDefault();
            if (getRecordForStatusChange != null)
            {
                getRecordForStatusChange.IsActive = status;
                _masterDbContext.TblLabs.Update(getRecordForStatusChange);
            }
            _masterDbContext.SaveChanges();

            response.Message = "Reference Lab Status Is Changed !";
            response.StatusCode = HttpStatusCode.OK;
            response.Data = getRecordForStatusChange.LabId;

            return response;
        }
        #endregion
        #region Queries
        public DataQueryResponse<List<GetAllReferenceLabResponse>> GetAll(DataQueryModel<ReferenceLabQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetAllReferenceLabResponse>>();

            Type enumType = typeof(LabTypeEnum);

            var dataSource = (from Labs in _masterDbContext.TblLabs.Where(f => f.LabType == (short?)LabTypeEnum.Reference && f.IsReferenceLab == true)
                              join Directors in _masterDbContext.TblDirectorInformations on Labs.LabId equals Directors.LabId
                              into LabsWithDirectors from LabsAndDirectors in LabsWithDirectors.DefaultIfEmpty()
                              select new {LabResult = Labs,DirectorInfo = LabsAndDirectors})
                .Select(s => new GetAllReferenceLabResponse()
                 {
                     ReferenceLabId = s.LabResult.LabId,
                     LabName = s.LabResult.LaboratoryName,
                     LabDisplayName = s.LabResult.DisplayName,
                     PortalLogo = s.LabResult.PortalLogo,
                     CLIA = s.LabResult.Cliano,
                     Enter3DigitsProgram = s.LabResult.Enter3DigitsProgram,
                     Enter3DigitsLabCode = s.LabResult.Enter3DigitsLabCode,
                     LabType = Enum.GetName<LabTypeEnum>((LabTypeEnum)s.LabResult.LabType == null ? 0 : (LabTypeEnum)s.LabResult.LabType),
                     EnableReferenceId = s.LabResult.IsEnableReferenceId,
                     Status = s.LabResult.IsActive,
                     
                     LabAddress = new Lab_Address()
                     {
                         Email = s.LabResult.Email,
                         Phone = s.LabResult.PhoneNumber,
                         Fax = s.LabResult.FaxNumber,
                         Address__1 = s.LabResult.Address1,
                         Address__2 = s.LabResult.Address2,
                         City1 = s.LabResult.City,
                         State1 = s.LabResult.State,
                         ZipCode1 = s.LabResult.ZipCode
                     },
                     LabDirectorInfo = new Lab_DirectorInfo()
                     {
                         LabDirectorId = s.DirectorInfo != null ? s.DirectorInfo.Id : 0,
                         FirstName = s.DirectorInfo != null ? s.DirectorInfo.FirstName : "",
                         MiddleName = s.DirectorInfo != null ? s.DirectorInfo.MiddleName : "",
                         LastName = s.DirectorInfo != null ? s.DirectorInfo.LastName : "",
                         EmailAddress = s.DirectorInfo != null ? s.DirectorInfo.EmailAddress : "",
                         Mobile = s.DirectorInfo != null ? s.DirectorInfo.Mobile : "",
                         Phone = s.DirectorInfo != null ? s.DirectorInfo.Phone : "",
                         Address__1 = s.DirectorInfo != null ? s.DirectorInfo.Address1 : "",
                         Address__2 = s.DirectorInfo != null ? s.DirectorInfo.Address2 : "",
                         City = s.DirectorInfo != null ? s.DirectorInfo.City : "",
                         State = s.DirectorInfo != null ? s.DirectorInfo.State : "",
                         ZipCode = s.DirectorInfo != null ? s.DirectorInfo.ZipCode : "",
                         CapInfoNumber = s.DirectorInfo != null ? s.DirectorInfo.CapInfoNumber : "",
                         NoCapProvider = s.DirectorInfo != null ? s.DirectorInfo.NoCapProvider : ""
                     }
                     
                 }).ToList();
            dataSource = dataSource.OrderByDescending(o => o.ReferenceLabId).DistinctBy(d => d.ReferenceLabId).ToList();
            #region Filter
            if (query.QueryModel?.ReferenceLabId > 0)
                dataSource = dataSource.Where(f => f.ReferenceLabId == query.QueryModel?.ReferenceLabId).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabName))
                dataSource = dataSource.Where(f => f.LabName != null && f.LabName.Trim().ToLower().Contains(query.QueryModel?.LabName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDisplayName))
                dataSource = dataSource.Where(f => f.LabDisplayName != null && f.LabDisplayName.Trim().ToLower().Contains(query.QueryModel?.LabDisplayName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.PortalLogo))
                dataSource = dataSource.Where(f => f.PortalLogo != null && f.PortalLogo.Trim().ToLower().Contains(query.QueryModel?.PortalLogo.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.CLIA))
                dataSource = dataSource.Where(f => f.CLIA != null && f.CLIA.Trim().ToLower().Contains(query.QueryModel?.CLIA.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.Enter3DigitsProgram))
                dataSource = dataSource.Where(f => f.Enter3DigitsProgram != null && f.Enter3DigitsProgram.Trim().ToLower().Contains(query.QueryModel?.Enter3DigitsProgram.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.Enter3DigitsLabCode))
                dataSource = dataSource.Where(f => f.Enter3DigitsLabCode != null && f.Enter3DigitsLabCode.Trim().ToLower().Contains(query.QueryModel?.Enter3DigitsLabCode.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabType))
                dataSource = dataSource.Where(f => f.LabType != null && f.LabType.Trim().ToLower().Contains(query.QueryModel?.LabType.Trim().ToLower())).ToList();

            if (query.QueryModel?.EnableReferenceId != null)
                dataSource = dataSource.Where(f => f.EnableReferenceId == query.QueryModel?.EnableReferenceId).ToList();

            if (query.QueryModel?.Status != null)
                dataSource = dataSource.Where(f => f.Status == query.QueryModel?.Status).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabAddress?.Email))
                dataSource = dataSource.Where(f => f.LabAddress?.Email != null && f.LabAddress.Email.Trim().ToLower().Contains(query.QueryModel?.LabAddress?.Email.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabAddress?.Phone))
                dataSource = dataSource.Where(f => f.LabAddress?.Phone != null && f.LabAddress.Phone.Trim().ToLower().Contains(query.QueryModel?.LabAddress?.Phone.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabAddress?.Fax))
                dataSource = dataSource.Where(f => f.LabAddress?.Fax != null && f.LabAddress.Fax.Trim().ToLower().Contains(query.QueryModel?.LabAddress?.Fax.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabAddress?.Address__1))
                dataSource = dataSource.Where(f => f.LabAddress?.Address__1 != null && f.LabAddress.Address__1.Trim().ToLower().Contains(query.QueryModel?.LabAddress?.Address__2.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabAddress?.Address__2))
                dataSource = dataSource.Where(f => f.LabAddress?.Address__2 != null && f.LabAddress.Address__2.Trim().ToLower().Contains(query.QueryModel?.LabAddress?.Address__2.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabAddress?.City1))
                dataSource = dataSource.Where(f => f.LabAddress?.City1 != null && f.LabAddress.City1.Trim().ToLower().Contains(query.QueryModel?.LabAddress?.City1.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabAddress?.State1))
                dataSource = dataSource.Where(f => f.LabAddress?.State1 != null && f.LabAddress.State1.Trim().ToLower().Contains(query.QueryModel?.LabAddress?.State1.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabAddress?.ZipCode1))
                dataSource = dataSource.Where(f => f.LabAddress?.ZipCode1 != null && f.LabAddress.ZipCode1.Trim().ToLower().Contains(query.QueryModel?.LabAddress?.ZipCode1.Trim().ToLower())).ToList();

            if (query.QueryModel?.LabDirectorInfo?.LabDirectorId > 0)
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.LabDirectorId == query.QueryModel?.LabDirectorInfo.LabDirectorId).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.FirstName))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.FirstName != null && f.LabDirectorInfo.FirstName.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.FirstName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.MiddleName))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.MiddleName != null && f.LabDirectorInfo.MiddleName.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.MiddleName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.LastName))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.LastName != null && f.LabDirectorInfo.LastName.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.LastName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.EmailAddress))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.EmailAddress != null && f.LabDirectorInfo.EmailAddress.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.EmailAddress.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.Mobile))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.Mobile != null && f.LabDirectorInfo.Mobile.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.Mobile.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.Phone))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.Phone != null && f.LabDirectorInfo.Phone.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.Phone.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.Address__1))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.Address__1 != null && f.LabDirectorInfo.Address__1.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.Address__1.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.Address__2))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.Address__2 != null && f.LabDirectorInfo.Address__2.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.Address__2.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.City))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.City != null && f.LabDirectorInfo.City.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.City.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.State))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.State != null && f.LabDirectorInfo.State.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.State.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.ZipCode))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.ZipCode != null && f.LabDirectorInfo.ZipCode.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.ZipCode.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.CapInfoNumber))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.CapInfoNumber != null && f.LabDirectorInfo.CapInfoNumber.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.CapInfoNumber.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.QueryModel?.LabDirectorInfo?.NoCapProvider))
                dataSource = dataSource.Where(f => f.LabDirectorInfo?.NoCapProvider != null && f.LabDirectorInfo.NoCapProvider.Trim().ToLower().Contains(query.QueryModel.LabDirectorInfo.NoCapProvider.Trim().ToLower())).ToList();

            response.Total = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            #endregion

            response.Data = dataSource;
            return response;
        }
        public Domain.Models.Response.RequestResponse<GetByIdReferenceLabResponse> GetById(int id)
        {
            var response = new Domain.Models.Response.RequestResponse<GetByIdReferenceLabResponse>();

            Type enumType = typeof(LabTypeEnum);

            var dataSource = (from Labs in _masterDbContext.TblLabs
                              join Directors in _masterDbContext.TblDirectorInformations on Labs.LabId equals Directors.LabId
                              into LabsWithDirectors
                              from LabsAndDirectors in LabsWithDirectors.DefaultIfEmpty()
                              select new { LabResult = Labs, DirectorInfo = LabsAndDirectors })
                .Select(s => new GetByIdReferenceLabResponse()
                {
                    ReferenceLabId = s.LabResult.LabId,
                    LabName = s.LabResult.LaboratoryName,
                    LabDisplayName = s.LabResult.DisplayName,
                    PortalLogo = s.LabResult.PortalLogo,
                    CLIA = s.LabResult.Cliano,
                    Enter3DigitsProgram = s.LabResult.Enter3DigitsProgram,
                    Enter3DigitsLabCode = s.LabResult.Enter3DigitsLabCode,
                    LabType = Enum.GetName(enumType, s.LabResult.LabType),
                    EnableReferenceId = s.LabResult.IsEnableReferenceId,
                    Status = s.LabResult.IsActive,
                    LabAddress = new Lab_Address()
                    {
                        Email = s.LabResult.Email,
                        Phone = s.LabResult.PhoneNumber,
                        Fax = s.LabResult.FaxNumber,
                        Address__1 = s.LabResult.Address1,
                        Address__2 = s.LabResult.Address2,
                        City1 = s.LabResult.City,
                        State1 = s.LabResult.State,
                        ZipCode1 = s.LabResult.ZipCode
                    },
                    LabDirectorInfo = new Lab_DirectorInfo()
                    {
                        LabDirectorId = s.DirectorInfo != null ? s.DirectorInfo.Id : 0,
                        FirstName = s.DirectorInfo != null ? s.DirectorInfo.FirstName : "",
                        MiddleName = s.DirectorInfo != null ? s.DirectorInfo.MiddleName : "",
                        LastName = s.DirectorInfo != null ? s.DirectorInfo.LastName : "",
                        EmailAddress = s.DirectorInfo != null ? s.DirectorInfo.EmailAddress : "",
                        Mobile = s.DirectorInfo != null ? s.DirectorInfo.Mobile : "",
                        Phone = s.DirectorInfo != null ? s.DirectorInfo.Phone : "",
                        Address__1 = s.DirectorInfo != null ? s.DirectorInfo.Address1 : "",
                        Address__2 = s.DirectorInfo != null ? s.DirectorInfo.Address2 : "",
                        City = s.DirectorInfo != null ? s.DirectorInfo.City : "",
                        State = s.DirectorInfo != null ? s.DirectorInfo.State : "",
                        ZipCode = s.DirectorInfo != null ? s.DirectorInfo.ZipCode : "",
                        CapInfoNumber = s.DirectorInfo != null ? s.DirectorInfo.CapInfoNumber : "",
                        NoCapProvider = s.DirectorInfo != null ? s.DirectorInfo.NoCapProvider : ""
                    }
                }).FirstOrDefault(f => f.ReferenceLabId == id);

            response.Data = dataSource;
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Processed Successfully !";

            return response;
        }
        #endregion
    }
}
