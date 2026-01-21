using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;

namespace TrueMed.Business.Services.Blob
{
    public static class BlobManager
    {
        public async static Task<string> UploadFile(IFileManagement fileManager, IFormFile file)
        {
            return await fileManager.UploadFileAsync(file);
        }

        public async static Task<string> UploadFileAndSaveRef(IFileManagement fileManager, IFormFile file)
        {
            var filePath = await fileManager.UploadFileAsync(file);
            var isOk = fileManager.SaveFileReference(file, filePath);
            if (isOk)
                return filePath;
            else return "";
        }

    }
}
