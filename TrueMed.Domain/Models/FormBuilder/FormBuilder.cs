using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Model.FormBuilder
{
    public class Form
    {
        public string? Key { get; set; }
        public string? Description { get; set; }
        public DateTime CreateDate { get; set; }
    }

    public class FormBuild : Form
    {
        public string? RawForm { get; set; }
        public string? Form { get; set; }
    }
}
