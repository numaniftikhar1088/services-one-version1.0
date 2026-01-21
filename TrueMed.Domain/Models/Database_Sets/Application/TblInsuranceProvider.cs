using System;
using System.Collections.Generic;

namespace TrueMed.Domain.Models.Database_Sets.Application;
    public partial class TblInsuranceProvider
    {
        /// <summary>
        /// Auto Generated ID
        /// </summary>
        public int InsuranceProviderId { get; set; }
        /// <summary>
        /// Insurance Provider Name
        /// </summary>
        public string? ProviderName { get; set; }
        /// <summary>
        /// Insurance Provider Display Name (Provider Name display on Report)
        /// </summary>
        public string? ProviderDisplayName { get; set; }
        /// <summary>
        /// Insurance ID (tblInsuranceSetup table)
        /// </summary>
        public int? InsuranceId { get; set; }
        /// <summary>
        /// Login ID
        /// </summary>
        public string? CreatedBy { get; set; }
        /// <summary>
        /// Current Created Date and Time
        /// </summary>
        public DateTime? CreatedDate { get; set; }
        /// <summary>
        /// Login ID
        /// </summary>
        public string? UpdatedBy { get; set; }
        /// <summary>
        /// Current Modify Date and Time
        /// </summary>
        public DateTime? UpdatedDate { get; set; }
        /// <summary>
        /// Login ID
        /// </summary>
        public string? DeletedBy { get; set; }
        /// <summary>
        /// Current Date and Time
        /// </summary>
        public DateTime? DeletedDate { get; set; }
        /// <summary>
        /// Status (Active, Inactive)
        /// </summary>
        public int? ProviderStatus { get; set; }
        public string? ProviderCode { get; set; }

        public virtual TblInsuranceSetup? Insurance { get; set; }
    }
