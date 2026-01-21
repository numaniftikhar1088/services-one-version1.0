using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.UserManagement.Domain.Repositories.File.Interface
{
    public interface IFileTemplateManagement
    {
        Task<string?> GetFileTemplateUriByNameAsync(string templateName);
    }
}
