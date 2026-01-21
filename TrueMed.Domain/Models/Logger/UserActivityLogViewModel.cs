using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.Logger
{
    public class UserActivityLogViewModel
    {
        [Required]
        public string? EventName { get; set; }
        [Required]
        public ActivityType? ActivityType { get; set; }
        [Required]
        public ActionType? ActionType { get; set; }
        public string? Description { get; set; }
        public object? Data { get; set; }
    }


    public enum ActivityType
    {
        UserManagement = 0,
        Requisition = 1,
        LIS = 2,
        Facility = 3,
    }
    public enum ActionType
    {
        Update = 0,
        Delete = 1,
        Create = 2,
        Read = 3,
        Cancel = 4
    }
}