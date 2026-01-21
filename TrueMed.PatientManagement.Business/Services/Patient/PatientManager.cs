using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Business.Interface;
using TrueMed.PatientManagement.Domain.Models;
using TrueMed.PatientManagement.Domain.Models.Patient.Request;
using TrueMed.PatientManagement.Domain.Repositories.Patient.Interface;

namespace TrueMed.PatientManagement.Business.Services.Patient
{
    public static class PatientManager
    {
        public static async Task<PatientResult> UpdatePatientAsync(PatientViewModel patientViewModel, IConnectionManager connectionManager)
        {
            var identityResult = IdentityResult.FailedResult<PatientResult>();
            var patientManagement = connectionManager.GetService<IPatientManagement>();

            using (TransactionScope transactionScope =
                new TransactionScope(TransactionScopeOption.Required,
                TransactionScopeAsyncFlowOption.Enabled))
            {
                var isUpdating = patientViewModel is UpdatePatientViewModel;
                var patientId = isUpdating ? ((UpdatePatientViewModel)patientViewModel).Id : patientViewModel.Id;
                if (isUpdating)
                {
                    if (!await patientManagement.IsPatientExistsByIdAsync((int)patientId))
                    {
                        identityResult.AddError(nameof(patientViewModel.Id), $"Inavlid patient id (Patient with id {patientId} not found).");
                    }
                }
                if (!isUpdating)
                {
                    if (!await patientManagement.IsPatientFacilityExistsByIdAsync(patientViewModel.PatientAddress.FacilityId ?? 0))
                        identityResult.AddError(nameof(patientViewModel.PatientAddress.FacilityId), "Invalid facility id.");
                }
                //else if (!await patientManagement.IsPatientFacilityExistsByIdAsync(((UpdatePatientViewModel)patientViewModel).PatientAddress.FacilityId ?? 0))
                //{
                //    identityResult.AddError(nameof(patientViewModel.PatientAddress.FacilityId), "Invalid facility id.");
                //}

                if (!Enum.TryParse(typeof(Domain.Models.Patient.Gender), patientViewModel.Gender, out var result))
                {
                    identityResult.AddError(nameof(patientViewModel.Gender), $"Inavlid gender value (value must belong to {string.Join(',', Enum.GetNames(typeof(Domain.Models.Patient.Gender)))}).");
                }

                if (identityResult.HasErrors)
                {
                    return identityResult;
                }

                var isDone = await patientManagement.AddOrUpdatePatientAsync(patientViewModel);
                if (isDone)
                {
                    if (!isUpdating)
                    {
                        var isDonePatientAddress = await patientManagement
                                .AddOrUpdatePatientAddressAsync((int)patientViewModel.Id, patientViewModel.PatientAddress);
                        if (!isDonePatientAddress)
                        {
                            return identityResult.MakeFailed<PatientResult>();
                        }
                    }
                    else
                    {
                        var address = ((UpdatePatientViewModel)patientViewModel).PatientAddress;
                        var isDonePatientAddress = await patientManagement
                            .AddOrUpdatePatientAddressAsync((int)patientViewModel.Id, address);
                        if (!isDonePatientAddress)
                        {
                            return identityResult.MakeFailed<PatientResult>();
                        }
                    }
                    transactionScope.Complete();
                    identityResult.UpdateIdentifier(patientViewModel.Id);
                    return identityResult.MakeSuccessed<PatientResult>();
                }
                else
                {
                    return identityResult;
                }
            }
        }

        public static async Task<DataReponseViewModel<Domain.Models.Patient.Response.PatientViewModel>>
            SearchPatientByName(DataQueryViewModel<string> queryModel, IConnectionManager connectionManager)

        {

            var patientManagement = connectionManager.GetService<IPatientManagement>();
            var patients = patientManagement.GetAllPatients().Where(x => x.Patient.FirstName.Contains(queryModel.QueryModel) ||
            x.Patient.LastName.Contains(queryModel.QueryModel) ||
            (x.Patient.FirstName + x.Patient.MiddleName + x.Patient.LastName).Replace(" ", "").Contains(queryModel.QueryModel));

            var searchResult = patients.Select(x => new Domain.Models.Patient.Response.PatientViewModel
            {
                Id = x.Patient.PatientId,
                FirstName = x.Patient.FirstName,
                LastName = x.Patient.LastName,
                MiddleName = x.Patient.MiddleName,
                DateOfBirth = x.Patient.DateOfBirth.ToString(),
                Email = x.Patient.Email ?? "",
                Gender = x.Patient.Gender,
                Mobile = x.Patient.Mobile ?? ""

            });


            var recordsTotal = await searchResult.CountAsync();

            var result = await searchResult.Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                 .Take(queryModel.PageSize).ToListAsync();

            //Returning Json Data    
            return new DataReponseViewModel<Domain.Models.Patient.Response.PatientViewModel>
            { Total = recordsTotal, Data = result };

        }
    }
}
