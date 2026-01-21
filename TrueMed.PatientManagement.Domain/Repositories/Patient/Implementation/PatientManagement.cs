using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.PatientManagement.Domain.Models.Patient.Request;
using TrueMed.PatientManagement.Domain.Models.Patient.Request.QueryModel;
using TrueMed.PatientManagement.Domain.Models.Patient.Request.QueryModel.Base;
using TrueMed.PatientManagement.Domain.Models.Patient.Response;
using TrueMed.PatientManagement.Domain.Models.Patient.Response.QueryModel;
using TrueMed.PatientManagement.Domain.Models.Patient.Response.QueryModel.Base;
using TrueMed.PatientManagement.Domain.Repositories.Patient.Interface;

namespace TrueMed.PatientManagement.Domain.Repositories.Patient.Implementation
{
    public class PatientManagement : IPatientManagement
    {
        private readonly IConnectionManager _connectionManager;
        ApplicationDbContext _applicationDbContext;

        public PatientManagement(MasterDbContext masterDbContext,
            IConnectionManager connectionManager,
            ApplicationDbContext applicationDbContext
            )

        {
            _applicationDbContext = applicationDbContext;
            this._connectionManager = connectionManager;
        }

        public async Task<bool> AddOrUpdatePatientAddressAsync(int patientId,
            PatientAddressInfoViewModel addressInfoViewModel)
        {
            if (!await IsPatientExistsByIdAsync(patientId))
                return false;

            var isUpdating = addressInfoViewModel is UpdatePatientAddressInfoViewModel;
            var id = isUpdating ? ((UpdatePatientAddressInfoViewModel)addressInfoViewModel).Id : 0;

            TblPatientAddInfo addInfo = null;
            if (!isUpdating || (addInfo = await _applicationDbContext.TblPatientAddInfos.FirstOrDefaultAsync(x => x.PatientAddInfoId == id)) == null)
            {
                addInfo = new TblPatientAddInfo();
            }
            else
            {
                addInfo.UpdatedDate = DateTimeNow.Get;
                addInfo.UpdatedBy = _connectionManager.UserId;
            }

            addInfo.PatientId = patientId;
            addInfo.Address1 = addressInfoViewModel.Address.Address1;
            addInfo.Address2 = addressInfoViewModel.Address.Address2;
            addInfo.ZipCode = addressInfoViewModel.Address.ZipCode;
            addInfo.City = addressInfoViewModel.Address.City;
            addInfo.State = addressInfoViewModel.Address.State;
            addInfo.Country = addressInfoViewModel.Address.Country;
            addInfo.County = addressInfoViewModel.County;
            addInfo.Email = addressInfoViewModel.Email;
            addInfo.FacilityId = Convert.ToInt32(addressInfoViewModel.FacilityId);
            addInfo.Phone = addressInfoViewModel.LandPhone;
            addInfo.Mobile = addressInfoViewModel.Mobile;
            addInfo.Height = addressInfoViewModel.Height;
            addInfo.Weight = addressInfoViewModel.Weight;


            if (isUpdating && addInfo.PatientAddInfoId > 0)
            {
                _applicationDbContext.Update(addInfo).State = EntityState.Modified;
            }
            else
            {
                _applicationDbContext.Update(addInfo).State = EntityState.Added;
            }

            var isDone = (await _applicationDbContext.SaveChangesAsync()) > 0;
            addressInfoViewModel.Id = addInfo.PatientAddInfoId;
            return isDone;
        }

        public async Task<bool> AddOrUpdatePatientAsync(Models.Patient.Request.PatientViewModel patientViewModel)
        {
            var isUpdating = patientViewModel is UpdatePatientViewModel;
            var patientId = isUpdating ? ((UpdatePatientViewModel)patientViewModel).Id : 0;
            TblPatientBasicInfo tblPatient = null;
            if (!isUpdating || (tblPatient = await _applicationDbContext.TblPatientBasicInfos.FirstOrDefaultAsync(x => x.PatientId == patientId)) == null)
            {
                tblPatient = new TblPatientBasicInfo();
                tblPatient.CreatedBy = _connectionManager.UserId;
                tblPatient.CreatedDate = DateTimeNow.Get;
            }
            else
            {
                tblPatient.UpdatedDate = DateTimeNow.Get;
                tblPatient.UpdatedBy = _connectionManager.UserId;
            }

            tblPatient.FirstName = patientViewModel.FirstName;
            tblPatient.LastName = patientViewModel.LastName;
            tblPatient.MiddleName = patientViewModel.MiddleName;
            tblPatient.PassPortNumber = patientViewModel.PassportNumber;
            tblPatient.Race = patientViewModel.Race;
            tblPatient.PatientDrivingOridnumber = patientViewModel.DLIDNumber;
            tblPatient.Dob = Convert.ToDateTime(patientViewModel.DateOfBirth);
            tblPatient.Ethnicity = patientViewModel.Ethinicity;
            tblPatient.PatientType = patientViewModel.PatientType;
            tblPatient.Gender = patientViewModel.Gender;
            tblPatient.SocialSecurityNumber = patientViewModel.SocialSecurityNumber;

            if (isUpdating && tblPatient.PatientId > 0)
            {
                _applicationDbContext.Update(tblPatient).State = EntityState.Modified;
            }
            else
            {
                _applicationDbContext.Update(tblPatient).State = EntityState.Added;
            }

            var isDone = (await _applicationDbContext.SaveChangesAsync()) > 0;
            patientViewModel.Id = tblPatient.PatientId;
            return isDone;
        }

        public async Task<bool> IsPatientExistsByIdAsync(int patientId)
        {
            return await _applicationDbContext.TblPatientBasicInfos.AnyAsync(x => x.PatientId == patientId);
        }

        public IQueryable<PatientDetailsVM> GetAllPatients()
        {

            return _applicationDbContext.TblPatientBasicInfos.Join(_applicationDbContext.TblPatientAddInfos
                , PBI => PBI.PatientId
                , PAI => PAI.PatientId, (PBI, PAI) => new
                {
                    PatientBasicInfo = PBI,
                    PatientAddressInfo = PAI

                }).Join(_applicationDbContext.TblPatientInsurances
                , PBAI => PBAI.PatientBasicInfo.PatientId
                , PII => PII.PatientId, (PBAI, PII) => new PatientDetailsVM()
                {
                    Patient = new Models.Patient.Response.Patient()
                    {
                        FirstName = PBAI.PatientBasicInfo.FirstName,
                    }
                });
        }

        public async Task<bool> DeletePatientAsync(int patientId)
        {
            return await _applicationDbContext.Database.ExecuteSqlRawAsync("EXEC SP_DELETE_PATIENT_BY_ID @patientId  = {0}", patientId) == 1;
        }

        public async Task<int?> IsPatientExistsByNameAndDateOfBirthAsync
            (PatientValidationByNameAndDateOfBirthViewModel model)
        {
            var name = model.FirstName + " " + model.LastName;
            if (!string.IsNullOrWhiteSpace(model.MiddleName))
            {
                name = model.FirstName + " " + model.MiddleName + " " + model.LastName;
                return await GetAllPatients()
                    .Where(x =>
                    (x.Patient.FirstName + " " + x.Patient.MiddleName + " " + x.Patient.LastName)
                    .ToLower() == name.Trim().ToLower()
            && Convert.ToDateTime(x.Patient.DateOfBirth).Date == model.DateOfBirth.Value.Date).Select(x => x.Patient.PatientId).FirstOrDefaultAsync();
            }
            else
            {
                return await GetAllPatients()
                    .Where(x =>
                    (x.Patient.FirstName + " " + x.Patient.LastName)
                    .ToLower() == name.Trim().ToLower()
            && Convert.ToDateTime(x.Patient.DateOfBirth).Date == model.DateOfBirth.Value.Date).Select(x => x.Patient.PatientId).FirstOrDefaultAsync();

            }
        }

        public async Task<bool> IsPatientFacilityExistsByIdAsync(int facilityId)
        {
            return await _applicationDbContext.TblFacilities.AnyAsync(x => x.FacilityId == facilityId);
        }





        #region Search
        public async Task<DataQueryResponseModel<List<SearchPatientResponseVM>>> SearchPatient(DataQueryRequestModel<SearchPatientRequestQM> request)
        {
            var response = new DataQueryResponseModel<List<SearchPatientResponseVM>>();

            var dataSource = await _applicationDbContext.TblPatientBasicInfos.Join(_applicationDbContext.TblPatientAddInfos
                , PBI => PBI.PatientId
                , PAi => PAi.PatientId, (PBI, PAi) => new SearchPatientResponseVM()
                {
                    PatientId = PBI.PatientId,
                    PatientFirstName = PBI.FirstName,
                    PatientLastName = PBI.LastName,
                    DOB = PBI.Dob,
                    Email = PAi.Email,
                    Gender = PBI.Gender,
                    Mobile = PAi.Mobile
                }).ToListAsync() ?? new();

            response.Total = dataSource.Count;
            #region Search Parameters
            if (!string.IsNullOrEmpty(request.QueryModel?.PatientFirstName))
            {
                dataSource = dataSource.Where(f => f.PatientFirstName != null && f.PatientFirstName.ToLower().Contains(request.QueryModel.PatientFirstName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(request.QueryModel?.PatientLastName))
            {
                dataSource = dataSource.Where(f => f.PatientLastName != null && f.PatientLastName.ToLower().Contains(request.QueryModel.PatientLastName.ToLower())).ToList();
            }
            if (request.QueryModel?.DOB != null)
            {
                dataSource = dataSource.Where(f => f.DOB.Value == request.QueryModel.DOB.Value).ToList();
            }
            if (!string.IsNullOrEmpty(request.QueryModel?.Gender))
            {
                dataSource = dataSource.Where(f => f.Gender != null && f.Gender.ToLower().Contains(request.QueryModel.Gender.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(request.QueryModel?.Mobile))
            {
                dataSource = dataSource.Where(f => f.Mobile != null && f.Mobile.ToLower().Contains(request.QueryModel.Mobile.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(request.QueryModel?.Email))
            {
                dataSource = dataSource.Where(f => f.Email != null && f.Email.ToLower().Contains(request.QueryModel.Email.ToLower())).ToList();
            }
            if (request.PageNumber > 0 && request.PageSize > 0)
            {
                dataSource = dataSource.Skip((request.PageNumber - 1) * request.PageSize).Take(request.PageSize).ToList();
            }
            response.Result = dataSource;
            response.Message = "Request Processed...";
            response.StatusCode = HttpStatusCode.OK;
            #endregion
            return response;
        }

        #endregion
    }
}
