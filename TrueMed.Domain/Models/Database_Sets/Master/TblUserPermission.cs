namespace TrueMed.Sevices.MasterEntities;

public partial class TblUserPermission
{
    public int Id { get; set; }

    public string UserId { get; set; }

    public int PermissionId { get; set; }

    public virtual TblApplicationLink Permission { get; set; }

    public virtual TblUser User { get; set; }
}
