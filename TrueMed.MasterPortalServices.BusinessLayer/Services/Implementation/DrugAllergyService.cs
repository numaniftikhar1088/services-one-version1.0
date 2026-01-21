using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel;
using TrueMed.MasterPortalAppManagement.Domain.Models.QueryModel.Base;
using TrueMed.MasterPortalAppManagement.Domain.Models.ResponseModel;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.Sevices.MasterEntities;
using TrueMed.Business.MasterDBContext;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class DrugAllergyService : IDrugAllergyService
    {
        private readonly IConnectionManager _connectionManager;
        private MasterDbContext _masterDbContext;
        private IMapper _mapper;

        public DrugAllergyService(IConnectionManager connectionManager, MasterDbContext masterDbContext, IMapper mapper)
        {
            _connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
            _mapper = mapper;
            LoggedInUser = connectionManager.UserId;
        }
        public string LoggedInUser { get; set; }

        public async Task<DataQueryResponse<List<GetDrugAllergiesResponse>>> GetDrugAllergiesAsync(DataQueryModel<DrugAllergyQueryModel> query)
        {
            var response = new DataQueryResponse<List<GetDrugAllergiesResponse>>();

            #region DataSource
            var DrugAllergiesResult = await _masterDbContext.TblDrugAllergies.Where(f => f.IsDeleted.Equals(false)).ToListAsync();
            //var requisitionTypeResult = await _masterDbContext.ooTblRequisitionTypes.ToListAsync();
            //var departmentResult = await _masterDbContext.TblDepartments.Where(x => x.IsDeleted.Equals(false)).ToListAsync();
            #endregion

            var dataSource = (from DrugAllergies in DrugAllergiesResult.DefaultIfEmpty()
                              select new GetDrugAllergiesResponse()
                              {
                                  Id = DrugAllergies.Id,
                                  Dacode = DrugAllergies.Dacode,
                                  Description = DrugAllergies.Description,
                                  IsActive = DrugAllergies.IsActive
                              }).DistinctBy(d => d.Id).OrderByDescending(o => o.Id).ToList();

            #region Filtered
            if (!string.IsNullOrEmpty(query.QueryModel?.Dacode))
            {
                dataSource = dataSource.Where(f => f.Dacode != null && f.Dacode.ToLower().Contains(query.QueryModel?.Dacode.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(query.QueryModel?.Description))
            {
                dataSource = dataSource.Where(f => f.Description != null && f.Description.ToLower().Contains(query.QueryModel?.Description.ToLower())).ToList();
            }
            if (query.QueryModel?.IsActive != null)
            {
                dataSource = dataSource.Where(f => f.IsActive.Equals(query.QueryModel.IsActive)).ToList();
            }
            response.Total = dataSource.Count();
            if (query.PageNumber > 0 && query.PageSize > 0)
            {
                dataSource = dataSource.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            }
            #endregion

            response.Data = dataSource;
            return response;
        }
        public async Task<RequestResponse> ChangeDrugAllergyStatusAsync(ChangeDrugAllergyStatusRequest request)
        {
            var response = new RequestResponse();

            //var validation = new ChangeTestSetupStatusValidator();
            //var validate = await validation.ValidateAsync(request);

            //if (!validate.IsValid)
            //{
            //    response.Error = validate.Errors.Select(s => s.ErrorMessage).ToList();
            //    response.HttpStatusCode = Status.Failed;
            //    response.Status = "Validation Failed !";
            //    response.Message = "Request Failed !";
            //    return response;
            //}
            var getRecordForStatusChanged = await _masterDbContext.TblDrugAllergies.FindAsync(request.Id);
            if (getRecordForStatusChanged != null)
            {
                getRecordForStatusChanged.UpdatedBy = LoggedInUser;
                getRecordForStatusChanged.UpdatedDate = DateTimeNow.Get;

                getRecordForStatusChanged.IsActive = request.IsActive;
                _masterDbContext.Update(getRecordForStatusChanged);
                response.Message = "Status Changed...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {request.Id} in our system...";
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var ack = await _masterDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }

        public async Task<RequestResponse> DeleteDrugAllergyByIdAsync(int id)
        {
            var response = new RequestResponse();

            if (id <= 0)
            {
                response.Error = "invalid ID !";
                response.Status = "Failed";
                response.Message = "Request Failed !";
                response.HttpStatusCode = Status.Failed;
                return response;

            }
            var getRecordForSoftDelete = await _masterDbContext.TblDrugAllergies.FindAsync(id);
            if (getRecordForSoftDelete != null)
            {
                getRecordForSoftDelete.DeletedDate = DateTimeNow.Get;
                getRecordForSoftDelete.DeletedBy = LoggedInUser;

                getRecordForSoftDelete.IsDeleted = true;

                _masterDbContext.Update(getRecordForSoftDelete);
                response.Message = "Record Deleted...";
            }
            else
            {
                response.Error = $"Record is not exist against ID : {id} in our system...";
                response.HttpStatusCode = Status.Failed;
                response.Status = "Failed !";
                response.Message = "Request Failed !";
                return response;
            }
            var ack = await _masterDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }

        public async Task<RequestResponse> SaveDrugAllergyAsync(SaveDrugAllergyRequest request)
        {
            var response = new RequestResponse();

            _masterDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var entity = _mapper.Map<TblDrugAllergy>(request);

            if (entity.Id > 0)
            {
                var getRecordForEdit = await _masterDbContext.TblDrugAllergies.FindAsync(entity.Id);
                if (getRecordForEdit != null)
                {
                    //entity.TestDisplayName = entity.TestName;
                    entity.Dacode = getRecordForEdit.Dacode;
                    entity.UpdatedDate = DateTimeNow.Get;
                    entity.UpdatedBy = LoggedInUser;

                    entity.CreatedDate = getRecordForEdit.CreatedDate;
                    entity.CreatedBy = getRecordForEdit.CreatedBy;

                    _masterDbContext.TblDrugAllergies.Update(entity);
                    response.Message = "Record is Updated...";

                }
                else
                {
                    response.Error = $"Record is not exist against ID : {entity.Id} in our system...";
                    response.HttpStatusCode = Status.Failed;
                    response.Status = "Failed !";
                    response.Message = "Request Failed !";
                    return response;
                }
            }
            else
            {

                //entity.TestDisplayName = entity.TestName;

                entity.CreatedBy = LoggedInUser;
                entity.CreatedDate = DateTimeNow.Get;

                entity.IsDeleted = false;

                if (entity.IsActive == null)
                    entity.IsActive = true;

                await _masterDbContext.AddAsync(entity);
                await _masterDbContext.SaveChangesAsync();

                var newrec = await _masterDbContext.TblDrugAllergies.FindAsync(entity.Id);
                newrec.Dacode = "DA" + newrec.Id.ToString().PadLeft(6, '0');

                _masterDbContext.TblDrugAllergies.Update(newrec);
                response.Message = "Record is Added...";

            }

            var ack = await _masterDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.HttpStatusCode = Status.Success;
                response.Status = "Success !";
            }
            return response;
        }
        public async Task<bool> IsDrugAllergiesDescriptionValid(string name)
        {
            var IsRequitionNameNotUnique = _masterDbContext.TblDrugAllergies.Any(x => x.Description.Trim().ToLower() == name.Trim().ToLower());
            if (IsRequitionNameNotUnique)
                return false;
            else
                return true;
        }
    }
}
