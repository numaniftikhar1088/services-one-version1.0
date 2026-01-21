using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using Org.BouncyCastle.Utilities;
using PdfSharp.Pdf.IO;
using PdfSharp.Pdf;
using QuestPDF.Fluent;
using QuestPDF.Previewer;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Models.Response;
using TrueMed.ReportingServer.Business.ReportTemplates;
using TrueMed.ReportingServer.Business.Services.Interfaces;
using TrueMed.ReportingServer.Domain.Dtos.Response;

namespace TrueMed.ReportingServer.Business.Services.Implementations
{
    public class ReqOrderViewService : IReqOrderViewService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IBlobStorageManager _blobStorageManager;
        private readonly MasterDbContext _masterDbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ReqOrderViewService(IConnectionManager connectionManager, IBlobStorageManager blobStorageManager, MasterDbContext masterDbContext, IHttpContextAccessor httpContextAccessor)
        {
            _connectionManager = connectionManager;
            _blobStorageManager = blobStorageManager;
            _masterDbContext = masterDbContext;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<RequestResponse<string>> GetReqOrderViewPdf(int reqId)
        {
            var response = new RequestResponse<string>();
            var labId = _connectionManager.GetLabId();
            var portalInfo = _masterDbContext.TblLabs.AsNoTracking().FirstOrDefault(x => x.LabId == labId);

            var blob = new BlobStorageResponse();

            using (HttpClient client = new HttpClient())
            {
                string url = $"https://tmpoapigetwayscus-dev.azurewebsites.net/api/LoadReqSection/ViewRequisitionOrder?RequisitionId={reqId}";
                // Add the Bearer token to the headers
                var token = _httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                

                // Add X-Portal-Key to the headers
                string portalkey = _httpContextAccessor.HttpContext.Request.Headers["X-Portal-Key"];
                client.DefaultRequestHeaders.Add("X-Portal-Key", portalkey);
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                try
                {
                    HttpResponseMessage res = await client.GetAsync(url);
                    string contents = await res.Content.ReadAsStringAsync();
                    var content = await res.Content.ReadFromJsonAsync<List<ReqOrderViewResponse>>();
                    var model = new ReqOrderViewDataModel()
                    {
                        Header = new ReqOrderViewHeader()
                        {
                            Logo = await ReadFileAsync(portalInfo.PortalLogo),
                            Title = "Paper Requisition"
                        },
                        Content = content[0]
                    };
                    var report = new ReqOrderViewReport(model);
                    //report.ShowInPreviewer();

                    var bytes = report.GeneratePdf();

                    var fileName = $"RequisitionOrderView_{reqId}_{DateTime.UtcNow.Ticks}.pdf";
                    blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();


                    response.Data = blob.uri;
                    response.StatusCode = HttpStatusCode.OK;
                    response.Message = "Request Successfully Processed...";
                    return response;

                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine($"HTTP request error: {e.Message}");
                }
                catch(Exception ex)
                {
                    throw ex;
                }
            }
            return response;
        }

        public async Task<byte[]?> ReadFileAsync(string url)
        {
            using HttpClient client = new();
            return await client.GetByteArrayAsync(url);
        }


        public async Task<RequestResponse<string>> GetReqOrderRecords(int[] reqIds)
        {
            var response = new RequestResponse<string>();
            var labId = _connectionManager.GetLabId();
            var portalInfo = _masterDbContext.TblLabs.AsNoTracking().FirstOrDefault(x => x.LabId == labId);

            var blob = new BlobStorageResponse();
            List<byte[]> bytes = new List<byte[]>();
            using (HttpClient client = new HttpClient())
            {

                
                // Add the Bearer token to the headers
                var token = _httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                // Add X-Portal-Key to the headers
                string portalkey = _httpContextAccessor.HttpContext.Request.Headers["X-Portal-Key"];
                client.DefaultRequestHeaders.Add("X-Portal-Key", portalkey);
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                foreach (var reqId in reqIds)
                {
                    string url = $"https://tmpoapigetwayscus-dev.azurewebsites.net/api/LoadReqSection/ViewRequisitionOrder?RequisitionId={reqId}";
                    try
                    {
                        HttpResponseMessage res = await client.GetAsync(url);
                        string contents = await res.Content.ReadAsStringAsync();
                        var content = await res.Content.ReadFromJsonAsync<List<ReqOrderViewResponse>>();
                        var model = new ReqOrderViewDataModel()
                        {
                            Header = new ReqOrderViewHeader()
                            {
                                Logo = await ReadFileAsync(portalInfo.PortalLogo),
                                Title = "Paper Requisition"
                            },
                            Content = content[0]
                        };
                        var report = new ReqOrderViewReport(model);
                        //report.ShowInPreviewer();

                        bytes.Add(report.GeneratePdf());

                       

                    }
                    catch (HttpRequestException e)
                    {
                        Console.WriteLine($"HTTP request error: {e.Message}");
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
            }
            var merged = CombinePDFs(bytes);
            var fileName = $"RequisitionOrderView_Merged_{DateTime.UtcNow.Ticks}.pdf";
            blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(merged, fileName, _connectionManager).GetAwaiter().GetResult();


            response.Data = blob.uri;
            response.StatusCode = HttpStatusCode.OK;
            response.Message = "Request Successfully Processed...";
            return response;
        }
        public byte[] CombinePDFs(List<byte[]> srcPDFs)
        {
            using (var ms = new MemoryStream())
            {
                using (var resultPDF = new PdfDocument(ms))
                {
                    foreach (var pdf in srcPDFs)
                    {
                        using (var src = new MemoryStream(pdf))
                        {
                            using (var srcPDF = PdfReader.Open(src, PdfDocumentOpenMode.Import))
                            {
                                for (var i = 0; i < srcPDF.PageCount; i++)
                                {
                                    resultPDF.AddPage(srcPDF.Pages[i]);
                                }
                            }
                        }
                    }
                    resultPDF.Save(ms);
                    return ms.ToArray();
                }
            }
        }
    }
}
