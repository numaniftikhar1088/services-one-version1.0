using AutoMapper;
using Newtonsoft.Json;
using System.Dynamic;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.RequisitionManagement.Business.Services.Interface;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Request;
using TrueMed.RequisitionManagement.Domain.Models.Dtos.Response;

namespace TrueMed.RequisitionManagement.Business.Services.Implementation
{
    public class SignatureInformationService : ISignatureInformationService
    {
        private readonly IConnectionManager _connectionManager;
        ApplicationDbContext _applicationDbContext;
      
        public SignatureInformationService(IConnectionManager connectionManager,ApplicationDbContext applicationDbContext)
        {
            _connectionManager = connectionManager;
            _applicationDbContext = applicationDbContext;
            
        }
        public async Task<SignatureInformationResponse> SavePatientSignatureInformation(SignatureInformationRequest request)
        {
            var res = new SignatureInformationResponse();


            var timeSavingOfSig = DateTime.UtcNow;
            res.FullName = request.FullName;
            res.Date = timeSavingOfSig.ToString("MM/dd/yyyy");
            res.Time = timeSavingOfSig.ToString("hh:mm:ss tt");
         
          


            string Year = timeSavingOfSig.ToString("yy");
            var Date = timeSavingOfSig.Day;
            var Month = timeSavingOfSig.Month;
            var Hours = timeSavingOfSig.Hour;
            var Minutes = timeSavingOfSig.Minute;
            var Seconds = timeSavingOfSig.Second;
            var MilliSeconds = timeSavingOfSig.Millisecond;

            var DateTimeID = Hours + Year + Minutes + Month + Date + Seconds + MilliSeconds;

            string RandomMathID = GetLast(request.UniqueKey, 5);
            var UniqueSignatureID = "CFG" + DateTimeID + RandomMathID;
            res.UniqueKey = UniqueSignatureID;

            dynamic patinfo = new ExpandoObject();

            patinfo.UniqueKey = request.UniqueKey;
            patinfo.FullName = request.FullName;
            patinfo.ComputerInfo = request.ComputerInfo;
            patinfo.IPAddress = request.IPAddress;
            patinfo.BrowserInfo = request.BrowserInfo;
            patinfo.ControlsInfo = request.ControlsInfo;

            string SigInformation = JsonConvert.SerializeObject(patinfo);

            var ps = new TblPatientSignatureInfo();
            ps.SignatureAssignId = UniqueSignatureID;
            ps.SignatureInformation = SigInformation;
            ps.CreatedTime = timeSavingOfSig;
            ps.CreatedBy = _connectionManager.UserId;
            _applicationDbContext.TblPatientSignatureInfos.Add(ps);
            try
            {
                 _applicationDbContext.SaveChanges();

            }
            catch (Exception ex)
            {

            }
          
         
            return res;
        }
        public static string GetLast(string source, int tail_length)
        {
            if (tail_length >= source.Length)
                return source;
            return source.Substring(source.Length - tail_length);
        }
    }
}
