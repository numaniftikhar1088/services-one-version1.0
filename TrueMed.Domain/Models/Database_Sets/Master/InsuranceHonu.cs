using System;
using System.Collections.Generic;

namespace TrueMed.Sevices.MasterEntities;

public partial class InsuranceHonu
{
    public int Id { get; set; }

    public string? BillingEntity { get; set; }

    public string? PayerId { get; set; }

    public string? InsuranceName { get; set; }

    public string? Enr { get; set; }

    public string? Typ { get; set; }

    public string? St { get; set; }

    public string? Lob { get; set; }

    public string? Rte { get; set; }

    public string? Rts { get; set; }

    public string? Era { get; set; }

    public string? Sec { get; set; }

    public string? Note { get; set; }

    public string? PanaceaPgx { get; set; }

    public string? NetworkType { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? ZipCode { get; set; }

    public string? Phone { get; set; }

    public int? AccountId { get; set; }

    public string? AccountName { get; set; }

    public string? AddedBy { get; set; }

    public DateTime? AddedDate { get; set; }

    public string? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public string? InsuranceType { get; set; }

    public string? PokitDokTradingPatnerId { get; set; }

    public string? MediTechApproved { get; set; }

    public int? FormId { get; set; }

    public string? ApprovedBy { get; set; }

    public DateTime? ApprovedDate { get; set; }

    public string? RequisitionType { get; set; }

    public bool? ApprovalFlag { get; set; }

    public string? RecordId { get; set; }

    public string? RejectedBy { get; set; }

    public DateTime? Rejecteddate { get; set; }

    public bool? RejectedFlag { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? DeletedDate { get; set; }

    public string? Status { get; set; }

    public string? OldInsuranceType { get; set; }

    public string? OldLabCode { get; set; }

    public string? FinancialClassCode { get; set; }

    public string? InsCode { get; set; }

    public string? Cpid { get; set; }

    public string? AmdinsuranceName { get; set; }

    public string? ToxCodingType { get; set; }
}
