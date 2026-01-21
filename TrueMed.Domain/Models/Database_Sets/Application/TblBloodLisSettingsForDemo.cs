using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;

public partial class TblBloodLisSettingsForDemo
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Text { get; set; }

    public string Type { get; set; }

    public string Prefix { get; set; }
}
