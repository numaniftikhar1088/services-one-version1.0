using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities
{
    public partial class TblFacility
    {
        public int FacilityId { get; set; }
        public string? FacilityName { get; set; }
        public string? FacilityPhone { get; set; }
        public string? FacilityEmail { get; set; }
        public string? FacilityFax { get; set; }
        public bool? IsFaxEnabled { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string State { get; set; } = null!;
        public string? ZipCode { get; set; }
        public string? Notes { get; set; }
        public string? LocationCode { get; set; }
        public string? OrganizationCode { get; set; }
        public bool? IsSuspended { get; set; }
        public string? County { get; set; }
        public string? ContactFirstName { get; set; }
        public string? ContactLastName { get; set; }
        public string? ContactPrimaryEmail { get; set; }
        public string? ContactPhone { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? UpdatedBy { get; set; }
        public string? ResultNotificationMethod { get; set; }
        public string? OrderingMethod { get; set; }
        public int? RequestSalesId { get; set; }
        public int? PrinterType { get; set; }
        public DateTime? ApproxStartDate { get; set; }
        public bool? DriveThrough { get; set; }
        public string? LicenseNo { get; set; }
        public string? VehicleLicenseState { get; set; }
        public string? ToLabTransfer { get; set; }
        public string? ToLabTransferName { get; set; }
        public string? ResultHeader { get; set; }
        public string? RequisitionHeader { get; set; }
        public string? LabDirector { get; set; }
        public string? Cliano { get; set; }
        public string? MarketingLogo { get; set; }
        public string? LabLogo { get; set; }
        public string? PublicUrlLogo { get; set; }
        public string? ExtentionData { get; set; }
        public bool IsDeleted { get; set; }
        public string? BulkFileId { get; set; }
        public DateTime? DeleteDate { get; set; }
        public string? DeletedByUserId { get; set; }
    }
}
