
using Microsoft.AspNetCore.Mvc;

namespace TrueMed.ApiGateway.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet(Name = "GetWeather")]
        public string Get() => "My test action";

    }
}
