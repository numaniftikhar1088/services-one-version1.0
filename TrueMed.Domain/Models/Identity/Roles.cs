using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.Identity
{
    public enum Roles
    {
        Admin = 1,
        Physician = 2,
        Master = 5
    }

    public enum SubRole
    {
        SuperAdmin,
        LabAdmin,
        GeneralAdmin,
        PhlebotomistAdmin,
        Accessioner
    }

    public enum Status
    {
        Failed = 400,
        Success = 200,
        AlreadyExists = 409,
        DataNotFound = 404,
        InvalidTicket = 403,
        SomethingWentWrong = 500,
        Processing = 102
    }
}
