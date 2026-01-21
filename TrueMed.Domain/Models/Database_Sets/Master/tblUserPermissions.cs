using System.ComponentModel.DataAnnotations.Schema;

namespace TrueMed.Domain.Model.Database_Sets.Master
{
    [Table("tblUserPermissions")]
    public class tblUserPermission
    {
        public string UserId { get; set; }
        public int PermissionId { get; set; }
        public int LabId { get; set; }
    }
}
