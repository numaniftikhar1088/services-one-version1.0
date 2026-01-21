using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using TrueMed.Domain.Model.Identity;

namespace TrueMed.Domain.Helpers
{
    public class APIResponseViewModel
    {
        private readonly HttpRequestMessage? _httpRequest;

        public APIResponseViewModel(HttpRequestMessage httpRequest)
        {
            _httpRequest = httpRequest;
            Errors = new Dictionary<string, List<string>>();
        }

        public APIResponseViewModel() { }

        public System.Net.HttpStatusCode Status { get; set; }
        public string Title { get; set; }
        public object? Data { get; set; }
        public object? Identifier { get; private set; }
        public IDictionary<string, List<string>>? Errors { get; set; }

        public IActionResult Create(HttpRequest requestContext, 
            System.Net.HttpStatusCode httpStatusCode, 
            object? data, 
            string message = "Request successfully processed.", 
            IDictionary<string, List<string>>? errors = null, object? identifier = null)
        {
            Data = data;
            Identifier = identifier;
            Title = message;
            Errors = errors;
            Status = httpStatusCode;
            return new ObjectResult((int)httpStatusCode) { Value = this };
        }

        public IActionResult Create(bool isDone, 
            string successMessage = "Request successfully processed.", 
            string errorMessage = "Invalid request.", 
            object? identifier = null)
        {
            if (isDone)
                Title = successMessage;
            else
                Title = errorMessage;
            Identifier = identifier;
            Status = isDone? System.Net.HttpStatusCode.OK: System.Net.HttpStatusCode.BadRequest;
            return new ObjectResult(Status) { Value = this };
        }

        public IActionResult Create<T>(System.Net.HttpStatusCode httpStatusCode, T data) where T : IdentityResult
        {
            Data = data;
            Identifier = data.Id;
            Title = data.Message;
            Errors = data.Errors;
            Status = httpStatusCode;
            return new ObjectResult((int)httpStatusCode) { Value = this };
        }

        public IActionResult Create<T>(T data) where T : IdentityResult
        {
            Data = data;
            Identifier = data.Id;
            Title = data.Message;
            Errors = data.Errors;
            Status = data.IsSuccess ? System.Net.HttpStatusCode.OK : System.Net.HttpStatusCode.BadRequest;
            return new ObjectResult(Status) { Value = this };
        }
    }
}