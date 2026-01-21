using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Databases;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.DTOs;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Interface;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.MasterPortalAppManagement.Domain.Repositories.Configuration.Implementation
{
    public class SectionControlsManagement<TDbContext> : ISectionControlsManagement<TDbContext> where TDbContext : DbContext
    {
        private readonly IConnectionManager _connectionManager;
        private  ApplicationDbContext _dbContext;

        public SectionControlsManagement(
            IConnectionManager connectionManager,
            TDbContext dbContext
            )
        {
            this._connectionManager = connectionManager;
            this._dbContext = ApplicationDbContext.Create(dbContext.Database.GetConnectionString());
        }

        public IQueryable<SectionControlsModel> GetAllSectionControls()
        {
            return _dbContext
                .TblSectionControls
                .GroupBy(x => x.SectionId)
                .Select(x => new SectionControlsModel
                {
                    SectionId = x.Key ?? 0,
                    Controls = x.Select(_ => _.ControlId).AsEnumerable()
                });
        }

        public async Task<bool> IsControlExistsInSectionByNameAsync(string sectionName, string controlName)
        {
            return await _dbContext
                .TblSectionControls
                .AnyAsync(x => x.Control.ControlKey.Trim().ToLower() == controlName.Trim().ToLower() &&
                x.Section.SectionName.Trim().ToLower() == sectionName.Trim().ToLower()
                );
        }

        public async Task<bool> IsControlExistsInSectionByIdAsync(int sectionId, int controlId)
        {
            return await _dbContext
                 .TblSectionControls
                .AnyAsync(x => x.ControlId == controlId &&
                 x.SectionId == sectionId);
        }

        public async Task<int?> GetSectionIdByControlNameAsync(string name)
        {
            return await _dbContext
                .TblSectionControls
                .Where(x => x.Control.ControlName.Trim().ToLower() == name.Trim().ToLower())
                .Select(x => x.SectionId)
                .FirstOrDefaultAsync();
        }

        public async Task<int?> GetSectionIdByControlIdAsync(int id)
        {
            return await _dbContext
                .TblSectionControls
                .Where(x => x.ControlId == id)
                .Select(x => x.SectionId)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> AddControlInSectionByIdAsync(int sectionId, int controlId)
        {
            if (await IsControlExistsInSectionByIdAsync(sectionId, controlId))
                return false;
            _dbContext.TblSectionControls.Add(new  TrueMed.Domain.Models.Database_Sets.Application.TblSectionControl
            {
                ControlId = controlId,
                SectionId = sectionId
            });
            var isAffected = await _dbContext.SaveChangesAsync() > 0;
            return isAffected;
        }
    }
}
