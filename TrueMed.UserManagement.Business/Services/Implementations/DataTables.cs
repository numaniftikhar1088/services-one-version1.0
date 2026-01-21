using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Domain.Models.Identity.Response;
using TrueMed.UserManagement.Domain.Models.Account.Request;
using System.Linq.Dynamic;
namespace TrueMed.UserManagement.Business.Services.Implementations
{
    public static class DataTables
    {
        public static DataReponseViewModel<UserReponseViewModel> GetAllUsers(int? labId, DataQueryViewModel<UserQueryViewModel> queryModel,
            IConnectionManager connectionManager, params string[] exceptedUserIds)
        {
            var userManagement = connectionManager.GetService<IUserManagement>();
            var labRoleManagement = connectionManager.GetService<ILabRoleManagement>();
            // Getting all user's data    
            var userData = userManagement
                .GetAllUsers(labId, exceptedUserIds)
                .Where(x => x.IsDirector == false)
                .OrderByDescending(x => x.CreateDate)
                .AsQueryable();


            if (queryModel != null)
            {
                if (!string.IsNullOrEmpty(queryModel.QueryModel?.Name))
                {
                    userData = userData.Where(x => (x.FirstName.ToLower() + " " + x.MiddleName.ToLower() + " " + x.LastName.ToLower()).Contains(queryModel.QueryModel.Name.ToLower()));
                }
                if (!string.IsNullOrEmpty(queryModel.QueryModel?.UserName))
                {
                    userData = userData.Where(x => x.UserName.ToLower().Contains(queryModel.QueryModel.UserName.ToLower()));
                }
                if (!string.IsNullOrEmpty(queryModel.QueryModel?.Email))
                {
                    userData = userData.Where(x => x.Email.ToLower().Contains(queryModel.QueryModel.Email.ToLower()));
                }
                if (!string.IsNullOrEmpty(queryModel.QueryModel?.Mobile))
                {
                    userData = userData.Where(x => x.Mobile.ToLower().Contains(queryModel.QueryModel.Mobile.ToLower()));
                }
                if (queryModel.QueryModel?.UserType != null)
                {
                    userData = userData.Where(x => x.UserType == queryModel.QueryModel.UserType);
                }
                if (queryModel.QueryModel?.IsActive != null)
                {
                    userData = userData.Where(x => x.IsActive == (bool)queryModel.QueryModel.IsActive);
                }
                if (!string.IsNullOrEmpty(queryModel.QueryModel?.NPI))
                {
                    userData = userData.Where(x => EF.Functions.Like(x.AdditionalInfo.NPI, $"%{queryModel.QueryModel.NPI}%"));
                }
                if (queryModel.QueryModel?.TwoFactorAuth != null)
                {
                    userData = userData.Where(x => x.TwoFactorAuth == queryModel.QueryModel.TwoFactorAuth);
                }
                if (!string.IsNullOrEmpty(queryModel.QueryModel?.RoleName))
                {
                    var _userIds = labRoleManagement
                        .GetAllUserRoles()
                        .Where(x =>
                        EF.Functions
                        .Like(x.RoleName, $"%{queryModel.QueryModel.RoleName}%"))
                        .Select(x => x.UserId).ToList();
                    userData = userData.Where(x => _userIds.Contains(x.Id));
                }
            }

            //total number of rows count     
            var recordsTotal = userData.Count();
            //Paging     
            var data = userData.Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToList();

            var userIds = data.Select(x => x.Id).ToList();

            if (labId != null)
            {
                var roles = labRoleManagement
                         .GetAllUserRoles()
                         .Where(x => userIds.Contains(x.UserId)).ToList();


                data.ForEach(x =>
                {
                    var role = roles
                .FirstOrDefault(_ => _.UserId == x.Id);
                    x.Role = role?.RoleName;
                    x.RoleType = role?.RoleType;
                    x.RoleTypeName = role?.RoleTypeName;
                });
            }
            //Returning Json Data    
            return new DataReponseViewModel<UserReponseViewModel>
            { Total = recordsTotal, Data = data };


        }

        public static DataReponseViewModel<UserBrief_ViewModel> GetUsersBriefInfo(int? labId, DataQueryViewModel<UserBrief_QueryViewModel> queryModel, IUserManagement userManager, params string[] exceptedUserIds)
        {
            // Getting all user's data    
            var userData = userManager.GetAllUsers(labId, exceptedUserIds).OrderByDescending(x => x.CreateDate).AsQueryable();


            if (queryModel != null)
            {
                if (!string.IsNullOrEmpty(queryModel.QueryModel.Name))
                {
                    userData = userData.Where(x => (x.FirstName.ToLower() + " " + x.MiddleName.ToLower() + " " + x.LastName.ToLower()).ToLower().Contains(queryModel.QueryModel.Name.ToLower()));
                }

                if (!string.IsNullOrEmpty(queryModel.QueryModel.Email))
                {
                    userData = userData.Where(x => x.Email.ToLower().Contains(queryModel.QueryModel.Email.ToLower()));
                }
            }

            //total number of rows count     
            var recordsTotal = userData.Count();

            ////Sorting    
            //if (!string.IsNullOrWhiteSpace(sortColumn) && !string.IsNullOrWhiteSpace(sortColumnDir))
            //{
            //    userData = userData.OrderBy(sortColumn + " " + sortColumnDir);
            //}

            //Paging     
            var data = userData.Select(x => new UserBrief_ViewModel
            {
                Email = x.Email,
                Id = x.Id,
                Name = x.FirstName + " " + x.MiddleName + " " + x.LastName

            }).Skip(
                (queryModel.PageNumber - 1)
                * queryModel.PageSize)
                .Take(queryModel.PageSize).ToList();
            //Returning Json Data    
            return new DataReponseViewModel<UserBrief_ViewModel>
            { Total = recordsTotal, Data = data };

        }

        public static object GetAllUsers(HttpRequest request, int? labId, IUserManagement userManager, params string[] exceptedUserIds)
        {

            var draw = request.Form["draw"].FirstOrDefault();
            var start = request.Form["start"].FirstOrDefault();
            var length = request.Form["length"].FirstOrDefault();
            var sortColumn = request.Form["columns[" + request.Form["order[0][column]"].FirstOrDefault() + "][name]"].FirstOrDefault();
            var sortColumnDir = request.Form["order[0][dir]"].FirstOrDefault();
            var searchValue = request.Form["search[value]"].FirstOrDefault();


            //Paging Size (10,20,50,100)    
            int pageSize = length != null ? Convert.ToInt32(length) : 0;
            int skip = start != null ? Convert.ToInt32(start) : 0;
            int recordsTotal = 0;

            // Getting all user's data    
            var userData = userManager.GetAllUsers(labId, exceptedUserIds);

            //Sorting    
            if (!string.IsNullOrWhiteSpace(sortColumn) && !string.IsNullOrWhiteSpace(sortColumnDir))
            {
                userData = userData.OrderBy(sortColumn + " " + sortColumnDir);
            }
            //Search
            //if (searchValue.StartsWith("type:") && Enum.IsDefined(typeof(Roles), searchValue.Replace("type:", "")))
            //{
            //    var roleId = (int)Enum.Parse(typeof(Roles), searchValue.Replace("type:", ""));
            //    userData = userData.Where(x => x. == roleId);
            //}
            else if (!string.IsNullOrEmpty(searchValue))
            {
                userData = userData.Where(x => (x.FirstName.ToLower() + " " + x.MiddleName.ToLower() + " " + x.LastName.ToLower()).Contains(searchValue) || x.Email.Contains(searchValue));
            }

            //total number of rows count     
            recordsTotal = userData.Count();
            //Paging     
            var data = userData.Skip(skip).Take(pageSize).ToList();
            //Returning Json Data    
            return JsonConvert.SerializeObject(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data });

        }

        public static object GetAllUsersForJsTable(HttpRequest request, int? labId, IUserManagement usermanagement, params string[] exceptedUserIds)
        {
            try
            {
                var draw = request.Form["draw"].FirstOrDefault();
                var start = request.Form["start"].FirstOrDefault();
                var length = request.Form["length"].FirstOrDefault();
                var sortColumn = request.Form["columns[" + request.Form["order[0][column]"].FirstOrDefault() + "][name]"].FirstOrDefault();
                var sortColumnDir = request.Form["order[0][dir]"].FirstOrDefault();
                var searchValue = request.Form["search[value]"].FirstOrDefault();


                //Paging Size (10,20,50,100)    
                int pageSize = length != null ? Convert.ToInt32(length) : 0;
                int skip = start != null ? Convert.ToInt32(start) : 0;
                int recordsTotal = 0;

                // Getting all facility's data    
                var userData = usermanagement.GetAllUsers(labId).Where(x => !exceptedUserIds.Contains(x.Id));



                //Sorting    
                if (!string.IsNullOrWhiteSpace(sortColumn) && !string.IsNullOrWhiteSpace(sortColumnDir))
                {
                    userData = userData.OrderBy(sortColumn + " " + sortColumnDir);
                }
                //Search
                if (!string.IsNullOrEmpty(searchValue))
                {
                    userData = userData.Where(x => x.FirstName.Contains(searchValue) || x.LastName.Contains(searchValue)
                     || x.Email.Contains(searchValue) || x.MiddleName.Contains(searchValue));
                }

                //total number of rows count     
                recordsTotal = userData.Count();
                //Paging     
                var data = userData.Skip(skip).Take(pageSize).ToList();
                //Returning Json Data    
                return JsonConvert.SerializeObject(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data });
            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}
