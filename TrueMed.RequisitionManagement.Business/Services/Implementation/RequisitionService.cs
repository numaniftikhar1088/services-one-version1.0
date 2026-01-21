using AutoMapper;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Org.BouncyCastle.Ocsp;
using System.Data;
using System.Net;
using System.Transactions;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Extensions;
using TrueMed.Domain.Helpers.ExtentionData;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Internal;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel.Base;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Response;
using TrueMed.RequisitionManagement.Domain.Models.ResponseModel;

using static TrueMed.RequisitionManagement.Domain.Models.Dtos.Response.RequisitionResponse;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Common;

namespace TrueMed.RequisitionManagement.Business.Services.Implementation
{
    public class RequisitionService : IRequisitionService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IMapper _mapper;

        private ApplicationDbContext _appContext;
        private MasterDbContext _masterContext;
        private readonly IBlobStorageManager _blobStorageManager;
     private   IDapperManager _dapperManager;
        public RequisitionService(
            IConnectionManager connectionManager,
            MasterDbContext masterContext,
            IMapper mapper,IDapperManager dapperManager,IBlobStorageManager blobStorageManager)
        {
            _connectionManager = connectionManager;
            _masterContext = masterContext;
            _appContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            _mapper = mapper;
            _dapperManager = dapperManager;
            _blobStorageManager = blobStorageManager;
        }
        public RequestResponse AddNewProvider(RequisitionRequest.AddNewProvider request)
        {
            var response = new RequestResponse();

            var tblUserObj = _mapper.Map<TrueMed.Sevices.MasterEntities.TblUser>(request);
            var tblUserAdditionalInfoObj = _mapper.Map<TrueMed.Sevices.MasterEntities.TblUserAdditionalInfo>(request);

            _masterContext.TblUsers.Add(tblUserObj);

            tblUserAdditionalInfoObj.UserId = tblUserObj.Id;
            _masterContext.TblUserAdditionalInfos.Add(tblUserAdditionalInfoObj);

            var ack = _masterContext.SaveChanges();
            if (ack > 0)
            {
                response.Message = "New Provider Added !";
                response.Status = "Success";
                response.HttpStatusCode = TrueMed.Domain.Model.Identity.Status.Success;
            }
            return response;
        }
    
        
        public SectionPlusControlsWithValue GetControlsWithValueByReqIdForEdit(int reqId)
        {
            var resposne = new SectionPlusControlsWithValue();
            #region Data Sources
            var tblReqMaster = _appContext.TblRequisitionMasters.Where(f => f.RequisitionId == reqId);
            var tblReqRecordInfo = _appContext.TblRequisitionOrders.Where(f => f.RequisitionId == reqId);
            #endregion
            var queryResult = (from reqMstr in tblReqMaster
                               join reqRecordInfo in tblReqRecordInfo on reqMstr.RequisitionId equals reqRecordInfo.RequisitionId
                               into reqMstrreqRecordInfo
                               from reqMstrPlusreqRecordInfo in reqMstrreqRecordInfo.DefaultIfEmpty()
                               select new
                               {
                                   ReqMasterInfo = reqMstr,
                                   ReqRecordInfo = reqMstrPlusreqRecordInfo
                               }).Select(s => new GetReqByReqIdForEdit()
                               {
                                   FacilityId = s.ReqMasterInfo != null ? s.ReqMasterInfo.FacilityId : 0,
                                   PhysicianId = s.ReqMasterInfo != null ? s.ReqMasterInfo.PhysicianId : "",
                                   OrderType = s.ReqMasterInfo != null ? s.ReqMasterInfo.OrderType : "",
                                   DateofCollection = s.ReqMasterInfo != null ? s.ReqMasterInfo.DateofCollection : null,
                                   TimeofCollection = s.ReqMasterInfo != null ? s.ReqMasterInfo.TimeofCollection : null,
                                   DateReceived = s.ReqMasterInfo != null ? s.ReqMasterInfo.DateReceived : null,
                                   Mileage = s.ReqMasterInfo != null ? s.ReqMasterInfo.Mileage : "",
                                   CollectorId = s.ReqMasterInfo != null ? s.ReqMasterInfo.CollectorId : "",
                                   CollectedBy = s.ReqMasterInfo != null ? s.ReqMasterInfo.CollectedBy : "",
                                   StatOrder = s.ReqMasterInfo != null ? s.ReqMasterInfo.StatOrder : "",
                                   FirstName = s.ReqMasterInfo != null ? s.ReqMasterInfo.FirstName : "",
                                   LastName = s.ReqMasterInfo != null ? s.ReqMasterInfo.LastName : "",
                                   Dob = s.ReqMasterInfo != null ? s.ReqMasterInfo.Dob : null,
                                   Gender = s.ReqMasterInfo != null ? s.ReqMasterInfo.Gender : "",
                                   Address1 = s.ReqMasterInfo != null ? s.ReqMasterInfo.Address1 : "",
                                   Address2 = s.ReqMasterInfo != null ? s.ReqMasterInfo.Address2 : "",
                                   ZipCode = s.ReqMasterInfo != null ? s.ReqMasterInfo.ZipCode : "",
                                   City = s.ReqMasterInfo != null ? s.ReqMasterInfo.City : "",
                                   State = s.ReqMasterInfo != null ? s.ReqMasterInfo.State : "",
                                   Country = s.ReqMasterInfo != null ? s.ReqMasterInfo.Country : "",
                                   County = s.ReqMasterInfo != null ? s.ReqMasterInfo.County : "",
                                   Email = s.ReqMasterInfo != null ? s.ReqMasterInfo.Email : "",
                                   Phone = s.ReqMasterInfo != null ? s.ReqMasterInfo.Phone : "",
                                   Mobile = s.ReqMasterInfo != null ? s.ReqMasterInfo.Mobile : "",
                                   Race = s.ReqMasterInfo != null ? s.ReqMasterInfo.Race : "",
                                   Ethnicity = s.ReqMasterInfo != null ? s.ReqMasterInfo.Ethnicity : "",
                                   SocialSecurity = s.ReqMasterInfo != null ? s.ReqMasterInfo.SocialSecurityNumber : "",
                                   //PatientDlId = s.ReqMasterInfo != null ? s.ReqMasterInfo.PatientDlId : "",
                                   PassPort = s.ReqMasterInfo != null ? s.ReqMasterInfo.PassPortNumber : "",
                                   PatientType = s.ReqMasterInfo != null ? s.ReqMasterInfo.PatientType : "",
                                   Height = s.ReqMasterInfo != null ? s.ReqMasterInfo.Height : "",
                                   Weight = s.ReqMasterInfo != null ? s.ReqMasterInfo.Weight : "",


                               }).FirstOrDefault();

            var sectionPlusControlsWithValueListObj = new SectionPlusControlsWithValue();

            foreach (var property in typeof(GetReqByReqIdForEdit).GetProperties())
            {
                var controlName = property.Name.ToLower();
                var controlId = _masterContext.TblControls.FirstOrDefault(f => f.ControlKey.Trim().ToLower() == controlName)?.Id;
                var controlValue = queryResult.GetPropertyValue(property.Name);
                var sectionId = _masterContext.TblSectionControls.FirstOrDefault(f => f.ControlId == controlId)?.SectionId;
                var sectionName = _masterContext.TblSections.FirstOrDefault(f => f.Id == sectionId)?.SectionName;

                var controlWithValueObj = new ControlWithValue();
                controlWithValueObj.ControlId = Convert.ToInt32(controlId);
                controlWithValueObj.ControlName = controlName;
                controlWithValueObj.Value = controlValue;

                var sectionWithControlObj = new SectionWithControls();
                sectionWithControlObj.SectionId = Convert.ToInt32(sectionId);
                sectionWithControlObj.SectionName = sectionName;
                sectionWithControlObj?.Controls?.Add(controlWithValueObj);

                if (sectionPlusControlsWithValueListObj.SectionWithControlInfo.Any(a => a.SectionId == sectionId))
                {
                    var alreadyPresentSectionValue = sectionPlusControlsWithValueListObj.SectionWithControlInfo.Find(f => f.SectionId == sectionId);
                    var alreadyPresentSectionIndex = sectionPlusControlsWithValueListObj.SectionWithControlInfo.FindIndex(f => f.SectionId == sectionId);
                    if (alreadyPresentSectionIndex > -1)
                    {
                        alreadyPresentSectionValue.Controls.Add(controlWithValueObj);
                        sectionPlusControlsWithValueListObj.SectionWithControlInfo[alreadyPresentSectionIndex] = alreadyPresentSectionValue;
                    }
                }
                else
                { sectionPlusControlsWithValueListObj?.SectionWithControlInfo?.Add(sectionWithControlObj); }
            }
            resposne = sectionPlusControlsWithValueListObj;
            return resposne;
        }
    
        public RequestResponse<SaveRequisitionResponse> SubmitRequisition(SaveRequisitionRequest request)
        {
            var response = new RequestResponse<SaveRequisitionResponse>();
            response.Data = new SaveRequisitionResponse();
            TblRequisitionMaster masterReq= new TblRequisitionMaster();
            TblPatientBasicInfo patient = new  TblPatientBasicInfo ();
           List<TblRequisitionPatientInsurance> patientInslst = new List<TblRequisitionPatientInsurance>();
            TblPatientLoginUser patLoginUser    = new TblPatientLoginUser();
            TblPatientAddInfo patAdressinfo = new TblPatientAddInfo();
            List<TblRequisitionFile> files = new List<TblRequisitionFile>();
          
            //TblPatientAddInfo
            if (request.RequisitionId != 0)
            {
                masterReq = _appContext.TblRequisitionMasters.FirstOrDefault(x => x.RequisitionId == request.RequisitionId);
                if (masterReq == null)
                {
                    response.Status = "Requisition Not Found";
                    response.HttpStatusCode = (TrueMed.Domain.Model.Identity.Status)HttpStatusCode.NotFound;
                    return response;
                }
            }
            if (masterReq.PatientId.HasValue && masterReq.PatientId.Value != 0)
            {

                patient = _appContext.TblPatientBasicInfos.FirstOrDefault(x => x.PatientId == masterReq.PatientId.Value);
            }
          


            foreach (var req in request.Requisitions)
            {


                if (req.ReqId == 0)
                {
                    var reqSections = req.reqSections.ToList();
                    var lst = SaveCommonSection(ref masterReq, ref patient, reqSections, request.Action, ref patientInslst, ref patLoginUser, ref patAdressinfo,ref files);

                    patLoginUser = GetPatientLoginInfo(patLoginUser);
                    patient.PatientUserId = Convert.ToString(patLoginUser?.PatientLoginId);

                    if (patient.PatientId > 0)
                    {
                        var existingPatient = _appContext.TblPatientBasicInfos.AsNoTracking().FirstOrDefault(x => x.PatientId == patient.PatientId);
                        if(existingPatient!=null)
                        SetValueInObject.UpdateObjectProperties<TblPatientBasicInfo>(existingPatient,ref patient);

                    }
                    //var existingPatient=_appContext.TblPatientBasicInfos.


                    if (patient.PatientId == 0)
                    {
                        patient.CreatedDate = DateTime.UtcNow;
                        patient.UpdatedDate = DateTime.UtcNow;
                        patient.CreatedBy = _connectionManager.UserId;
                        patient.UpdatedBy = _connectionManager.UserId;                        
                        _appContext.TblPatientBasicInfos.Add(patient);

                    }
                  //  else if (request.RequisitionId > 0 && request.IsPatientInfoChanged)
                  else
                    {
                        patient.UpdatedDate = DateTime.UtcNow;
                        patient.UpdatedBy = _connectionManager.UserId;
                        // _appContext.TblPatientBasicInfos.Add(patient);
                        _appContext.TblPatientBasicInfos.Update(patient);
                    }
                    _appContext.SaveChanges();
                    response.Data.FirstName = patient?.FirstName;
                    response.Data.LastName = patient?.LastName;
                    patAdressinfo = SavePateintAddressInformation(patAdressinfo, patient.PatientId);






                    // convert Patient Signature 
                    masterReq.PatientSignature = string.IsNullOrEmpty(masterReq.PatientSignature) ? "" : _blobStorageManager.UploadBase64ToAzureAsync(masterReq.PatientSignature,$"{masterReq.FirstName}_{masterReq.LastName}_PatientSignature",_connectionManager).GetAwaiter().GetResult();
                    masterReq.PhysicianSignature = string.IsNullOrEmpty(masterReq.PhysicianSignature) ? "" : _blobStorageManager.UploadBase64ToAzureAsync(masterReq.PhysicianSignature, $"{masterReq.FirstName}_{masterReq.LastName}PhysicianSignature",_connectionManager).GetAwaiter().GetResult();
                    masterReq.PatientId = patient.PatientId;
                    masterReq.UpdatedDate = DateTime.UtcNow;
                    masterReq.UpdatedBy = _connectionManager.UserId;
                    if (request.Action.ToLower().Trim() == "saveForLater".ToLower().Trim()
                        || request.Action.ToLower().Trim() == "saveForSignature".ToLower().Trim()
                        )
                    {
                        masterReq.MissingColumns =string.Join(", ",request.MissingFields);
                    }
                    if (request.RequisitionId == 0)
                    {
                        masterReq.CreatedBy = _connectionManager.UserId;
                        masterReq.CreatedDate = DateTime.UtcNow;

                        if (request.Action.ToLower().Trim() == "saveForSignature".ToLower().Trim())
                            masterReq.RequisitionStatus = 6;
                        else
                            masterReq.RequisitionStatus = 1;
                       // need to implement the logic for Requisition status flow.
                        _appContext.TblRequisitionMasters.Add(masterReq);
                        _appContext.SaveChanges();
                        masterReq.OrderNumber = $"TM{DateTime.UtcNow.ToString("yyMMdd")}{(masterReq.RequisitionId).ToString().PadLeft(4, '0')}";
                        _appContext.TblRequisitionMasters.Update(masterReq);
                        _appContext.SaveChanges();
                        request.RequisitionId = masterReq.RequisitionId;
                    }
                    else
                    {
                        _appContext.TblRequisitionMasters.Update(masterReq);
                    }
                    response.Data.OrderNo = masterReq.OrderNumber;
                    response.Data.RequisitionID = masterReq.RequisitionId;
                    SaveRequisitionAdditionInformation(lst, masterReq, req, null);
                    SaveRequisitionInsurance(ref patientInslst, masterReq);
                    SaveRequisitionFiles(ref masterReq, files);

                }
                else
                {
                    var reqOrder = _appContext.TblRequisitionOrders.FirstOrDefault(x => x.ReqTypeId == req.ReqId && x.RequisitionId == masterReq.RequisitionId);
                    if(reqOrder == null)
                    {
                        reqOrder= _appContext.TblRequisitionOrders.FirstOrDefault(x =>  x.RequisitionId == masterReq.RequisitionId && x.WorkFlowStatus== "17");
                    }

                    var reqDrugAllergies = new List<TblRequisitionDrugAllergyCode>();
                    var specimenInfo = new TblRequisitionSpecimensInfo();
                    var icds = new List<TblRequisitionIcd10code>();
                    var panels = new List<Panel>();



                    if (reqOrder == null)
                    {
                        reqOrder = new TblRequisitionOrder();
                        reqOrder.RequisitionId = masterReq.RequisitionId;
                        reqOrder.RecordId = masterReq.OrderNumber.Replace("TM", "ID");
                        reqOrder.CreatedBy = _connectionManager.UserId;
                        reqOrder.CreatedDate = DateTime.Now;
                        reqOrder.DateReceived = masterReq.DateReceived;
                        reqOrder.FacilityId = masterReq.FacilityId;
                        reqOrder.ReqTypeId = req.ReqId;

                        //if (_connectionManager.IsFacilityUser)
                        //{
                        //    reqOrder.WorkFlowStatus = "1";
                        //    reqOrder.Lisstatus = "1";
                        //}
                        //else
                        //{
                        //    // for blanks Creation
                        //    var parm = new DynamicParameters();
                        //    //parm.Add("@FacilityId", request.FacilityId, dbType: DbType.Int32);
                        //    //parm.Add("@ReqTypeId",labinfoassignment?.ReqTypeId, dbType: DbType.Int32);

                        //    // var dbPanelsResults = _dapperManager.SP_Execute<SpPanel>("[dbo].[sp_GetCompendiumbyFacilityIDbyReqID]", parm).GetAwaiter().GetResult().ToList();

                        //    parm.Add("@RequisitionOrderID", reqOrder.RequisitionOrderId, dbType: DbType.Int32);

                        //    var dbPanelsResults = _dapperManager.SP_ExecuteNoReturnAsync("[dbo].[sp_InsertIDBlanks]", parm).GetAwaiter().GetResult();

                        //    reqOrder.WorkFlowStatus = "3";
                        //    reqOrder.Lisstatus = "1";
                        //}
                        _appContext.TblRequisitionOrders.Add(reqOrder);
                        _appContext.SaveChanges();
                    }




                    var lst = SaveRequisitionSections(req, ref masterReq, ref reqOrder, ref reqDrugAllergies, ref specimenInfo, ref icds, ref panels);

                    if(request.Action.ToLower().Trim()== "saveForLater".ToLower())                    
                        reqOrder.WorkFlowStatus = "17";
                    else if (request.Action.ToLower().Trim() == "saveForSignature".ToLower().Trim())
                        reqOrder.WorkFlowStatus = "9";

                    _appContext.TblRequisitionOrders.Update(reqOrder);

                    // delete Old drug Allergies
                    var oldAllergies = _appContext.TblRequisitionDrugAllergyCodes.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
                    if (oldAllergies.Count > 0)
                        _appContext.TblRequisitionDrugAllergyCodes.RemoveRange(oldAllergies);
                    // save drug allergies
                    _appContext.TblRequisitionDrugAllergyCodes.AddRange(reqDrugAllergies);


                    // delete Existing Specimen for Update

                    var oldSpecimen = _appContext.TblRequisitionSpecimensInfos.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
                    if (oldSpecimen.Count > 0)
                        _appContext.TblRequisitionSpecimensInfos.RemoveRange(oldSpecimen);

                    // save New specimenInformation
                    specimenInfo.CreatedDate = DateTime.UtcNow;
                    specimenInfo.CreatedBy = _connectionManager.UserId;
                    specimenInfo.RequisitionOrderId = reqOrder.RequisitionOrderId;
                    specimenInfo.RequisitionId = masterReq.RequisitionId;
                    specimenInfo.ReqTypeId = req.ReqId;


                    _appContext.TblRequisitionSpecimensInfos.Add(specimenInfo);
                    // Delete Old Icds
                    var oldIcds = _appContext.TblRequisitionIcd10codes.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
                    if (oldIcds.Count > 0)
                        _appContext.TblRequisitionIcd10codes.RemoveRange(oldIcds);
                    // save icds
                    _appContext.TblRequisitionIcd10codes.AddRange(icds);
                    // save Panels
                    _appContext.SaveChanges();
                    SavePanelAndTestInformation(panels, masterReq, reqOrder);
                    SaveRequisitionAdditionInformation(lst, masterReq, req, reqOrder);





                    if (_connectionManager.IsFacilityUser)
                    {
                        reqOrder.WorkFlowStatus = "2";
                        reqOrder.Lisstatus = "1";
                    }
                    else
                    {
                        // for blanks Creation
                        var parm = new DynamicParameters();
                        //parm.Add("@FacilityId", request.FacilityId, dbType: DbType.Int32);
                        //parm.Add("@ReqTypeId",labinfoassignment?.ReqTypeId, dbType: DbType.Int32);

                        // var dbPanelsResults = _dapperManager.SP_Execute<SpPanel>("[dbo].[sp_GetCompendiumbyFacilityIDbyReqID]", parm).GetAwaiter().GetResult().ToList();

                        parm.Add("@RequisitionOrderID", reqOrder.RequisitionOrderId, dbType: DbType.Int32);

                        var dbPanelsResults = _dapperManager.SP_ExecuteNoReturnAsync("[dbo].[sp_InsertIDBlanks]", parm).GetAwaiter().GetResult();

                        if (request.Action.ToLower().Trim() == "saveForLater".ToLower())
                            reqOrder.WorkFlowStatus = "17";
                        else if (request.Action.ToLower().Trim() == "saveForSignature".ToLower().Trim())
                            reqOrder.WorkFlowStatus = "9";
                        else
                        {
                            reqOrder.WorkFlowStatus = "5";
                            reqOrder.Lisstatus = "1";
                        }
                    }

                    _appContext.TblRequisitionOrders.Update(reqOrder);
                    _appContext.SaveChanges();





                }

            }

            // for mission info incase no requisition is selected
            if (request.Requisitions.Count < 2)
            {
                var reqOrder = _appContext.TblRequisitionOrders.FirstOrDefault(x => x.RequisitionId == masterReq.RequisitionId);
                if (reqOrder == null)
                {
                    reqOrder = new TblRequisitionOrder();
                    reqOrder.RequisitionId = masterReq.RequisitionId;
                    reqOrder.LabId = _connectionManager.GetLabId()??0;
                    reqOrder.RecordId = masterReq.OrderNumber.Replace("TM", "ID");
                    reqOrder.CreatedBy = _connectionManager.UserId;
                    reqOrder.CreatedDate = DateTime.UtcNow;
                    reqOrder.WorkFlowStatus = "17";
                    reqOrder.DateReceived = masterReq.DateReceived;
                    reqOrder.FacilityId = masterReq.FacilityId;

                    _appContext.TblRequisitionOrders.Add(reqOrder);
                }
                _appContext.SaveChanges();
            }


            response.Data.Status = "200";
            response.HttpStatusCode = Status.Success;
            return response;
        }

        private void SaveRequisitionFiles(ref TblRequisitionMaster masterReq, List<TblRequisitionFile> files)
        {

            var typeofFiles = files.Select(x => x.TypeOfFile).Distinct().ToList();
            var OldFIles = _appContext.TblRequisitionFiles.Where(x => typeofFiles.Contains(x.TypeOfFile)).ToList();
            foreach (var oldfile in OldFIles) {
                oldfile.IsDeleted = true;
                oldfile.DeletedDate = DateTime.UtcNow;
                oldfile.UpdatedBy = _connectionManager.UserId;                
            }
            _appContext.TblRequisitionFiles.UpdateRange(OldFIles);
            foreach (var reqFile in files)
            {
                reqFile.RequisitionId = masterReq.RequisitionId;
                reqFile.RequisitionOrderId = 0;
                reqFile.UpdatedDate = DateTime.UtcNow;
                reqFile.CreatedDate= DateTime.UtcNow;
                reqFile.CreatedBy = _connectionManager.UserId;
                reqFile.UpdatedBy=_connectionManager.UserId;
                reqFile.SystemGenerated = false;
                _appContext.TblRequisitionFiles.Add(reqFile);
            }
            _appContext.SaveChanges();
        }

        private void SavePanelAndTestInformation(List<Panel> panels,  TblRequisitionMaster masterReq,  TblRequisitionOrder reqOrder)
        {
            if(panels.Count>0)
            {
                var oldPanels = _appContext.TblRequisitionPanels.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
                if (oldPanels.Count > 0)
                    _appContext.TblRequisitionPanels.RemoveRange(oldPanels);

                var oldTests = _appContext.TblRequisitionTests.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
                if (oldTests.Count > 0)
                    _appContext.TblRequisitionTests.RemoveRange(oldTests);
            }
            foreach (var panel in panels.Where(x=>x.IsSelected==true).ToList())
            {
                var p = new TblRequisitionPanel();
                p.PanelId = Convert.ToInt32(panel.PanelID);
                p.RequisitionOrderId = reqOrder.RequisitionOrderId;
                p.ReqTypeId = reqOrder.ReqTypeId;
                p.RequisitionId = masterReq.RequisitionId;
                p.PanelName=panel.PanelName;
                var tests = panel.TestOptions.Where(x=>x.IsSelected==true).ToList();
                _appContext.TblRequisitionPanels.Add(p);
                foreach (var test in tests)
                {

                    var t = new TblRequisitionTest();
                    t.RequisitionOrderId = reqOrder.RequisitionOrderId;
                    t.RequisitionId = masterReq.RequisitionId;
                    t.ReqTypeId= reqOrder.ReqTypeId;
                    t.PanelId = p.PanelId;
                    t.TestName = test.TestName;
                    t.TestId = Convert.ToInt32(test.TestID);
                    _appContext.TblRequisitionTests.Add(t);
                }
            }
            _appContext.SaveChanges();


        }

        private void SaveRequisitionInsurance(ref List<TblRequisitionPatientInsurance> patientInslst, TblRequisitionMaster masterReq)
        {
            var existingSavedIns = _appContext.TblRequisitionPatientInsurances.Where(x => x.RequisitionId == masterReq.RequisitionId).ToList();
            if (existingSavedIns.Count > 0)
                _appContext.TblRequisitionPatientInsurances.RemoveRange(existingSavedIns);
            var SecondryCount = 0;
            foreach (var ins in patientInslst)
            {

                var a = new TblRequisitionPatientInsurance();
                a.SubscriberDob = ins.SubscriberDob;
                a.SubscriberName = ins.SubscriberName;
                a.InsurancePhone = ins.InsurancePhone;
                a.InsuranceProviderId = ins.InsuranceProviderId;
                a.InsuranceId = ins.InsuranceId;
                a.PrimaryGroupId = ins.PrimaryGroupId;
                a.PrimaryPolicyId = ins.PrimaryPolicyId;
                a.RequisitionId = masterReq.RequisitionId;
                a.RelationshipToInsured = ins.RelationshipToInsured;
                a.AccidentDate = ins.AccidentDate;
                a.AccidentState = ins.AccidentState;
                a.AccidentType = ins.AccidentType;
                a.SubscriberDob = ins.SubscriberDob;
                a.PatientId = masterReq.PatientId;
                a.BillingType = ins.BillingType;
                a.CreatedBy = _connectionManager.UserId;
                a.CreatedDate = DateTime.UtcNow;                
                _appContext.TblRequisitionPatientInsurances.Add(a);//

                // saving insurance for AutoComplete
                bool insExist = true;
                var pi = _appContext.TblPatientInsurances.FirstOrDefault(x => x.PatientInsuranceId == masterReq.PatientId && x.InsuranceProviderId == ins.InsuranceProviderId);
                if (pi == null)
                {
                    pi = new TblPatientInsurance();
                    insExist = false;
                }
                
                pi.SubscriberDob = ins.SubscriberDob;
                pi.SubscriberName = ins.SubscriberName;
                pi.InsurancePhone = ins.InsurancePhone;
                pi.InsuranceProviderId = ins.InsuranceProviderId;
                pi.InsuranceId = ins.InsuranceId;
                pi.PrimaryGroupId = ins.PrimaryGroupId;
                pi.PrimaryPolicyId = ins.PrimaryPolicyId;                
                pi.RelationshipToInsured = ins.RelationshipToInsured;
                pi.AccidentDate = ins.AccidentDate;
                pi.AccidentState = ins.AccidentState;
                pi.AccidentType = ins.AccidentType;
                pi.SubscriberDob = ins.SubscriberDob;
                pi.PatientId = masterReq.PatientId;
                pi.BillingType = ins.BillingType;

                if (!insExist)
                {
                    pi.CreatedBy = _connectionManager.UserId;
                    pi.CreatedDate = DateTime.UtcNow;
                    _appContext.TblPatientInsurances.Add(pi);
                }//
                else
                {
                    pi.UpdatedBy = _connectionManager.UserId;
                    pi.UpdatedDate = DateTime.UtcNow;
                    _appContext.TblPatientInsurances.Update(pi);//
                }

            }
            _appContext.SaveChanges();

        }

        private TblPatientAddInfo SavePateintAddressInformation(TblPatientAddInfo patAdressinfo, int patientId)
        {
            if (patientId == 0)
                return new TblPatientAddInfo();
            var existingRecordToBeDeleted = _appContext.TblPatientAddInfos.Where(x => x.PatientId == patientId).ToList();
            if (existingRecordToBeDeleted.Count > 0)
                _appContext.TblPatientAddInfos.RemoveRange(existingRecordToBeDeleted);

            patAdressinfo.PatientId = patientId;
            _appContext.TblPatientAddInfos.Add(patAdressinfo);
            _appContext.SaveChanges();
            return patAdressinfo;
        }

        private TblPatientLoginUser GetPatientLoginInfo(TblPatientLoginUser patLoginUser)
        {

            if (!(!string.IsNullOrEmpty(patLoginUser.Email) || !string.IsNullOrEmpty(patLoginUser.Mobile)))
                return new TblPatientLoginUser();

            var patientLogUser = _appContext.TblPatientLoginUsers.FirstOrDefault(x => (x.Email ?? "").ToLower().Trim().Equals(patLoginUser.Email)
             || (x.Mobile ?? "").ToLower().Trim().Equals(patLoginUser.Mobile)
             );
            if (patientLogUser != null)
                return patientLogUser;
            patLoginUser.UpdatedDate = DateTime.UtcNow;
            patLoginUser.UpdatedBy = _connectionManager.UserId;
            _appContext.TblPatientLoginUsers.Add(patLoginUser);
            _appContext.SaveChanges();
            return patLoginUser;




        }

        private List<TblRequisitionAddInfo> SaveCommonSection(ref TblRequisitionMaster masterReq, ref TblPatientBasicInfo patient, List<ReqSections> reqSections, string action, ref List<TblRequisitionPatientInsurance> patientInslst, ref TblPatientLoginUser patLoginUser, ref TblPatientAddInfo patAdressinfo, ref List<TblRequisitionFile> files)
        {

            var lst = new List<TblRequisitionAddInfo>();
            foreach (var section in reqSections)
            {
                System.Diagnostics.Debug.WriteLine(section.SectionName);

                TblRequisitionPatientInsurance patientIns = null;
                if (section.SectionId == 5)
                    patientIns = new TblRequisitionPatientInsurance();

                foreach (var field in section.Fields)
                {

                    System.Diagnostics.Debug.WriteLine(field.SystemFieldName);
                    if (field.FieldType == SectionType.SystemFields)
                    {
                        

                        if (section.SectionId == 5)
                        {

                            if (field.SystemFieldName == "PhotosForInsuranceCard" || field.SystemFieldName == "PhotoForDemographicInfo")
                            {

                                var filelst = JsonConvert.DeserializeObject<List<RequisitionFileViewModel>>(field.FieldValue);

                                foreach (var f in filelst)
                                {
                                    var reqFile = new TblRequisitionFile();
                                    reqFile.FileName=f.FileName;
                                    reqFile.FileUrl=f.FileUrl;
                                    reqFile.TypeOfFile = field.SystemFieldName == "PhotosForInsuranceCard" ? "Insurance Image" : "Demographic Image";

                                    files.Add(reqFile);

                                }
                               



                                continue;
                            }
                            SetValueInObject.SaveValue<TblRequisitionPatientInsurance>(ref patientIns, field.SystemFieldName, field.FieldValue);
                            continue;
                        }
                        SetValueInObject.SaveValue<TblPatientAddInfo>(ref patAdressinfo, field.SystemFieldName, field.FieldValue);
                        SetValueInObject.SaveValue<TblPatientLoginUser>(ref patLoginUser, field.SystemFieldName, field.FieldValue);
                        SetValueInObject.SaveValue<TblRequisitionMaster>(ref masterReq, field.SystemFieldName, field.FieldValue);
                        SetValueInObject.SaveValue<TblPatientBasicInfo>(ref patient, field.SystemFieldName, field.FieldValue);

                    }
                    else
                    {
                        var a = new TblRequisitionAddInfo();
                        a.ReqTypeId = 0;
                        a.SectionId = section.SectionId;
                        a.ControlId = field.ControlId;
                        SetValueInObject.SaveValue<TblRequisitionAddInfo>(ref a, "ControlValue", field.FieldValue);// for saving value in object
                        a.KeyId = field.SystemFieldName;
                        a.KeyValue = field.DisplayName;
                        lst.Add(a);

                    }


                }


                if (patientIns != null)
                {
                    patientInslst.Add(patientIns);
                    patientIns = null;
                }



            }




            return lst;


        }

        private void SaveRequisitionAdditionInformation(List<TblRequisitionAddInfo> lst, TblRequisitionMaster masterReq, RequistionType req, TblRequisitionOrder reqOrder)
        {

            var reqorderID = reqOrder == null ? 0 : reqOrder.RequisitionOrderId;


            var reAdditional = _appContext.TblRequisitionAddInfos.Where(x => x.RequisitionId == masterReq.RequisitionId&& x.RequisitionOrderId==reqorderID).ToList();
            if (reAdditional.Count > 0)
                _appContext.TblRequisitionAddInfos.RemoveRange(reAdditional);



            foreach (var item in lst)
            {
                var a = new TblRequisitionAddInfo();
                a.RequisitionOrderId = item.RequisitionOrderId;
                a.ReqTypeId=req.ReqId;
                a.RequisitionId = masterReq.RequisitionId;
                a.ControlId = item.ControlId;
                a.ControlValue = item.ControlValue;
                a.KeyValue = item.KeyValue;
                a.KeyId = item.KeyId;
                a.SectionIdentifier = item.SectionIdentifier;
                a.SectionId = item.SectionId;
                _appContext.TblRequisitionAddInfos.Add(a);
            }
            _appContext.SaveChanges();



        }

        private List<TblRequisitionAddInfo> SaveRequisitionSections(RequistionType req, ref TblRequisitionMaster masterReq,
            ref TblRequisitionOrder? reqOrder, ref List<TblRequisitionDrugAllergyCode> reqDrugAllergies, ref TblRequisitionSpecimensInfo specimenInfo, ref List<TblRequisitionIcd10code> icds, ref List<Panel> panels)
        {
           

            reqOrder.UpdatedBy= _connectionManager.UserId;
            reqOrder.UpdatedDate=DateTime.UtcNow;
            var lst = new List<TblRequisitionAddInfo>();

            var reqSections = req.reqSections.ToList();


            var DefinedCustomSection= new List<int>() {8 };

            foreach (var section in reqSections)
            {



                foreach (var field in section.Fields)
                {

                    if (field.FieldType == SectionType.SystemFields&& !(DefinedCustomSection.Contains(section.SectionId)))
                    {





                        if (section.SectionId == 9)// DrugAllergies
                        {

                            var drugAllergies = JsonConvert.DeserializeObject<List<DropDownResponseModel>>(Convert.ToString(field.FieldValue));

                            foreach (var alergy in drugAllergies)
                            {

                                var dAlergy = new TblRequisitionDrugAllergyCode();
                                dAlergy.DrugAllergiesDescription = alergy.Label;
                                dAlergy.DrugCode = alergy.Value;
                                dAlergy.RequisitionOrderId = reqOrder.RequisitionOrderId;
                                dAlergy.ReqTypeId = req.ReqId;
                                dAlergy.RequisitionId = masterReq.RequisitionId;                               
                                reqDrugAllergies.Add(dAlergy);
                            }

                            continue;

                        }
                        else if(section.SectionId== 12)// ICDs
                        {


                            var DignosisCodes = JsonConvert.DeserializeObject<List<ICD10CodeModel>>(Convert.ToString(field.FieldValue));

                            foreach (var code in DignosisCodes)
                            {

                                var icd = new TblRequisitionIcd10code();
                                icd.Icd10code = code.Code;
                                icd.Icd10description =code.Description;
                                icd.RequisitionOrderId = reqOrder.RequisitionOrderId;
                                icd.ReqTypeId = req.ReqId;
                                icd.RequisitionId = masterReq.RequisitionId;
                                icds.Add(icd);

                            }
                            continue;


                        }

                        else if (section.SectionId == 10) // Testing Option
                        {


                            if (field.SystemFieldName == "Compendium")
                            {

                                var SelectedPanels = JsonConvert.DeserializeObject<List<Panel>>(Convert.ToString(field.FieldValue));
                                panels.AddRange(SelectedPanels);
                              
                                continue;
                            }

                        }
                        else
                        {
                            if (field.SystemFieldName == "LabType")
                            {
                                if (Convert.ToString(field.FieldValue).ToLower() == "In-House".ToLower())
                                    field.FieldValue = 0;
                                else
                                    field.FieldValue=1;
                            }

                            SetValueInObject.SaveValue<TblRequisitionOrder>(ref reqOrder, field.SystemFieldName, field.FieldValue);
                            SetValueInObject.SaveValue<TblRequisitionSpecimensInfo>(ref specimenInfo, field.SystemFieldName, field.FieldValue);
                        }



                    }
                    else
                    {
                        var a = new TblRequisitionAddInfo();
                        a.RequisitionId = masterReq.RequisitionId;
                        a.ReqTypeId =req.ReqId;
                        a.RequisitionOrderId = reqOrder.RequisitionOrderId;
                        a.SectionId = section.SectionId;
                        a.ControlId = field.ControlId;
                        SetValueInObject.SaveValue<TblRequisitionAddInfo>(ref a, "ControlValue", field.FieldValue);// for saving value in object
                        a.KeyId = field.SystemFieldName;
                        a.KeyValue = field.DisplayName;
                        lst.Add(a);

                    }






                }
            }



            return lst;

        }





    
    public List<TblFacility> GlobalFilterTest()
        {
            throw new NotImplementedException();
        }



      



    }
}
