using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class ApplicationSetting
    {
        public string Key { get; set; } = null!;
        public string Value { get; set; } = null!;
        public string ObjId { get; set; } = null!;
        public DateTime CreateDate { get; set; }
    }

