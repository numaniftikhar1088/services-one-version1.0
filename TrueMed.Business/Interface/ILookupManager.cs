using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Common;
using TrueMed.Domain.Models.LookUps;
using TrueMed.Domain.Models.LookUps.Common;

namespace TrueMed.Business.Interface
{
    public interface ILookupManager
    {
        Task<List<CommonLookupResponse>> ICD10CodeLookup();
        Task<List<ICD10CodeModel>> ICD10CodeSearch(string query, int Key);
        Task<List<CollectorLookupBasedOnFacilityIdResponse>> CollectorLookupBasedOnFacilityId(int id);
        Task<List<CommonLookupResponse>> TestCodeLookup(string? tmitCode);
        Task<List<CommonLookupResponse>> OptionsLookup(string? userType);
        Task<List<CommonLookupResponse>> GetInsurancesByInsuraceType(int typeId, string LabKey);
        Task<List<CommonLookupResponse>> Lab_SideRoles_Lookup();
        Task<List<CommonLookupResponse>> RequisitionType_Lookup();
        Task<List<CommonLookupResponse>> Master_RequisitionType_Lookup();
        Task<List<CommonLookupResponse>> RequisitionTypeColor_Lookup();
        Task<List<CommonLookupResponse>> CompendiumPanel_Lookup();
        Task<List<CommonLookupResponse>> ControlOptionsByControlId_Lookup(int controlId);
        Task<List<CommonLookupResponse>> ControlOptionsByLabIdAndControlId_Lookup(int labId,int controlId);
        Task<List<CommonLookupResponse>> ControlOptionsByOptionId_Lookup(int optionId);
        Task<List<AllFacilityUserResponse>> GetUserFacilityUserByRole_Lookup(int RoleId);
        /*
         * Table : TblLabs (Lab Side)
         * Column : LabId,LaboratoryName,IsReferenceLab
         * Description : Against LabId Get IsReferenceLab And LabId 
         */
        Task<List<dynamic>> ReferenceLab_Lookup(int labId);
        Task<List<CommonLookupResponse>> TestGroup_Lookup();
        /*
         * Table : TblRequisitionType
         * Portlal : Master Portal
         * Description : Get Requisition Color Against ReqTypeId 
         */
        Task<List<CommonLookupResponse>> RequisitionColorByReqTypeId_Lookup(int reqTypeId);
        Task<List<FacilityLookupResponse>> Facility_Lookup();
        Task<List<CommonLookupResponse>> Module_Lookup();

        /*
         * Use          : Drug Allergies Assignment Screen
         * Database     : Master 
         * Table        : tblDrugAllergies
         * Description  : if Code Parameter is null then all the result code with description show
         *                if Code is not null then return description based on code
         */
        Task<List<dynamic>> DrugAllergiesCode_Lookup(string? description);
        Task<List<CommonLookupResponse>> GetOnlyReferenceLab_Lookup();
        Task<List<CommonLookupResponse>> Master_CompendiumPanel_Lookup();
        Task<List<CommonLookupResponse>> LoggedUserAssignLabs();
        public List<US_State> USStates_Lookup();
        Task<List<CommonLookupResponse>> GroupLookup();
        Task<List<CommonLookupResponse>> ReferenceLabLookup();
        Task<List<CommonLookupResponse<string>>> DrugAllergiesBasedOnLabAssignment(string drugName);
        Task<List<CommonLookupResponse>> GetLISRptTemplateAsync();

    }
}
