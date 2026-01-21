using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.UserManagement.Domain.Models.Account.Request
{
    public class RoleViewModel
    {
        public int? RoleId { get; set; }
        [Required]
        public string? RoleName { get; set; }
        [Required]
        public ICollection<int>?  ClaimsIds  { get; set; }
    }

    public class UpdateRoleViewModelMetaDataType
    {
        [Required]
        public int? RoleId { get; set; }
    }

    [ModelMetadataType(typeof(UpdateRoleViewModelMetaDataType))]
    public class UpdateRoleViewModel : RoleViewModel
    {

    }
}
