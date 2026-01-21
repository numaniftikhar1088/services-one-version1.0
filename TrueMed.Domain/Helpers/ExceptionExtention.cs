using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers
{
    public static class ExceptionExtention
    {
        public static Exception GetBaseException(this Exception exception)
        {
            while (exception.InnerException != null)
                exception = exception.InnerException;
            return exception;
        }

        public static bool IsConnectionProblem(this Exception exception)
        {
            var exceptionMsg = exception.ToString();
            return (exceptionMsg.Contains("The underlying provider failed on Open.") || exceptionMsg.Contains("An exception has been raised that is likely due to a transient failure.") || exceptionMsg.Contains("System.Data.SqlClient.SqlException: Execution Timeout Expired"));
        }
    }
}
