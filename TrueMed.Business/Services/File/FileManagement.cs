using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using System.Web;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Helpers;
using TrueMed.Domain.Model.File;
using TrueMed.Business.Services.File;
using System.Linq.Dynamic;
using TrueMed.Sevices.MasterEntities;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.Interface;

namespace TrueMed.Business.Services.File
{
    public class FileManagement : IFileManagement
    {
        public FileManagement(MasterDbContext _dbContext,
            IConfiguration configuration)
        {
            this._dbContext = _dbContext;
            this._configuration = configuration;
            _storageAccount = Microsoft.WindowsAzure.Storage.CloudStorageAccount.Parse(_blobCs);
            // Retrieve storage account from connection string.
            CloudBlobClient blobClient = _storageAccount.CreateCloudBlobClient();
            _cloudBlobContainer = blobClient.GetContainerReference(BLOB_CONTAINER);
            _blobContainerClient = new BlobContainerClient(_blobCs, BLOB_CONTAINER);
        }


        const string _azurePath = "https://azuresftpproofofconcept.blob.core.windows.net/projectonepublicfiles/";


        #region Fields & Properties
        CloudBlobContainer _cloudBlobContainer;
        CloudBlockBlob _cloudBlockBlob;
        BlobContainerClient _blobContainerClient;
        Microsoft.WindowsAzure.Storage.CloudStorageAccount _storageAccount;
        string _blobCs => _configuration.GetConnectionString("AzureConnectionString");

        public const string BLOB_CONTAINER = "projectoneprivatefiles";
        private readonly MasterDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public static string _fileId => StringGenerator.Random(10) + Guid.NewGuid().ToString().Replace("-", "");
        #endregion

        async void _setBlobMetadata(IFormFile file)
        {
            var fileExtention = Path.GetExtension(file.FileName);
            if (string.Equals(fileExtention, ".xls", StringComparison.OrdinalIgnoreCase) || string.Equals(fileExtention, ".xlsx", StringComparison.OrdinalIgnoreCase))
            {
                _cloudBlockBlob.Properties.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                //Add some metadata to the container.
                _cloudBlockBlob.Metadata.Add("ContentType", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                _cloudBlockBlob.Metadata["Extension"] = "xlsx";
            }
            else if (string.Equals(fileExtention, ".pdf"))
            {
                _cloudBlockBlob.Properties.ContentType = "application/pdf";
                //Add some metadata to the container.
                _cloudBlockBlob.Metadata.Add("ContentType", "application/pdf");
                _cloudBlockBlob.Metadata["Extension"] = "pdf";
            }
            else if (file.ContentType.Contains("image"))
            {
                _cloudBlockBlob.Properties.ContentType = file.ContentType;
                //Add some metadata to the container.
                _cloudBlockBlob.Metadata.Add("ContentType", file.ContentType);
                _cloudBlockBlob.Metadata["Extension"] = "png";
            }
            else
            {
                _cloudBlockBlob.Properties.ContentType = file.ContentType;
                //Add some metadata to the container.
                _cloudBlockBlob.Metadata.Add("ContentType", file.ContentType);
                _cloudBlockBlob.Metadata["Extension"] = fileExtention.Remove(0, 1);
            }

            _cloudBlockBlob.Metadata["FileName"] = file.FileName;
            // Set the container's metadata.
            await _cloudBlockBlob.SetMetadataAsync();
            await _cloudBlockBlob.SetPropertiesAsync();
        }

        public async Task<string> UploadFileAsync(IFormFile file, string? name = null)
        {
            var filename = (!string.IsNullOrWhiteSpace(name) ? name : _fileId + "____" + Path.GetFileNameWithoutExtension(file.FileName).Replace(" ", "-"));
            _cloudBlockBlob = _cloudBlobContainer.GetBlockBlobReference(filename);
            await _cloudBlockBlob.UploadFromByteArrayAsync(file.OpenReadStream().ReadAllBytes(), 0, (int)file.Length);
            await _cloudBlockBlob.FetchAttributesAsync();
            //setting blob meta data
            _setBlobMetadata(file);
            return filename;
        }

        public async Task<bool> DeleteFileOnBlobIfExistsAsync(string name)
        {
            _cloudBlockBlob = _cloudBlobContainer.GetBlockBlobReference(name);
            return await _cloudBlockBlob.DeleteIfExistsAsync();
        }

        public async Task<BlobDownloadInfo> GetFileAsync(string fileId)
        {
            var blobClient = _blobContainerClient.GetBlobClient(fileId);
            if (await blobClient.ExistsAsync())
            {
                var response = await blobClient.DownloadAsync();
                return response.Value;
            }
            else
            {
                return null;
            }
        }

        public bool SaveFileReference(IFormFile file, string filePath)
        {
            _dbContext.TblFiles.Add(new TblFile()
            {
                ContentType = file.ContentType,
                FilePath = filePath,
                Length = Convert.ToString(file.Length),
                Name = Path.GetFileNameWithoutExtension(file.FileName)
            });
            var isAffected = _dbContext.SaveChanges() > 0;
            return isAffected;
        }

        public string SaveFileReference(FileViewModel fileModel, string userId)
        {
            var file = new TblFile
            {
                Id = _fileId,
                ContentType = fileModel.ContentType,
                CreateDate = DateTimeNow.Get,
                FilePath = fileModel.FilePath,
                Length = fileModel.ContentLength,
                Name = fileModel.Name,
                //UserId = userId
            };
            _dbContext.TblFiles.Add(file);
            _dbContext.SaveChanges();
            return file.Id;
        }

        public void DeleteFilesById(IEnumerable<string> fileIds)
        {
            var filesToDelete = Entity().Where(x => fileIds.Contains(x.Id));
            foreach (var file in filesToDelete)
            {
                file.IsDeleted = true;
            }
        }

        public IQueryable<TblFile> Entity()
        {
            return _dbContext.TblFiles;
        }

        public void DeleteFilesByPath(IEnumerable<string> filePaths)
        {
            var filesToDelete = Entity().Where(x => filePaths.Contains(x.FilePath));
            foreach (var file in filesToDelete)
            {
                file.IsDeleted = true;
            }
        }

        public FileViewModel GetFileInfoById(string fileId)
        {
            return Entity().Select(x => new FileViewModel { Id = x.Id, ContentLength = x.Length, ContentType = x.ContentType, CreateDate = x.CreateDate, FilePath = x.FilePath, Name = x.Name }).FirstOrDefault(x => x.Id == fileId);
        }
    }
}
