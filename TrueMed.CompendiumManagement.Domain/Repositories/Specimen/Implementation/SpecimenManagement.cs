using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Interface;
using TrueMed.Business.TenantDbContext;
using TrueMed.CompendiumManagement.Domain.Models.Specimen.Dtos;
using TrueMed.CompendiumManagement.Domain.Repositories.Specimen.Interfaces;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Specimen.Implementation
{
    public class SpecimenManagement : ISpecimenManagement
    {
        private readonly IConnectionManager connectionManager;
        private readonly ApplicationDbContext _appDbContext;

        public SpecimenManagement(IConnectionManager connectionManager, ApplicationDbContext applicationDbContext)
        {
            this.connectionManager = connectionManager;
            this._appDbContext = applicationDbContext;
        }

        public IQueryable<SpecimenTypeModel> GetAllSpecimens()
        {
            return _appDbContext.TblSpecimenTypes.Select(x => new SpecimenTypeModel
            {
                Id = x.SpecimenTypeId,
                Name = x.SpecimenType
            });
        }

        public Task<bool> IsSpecimenTypeExistsById(int id)
        {
            return _appDbContext.TblSpecimenTypes.AnyAsync(x => x.SpecimenTypeId == id);
        }
    }
}
