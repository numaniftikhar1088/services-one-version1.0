using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Models.Response;
using TrueMed.LISManagement.Domain.DTOS.Request.QueryModel;
using TrueMed.LISManagement.Domain.DTOS.Response;
using TrueMed.LISManagement.Domains.DTOS.Request;
using TrueMed.LISManagement.Domains.DTOS.Response;

namespace TrueMed.LISManagement.Busines.Interfaces
{
    public interface IIDLISPreConfiguration
    {
        DataQueryResponse<List<IDLISTemplateSettingResponse>> GetTemplateSettings(DataQueryModel<IDLISTemplateSettingsQM> query);
        RequestResponse AddTemplateSettings(AddTemplateSettingRequest request);
        RequestResponse SaveCells(List<TemplateCells> request);
        RequestResponse<List<IDLISResultFileConfigurationSetupResponse>> GetResultDataSettings();
        RequestResponse SaveResultDataSettings(List<IDLISResultFileConfigurationSetupResponse> request);
    }
}
