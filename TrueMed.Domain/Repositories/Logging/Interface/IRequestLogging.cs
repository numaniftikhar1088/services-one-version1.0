using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Helpers.ExtentionData;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Model.Logger;

namespace TrueMed.Domain.Repositories.Logging.Interface
{
    public interface IRequestLogging : IEnconterConnection
    {
        ICollection<string> GetLogIds(Status status, int size = 20);
        [MethodImpl(MethodImplOptions.Synchronized)]
        bool IsLogProcessing(string logId);
        void Log(LogType logType, string path, string title, string message, bool isRequestProcessed, Status requestStatus, out string logId, ExtentionData extentionData = null);
        void Log(LogType logType, string path, string title, string message, string innerMessage, bool isRequestProcessed, Status requestStatus, out string logId, ExtentionData extentionData = null);
        void UpdateLog(string logId, string message, bool isRequestProcessed, Status requestStatus, ExtentionData extentionData = null);
        void UpdateLog(string logId, string message, string innerMessage, bool isRequestProcessed, Status requestStatus, ExtentionData extentionData = null);
        void UpdateLog(string logId, bool isRequestProcessed, Status requestStatus, ExtentionData extentionData = null);
        void UpdateLog(string logId, bool isRead, bool isViewed, bool isRequestProcessed, Status requestStatus, ExtentionData extentionData = null);
        void UpdateLog(string logId, bool isViewed, ExtentionData extentionData = null);
        void UpdateLog(string logId, bool isViewed, bool isRead, ExtentionData extentionData = null);
        void UpdateLogExceptionMessage(string logId, string innerMessage, ExtentionData extentionData = null);
        void UpdateLogMessage(string logId, string message, string innerMessage, ExtentionData extentionData = null);
        void UpdateLogMessage(string logId, string message, ExtentionData extentionData = null);
        Task<ICollection<LogViewModel>> GetLogsAsync(LogType[] logTypes, int pageNumber, int size);
        Task<LogViewModel> GetLogInfoByIdAsync(string logId);
        void CheckAndUpdateLog(string logId, string message, bool isRequestProcessed, Status somethingWentWrong);
        void UpdateLog(string logId, string message, string innerMessage, bool? isRequestProcessed, Status? requestStatus, bool? isViewed, bool? isRead, ExtentionData extentionData = null);
        Task<string> GetLogExtentionDataAsync(string logId);
        bool IsExistLogById(string logId);
        Task<bool> IsExistLogByIdAsync(string logId);
        Task<bool> UpdateLogExtentionDataAsync(string logId, ExtentionData extentionData);
        string GetLogExtentionData(string logId);
        Task<LogWithExtentionDataViewModel> GetLogInfoWithExtentionDataByIdAsync(string logId);
    }

}
