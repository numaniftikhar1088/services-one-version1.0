using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Validator.CompendiumManagement
{
    public class IDCompendiumReportingRulesValidator : AbstractValidator<SaveIDCompendiumReportingRulesRequest>
    {
        public IDCompendiumReportingRulesValidator()
        {

        }
    }
}
