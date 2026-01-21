using Microsoft.AspNet.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Model.Laboratory;
using TrueMed.Domain.Model.Logger;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Domain.Models.Identity.Response;
using TrueMed.Business.Interface;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Dtos;
using TrueMed.MasterPortalAppManagement.Domain.Models.Lab.Response;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Lab.Interfaces;
using TrueMed.MasterPortalServices.BusinessLayer.Models.Lab;
using TrueMed.UserManagement.Domain.Models.Identity;
using TrueMed.Business.Services.Connection;

namespace TrueMed.MasterPortalAppManagement.Business.Services.Lab
{
    public static class LabManager
    {
        public static async Task<LabIdentityResult>
            CreateLabAsync(LabViewModel labViewModel, IConnectionManager connectionManager)
        {
            var labManagement = connectionManager.GetService<ILabManagement>();
            var labAssignManagement = connectionManager.GetService<ILabAssignmentManagement>();

            using (TransactionScope transaction =
                new TransactionScope(TransactionScopeOption.Required,
                new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted },
                TransactionScopeAsyncFlowOption.Enabled))
            {
                var labIdentityResult = labManagement.CreateLab(labViewModel);
                if (!labIdentityResult.IsSuccess)
                {
                    return labIdentityResult;
                }

                if (!string.IsNullOrWhiteSpace(connectionManager.X_Portal_Key_Value)
                    && !connectionManager.X_Portal_Key_Value.Equals(ConnectionManager.MASTER_PORTAL_KEY))
                {
                    if (connectionManager.GetLabId() == null)
                    {
                        return new LabIdentityResult(Status.Failed,
                            "Invalid request, please check x-portal-key.");
                    }
                    var labAssignResult = await labAssignManagement.AddReferenceLabInPrimaryLabByIdAsync(new Domain.Models.Lab.Request.ReferenceLabAssignmentViewModel
                    {
                        LabApprovementStatus = LabApprovementStatus.Pending,
                        LabType =(int?)LabType.Primary,
                        PrimaryLabId = (int)connectionManager.GetLabId(),
                        ReferenceLabId = (int)labIdentityResult.LabId
                    });
                    if (!labAssignResult.IsSuccess)
                        return labAssignResult;
                }
                transaction.Complete();
                return labIdentityResult;
            }
        }

        public static LabIdentityResult UpdateLab(UpdateLabViewModel labViewModel, IConnectionManager connectionManager)
        {
            var labManagement = connectionManager.GetService<ILabManagement>();
            var userManagement = connectionManager.GetService<IUserManagement>();

            using (TransactionScope transaction = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions() { IsolationLevel = IsolationLevel.ReadUncommitted }))
            {
                var labIdentityResult = labManagement.UpdateLab(labViewModel);
                if (!labIdentityResult.IsSuccess)
                {
                    return labIdentityResult;
                }
                transaction.Complete();
                return labIdentityResult;
            }
        }

        public static DataReponseViewModel<LabDatatableResponseViewModel> GetLabs(DataQueryViewModel<LabQueryViewModel> queryModel, ILabManagement labManagement, params int[] exceptedLabIds)
        {
            // Getting all lab's data    
            var labData = labManagement.GetAllLabs(exceptedLabIds)
                .OrderByDescending(x => x.CreateDate).AsQueryable();

            if (queryModel != null)
            {
                if (!string.IsNullOrEmpty(queryModel.QueryModel.LabName))
                {
                    labData = labData.Where(x =>
                    x.LabDisplayName.ToLower().Contains(queryModel.QueryModel.LabName.ToLower()) ||
                    x.LabName.ToLower().Contains(queryModel.QueryModel.LabName.ToLower()));
                }
                if (!string.IsNullOrEmpty(queryModel.QueryModel.CLIA))
                {
                    labData = labData.Where(x => x.CLIA.ToLower().Contains(queryModel.QueryModel.CLIA.ToLower()));
                }

                if (!string.IsNullOrEmpty(queryModel.QueryModel.Director))
                {
                    labData = labData.Where(x =>
                    (x.LabDirector.FirstName + x.LabDirector.MiddleName + x.LabDirector.LastName)
                    .Replace(" ", "")
                    .ToLower().Contains(queryModel.QueryModel.Director.Replace(" ", "").ToLower()));
                }

                if (queryModel.QueryModel.IsReferenceLab != null)
                {
                    labData = labData.Where(x => x.IsReferenceLab == queryModel.QueryModel.IsReferenceLab);
                }

                if (queryModel.QueryModel.IsActive != null)
                {
                    labData = labData.Where(x => x.IsActive == queryModel.QueryModel.IsActive);
                }
            }

            //total number of rows count     
            var recordsTotal = labData.Count();


            //Paging     
            var data = labData.Select(x => new LabDatatableResponseViewModel
            {
                Address = x.Address,
                CLIA = x.CLIA,
                Email = x.Email,
                LabDirectorName = x.LabDirector.FirstName + " " + x.LabDirector.MiddleName + " " + x.LabDirector.LastName,
                LabDisplayName = x.LabDisplayName,
                LabId = x.Id ?? 0,
                LabName = x.LabName,
                Logo = x.Logo,
                DirectorPhone = x.LabDirector.Phone,
                Phone = x.Phone,
                IsActive = x.IsActive,
                IsReferenceLab = x.IsReferenceLab,
                CreateDate = x.CreateDate
            }).Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToList();



            //Returning Json Data    
            return new DataReponseViewModel<LabDatatableResponseViewModel>
            { Total = recordsTotal, Data = data };


        }

        public static DataReponseViewModel<ReferenceLabDatatableResponseViewModel>
            GetReferenceLabs(DataQueryViewModel<ReferenceLabQueryViewModel> queryModel,
            IConnectionManager connectionManager, params int[] exceptedLabIds)
        {
            var labManagement = connectionManager.GetService<ILabManagement>();
            var labAssignManagement = connectionManager.GetService<ILabAssignmentManagement>();

            var primaryLab = connectionManager.GetLabId();
            // Getting all lab's data    
            var labData = labManagement.GetAllLabs(exceptedLabIds)
                .Join(labAssignManagement.GetAllReferenceLabsAssignment()
                .Where(x => x.PrimaryLabId == primaryLab),
                pri => pri.Id,
                refe => refe.ReferenceLabId,
                (pri, refe) => new ReferenceLabDatatableResponseViewModel
                {
                    Address = pri.Address,
                    CLIA = pri.CLIA,
                    Email = pri.Email,
                    LabDirectorName = pri.LabDirector.FirstName + " " + pri.LabDirector.MiddleName + " " + pri.LabDirector.LastName,
                    LabDisplayName = pri.LabDisplayName,
                    LabId = pri.Id ?? 0,
                    LabName = pri.LabName,
                    Logo = pri.Logo,
                    DirectorPhone = pri.LabDirector.Phone,
                    Phone = pri.Phone,
                    IsActive = pri.IsActive,
                    IsReferenceLab = pri.IsReferenceLab,
                    CreateDate = pri.CreateDate,
                    ApprovementStatus = refe.Status
                })
                .OrderByDescending(x => x.CreateDate).AsQueryable();

            if (queryModel != null)
            {
                if (!string.IsNullOrEmpty(queryModel.QueryModel.LabName))
                {
                    labData = labData.Where(x =>
                    x.LabDisplayName.ToLower().Contains(queryModel.QueryModel.LabName.ToLower()) ||
                    x.LabName.ToLower().Contains(queryModel.QueryModel.LabName.ToLower()));
                }
                if (!string.IsNullOrEmpty(queryModel.QueryModel.CLIA))
                {
                    labData = labData.Where(x => x.CLIA.ToLower().Contains(queryModel.QueryModel.CLIA.ToLower()));
                }

                if (!string.IsNullOrEmpty(queryModel.QueryModel.Director))
                {
                    labData = labData.Where(x =>
                    x.LabDirectorName.Replace(" ", "")
                    .ToLower().Contains(queryModel.QueryModel.Director.Replace(" ", "").ToLower()));
                }

                if (queryModel.QueryModel.IsReferenceLab != null)
                {
                    labData = labData.Where(x => x.IsReferenceLab == queryModel.QueryModel.IsReferenceLab);
                }

                if (queryModel.QueryModel.IsActive != null)
                {
                    labData = labData.Where(x => x.IsActive == queryModel.QueryModel.IsActive);
                }
            }

            //total number of rows count     
            var recordsTotal = labData.Count();


            //Paging     
            var data = labData.Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToList();



            //Returning Json Data    
            return new DataReponseViewModel<ReferenceLabDatatableResponseViewModel>
            { Total = recordsTotal, Data = data };


        }

        public static DataReponseViewModel<LabBaseViewModel> GetLabsBrief(DataQueryViewModel<string> queryModel, ILabManagement labManagement, params int[] exceptedLabIds)
        {
            // Getting all lab's data    
            var labData = labManagement.GetAllLabs(exceptedLabIds)
                .OrderByDescending(x => x.CreateDate).AsQueryable();

            if (queryModel != null)
            {
                if (!string.IsNullOrEmpty(queryModel.QueryModel))
                {
                    labData = labData.Where(x =>
                    x.LabName.ToLower().Contains(queryModel.QueryModel)
                    ||
                    x.LabDisplayName.ToLower().Contains(queryModel.QueryModel)
                    );
                }
            }

            //total number of rows count     
            var recordsTotal = labData.Count();


            //Paging     
            var data = labData.Select(x => new LabBaseViewModel
            {
                Id = x.Id ?? 0,
                LabName = x.LabName,
                LabDisplayName = x.LabDisplayName,
                CreateDate = x.CreateDate
            }).Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToList();



            //Returning Json Data    
            return new DataReponseViewModel<LabBaseViewModel>
            { Total = recordsTotal, Data = data };


        }

        public static DataReponseViewModel<ReferenceLabBaseModel> GetReferenceLabsBrief(DataQueryViewModel<string> queryModel, ILabManagement labManagement, params int[] exceptedLabIds)
        {
            // Getting all lab's data    
            var labData = labManagement.GetAllLabs(exceptedLabIds).Where(x => x.IsReferenceLab == true)
                .OrderByDescending(x => x.CreateDate).AsQueryable();

            if (queryModel != null)
            {
                if (!string.IsNullOrEmpty(queryModel.QueryModel))
                {
                    labData = labData.Where(x =>
                    x.LabName.ToLower().Contains(queryModel.QueryModel)
                    ||
                    x.LabDisplayName.ToLower().Contains(queryModel.QueryModel)
                    );
                }
            }

            //total number of rows count     
            var recordsTotal = labData.Count();

            //Paging     
            var data = labData.Select(x => new ReferenceLabBaseModel
            {
                Id = x.Id,
                Name = x.LabDisplayName,
            }).Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToList();


            //Returning Json Data    
            return new DataReponseViewModel<ReferenceLabBaseModel>
            { Total = recordsTotal, Data = data };


        }
    }
}
