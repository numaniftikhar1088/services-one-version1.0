using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.UserManagement.Domain.Models.Dtos.Response
{
    public class GetUserFavouriteMenuResponse
    {
        public string? UserId { get; set; }
        public List<FavouriteMenu>? FavouriteMenus { get; set; } = new();
    }
    public class FavouriteMenu
    {
        public int? FavouriteMenuId { get; set; }
        public string? Menu { get; set; }
        public string? LinkURL { get; set; }
        public string? MenuIcon { get; set; }
        public bool? IsChecked { get; set; }

    }
}
