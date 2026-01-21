using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblResetPasswordToken
{
    public int Id { get; set; }

    public string? Token { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ExpirationDate { get; set; }

    public string? UserId { get; set; }
}
