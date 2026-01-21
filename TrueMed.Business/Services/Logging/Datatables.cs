using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Business.Services.Logging
{
    public static class Datatables
    {
        //public static object GetFacilities(IFacilityManager facilityManager)
        //{
        //    try
        //    {
        //        var Request = HttpContext.Current.Request;
        //        var draw = Request.Form.GetValues("draw").FirstOrDefault();
        //        var start = Request.Form.GetValues("start").FirstOrDefault();
        //        var length = Request.Form.GetValues("length").FirstOrDefault();
        //        var sortColumn = Request.Form.GetValues("columns[" + Request.Form.GetValues("order[0][column]").FirstOrDefault() + "][name]").FirstOrDefault();
        //        var sortColumnDir = Request.Form.GetValues("order[0][dir]").FirstOrDefault();
        //        var searchValue = Request.Form.GetValues("search[value]").FirstOrDefault();


        //        //Paging Size (10,20,50,100)    
        //        int pageSize = length != null ? Convert.ToInt32(length) : 0;
        //        int skip = start != null ? Convert.ToInt32(start) : 0;
        //        int recordsTotal = 0;

        //        // Getting all facility's data    
        //        var facilityData = facilityManager.GetFacilities().Select(facility =>
        //                        new
        //                        {
        //                            ContactName = facility.ContactFirstName + " " + facility.ContactLastName,
        //                            FacilityName = facility.FacilityName,
        //                            FacilityEmail = facility.FacilityEmail,
        //                            State = facility.Address.State,
        //                            FacilityId = facility.FacilityId,
        //                            AddedDate = facility.AddedDate
        //                        });

        //        //Sorting    
        //        if (!string.IsNullOrWhiteSpace(sortColumn) && !string.IsNullOrWhiteSpace(sortColumnDir))
        //        {
        //            facilityData = facilityData.OrderBy(sortColumn + " " + sortColumnDir);
        //        }
        //        //Search
        //        if (!string.IsNullOrEmpty(searchValue))
        //        {
        //            facilityData = facilityData.Where(x => x.FacilityName.Contains(searchValue) || x.FacilityEmail.Contains(searchValue)
        //             || x.ContactName.Contains(searchValue) || x.State.Contains(searchValue) || x.FacilityId.ToString().Contains(searchValue));
        //        }

        //        //total number of rows count     
        //        recordsTotal = facilityData.Count();
        //        //Paging     
        //        var data = facilityData.Skip(skip).Take(pageSize).ToList();
        //        //Returning Json Data    
        //        return JsonConvert.SerializeObject(new { draw = draw, recordsFiltered = recordsTotal, recordsTotal = recordsTotal, data = data });
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }

        //}
    }
}
