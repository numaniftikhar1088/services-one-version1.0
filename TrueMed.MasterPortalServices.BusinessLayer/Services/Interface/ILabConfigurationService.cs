using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.Domain.Models.LookUps.Common;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Interface
{
    public interface ILabConfigurationService
    {
        List<SectionWithControls> GetSystemFieldConfigurations(int pageId);
        List<SectionWithControls> LoadSystemFieldsForClient(int pageId);
        List<SectionWithControlsAndDependenciesClient> LoadSystemFieldsForClientV2(int pageId);
        RequestResponse SaveLabConfiguraion(SaveLabConfigurationRequest request);
        RequestResponse SaveSectionAndControls(SaveLabConfigurationRequest request, IConnectionManager connectionManager);
        RequestResponse SaveSectionAndControlsV2(SaveLabConfigurationRequestV2 request, IConnectionManager connectionManager);
        RequestResponse<List<SectionWithControls>> LoadSystemFields(int pageId);
        RequestResponse<List<SectionWithControls>> LoadSystemFieldsForAdmin(int pageId);
        RequestResponse<List<SectionWithControlsAndDependencies>> LoadSystemFieldsForAdminV2(int pageId);
        RequestResponse<ReqSectionResponseViewModel> GetAllCommonSections(ReqSectionsViewModel request);
        RequestResponse SaveRequisitionTypeForClient(List<SaveRequisitionTypeViewModel> saveRequisitionTypes);
        RequestResponse<List<ControlLookup>> ControlTypeLookup();
        RequestResponse<List<ControlLookup>> PortalTypeLookup();
        RequestResponse<List<ReqSectionResponseViewModel>> GetAllReqSections(ReqSectionsViewModel request);
        List<SectionWithControlsAndDependenciesClient> LoadReqSectionsForClient(ReqSectionsViewModel request);
        Task<List<CommonLookupResponse>> GetPortalTypesLookup();
    }
}
