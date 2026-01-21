using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.Identity
{
    public class ClaimMenueViewModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Icon { get; set; }
        public string? Url { get; set; }
        public bool IsHeader { get; set; }
        public int? Order { get; set; }
        public int? ParentId { get; set; }
        public List<ClaimMenueViewModel>? Childs { get; set; }
        public int ClaimId { get; set; }
    }

    public class ClaimTypesCustom
    {
        public const string USER_TYPE = "userType";
       
    }
}
