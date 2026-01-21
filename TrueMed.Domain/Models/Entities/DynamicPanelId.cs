using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Entities;

public partial class DynamicPanelId
{
    public int PanelId { get; set; }

    public string PanelName { get; set; }

    public string PanelCode { get; set; }

    public string ReqType { get; set; }

    public string UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
}
