using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblIcd10code
    {
        public TblIcd10code()
        {
            TblIcd10assignments = new HashSet<TblIcd10assignment>();
        }

        public int Icd10id { get; set; }
        public string Icd10code { get; set; } = null!;
        public string? Description { get; set; }
        public bool? Icd10status { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }

        public virtual ICollection<TblIcd10assignment> TblIcd10assignments { get; set; }
    }

