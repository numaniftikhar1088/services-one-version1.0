using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers
{
    public static class ActionDetails
    {
        public static ActionRequestInfo GetRequestInfo(HttpRequestMessage  httpRequest)
        {
            ActionRequestInfo actionRequestInfo = new ActionRequestInfo();
            actionRequestInfo.ActionPath = httpRequest.RequestUri.LocalPath;
            return actionRequestInfo;
        }
    }

    public class ActionRequestInfo
    {
        public string ActionPath { get; set;}
    }
}
