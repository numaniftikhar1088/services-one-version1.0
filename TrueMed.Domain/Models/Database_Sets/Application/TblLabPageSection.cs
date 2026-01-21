using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblLabPageSection
{
    public int Id { get; set; }

    public int? LabId { get; set; }

    public int? PageId { get; set; }

    public int? SectionId { get; set; }

    public string? SectionName { get; set; }

    public string? SectionColor { get; set; }

    public int? SortOrder { get; set; }

    public bool? IsSelected { get; set; }

    public int? IsReqSection { get; set; }

    public string? CssStyle { get; set; }

    public string? DisplayType { get; set; }

    public int? OrderViewSortOrder { get; set; }

    public string? OrderViewDisplayType { get; set; }

    public string? OrderViewMergeSections { get; set; }

    public string? CustomScript { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }
}
