using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
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
using TrueMed.Domain.Repositories.Connection.Interface;
using TrueMed.Domain.Repositories.Logging.Interface;

namespace TrueMed.Domain.Repositories.Logging.Implementation
{
    //public partial class RequestLogging<T> : EnconterConnection, IRequestLogging
    //{
    //    public override void InitializeComponents(IConnectionManager connectionManager, ApplicationDBContext dbContext)
    //    {
            
    //    }
    //    string typeNameInfo => typeof(T).ToString();
    //    string logFileName = "Logs/CriticalLogs-" + DateTimeNow.Get.ToString("yyyy-MM-dd") + ".txt";

    //    public void Log(LogType logType, string path, string title, string message, bool isRequestProcessed, Status requestStatus, out string logId, ExtentionData extentionData = null)
    //    {
    //        var connectionTries = 1;
    //    agianTry: try
    //        {
    //            var log = new tblLog()
    //            {
    //                Id = Guid.NewGuid().ToString(),
    //                Title = title,
    //                Description = message,
    //                CreateDate = DateTimeNow.Get,
    //                LogType = (int)logType,
    //                PathName = path,
    //                UserId = _connectionManager.UserId,
    //                Status = (!isRequestProcessed ? (int)Status.Processing : (int)requestStatus),
    //                TypeInfo = typeNameInfo,
    //                ExtentionData = extentionData != null ? extentionData.ToString() : ""
    //            };
    //            DbContext.tblLogs.Add(log);
    //            logId = log.Id;
    //            DbContext.SaveChanges();
    //        }
    //        catch (Exception ex)
    //        {

    //            //ex.Number != sql permissin denied 
    //            if (connectionTries <= 3 && ex.IsConnectionProblem())
    //            {
    //                connectionTries++;
    //                goto agianTry;
    //            }
    //            else
    //            {
    //                LogCriticalToFileIfFails(ex.ToString());
    //                throw ex;
    //            }
    //        }
    //    }

    //    public void LogCriticalToFileIfFails(string error)
    //    {
    //        using (FileStream fileStream = new FileStream(logFileName, FileMode.OpenOrCreate))
    //        {
    //            using (StreamWriter streamWriter = new StreamWriter(fileStream))
    //            {
    //                streamWriter.WriteLine(DateTimeNow.Get + " ---------> " + _connectionManager.UserId + "--------------> " + typeNameInfo + " ----------------------> " + error);
    //            }
    //        }
    //    }

    //    public void Log(LogType logType, string path, string title, string message, string innerMessage, bool isRequestProcessed, Status requestStatus, out string logId, ExtentionData extentionData = null)
    //    {
    //        var connectionTries = 1;
    //    agianTry: try
    //        {
    //            var log = new tblLog()
    //            {
    //                Id = Guid.NewGuid().ToString(),
    //                Title = title,
    //                Description = message,
    //                LogType = (int)logType,
    //                CreateDate = DateTimeNow.Get,
    //                ExceptionMessage = innerMessage,
    //                PathName = path,
    //                UserId = _connectionManager.UserId,
    //                Status = (!isRequestProcessed ? (int)Status.Processing : (int)requestStatus),
    //                TypeInfo = typeNameInfo,
    //                ExtentionData = extentionData != null ? extentionData.ToString() : ""
    //            };
    //            DbContext.tblLogs.Add(log);
    //            DbContext.SaveChanges();
    //            logId = log.Id;
    //        }
    //        catch (Exception ex)
    //        {
    //            //ex.Number != sql permissin denied 
    //            if (connectionTries <= 3 && ex.IsConnectionProblem())
    //            {
    //                connectionTries++;
    //                goto agianTry;
    //            }
    //            else
    //            {
    //                LogCriticalToFileIfFails(ex.ToString());
    //                throw ex;
    //            }
    //        }
    //    }

    //    public ICollection<string> GetLogIds(Status status, int size)
    //    {
    //        var dbProcessingLogs = DbContext.tblLogs.Where(x => x.Status == (int)status).Take(size).Select(x => x.Id).ToList();
    //        return dbProcessingLogs;
    //    }

    //    public void UpdateLog(string logId, string message, bool isRequestProcessed, Status requestStatus, ExtentionData extentionData = null)
    //    {
    //        UpdateLog(logId, message, "", isRequestProcessed, requestStatus, null, null, extentionData);
    //    }

    //    public void UpdateLog(string logId, string message, string innerMessage, bool isRequestProcessed, Status requestStatus, ExtentionData extentionData = null)
    //    {
    //        UpdateLog(logId, message, innerMessage, isRequestProcessed, requestStatus, false, false, extentionData);
    //    }

    //    //Main log saving to database func..
    //    public void UpdateLog(string logId, string message, string innerMessage, bool? isRequestProcessed, Status? requestStatus, bool? isViewed, bool? isRead, ExtentionData extentionData = null)
    //    {
    //        var connectionTries = 1;
    //    agianTry: try
    //        {
    //            if (string.IsNullOrWhiteSpace(logId))
    //                return;

    //            if (IsExistLogById(logId))
    //            {

    //                List<string> keyValuesCommand = new List<string>();

    //                var parameters = new DynamicParameters();

    //                var paramIndex = 0;

    //                if (!string.IsNullOrWhiteSpace(message))
    //                {
    //                    keyValuesCommand.Add($" Description  = @p{paramIndex}");
    //                    parameters.Add("@p" + paramIndex++, message);
    //                }

    //                if (!string.IsNullOrWhiteSpace(innerMessage))
    //                {
    //                    keyValuesCommand.Add($"ExceptionMessage  = @p{paramIndex} ");
    //                    parameters.Add("@p" + paramIndex++, innerMessage);
    //                }

    //                keyValuesCommand.Add($" UpdateTime  = '{DateTimeNow.Get}' ");

    //                if (isRequestProcessed != null)
    //                    keyValuesCommand.Add($" Status  = {(isRequestProcessed == false ? (int)Status.Processing : (int)requestStatus)} ");

    //                if (isViewed != null)
    //                {
    //                    isViewed = isViewed ?? false;
    //                    if (isViewed == true)
    //                    {
    //                        keyValuesCommand.Add($" IsViewed  = {(isViewed == true ? 1 : 0)}, ViewedTime = '{DateTimeNow.Get}'");
    //                    }
    //                }

    //                if (isRead != null)
    //                {
    //                    isRead = isRead ?? false;
    //                    if (isRead == true)
    //                    {
    //                        keyValuesCommand.Add($" IsRead  = {(isRead == true ? 1 : 0)}, ReadTime = '{DateTimeNow.Get}'");
    //                    }
    //                }

    //                if (extentionData != null)
    //                {
    //                    keyValuesCommand.Add($" ExtentionData  = @p{paramIndex}");
    //                    parameters.Add("@p" + paramIndex++, new ExtentionData(extentionData, GetLogExtentionData(logId)).ToString());;
    //                }

    //                if (keyValuesCommand.Count <= 0)
    //                    return;

    //                var sqlCommand = $" UPDATE tblLogs SET {string.Join(",", keyValuesCommand)} WHERE Id = '{logId}'";

    //                using (SqlConnection connection = _connectionManager.CreateConnection())
    //                {
    //                    var isaffected = (int)connection.Execute(sqlCommand.ToString(), param: parameters) > 0;
    //                }
    //            }
    //        }
    //        catch (Exception ex)
    //        {
    //            //ex.Number != sql permissin denied 
    //            if (connectionTries <= 3 && ex.IsConnectionProblem())
    //            {
    //                connectionTries++;
    //                goto agianTry;
    //            }
    //        }
    //    }

    //    public void UpdateLog(string logId, bool isRequestProcessed, Status requestStatus, ExtentionData extentionData = null)
    //    {
    //        UpdateLog(logId, "", "", isRequestProcessed, requestStatus, null, null, extentionData);
    //    }

    //    public void UpdateLog(string logId, bool isRead, bool isViewed, bool isRequestProcessed, Status requestStatus, ExtentionData extentionData = null)
    //    {
    //        UpdateLog(logId, "", "", isRequestProcessed, requestStatus, isViewed, isRead, extentionData);
    //    }

    //    public void UpdateLog(string logId, bool isViewed, ExtentionData? extentionData = null)
    //    {
    //        UpdateLog(logId, "", "", null, null, isViewed, null, extentionData);
    //    }

    //    public void UpdateLogMessage(string logId, string message, string innerMessage, ExtentionData extentionData = null)
    //    {
    //        UpdateLog(logId, message, innerMessage, null, null, null, null, extentionData);
    //    }

    //    public void UpdateLogMessage(string logId, string message, ExtentionData extentionData = null)
    //    {
    //        UpdateLog(logId, message, "", null, null, null, null, extentionData);
    //    }

    //    public void UpdateLogExceptionMessage(string logId, string innerMessage, ExtentionData extentionData = null)
    //    {
    //        UpdateLog(logId, "", innerMessage, null, null, null, null, extentionData);
    //    }

    //    public void UpdateLog(string logId, bool isViewed, bool isRead, ExtentionData extentionData = null)
    //    {
    //        UpdateLog(logId, "", "", null, null, isViewed, isRead, extentionData);
    //    }

    //    public bool IsExistLogById(string logId)
    //    {
    //        return DbContext.tblLogs.Any(x => x.Id == logId);
    //    }

    //    public async Task<bool> IsExistLogByIdAsync(string logId)
    //    {
    //        return await DbContext.tblLogs.AnyAsync(x => x.Id == logId);
    //    }

    //    public async Task<bool> UpdateLogExtentionDataAsync(string logId, ExtentionData extentionData)
    //    {
    //        var extentionDataObj = new ExtentionData(extentionData, await GetLogExtentionDataAsync(logId)).ToString();
    //        using (SqlConnection connection = _connectionManager.CreateConnection())
    //        {
    //            var p = new DynamicParameters();
    //            p.Add("@p0", extentionDataObj);
    //            p.Add("@p1", logId);
    //            var isAffected = (int)await connection.ExecuteScalarAsync("UPDATE tblLogs Set ExtentionData = @p0 WHERE ID = @p1", p);
    //            return isAffected > 0;
    //        }
    //    }

    //    public async Task<ICollection<LogViewModel>> GetLogsAsync(LogType[] logTypes, int pageNumber, int size)
    //    {
    //        var logs = logTypes.Select(x => Convert.ToInt32(x));
    //        var data = await DbContext.tblLogs.Where(x => logs.Contains(x.LogType)).OrderByDescending(x => x.CreateDate).Skip((pageNumber - 1) * size).Take(size).Select(x => new { x.CreateDate, x.Status, x.LogType, x.Id, x.Description, x.Title }).ToListAsync();
    //        return data.Select(x => new LogViewModel { CreateDate = x.CreateDate, IsProcessed = (Status)x.Status == Status.Processing, Status = (Status)x.Status, LogType = (LogType)x.LogType, LogId = x.Id, Message = x.Description, Title = x.Title }).ToList();
    //    }

    //    public async Task<LogViewModel> GetLogInfoByIdAsync(string logId)
    //    {
    //        return await DbContext.tblLogs.Select(x => new LogViewModel { CreateDate = x.CreateDate, LogType = (LogType)x.LogType, LogId = x.Id, Message = x.Description, Title = x.Title }).FirstOrDefaultAsync(x => x.LogId == logId);
    //    }

    //    public async Task<LogWithExtentionDataViewModel> GetLogInfoWithExtentionDataByIdAsync(string logId)
    //    {
    //        return await DbContext.tblLogs.Where(x => x.Id == logId).Select(x => new LogWithExtentionDataViewModel
    //        {
    //            CreateDate = x.CreateDate,
    //            IsProcessed = (Status)x.Status == Status.Processing,
    //            Status = (Status)x.Status,
    //            LogType = (LogType)x.LogType,
    //            LogId = x.Id,
    //            Message = x.Description,
    //            Title = x.Title,
    //            ExtentionData = x.ExtentionData
    //        }).FirstOrDefaultAsync();
    //    }

    //    public async Task<string> GetLogExtentionDataAsync(string logId)
    //    {
    //        return await DbContext.tblLogs.Where(x => x.Id == logId).Select(x => x.ExtentionData).FirstOrDefaultAsync();
    //    }

    //    public string GetLogExtentionData(string logId)
    //    {
    //        return DbContext.tblLogs.Where(x => x.Id == logId).Select(x => x.ExtentionData).FirstOrDefault();
    //    }

    //    public void CheckAndUpdateLog(string logId, string message, bool isRequestProcessed, Status status)
    //    {
    //        if (!IsLogProcessing(logId))
    //        {
    //            UpdateLog(logId, message, "", isRequestProcessed, status, null, null, null);
    //        }
    //    }
    //    public bool IsLogProcessing(string logId)
    //    {
    //        var currentTime = DateTimeNow.Get;
    //        var isProcessing = DbContext.tblLogs.Any(x => x.Id == logId && (x.UpdateTime == null ? EF.Functions.DateDiffMinute(x.CreateDate, currentTime) > 4 : EF.Functions.DateDiffMinute(x.UpdateTime, currentTime) > 4) && x.Status == (int)Status.Processing);
    //        return isProcessing;
    //    }

    //}

}
