using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Helpers.ExtentionData;
using TrueMed.Domain.Model.Logger;
using TrueMed.Domain.Repositories.Connection.Interface;
using TrueMed.Domain.Repositories.Logging.Interface;

namespace TrueMed.Domain.Repositories.Logging.Implementation
{
    //public partial class RequestLogging<T> : IUserActivity
    //{
    //    public RequestLogging(IHttpContextAccessor httpContextAccessor) : base(httpContextAccessor)
    //    {
    //    }

    //    public RequestLogging(IConnectionManager connectionManager) : base(connectionManager)
    //    {
    //    }

    //    public RequestLogging(IConnectionManager connectionManager, ApplicationDBContext dbContext) : base(connectionManager, dbContext)
    //    {
    //    }

    //    public async Task LogActivityAsync(UserActivityLogViewModel viewModel)
    //    {
    //        var activityLog = new Database.tblUserActivity()
    //        {
    //            ID = Guid.NewGuid().ToString(),
    //            ActionDescription = viewModel.Description,
    //            ActionType = (int)viewModel.ActionType,
    //            ActivityType = (int)viewModel.ActivityType,
    //            CreateDate = DateTimeNow.Get,
    //            UserId = _connectionManager.UserId,
    //            EventName = viewModel.EventName,
    //            ActivityActionPage = _connectionManager.Request.Headers["Referer"]
    //        };

    //        if (viewModel.Data != null)
    //            activityLog.ExtentionData = new ExtentionData() { KeyValues = new List<KeyValues>() { new KeyValues { Key = "ExtendedData", Type = FieldType.Object, Value = viewModel.Data } } }.ToString();
    //        DbContext.tblUserActivities.Add(activityLog);

    //        await DbContext.SaveChangesAsync();
    //    }
    //}
}
