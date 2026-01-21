
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Net;
using TrueMed.Business.Interface;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Model.Identity;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Domain.Models.Identity;
using TrueMed.UserManagement.Domain.Models.Account.Response;
using TrueMed.UserManagement.Domain.Models.Dtos.Response;
using TrueMed.UserManagement.Domain.Repositories.Identity.Interface;

namespace TrueMed.UserManagement.Domain.Repositories.Identity.Implementation
{
    public class LabMenuManagement : ILabMenuManagement
    {
        readonly ApplicationDbContext? _applicationDbContext;
        private MasterDbContext _masterDbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public LabMenuManagement(IConnectionManager connectionManager, ApplicationDbContext applicationDbContext, MasterDbContext masterDbContext, IHttpContextAccessor httpContextAccessor)
        {
            _applicationDbContext = ApplicationDbContext.Create(connectionManager.CONNECTION_STRING);
            _masterDbContext = masterDbContext;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
        }
        public string LoggedInUser { get; set; }
        public async Task<RequestResponse> AddUserFavouriteMenuAsync(AddUserFavouriteIconVM addUserFavouriteIcon)
        {
            var response = new RequestResponse();
            if (addUserFavouriteIcon.FavouriteMenuId.Count <= 0 || string.IsNullOrEmpty(addUserFavouriteIcon.UserId))
            {
                response.ResponseStatus = "Failed";
                response.ResponseMessage = "Parameter is invalid !";
                response.StatusCode = Status.Failed;
            }

            foreach (var record in addUserFavouriteIcon.FavouriteMenuId)
            {
                var IsEntryExist = _applicationDbContext.TblUserfavouriteMenus.Any(f => f.UserId == addUserFavouriteIcon.UserId && f.FavouriteMenuId == record);
                if (!IsEntryExist)
                {
                    await _applicationDbContext.TblUserfavouriteMenus.AddAsync(new TblUserfavouriteMenu()
                    {
                        UserId = addUserFavouriteIcon.UserId,
                        Link = addUserFavouriteIcon.Link,
                        Icon = addUserFavouriteIcon.Icon,
                        FavouriteMenuId = record,
                        IsChecked = addUserFavouriteIcon.IsChecked
                    });
                }
            }
            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.ResponseStatus = "Success";
                response.ResponseMessage = "Request Processed !";
                response.StatusCode = Status.Success;
            }
            return response;
        }

        public async Task<TrueMed.Domain.Models.Response.RequestResponse<List<GetUserFavouriteMenuResponse>>> GetUserFavouriteMenuAsync()
        {
            var response = new TrueMed.Domain.Models.Response.RequestResponse<List<GetUserFavouriteMenuResponse>>();
            response.Data = new();

            //var getUserClaims = _applicationDbContext.TblUserClaims.Where(f => f.UserId == LoggedInUser && f.IsChecked == true).Select(s => s.ClaimId).ToList();
            var getAllUserfavouriteMenus = _applicationDbContext.TblUserfavouriteMenus.Where(f => f.UserId == LoggedInUser).Select(s => s.FavouriteMenuId).ToList();


            var sourceList = new List<GetUserFavouriteMenuResponse>();
            var source = new GetUserFavouriteMenuResponse();

            var menusFromTblPagesMasterDb = _masterDbContext.TblPages.Where(f => getAllUserfavouriteMenus.Contains(f.Id)).OrderBy(o => o.Name).ToList();
            source.UserId = LoggedInUser;
            foreach (var menus in menusFromTblPagesMasterDb)
            {
                var fMenus = new FavouriteMenu()
                {
                    FavouriteMenuId = menus.Id,
                    MenuIcon = menus.MenuIcon,
                    LinkURL = menus.LinkUrl,
                    Menu = menus.Name,
                    IsChecked = _applicationDbContext.TblUserfavouriteMenus.FirstOrDefault(f => f.FavouriteMenuId == menus.Id).IsChecked ?? false,


                };
                source.FavouriteMenus.Add(fMenus);
            }

            sourceList.Add(source);
            response.Data = sourceList;
            response.Message = "Request Processed Successfully...";
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }

        public async Task<RequestResponse> RemoveUserFavouriteMenuAsync(RemoveUserFavouriteIconVM removeUserFavouriteIcon)
        {
            var response = new RequestResponse();
            if (removeUserFavouriteIcon.FavouriteMenuId.Count > 0 || string.IsNullOrEmpty(removeUserFavouriteIcon.UserId))
            {
                response.ResponseStatus = "Failed";
                response.ResponseMessage = "Parameter is invalid !";
                response.StatusCode = Status.Failed;
            }

            var userId = removeUserFavouriteIcon.UserId;
            foreach (var MenuForDeselect in removeUserFavouriteIcon.FavouriteMenuId)
            {
                var existingEntry = await _applicationDbContext.TblUserfavouriteMenus.FirstOrDefaultAsync(f => f.UserId == userId && f.FavouriteMenuId == MenuForDeselect);
                if (existingEntry != null)
                {
                    _applicationDbContext.TblUserfavouriteMenus.Remove(existingEntry);
                }
            }
            var ack = await _applicationDbContext.SaveChangesAsync();
            if (ack > 0)
            {
                response.ResponseStatus = "Success";
                response.ResponseMessage = "Request Processed !";
                response.StatusCode = Status.Success;
            }
            return response;
        }


    }
}
