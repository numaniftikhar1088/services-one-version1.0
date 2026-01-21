using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;
using TrueMed.ApiGateway.Model;

namespace TrueMed.ApiGateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProviderInfoController : ControllerBase
    {
        [HttpGet("GetProviderInfoAgainstNPI/{npi}")]
        public async Task<IActionResult> GetProviderInfoAgainstNPI(string npi)
        {
            using (var client = new HttpClient())
            {
                string url = $"https://npiregistry.cms.hhs.gov/api/?number={npi}&version=2.1";

                var response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    var resultStringForm = await response.Content.ReadAsStringAsync();
                    var convertToObject = JsonConvert.DeserializeObject<NPIRegistry>(resultStringForm);

                    var exposeData =new NPIRegistryExposeDataModel();
                    if (convertToObject != null && convertToObject.results !=null)
                    {
                        foreach (var item in convertToObject.results)
                        {
                            exposeData.FirstName = item.basic.first_name;
                            exposeData.LastName = item.basic.last_name;
                            exposeData.NPI = item.number;

                        }
                    }
                    return Ok(exposeData);
                }

            }
            return Ok("Something Wrong...");
        }
    }
}
