using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblUserfavouriteMenu
{
    public int Id { get; set; }

    public int? FavouriteMenuId { get; set; }

    public string? UserId { get; set; }

    public virtual TblPage? FavouriteMenu { get; set; }

    public virtual TblUser? User { get; set; }
}
