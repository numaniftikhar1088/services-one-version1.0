using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblMarketPlace
    {
        public string Id { get; set; } = null!;
        public string? MarketPlaceModule { get; set; }
        public string? PortalModuleName { get; set; }
        public string? IntegrationName { get; set; }
        public string? IntegrationKey { get; set; }
        public string? DynamicFormKey { get; set; }
        public string? IntegrationImage { get; set; }
    }

