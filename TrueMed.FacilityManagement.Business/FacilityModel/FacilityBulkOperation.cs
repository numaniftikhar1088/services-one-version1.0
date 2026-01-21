using System.Transactions;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.File;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Model.Laboratory;
using TrueMed.Business.Interface;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.Business.Services.Logging;
namespace TrueMed.Business.Services.FacilityModel
{
    //public class FacilityBulkOperation
    //{
    //    private readonly IConnectionManager _connectionManager;
    //    private readonly int TotalOrders;
    //    private readonly FileViewModel _fileInfo;
    //    public string LogId { get; }

    //    public FacilityBulkOperation(IConnectionManager connectionManager, int totalOrders, FileViewModel fileInfo, string logId)
    //    {
    //        this.Ids = new List<int>();
    //        Result = new FacilityBulkResult(Domain.Model.Identity.Status.Success, null);
    //        this._connectionManager = connectionManager;
    //        this.TotalOrders = totalOrders;
    //        this._fileInfo = fileInfo;
    //        this.LogId = logId;
    //    }

    //    public List<int> Ids { get; private set; }
    //    public FacilityBulkResult Result { get; private set; }
    //    public void Perform(IEnumerable<FacilitySaveViewModel> viewModels, ref int processedOrdres)
    //    {
    //        foreach (var viewModel in viewModels)
    //        {
    //            var dbConnectionFailedTries = 1;
    //        //try once more
    //        processAgain: try
    //            {
    //                using (TransactionScope transactionScope = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted }))
    //                {
    //                    using (IEnconterConnection context = new EnconterConnection(_connectionManager))
    //                    {
    //                        using (IFacilityManager facilityManager = new Domain.Repositories.Lab.Implementation.FacilityManager(_connectionManager, context.DbContext))
    //                        {
    //                            using (IUserManager userManager = new Domain.Repositories.Identity.Implementation.UserManager(_connectionManager, context.DbContext))
    //                            {

    //                                var user = new ApplicationUser
    //                                {
    //                                    FirstName = viewModel.Creadentials.PhysicianFullName,
    //                                    Username = viewModel.Creadentials.Username,
    //                                    Email = viewModel.Creadentials.Username,
    //                                    Role = Roles.Physician,
    //                                    SubRole = (int)SubRole.LabAdmin
    //                                };


    //                                var facilityResult = facilityManager.AddOrUpdateFacility(viewModel, _fileInfo.Id);
    //                                if (!facilityResult.IsSuccess)
    //                                {

    //                                    //returning errors to main type
    //                                    Result.UpdateErrors(facilityResult.Errors);

    //                                    //returning error prone order with errors
    //                                    Result.ErrorResults.Add(new ErrorResult { ErrorProneItem = viewModel, Errors = facilityResult.Errors });

    //                                    continue;
    //                                }

    //                                string userId = string.Empty;
    //                                if (!userManager.IsUserExistsByEmail(viewModel.Creadentials.Username))
    //                                {
    //                                    var identity = userManager.RegisterUser(user, viewModel.Creadentials.Password, true);

    //                                    if (!identity.IsSuccess)
    //                                    {

    //                                        Result.UpdateErrors(identity.Errors);
    //                                        Result.ErrorResults.Add(new ErrorResult { ErrorProneItem = viewModel, Errors = identity.Errors });

    //                                        continue;
    //                                    }

    //                                    userId = user.Id;

    //                                    var additionalResultIdentity = userManager.UpdateUserAdditionalInfo(new UserAdditionalInfo
    //                                    {
    //                                        NPI = viewModel.Creadentials.NPI,
    //                                        StateLicenseNo = viewModel.Creadentials.StateLicense,
    //                                        Id = userId,
    //                                    });

    //                                    if (!additionalResultIdentity.IsSuccess)
    //                                    {

    //                                        Result.UpdateErrors(additionalResultIdentity.Errors);
    //                                        Result.ErrorResults.Add(new ErrorResult { ErrorProneItem = viewModel, Errors = additionalResultIdentity.Errors });

    //                                        continue;
    //                                    }
    //                                }
    //                                else
    //                                {
    //                                    userId = userManager.GetUserIdByEmail(viewModel.Creadentials.Username);
    //                                }

    //                                if (!facilityResult.IsSuccess)
    //                                {

    //                                    Result.UpdateErrors(facilityResult.Errors);
    //                                    Result.ErrorResults.Add(new ErrorResult { ErrorProneItem = viewModel, Errors = facilityResult.Errors });

    //                                    continue;
    //                                }

    //                                facilityResult = facilityManager.AddUserInFacility(new FacilityUserViewModel { FacilityId = facilityResult.FacilityId, UserId = userId });

    //                                if (!facilityResult.IsSuccess)
    //                                {

    //                                    Result.UpdateErrors(facilityResult.Errors);
    //                                    Result.ErrorResults.Add(new ErrorResult { ErrorProneItem = viewModel, Errors = facilityResult.Errors });

    //                                    continue;
    //                                }

    //                                if (facilityResult.IsSuccess)
    //                                {
    //                                    facilityManager.SaveFiles(facilityResult.FacilityId, viewModel.Files, true);
    //                                    viewModel.FacilityId = facilityResult.FacilityId;

    //                                    using (var scope = new TransactionScope(TransactionScopeOption.Suppress))
    //                                    {

    //                                        processedOrdres++;
    //                                        _connectionManager.UpdateLog(LogId, $"Orders ({processedOrdres}/{TotalOrders}) are being process.");
    //                                    }
    //                                    Ids.Add(facilityResult.FacilityId);
    //                                    Result.SuccessResults.Add(viewModel);
    //                                    transactionScope.Complete();
    //                                }
    //                            }
    //                        }
    //                    }
    //                }
    //            }
    //            catch (Exception ex)
    //            {
    //                if (ex.IsConnectionProblem() && dbConnectionFailedTries <= 3)
    //                {
    //                    dbConnectionFailedTries++;
    //                    goto processAgain;
    //                }
    //                else
    //                {
    //                    lock (Result)
    //                    {
    //                        try
    //                        {
    //                            var dictionaryError = new Dictionary<string, string>();
    //                            dictionaryError.Add(ex.GetBaseException().GetType().FullName, ex.ToString());
    //                            Result.ErrorResults.Add(new ErrorResult
    //                            {
    //                                ErrorProneItem = viewModel,
    //                                Errors = dictionaryError
    //                            });

    //                            //Returning errors to main type for collection
    //                            Result.AddError(ex.GetBaseException().GetType().FullName, ex.ToString());

    //                            //logging critical errors;
    //                            _connectionManager.LogError<FacilityBulkOperation>(ex.GetBaseException().GetType().Name, ex.ToString());
    //                        }
    //                        catch { }
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}
}