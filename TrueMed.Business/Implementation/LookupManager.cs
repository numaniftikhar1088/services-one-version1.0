using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using System.Linq;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Cache;
using TrueMed.Domain.Models.Common;
using TrueMed.Domain.Models.LookUps;
using TrueMed.Domain.Models.LookUps.Common;

namespace TrueMed.Business.Implementation
{
    public class LookupManager : ILookupManager
    {
        private readonly IConnectionManager _connectionManager;
        private readonly ICacheManager _cacheManager;
        private MasterDbContext _masterDbContext;
        private ApplicationDbContext _applicationDbContext;

        public LookupManager(ICacheManager cacheManager,
            MasterDbContext masterDbContext,
            ApplicationDbContext applicationDbContext,
            IConnectionManager connectionManager)
        {
            _cacheManager = cacheManager;
            _masterDbContext = masterDbContext;
            _applicationDbContext = applicationDbContext;
            _connectionManager = connectionManager;
        }
        public async Task<List<CollectorLookupBasedOnFacilityIdResponse>> CollectorLookupBasedOnFacilityId(int id)
        {
            var response = new List<CollectorLookupBasedOnFacilityIdResponse>();

            var users = _applicationDbContext.TblFacilityUsers.Where(f => f.FacilityId == id).Select(s => s.UserId).ToList();
            var lookupResponse = await _masterDbContext.TblUsers.Where(f => users.Contains(f.Id)).Select(s => new CollectorLookupBasedOnFacilityIdResponse() { Id = s.Id, Name = s.FirstName + " " + s.LastName }).ToListAsync();
            response = lookupResponse.OrderBy(o => o.Name).ToList();
            return response;
        }
        public async Task<List<AllFacilityUserResponse>> GetUserFacilityUserByRole_Lookup(int RoleId)
        {
            var response = new List<AllFacilityUserResponse>();

            var allUsers = _applicationDbContext.TblFacilityUsers.AsNoTracking().Join(_applicationDbContext.TblUserRoles, x => x.UserId, y => y.UserId, (x, y) => new
            {
                x,
                y
            }).Where(j => j.y.RoleId == RoleId).ToList();
            var users = allUsers.Select(x => x.x.UserId).Distinct().ToList();
            var masterUser = await _masterDbContext.TblUsers.AsNoTracking().Where(f => users.Contains(f.Id)).Select(s => new CollectorLookupBasedOnFacilityIdResponse() { Id = s.Id, Name = s.FirstName + " " + s.LastName }).ToListAsync();
            foreach (var user in allUsers.Select(j=>j.x).ToList())
            {
              
                var muser = masterUser.FirstOrDefault(x => x.Id == user.UserId);
                if (muser == null)
                    continue;
                var a = new AllFacilityUserResponse();
                a.FacilityID = user.FacilityId;
                a.Id = muser.Id;
                a.Name = muser.Name;
                response.Add(a);
            }

            response = response.OrderBy(o => o.Name).ToList();
            return response;
        }
        public async Task<List<CommonLookupResponse>> CompendiumPanel_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _applicationDbContext.TblCompendiumPanels.Where(f => f.IsDeleted == false).Select(s => new CommonLookupResponse() { Label = s.PanelName, Value = s.Id }).OrderBy(o => o.Label).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<CommonLookupResponse>> ControlOptionsByControlId_Lookup(int controlId)
        {
            var response = new List<CommonLookupResponse>();
            var lookupResponse = await _masterDbContext.TblControlOptions.Where(f => f.ControlId == controlId).Select(s => new CommonLookupResponse() { Label = s.OptionName, Value = s.OptionId }).ToListAsync();
            response = lookupResponse;
            return response;
        }
        public async Task<List<CommonLookupResponse>> ControlOptionsByLabIdAndControlId_Lookup(int labId, int controlId)
        {
            var response = new List<CommonLookupResponse>();
            var lookupResponse = await _applicationDbContext.TblLabControlOptions.Where(f => f.ControlId == controlId && f.LabId == labId).Select(s => new CommonLookupResponse() { Label = s.OptionName, Value = s.OptionId }).ToListAsync();
            response = lookupResponse;
            return response;
        }
        public async Task<List<CommonLookupResponse>> ControlOptionsByOptionId_Lookup(int optionId)
        {
            var response = new List<CommonLookupResponse>();
            var lookupResponse = await _applicationDbContext.TblLabControlOptions.Where(f => f.OptionId == optionId).Select(s => new CommonLookupResponse() { Label = s.OptionName, Value = s.OptionId }).ToListAsync();
            response = lookupResponse;
            return response;
        }
        public async Task<List<CommonLookupResponse>> GetInsurancesByInsuraceType(int typeId, string LabKey)
        {
            var response = new List<CommonLookupResponse>();
            var cacheGetResponse = await _cacheManager.GetAsync<List<InsuraceProviderCacheViewModel>>($"{LabKey}_InsuranceList");
            if (!cacheGetResponse.IsSuccess)
            {
                var lookupResponse = await _applicationDbContext.TblInsuranceAssignments.Select(s => new InsuraceProviderCacheViewModel()
                { InsuranceDisplayName = s.ProviderDisplayName ?? "", InsruranceProviderID = s.ProviderId ?? 0, InsranceTypeID = s.InsuranceId ?? 0 }).ToListAsync();

                var cacheSetRespone = await _cacheManager.SetAsync<List<InsuraceProviderCacheViewModel>>($"{LabKey}_InsuranceList", lookupResponse);
                cacheGetResponse = await _cacheManager.GetAsync<List<InsuraceProviderCacheViewModel>>($"{LabKey}_InsuranceList");
            }

            if (typeId == 0)
                response = cacheGetResponse.Value.Select(x => new CommonLookupResponse { Label = x.InsuranceDisplayName, Value = x.InsruranceProviderID }).DistinctBy(x => x.Value).ToList();
            else
                response = cacheGetResponse.Value.Where(x => x.InsranceTypeID == typeId)
                    .Select(x => new CommonLookupResponse { Label = x.InsuranceDisplayName, Value = x.InsruranceProviderID })
                    .DistinctBy(x => x.Value).ToList();
            return response.OrderBy(x=>x.Label).ToList();

        }
        public async Task<List<CommonLookupResponse>> ICD10CodeLookup()
        {
            var response = new List<CommonLookupResponse>();
            var cacheGetResponse = await _cacheManager.GetAsync<List<CommonLookupResponse>>($"{nameof(ICD10CodeLookup)}");
            if (cacheGetResponse.IsSuccess)
            {
                response = cacheGetResponse.Value;
                return response;
            }
            var lookupResponse = await _masterDbContext.TblIcd10codes.Select(s => new CommonLookupResponse() { Label = s.Icd10code, Value = s.Icd10id }).ToListAsync();
            response = lookupResponse;
            var cacheSetRespone = await _cacheManager.SetAsync<List<CommonLookupResponse>>($"{nameof(ICD10CodeLookup)}", response);
            return response;
        }
        public async Task<List<ICD10CodeModel>> ICD10CodeSearch(string query, int Key)
        {
            var response = new List<ICD10CodeModel>();
            var cacheGetResponse = await _cacheManager.GetAsync<List<ICD10CodeModel>>($"TrueMedICD10Codes");
            if (!cacheGetResponse.IsSuccess)
            {
                var lookupResponse = await _masterDbContext.TblIcd10codes.Select(s => new ICD10CodeModel() { icd10id = s.Icd10id, Code = s.Icd10code, Description = s.Description }).ToListAsync();

                var cacheSetRespone = await _cacheManager.SetAsync<List<ICD10CodeModel>>($"TrueMedICD10Codes", lookupResponse);
                cacheGetResponse = await _cacheManager.GetAsync<List<ICD10CodeModel>>($"TrueMedICD10Codes");
            }

            if (Key == 0)
                response = cacheGetResponse.Value.Where(x => x.Code.ToLower().Trim().StartsWith(query.ToLower().Trim())).Take(20).ToList();
            else
                response = cacheGetResponse.Value.Where(x => x.Description.ToLower().Trim().Contains(query.ToLower().Trim())).Take(20).ToList();
            return response;
        }
        public async Task<List<CommonLookupResponse>> Lab_SideRoles_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _applicationDbContext.TblRoles.Where(f => f.IsDeleted == false).Select(s => new CommonLookupResponse() { Label = s.Name, Value = s.Id }).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<CommonLookupResponse>> OptionsLookup(string? userType)
        {
            var response = new List<CommonLookupResponse>();
            if (userType != null)
                response = await _masterDbContext.TblOptionLookups.Where(f => f.UserType.Trim().ToLower().Equals(userType.Trim().ToLower())).Select(s => new CommonLookupResponse() { Label = s.Name, Value = s.Id }).OrderBy(o=> o.Label).ToListAsync();
            else
                response = await _masterDbContext.TblOptionLookups.Select(s => new CommonLookupResponse() { Label = s.Name, Value = s.Id }).OrderBy(a=>a.Label).ToListAsync();
    //          
            return response;
        }
        public async Task<List<CommonLookupResponse>> RequisitionType_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _applicationDbContext.TblLabRequisitionTypes.Where(f => f.IsDeleted == false && f.IsSelected == true && f.IsActive.Equals(true)).Select(s => new CommonLookupResponse() { Label = s.RequisitionTypeName, Value = s.ReqTypeId }).OrderBy(o => o.Label).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<CommonLookupResponse>> Master_RequisitionType_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _masterDbContext.TblRequisitionTypes.Where(f => f.IsDeleted == false).Select(s => new CommonLookupResponse() { Label = s.RequisitionTypeName, Value = s.ReqTypeId }).OrderBy(o => o.Label).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<CommonLookupResponse>> RequisitionTypeColor_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _applicationDbContext.TblLabRequisitionTypes.Where(f => f.IsDeleted == false).Select(s => new CommonLookupResponse() { Label = s.RequisitionColor, Value = s.ReqTypeId }).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<CommonLookupResponse>> TestCodeLookup(string? tmitCode)
        {
            var response = new List<CommonLookupResponse>();

            if (!string.IsNullOrEmpty(tmitCode))
                response = await _applicationDbContext.TblCompendiumTests.Where(f => f.Tmitcode != null && f.Tmitcode.ToLower().Contains(tmitCode.ToLower()) && f.IsActive == true).Select(s => new CommonLookupResponse() { Label = s.Tmitcode, Value = s.Id }).ToListAsync();
            else
                response = await _applicationDbContext.TblCompendiumTests.Where(f => f.IsActive == true).Select(s => new CommonLookupResponse() { Label = s.Tmitcode, Value = s.Id }).ToListAsync();

            return response;
        }
        public async Task<List<dynamic>> ReferenceLab_Lookup(int labId)
        {
            var response = new List<dynamic>();
            if (labId == 0)
            {
                var allResult = await _applicationDbContext.TblLabs.Select(s => new
                {
                    Value = s.LabId,
                    Label = s.LaboratoryName

                }).OrderBy(o => o.Label).ToListAsync();
                response.Add(allResult);
            }
            else
            {
                var basedOnLabId = await _applicationDbContext.TblLabs.Where(f => f.LabId == labId).Select(s => new
                {
                    LabType = s.IsReferenceLab == true ? "Reference Lab" : "Master Lab",
                    Code = s.LabId

                }).ToListAsync();
                response.Add(basedOnLabId);
            }
            return response;
        }
        public async Task<List<CommonLookupResponse>> TestGroup_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _applicationDbContext.TblCompendiumGroups.Where(f => f.IsDeleted == false).Select(s => new CommonLookupResponse() { Label = s.GroupName, Value = s.Id }).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<CommonLookupResponse>> RequisitionColorByReqTypeId_Lookup(int reqTypeId)
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _masterDbContext.TblRequisitionTypes.Where(f => f.IsDeleted == false && f.ReqTypeId.Equals(reqTypeId)).Select(s => new CommonLookupResponse() { Label = s.RequisitionColor, Value = s.ReqTypeId }).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<FacilityLookupResponse>> Facility_Lookup()
        {
            var response = new List<FacilityLookupResponse>();

            var facilitySystemLookup = await _masterDbContext.TblOptionLookups.Where(f => f.UserType.Trim().ToUpper() == "FACILITY").Select(s => s.Id).ToListAsync();
            //var adminSystemLookup = await _masterDbContext.TblOptionLookups.Where(f => f.UserType.Trim().ToUpper() == "ADMIN").Select(s => s.Id).ToListAsync();
            var getLoggedInUser = _masterDbContext.TblUsers.Where(f => f.Id == _connectionManager.UserId).FirstOrDefault();
            var getLoggedInUserAdminType = Convert.ToInt32(getLoggedInUser?.AdminType);
            //var isReferenceLabAdminUser = _masterDbContext.TblUserAdditionalInfos.Any(f => f.UserId == getLoggedInUser.Id
            //&& f.IsReferenceLabUser == true);

            if (facilitySystemLookup.Contains(getLoggedInUserAdminType))
            {
                var getFacilityIdsAgainstUser = _applicationDbContext.TblFacilityUsers.Where(f => f.UserId == _connectionManager.UserId).Select(s => s.FacilityId).ToList();
                response = await _applicationDbContext.TblFacilities.Where(f => getFacilityIdsAgainstUser.Contains(f.FacilityId) && f.IsDeleted == false).Select(s => new FacilityLookupResponse() { FacilityId = s.FacilityId, FacilityName = s.FacilityName + " - " + s.Address }).OrderBy(o => o.FacilityName).ToListAsync();
            }
            //else if (adminSystemLookup.Contains(getLoggedInUserAdminType) && isReferenceLabAdminUser)
            //{

            //}
            else
            {
                response = await _applicationDbContext.TblFacilities.Where(f => f.IsDeleted == false && f.Status.Trim().ToLower()== "Active".ToLower()).Select(s => new FacilityLookupResponse() { FacilityId = s.FacilityId, FacilityName = s.FacilityName + " - " + s.Address }).ToListAsync();
            }

            return response;
        }
        public async Task<List<CommonLookupResponse>> Module_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _masterDbContext.TblModules.Select(s => new CommonLookupResponse() { Label = s.Name, Value = s.Id }).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<dynamic>> DrugAllergiesCode_Lookup(string? description)
        {
            var response = new List<dynamic>();
            if (description == null)
            {
                var getOnlyDescription = await _masterDbContext.TblDrugAllergies.Select(s => new
                {
                    Description = s.Description

                }).ToListAsync();
                response.Add(getOnlyDescription);
            }
            else
            {
                var getOnlyCodeByDescription = await _masterDbContext.TblDrugAllergies.Where(f => f.Description.Trim().ToLower() == description.Trim().ToLower()).Select(s => new
                {
                    Code = s.Dacode

                }).OrderBy(o => o.Code).ToListAsync();
                response.Add(getOnlyCodeByDescription);
            }
            return response;
        }
        public async Task<List<CommonLookupResponse>> GetOnlyReferenceLab_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _masterDbContext.TblLabs.Where(f => f.IsDeleted == false && f.IsReferenceLab == true).Select(s => new CommonLookupResponse() { Label = s.LaboratoryName, Value = s.LabId }).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<CommonLookupResponse>> Master_CompendiumPanel_Lookup()
        {
            var response = new List<CommonLookupResponse>();

            var lookupResponse = await _masterDbContext.TblCompendiumPanels.Where(f => f.IsDeleted == false).Select(s => new CommonLookupResponse() { Label = s.PanelName, Value = s.Id }).ToListAsync();
            response = lookupResponse;

            return response;
        }
        public async Task<List<CommonLookupResponse>> LoggedUserAssignLabs()
        {
            var response = new List<CommonLookupResponse>();

            var getAssignLabIds = await _masterDbContext.TblLabUsers.IgnoreQueryFilters().ToListAsync();
            var labIdsWithoutDelete = getAssignLabIds.Where(f => f.UserId == _connectionManager.UserId && f.IsActive == true && f.IsDeleted == false).Select(s => s.LabId).ToList();
            var labs = await _masterDbContext.TblLabs.IgnoreQueryFilters().ToListAsync();
            var contaningLabs = labs.Where(f => labIdsWithoutDelete.Contains(f.LabId) && f.IsActive == true && f.IsDeleted == false).ToList();
            foreach (var lab in contaningLabs)
            {
                var commonLkupObj = new CommonLookupResponse();
                commonLkupObj.Label = lab.LaboratoryName;
                commonLkupObj.Value = lab.LabId;
                response.Add(commonLkupObj);
            }
            return response;
        }
        public List<US_State> USStates_Lookup()
        {
            return USStates.States().ToList();
        }
        public async Task<List<CommonLookupResponse>> GroupLookup()
        {
            var response = new List<CommonLookupResponse>();
            var cacheGetResponse = await _cacheManager.GetAsync<List<CommonLookupResponse>>($"{nameof(GroupLookup)}");
            if (cacheGetResponse.IsSuccess)
            {
                response = cacheGetResponse.Value;
                return response;
            }
            var lookupResponse = await _applicationDbContext.TblCompendiumGroups.Where(f => f.IsDeleted == false && f.IsActive == true)
                .Select(s => new CommonLookupResponse()
                {
                    Value = s.Id,
                    Label = s.GroupName

                }).OrderBy(o => o.Label).ToListAsync();
            response = lookupResponse;
            var cacheSetRespone = await _cacheManager.SetAsync<List<CommonLookupResponse>>($"{nameof(ICD10CodeLookup)}", response);
            return response;
        }
        public async Task<List<CommonLookupResponse>> ReferenceLabLookup()
        {
            var response = new List<CommonLookupResponse>();

            var getSystemLookup = await _masterDbContext.TblOptionLookups.Where(f => f.UserType.ToUpper().Trim() == "FACILITY").Select(s => s.Id).ToListAsync();
            var getuserAdminType = Convert.ToInt32(await _masterDbContext.TblUsers.Where(f => f.Id == _connectionManager.UserId).Select(s => s.AdminType).FirstOrDefaultAsync());

            if (getSystemLookup.Contains(getuserAdminType))
            {
                var cacheGetResponse = await _cacheManager.GetAsync<List<CommonLookupResponse>>($"FACILITY_{nameof(ReferenceLabLookup)}");
                if (cacheGetResponse.IsSuccess)
                {
                    response = cacheGetResponse.Value;
                    return response;
                }
                var labIdsByUser = await _masterDbContext.TblLabUsers.Where(f => f.UserId.Equals(_connectionManager.UserId) && f.IsDeleted == false && f.IsActive == true).Select(s => s.LabId).ToListAsync();
                response = await _masterDbContext.TblLabs.Where(f => labIdsByUser.Contains(f.LabId) && f.IsDeleted.Equals(false)).Select(s => new CommonLookupResponse()
                {
                    Value = s.LabId,
                    Label = s.DisplayName

                }).OrderBy(o => o.Label).ToListAsync();
            }
            else
            {
                var cacheGetResponse = await _cacheManager.GetAsync<List<CommonLookupResponse>>($"ADMIN_{nameof(ReferenceLabLookup)}");
                if (cacheGetResponse.IsSuccess)
                {
                    response = cacheGetResponse.Value;
                    return response;
                }
                response = await _masterDbContext.TblLabs.Where(f => f.IsDeleted.Equals(false)).Select(s => new CommonLookupResponse()
                {
                    Value = s.LabId,
                    Label = s.DisplayName

                }).OrderBy(o => o.Label).ToListAsync();
            }
            return response;
        }
        public async Task<List<CommonLookupResponse<string>>> DrugAllergiesBasedOnLabAssignment(string drugName)
        {
            var response = new List<CommonLookupResponse<string>>();
            var cacheGetResponse = await _cacheManager.GetAsync<List<CommonLookupResponse<string>>>($"{nameof(DrugAllergiesBasedOnLabAssignment)}_LK");
            if (cacheGetResponse.IsSuccess)
            {
                response = cacheGetResponse.Value;
                if (!string.IsNullOrEmpty(drugName))
                {
                    response = response
                   .Where(f => f.Label
                   .Trim()
                   .ToLower()
                   .Contains(drugName
                   .ToLower()
                   .Trim())).ToList();
                }
                return response;
            }
            var labId = Convert.ToInt32(_connectionManager.GetLabId());
            var getAssignmentDaIdByLabId = await _applicationDbContext.TblDrugAllergiesAssignments
                .Where(f => f.RefLabId == labId)
                .Select(s => s.Daid).ToListAsync();

            var drugAllergiesFromMaster = await _masterDbContext.TblDrugAllergies.Where(f => getAssignmentDaIdByLabId.Contains(f.Dacode))
                .Select(s => new CommonLookupResponse<string>()
                {
                    Label = s.Description,
                    Value = s.Dacode.ToString()
                }).OrderBy(o => o.Label).ToListAsync();
            var lookupResponse = drugAllergiesFromMaster;
            response = lookupResponse;
            var cacheSetRespone = await _cacheManager.SetAsync<List<CommonLookupResponse<string>>>($"{nameof(DrugAllergiesBasedOnLabAssignment)}_LK", response);
            return response;
        }
        public async Task<List<CommonLookupResponse>> GetLISRptTemplateAsync()
        {
            var response = new List<CommonLookupResponse>();

            var cacheGetResponse = await _cacheManager.GetAsync<List<CommonLookupResponse>>($"{nameof(GetLISRptTemplateAsync)}_LK");
            if (cacheGetResponse.IsSuccess)
            {
                response = cacheGetResponse.Value;
                return response;
            }
            //var getTemplates = await _applicationDbContext.TblLisreportTemplates

            //response = lookupResponse;
            //var cacheSetRespone = await _cacheManager.SetAsync<List<CommonLookupResponse<string>>>($"{nameof(GetLISRptTemplateAsync)}_LK", response);
            return response;
        }
    }
}
