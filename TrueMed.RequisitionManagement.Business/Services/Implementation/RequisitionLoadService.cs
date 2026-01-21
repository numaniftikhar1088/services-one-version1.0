using AutoMapper;
using Azure.Storage.Blobs.Models;
using Dapper;
using MailKit.Search;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using System.Data;
using System.Linq.Dynamic;
using System.Reflection;
using TrueMed.Business.Implementation;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Helpers.ExtentionData;
using TrueMed.Domain.Models.Common;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;
using TrueMed.RequisitionManagement.Domain.Models.QueryModel;
using TrueMed.RequisitionManagement.Domain.Models.Requisition.Response;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.RequisitionManagement.Business.Services.Implementation
{
    public class RequisitionLoadService : IRequisitionLoadService
    {
        private readonly IConnectionManager _connectionManager;
        ApplicationDbContext _applicationDbContext;
        MasterDbContext _masterDbContext;
        IDapperManager _dapperManager;
        private readonly IMapper _mapper;
        private readonly ILookupManager _lookupManager;
        private readonly IBlobStorageManager _blobStorage;
       
        public RequisitionLoadService(IConnectionManager connectionManager,
            MasterDbContext masterDb,
            IDapperManager dapperManager,
            IMapper mapper,
            ILookupManager lookupManager,
            IBlobStorageManager blobStorage)
        {
            _connectionManager = connectionManager;
            _applicationDbContext = ApplicationDbContext.Create(connectionManager.CONNECTION_STRING);
            _masterDbContext = masterDb;
            _dapperManager = dapperManager;
            _mapper = mapper;
            _lookupManager = lookupManager;
            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
           _blobStorage = blobStorage;
        }
        public List<LoadReqSectionResponse> GetRequisitionSection(LoadReqSectionRequest request)
        {

            var response = new List<LoadReqSectionResponse>();

            var allLabAssignments = _applicationDbContext.TblLabAssignments.AsNoTracking().ToList();
            var AllfacilityAssignmentsIds = _applicationDbContext.TblFacilityRefLabAssignments.Where(x => x.FacilityId == request.FacilityId).AsNoTracking().Select(x => x.LabAssignmentId).ToList();


            var facilityAssignments = allLabAssignments.Where(x => AllfacilityAssignmentsIds.Contains(x.Id) && x.InsuranceOptionId == request.InsuranceTypeId.ToString()).ToList();
            if (facilityAssignments.Count == 0)
            {
                facilityAssignments = allLabAssignments.Where(x => x.InsuranceOptionId == request.InsuranceTypeId.ToString() && x.IsDefault == true).ToList();
                if (facilityAssignments.Count == 0)
                    facilityAssignments = allLabAssignments.Where(x => x.IsDefault == true).ToList();
            }



            ////   var AllfacilityAssignments = _applicationDbContext.TblFacilityRefLabAssignments.Where(x => x.IsActive == true && x.IsDeleted == false && x.FacilityId == request.FacilityId).Join(_applicationDbContext.TblLabAssignments,x => x.LabAssignmentId,y => y.Id, (x,y) => y).ToList();

            //var facilityAssignments = allLabAssignments.Where(x => x.InsuranceOptionId == request.InsuranceTypeId.ToString()).ToList();
            //if (!facilityAssignments.Any())
            //{
            //    var facilityAssignments = AllfacilityAssignments.Where(x => x.InsuranceOptionId == request.InsuranceTypeId.ToString()).ToList();
            //    if (!facilityAssignments.Any())
            //    {
            //        AllfacilityAssignments = facilityAssignments.Where(x => x.IsDefault == true).ToList();
            //    }
            //}


            var labids = facilityAssignments.Select(x => x.RefLabId).ToList();
            var labsInfolst = _masterDbContext.TblLabs.Where(x => labids.Contains(x.LabId)).ToList();
            var requsitionids = facilityAssignments.Select(x => (int?)x.ReqTypeId).ToList();



            var tblRequistionlst = _applicationDbContext.TblLabRequisitionTypes.Where(x => requsitionids.Contains(x.ReqTypeId) && x.IsActive == true && x.IsDeleted == false && x.IsSelected == true).AsNoTracking().ToList();
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == request.pageId).OrderBy(x => x.SortOrder).AsNoTracking().ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();
            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).AsNoTracking().ToList();
            var allLabControlOptions = _applicationDbContext.TblLabControlOptions.AsNoTracking().ToList();
            var allLabDepedencyControlOPtion = _applicationDbContext.TblLabControlOptionDependencies.AsNoTracking().ToList();
            var AlltblControlTypeInfo = _masterDbContext.TblControlTypes.ToList();



            List<TblRequisitionOrder> requisitionOrderslst = new List<TblRequisitionOrder>();
            List<TblRequisitionAddInfo> AddInfosLst = new List<TblRequisitionAddInfo>();
            List<TblRequisitionSpecimensInfo> specimensInfoLst = new List<TblRequisitionSpecimensInfo>();
            List<TblRequisitionDrugAllergyCode> AllDrugAllergies = new List<TblRequisitionDrugAllergyCode>();
            List<TblRequisitionPanel> AllPanels = new List<TblRequisitionPanel>();
            List<TblRequisitionTest> AllTests = new List<TblRequisitionTest>();
            List<TblRequisitionIcd10code> allDiagnosisList = new List<TblRequisitionIcd10code>();
            if (request.RequisitionId > 0)
            {
                requisitionOrderslst = _applicationDbContext.TblRequisitionOrders.AsNoTracking().Where(x => x.RequisitionId == request.RequisitionId).ToList();
                AddInfosLst = _applicationDbContext.TblRequisitionAddInfos.AsNoTracking().Where(x => x.RequisitionId == request.RequisitionId && x.RequisitionOrderId != 0).ToList();
                specimensInfoLst = _applicationDbContext.TblRequisitionSpecimensInfos.AsNoTracking().Where(x => x.RequisitionId == request.RequisitionId).ToList();
                AllDrugAllergies = _applicationDbContext.TblRequisitionDrugAllergyCodes.AsNoTracking().Where(x => x.RequisitionId == request.RequisitionId).ToList();
                AllPanels=_applicationDbContext.TblRequisitionPanels.AsNoTracking().Where(x=>x.RequisitionId==request.RequisitionId).ToList();
                AllTests = _applicationDbContext.TblRequisitionTests.AsNoTracking().Where(x => x.RequisitionId == request.RequisitionId).ToList();
                allDiagnosisList = _applicationDbContext.TblRequisitionIcd10codes.AsNoTracking().Where(x => x.RequisitionId == request.RequisitionId).ToList();            
            }


            foreach (var req in tblRequistionlst)
            {
                #region ReqInfo

                var res = new LoadReqSectionResponse();
                res.ReqId = req?.ReqTypeId == null ? 0 : req.ReqTypeId;
                res.RequistionName = req.RequisitionTypeName ?? "";
                
                res.Colour = req.RequisitionColor ?? "";
                #endregion
                res.Sections = new List<SectionWithControlsAndDependenciesClient>();

                TblRequisitionOrder reqOrder = null;
                List<TblRequisitionAddInfo> ReqAddInfosLst = new List<TblRequisitionAddInfo>();
                TblRequisitionSpecimensInfo ReqSpecimensInfo = new TblRequisitionSpecimensInfo();
                List<TblRequisitionDrugAllergyCode> reqDrugAllergies = new List<TblRequisitionDrugAllergyCode>();

                List<TblRequisitionPanel> reqPanels = new List<TblRequisitionPanel>();
                List<TblRequisitionTest> reqTests = new List<TblRequisitionTest>();
                List<TblRequisitionIcd10code> reqDiagnosisList = new List<TblRequisitionIcd10code>();
                if (request.RequisitionId > 0)
                {
                    reqOrder = requisitionOrderslst.FirstOrDefault(x => x.ReqTypeId == req?.ReqTypeId);
                    if (reqOrder != null)
                    {
                        res.isSelected = true;
                        ReqAddInfosLst = AddInfosLst.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
                        ReqSpecimensInfo = specimensInfoLst.OrderBy(x => x.RequisitionSpecimenId).FirstOrDefault(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId);
                        reqDrugAllergies = AllDrugAllergies.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
                        reqPanels=AllPanels.Where(x=>x.RequisitionOrderId== reqOrder.RequisitionOrderId).ToList();
                        reqTests=AllTests.Where(x=>x.RequisitionOrderId==reqOrder.RequisitionOrderId).ToList();
                        reqDiagnosisList = allDiagnosisList.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
                    }
                }

                var ReqSections = allLabSections.Where(x => x.IsReqSection == req.MasterRequisitionTypeId && x.IsSelected == true).OrderBy(x => x.SortOrder).ToList();

                //    var sql = _dapperManager.SP_Execute<object>("sp-ex");

                res.Sections = GetAllReqSectionsForClient(request,
                    ReqSections,
                    allLabControls,
                    allLabControlOptions,
                    allLabDepedencyControlOPtion,
                    AlltblControlTypeInfo, labsInfolst,
                    facilityAssignments,
                    req, reqOrder,
                    ReqAddInfosLst,
                    ReqSpecimensInfo,
                    reqDrugAllergies, reqPanels,reqTests, reqDiagnosisList
                    );



                response.Add(res);
            }


            return response;
        }


        public List<SectionWithControlsAndDependenciesClient> GetAllReqSectionsForClient(
            LoadReqSectionRequest request,
            List<TblLabPageSection> ReqSections,
            List<TblLabSectionControl> allLabControls,
            List<TblLabControlOption> allLabControlOptions,
            List<TblLabControlOptionDependency> allLabDepedencyControlOPtion,
            List<TrueMed.Sevices.MasterEntities.TblControlType> AlltblControlTypeInfo,
            List<Sevices.MasterEntities.TblLab> labsInfolst
,
            List<TblLabAssignment> facilityAssignments,
            TblLabRequisitionType req,           
            TblRequisitionOrder? reqOrder,
            List<TblRequisitionAddInfo> reqAddInfosLst,
            TblRequisitionSpecimensInfo? ReqSpecimensInfo,
            List<TblRequisitionDrugAllergyCode> reqDrugAllergies,
            List<TblRequisitionPanel> reqPanels,
            List<TblRequisitionTest> reqTests,
            List<TblRequisitionIcd10code> reqDiagnosisList)
        {
            List<SectionWithControlsAndDependenciesClient> reqSectionlst = new List<SectionWithControlsAndDependenciesClient>();
            // var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == pageId && x.IsReqSection == ReqType).AsNoTracking().ToList();
            var allLabSectionsIdslst = ReqSections.Select(x => x.SectionId).ToList();

            var allLabReqControls = allLabControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).ToList();

            var labinfoassignment = facilityAssignments.FirstOrDefault(x => x.ReqTypeId == req.ReqTypeId);
            if (labinfoassignment == null)
                labinfoassignment = facilityAssignments.FirstOrDefault(x => x.ReqTypeId == 0);

            var labInfo = labsInfolst.FirstOrDefault(x => x.LabId == labinfoassignment.RefLabId);
           
            var PanelIdslstForICDs = new List<int?>();

            //var allControls = _dbContext.TblControls.Where(x => allControlsIdslst.Contains(x.Id)).AsNoTracking().Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
            //{
            //    ControlKey = x.ControlKey,
            //    ControlName = x.ControlName,
            //    DisplayType = x.DisplayType,
            //    IsSystemRequired = x.IsSystemRequired,
            //    CssStyle = x.CssStyle,
            //    Id = x.Id,
            //    IsActive = x.IsActive,
            //    DefaultValue = x.DefaultValue,
            //    SortOrder = x.SortOrder,
            //    TypeOfControl = x.TypeOfControl ?? 200000,// issue
            //    TypeOfSection = x.TypeOfSection,
            //    Options = x.Options

            //}).ToList();


            foreach (var section in ReqSections)
            {
                #region Section
                var isSectionExist = reqSectionlst.Any(x => x.SectionId == section.SectionId);
                if (isSectionExist)
                    continue;
                var labSection = ReqSections.FirstOrDefault(x => x.SectionId == section.SectionId);
                if (string.IsNullOrEmpty(labSection?.SectionName))
                    continue;
                var sectionWithControls = new SectionWithControlsAndDependenciesClient();

                sectionWithControls.SectionName = labSection?.SectionName;
                sectionWithControls.SectionId = section?.SectionId ?? 0;
                sectionWithControls.PageId = request.pageId;
                sectionWithControls.IsSelected = labSection?.IsSelected ?? false;
                sectionWithControls.SortOrder = labSection?.SortOrder;
                sectionWithControls.DisplayType = labSection?.DisplayType ?? "";
                sectionWithControls.CustomScript = labSection?.CustomScript ?? "";
                sectionWithControls.CssStyle = labSection?.CssStyle ?? "";
                #endregion
                sectionWithControls.Fields = new List<ControlWithDependenciesClient>();

                var sectionFields = allLabReqControls.Where(x => x.SectionId == sectionWithControls.SectionId).OrderBy(x => x.SortOrder).ToList();



                switch (sectionWithControls.SectionId)
                {
                    case 6://lab InformationSection
                        sectionWithControls.Fields = GetLabSectionInformation(sectionFields,
                            labInfo,
                            allLabReqControls,
                            allLabControlOptions,
                            allLabDepedencyControlOPtion,
                            AlltblControlTypeInfo,
                            labinfoassignment,
                            request,
                            reqOrder, 
                            reqAddInfosLst
                            );
                        break;
                    case 7://Specimen Type section

                        sectionWithControls.Fields = GetSpecimenInformationSection(sectionFields,
                            allLabReqControls,
                            allLabControlOptions,
                            allLabDepedencyControlOPtion,
                            AlltblControlTypeInfo,
                            labinfoassignment,
                             request, reqOrder, reqAddInfosLst, ReqSpecimensInfo
                            );
                        break;
                    case 9:// Drug Allergies section
                        sectionWithControls.Fields = GetDrugAllergiesSection(sectionFields,
                           allLabReqControls,
                           allLabControlOptions,
                           allLabDepedencyControlOPtion,
                           AlltblControlTypeInfo,
                           labinfoassignment, request, reqOrder, reqAddInfosLst,reqDrugAllergies
                           );
                        break;
                    case 10: // Testing option Section
                        sectionWithControls.Fields = GetCompendiumForRequitions(sectionFields,
                          allLabReqControls,
                          allLabControlOptions,
                          allLabDepedencyControlOPtion,
                          AlltblControlTypeInfo,
                          labinfoassignment,
                          request, reqOrder, reqAddInfosLst, reqPanels, reqTests
                          );
                        var panelIdsnestedlst = sectionWithControls.Fields.Select(x => x.Panels.Select(x => x.PanelID).ToList()).ToList();
                        var panelIdsString = panelIdsnestedlst.SelectMany(x => x).ToList();
                        var panelIds = panelIdsString.Select(x => (int?)Convert.ToInt32(x)).ToList();
                        PanelIdslstForICDs.AddRange(panelIds);
                        break;
                    case 11: // Specimen Source
                        sectionWithControls.Fields = GetCompendiumForRequitions(sectionFields,
                          allLabReqControls,
                          allLabControlOptions,
                          allLabDepedencyControlOPtion,
                          AlltblControlTypeInfo,
                          labinfoassignment,
                          request, reqOrder, reqAddInfosLst, reqPanels, reqTests
                          );
                        //var panelIdsnestedlst = sectionWithControls.Fields.Select(x => x.Panels.Select(x => x.PanelID).ToList()).ToList();
                        //var panelIdsString = panelIdsnestedlst.SelectMany(x => x).ToList();
                        //var panelIds = panelIdsString.Select(x => (int?)Convert.ToInt32(x)).ToList();
                        //PanelIdslstForICDs.AddRange(panelIds);
                        break;
                    case 12:
                        sectionWithControls.Fields = GetIcd10sForRequitions(sectionFields,
                        allLabReqControls,
                        allLabControlOptions,
                        allLabDepedencyControlOPtion,
                        AlltblControlTypeInfo,
                        labinfoassignment,
                        PanelIdslstForICDs,
                        request, reqOrder,reqAddInfosLst, reqDiagnosisList
                        );
                        break;


                    default:
                        sectionWithControls.Fields = GetSectionFieldsWithDependencies(sectionFields,
                                                 allLabReqControls,
                                                 allLabControlOptions,
                                                 allLabDepedencyControlOPtion,
                                                 AlltblControlTypeInfo,
                                                 labinfoassignment,
                                                 request,
                                                 reqOrder,
                                                 reqAddInfosLst
                                                 );
                        break;
                }



                reqSectionlst.Add(sectionWithControls);



            }

            return reqSectionlst;


        }

        private List<ControlWithDependenciesClient> GetIcd10sForRequitions(List<TblLabSectionControl> sectionFields,
            List<TblLabSectionControl> allLabReqControls, List<TblLabControlOption> allLabControlOptions,
            List<TblLabControlOptionDependency> allLabDepedencyControlOPtion,
            List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo,
            TblLabAssignment? labinfoassignment, List<int?> panelIdslstForICDs,
            LoadReqSectionRequest request, TblRequisitionOrder? reqOrder, List<TblRequisitionAddInfo> reqAddInfosLst, List<TblRequisitionIcd10code> reqDiagnosisList)
        {
            var response = new List<ControlWithDependenciesClient>();
            if (sectionFields.Count == 0)
                return response;




            foreach (var f in sectionFields)
            {
                var c = GetReqControlWithDependenciesforClient(f, allLabReqControls, allLabControlOptions, 
                    allLabDepedencyControlOPtion, alltblControlTypeInfo,request,reqOrder,reqAddInfosLst, null);
                //using TblCompendiumPanel = TrueMed.Sevices.AppEntities.TblCompendiumPanel;
                var Panels = new List<TrueMed.Domain.Models.Database_Sets.Application.TblCompendiumPanel>();
               if (c.SystemFieldName == "ICDPanels")
                {
                    var icds = _applicationDbContext.TblIcd10assignments.Where(x => x.ReqTypeId == labinfoassignment.ReqTypeId && x.IsDeleted != true && x.Status != false).AsNoTracking().ToList();
                    if (icds.Where(x => x.RefLabId == labinfoassignment.RefLabId).Any())
                        icds = icds.Where(x => x.RefLabId == labinfoassignment.RefLabId).ToList();
                    //if (icds.Where(x => x.FacilityId == request.FacilityId).Any())
                    //    icds = icds.Where(x => x.FacilityId == request.FacilityId).ToList();
                    if (panelIdslstForICDs.Count > 0 && icds.Where(x => panelIdslstForICDs.Contains(x.PanelId)).Count() > 0)
                        icds = icds.Where(x => panelIdslstForICDs.Contains(x.PanelId)).ToList();
                    var allSelectedDignosisCodes = reqDiagnosisList.Select(x => new ICD10CodeModel
                    {
                        Code = x.Icd10code,
                        Description = x.Icd10description,
                        icd10id = 0
                    }).ToList().DistinctBy(x => x.Code).ToList();

                    c.DefaultValue = reqOrder == null ? "" : JsonConvert.SerializeObject(allSelectedDignosisCodes);

                    if (icds.Count > 0)
                    {
                        if (panelIdslstForICDs.Count == 0)
                        {
                            var panel = new Panel();
                            panel.PanelID = "0";
                            panel.PanelName = "Diagnosis Code";
                            panel.TestOptions = new List<TestOption>();
                            panel.isVisible = true;
                            foreach (var code in icds)
                                panel.TestOptions.Add(new TestOption()
                                {
                                    TestCode = code?.Icd10code ?? "",
                                    TestName = code?.Icd10description ?? "",
                                    TestID = Convert.ToString(code?.Icd10id ?? 0),
                                    IsSelected = allSelectedDignosisCodes.FirstOrDefault(x => x.Code.ToLower().Trim().Equals(code.Icd10code.ToLower().Trim())) == null ? false : true,

                                });
                            panel.TestOptions = panel.TestOptions.OrderBy(x => x.TestName).ToList();
                            c.Panels.Add(panel);
                        }
                        else
                        {
                            var panelsidsdistint = icds.Select(x => x.PanelId).Distinct().ToList();
                            if (panelsidsdistint.Count > 0)
                                Panels = _applicationDbContext.TblCompendiumPanels.Where(x => panelIdslstForICDs.Contains(x.Id)).ToList();



                            foreach (var panelId in panelsidsdistint)
                            {
                                var panel = new Panel();
                                panel.PanelID = Convert.ToString(panelId ?? 0);
                                panel.PanelName = Panels.FirstOrDefault(x => x.Id == panelId)?.PanelName ?? "";
                                panel.TestOptions = new List<TestOption>();
                                var panelIcds = icds.Where(x => x.PanelId == panelId).ToList();
                                panel.isVisible = true;
                                foreach (var code in panelIcds)
                                    panel.TestOptions.Add(new TestOption()
                                    {
                                        TestCode = code?.Icd10code ?? "",
                                        TestName = code?.Icd10description ?? "",
                                        TestID = Convert.ToString(code?.Icd10id ?? 0),
                                        IsSelected = allSelectedDignosisCodes.FirstOrDefault(x => x.Code.ToLower().Trim().Equals(code.Icd10code.ToLower().Trim())) == null ? false : true,

                                    });
                                panel.TestOptions = panel.TestOptions.DistinctBy(x => x.TestCode).ToList();
                                panel.TestOptions = panel.TestOptions.OrderBy(x => x.TestName).ToList();
                                c.Panels.Add(panel);
                            }
                        }




                    }
                }


                response.Add(c);
            }



            return response;
        }

        private List<ControlWithDependenciesClient> GetCompendiumForRequitions(List<TblLabSectionControl> sectionFields, List<TblLabSectionControl> allLabReqControls, List<TblLabControlOption> allLabControlOptions,
            List<TblLabControlOptionDependency> allLabDepedencyControlOPtion,
            List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo,
            TblLabAssignment? labinfoassignment, LoadReqSectionRequest request, 
            TblRequisitionOrder? reqOrder, List<TblRequisitionAddInfo> reqAddInfosLst, 
            List<TblRequisitionPanel> reqPanels, List<TblRequisitionTest> reqTests)
        {

            var response = new List<ControlWithDependenciesClient>();
            if (sectionFields.Count == 0)
                return response;




            foreach (var f in sectionFields)
            {
                var c = GetReqControlWithDependenciesforClient(f, allLabReqControls, allLabControlOptions, allLabDepedencyControlOPtion, alltblControlTypeInfo, request, reqOrder, reqAddInfosLst, null);

                if (c.SystemFieldName == "Compendium")
                {
                    c.Visible = true;
                    var parm = new DynamicParameters();
                    //parm.Add("@FacilityId", request.FacilityId, dbType: DbType.Int32);
                    //parm.Add("@ReqTypeId",labinfoassignment?.ReqTypeId, dbType: DbType.Int32);

                    // var dbPanelsResults = _dapperManager.SP_Execute<SpPanel>("[dbo].[sp_GetCompendiumbyFacilityIDbyReqID]", parm).GetAwaiter().GetResult().ToList();

                    parm.Add("@LabAssignmentId", labinfoassignment?.Id ?? 0, dbType: DbType.Int32);

                    var dbPanelsResults = _dapperManager.SP_Execute<SpPanel>("[dbo].[sp_GetCompendiumbyLabAssignmentId]", parm).GetAwaiter().GetResult().ToList();

                    var panellst = dbPanelsResults.Select(x => new { x.PanelID, x.PanelName }).Distinct().ToList();
                    var panels = new List<Panel>();
                    foreach (var pnl in panellst)
                    {
                        var p = new Panel();
                        p.PanelID = pnl.PanelID;
                        p.PanelName = pnl.PanelName;

                        if (request.RequisitionId > 0)
                        {
                            var SelectedPanel=reqPanels.FirstOrDefault(x=>x.PanelId==Convert.ToInt32(p.PanelID));
                            if (SelectedPanel != null)
                                p.IsSelected = true;
                        }
                        p.isVisible = true;
                        p.TestOptions = new List<TestOption>();
                        var testingoptions = dbPanelsResults.Where(x => x.PanelID == pnl.PanelID).ToList();
                        foreach (var test in testingoptions)
                        {
                            var t = new TestOption();
                            t.TestID = test.TestID;
                            t.TestName = test.TestName;
                            t.TestCode = test.TestCode;
                            if (request.RequisitionId > 0)
                            {
                                var SelectedTest = reqTests.FirstOrDefault(x => x.PanelId == Convert.ToInt32(p.PanelID)
                                &&x.TestId==Convert.ToInt32(t.TestID));
                                if (SelectedTest != null)
                                    t.IsSelected = true;
                            }
                            p.TestOptions.Add(t);

                        }
                        p.TestOptions = p.TestOptions.OrderBy(x => x.TestName).ToList();
                        panels.Add(p);
                    }



                    c.Panels = panels.OrderBy(x=>x.PanelName).ToList();

                }
                else if (c.SystemFieldName == "SpecimenSource")
                {
                    c.Visible = true;
                    var parm = new DynamicParameters();
                    //parm.Add("@FacilityId", request.FacilityId, dbType: DbType.Int32);
                    //parm.Add("@ReqTypeId",labinfoassignment?.ReqTypeId, dbType: DbType.Int32);

                    // var dbPanelsResults = _dapperManager.SP_Execute<SpPanel>("[dbo].[sp_GetCompendiumbyFacilityIDbyReqID]", parm).GetAwaiter().GetResult().ToList();

                    parm.Add("@LabAssignmentId", labinfoassignment?.Id ?? 0, dbType: DbType.Int32);

                    var dbPanelsResults = _dapperManager.SP_Execute<SpPanel>("[sp_GetSpecimenTypesbyLabAssignmentId]", parm).GetAwaiter().GetResult().ToList();

                    var panellst = dbPanelsResults.Select(x => new { x.PanelID, x.PanelName }).Distinct().ToList();
                    var panels = new List<Panel>();
                    foreach (var pnl in panellst)
                    {
                        var p = new Panel();
                        p.PanelID = pnl.PanelID;
                        p.PanelName = pnl.PanelName;

                        if (request.RequisitionId > 0)
                        {
                            var SelectedPanel = reqPanels.FirstOrDefault(x => x.PanelId == Convert.ToInt32(p.PanelID));
                            if (SelectedPanel != null)
                                p.IsSelected = true;
                        }

                        p.TestOptions = new List<TestOption>();
                        var testingoptions = dbPanelsResults.Where(x => x.PanelID == pnl.PanelID).ToList();
                        foreach (var test in testingoptions)
                        {
                            var t = new TestOption();
                            t.TestID = test.TestID;
                            t.TestName = test.TestName;
                            t.TestCode = test.TestCode;
                            if (request.RequisitionId > 0)
                            {
                                var SelectedTest = reqTests.FirstOrDefault(x => x.PanelId == Convert.ToInt32(p.PanelID)
                                && x.TestId == Convert.ToInt32(t.TestID));
                                if (SelectedTest != null)
                                    t.IsSelected = true;
                            }
                            p.TestOptions.Add(t);

                        }
                        p.TestOptions = p.TestOptions.OrderBy(x => x.TestName).ToList();
                        panels.Add(p);
                    }



                    c.Panels = panels;

                }

                response.Add(c);
            }



            return response;
        }

        private List<ControlWithDependenciesClient> GetDrugAllergiesSection(List<TblLabSectionControl> sectionFields,
            List<TblLabSectionControl> allLabReqControls, List<TblLabControlOption> allLabControlOptions,
            List<TblLabControlOptionDependency> allLabDepedencyControlOPtion,
            List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo,
            TblLabAssignment? labinfoassignment, LoadReqSectionRequest request, TblRequisitionOrder? reqOrder,
            List<TblRequisitionAddInfo> reqAddInfosLst, List<TblRequisitionDrugAllergyCode> reqDrugAllergies)
        {


            var response = new List<ControlWithDependenciesClient>();
            if (sectionFields.Count == 0)
                return response;




            foreach (var f in sectionFields)
            {
                var c = GetReqControlWithDependenciesforClient(f, allLabReqControls, allLabControlOptions, allLabDepedencyControlOPtion, alltblControlTypeInfo, request, reqOrder, reqAddInfosLst, null);

                if (c.SystemFieldName == "DrugAllergies")
                {
                    //  var specimenIds = _applicationDbContext.TblDrugAllergiesAssignments.Where(x => x.ReqTypeId == labinfoassignment.ReqTypeId).AsNoTracking().Select(x => x.SpecimenTypeId).Distinct().ToList();

                    var options = _applicationDbContext.TblDrugAllergiesAssignments.AsNoTracking()
                        .Where(x => x.ReqTypeId == labinfoassignment.ReqTypeId && x.IsDeleted != true && x.IsStatus != false)
                        .AsNoTracking().Select(x => new OptionClient
                    {
                        DependenceyControls = new List<ControlWithDependenciesClient>(),
                        id = x.Id,
                        isSelectedDefault = false,
                        isVisable = true,
                        Label = x.DrugName,
                        Value = x.Daid.ToString(),
                        Name = c.SystemFieldName.ToString(),
                        OptionDataID = x.Id
                    }).ToList();
                    options = options.DistinctBy(x => x.Value).ToList();
                    if (request.RequisitionId > 0)
                    {
                        reqDrugAllergies = reqDrugAllergies.DistinctBy(x => x.DrugCode).ToList();

                        var lst = new List<OptionClient>();



                        options.ForEach(o =>
                        {

                            var drugAllergyExist = reqDrugAllergies.FirstOrDefault(x => x.DrugCode.ToLower().Trim().Equals(o.Value.ToLower().Trim()));
                            if (drugAllergyExist != null)
                            {
                                o.isSelectedDefault = true;
                                lst.Add(o);
                            }
                        });

                        c.DefaultValue = JsonConvert.SerializeObject(lst, new JsonSerializerSettings
                        {
                            ContractResolver = new CamelCasePropertyNamesContractResolver()
                        });

                    }


                    c.Options = options;
                }

                c.Options = c.Options.OrderBy(x => x.Label).ToList();
                response.Add(c);
            }



            return response;


        }

        private List<ControlWithDependenciesClient> GetSectionFieldsWithDependencies(List<TblLabSectionControl> sectionFields, 
            List<TblLabSectionControl> allLabReqControls, List<TblLabControlOption> allLabControlOptions,
            List<TblLabControlOptionDependency> allLabDepedencyControlOPtion, 
            List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo, TblLabAssignment? labinfoassignment,
            LoadReqSectionRequest request, TblRequisitionOrder? reqOrder, List<TblRequisitionAddInfo> reqAddInfosLst)
        {
            var response = new List<ControlWithDependenciesClient>();
            if (sectionFields.Count == 0)
                return response;




            foreach (var f in sectionFields)
            {
                var c = GetReqControlWithDependenciesforClient(f, allLabReqControls, allLabControlOptions, allLabDepedencyControlOPtion, alltblControlTypeInfo,request,reqOrder,reqAddInfosLst,null,"");

                if (c.SystemFieldName == "SpecimenType")
                {
                    var specimenIds = _applicationDbContext.TblPanelTestSpecimenTypeAssignments.Where(x => x.ReqTypeId == labinfoassignment.ReqTypeId).AsNoTracking().Select(x => x.SpecimenTypeId).Distinct().ToList();

                    var options = _applicationDbContext.TblSpecimenTypes.Where(x => specimenIds.Contains(x.SpecimenTypeId)).AsNoTracking().Select(x => new OptionClient
                    {
                        DependenceyControls = new List<ControlWithDependenciesClient>(),
                        id = x.SpecimenTypeId,
                        isSelectedDefault = false,
                        isVisable = true,
                        Label = x.SpecimenType,
                        Value = x.SpecimenTypeId.ToString(),
                        Name = c.SystemFieldName.ToString(),
                        OptionDataID = x.SpecimenTypeId
                    }).ToList();

                    c.Options = options;
                }


                response.Add(c);
            }



            return response;
        }

        private List<ControlWithDependenciesClient> GetSpecimenInformationSection(List<TblLabSectionControl> sectionFields, List<TblLabSectionControl> allLabReqControls, 
            List<TblLabControlOption> allLabControlOptions, List<TblLabControlOptionDependency> allLabDepedencyControlOPtion,
            List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo, TblLabAssignment? labinfoassignment, LoadReqSectionRequest request, TblRequisitionOrder? reqOrder, List<TblRequisitionAddInfo> reqAddInfosLst, TblRequisitionSpecimensInfo? reqSpecimensInfo)
        {



            var response = new List<ControlWithDependenciesClient>();
            if (sectionFields.Count == 0)
                return response;




            foreach (var f in sectionFields)
            {
                var c = GetReqControlWithDependenciesforClient(f, allLabReqControls, allLabControlOptions, allLabDepedencyControlOPtion, 
                    alltblControlTypeInfo, request, reqOrder, reqAddInfosLst,reqSpecimensInfo,"");

                if (c.SystemFieldName == "SpecimenType")
                {
                    var specimenIds = _applicationDbContext.TblPanelTestSpecimenTypeAssignments.Where(x => x.ReqTypeId == labinfoassignment.ReqTypeId).AsNoTracking().Select(x => x.SpecimenTypeId).Distinct().ToList();

                    var options = _applicationDbContext.TblSpecimenTypes.Where(x => specimenIds.Contains(x.SpecimenTypeId)).AsNoTracking().Select(x => new OptionClient
                    {
                        DependenceyControls = new List<ControlWithDependenciesClient>(),
                        id = x.SpecimenTypeId,
                        isSelectedDefault = false,
                        isVisable = true,
                        Label = x.SpecimenType,
                        Value = x.SpecimenTypeId.ToString(),
                        Name = c.SystemFieldName.ToString(),
                        OptionDataID = x.SpecimenTypeId
                    }).ToList();

                    c.Options = options;

                    c.Options.ForEach(o => {

                        if (c.DefaultValue.ToLower().Trim().Equals(o.Label.ToLower().Trim())
                              || c.DefaultValue.ToLower().Trim().Equals(o.Value.ToLower().Trim())
                              )
                            o.isSelectedDefault = true;

                    });
                }

                c.Options = c.Options.OrderBy(x => x.Label).ToList();
                response.Add(c);
            }



            return response;



        }

        private List<ControlWithDependenciesClient> GetLabSectionInformation(List<TblLabSectionControl> sectionFields,
            Sevices.MasterEntities.TblLab labsInfo,
            List<TblLabSectionControl> allLabReqControls,
            //List<TblLabSectionControl> allLabControls,
            List<TblLabControlOption> allLabControlOptions,
            List<TblLabControlOptionDependency> allLabDepedencyControlOPtion,
            List<TrueMed.Sevices.MasterEntities.TblControlType> AlltblControlTypeInfo,
            TblLabAssignment? labinfoassignment,
            LoadReqSectionRequest request,
            TblRequisitionOrder? reqOrder,
            List<TblRequisitionAddInfo> reqAddInfosLst)
        {
            var response = new List<ControlWithDependenciesClient>();


            foreach (var f in sectionFields)
            {
                var c = GetReqControlWithDependenciesforClient(f, allLabReqControls, allLabControlOptions, 
                    allLabDepedencyControlOPtion, AlltblControlTypeInfo, request, reqOrder, reqAddInfosLst,null);
               
                c.DefaultValue = Convert.ToString(labsInfo.GetPropertyValue(c.SystemFieldName) ?? "");
                if (c.SystemFieldName?.ToLower().Trim() == "LabName".Trim().ToLower())
                {
                    c.DefaultValue = labsInfo?.DisplayName;
                }
                if (c.SystemFieldName?.ToLower().Trim() == "LabType".Trim().ToLower())
                {

                    if (c.DefaultValue == "0")
                        c.DefaultValue = "In-House";
                    else
                        c.DefaultValue = "Reference Lab";
                }
                response.Add(c);
            }



            return response;
        }

        private ControlWithDependenciesClient GetReqControlWithDependenciesforClient(TblLabSectionControl f, List<TblLabSectionControl> allLabReqControls,
            List<TblLabControlOption> allLabControlOptions, List<TblLabControlOptionDependency> allLabDepedencyControlOPtion, 
            List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo, LoadReqSectionRequest request, TblRequisitionOrder? reqOrder,
            List<TblRequisitionAddInfo> reqAddInfosLst, TblRequisitionSpecimensInfo? reqSpecimensInfo, string dependenciesCssClass = "")
        {
            ControlWithDependenciesClient c = new ControlWithDependenciesClient();
            var lc = allLabReqControls.FirstOrDefault(x => x.ControlId == f.ControlId);
            if (c == null)
                return new ControlWithDependenciesClient();
            //c.ControlId = f.Id;
            //c.ControlDataID = f.Id;
            c.ControlId = f.ControlId ?? 0;
            c.ControlDataID = f.ControlId ?? 0;

            c.CssStyle = string.IsNullOrEmpty(lc?.CssStyle) ? f.CssStyle ?? "" : lc?.CssStyle;
            c.DefaultValue = string.IsNullOrEmpty(lc?.DefaultValue) ? f.DefaultValue ?? "" : lc?.DefaultValue;
            c.DisplayFieldName = string.IsNullOrEmpty(lc?.ControlName) ? f.ControlName ?? "" : lc?.ControlName;
            c.DisplayType = string.IsNullOrEmpty(lc?.DisplayType) ? f.DisplayType ?? "col-lg-6 col-md-6 col-sm-12" : lc?.DisplayType;

            c.IsNew = false;
            //  c.Options = string.IsNullOrEmpty(lc?.Options) ? f.Options ?? "" : lc?.Options;
            c.Required = lc?.IsSystemRequired == null ? f?.IsSystemRequired ?? false : lc.IsSystemRequired;
            c.SectionType = (SectionType)Enum.Parse(typeof(SectionType), f.TypeOfSection ?? "");
            c.SortOrder = lc?.SortOrder == null ? f.SortOrder : lc.SortOrder;
            c.SystemFieldName = string.IsNullOrEmpty(lc?.ControlKey) ? f.ControlKey ?? "" : lc?.ControlKey;
            c.DisplayType += " " + dependenciesCssClass;
            c.UIType = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == Convert.ToInt32(f.TypeOfControl))?.ControlName;
            c.UITypeId = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == Convert.ToInt32(f.TypeOfControl))?.ControlId ?? 1000000;
            c.Visible = lc?.IsVisible == null ? f.IsVisible : lc.IsVisible;

            // Validation And Masking and Prview Order
            c.ValidationExpression = lc?.ColumnValidation??"";
            c.Mask = lc?.FormatMask ?? "";
            c.PreviewDisplayType = lc?.OrderViewDisplayType;
            c.PreviewSortOrder = lc?.OrderViewSortOrder ?? 0;
            if(c.UITypeId==34)
               c.AutoCompleteOption= lc?.Options??"";

            if (request.RequisitionId > 0)
            {
                if (c.SectionType == SectionType.SystemFields)
                {
                    SaveValue<TblRequisitionOrder>(ref reqOrder, c.SystemFieldName, ref c);
                    if(reqSpecimensInfo!=null)
                    SaveValue<TblRequisitionSpecimensInfo>(ref reqSpecimensInfo, c.SystemFieldName, ref c);
                }
                else
                {
                    var addtionalValue = reqAddInfosLst.FirstOrDefault(y => y.KeyId.ToLower().Trim().Equals(c.SystemFieldName.ToLower().Trim()));
                    if (addtionalValue != null)
                        SetValueInObject.SaveValue<ControlWithDependenciesClient>(ref c, "DefaultValue", addtionalValue.ControlValue);






                }

            }




            c.Options = new List<OptionClient>();

            var controlOptions = allLabControlOptions.Where(x => x.ControlId == f.ControlId).ToList();
            if (controlOptions.Count != 0)
            {
                foreach (var option in controlOptions)
                {
                    var o = new OptionClient();
                    o.Name = c.SystemFieldName;

                    o.Label = option.OptionName;
                    o.id = option.OptionId;
                    o.OptionDataID = option.OptionId;
                    o.Value = option.OptionValue;
                    o.isSelectedDefault = option.IsDefaultSelected;                   
                    if (request.RequisitionId > 0)
                    {
                        if (IsValidJson(c.DefaultValue))
                        {
                            var Objectlist = JsonConvert.DeserializeObject<List<CustomValueLabelResponse>>(c.DefaultValue);

                            if(Objectlist.Any(x=>x.Value.ToLower().Trim().Equals(option.OptionName.ToLower().Trim()) 
                            ||x.Value.ToLower().Trim().Equals(option.OptionName.ToLower().Trim())))
                                o.isSelectedDefault = true;
                        }
                        else
                        {

                            if (c.DefaultValue.ToLower().Trim().Equals(option.OptionName.ToLower().Trim())
                            || c.DefaultValue.ToLower().Trim().Equals(option.OptionValue.ToLower().Trim())
                            )
                                o.isSelectedDefault = true;
                        }
                    }
                    c.Options.Add(o);

                    //var depenencyFields = allLabDepedencyControlOPtion.Where(x => x.ControlId == c.ControlId && x.OptionId == o.id).ToList();
                    //if (depenencyFields.Count == 0)
                    //    continue;

                    //var dc = new ControlWithDependenciesClient();
                    //dc.optionID = option.OptionId;
                    //dc.OptionDataID = option.OptionId;
                    //dc.Value = option.OptionValue;
                    //dc.Name = c.SystemFieldName;
                    //dc.Label = option.OptionName;
                    //dc.DependecyFields = new List<ControlWithDependenciesClient>();

                    //foreach (var d in depenencyFields)
                    //{
                    //    if (!String.IsNullOrEmpty(d?.DependencyAction))
                    //        dc.DependencyAction = d.DependencyAction;
                    //    var df = allControls.FirstOrDefault(x => x.Id == d.DependentControlId);
                    //    if (df == null)
                    //        continue;
                    //    var depField = GetControlWithDependenciesforClient(df, allLabControls, allControlOptions, allControls, allDepedencyControlOPtion,
                    //        alltblControlTypeInfo, isAdmin, allLabControlOptions, allLabDepedencyControlOPtion, $"{c.SystemFieldName} {dependenciesCssClass} {o.Value} {option.OptionName + option.OptionId} d-none");
                    //    dc.DepenecyFields.Add(depField.Fields);
                    //    //foreach(var ctrls in depField.DependenceyControls)
                    //    //dc.DependecyFields.AddRange(ctrls.DependecyFields.ToList());


                    //}
                    //lst.DependencyControls.Add(dc);
                }

            }

            return c;
        }
        private static bool IsValidJson(string strInput)
        {
            if (string.IsNullOrWhiteSpace(strInput)) { return false; }
            strInput = strInput.Trim();
            if ((strInput.StartsWith("{") && strInput.EndsWith("}")) || //For object
                (strInput.StartsWith("[") && strInput.EndsWith("]"))) //For array
            {
                try
                {
                    var obj = JToken.Parse(strInput);
                    return true;
                }
                catch (JsonReaderException jex)
                {
                    //Exception in parsing json
                    Console.WriteLine(jex.Message);
                    return false;
                }
                catch (Exception ex) //some other exception
                {
                    Console.WriteLine(ex.ToString());
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        public List<SectionWithControlsAndDependenciesClient> LoadCommonSectionForRequisition(LoadCommonRequisitionRequest request)
        {
            var allPageSections = new List<SectionWithControlsAndDependenciesClient>();
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == request.PageId && x.IsReqSection == 0).AsNoTracking().ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();

            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).AsNoTracking().ToList();


            var tblPageSectionInfos = _masterDbContext.TblPageSections.Where(f => f.PageId == request.PageId).AsNoTracking().ToList();
            var allSectionsIds = tblPageSectionInfos.Select(x => x.SectionId).ToList();

            var tblSectionsInfos = _masterDbContext.TblSections.Where(x => allSectionsIds.Contains(x.Id)).AsNoTracking().ToList();

            var tblsectionControls = _masterDbContext.TblSectionControls.Where(x => allSectionsIds.Contains(x.SectionId.Value)).AsNoTracking().ToList();


            var allControlsIdslst = tblsectionControls.Select(x => x.ControlId).ToList();
            var allControlOptions = _masterDbContext.TblControlOptions.AsNoTracking().ToList();
            var allDepedencyControlOPtion = _masterDbContext.TblControlOptionDependencies.AsNoTracking().ToList();

            var allControls = _masterDbContext.TblControls.Where(x => allControlsIdslst.Contains(x.Id)).AsNoTracking().Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
            {
                ControlKey = x.ControlKey,
                ControlName = x.ControlName,
                DisplayType = x.DisplayType,
                IsSystemRequired = x.IsSystemRequired,
                CssStyle = x.CssStyle,
                Id = x.Id,
                IsActive = x.IsActive,
                DefaultValue = x.DefaultValue,
                SortOrder = x.SortOrder,
                TypeOfControl = x.TypeOfControl ?? 200000,// issue
                TypeOfSection = x.TypeOfSection,
                Options = x.Options

            }).ToList();
            var AlltblControlTypeInfo = _masterDbContext.TblControlTypes.ToList();
            var allLabControlOptions = _applicationDbContext.TblLabControlOptions.AsNoTracking().ToList();
            var allLabDepedencyControlOPtion = _applicationDbContext.TblLabControlOptionDependencies.AsNoTracking().ToList();
            TblRequisitionMaster reqMaster = new TblRequisitionMaster();
            
            List<TblRequisitionPatientInsurance> inslst = new List<TblRequisitionPatientInsurance>();
            List<TblRequisitionAddInfo> customFields = new List<TblRequisitionAddInfo>();
            List<TblRequisitionFile> requisitionFiles = new List<TblRequisitionFile>();
            if (request.RequisitionId > 0)
            {
                reqMaster=_applicationDbContext.TblRequisitionMasters.AsNoTracking().FirstOrDefault(x=>x.RequisitionId==request.RequisitionId);
                inslst = _applicationDbContext.TblRequisitionPatientInsurances.AsNoTracking().Where(x => x.RequisitionId == request.RequisitionId).ToList();
                customFields = _applicationDbContext.TblRequisitionAddInfos.AsNoTracking().Where(x => x.RequisitionId == request.RequisitionId && x.RequisitionOrderId == 0).ToList();
                requisitionFiles = _applicationDbContext.TblRequisitionFiles.Where(x => x.RequisitionId == request.RequisitionId&& x.RequisitionOrderId==0).ToList();
            }

            foreach (var labSection in allLabSections)
            {
                #region Section
                var isSectionExist = allPageSections.Any(x => x.SectionId == labSection.SectionId);
                if (isSectionExist)
                    continue;

                var section = tblPageSectionInfos.FirstOrDefault(x => x.SectionId == labSection.SectionId);
                if (string.IsNullOrEmpty(labSection?.SectionName))
                    continue;


                var sectionWithControls = new SectionWithControlsAndDependenciesClient();

                sectionWithControls.SectionName = labSection?.SectionName;
                sectionWithControls.SectionId = labSection?.SectionId ?? 0;
                sectionWithControls.PageId =request.PageId;
                sectionWithControls.IsSelected = labSection?.IsSelected ?? false;
                sectionWithControls.SortOrder = labSection?.SortOrder != null ? labSection?.SortOrder : section?.Section?.Order ?? 10000;
                sectionWithControls.DisplayType = string.IsNullOrEmpty(labSection?.DisplayType) ? "col-lg-6 col-md-6 col-sm-12" : labSection?.DisplayType ?? "";
                sectionWithControls.CssStyle = string.IsNullOrEmpty(labSection?.CssStyle ?? "") ? "" : labSection?.CssStyle ?? "";
                sectionWithControls.CustomScript = string.IsNullOrEmpty(labSection.CustomScript ?? "") ? "" : labSection.CustomScript ?? "";
                #endregion
                sectionWithControls.Fields = new List<ControlWithDependenciesClient>();
                sectionWithControls.DependencyControls = new List<DependencyControlsClient>();


                var AllfieldsOfSectionIDslst = allLabControls.Where(x => x.SectionId == labSection.SectionId)
                                                .Select(x => x.ControlId)
                                                .ToList();

                if (AllfieldsOfSectionIDslst.Count == 0)
                {
                    allPageSections.Add(sectionWithControls);
                    continue;
                }

                //  var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();
                var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).OrderBy(x => x.SortOrder).ToList();

                if (allSectionControls.Count == 0)
                    continue;


                // for Repeat Control 
                bool isRepeateControl = false;
                var rc = new ControlWithDependenciesClient();
                rc.RepeatFields = new List<ControlWithDependenciesClient>();
                rc.RepeatDependencyControls = new List<DependencyControlsClient>();

                foreach (var f in allSectionControls)
                {

                    if(_connectionManager.IsFacilityUser)
                    {
                        if (f.ControlKey == "DateReceived")
                            continue;
                    }
                    



                    if (f.TypeOfControl == 25)// Repeat Start
                    {
                        rc = new ControlWithDependenciesClient();
                        rc.RepeatFields = new List<ControlWithDependenciesClient>();
                        rc.RepeatDependencyControls = new List<DependencyControlsClient>();
                        rc.UIType = "Repeat";
                        rc.UITypeId = 33;
                        rc.SortOrder = f.SortOrder;
                        rc.DisplayFieldName = f.ControlName;
                        rc.Visible = true;
                        isRepeateControl = true;

                        var repeatStart = GetControlWithDependenciesforClient(f, allLabControls,
                         allControlOptions, allControls, allDepedencyControlOPtion,
                         AlltblControlTypeInfo, false, allLabControlOptions, allLabDepedencyControlOPtion, request, reqMaster, customFields,"", sectionWithControls.SectionId);

                        rc.RepeatFieldsState.Add(repeatStart.Fields);
                        rc.RepeatDependencyControlsState.AddRange(repeatStart.DependencyControls.ToList());
                        continue;
                    }
                    if (f.TypeOfControl == 26)// Repeat End
                    {
                        rc.RepeatFields = rc.RepeatFields.OrderBy(x => x.SortOrder).ToList();
                        if (section.SectionId == 5 && request.RequisitionId > 0)// Handling multi insurance for Edit
                        {

                            string rcjson = Newtonsoft.Json.JsonConvert.SerializeObject(rc);// for copying pupose without reference
                           
                            foreach (var ins in inslst)
                            {
                               
                                var erc = Newtonsoft.Json.JsonConvert.DeserializeObject<ControlWithDependenciesClient>(rcjson);  
                          //      erc = _mapper.Map(rc, erc);

                                UpdateBillingValuesInRepeatControl(ins, ref erc, customFields);

                                sectionWithControls.Fields.Add(erc);


                            }

                            if (f.ControlKey == "PhotosForInsuranceCard" || f.ControlKey == "PhotoForDemographicInfo")
                            {
                                var typeOfFile= f.ControlKey == "PhotosForInsuranceCard" ? "Insurance Image" : "Demographic Image";

                                var files = requisitionFiles.Where(x => x.TypeOfFile == typeOfFile).Select(x => new RequisitionFileViewModel
                                {
                                    fileName = x.FileName,
                                    fileUrl = x.FileUrl
                                }).ToList();
                                f.DefaultValue = JsonConvert.SerializeObject(files);
                                continue;
                            }
                            








                        }
                        else
                        {
                            sectionWithControls.Fields.Add(rc);
                        }
                            isRepeateControl = false;
                        continue;
                    }
                    var controlsAndDependent = GetControlWithDependenciesforClient(f, allLabControls,
                        allControlOptions, allControls, allDepedencyControlOPtion,
                        AlltblControlTypeInfo, false, allLabControlOptions,
                        allLabDepedencyControlOPtion, request, reqMaster, customFields, "", sectionWithControls.SectionId
                        );

                    // Commented for repeat control
                    //sectionWithControls.Fields.Add(controlsAndDependent.Fields);
                    //sectionWithControls.DependencyControls.AddRange(controlsAndDependent.DependencyControls.ToList());

                    // added for repeatControl
                    if (!isRepeateControl)
                    {
                        sectionWithControls.Fields.Add(controlsAndDependent.Fields);
                        sectionWithControls.DependencyControls.AddRange(controlsAndDependent.DependencyControls.ToList());
                    }
                    else
                    {
                        rc.RepeatFields.Add(controlsAndDependent.Fields);
                        rc.RepeatDependencyControls.AddRange(controlsAndDependent.DependencyControls.ToList());

                        rc.RepeatFieldsState.Add(controlsAndDependent.Fields);
                        rc.RepeatDependencyControlsState.AddRange(controlsAndDependent.DependencyControls.ToList());
                    }
                }
                sectionWithControls.Fields = sectionWithControls.Fields.OrderBy(x => x.SortOrder).ToList();
                allPageSections.Add(sectionWithControls);
            }


            // Removing duplicates from dependencies
            foreach (var section in allPageSections)
            {
                var allvisableFields = section.Fields.Where(x => x.Visible == true).ToList();
                var controlsId = section.Fields.Where(x => x.Visible == true).Select(x => x.ControlId).ToList();
                section.Fields = new List<ControlWithDependenciesClient>();
                section.Fields = allvisableFields.ToList();      
            }

            return allPageSections.OrderBy(x => x.SortOrder).ToList();
        }

        private void UpdateBillingValuesInRepeatControl(TblRequisitionPatientInsurance ins, ref ControlWithDependenciesClient erc, List<TblRequisitionAddInfo> customFields)
        {
            erc.RepeatFields.ForEach(x =>
            {
                if(x.SectionType==SectionType.SystemFields)
                SaveValue<TblRequisitionPatientInsurance>(ref ins,x.SystemFieldName??"",ref x);
                else
                {
                    var addtionalValue = customFields.FirstOrDefault(y => y.KeyId.ToLower().Trim().Equals(x.SystemFieldName.ToLower().Trim()));
                    if(addtionalValue!=null)
                    SetValueInObject.SaveValue<ControlWithDependenciesClient>(ref x, "DefaultValue", addtionalValue.ControlValue);
                }
                x.Options.ForEach(o =>
                {

                    if ((x.DefaultValue??"").ToLower().Trim().Equals(o.Label.ToLower().Trim())
                            || (x.DefaultValue??"").ToLower().Trim().Equals(o.Value.ToLower().Trim())
                       )
                        o.isSelectedDefault = true;

                });

            });

        }

        private ControlsAndDependentControlsClient GetControlWithDependenciesforClient(Sevices.MasterEntities.TblControl f, List<TblLabSectionControl> allLabControls,
            List<Sevices.MasterEntities.TblControlOption> allControlOptions, List<Sevices.MasterEntities.TblControl> allControls,
            List<TblControlOptionDependency> allDepedencyControlOPtion, List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo,
            bool isAdmin, List<TblLabControlOption> allLabControlOptions, List<TblLabControlOptionDependency> allLabDepedencyControlOPtion,
            LoadCommonRequisitionRequest request, TblRequisitionMaster? reqMaster, List<TblRequisitionAddInfo> customFields, string dependenciesCssClass = "", int sectionId = 0, bool isDependency=false,int controlId=0 )
        {
            var lst = new ControlsAndDependentControlsClient();
            lst.DependencyControls = new List<DependencyControlsClient>();

            #region Control collection of above section
            ControlWithDependenciesClient c = new ControlWithDependenciesClient();
            var lc = allLabControls.FirstOrDefault(x => x.ControlId == f.Id && x.SectionId == sectionId);
            System.Diagnostics.Debug.WriteLine(f.ControlKey);
            c.ControlId = f.Id;
            c.ControlDataID = f.Id;

            c.CssStyle = string.IsNullOrEmpty(lc?.CssStyle) ? f.CssStyle ?? "" : lc?.CssStyle;
           
            c.DisplayFieldName = string.IsNullOrEmpty(lc?.ControlName) ? f.ControlName ?? "" : lc?.ControlName;
            c.DisplayType = string.IsNullOrEmpty(lc?.DisplayType) ? f.DisplayType ?? "col-lg-6 col-md-6 col-sm-12" : lc?.DisplayType+ " Control"+ c.ControlId;
            c.IsNew = false;
            //  c.Options = string.IsNullOrEmpty(lc?.Options) ? f.Options ?? "" : lc?.Options;
            c.Required = lc?.IsSystemRequired == null ? f?.IsSystemRequired ?? false : lc.IsSystemRequired;
            c.SectionType = (SectionType)(f.TypeOfSection ?? 0);
            c.SortOrder = lc?.SortOrder == null ? f.SortOrder : lc.SortOrder;
            c.SystemFieldName = string.IsNullOrEmpty(lc?.ControlKey) ? f.ControlKey ?? "" : lc?.ControlKey;
            c.DisplayType += " " + dependenciesCssClass;
            c.UIType = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlName;
            c.UITypeId = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlId ?? 1000000;
            c.Visible = lc?.IsVisible == null ? f.IsActive : lc.IsVisible;
            c.DefaultValue = string.IsNullOrEmpty(lc?.DefaultValue) ? f.DefaultValue ?? "" : lc?.DefaultValue;


            // Validation And Masking and Prview Order
            c.ValidationExpression = lc?.ColumnValidation ?? "";
            c.Mask = lc?.FormatMask ?? "";
            c.PreviewDisplayType = lc?.OrderViewDisplayType;
            c.PreviewSortOrder = lc?.OrderViewSortOrder ?? 0;



            if (request.RequisitionId > 0)
            {
                if(c.SectionType==SectionType.SystemFields)
                SaveValue<TblRequisitionMaster>(ref reqMaster, c.SystemFieldName, ref c);
                else
                {
                    var addtionalValue = customFields.FirstOrDefault(y => y.KeyId.ToLower().Trim().Equals(c.SystemFieldName.ToLower().Trim()));
                    if(addtionalValue != null)                        
                    SetValueInObject.SaveValue<ControlWithDependenciesClient>(ref c, "DefaultValue", addtionalValue.ControlValue);
                }

            }
            #endregion
            c.DependencyControls = new List<DependencyControlsClient>();
            #region Get Option Of Each Control and its Dependency
            // getting option for control
            c.Options = new List<OptionClient>();
            //var controlOptions = allLabControlOptions.Where(x => x.ControlId == f.Id).ToList();
            var controlOptions = allLabControlOptions.Where(x => x.ControlId == f.Id && x.IsVisible == true).DistinctBy(x=>x.OptionId).ToList();
            if (controlOptions.Count != 0)
            {
                foreach (var option in controlOptions)
                {
                    var o = new OptionClient();
                    o.Name = c.SystemFieldName;

                    o.Label = option.OptionName;
                    o.id = option.OptionId;
                    o.OptionDataID = option.OptionId;
                    o.Value = option.OptionValue;

                    o.isSelectedDefault = option.IsDefaultSelected;
                    if (request.RequisitionId > 0)
                    {
                        if (c.DefaultValue.ToLower().Trim().Equals(option.OptionName.ToLower().Trim())
                            || c.DefaultValue.ToLower().Trim().Equals(option.OptionValue.ToLower().Trim())
                            )
                            o.isSelectedDefault = true;
                    }
                    
                    
                    c.Options.Add(o);

                    var depenencyFields = allLabDepedencyControlOPtion.Where(x => x.ControlId == c.ControlId && x.OptionId == o.id).ToList();
                    if (depenencyFields.Count == 0)
                        continue;

                    var dc = new DependencyControlsClient();
                    dc.optionID = option.OptionId;
                    dc.OptionDataID = option.OptionId;
                    dc.Value = option.OptionValue;
                    dc.Name = c.SystemFieldName;
                    dc.Label = option.OptionName;
                    dc.DependecyFields = new List<ControlWithDependenciesClient>();

                    
                        foreach (var d in depenencyFields)
                        {
                        if (sectionId == 5 && d.ControlId == 44 && isDependency)
                            continue;




                            System.Diagnostics.Debug.WriteLine(f.ControlKey);
                            if (!String.IsNullOrEmpty(d?.DependencyAction))
                                dc.DependencyAction = d.DependencyAction;
                            var df = allControls.FirstOrDefault(x => x.Id == d.DependentControlId);
                            if (df == null)
                                continue;
                            var depField = GetControlWithDependenciesforClient(df, allLabControls, allControlOptions, allControls, allDepedencyControlOPtion,
                                alltblControlTypeInfo, isAdmin, allLabControlOptions,
                                allLabDepedencyControlOPtion, request, reqMaster, customFields,
                                $"{c.SystemFieldName} {dependenciesCssClass} {o.Value} {option.OptionName + option.OptionId} d-none", sectionId, true, c.ControlId);
                            dc.DependecyFields.Add(depField.Fields);
                            //foreach(var ctrls in depField.DependenceyControls)
                            //dc.DependecyFields.AddRange(ctrls.DependecyFields.ToList());


                        }
                  
                    
                 
                    lst.DependencyControls.Add(dc);
                }

            }
            // for Dynamic Drop downs to avoid extra ajax calls

            switch (c.SystemFieldName)
            {
                case "State":// state loading
                    foreach (var option in _lookupManager.USStates_Lookup())
                    {
                        var o = new OptionClient();
                        o.Name = c.SystemFieldName;

                        o.Label = option.Name;
                        //  o.id = option.OptionId;
                        //o.OptionDataID = option.OptionId;
                        o.Value = option.Abbreviations; ;
                        o.isSelectedDefault = false;

                        if (request.RequisitionId > 0)
                        {
                            if (c.DefaultValue.ToLower().Trim().Equals(o.Label.ToLower().Trim())
                                || c.DefaultValue.ToLower().Trim().Equals(o.Value.ToLower().Trim())
                                )
                                o.isSelectedDefault = true;
                        }
                        c.Options.Add(o);

                    }
                    break;
                case "FacilityID": // facility Dropdown
                    var Facilityoption = _applicationDbContext.TblFacilities.AsNoTracking().Select(x=> new OptionClient { 
                    Name= c.SystemFieldName,
                    Label=x.FacilityName,
                    Value=x.FacilityId.ToString(),
                    isSelectedDefault=false,
                    }).ToList();
                    c.Options.AddRange(Facilityoption);
                    break;
                case "PhysicianID":                   
                    var physicainOPtion = _lookupManager.GetUserFacilityUserByRole_Lookup(72).GetAwaiter().GetResult().Select(x => new OptionClient
                    {
                        Name = c.SystemFieldName,
                        Label = x.Name,
                        Value = x.Id.ToString(),
                        isSelectedDefault=false,
                        OptionDataID=x.FacilityID
                    }).ToList();
                    c.Options.AddRange(physicainOPtion);
                    break;
                case "CollectorID":
                    var CollectorOPtion = _lookupManager.GetUserFacilityUserByRole_Lookup(5).GetAwaiter().GetResult().Select(x => new OptionClient
                    {
                        Name = c.SystemFieldName,
                        Label = x.Name,
                        Value = x.Id.ToString(),
                        isSelectedDefault = false,
                        OptionDataID = x.FacilityID
                    }).OrderBy(x=>x.Label).ToList();                   
                    
                    c.Options.AddRange(CollectorOPtion);
                    break;
                case "PhysicianSignature":
                    
                    c.DefaultValue = string.IsNullOrEmpty(c.DefaultValue) ? "" : _blobStorage.FromAzureToBase64(c.DefaultValue).GetAwaiter().GetResult();
                    break;
                case "PatientSignature":
                    c.DefaultValue = string.IsNullOrEmpty(c.DefaultValue) ? "" : _blobStorage.FromAzureToBase64(c.DefaultValue).GetAwaiter().GetResult();
                    break;
                default:
                    break;
            }

            if (request.RequisitionId > 0 && c.Options.Count>0)
            {
                if (c.Options.Count == 1)
                {
                    c.Options.ForEach(x =>
                    {
                        x.isSelectedDefault = true;
                    });
                }
                else
                {
                    c.Options.ForEach(o =>
                    {
                        if ((c.DefaultValue ?? "").ToLower().Trim().Equals(o.Label.ToLower().Trim())
                                    || (c.DefaultValue??"").ToLower().Trim().Equals(o.Value.ToLower().Trim())
                                    )
                            o.isSelectedDefault = true;

                    });
                }

            }






            c.Options = c.Options.OrderBy(x => x.Label).ToList();
            lst.Fields = c;

            return lst;
            #endregion
        }

        public static void SaveValue<T1>(ref T1 source, string systemFieldName, ref ControlWithDependenciesClient destination)
        {
            try
            {
                var property = source.GetType().GetProperty(systemFieldName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (property == null)
                    return;

               
                    destination.DefaultValue = Convert.ToString(property.GetValue(source));
               



            }
            catch (Exception ex)
            {



            }

        }
        public static void SaveValue<T1>(ref T1 source, string systemFieldName, ref ReqOrderViewField destination)
        {
            if (source == null)
                return;
            try
            {
                var property = source.GetType().GetProperty(systemFieldName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (property == null)
                    return;


                destination.FieldValue = Convert.ToString(property.GetValue(source));




            }
            catch (Exception ex)
            {



            }

        }
        public static string SaveValue<T1>(ref T1 source, string systemFieldName)
        {
            try
            {
                var property = source.GetType().GetProperty(systemFieldName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (property == null)
                    return "";


                return Convert.ToString(property.GetValue(source));




            }
            catch (Exception ex)
            {
                return "";


            }

        }

        public List<RequisitionOrderViewResponse> ViewRequisitionOrder(int requisitionId)
        {
            var resp = new List<RequisitionOrderViewResponse>();


            // for Requistion Form
            var pageId = 6;
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == pageId).AsNoTracking().ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();

            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).AsNoTracking().ToList();

            var requsitionids = allLabSections.Select(x => x.IsReqSection).Distinct().ToList();
            var tblRequistionlst = _applicationDbContext.TblLabRequisitionTypes.Where(x => requsitionids.Contains(x.MasterRequisitionTypeId)
            && x.IsActive == true && x.IsDeleted == false && x.IsSelected == true).AsNoTracking().ToList();
            // data colletion for requisition preview


            var reqMaster = _applicationDbContext.TblRequisitionMasters.AsNoTracking().FirstOrDefault(x => x.RequisitionId == requisitionId);
            var inslst = _applicationDbContext.TblRequisitionPatientInsurances.AsNoTracking().Where(x => x.RequisitionId == requisitionId).ToList();
            var customFields = _applicationDbContext.TblRequisitionAddInfos.AsNoTracking().Where(x => x.RequisitionId == requisitionId).ToList();
            var requisitionOrderslst = _applicationDbContext.TblRequisitionOrders.AsNoTracking().Where(x => x.RequisitionId == requisitionId).ToList();
            var specimensInfoLst = _applicationDbContext.TblRequisitionSpecimensInfos.AsNoTracking().Where(x => x.RequisitionId == requisitionId).ToList();
            var AllDrugAllergies = _applicationDbContext.TblRequisitionDrugAllergyCodes.AsNoTracking().Where(x => x.RequisitionId == requisitionId).ToList();
            var AllPanels = _applicationDbContext.TblRequisitionPanels.AsNoTracking().Where(x => x.RequisitionId == requisitionId).ToList();
            var AllTests = _applicationDbContext.TblRequisitionTests.AsNoTracking().Where(x => x.RequisitionId == requisitionId).ToList();
            var allDiagnosisList = _applicationDbContext.TblRequisitionIcd10codes.AsNoTracking().Where(x => x.RequisitionId == requisitionId).ToList();








            var req = new RequisitionOrderViewResponse();


            req.ReqtypeID = 0;
            req.ReqDisplayName = "Common";
            req.Sections = new List<ReqOrderViewSections>();
            req.Sections = GetReqSectionForOrderView(0,
                allLabSections,
                allLabControls,
                requisitionId,
                reqMaster, inslst, customFields, requisitionOrderslst, specimensInfoLst, AllDrugAllergies, AllPanels, AllTests, allDiagnosisList, tblRequistionlst,null);

            /// For All Requisition Associated files


            var files = _applicationDbContext.TblRequisitionFiles.Where(x => x.RequisitionId == requisitionId).Select(s => new RequisitionFiles
            {
                FileId = s.Id,
                FileName = s.FileName,
                FileUrl = s.FileUrl,
                TypeOfFile = s.TypeOfFile,
                RequisitionId = s.RequisitionId,
                CreatedBy = s.CreatedBy,
                RequisitionType = s.RequisitionType,
                CreatedDate = s.CreatedDate


            }).ToList();

            var fs = new ReqOrderViewSections();
            fs.SectionId = 10000000;
            fs.SectionDisplayName = "Files";
            fs.SortOrder = 100000;
            fs.Fields = new List<ReqOrderViewField>();
            var ff = new ReqOrderViewField();
            ff.SystemFieldName = "files";
            ff.DisplayType = "col-lg-12 col-sm-12";
            ff.FieldName = JsonConvert.SerializeObject(files);
            fs.Fields.Add(ff);
            req.Sections.Add(fs);

            // ends






            resp.Add(req);






            return resp;
        }

        private List<ReqOrderViewSections> GetReqSectionForOrderView(int ReqId, List<TblLabPageSection> allLabSections,
            List<TblLabSectionControl> allLabControls,
            int requisitionId, TblRequisitionMaster? reqMaster,
            List<TblRequisitionPatientInsurance> inslst, List<TblRequisitionAddInfo> customFields,
            List<TblRequisitionOrder> requisitionOrderslst, List<TblRequisitionSpecimensInfo> specimensInfoLst,
            List<TblRequisitionDrugAllergyCode> allDrugAllergies, List<TblRequisitionPanel> allPanels, List<TblRequisitionTest> allTests,
            List<TblRequisitionIcd10code> allDiagnosisList, List<TblLabRequisitionType> tblRequistionlst, TblRequisitionOrder reqOrder)
        {
            var sections = new List<ReqOrderViewSections>();
            List<TblLabPageSection> reqSections = new List<TblLabPageSection>();
            reqSections = allLabSections.Where(x => x.IsReqSection == ReqId).ToList();
            foreach (var section in reqSections)
            {
                if (!section.IsSelected??false)
                    continue;
                if (!section.OrderViewSortOrder.HasValue)
                    continue;
                var sec = new ReqOrderViewSections();
                sec.SectionId = section.SectionId ?? 0;
                sec.SectionDisplayName = section.SectionName;
                sec.SortOrder = section.OrderViewSortOrder ?? 0;
                sec.SectionDisplayType = section.OrderViewDisplayType;
                sec.Fields = new List<ReqOrderViewField>();

                switch (section.SectionId)
                {
                    case 5:
                        sec.Fields = GetOrderViewBillingSectionFields(requisitionId,
                 section,
                 allLabControls,
                 reqMaster,
                 inslst,
                 customFields,
                 allLabSections);
                        break;
                    case 24:// for requisition
                        sec.Requistions = GetAllRequisitionSections(allLabSections,
                        allLabControls,
                        requisitionId,
                        reqMaster, inslst, customFields, requisitionOrderslst, specimensInfoLst,
                        allDrugAllergies, allPanels, allTests, allDiagnosisList, tblRequistionlst);
                        break;
                    case 7://Specimen Type section
                        sec.Fields = GetSpecimenInformationSectionForOrderView(section, allLabControls, specimensInfoLst, customFields, reqOrder).OrderBy(x=>x.SortOrder).ToList();
                        break;

                    //case 6://lab InformationSection
                    //    sectionWithControls.Fields = GetLabSectionInformation(sectionFields,
                    //        labInfo,
                    //        allLabReqControls,
                    //        allLabControlOptions,
                    //        allLabDepedencyControlOPtion,
                    //        AlltblControlTypeInfo,
                    //        labinfoassignment,
                    //        request,
                    //        reqOrder,
                    //        reqAddInfosLst
                    //        );
                    //    break;
                    //case 7://Specimen Type section

                    //    sectionWithControls.Fields = GetSpecimenInformationSection(sectionFields,
                    //        allLabReqControls,
                    //        allLabControlOptions,
                    //        allLabDepedencyControlOPtion,
                    //        AlltblControlTypeInfo,
                    //        labinfoassignment,
                    //         request, reqOrder, reqAddInfosLst, ReqSpecimensInfo
                    //        );
                    //    break;
                    //case 9:// Drug Allergies section
                    //    sectionWithControls.Fields = GetDrugAllergiesSection(sectionFields,
                    //       allLabReqControls,
                    //       allLabControlOptions,
                    //       allLabDepedencyControlOPtion,
                    //       AlltblControlTypeInfo,
                    //       labinfoassignment, request, reqOrder, reqAddInfosLst, reqDrugAllergies
                    //       );
                    //    break;
                    //case 10: // Testing option Section
                    //    sectionWithControls.Fields = GetCompendiumForRequitions(sectionFields,
                    //      allLabReqControls,
                    //      allLabControlOptions,
                    //      allLabDepedencyControlOPtion,
                    //      AlltblControlTypeInfo,
                    //      labinfoassignment,
                    //      request, reqOrder, reqAddInfosLst, reqPanels, reqTests
                    //      );
                    //    var panelIdsnestedlst = sectionWithControls.Fields.Select(x => x.Panels.Select(x => x.PanelID).ToList()).ToList();
                    //    var panelIdsString = panelIdsnestedlst.SelectMany(x => x).ToList();
                    //    var panelIds = panelIdsString.Select(x => (int?)Convert.ToInt32(x)).ToList();
                    //    PanelIdslstForICDs.AddRange(panelIds);
                    //    break;
                    //case 12:
                    //    sectionWithControls.Fields = GetIcd10sForRequitions(sectionFields,
                    //    allLabReqControls,
                    //    allLabControlOptions,
                    //    allLabDepedencyControlOPtion,
                    //    AlltblControlTypeInfo,
                    //    labinfoassignment,
                    //    PanelIdslstForICDs,
                    //    request, reqOrder, reqAddInfosLst, reqDiagnosisList
                    //    );
                    //    break;



                    default:
                        sec.Fields = GetOrderViewSectionFields(requisitionId,
                  section,
                  allLabControls,
                  reqMaster,
                  customFields, allLabSections, reqOrder);
                        break;
                }




                sections.Add(sec);


            }

          


            return sections;
        }

        private List<ReqOrderViewField> GetSpecimenInformationSectionForOrderView(TblLabPageSection section, List<TblLabSectionControl> allLabControls,
            List<TblRequisitionSpecimensInfo> specimensInfoLst, List<TblRequisitionAddInfo> customFields, TblRequisitionOrder reqOrder)
        {
            var respfields = new List<ReqOrderViewField>();
            var fields = allLabControls.Where(x => x.SectionId == section.SectionId).ToList();

            var sepecimentInfo = _applicationDbContext.TblRequisitionSpecimensInfos.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId);

            var specimenInfoField = new ReqOrderViewField();

            specimenInfoField.SystemFieldName = "SpecimenInformation";
            specimenInfoField.SortOrder = 0;
            specimenInfoField.FieldName = "Collection";

            var specimenInformation = _applicationDbContext.TblRequisitionSpecimensInfos.AsNoTracking().Where(x=>x.RequisitionOrderId==reqOrder.RequisitionOrderId).ToList();

           var specimenTypeInfo=_applicationDbContext.TblSpecimenTypes.AsNoTracking().ToList();

            var splst = new List<OrderViewSpecimenInformationResponse>();
            foreach (var sp in specimenInformation)
            {
                var a = new OrderViewSpecimenInformationResponse();
                a.AccessionNo = sp.SpecimenId;
                a.SpecimenType = specimenTypeInfo.FirstOrDefault(x => x.SpecimenTypeId == sp.SpecimenType)?.SpecimenType ?? "";
                splst.Add(a);

            }
            specimenInfoField.FieldValue = splst;
            respfields.Add(specimenInfoField);
         //   var df = new ReqOrderViewField();











            foreach (var f in fields)
            {

                if (!f.IsVisible ?? false) continue;

              

                var rf = new ReqOrderViewField();

                rf.SortOrder = f.OrderViewSortOrder??99999;
                rf.DisplayType = f.OrderViewDisplayType;
                if (f.TypeOfSection == SectionType.SystemFields.ToString())
                    continue;                
                else
                {
                    var customData = customFields.FirstOrDefault(x => x.KeyId.ToLower().Equals(f.ControlKey));
                    if (customData == null)
                        continue;
                    rf.ControlId = customData.ControlId ?? 0;
                    rf.FieldName = customData.KeyValue;
                    rf.SystemFieldName = customData.KeyId;
                    rf.FieldValue = Convert.ToString(customData.ControlValue);
                }

                respfields.Add(rf);

            }
            respfields = respfields.OrderBy(x => x.SortOrder).ToList();

            return respfields;
        }

        private List<RequisitionOrderViewResponse> GetAllRequisitionSections(List<TblLabPageSection> allLabSections, List<TblLabSectionControl> allLabControls, 
            int requisitionId, TblRequisitionMaster? reqMaster, List<TblRequisitionPatientInsurance> inslst, List<TblRequisitionAddInfo> customFields,
            List<TblRequisitionOrder> requisitionOrderslst, List<TblRequisitionSpecimensInfo> specimensInfoLst,
            List<TblRequisitionDrugAllergyCode> allDrugAllergies, List<TblRequisitionPanel> allPanels, List<TblRequisitionTest> allTests,
            List<TblRequisitionIcd10code> allDiagnosisList, List<TblLabRequisitionType> tblRequistionlst)
        {
           
            var rsp= new List<RequisitionOrderViewResponse>();

            foreach (var reqOrder in requisitionOrderslst)
            {

                var reqType = tblRequistionlst.FirstOrDefault(x => x.ReqTypeId == reqOrder.ReqTypeId);
                if (reqType == null)
                    continue;
                var req = new RequisitionOrderViewResponse();
                req.ReqtypeID = reqType.MasterRequisitionTypeId;
                req.ReqDisplayName = reqType.RequisitionTypeName;
                req.Sections = GetReqSectionForOrderView(reqType.MasterRequisitionTypeId,
               allLabSections,
               allLabControls,
               requisitionId,
               reqMaster, inslst, customFields, requisitionOrderslst, specimensInfoLst, allDrugAllergies, allPanels, allTests, allDiagnosisList, tblRequistionlst,reqOrder);
                rsp.Add(req);
            }





            return rsp;

        }

        private List<ReqOrderViewField> GetOrderViewBillingSectionFields(int requisitionId, TblLabPageSection section, List<TblLabSectionControl> allLabControls,
            TblRequisitionMaster? reqMaster, List<TblRequisitionPatientInsurance> inslst, 
            List<TblRequisitionAddInfo> customFields, List<TblLabPageSection> allLabSections)
        {
            var respfields = new List<ReqOrderViewField>();
            var fields = allLabControls.Where(x => x.SectionId == section.SectionId).ToList();


            // foreach (var ins in inslst)
            for (int i = 0; i < inslst.Count; i++)// foreach will not work here 
            
            {
                var insuraceSaved = inslst[i];// 


                foreach (var f in fields)
                {
                    
                    if (!f.IsVisible ?? false) continue;

                    if (f.ControlKey.ToLower().Trim().Equals("PhotosForInsuranceCard".ToLower().Trim()) ||
                        f.ControlKey.ToLower().Trim().Equals("PhotoForDemographicInfo".ToLower().Trim())
                        ) continue;

                   

                    var rf = new ReqOrderViewField();

                    rf.SortOrder = f.OrderViewSortOrder ?? 99999;
                    rf.DisplayType = f.OrderViewDisplayType;
                    if (f.TypeOfSection == SectionType.SystemFields.ToString())
                    {
                        rf.ControlId = f.ControlId ?? 0;
                        rf.FieldName = f.ControlName;
                        rf.SystemFieldName = f.ControlKey;
                        

                        rf.FieldValue = SaveValue<TblRequisitionPatientInsurance>(ref insuraceSaved, rf.SystemFieldName);

                        if(rf.SystemFieldName== "InsuranceProviderID")
                        {
                            int selectedInsuranceID = Convert.ToInt32(rf.FieldValue ?? "0");
                          var insInfo=  _masterDbContext.TblInsuranceProviders.FirstOrDefault(x => x.InsuranceProviderId == selectedInsuranceID);
                            rf.FieldValue = insInfo?.ProviderName ?? "";
                        }




                    }
                    else
                    {
                        var customData = customFields.FirstOrDefault(x => x.KeyId.ToLower().Equals(f.ControlKey));
                        if (customData == null)
                            continue;
                        rf.ControlId = customData.ControlId?? 0;
                        rf.FieldName = customData.KeyValue;
                        rf.SystemFieldName = customData.KeyId;
                        rf.FieldValue = Convert.ToString(customData.ControlValue);
                    }

                    respfields.Add(rf);

                }
            }


            if (!string.IsNullOrEmpty(section.OrderViewMergeSections))// For Merge Section View
            {

                var mergedSectionsIds = section.OrderViewMergeSections.Split(',').ToList();
                foreach (var sectionID in mergedSectionsIds)
                {
                    var mergeSection = allLabSections.FirstOrDefault(x => x.SectionId == Convert.ToInt32(sectionID));
                    if (mergeSection == null)
                        continue;
                    var mergedFields = GetOrderViewSectionFields(requisitionId, mergeSection, allLabControls, reqMaster, customFields, allLabSections,null);
                    respfields.AddRange(mergedFields);
                }

            }




            return respfields;
       
        
        }

        private List<ReqOrderViewField> GetOrderViewSectionFields(int requisitionId, 
            TblLabPageSection section,
            List<TblLabSectionControl> allLabControls,
            TblRequisitionMaster? reqMaster,
            List<TblRequisitionAddInfo> customFields,
            List<TblLabPageSection> allLabSections,
            TblRequisitionOrder reqOrder)
        {
            Sevices.MasterEntities.TblLab labinfo = null;
            
            var respfields= new List<ReqOrderViewField>();
            var fields = allLabControls.Where(x => x.SectionId == section.SectionId).ToList();
            switch (section.SectionId)
            {
                case 9:// Drug Allergies section
                    if (reqOrder != null)
                    {
                        var rf = new ReqOrderViewField();

                        rf.SortOrder = 0;
                        rf.ControlId = 0;
                        rf.FieldName = "";
                        rf.SystemFieldName = "DrugAllergies";
                        rf.DisplayType = "";
                        rf.FieldValue = _applicationDbContext.TblRequisitionDrugAllergyCodes
                            .AsNoTracking().Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId)
                            .Select(x => x.DrugAllergiesDescription).ToList();
                        respfields.Add(rf);
                        return respfields;
                    }
                    break;


                default:
                    break;
            }


            foreach (var f in fields)
            {
                if(!f.IsVisible??false) continue;

                var rf = new ReqOrderViewField();

                if (respfields.Any(x => x.SystemFieldName == f.ControlKey))
                    continue;


                rf.SortOrder = f.OrderViewSortOrder??9999;
                rf.ControlId = f.ControlId??0;
                rf.FieldName = f.ControlName;
                rf.SystemFieldName = f.ControlKey;
                rf.DisplayType = f.OrderViewDisplayType;

                if (f.TypeOfSection == SectionType.SystemFields.ToString())
                {
                    rf.FieldValue = SaveValue<TblRequisitionMaster>(ref reqMaster, rf.SystemFieldName);
                   
                    switch (rf.SystemFieldName)
                    {
                        case "FacilityID":
                            var value = SaveValue<TblRequisitionMaster>(ref reqMaster, rf.SystemFieldName);
                            rf.FieldValue = _applicationDbContext.TblFacilities.AsNoTracking().FirstOrDefault(x => x.FacilityId == Convert.ToInt32(value))?.FacilityName ?? "";
                            break;
                        case "PhysicianID":
                            var ProviderID = SaveValue<TblRequisitionMaster>(ref reqMaster, rf.SystemFieldName);
                            var user = _masterDbContext.TblUsers.AsNoTracking().FirstOrDefault(x => x.Id == Convert.ToString(ProviderID));//?.FirstName ?? "";
                            rf.FieldValue = $"{user?.FirstName} {user?.LastName}"; 
                            break;
                        case "CollectorID":
                            var ColectorID = SaveValue<TblRequisitionMaster>(ref reqMaster, rf.SystemFieldName);
                            var Collector = _masterDbContext.TblUsers.AsNoTracking().FirstOrDefault(x => x.Id == Convert.ToString(ColectorID));//?.FirstName ?? "";
                            rf.FieldValue = $"{Collector?.FirstName} {Collector?.LastName}";
                            break;
                        case "LabID":
                            rf.FieldValue = SaveValue<TblRequisitionOrder>(ref reqOrder, rf.SystemFieldName);
                            int laid = Convert.ToInt32(rf.FieldValue);
                            labinfo = _masterDbContext.TblLabs.FirstOrDefault(x => x.LabId == laid);
                            continue;
                            break;
                        case "LabName":
                            rf.FieldValue = labinfo?.DisplayName;
                            break;
                        case "LabType":
                            if (rf.FieldValue == "0")
                                rf.FieldValue = "In-House";
                            else
                                rf.FieldValue = "Reference Lab";
                            break;
                        case "ICDPanels":
                            rf.FieldValue = _applicationDbContext.TblRequisitionIcd10codes
                                .Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId)
                                .Select(x => new ICD10CodeModel {
                            Code=x.Icd10code,
                            Description=x.Icd10description,
                            icd10id=0
                            
                            }).ToList();
                            break;
                        case "Compendium":
                            rf.FieldValue = GetCompendiumForOrderView(reqOrder);

                            break;
                        case "PhysicianSignature":

                            rf.FieldValue = string.IsNullOrEmpty(rf.FieldValue) ? "" : _blobStorage.FromAzureToBase64(rf.FieldValue).GetAwaiter().GetResult();
                            break;
                        case "PatientSignature":
                            rf.FieldValue = string.IsNullOrEmpty(rf.FieldValue) ? "" : _blobStorage.FromAzureToBase64(rf.FieldValue).GetAwaiter().GetResult();
                            break;
                        default:
                            SaveValue<TblRequisitionMaster>(ref reqMaster, rf.SystemFieldName, ref rf);
                            SaveValue<TblRequisitionOrder>(ref reqOrder, rf.SystemFieldName, ref rf); 
                            break;

                    }
                }
                else
                {

                    var ReqOrderID = reqOrder == null ? 0 : reqOrder.RequisitionOrderId;
                        var customData = customFields.FirstOrDefault(x => x.KeyId.ToLower().Trim().Equals(f.ControlKey.ToLower().Trim())&& x.RequisitionOrderId== ReqOrderID);
                        if (customData == null)
                            continue;
                        rf.ControlId = customData.ControlId ?? 0;
                        rf.FieldName = customData.KeyValue;
                        rf.SystemFieldName = customData.KeyId;
                        rf.FieldValue = Convert.ToString(customData.ControlValue);
                    
                }


                respfields.Add(rf);

            }

            if(!string.IsNullOrEmpty(section.OrderViewMergeSections))// For Merge Section View
            {

                var mergedSectionsIds=section.OrderViewMergeSections.Split(',').ToList();
                foreach (var sectionID in mergedSectionsIds)
                {
                    var mergeSection = allLabSections.FirstOrDefault(x => x.SectionId == Convert.ToInt32(sectionID));
                    if (mergeSection==null)
                        continue;
                        var mergedFields = GetOrderViewSectionFields(requisitionId, mergeSection, allLabControls,reqMaster, customFields, allLabSections, reqOrder);
                    respfields.AddRange(mergedFields);
                }

            }


            respfields = respfields.OrderBy(x => x.SortOrder).ToList();



            return respfields;
        }

        private List<OrderViewPanelShowResponse> GetCompendiumForOrderView(TblRequisitionOrder? reqOrder)
        {
            var AllPanels = _applicationDbContext.TblRequisitionPanels.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
            var allTests = _applicationDbContext.TblRequisitionTests.Where(x => x.RequisitionOrderId == reqOrder.RequisitionOrderId).ToList();
            var panelLst = new List<OrderViewPanelShowResponse>();
            foreach (var panel in AllPanels)
            {
                var p = new OrderViewPanelShowResponse();
                p.PanelName=panel.PanelName;
                p.TestingOptions = allTests.Where(x => x.PanelId == panel.PanelId).Select(x => x.TestName).ToList();
                panelLst.Add(p);

            }
            return panelLst;
        }

        // public static void SaveValueCustomFieldValue( T1 source, string systemFieldName, ref ControlWithDependenciesClient destination)
    }
}
