using Microsoft.EntityFrameworkCore;
using TrueMed.Business.TenantDbContext;
using TrueMed.UserManagement.Domain.Repositories.File.Interface;
namespace TrueMed.UserManagement.Domain.Repositories.File.Implementation
{
    public class FileTemplateManagement : IFileTemplateManagement
    {
        ApplicationDbContext? _applicationDbContext;
        public FileTemplateManagement(ApplicationDbContext applicationDbContext)
        {
            this._applicationDbContext = applicationDbContext;
        }

        public async Task<string?> GetFileTemplateUriByNameAsync(string templateName)
        {
            return await _applicationDbContext?
                .TblSheetTemplates
                .Where(x => x.KeyofTemplate.ToLower().Trim() == templateName.ToLower().Trim())
                .Select(x => x.TemplateUri)
                .FirstOrDefaultAsync();
        }
    }
}
