using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;

namespace TrueMed.Validator.CompendiumManagement
{
    public class IDCompendiumPanelMappingValidator : AbstractValidator<SaveIDCompendiumPanelMappingRequest>
    {
        public IDCompendiumPanelMappingValidator()
        {
            RuleFor(v => v.PerformingLabId).NotEmpty().WithMessage("**Performing Lab Id is missing !");
            RuleFor(v => v.PanelName).NotEmpty().WithMessage("**Panel Name is missing !");
            RuleFor(v => v.PanelCode).NotEmpty().WithMessage("**Panel Code is missing !");
            RuleFor(v => v.AssayNameId).NotEmpty().WithMessage("**Assay Name is missing !");
            RuleFor(v => v.ReportingRuleId).NotEmpty().WithMessage("**Reporting Rule is missing !");
            RuleFor(v => v.GroupNameId).NotEmpty().WithMessage("**Group Name is missing !");
        }
    }
}
