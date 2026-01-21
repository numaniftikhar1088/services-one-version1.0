using TrueMed.Business.Interface;

namespace TrueMed.Business.Helpers
{
    public class LogVerificationService
    {
        public static void VerifyLogs(IConnectionManager connectionManager)
        {
            //using (TransactionScope transactionScope = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted }))
            //{
            //    using (IRequestLogging logging = new RequestLogging<LogVerificationService>(connectionManager))
            //    {
            //        var dbProcessingLogs = logging.GetLogIds(Status.Processing);
            //        foreach (var logId in dbProcessingLogs)
            //        {
            //            logging.CheckAndUpdateLog(logId, "The request was not successfull, might be deployment or internal server problem.", true, Status.SomethingWentWrong);
            //        }
            //        transactionScope.Complete();
            //    }

            //}
        }
    }
}
