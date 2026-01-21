using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblUserfavouriteMenu
{
    public int Id { get; set; }

    public int? FavouriteMenuId { get; set; }

    public string? UserId { get; set; }

    public string? Link { get; set; }

    public string? Icon { get; set; }

    public bool? IsChecked { get; set; }
}
