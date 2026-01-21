using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.File;

namespace TrueMed.Business.Interface
{
    public interface IFileManagement
    {
        Task<BlobDownloadInfo> GetFileAsync(string fileId);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="file"></param>
        /// <param name="filePath">Where the file is saved, give file path</param>
        /// <returns></returns>
        bool SaveFileReference(IFormFile file, string filePath);
        FileViewModel GetFileInfoById(string fileId);
        Task<string> UploadFileAsync(IFormFile file, string? name = null);
        string SaveFileReference(FileViewModel fileModel, string userId);
        void DeleteFilesById(IEnumerable<string> fileIds);
        void DeleteFilesByPath(IEnumerable<string> filePaths);
        Task<bool> DeleteFileOnBlobIfExistsAsync(string name);

    }
}
