using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Specimen.Dtos;

namespace TrueMed.CompendiumManagement.Domain.Repositories.Specimen.Interfaces
{
    public interface ISpecimenManagement
    {
        IQueryable<SpecimenTypeModel> GetAllSpecimens();
        Task<bool> IsSpecimenTypeExistsById(int id);
    }
}
