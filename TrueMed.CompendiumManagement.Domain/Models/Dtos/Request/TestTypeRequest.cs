using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Dtos.Request
{
    public class SaveTestTypeRequest
    {
        public int TestTypeId { get; set; }
        public string TestType { get; set; } = null!;
        public bool? TestTypeStatus { get; set; }
    }
    public class ChangeTestTypeStatusRequest
    {
        public int TestTypeId { get; set; }
        public bool? TestTypeStatus { get; set; }
    }
    
}
