using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Response
{
    public class PatientViewModel
    {
        public int? Id { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public string? Mobile { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
    }
}
