//using TrueMed.Domain.Repositories.Logging.Implementation;

namespace TrueMed.Business.Services.Logging
{
    //public static class Logger
    //{
    //    public static void LogInfo<T>(this IConnectionManager connection, string title, string message, ExtentionData extentionData = null) where T : class
    //    {
    //        Log<T>(connection, LogType.Information, title, message, extentionData);
    //    }

    //    public static void LogError<T>(this IConnectionManager connection, string title, string message, ExtentionData extentionData = null) where T : class
    //    {
    //        Log<T>(connection, LogType.Critical, title, message, extentionData);
    //    }

    //    public static void LogWarning<T>(this IConnectionManager connection, string title, string message, ExtentionData extentionData = null) where T : class
    //    {
    //        Log<T>(connection, LogType.Warnning, title, message, extentionData);
    //    }

    //    public static void Log<T>(this IConnectionManager connection, LogType logType, string title, string message, ExtentionData extentionData = null) where T : class
    //    {
    //        using (IRequestLogging requestLogging = new RequestLogging<T>(connection))
    //        {
    //            if (logType == LogType.Critical)
    //            {
    //                requestLogging.Log(logType, "", title, message, message, true, Status.Success, out var logId, extentionData);
    //            }
    //            else
    //            {
    //                requestLogging.Log(logType, "", title, message, true, Status.Success, out var logId, extentionData);
    //            }
    //        }
    //    }

    //    public static void UpdateLog(this IConnectionManager connection, string logId,  string message, ExtentionData extentionData = null)
    //    {
    //        using (IRequestLogging requestLogging = new RequestLogging<ExtentionData>(connection))
    //        {
    //            requestLogging.UpdateLog(logId, message, false, Status.Processing, extentionData);
    //        }
    //    }

    //}
}
