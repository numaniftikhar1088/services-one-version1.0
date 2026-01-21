using Microsoft.EntityFrameworkCore;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using QuestPDF.Fluent;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Response;
using TrueMed.ReportingServer.Business.ReportTemplates;
using TrueMed.ReportingServer.Business.Services.Interfaces;
using TrueMed.ReportingServer.Domain.Dtos.Request;
using TrueMed.ReportingServer.Domain.Dtos.Response;
//using Document = iTextSharp.text.Document;
using FacilityInformation = TrueMed.ReportingServer.Domain.Dtos.Response.FacilityInformation;

namespace TrueMed.ReportingServer.Business.Services.Implementations
{
    public class IDLISReportService : IIDLISReportService
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IBlobStorageManager _blobStorageManager;
        private readonly ApplicationDbContext _applicationDbContext;
        private readonly MasterDbContext _masterDbContext;
        public IDLISReportService(IConnectionManager connectionManager, MasterDbContext masterDbContext, IBlobStorageManager blobStorageManager)
        {
            _connectionManager = connectionManager;
            _masterDbContext = masterDbContext;
            _applicationDbContext = ApplicationDbContext.Create(_connectionManager.CONNECTION_STRING);
            LoggedInUser = _connectionManager.UserId;
            _blobStorageManager = blobStorageManager;
        }
        public string LoggedInUser { get; set; }
        private async Task<StandardRPPReportDataModel> StandardRppReportData(IDLISReportRequest request)
        {
            var response = new StandardRPPReportDataModel();

            var ReqMaster = _applicationDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == request.ReqId);
            if (ReqMaster != null)
            {
                var User = _masterDbContext.TblUsers.AsNoTracking().FirstOrDefault(f => f.Id == ReqMaster.PhysicianId);
                //var tblPatBasicInfo = _applicationDbContext.TblPatientBasicInfos.AsNoTracking().Where(f => f.PatientId == tblReqMaster.FirstOrDefault().PatientId).ToListAsync();

                var RequisitionOrders = _applicationDbContext.TblRequisitionOrders.AsNoTracking().FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType);
                var Specimen = _applicationDbContext.TblRequisitionSpecimensInfos.AsNoTracking().FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType);
                var Facility = _applicationDbContext.TblFacilities.AsNoTracking().FirstOrDefault(w => w.FacilityId == ReqMaster.FacilityId);
                var SpecimenTypes = _applicationDbContext.TblSpecimenTypes.AsNoTracking().FirstOrDefault(f => f.SpecimenTypeId == Specimen.SpecimenType);
                var LisresultInformations = _applicationDbContext.TblIdlisresultInformations.AsNoTracking().Where(w => w.AccessionNumber == Specimen.SpecimenId).ToList();


                response.Facility = new FacilityInformation()
                {
                    FacilityName = Facility?.FacilityName,
                    ProviderName = $"{User?.FirstName} {User?.LastName}",
                    Phone = Facility?.FacilityPhone,
                    Fax = Facility?.FacilityFax

                };
                response.Patient = new PatientInformation()
                {
                    Name = $"{ReqMaster?.FirstName} {ReqMaster?.LastName}",
                    DOB = ReqMaster.Dob?.ToString("MM/dd/yyyy"),
                    Gender = ReqMaster?.Gender,
                    Race = ReqMaster?.Race,
                };
                response.Specimen = new SpecimenInformation()
                {
                    AccessionNo = Specimen?.SpecimenId,
                    ReportDate = RequisitionOrders?.PublishedDate?.ToString("MM/dd/yyyy"),
                    DateCollected = ReqMaster?.DateofCollection?.ToString("MM/dd/yyyy"),
                    SampleType = SpecimenTypes?.SpecimenType,
                    DateReceived = ReqMaster?.DateReceived?.ToString("MM/dd/yyyy"),
                };
                response.Content.Comments = "";
                response.Content.PositivePathgons = new List<StandardReportRPPPositivePathgons>();

                var distinctPanelNamesForPos = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "pathogen" && w.Result?.Trim().ToLower() == "detected")
                    .Select(x => x.PanelName)
                    .Distinct()
                    .ToList();
                foreach (var panel in distinctPanelNamesForPos)
                {
                    var test = LisresultInformations
                        .Where(x => x.PanelName == panel && x.Result?.Trim().ToLower() == "detected")
                        .Select(s => new PositivePathogen()
                        {
                            PathogenName = s.TestName,
                            pathogeResult = s.Result,
                        }).ToList();
                    var pnl = new StandardReportRPPPositivePathgons();
                    pnl.PanelName = panel;
                    pnl.Pathogens = test;
                    response.Content.PositivePathgons.Add(pnl);
                }

                response.Content.NegativePathogens = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "pathogen" && w.Result?.Trim().ToLower() == "not detected")
                    .Select(s => s.TestName).ToList();

                response.Content.NegativeResistances = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "resistance" && w.Result?.Trim().ToLower() == "not detected")
                    .Select(s => s.TestName).ToList();

            }
            return response;
        }
        private async Task<StandardUTIReportDataModel> UTIReportData(IDLISReportRequest request)
        {

            var response = new StandardUTIReportDataModel();

            var ReqMaster = _applicationDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == request.ReqId);
            if (ReqMaster != null)
            {
                var User = _masterDbContext.TblUsers.AsNoTracking().FirstOrDefault(f => f.Id == ReqMaster.PhysicianId);
                //var tblPatBasicInfo = _applicationDbContext.TblPatientBasicInfos.AsNoTracking().Where(f => f.PatientId == tblReqMaster.FirstOrDefault().PatientId).ToListAsync();

                var RequisitionOrders = _applicationDbContext.TblRequisitionOrders.AsNoTracking().FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType);
                var Specimen = _applicationDbContext.TblRequisitionSpecimensInfos.AsNoTracking().FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType);
                var Facility = _applicationDbContext.TblFacilities.AsNoTracking().FirstOrDefault(w => w.FacilityId == ReqMaster.FacilityId);
                var SpecimenTypes = _applicationDbContext.TblSpecimenTypes.AsNoTracking().FirstOrDefault(f => f.SpecimenTypeId == Specimen.SpecimenType);
                var LisresultInformations = _applicationDbContext.TblIdlisresultInformations.AsNoTracking().Where(w => w.AccessionNumber == Specimen.SpecimenId).ToList();


                response.Content.Facility = new FacilityInformation()
                {
                    FacilityName = Facility?.FacilityName,
                    ProviderName = $"{User?.FirstName} {User?.LastName}",
                    Phone = Facility?.FacilityPhone

                };
                response.Header.patientName = $"{ReqMaster?.FirstName} {ReqMaster?.LastName}";
                response.Header.DateOfBirth = ReqMaster.Dob?.ToString("MM/dd/yyyy");
                response.Header.Gender = ReqMaster?.Gender;

                response.Content.Specimen = new SpecimenInformation()
                {
                    AccessionNo = Specimen?.SpecimenId,
                    ReportDate = RequisitionOrders?.PublishedDate?.ToString("MM/dd/yyyy"),
                    DateCollected = ReqMaster?.DateofCollection?.ToString("MM/dd/yyyy"),
                    //SampleType = SpecimenTypes?.SpecimenType,
                    DateReceived = ReqMaster?.DateReceived?.ToString("MM/dd/yyyy"),
                };
                //response.Content.Comments = "";
                response.Content.PositivePathgons = new List<PositivePathogensList>();

                var PanelNameForPos = LisresultInformations
                    .FirstOrDefault(w => w.OrganismType?.Trim().ToLower() == "pathogen" && w.Result?.Trim().ToLower() == "detected").PanelName;


                var test = LisresultInformations
                        .Where(x => x.PanelName == PanelNameForPos && x.Result?.Trim().ToLower() == "detected")
                        .Select(s => new PositivePathogensList()
                        {
                            pathogenName = s.TestName,
                            CtValue = s.Ct,
                        }).ToList();

                response.Content.PositivePathgons.AddRange(test);
                response.Header.Title2 = PanelNameForPos;

                //foreach (var panel in distinctPanelNamesForPos)
                //{

                //    var pnl = new StandardReportRPPPositivePathgons();
                //    pnl.PanelName = panel;
                //    pnl.Pathogens = test;
                //    response.Content.PositivePathgons.Add(pnl);
                //}

                response.Content.NegativePathogens = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "pathogen" && w.Result?.Trim().ToLower() == "not detected" && w.PanelName == PanelNameForPos)
                    .Select(s => s.TestName).ToList();

                response.Content.NegativeResistances = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "resistance" && w.Result?.Trim().ToLower() == "not detected" && w.PanelName == PanelNameForPos)
                    .Select(s => s.TestName).ToList();

            }
            return response;


            //StandardUTIReportDataModel mdl = new StandardUTIReportDataModel();
            //mdl.Header = new StandardUTIHeaderDataModel();
            //var laId = _connectionManager.GetLabId();
            //var portlInfo = _masterDbContext.TblLabs.AsNoTracking().FirstOrDefault(x => x.LabId == laId);
            //mdl.Header.Logo = await ReadFileAsync(portlInfo.PortalLogo);
            ////mdl.Header.Logo = Placeholders.Image(200, 100);
            //mdl.Header.Title1 = Placeholders.Label();
            //mdl.Header.Title2 = Placeholders.Label();
            //mdl.Header.patientName = "Test Patient";
            //mdl.Header.Gender = "Male";
            //mdl.Header.DateOfBirth = "12/27/1993";

            //mdl.Content = new StandardUTIContentDataModel();
            //mdl.Content.Facility.FacilityName = "test";
            //mdl.Content.Facility.ProviderName = "My test";
            //mdl.Content.Facility.Phone = "0315646";


            //mdl.Content.Specimen.AccessionNo = "ID123456";
            //mdl.Content.Specimen.DateCollected = "12-27-2023";
            //mdl.Content.Specimen.DateReceived = "12-27-2023";
            //mdl.Content.Specimen.ReportDate = "12-27-2023";

            //mdl.Content.NegativePathogens = new List<string>()
            //{
            //    "Acinetobacter baumannii",
            //    "Klebsiella pneumoniae",
            //    "Serratia marcescens",
            //    "Klebsiella pneumoniae",
            //    "Serratia marcescens",
            //};
            //mdl.Content.PositivePathgons = new List<PositivePathogensList>()
            //{
            //    new PositivePathogensList() { pathogenName = " Acinetobacter baumannii", CtValue = "3.25" },
            //    new PositivePathogensList() { pathogenName = "Serratia marcescens", CtValue = "3.25" },
            //    new PositivePathogensList() { pathogenName = "Klebsiella pneumoniae", CtValue = "3.25" },
            //    new PositivePathogensList() { pathogenName = " Enterobacter cloacae", CtValue = "3.25" }
            //};

            //var rpt = new UTIStandardReport(mdl);
            //rpt.ShowInPreviewer();
        }
        private async Task<WoundPositiveDataModel> WoundPositiveReportData(IDLISReportRequest request)
        {
            var response = new WoundPositiveDataModel();

            var ReqMaster = _applicationDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == request.ReqId);
            if (ReqMaster != null)
            {
                var User = _masterDbContext.TblUsers.AsNoTracking().FirstOrDefault(f => f.Id == ReqMaster.PhysicianId);
                //var tblPatBasicInfo = _applicationDbContext.TblPatientBasicInfos.AsNoTracking().Where(f => f.PatientId == tblReqMaster.FirstOrDefault().PatientId).ToListAsync();

                var RequisitionOrders = _applicationDbContext.TblRequisitionOrders.AsNoTracking().FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType);
                var Specimen = _applicationDbContext.TblRequisitionSpecimensInfos.AsNoTracking().FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType);
                var Facility = _applicationDbContext.TblFacilities.AsNoTracking().FirstOrDefault(w => w.FacilityId == ReqMaster.FacilityId);
                var SpecimenTypes = _applicationDbContext.TblSpecimenTypes.AsNoTracking().FirstOrDefault(f => f.SpecimenTypeId == Specimen.SpecimenType);
                var LisresultInformations = _applicationDbContext.TblIdlisresultInformations.AsNoTracking().Where(w => w.AccessionNumber == Specimen.SpecimenId).ToList();

                response.Header = new WoundPositiveHeaderDataModel();
                response.Header.Facility = new FacilityInformation()
                {
                    FacilityName = Facility?.FacilityName,
                    ProviderName = $"{User?.FirstName} {User?.LastName}",
                    Phone = Facility?.FacilityPhone,
                    Fax = Facility?.FacilityFax

                };
                response.Header.Patient = new PatientInformation()
                {
                    Name = $"{ReqMaster?.FirstName} {ReqMaster?.LastName}",
                    DOB = ReqMaster.Dob?.ToString("MM/dd/yyyy"),
                    Gender = ReqMaster?.Gender,
                    Race = ReqMaster?.Race,
                };
                response.Header.Specimen = new SpecimenInformation()
                {
                    AccessionNo = Specimen?.SpecimenId,
                    ReportDate = RequisitionOrders?.PublishedDate?.ToString("MM/dd/yyyy"),
                    DateCollected = ReqMaster?.DateofCollection?.ToString("MM/dd/yyyy"),
                    SampleType = SpecimenTypes?.SpecimenType,
                    DateReceived = ReqMaster?.DateReceived?.ToString("MM/dd/yyyy"),
                };
                response.Content = new WoundPositiveContentDataModel();
                //response.Content.Comments = "";
                response.Content.PositivePathgons = new List<PositivePathogens>();

                //var PanelNamesForPos = LisresultInformations
                //    .FirstOrDefault(w => w.OrganismType?.Trim().ToLower() == "pathogen" && w.Result?.Trim().ToLower() == "detected").PanelName;

                response.Content.PositivePathgons = LisresultInformations
                        .Where(x => x.OrganismType?.Trim().ToLower() == "pathogen" && x.Result?.Trim().ToLower() == "detected")
                        .Select(s => new PositivePathogens()
                        {
                            pathogenName = s.TestName,
                            Qualitative = s.Qualitative,
                            EstMicrobialLoad = s.EstMicrobialLoad,
                        }).ToList();

                response.Content.NegativePathogens = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "pathogen" && w.Result?.Trim().ToLower() == "not detected")
                    .Select(s => new NegativePathogens() { TestName = s.TestName, Result = s.Result }).ToList();



                response.Content.PositiveResistances = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "resistance" && w.Result?.Trim().ToLower() == "detected")
                    .Select(s => new PositiveResistances() { TestName = s.TestName, AntibioticClass = s.AntibioticClass }).ToList();


                response.Content.NegativeResistances = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "resistance" && w.Result?.Trim().ToLower() == "not detected")
                    .Select(s => new NegativeResistances() { TestName = s.TestName, AntibioticClass = s.AntibioticClass, Result = s.Result }).ToList();

            }
            return response;
        }



        private async Task<IDStandardDataModel> IDStandardReportData(IDLISReportRequest request)
        {
            var response = new IDStandardDataModel();

            var ReqMaster = _applicationDbContext.TblRequisitionMasters.FirstOrDefault(f => f.RequisitionId == request.ReqId);
            if (ReqMaster != null)
            {
                var User = _masterDbContext.TblUsers.AsNoTracking().FirstOrDefault(f => f.Id == ReqMaster.PhysicianId);
                //var tblPatBasicInfo = _applicationDbContext.TblPatientBasicInfos.AsNoTracking().Where(f => f.PatientId == tblReqMaster.FirstOrDefault().PatientId).ToListAsync();

                var RequisitionOrders = _applicationDbContext.TblRequisitionOrders.AsNoTracking().FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType);
                var Specimen = _applicationDbContext.TblRequisitionSpecimensInfos.AsNoTracking().FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType);
                var Facility = _applicationDbContext.TblFacilities.AsNoTracking().FirstOrDefault(w => w.FacilityId == ReqMaster.FacilityId);
                var SpecimenTypes = _applicationDbContext.TblSpecimenTypes.AsNoTracking().FirstOrDefault(f => f.SpecimenTypeId == Specimen.SpecimenType);
                var LisresultInformations = _applicationDbContext.TblIdlisresultInformations.AsNoTracking().Where(w => w.AccessionNumber == Specimen.SpecimenId).ToList();

                response.Header.Facility = new FacilityInformation()
                {
                    FacilityName = Facility?.FacilityName,
                    ProviderName = $"{User?.FirstName} {User?.LastName}",
                    //Phone = Facility?.FacilityPhone,
                    //Fax = Facility?.FacilityFax,
                    Address = Facility?.Address,

                };
                response.Header.Patient = new PatientInformation()
                {
                    Name = $"{ReqMaster?.FirstName} {ReqMaster?.LastName}",
                    DOB = ReqMaster.Dob?.ToString("MM/dd/yyyy"),
                    Gender = ReqMaster?.Gender,
                    Race = ReqMaster?.Race,
                    Address = ReqMaster?.Address1,
                };
                response.Header.Specimen = new SpecimenInformation()
                {
                    AccessionNo = Specimen?.SpecimenId,
                    DateCollected = ReqMaster?.DateofCollection?.ToString("MM/dd/yyyy"),
                    DateReceived = ReqMaster?.DateReceived?.ToString("MM/dd/yyyy"),
                    ReportDate = RequisitionOrders?.PublishedDate?.ToString("MM/dd/yyyy"),
                    SampleType = SpecimenTypes?.SpecimenType,
                };
                //response.Content.Comments = "";
                //response.Content.PositivePathgons = new List<StandardReportRPPPositivePathgons>();

                var distinctPanelNamesForPos = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "pathogen" && w.OrganismType?.Trim().ToLower() == "pathogen") //&& w.Result?.Trim().ToLower() == "detected"
                    .Select(x => x.PanelName)
                    .Distinct()
                    .ToList();
                foreach (var panel in distinctPanelNamesForPos)
                {
                    var positive = LisresultInformations
                        .Where(x => x.PanelName == panel && x.Result?.Trim().ToLower() == "detected" && x.OrganismType?.Trim().ToLower() == "pathogen")
                        .Select(s => new PositivePathogensListForID()
                        {
                            pathogenName = s?.TestName,
                            Qualitative = s?.Qualitative,
                            EstMicrobialLoad = s?.EstMicrobialLoad,
                            Results = s?.Result,

                        }).ToList();
                    var negative = LisresultInformations
                        .Where(x => x.PanelName == panel && x.Result?.Trim().ToLower() == "not detected" && x.OrganismType?.Trim().ToLower() == "pathogen")
                        .Select(s => s.TestName).ToList();


                    var pnl = new PathogensForID();
                    pnl.PanelName = panel;
                    pnl.PositivePathogensList = positive;
                    pnl.NegativePathogensForId = negative;
                    response.Content.Pathogens.Add(pnl);
                }

                response.Content.PositiveResistancesForId = LisresultInformations
                   .Where(w => w.OrganismType?.Trim().ToLower() == "resistance" && w.Result?.Trim().ToLower() == "detected")
                   .Select(s => new PositiveResistancesForID()
                   {
                       Result = s.Result,
                       TestName = s.TestName,
                   }).ToList();

                response.Content.NegativeResistances = LisresultInformations
                    .Where(w => w.OrganismType?.Trim().ToLower() == "resistance" && w.Result?.Trim().ToLower() == "not detected")
                    .Select(s => s.TestName).ToList();

            }
            return response;
        }


        public async Task<RequestResponse<string>> GeneratePDFReportAsync(IDLISReportRequest request)
        {
            var response = new RequestResponse<string>();

            //        var tblLisreportTemplates = _applicationDbContext.TblLisreportTemplates.AsNoTracking().Where(w => w.ReqTypeId == request.ReqType).AsEnumerable().ToList();
            //        var tblFacilityReportTemplates = _applicationDbContext.TblFacilityReportTemplates
            //.AsNoTracking()
            //.FirstOrDefault(w => w.FacilityId == request.FacilityId &&
            //                     tblLisreportTemplates.Any(a => a.Id == w.TemplateId));

            //        var tblLisreportTemplates = _applicationDbContext.TblLisreportTemplates.AsNoTracking()
            //.Where(w => w.ReqTypeId == request.ReqType)
            //.AsEnumerable()  // Client evaluation
            //.ToList();

            var tblFacilityReportTemplates = _applicationDbContext.TblFacilityReportTemplates
                .AsNoTracking()
                .FirstOrDefault(w => w.FacilityId == request.FacilityId && _applicationDbContext.TblLisreportTemplates.Any(a => a.Id == w.TemplateId && a.ReqTypeId == request.ReqType));

            var labId = _connectionManager.GetLabId();
            var portalInfo = _masterDbContext.TblLabs.AsNoTracking().FirstOrDefault(x => x.LabId == labId);

            var blob = new BlobStorageResponse();
            string fileName = "";

            if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 1)
            {
                var model = await StandardRppReportData(request);
                model.Title1 = "Respiratory";
                model.Title2 = "Molecular Pathogen Report";

                model.Logo = await ReadFileAsync(portalInfo.PortalLogo);

                model.ReportType = "Final";

                var report = new StandardRPPReport(model);
                //report.ShowInPreviewer();

                var bytes = report.GeneratePdf();

                fileName = $"Result_{model.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
                blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();

                //            var query = _applicationDbContext.TblLabRequisitionTypeWorkflowStatuses
                //.Where("City == @0 and Orders.Count >= @1", "London", 10)
                //.OrderBy("CompanyName")
                //.Select("new(CompanyName as Name, Phone)");



            }
            else if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 2)//UTI
            {

                var model = await UTIReportData(request);
                model.Header.Title1 = "Patient Report Summary";
                //model.Title2 = "Molecular Pathogen Report";

                model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

                var report = new UTIStandardReport(model);
                //report.ShowInPreviewer();

                var bytes = report.GeneratePdf();

                fileName = $"Result_{model.Content.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
                blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();
            }
            else if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 3)//Wound
            {
                var model = await WoundPositiveReportData(request);
                model.Header.Title = "Patient Report Summary";
                //model.Title2 = "Molecular Pathogen Report";

                model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

                var report = new WoundPositiveReport(model);
                //report.ShowInPreviewer();

                var bytes = report.GeneratePdf();

                fileName = $"Result_{model.Header.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
                blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();
            }
            else if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 4)//ID standard
            {
                var model = await IDStandardReportData(request);
                model.Header.Title = "Summary Report";
                //model.Title2 = "Molecular Pathogen Report";

                model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

                var report = new IDStandardReport(model);
                //report.ShowInPreviewer();
                var bytes = report?.GeneratePdf();
                fileName = $"Result_{model.Header.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
                blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();
            }
            else
            {
                response.Message = "No Template Id Found for this record";
                response.StatusCode = System.Net.HttpStatusCode.BadRequest;
                return response;
            }

            if (request.IsPreview)
            {
                response.Data = blob.uri;
            }
            else
            {
                var obj = new TblRequisitionFile()
                {
                    RequisitionId = request.ReqId,
                    RequisitionOrderId = _applicationDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType)?.RequisitionOrderId,
                    RequisitionType = request.ReqType.ToString(),
                    FileName = fileName,
                    FileUrl = blob.uri,
                    TypeOfFile = blob.fileType,
                    CreatedBy = _connectionManager.UserId,
                    CreatedDate = DateTime.UtcNow,
                    SystemGenerated = true,
                    IsDeleted = false
                };
                _applicationDbContext.TblRequisitionFiles.Add(obj);
                _applicationDbContext.SaveChanges();
                response.Data = blob.uri;
            }
            response.Message = "Request Proccessed Successfully...";
            response.StatusCode = System.Net.HttpStatusCode.OK;


            return response;
        }


        public async Task<byte[]?> ReadFileAsync(string url)
        {


            using HttpClient client = new();
            return await client.GetByteArrayAsync(url);
        }
        public RequestResponse BulkPublishAndValidate(IDLISResultDataValidateRequest[] request)
        {
            var response = new RequestResponse();
            var tblRequisitionOrdersrows = _applicationDbContext.TblRequisitionOrders.ToList();
            var tblRequisitionMastersrows = _applicationDbContext.TblRequisitionMasters.ToList();
            List<int> failedRecords = new List<int>();
            foreach (var temp in request)
            {
                var req = new IDLISReportRequest()
                {
                    ReqId = temp.RequisitionId,
                    FacilityId = temp.FacilityId,
                    ReqType = temp.ReqTypeId,
                    IsPreview = false,
                    TemplateId = ""

                };
                var res = GeneratePDFReportAsync(req).GetAwaiter().GetResult();
                if (res.StatusCode == HttpStatusCode.OK)
                {
                    var existingRecord = tblRequisitionOrdersrows.FirstOrDefault(w => w.RequisitionId == temp.RequisitionId && w.RecordId == temp.RecordId);
                    if (existingRecord != null)
                    {
                        existingRecord.ValidatedBy = LoggedInUser;
                        existingRecord.ValidationDate = DateTime.UtcNow;
                        existingRecord.PublishedDate = DateTime.UtcNow;
                        existingRecord.PublishBy = LoggedInUser;
                        existingRecord.Lisstatus = "3";
                        _applicationDbContext.TblRequisitionOrders.Update(existingRecord);
                        var existingRecord2 = tblRequisitionMastersrows.FirstOrDefault(w => w.RequisitionId == temp.RequisitionId);
                        if (existingRecord2 != null)
                        {
                            existingRecord2.RequisitionStatus = 3;
                            _applicationDbContext.TblRequisitionMasters.Update(existingRecord2);

                        }

                    }
                }
                else
                {
                    failedRecords.Add(temp.RequisitionId);
                }

            }

            var ack = _applicationDbContext.SaveChanges();
            if (ack > 0)
            {
                response.StatusCode = HttpStatusCode.OK;
                response.Message = "Request Successfully Processed...";
            }
            return response;
        }

        public async Task<RequestResponse<string>> PrintSelectedReports(int[]? ids)
        {
            var response = new RequestResponse<string>();
            var labId = _connectionManager.GetLabId();
            var portalInfo = _masterDbContext.TblLabs.AsNoTracking().FirstOrDefault(x => x.LabId == labId);

            var blob = new BlobStorageResponse();
            string fileName = "";

            List<byte[]> bytes = new List<byte[]>();
            foreach (int id in ids)
            {
                var requisitionMaster = _applicationDbContext.TblRequisitionMasters.FirstOrDefault(w => w.RequisitionId == id);
                if (requisitionMaster != null)
                {
                    var requisitionOrder = _applicationDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == id);
                    var tblFacilityReportTemplates = _applicationDbContext.TblFacilityReportTemplates
                    .AsNoTracking()
                    .FirstOrDefault(w => w.FacilityId == requisitionMaster.FacilityId && _applicationDbContext.TblLisreportTemplates.Any(a => a.Id == w.TemplateId && a.ReqTypeId == requisitionOrder.ReqTypeId));
                    var request = new IDLISReportRequest()
                    {
                        ReqId = id,
                        FacilityId = requisitionMaster.FacilityId,
                        ReqType = Convert.ToInt32(requisitionOrder.ReqTypeId),
                        IsPreview = false,
                        TemplateId = ""

                    };

                    if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 1)
                    {
                        var model = await StandardRppReportData(request);
                        model.Title1 = "Respiratory";
                        model.Title2 = "Molecular Pathogen Report";

                        model.Logo = await ReadFileAsync(portalInfo.PortalLogo);

                        model.ReportType = "Final";

                        var report = new StandardRPPReport(model);
                        //report.ShowInPreviewer();

                        bytes.Add(report.GeneratePdf());

                        //fileName = $"Result_{model.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
                        //blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();

                    }
                    else if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 2)//UTI
                    {

                        var model = await UTIReportData(request);
                        model.Header.Title1 = "Patient Report Summary";
                        //model.Title2 = "Molecular Pathogen Report";

                        model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

                        var report = new UTIStandardReport(model);
                        //report.ShowInPreviewer();

                        bytes.Add(report.GeneratePdf());

                        //fileName = $"Result_{model.Content.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
                        //blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();
                    }
                    else if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 3)//Wound
                    {
                        var model = await WoundPositiveReportData(request);
                        model.Header.Title = "Patient Report Summary";
                        //model.Title2 = "Molecular Pathogen Report";

                        model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

                        var report = new WoundPositiveReport(model);
                        //report.ShowInPreviewer();

                        bytes.Add(report.GeneratePdf());

                        //fileName = $"Result_{model.Header.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
                        //blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();
                    }
                    else if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 4)//ID standard
                    {
                        var model = await IDStandardReportData(request);
                        model.Header.Title = "Summary Report";
                        //model.Title2 = "Molecular Pathogen Report";

                        model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

                        var report = new IDStandardReport(model);
                        //report.ShowInPreviewer();
                        bytes.Add(report.GeneratePdf());

                        //fileName = $"Result_{model.Header.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
                        //blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();
                    }

                }
            }
            //var documents = new List<QuestPDF.Infrastructure.IDocument>();

            //foreach (int id in ids)
            //{
            //    // ... your existing code ...

            //    // Add the generated PDF document to the list
            //    documents.Add(new Document().Bytes(report.GeneratePdf()));
            //}

            var merged = CombinePDFs(bytes);
            fileName = $"Merged_Reports_{DateTime.UtcNow.Ticks}.pdf";
            blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(merged, fileName, _connectionManager).GetAwaiter().GetResult();

            //var merged = Document.Merge((IEnumerable<QuestPDF.Infrastructure.IDocument>)bytes).GeneratePdf();

            response.Data = blob.uri;
            response.Message = "Request Proccessed Successfully...";
            response.StatusCode = System.Net.HttpStatusCode.OK;


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
        //public async Task<RequestResponse<string>> PrintSelectedReports2(int[]? ids)
        //{
        //    var response = new RequestResponse<string>();
        //    var labId = _connectionManager.GetLabId();
        //    var portalInfo = _masterDbContext.TblLabs.AsNoTracking().FirstOrDefault(x => x.LabId == labId);

        //    var blob = new BlobStorageResponse();
        //    var mergedPdfPath = "merged.pdf";

        //    List<byte[]> bytes = new List<byte[]>();
        //    try
        //    {
        //        using (var fs = new FileStream(mergedPdfPath, FileMode.Create))
        //        {
        //            var document = new Document();
        //            var pdfWriter = PdfWriter.GetInstance(document, fs);
        //            document.Open();

        //            foreach (int id in ids)
        //            {
        //                var requisitionMaster = _applicationDbContext.TblRequisitionMasters.FirstOrDefault(w => w.RequisitionId == id);

        //                if (requisitionMaster != null)
        //                {
        //                    var requisitionOrder = _applicationDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == id);
        //                    var tblFacilityReportTemplates = _applicationDbContext.TblFacilityReportTemplates
        //                        .AsNoTracking()
        //                        .FirstOrDefault(w => w.FacilityId == requisitionMaster.FacilityId && _applicationDbContext.TblLisreportTemplates.Any(a => a.Id == w.TemplateId && a.ReqTypeId == requisitionOrder.ReqTypeId));

        //                    var request = new IDLISReportRequest()
        //                    {
        //                        ReqId = id,
        //                        FacilityId = requisitionMaster.FacilityId,
        //                        ReqType = Convert.ToInt32(requisitionOrder.ReqTypeId),
        //                        IsPreview = false,
        //                        TemplateId = ""
        //                    };

        //                    if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 1)
        //                    {
        //                        var model = await StandardRppReportData(request);
        //                        model.Title1 = "Respiratory";
        //                        model.Title2 = "Molecular Pathogen Report";

        //                        model.Logo = await ReadFileAsync(portalInfo.PortalLogo);

        //                        model.ReportType = "Final";

        //                        var report = new StandardRPPReport(model);
        //                        bytes.Add(report.GeneratePdf());
        //                    }
        //                    else if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 2)//UTI
        //                    {

        //                        var model = await UTIReportData(request);
        //                        model.Header.Title1 = "Patient Report Summary";
        //                        //model.Title2 = "Molecular Pathogen Report";

        //                        model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

        //                        var report = new UTIStandardReport(model);
        //                        //report.ShowInPreviewer();

        //                        bytes.Add(report.GeneratePdf());

        //                        //fileName = $"Result_{model.Content.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
        //                        //blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();
        //                    }
        //                    else if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 3)//Wound
        //                    {
        //                        var model = await WoundPositiveReportData(request);
        //                        model.Header.Title = "Patient Report Summary";
        //                        //model.Title2 = "Molecular Pathogen Report";

        //                        model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

        //                        var report = new WoundPositiveReport(model);
        //                        //report.ShowInPreviewer();

        //                        bytes.Add(report.GeneratePdf());

        //                        //fileName = $"Result_{model.Header.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
        //                        //blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();
        //                    }
        //                    else if (tblFacilityReportTemplates != null && tblFacilityReportTemplates.TemplateId == 4)//ID standard
        //                    {
        //                        var model = await IDStandardReportData(request);
        //                        model.Header.Title = "Summary Report";
        //                        //model.Title2 = "Molecular Pathogen Report";

        //                        model.Header.Logo = await ReadFileAsync(portalInfo.PortalLogo);

        //                        var report = new IDStandardReport(model);
        //                        //report.ShowInPreviewer();
        //                        bytes.Add(report.GeneratePdf());

        //                        //fileName = $"Result_{model.Header.Specimen.AccessionNo}_{DateTime.UtcNow.Ticks}.pdf";
        //                        //blob = _blobStorageManager.UploadDirectBase64ToAzureAsync(bytes, fileName, _connectionManager).GetAwaiter().GetResult();
        //                    }

        //                    // ... Add similar code for other templates ...
        //                }

        //            }

        //            // Add the generated PDFs to the merged document
        //            foreach (var pdfBytes in bytes)
        //            {
        //                var reader = new PdfReader(new MemoryStream(pdfBytes));
        //                pdfWriter.SetPageSize(reader.GetPageSize(1));
        //                pdfWriter.NewPage();
        //                var importedPage = pdfWriter.GetImportedPage(reader, 1);
        //                pdfWriter.DirectContent.AddTemplate(importedPage, 0, 0);
        //            }
        //        }

        //        response.Message = "Request Processed Successfully";
        //        response.StatusCode = HttpStatusCode.OK;
        //        response.Data = mergedPdfPath;
        //    }
        //    catch (Exception ex)
        //    {
        //        response.Message = $"An error occurred: {ex.Message}";
        //        response.StatusCode = HttpStatusCode.InternalServerError;
        //        // Handle other exceptions as needed
        //    }
        //    //if (request.IsPreview)
        //    //{
        //    //    response.Data = blob.uri;
        //    //}
        //    //else
        //    //{
        //    //    var obj = new TblRequisitionFile()
        //    //    {
        //    //        RequisitionId = request.ReqId,
        //    //        RequisitionOrderId = _applicationDbContext.TblRequisitionOrders.FirstOrDefault(f => f.RequisitionId == request.ReqId && f.ReqTypeId == request.ReqType)?.RequisitionOrderId,
        //    //        RequisitionType = request.ReqType.ToString(),
        //    //        FileName = fileName,
        //    //        FileUrl = blob.uri,
        //    //        TypeOfFile = blob.fileType,
        //    //        CreatedBy = _connectionManager.UserId,
        //    //        CreatedDate = DateTime.UtcNow,
        //    //        SystemGenerated = true,
        //    //        IsDeleted = false
        //    //    };
        //    //    _applicationDbContext.TblRequisitionFiles.Add(obj);
        //    //    _applicationDbContext.SaveChanges();
        //    //    response.Data = blob.uri;
        //    //}
        //    response.Message = "Request Proccessed Successfully...";
        //    response.StatusCode = System.Net.HttpStatusCode.OK;


        //    return response;
        //}

    }
}
