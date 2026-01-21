using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.SecurityNamespace;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using System.Net;
using System.Web;
using TrueMed.Business.Interface;
using TrueMed.Domain.Model.Facility.Response;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Model.Laboratory;
using TrueMed.Domain.Models.Common;
using TrueMed.Domain.Models.Datatable;
using TrueMed.Domain.Repositories.Identity.Interface;
using TrueMed.Domain.Repositories.Lab.Interface;
using TrueMed.FacilityManagement.Domain.Models.Facility.Request;
using TrueMed.FacilityManagement.Domain.Models.Facility.Response;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace TrueMed.Business.Services.FacilityModel
{
    public static class DataTables
    {
        public static object GetFacilitiesForJs(HttpRequest request, IFacilityManagement facilityManagement)
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
                var facilityData = facilityManagement.GetFacilities().Select(facility =>
                                new
                                {
                                    ContactName = facility.ContactInfo.ContactFirstName + " " + facility.ContactInfo.ContactLastName,
                                    FacilityName = facility.GeneralInfo.FacilityName,
                                    FacilityEmail = facility.ContactInfo.ContactPrimaryEmail,
                                    State = facility.GeneralInfo.AddressView.State,
                                    FacilityId = facility.GeneralInfo.FacilityId,
                                    AddedDate = facility.GeneralInfo.CreateDate
                                });

                //Sorting    
                if (!string.IsNullOrWhiteSpace(sortColumn) && !string.IsNullOrWhiteSpace(sortColumnDir))
                {
                    facilityData = facilityData.OrderBy(sortColumn + " " + sortColumnDir);
                }
                //Search
                if (!string.IsNullOrEmpty(searchValue))
                {
                    facilityData = facilityData.Where(x => x.FacilityName.Contains(searchValue) || x.FacilityEmail.Contains(searchValue)
                     || x.ContactName.Contains(searchValue) || x.State.Contains(searchValue) || x.FacilityId.ToString().Contains(searchValue));
                }

                //total number of rows count     
                recordsTotal = facilityData.Count();
                //Paging     
                var data = facilityData.Skip(skip).Take(pageSize).ToList();
                //Returning Json Data    
                return JsonConvert.SerializeObject(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data });
            }
            catch (Exception)
            {
                throw;
            }

        }
        public static object GetFacilityBulkFiles(HttpRequest request, IFacilityManagement facilityManagement, string userId)
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

                // Getting all facility's files data    
                var facilityData = facilityManagement.GetFacilityFiles().Where(x => x.UserId == userId);
                //Sorting    
                if (!string.IsNullOrWhiteSpace(sortColumn) && !string.IsNullOrWhiteSpace(sortColumnDir))
                {
                    facilityData = facilityData.OrderBy(sortColumn + " " + sortColumnDir);
                }
                //Search
                if (!string.IsNullOrEmpty(searchValue))
                {
                    facilityData = facilityData.Where(x => x.Name.Contains(searchValue));
                }

                //total number of rows count     
                recordsTotal = facilityData.Count();
                //Paging     
                var data = facilityData.Skip(skip).Take(pageSize).ToList();
                //Returning Json Data    
                return JsonConvert.SerializeObject(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data });
            }
            catch (Exception)
            {
                throw;
            }

        }
        public static DataReponseViewModel<FacilityReponseViewModel> GetFacilities(IFacilityManagement facilityManager, IUserManagement userManagement, DataQueryViewModel<FacilityQueryViewModel> queryModel)
        {
            // Getting all facility's data   
            var facilityData = facilityManager.GetFacilities()
                .Select(facility =>
                            new FacilityReponseViewModel
                            {
                                ContactFirstName = facility.ContactInfo.ContactFirstName,
                                ContactLastName = facility.ContactInfo.ContactLastName,
                                FacilityName = facility.GeneralInfo.FacilityName,
                                FacilityEmail = facility.ContactInfo.ContactPrimaryEmail,
                                State = facility.GeneralInfo.AddressView.State,
                                FacilityId = facility.GeneralInfo.FacilityId,
                                AddedDate = facility.GeneralInfo.CreateDate != null ? Convert.ToDateTime(facility.GeneralInfo.CreateDate).ToString("MM/dd/yyyy hh:mm:ss") : "",
                                ContactPhone = facility.ContactInfo.ContactPhone,
                                ClientName = facility.GeneralInfo.FacilityName,
                                ClientId = facility.GeneralInfo.FacilityId.ToString(),
                                Status = facility.GeneralInfo.FacilityStatus,
                                Files = facility.Files,
                                SubmittedBy = userManagement.GetUserById(facility.GeneralInfo.CreateBy) != null ? userManagement.GetUserById(facility.GeneralInfo.CreateBy).FirstName : null,
                                SubmittedDate = facility.GeneralInfo.CreateDate != null ? Convert.ToDateTime(facility.GeneralInfo.CreateDate).ToString("MM/dd/yyyy hh:mm:ss") : "",
                                Phone = facility.GeneralInfo.FacilityPhone,
                                PrimaryContactName = facility.ContactInfo.ContactFirstName + " " + facility.ContactInfo.ContactLastName,
                                PrimaryContactEmail = facility.ContactInfo.ContactPrimaryEmail,
                                Address1 = facility.GeneralInfo.AddressView.Address1,
                                Address2 = facility.GeneralInfo.AddressView.Address2,
                                City = facility.GeneralInfo.AddressView.City,
                                ZipCode = facility.GeneralInfo.AddressView.ZipCode,
                                IsApproved = facility.GeneralInfo.IsApproved


                            });



            //Search
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.ContactName))
            {
                facilityData = facilityData.Where(x => (x.ContactFirstName + x.ContactLastName) != null && (x.ContactFirstName + x.ContactLastName).Trim().ToLower().Contains(queryModel.QueryModel.ContactName.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.ContactPhone))
            {
                facilityData = facilityData.Where(x => x.ContactPhone != null && x.ContactPhone.Trim().ToLower().Contains(queryModel.QueryModel.ContactPhone.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.ContactEmail))
            {
                facilityData = facilityData.Where(x => x.FacilityEmail != null && x.FacilityEmail.Trim().ToLower().Contains(queryModel.QueryModel.ContactEmail.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.ClientName))
            {
                facilityData = facilityData.Where(x => x.ClientName != null && x.ClientName.Trim().ToLower().Contains(queryModel.QueryModel.ClientName.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.ClientID))
            {
                facilityData = facilityData.Where(x => x.ClientId != null && x.ClientId.Trim().ToLower().Contains(queryModel.QueryModel.ClientID.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.StatuID))
            {
                facilityData = facilityData.Where(x => x.Status != null && x.Status.Trim().ToLower().Contains(queryModel.QueryModel.StatuID.Trim().ToLower()));
            }
            //=============================================== FACILITY APPROVAL

            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.Phone))
            {
                facilityData = facilityData.Where(x => x.Phone != null && x.Phone.Trim().ToLower().Contains(queryModel.QueryModel.Phone.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.PrimaryContactName))
            {
                facilityData = facilityData.Where(x => x.PrimaryContactName != null && x.PrimaryContactName.Trim().ToLower().Contains(queryModel.QueryModel.PrimaryContactName.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.PrimaryContactEmail))
            {
                facilityData = facilityData.Where(x => x.PrimaryContactEmail != null && x.PrimaryContactEmail.Trim().ToLower().Contains(queryModel.QueryModel.PrimaryContactEmail.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.Address1))
            {
                facilityData = facilityData.Where(x => x.Address1 != null && x.Address1.Trim().ToLower().Contains(queryModel.QueryModel.Address1.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.Address2))
            {
                facilityData = facilityData.Where(x => x.Address2 != null && x.Address2.Trim().ToLower().Contains(queryModel.QueryModel.Address2.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.City))
            {
                facilityData = facilityData.Where(x => x.City != null && x.City.Trim().ToLower().Contains(queryModel.QueryModel.City.Trim().ToLower()));
            }
            if (!string.IsNullOrWhiteSpace(queryModel.QueryModel?.ZipCode))
            {
                facilityData = facilityData.Where(x => x.ZipCode != null && x.ZipCode.Trim().ToLower().Contains(queryModel.QueryModel.ZipCode.Trim().ToLower()));
            }
            if (queryModel.QueryModel?.IsApproved != null)
            {
                facilityData = facilityData.Where(f => f.IsApproved != null && f.IsApproved == queryModel.QueryModel.IsApproved);
            }
            //=============================================== FACILITY APPROVAL
            var sorted = facilityData.ToList();
            if (!string.IsNullOrEmpty(queryModel.SortColumn) && queryModel.SortDirection != null)
            {
                sorted = sorted.AsQueryable().OrderBy($"{queryModel.SortColumn} {queryModel.SortDirection}").ToList();

            }
            else
            {
                sorted = sorted.AsQueryable().OrderBy($"facilityId desc").ToList();
            }


            
            //var sortedList = sorted.AsQueryable().OrderBy($"{queryModel.SortColumn} {queryModel.SortDirection}");
            //var sorted = facilityData.ToList();

            //total number of rows count     
            var recordsTotal = sorted.Count();
            //Paging     
            var data = sorted.Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToList();
            //Returning Json Data    
            //Returning Json Data    
            return new DataReponseViewModel<FacilityReponseViewModel>
            { Total = recordsTotal, Data = data };

        }
        public static DataReponseViewModel<FacilityBaseViewModel> GetFacilitiesBriefInfo(IFacilityManagement facilityManager, DataQueryViewModel<string> queryModel)
        {
            // Getting all facility's data    
            var facilityData = facilityManager.GetFacilities().Where(f => f.GeneralInfo.FacilityStatus.ToLower().Trim() == "active")
                .Select(facility =>
                            new FacilityBaseViewModel
                            {
                                ContactFirstName = facility.ContactInfo.ContactFirstName,
                                ContactLastName = facility.ContactInfo.ContactLastName,
                                FacilityName = facility.GeneralInfo.FacilityName,
                                FacilityEmail = facility.ContactInfo.ContactPrimaryEmail,
                                State = facility.GeneralInfo.AddressView.State,
                                FacilityId = facility.GeneralInfo.FacilityId,
                                AddedDate = facility.GeneralInfo.CreateDate,
                                address1 = facility.GeneralInfo.AddressView.Address1
                            });

            //Search
            if (!string.IsNullOrEmpty(queryModel.QueryModel))
            {
                facilityData = facilityData.Where(x => x.FacilityName.Contains(queryModel.QueryModel) || x.FacilityEmail.Contains(queryModel.QueryModel));
            }

            //total number of rows count     
            var recordsTotal = facilityData.Count();
            //Paging     
            var data = facilityData.Skip((queryModel.PageNumber - 1) * queryModel.PageSize)
                .Take(queryModel.PageSize).ToList();
            //Returning Json Data    
            //Returning Json Data    
            return new DataReponseViewModel<FacilityBaseViewModel>
            { Total = recordsTotal, Data = data };

        }
        public static List<DropDownResponseModel> GetAllActiveFacilities(IFacilityManagement facilityManager)
        {
            // Getting all facility's data    
            var facilityData = facilityManager.GetActiveFacilities().ToList();
            return facilityData;
        }
    }
}
