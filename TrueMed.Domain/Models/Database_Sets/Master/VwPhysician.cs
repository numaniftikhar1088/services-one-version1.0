using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class VwPhysician
{
    public string PhysicianId { get; set; } = null!;

    public string? PhysicianFirstName { get; set; }

    public string? PhysicianLastName { get; set; }

    public string? PhysicianEmail { get; set; }

    public string? PhysicianPhoneNumber { get; set; }

    public string? PhysicianNpi { get; set; }

    public string? PhysicianStateLicenseNo { get; set; }
}
