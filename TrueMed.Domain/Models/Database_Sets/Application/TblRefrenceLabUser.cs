using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblRefrenceLabUser
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string? MasterUserId { get; set; }
        public string? MasterRefrenceLab { get; set; }
    }
