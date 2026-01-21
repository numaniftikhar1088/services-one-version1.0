using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.CompendiumManagement.Domain.Models.Test.Request
{
    public class TestAssignmentViewModel
    {
        public int? Id { get; set; }
        [Required]
        public int? ReqTypeId { get; set; }
        [Required]
        public int? GroupId { get; set; }
        [Required]
        public int? PanelId { get; set; }
        [Required]
        public int TestId { get; set; }
        [Required]
        public int? LabId { get; set; }
        [Required]
        public bool? IsActive { get; set; }
        [Required]
        public string? ProcessType { get; set; }
    }

    public class UpdateTestAssignmentViewModelMetadataType
    {
        [Required]
        public int? Id { get; set; }
    }

    [ModelMetadataType(typeof(UpdateTestAssignmentViewModelMetadataType))]
    public class UpdateTestAssignmentViewModel: TestAssignmentViewModel
    {

    }
}
