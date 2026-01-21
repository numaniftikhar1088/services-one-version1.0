using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Previewer;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Response;
using TrueMed.ReportingServer.Business.ReportTemplates;
using TrueMed.ReportingServer.Business.Services.Interfaces;
using TrueMed.ReportingServer.Domain.Dtos.Request;
using TrueMed.ReportingServer.Domain.Dtos.Response;


namespace TrueMed.ReportingServer.Business.Services.Implementations
{
    public class BatchQCReportService : IBatchQCReportService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IBlobStorageManager _blobStorageManager;
        private readonly MasterDbContext _masterDbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _applicationDbContext;

        public BatchQCReportService(IConnectionManager connectionManager, IBlobStorageManager blobStorageManager, IHttpContextAccessor httpContextAccessor, ApplicationDbContext applicationDbContext, MasterDbContext masterDbContext)
        {
            _connectionManager = connectionManager;
            _blobStorageManager = blobStorageManager;
            _masterDbContext = masterDbContext;
            _httpContextAccessor = httpContextAccessor;
            _applicationDbContext = applicationDbContext;
            _masterDbContext = masterDbContext;
        }


        private async Task<IDBatchQCDataViewModel> IDBatchQCReportData(int fileId)
        {
            var response = new IDBatchQCDataViewModel();

            var tblIDBatchQC = _applicationDbContext.TblIdlisbachQcdata.Where(s => s.FileId == fileId).ToList();
            var firstRec = tblIDBatchQC.FirstOrDefault();

            var labDetails = _masterDbContext.TblLabs.FirstOrDefault(f => f.LabId == firstRec.LabId);

            response.Header = new IDBatchQCHeaderDataModel()
            {
                FileId = firstRec.FileId,
                FileName = firstRec.FileName,
                PanelId = firstRec.PanedId,
                PanelName = firstRec.PanelName,
                CreatedDate = Convert.ToDateTime(firstRec.CreatedDate).ToString("MM/dd/yyyy"),
                CLIA = labDetails.Cliano,
                Title = labDetails?.LaboratoryName,
                Address = labDetails?.Address1,
                Fax = labDetails?.FaxNumber,
                //DirectorName = labDetails.name
                PhoneNumber = labDetails?.PhoneNumber,

            };
            response.Content = new IDBatchQCContentDataModel();
            response.Content.Controls = new List<BatchQCControls>();
            response.Content.PanelName = firstRec.PanelName;
            if (tblIDBatchQC.Count > 0)
            {
                foreach (var data in tblIDBatchQC)
                {
                    var s = new BatchQCControls()
                    {
                        Id = data.Id,
                        QccontrolName = data.QccontrolName,
                        TestName = data.TestName,
                        Result = data.Result,
                        Comments = data.Comments,
                    };
                    response.Content.Controls.Add(s);
                }

            }
            return response;
        }

        public async Task<RequestResponse<string>> GenerateIDBatchQCReportAsync(int id)
        {
            var response = new RequestResponse<string>();

            var blob = new BlobStorageResponse();
            string fileName = "";

            var labId = _connectionManager.GetLabId();
            var portalInfo = _masterDbContext.TblLabs.AsNoTracking().FirstOrDefault(x => x.LabId == labId);
            var model = await IDBatchQCReportData(id);

            model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

            var report = new IDBatchQCReport(model);
            report.ShowInPreviewer();

            var bytes = report.GeneratePdf();

            fileName = $"IDBatchQCReport_{id}_{DateTime.UtcNow.Ticks}.pdf";
            blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();


            response.Data = blob.uri;
            response.Message = "Request Proccessed Successfully...";
            response.StatusCode = System.Net.HttpStatusCode.OK;


            return response;
        }

        public async Task<byte[]?> ReadFileAsync(string url)
        {


            using HttpClient client = new();
            return await client.GetByteArrayAsync(url);
        }
    }
}
