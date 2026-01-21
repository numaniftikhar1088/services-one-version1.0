using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Response;
using TrueMed.PatientManagement.Business.Services.Interfaces;
using TrueMed.PatientManagement.Domain.Models.Dtos.Request;
using TrueMed.PatientManagement.Domain.Models.Dtos.Response;
using TrueMed.PatientManagement.Domain.Models.QueryModels.Request;
using TrueMed.PatientManagement.Domain.Models.QueryModels.Response;
using TrueMed.PatientManagement.Domain.Models.Response.Request.Base;
using TrueMed.PatientManagement.Domain.Models.Response.Response.Base;
using System.Linq.Dynamic.Core;
namespace TrueMed.PatientManagement.Business.Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IMapper _mapper;

        private ApplicationDbContext _applicationDb;
        private MasterDbContext _masterDbContext;
        public PatientService(IConnectionManager connectionManager, IMapper mapper, MasterDbContext m, ApplicationDbContext applicationDb)
        {
            _connectionManager = connectionManager;
            _mapper = mapper;
            _masterDbContext = m;
            _applicationDb = applicationDb;

        }

        #region Commands
        public RequestResponse Save(SavePatientRequest request)
        {
            var response = new RequestResponse();

            #region Patient Information
            var patientInfo = new TblPatientBasicInfo();
            patientInfo.PatientId = request.PatientInformation.PatientId;
            patientInfo.FirstName = request.PatientInformation.FirstName;
            patientInfo.MiddleName = request.PatientInformation.MiddleName;
            patientInfo.LastName = request.PatientInformation.LastName;
            patientInfo.Dob = request.PatientInformation.DateOfBirth;
            patientInfo.Gender = request.PatientInformation.Gender;
            patientInfo.Ethnicity = request.PatientInformation.Ethnicity;
            patientInfo.Race = request.PatientInformation.Race;
            patientInfo.PatientType = request.PatientInformation.PatientType;
            patientInfo.SocialSecurityNumber = request.PatientInformation.SocialSecurityNumber;
            patientInfo.PassPortNumber = request.PatientInformation.PassportNumber;
            patientInfo.PatientDrivingOridnumber = request.PatientInformation.DLIDNumber;
            patientInfo.CreatedBy = _connectionManager.UserId;
            patientInfo.CreatedDate = DateTimeNow.Get;
            patientInfo.FacilityId = request.PatientInformation?.Address?.Facility;

            #endregion
            #region Patient Address Information
            var patientAddress = new TblPatientAddInfo();
            patientAddress.Address1 = request.PatientInformation.Address.Address1;
            patientAddress.Address2 = request.PatientInformation.Address.Address2;
            patientAddress.ZipCode = request.PatientInformation.Address.ZipCode;
            patientAddress.City = request.PatientInformation.Address.City;
            patientAddress.State = request.PatientInformation.Address.State;
            patientAddress.Country = request.PatientInformation.Address.Country;
            patientAddress.County = request.PatientInformation.Address.County;
            patientAddress.Phone = request.PatientInformation.Address.PhoneNumber;
            patientAddress.Mobile = request.PatientInformation.Address.MobileNumber;
            patientAddress.Email = request.PatientInformation.Address.Email;
            patientAddress.Weight = request.PatientInformation.Address.Weight;
            patientAddress.Height = request.PatientInformation.Address.Height;
            patientAddress.FacilityId = request.PatientInformation.Address.Facility;
            patientInfo.TblPatientAddInfos.Add(patientAddress);
            #endregion
            #region Patient Insurance Information
            foreach (var patientInsurance in request.PatientInformation.PatientInsurances)
            {
                var patientIns = new TblPatientInsurance();
                patientIns.InsuranceId = patientInsurance.Insurance;
                patientIns.InsuranceProviderId = patientInsurance.InsuranceProvider;
                patientIns.PrimaryGroupId = patientInsurance.GroupNumber;
                patientIns.PrimaryPolicyId = patientInsurance.PolicyNumber;
                patientIns.RelationshipToInsured = patientInsurance.SubscriberRelation;
                patientIns.SubscriberName = patientInsurance.SubscriberName;
                patientIns.SubscriberDob = patientInsurance.SubscriberDateOfBirth;
                patientIns.CreatedBy = _connectionManager.UserId;
                patientIns.CreatedDate = DateTime.UtcNow;
                patientIns.AccidentDate = patientInsurance.AccidentDate;
                patientIns.AccidentState = patientInsurance.AccidentState;
                patientIns.AccidentType = patientInsurance.AccidentType;
                patientIns.InsurancePhone = patientInsurance.InsurancePhone;
                patientIns.BillingType = patientInsurance.BillingType;
                //  patientIns.AccidentDate = patientInsurance.SubscriberDateOfBirth;
                patientInfo.TblPatientInsurances.Add(patientIns);
            }
            #endregion
            if (request.PatientInformation.PatientId == 0)
            {
                patientAddress.FacilityId = request.PatientInformation.Address.Facility;
                _applicationDb.TblPatientBasicInfos.Add(patientInfo);
                response.Message = "Patient Added Successfully !";
            }
            else
            {
                var existingPatient = _applicationDb.TblPatientBasicInfos.AsNoTracking().FirstOrDefault(f => f.PatientId.Equals(request.PatientInformation.PatientId));
                if (existingPatient != null)
                {
                    var getAddressForDeletion = _applicationDb.TblPatientAddInfos.Where(f => f.PatientId == existingPatient.PatientId);
                    var getInsurancesForDeletion = _applicationDb.TblPatientInsurances.Where(f => f.PatientId == existingPatient.PatientId);
                    if (getAddressForDeletion.Count() > 0)
                        _applicationDb.TblPatientAddInfos.RemoveRange(getAddressForDeletion);
                    if (getInsurancesForDeletion.Count() > 0)
                        _applicationDb.TblPatientInsurances.RemoveRange(getInsurancesForDeletion);

                    #region Patient Manipulation History
                    patientInfo.CreatedBy = existingPatient.CreatedBy;
                    patientInfo.CreatedDate = existingPatient.CreatedDate;
                    patientInfo.UpdatedDate = DateTimeNow.Get;
                    patientInfo.UpdatedBy = _connectionManager.UserId;

                    patientInfo.TblPatientAddInfos.FirstOrDefault().UpdatedBy = _connectionManager.UserId;
                    patientInfo.TblPatientAddInfos.FirstOrDefault().UpdatedDate = DateTimeNow.Get;

                    patientInfo.TblPatientInsurances.FirstOrDefault().CreatedBy = existingPatient.CreatedBy;
                    patientInfo.TblPatientInsurances.FirstOrDefault().CreatedDate = existingPatient.CreatedDate;

                    patientInfo.TblPatientInsurances.FirstOrDefault().UpdatedBy = _connectionManager.UserId;
                    patientInfo.TblPatientInsurances.FirstOrDefault().UpdatedDate = DateTimeNow.Get;
                    #endregion
                    _applicationDb.TblPatientBasicInfos.Update(patientInfo);
                    response.Message = "Patient Updated Successfully !";
                }
            }
            _applicationDb.SaveChanges();

            response.StatusCode = HttpStatusCode.OK;
            response.Data = patientInfo.PatientId;

            return response;
        }
        public RequestResponse Delete(int id)
        {
            var response = new RequestResponse();

            var getPatientForSoftDel = _applicationDb.TblPatientBasicInfos.FirstOrDefault(f => f.PatientId.Equals(id));
            getPatientForSoftDel.IsDeleted = true;

            _applicationDb.TblPatientBasicInfos.Update(getPatientForSoftDel);
            _applicationDb.SaveChanges();

            response.Message = "Patient Deleted Successfully !";
            response.StatusCode = HttpStatusCode.OK;
            response.Data = getPatientForSoftDel;

            return response;
        }
        #endregion
        #region Querires
        public DataQueryResponse<List<PatientResponseQM>> GetAll(DataQueryRequest<PatientRequestQM> query)
        {
            var response = new DataQueryResponse<List<PatientResponseQM>>();

            #region Source
            var allPatients = _applicationDb.TblPatientBasicInfos
                .Include(i => i.TblPatientAddInfos)
                .Include(i => i.TblPatientInsurances).Where(f => f.IsDeleted == false).OrderByDescending(x => x.PatientId).Select(s => new PatientResponseQM()
                {
                    PatientId = s.PatientId,
                    FirstName = s.FirstName,
                    MiddleName = s.MiddleName,
                    LastName = s.LastName,
                    DateOfBirth = s.Dob,
                    Gender = s.Gender,
                    Ethnicity = s.Ethnicity,
                    Race = s.Race,
                    PatientType = s.PatientType,
                    SocialSecurityNumber = s.SocialSecurityNumber,
                    PassportNumber = s.PassPortNumber,
                    DLIDNumber = s.PatientDrivingOridnumber,
                    Address = s.TblPatientAddInfos.FirstOrDefault() != null ? new PatientCurrentAddress()
                    {
                        Address1 = s.TblPatientAddInfos.First().Address1,
                        Address2 = s.TblPatientAddInfos.First().Address2,
                        ZipCode = s.TblPatientAddInfos.First().ZipCode,
                        City = s.TblPatientAddInfos.First().City,
                        State = s.TblPatientAddInfos.First().State,
                        Country = s.TblPatientAddInfos.First().Country,
                        County = s.TblPatientAddInfos.First().County,
                        PhoneNumber = s.TblPatientAddInfos.First().Phone,
                        MobileNumber = s.TblPatientAddInfos.First().Mobile,
                        Email = s.TblPatientAddInfos.First().Email,
                        Weight = s.TblPatientAddInfos.First().Weight.TrimEnd(),
                        Height = s.TblPatientAddInfos.First().Height.TrimEnd(),
                        Facility = Convert.ToInt32(s.FacilityId),
                    } : null,
                    PatientInsurances = s.TblPatientInsurances.Any() ? s.TblPatientInsurances
                        .Select(insurance => new PatientInsurance()
                        {
                            Insurance = Convert.ToInt32(insurance.InsuranceId),
                            InsuranceProvider = Convert.ToInt32(insurance.InsuranceProviderId),
                            GroupNumber = insurance.PrimaryGroupId,
                            PolicyNumber = insurance.PrimaryPolicyId,
                            SubscriberRelation = insurance.RelationshipToInsured,
                            SubscriberName = insurance.SubscriberName,
                            InsurancePhone = insurance.InsurancePhone,
                            BillingType = insurance.BillingType,
                            SubscriberDateOfBirth = insurance.SubscriberDob,
                            AccidentType = insurance.AccidentType,
                            AccidentState = insurance.AccidentState,
                            AccidentDate = insurance.AccidentDate
                        })
                        .ToList() : null
                    //PatientInsurances = s.TblPatientInsurances.Any() ? new List<PatientInsurance>()
                    //{
                    //    new PatientInsurance()
                    //    {
                    //        Insurance = Convert.ToInt32(s.TblPatientInsurances.First().InsuranceId),
                    //        InsuranceProvider = Convert.ToInt32(s.TblPatientInsurances.First().InsuranceProviderId),
                    //        GroupNumber = s.TblPatientInsurances.First().PrimaryGroupId,
                    //        PolicyNumber = s.TblPatientInsurances.First().PrimaryPolicyId,
                    //        SubscriberRelation = s.TblPatientInsurances.First().RelationshipToInsured,
                    //        SubscriberName = s.TblPatientInsurances.First().SubscriberName,
                    //        InsurancePhone = s.TblPatientInsurances.First().InsurancePhone,
                    //        BillingType = s.TblPatientInsurances.First().BillingType,
                    //        SubscriberDateOfBirth = s.TblPatientInsurances.First().SubscriberDob,
                    //        AccidentType= s.TblPatientInsurances.First().AccidentType,
                    //        AccidentState= s.TblPatientInsurances.First().AccidentState,
                    //        AccidentDate= s.TblPatientInsurances.First().AccidentDate
                    //    }
                    //} : null
                }).ToList();
            #endregion
            response.Total = allPatients.Count;
            #region Filter
            if (!string.IsNullOrEmpty(query.RequestModel?.FirstName))
                allPatients = allPatients.Where(f => f.FirstName != null && f.FirstName.Trim().ToLower().Contains(query.RequestModel.FirstName.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.RequestModel?.LastName))
                allPatients = allPatients.Where(f => f.LastName != null && f.LastName.Trim().ToLower().Contains(query.RequestModel.LastName.Trim().ToLower())).ToList();

            if (query.RequestModel?.DateOfBirth != null)
                allPatients = allPatients.Where(f => f.FirstName != null && f.DateOfBirth.Equals(query.RequestModel.DateOfBirth)).ToList();

            if (!string.IsNullOrEmpty(query.RequestModel?.Gender))
                allPatients = allPatients.Where(f => f.Gender != null && f.Gender.Trim().ToLower().Contains(query.RequestModel.Gender.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.RequestModel?.MobileNumber))
                allPatients = allPatients.Where(f => f.Address?.MobileNumber != null && f.Address.MobileNumber.Trim().ToLower().Contains(query.RequestModel.MobileNumber.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.RequestModel?.Email))
                allPatients = allPatients.Where(f => f.Address?.Email != null && f.Address.Email.Trim().ToLower().Contains(query.RequestModel.Email.Trim().ToLower())).ToList();

            if (!string.IsNullOrEmpty(query.SortColumn) && query.SortDirection != null)
            {
                if (query.SortColumn.Trim().ToLower() == "email")
                {
                    if (query.SortDirection == "desc")
                    {
                        allPatients = allPatients.OrderByDescending(x => x.Address?.Email).ToList();
                    }
                    else
                    {
                        allPatients = allPatients.OrderBy(x => x.Address?.Email).ToList();
                    }

                }
                else if (query.SortColumn.Trim().ToLower() == "mobilenumber")
                {
                    if (query.SortDirection == "desc")
                    {
                        allPatients = allPatients.OrderByDescending(x => x.Address?.MobileNumber).ToList();
                    }
                    else
                    {
                        allPatients = allPatients.OrderBy(x => x.Address?.MobileNumber).ToList();
                    }

                }
                else
                {
                    allPatients = allPatients.AsQueryable().OrderBy($"{query.SortColumn} {query.SortDirection}").ToList();
                }

            }
            else
            {
                allPatients = allPatients.AsQueryable().OrderBy($"PatientId desc").ToList();
            }
            response.Total = allPatients.Count;
            if (query.PageNumber > 0 && query.PageSize > 0)
                allPatients = allPatients.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize).ToList();
            #endregion
            response.Message = "Request Processed Successfully !";
            response.ResponseModel = allPatients;
            response.Status = HttpStatusCode.OK;

            return response;
        }
        public RequestResponse<PatientByIdResponse> GetById(int id)
        {
            var response = new RequestResponse<PatientByIdResponse>();

            var patientById = _applicationDb.TblPatientBasicInfos
                 .Include(i => i.TblPatientAddInfos)
                 .Include(i => i.TblPatientInsurances).Where(f => f.IsDeleted == false).Select(s => new PatientByIdResponse()
                 {
                     PatientId = s.PatientId,
                     FirstName = s.FirstName,
                     MiddleName = s.MiddleName,
                     LastName = s.LastName,
                     DateOfBirth = s.Dob,
                     Gender = s.Gender,
                     Ethnicity = s.Ethnicity,
                     Race = s.Race,
                     PatientType = s.PatientType,
                     SocialSecurityNumber = s.SocialSecurityNumber,
                     PassportNumber = s.PassPortNumber,
                     DLIDNumber = s.PatientDrivingOridnumber,
                     Address = new PatientCurrentAddress()
                     {
                         Address1 = s.TblPatientAddInfos.First().Address1,
                         Address2 = s.TblPatientAddInfos.First().Address2,
                         ZipCode = s.TblPatientAddInfos.First().ZipCode,
                         City = s.TblPatientAddInfos.First().City,
                         State = s.TblPatientAddInfos.First().State,
                         Country = s.TblPatientAddInfos.First().Country,
                         County = s.TblPatientAddInfos.First().County,
                         PhoneNumber = s.TblPatientAddInfos.First().Phone,
                         MobileNumber = s.TblPatientAddInfos.First().Mobile,
                         Email = s.TblPatientAddInfos.First().Email,
                         Weight = s.TblPatientAddInfos.First().Weight.TrimEnd(),
                         Height = s.TblPatientAddInfos.First().Height.TrimEnd(),
                         Facility = Convert.ToInt32(s.TblPatientAddInfos.First().FacilityId),
                     },
                     PatientInsurances = s.TblPatientInsurances.Any() ? s.TblPatientInsurances
                        .Select(insurance => new PatientInsurance()
                        {
                            //Insurance = Convert.ToInt32(insurance.InsuranceId),
                            InsuranceName = _masterDbContext.TblInsuranceSetups.FirstOrDefault(f=> f.InsuranceId == Convert.ToInt32(insurance.InsuranceId)).InsuranceName,
                            //InsuranceProvider = Convert.ToInt32(insurance.InsuranceProviderId),
                            InsuranceProviderName = _masterDbContext.TblInsuranceProviders.FirstOrDefault(f=> f.InsuranceProviderId == Convert.ToInt32(insurance.InsuranceProviderId)).ProviderName,
                            GroupNumber = insurance.PrimaryGroupId,
                            PolicyNumber = insurance.PrimaryPolicyId,
                            SubscriberRelation = insurance.RelationshipToInsured,
                            SubscriberName = insurance.SubscriberName,
                            InsurancePhone = insurance.InsurancePhone,
                            BillingType = insurance.BillingType,
                            SubscriberDateOfBirth = insurance.SubscriberDob,
                            AccidentType = insurance.AccidentType,
                            AccidentState = insurance.AccidentState,
                            AccidentDate = insurance.AccidentDate
                        })
                        .ToList() : null,
                     //PatientInsurances = new List<PatientInsurance>()
                     //{
                     //   new PatientInsurance()
                     //   {
                     //       //Insurance = Convert.ToInt32(s.TblPatientInsurances.First().InsuranceId),
                     //       //InsuranceProvider = Convert.ToInt32(s.TblPatientInsurances.First().InsuranceProviderId),
                     //       //GroupNumber = s.TblPatientInsurances.First().GroupNumber,
                     //       //PolicyNumber = s.TblPatientInsurances.First().PolicyId,
                     //       //SubscriberRelation = s.TblPatientInsurances.First().Srelation,
                     //       //SubscriberFirstName = s.TblPatientInsurances.First().Sfname,
                     //       //SubscriberLastName = s.TblPatientInsurances.First().Slname,
                     //       //SubscriberDateOfBirth = s.TblPatientInsurances.First().Sdob
                     //       Insurance = Convert.ToInt32(s.TblPatientInsurances.First().InsuranceId),
                     //       InsuranceProvider = Convert.ToInt32(s.TblPatientInsurances.First().InsuranceProviderId),
                     //       GroupNumber = s.TblPatientInsurances.First().PrimaryGroupId,
                     //       PolicyNumber = s.TblPatientInsurances.First().PrimaryPolicyId,
                     //       SubscriberRelation = s.TblPatientInsurances.First().RelationshipToInsured,
                     //       SubscriberName = s.TblPatientInsurances.First().SubscriberName,
                     //      //SubscriberLastName = s.TblPatientInsurances.First().Slname,
                     //       SubscriberDateOfBirth = s.TblPatientInsurances.First().SubscriberDob,
                     //       AccidentType= s.TblPatientInsurances.First().AccidentType,
                     //       AccidentState= s.TblPatientInsurances.First().AccidentState,
                     //           AccidentDate= s.TblPatientInsurances.First().AccidentDate,
                     //           BillingType =  s.TblPatientInsurances.First().BillingType,
                     //           InsurancePhone =  s.TblPatientInsurances.First().InsurancePhone
                     //               }
                     //}
                 }).FirstOrDefault(f => f.PatientId.Equals(id));
            if (patientById?.PatientInsurances != null)
            {
                foreach (var insurance in patientById.PatientInsurances)
                {
                    insurance.InsuranceName = _masterDbContext.TblInsuranceSetups.FirstOrDefault(f => f.InsuranceId == Convert.ToInt32(insurance.Insurance))?.InsuranceName;
                    insurance.InsuranceProviderName = _masterDbContext.TblInsuranceProviders.FirstOrDefault(f => f.InsuranceProviderId == Convert.ToInt32(insurance.InsuranceProvider))?.ProviderName;

                }
            }
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Processed Successfully !";
            response.Data = patientById;
            return response;
        }
        public DataQueryResponse<List<PatientResponseByFNameLnameAndDateOfBirthQM>> GetPatientByFNameLNameAndDateOfBirthAndFacilityId(PatientByFNameLnameAndDateOfBirthQM query)
        {
            var response = new DataQueryResponse<List<PatientResponseByFNameLnameAndDateOfBirthQM>>();

            #region Source
            var dataSource = (from PatientBasic in _applicationDb.TblPatientBasicInfos
                              join PatientAddress in _applicationDb.TblPatientAddInfos on PatientBasic.PatientId equals PatientAddress.PatientId
                              into PatientAddress
                              from PatientWithAddress in PatientAddress.DefaultIfEmpty()
                              join PatientInsurnce in _applicationDb.TblPatientInsurances on PatientBasic.PatientId equals PatientInsurnce.PatientId
                              into PatientPatientInsurance
                              from PatientWithPatientInsurance in PatientPatientInsurance.DefaultIfEmpty()
                              select new
                              {
                                  PatientBasicResult = PatientBasic,
                                  PatientAddressResult = PatientWithAddress,
                                  PatientInsurancerResult = PatientWithPatientInsurance
                              }).Select(s => new PatientResponseByFNameLnameAndDateOfBirthQM()
                              {
                                  Facility = Convert.ToInt32(s.PatientAddressResult.FacilityId),
                                  PatientId = s.PatientBasicResult.PatientId,
                                  FirstName = s.PatientBasicResult.FirstName,
                                  LastName = s.PatientBasicResult.LastName,
                                  DateOfBirth = s.PatientBasicResult.Dob,
                                  Gender = s.PatientBasicResult.Gender,
                                  Ethnicity = s.PatientBasicResult.Ethnicity,
                                  Race = s.PatientBasicResult.Race,
                                  PatientType = s.PatientBasicResult.PatientType,
                                  SocialSecurity = s.PatientBasicResult.SocialSecurityNumber,
                                  PassPort = s.PatientBasicResult.PassPortNumber,
                                  //PatientDLID = s.PatientBasicResult.Dlidnumber,
                                  Address1 = s.PatientAddressResult.Address1,
                                  ZipCode = s.PatientAddressResult.ZipCode,
                                  City = s.PatientAddressResult.City,
                                  State = s.PatientAddressResult.State,
                                  Country = s.PatientAddressResult.Country,
                                  //Phone = s.PatientAddressResult.LandPhone,
                                  Mobile = s.PatientAddressResult.Mobile,
                                  Email = s.PatientAddressResult.Email,
                                  Weight = s.PatientAddressResult.Weight.TrimEnd(),
                                  Height = s.PatientAddressResult.Height.TrimEnd()

                              }).ToList();
            #endregion
            #region Filter
            if (!string.IsNullOrEmpty(query.Filter))
            {
                dataSource = dataSource.Where(f => f.Facility == query.FacilityId && (f.FirstName != null && f.FirstName.Trim().ToLower().Contains(query.Filter.Trim().ToLower())
                || f.LastName != null && f.LastName.Trim().ToLower().Contains(query.Filter.Trim().ToLower()))).ToList();

                response.ResponseModel = dataSource;

            }

            //response.Total = dataSource.Count;
            #endregion
            response.Message = "Request Processed Successfully !";

            response.Status = HttpStatusCode.OK;
            response.Total = dataSource.Count;
            return response;
        }
        public async Task<RequestResponse<List<GetPatientsByFNameLNameResponse>>> GetPatientByFNameLNameWithInsuranceDetailAsync(PatientSearchByFNameLNameRequest request)
        {
            var response = new RequestResponse<List<GetPatientsByFNameLNameResponse>>();
            #region Source




           var searchQuery=string.IsNullOrEmpty(request.FirstName)?request.LastName:request.FirstName;

            IQueryable<TblPatientBasicInfo> SearchPatientBasicInfo;
            if(string.IsNullOrEmpty(request.FirstName))
                SearchPatientBasicInfo = _applicationDb.TblPatientBasicInfos.AsNoTracking().Where(x=>x.LastName.StartsWith(request.LastName) && x.FacilityId == request.FacilityId).AsQueryable();
            else
                SearchPatientBasicInfo = _applicationDb.TblPatientBasicInfos.Where(x => x.FirstName.StartsWith(request.FirstName) && x.FacilityId == request.FacilityId).AsQueryable();



            var patientsAllInfos = SearchPatientBasicInfo.Join(_applicationDb.TblPatientAddInfos,
                b => b.PatientId,
                a => a.PatientId,
                (PatientInfo, Address) => new { PatientInfo, Address }).Where(x => x.Address.FacilityId == request.FacilityId);




            var patientIds = patientsAllInfos.Select(x =>(int?) x.PatientInfo.PatientId).ToList();

            var insrunceInfo =await _applicationDb.TblPatientInsurances.AsNoTracking().Where(x => patientIds.Contains(x.PatientId)).ToListAsync();

            var finalPatintInfo = await patientsAllInfos.ToListAsync();

            var query= finalPatintInfo.Select(s => new GetPatientsByFNameLNameResponse()
            {
                PatientId = s.PatientInfo != null ? s.PatientInfo.PatientId : 0,
                FirstName = s.PatientInfo != null ? s.PatientInfo.FirstName : null,
                MiddleName = s.PatientInfo != null ? s.PatientInfo.MiddleName : null,
                LastName = s.PatientInfo != null ? s.PatientInfo.LastName : null,
                PatientType= s.PatientInfo != null ? s.PatientInfo.PatientType : null,
                DateOfBirth = s.PatientInfo != null ? s.PatientInfo.Dob : null,
                PhoneNumber = s.Address != null ? s.Address.Phone : null,
                MobileNumber = s.Address != null ? s.Address.Mobile : null,
                Email = s.Address != null ? s.Address.Email : null,
                Weight = s.Address != null ? s.Address.Weight : null,
                Height = s.Address != null ? s.Address.Height : null,
                Gender = s.PatientInfo != null ? s.PatientInfo.Gender : null,
                SocialSecurityNumber = s.PatientInfo != null ? s.PatientInfo.SocialSecurityNumber : null,
                Ethnicity = s.PatientInfo != null ? s.PatientInfo.Ethnicity : null,
                Race = s.PatientInfo != null ? s.PatientInfo.Race : null,
                PassportNumber = s.PatientInfo != null ? s.PatientInfo.PassPortNumber : null,
                DLIDNumber = s.PatientInfo != null ? s.PatientInfo.PatientDrivingOridnumber : null,
                Address1 = s.Address != null ? s.Address.Address1 : null,
                Address2 = s.Address != null ? s.Address.Address2 : null,
                ZipCode = s.Address != null ? s.Address.ZipCode : null,
                City = s.Address != null ? s.Address.City : null,
                State = s.Address != null ? s.Address.State : null,
                Country = s.Address != null ? s.Address.Country : null,
                County = s.Address != null ? s.Address.County : null,
                Insurances = s.PatientInfo?.PatientId == null ? null : insrunceInfo.Where(f => f.PatientId == s.PatientInfo.PatientId).Select(s => new PatientIns()
                {

                    BillingType = s.BillingType,
                    RelationshipToInsured = s.RelationshipToInsured,
                    InsuranceProviderId = s.InsuranceProviderId,
                    PrimaryPolicyId = s.PrimaryPolicyId,
                    PrimaryGroupId = s.PrimaryGroupId,
                    InsurancePhone = s.InsurancePhone,
                    SubscriberDob = s.SubscriberDob,
                    SubscriberName = s.SubscriberName,
                    AccidentDate = s.AccidentDate,
                    AccidentState = s.AccidentState,
                    AccidentType = s.AccidentType
                }).ToList()

                }).ToList();





















            //var patientsInfo = _applicationDb.TblPatientBasicInfos.Where(f =>
            //(
            //    !string.IsNullOrEmpty(request.FirstName) && !string.IsNullOrEmpty(request.LastName)
            //    ? f.FirstName.Trim().ToLower().StartsWith(request.FirstName) && f.LastName.Trim().ToLower().StartsWith(request.LastName)
            //    : !string.IsNullOrEmpty(request.FirstName) ? f.FirstName.Trim().ToLower().StartsWith(request.FirstName)
            //    : f.LastName.Trim().ToLower().StartsWith(request.LastName)
            //));
            #endregion
            //var query = await (from patients in patientsInfo
            //                   join PatAddress in _applicationDb.TblPatientAddInfos on patients.PatientId equals PatAddress.PatientId

            //                   into PatientWithAddress
            //                   from PatWithAddr in PatientWithAddress.DefaultIfEmpty()
            //                   join PatientIns in _applicationDb.TblPatientInsurances on patients.PatientId equals PatientIns.PatientId
            //                   into PatientInsurance
            //                   from PatientIns in PatientInsurance.DefaultIfEmpty()
            //               //    where PatientWithAddress.FacilityId == request.FacilityId
            //                   select
            //                   new
            //                   {
            //                       PatientInfo = patients,
            //                       Address = PatWithAddr,
            //                       Insurance = PatientInsurance

            //                   }).Select(s => new GetPatientsByFNameLNameResponse()
            //                   {
            //                       PatientId = s.PatientInfo != null ? s.PatientInfo.PatientId : 0,
            //                       FirstName = s.PatientInfo != null ? s.PatientInfo.FirstName : null,
            //                       MiddleName = s.PatientInfo != null ? s.PatientInfo.MiddleName : null,
            //                       LastName = s.PatientInfo != null ? s.PatientInfo.LastName : null,
            //                       DateOfBirth = s.PatientInfo != null ? s.PatientInfo.Dob : null,
            //                       PhoneNumber = s.Address != null ? s.Address.Phone : null,
            //                       MobileNumber = s.Address != null ? s.Address.Mobile : null,
            //                       Email = s.Address != null ? s.Address.Email : null,
            //                       Weight = s.Address != null ? s.Address.Weight : null,
            //                       Height = s.Address != null ? s.Address.Height : null,
            //                       Gender = s.PatientInfo != null ? s.PatientInfo.Gender : null,
            //                       SocialSecurityNumber = s.PatientInfo != null ? s.PatientInfo.SocialSecurityNumber : null,
            //                       Ethnicity = s.PatientInfo != null ? s.PatientInfo.Ethnicity : null,
            //                       Race = s.PatientInfo != null ? s.PatientInfo.Race : null,
            //                       PassportNumber = s.PatientInfo != null ? s.PatientInfo.PassPortNumber : null,
            //                       DLIDNumber = s.PatientInfo != null ? s.PatientInfo.PatientDrivingOridnumber : null,
            //                       Address1 = s.Address != null ? s.Address.Address1 : null,
            //                       Address2 = s.Address != null ? s.Address.Address2 : null,
            //                       ZipCode = s.Address != null ? s.Address.ZipCode : null,
            //                       City = s.Address != null ? s.Address.City : null,
            //                       State = s.Address != null ? s.Address.State : null,
            //                       Country = s.Address != null ? s.Address.Country : null,
            //                       County = s.Address != null ? s.Address.County : null,
            //                       Insurances = _applicationDb.TblPatientInsurances.Where(f => f.PatientId == s.PatientInfo.PatientId).Select(s => new PatientIns()
            //                       {

            //                        BillingType =s.BillingType,
            //                        RelationshipToInsured =s.RelationshipToInsured,
            //                        InsuranceProviderId =s.InsuranceProviderId,
            //                        PrimaryPolicyId =s.PrimaryPolicyId,
            //                        PrimaryGroupId =s.PrimaryGroupId,
            //                        InsurancePhone =s.InsurancePhone,
            //                        SubscriberDob =s.SubscriberDob,
            //                        SubscriberName =s.SubscriberName,
            //                        AccidentDate =s.AccidentDate,
            //                        AccidentState =s.AccidentState,
            //                        AccidentType =s.AccidentType
            //                       }).ToList()

            //                   }).ToListAsync();
            response.Data = query;
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Processed Successfully...";

            return response;
        }
        #endregion
        #region Lookups
        #endregion
    }


}

