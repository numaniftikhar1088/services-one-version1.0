

using Newtonsoft.Json;

namespace TrueMed.Sevices.MasterEntities;

public partial class TblApplicationLink
{
    public int Id { get; set; }

    public int PageId { get; set; }

    public string PermissionName { get; set; }

    public string PermissionLink { get; set; }

    public int ModuleId { get; set; }

    public bool IsPublic { get; set; }

    public virtual TblModule Module { get; set; }

    public virtual TblPage Page { get; set; }
    public virtual ICollection<TblUserPermission> TblUserPermissions { get; } = new List<TblUserPermission>();
}
