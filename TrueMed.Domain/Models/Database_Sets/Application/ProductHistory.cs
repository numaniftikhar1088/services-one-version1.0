using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class ProductHistory
{
    public int GroupId { get; set; }

    public string GroupName { get; set; }

    public string GroupDisplayName { get; set; }

    public bool GroupStatus { get; set; }

    public string CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public DateTime StartTime { get; set; }

    public DateTime EndTime { get; set; }
}
