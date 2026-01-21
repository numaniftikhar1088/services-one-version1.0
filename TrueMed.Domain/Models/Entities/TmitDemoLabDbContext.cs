using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace TrueMed.Domain.Models.Entities;

public partial class TmitDemoLabDbContext : DbContext
{
    public TmitDemoLabDbContext()
    {
    }

    public TmitDemoLabDbContext(DbContextOptions<TmitDemoLabDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BloodTestRangesForDemo> BloodTestRangesForDemos { get; set; }

    public virtual DbSet<DynamicPanelId> DynamicPanelIds { get; set; }

    public virtual DbSet<DynamicPanelsAssignment> DynamicPanelsAssignments { get; set; }

    public virtual DbSet<InternalFkDefinitionStorage> InternalFkDefinitionStorages { get; set; }

    public virtual DbSet<PanelChildForDemo> PanelChildForDemos { get; set; }

    public virtual DbSet<PanelForDemo> PanelForDemos { get; set; }

    public virtual DbSet<PanelTestForDemo> PanelTestForDemos { get; set; }

    public virtual DbSet<PathDnagroupId> PathDnagroupIds { get; set; }

    public virtual DbSet<PathDnalisassayDatum> PathDnalisassayData { get; set; }

    public virtual DbSet<PathDnalispanelMapping> PathDnalispanelMappings { get; set; }

    public virtual DbSet<PathDnalisreportingRule> PathDnalisreportingRules { get; set; }

    public virtual DbSet<ProductHistory> ProductHistories { get; set; }

    public virtual DbSet<TblAutoNumberIdformat> TblAutoNumberIdformats { get; set; }

    public virtual DbSet<TblBloodLisSettingsForDemo> TblBloodLisSettingsForDemos { get; set; }

    public virtual DbSet<TblComepndiumBloodPanelMappingImport> TblComepndiumBloodPanelMappingImports { get; set; }

    public virtual DbSet<TblCompendiumBloodGroupTestAssignmentImport> TblCompendiumBloodGroupTestAssignmentImports { get; set; }

    public virtual DbSet<TblCompendiumBloodTestRangesImport> TblCompendiumBloodTestRangesImports { get; set; }

    public virtual DbSet<TblCompendiumDependencyAndReflexTest> TblCompendiumDependencyAndReflexTests { get; set; }

    public virtual DbSet<TblCompendiumGroup> TblCompendiumGroups { get; set; }

    public virtual DbSet<TblCompendiumGroupPanelsAssignment> TblCompendiumGroupPanelsAssignments { get; set; }

    public virtual DbSet<TblCompendiumPanel> TblCompendiumPanels { get; set; }

    public virtual DbSet<TblCompendiumPanelAssignment> TblCompendiumPanelAssignments { get; set; }

    public virtual DbSet<TblCompendiumPanelDepartmentAssignment> TblCompendiumPanelDepartmentAssignments { get; set; }

    public virtual DbSet<TblCompendiumPanelTestAssignment> TblCompendiumPanelTestAssignments { get; set; }

    public virtual DbSet<TblCompendiumPanelType> TblCompendiumPanelTypes { get; set; }

    public virtual DbSet<TblCompendiumReportingRule> TblCompendiumReportingRules { get; set; }

    public virtual DbSet<TblCompendiumTest> TblCompendiumTests { get; set; }

    public virtual DbSet<TblCompendiumTestCalculation> TblCompendiumTestCalculations { get; set; }

    public virtual DbSet<TblCompendiumTestConfiguration> TblCompendiumTestConfigurations { get; set; }

    public virtual DbSet<TblCompenduimTestReportingRule> TblCompenduimTestReportingRules { get; set; }

    public virtual DbSet<TblControl> TblControls { get; set; }

    public virtual DbSet<TblControlOption> TblControlOptions { get; set; }

    public virtual DbSet<TblControlType> TblControlTypes { get; set; }

    public virtual DbSet<TblDepartment> TblDepartments { get; set; }

    public virtual DbSet<TblDrugAllergiesAssignment> TblDrugAllergiesAssignments { get; set; }

    public virtual DbSet<TblDynamicForm> TblDynamicForms { get; set; }

    public virtual DbSet<TblFacility> TblFacilities { get; set; }

    public virtual DbSet<TblFacilityCheckBoxOption> TblFacilityCheckBoxOptions { get; set; }

    public virtual DbSet<TblFacilityFile> TblFacilityFiles { get; set; }

    public virtual DbSet<TblFacilityOption> TblFacilityOptions { get; set; }

    public virtual DbSet<TblFacilityRefLabAssignment> TblFacilityRefLabAssignments { get; set; }

    public virtual DbSet<TblFacilityUser> TblFacilityUsers { get; set; }

    public virtual DbSet<TblFile> TblFiles { get; set; }

    public virtual DbSet<TblIcd10assignment> TblIcd10assignments { get; set; }

    public virtual DbSet<TblInsuranceAssignment> TblInsuranceAssignments { get; set; }

    public virtual DbSet<TblInsuranceBilling> TblInsuranceBillings { get; set; }

    public virtual DbSet<TblIntegrationKeyConfiguration> TblIntegrationKeyConfigurations { get; set; }

    public virtual DbSet<TblLab> TblLabs { get; set; }

    public virtual DbSet<TblLabAssignment> TblLabAssignments { get; set; }

    public virtual DbSet<TblLabAssignmentGroup> TblLabAssignmentGroups { get; set; }

    public virtual DbSet<TblLabConfiguration> TblLabConfigurations { get; set; }

    public virtual DbSet<TblLabControlOption> TblLabControlOptions { get; set; }

    public virtual DbSet<TblLabControlOptionDependency> TblLabControlOptionDependencies { get; set; }

    public virtual DbSet<TblLabControlPortalType> TblLabControlPortalTypes { get; set; }

    public virtual DbSet<TblLabFacInsAssignment> TblLabFacInsAssignments { get; set; }

    public virtual DbSet<TblLabPageSection> TblLabPageSections { get; set; }

    public virtual DbSet<TblLabRequisitionType> TblLabRequisitionTypes { get; set; }

    public virtual DbSet<TblLabRequisitionTypeWorkflowStatus> TblLabRequisitionTypeWorkflowStatuses { get; set; }

    public virtual DbSet<TblLabSectionControl> TblLabSectionControls { get; set; }

    public virtual DbSet<TblLabSectionsControl> TblLabSectionsControls { get; set; }

    public virtual DbSet<TblLisresultDatum> TblLisresultData { get; set; }

    public virtual DbSet<TblLisstatus> TblLisstatuses { get; set; }

    public virtual DbSet<TblLog> TblLogs { get; set; }

    public virtual DbSet<TblMarketPlaceIntegrationConfiguration> TblMarketPlaceIntegrationConfigurations { get; set; }

    public virtual DbSet<TblMenu> TblMenus { get; set; }

    public virtual DbSet<TblMenuSection> TblMenuSections { get; set; }

    public virtual DbSet<TblModule> TblModules { get; set; }

    public virtual DbSet<TblModuleDeniedControl> TblModuleDeniedControls { get; set; }

    public virtual DbSet<TblModuleDeniedSection> TblModuleDeniedSections { get; set; }

    public virtual DbSet<TblModuleSection> TblModuleSections { get; set; }

    public virtual DbSet<TblPage> TblPages { get; set; }

    public virtual DbSet<TblPanelTestSpecimenTypeAssignment> TblPanelTestSpecimenTypeAssignments { get; set; }

    public virtual DbSet<TblPanelType> TblPanelTypes { get; set; }

    public virtual DbSet<TblPatientAddInfo> TblPatientAddInfos { get; set; }

    public virtual DbSet<TblPatientAddrHistory> TblPatientAddrHistories { get; set; }

    public virtual DbSet<TblPatientBasicInfo> TblPatientBasicInfos { get; set; }

    public virtual DbSet<TblPatientInsurance> TblPatientInsurances { get; set; }

    public virtual DbSet<TblPatientLoginUser> TblPatientLoginUsers { get; set; }

    public virtual DbSet<TblPrinterSetup> TblPrinterSetups { get; set; }

    public virtual DbSet<TblRequestToken> TblRequestTokens { get; set; }

    public virtual DbSet<TblRequisition> TblRequisitions { get; set; }

    public virtual DbSet<TblRequisitionAddInfo> TblRequisitionAddInfos { get; set; }

    public virtual DbSet<TblRequisitionDrugAllergyCode> TblRequisitionDrugAllergyCodes { get; set; }

    public virtual DbSet<TblRequisitionFile> TblRequisitionFiles { get; set; }

    public virtual DbSet<TblRequisitionIcd10code> TblRequisitionIcd10codes { get; set; }

    public virtual DbSet<TblRequisitionMaster> TblRequisitionMasters { get; set; }

    public virtual DbSet<TblRequisitionMedicalNecessity> TblRequisitionMedicalNecessities { get; set; }

    public virtual DbSet<TblRequisitionMedication> TblRequisitionMedications { get; set; }

    public virtual DbSet<TblRequisitionPanel> TblRequisitionPanels { get; set; }

    public virtual DbSet<TblRequisitionPatientInsurance> TblRequisitionPatientInsurances { get; set; }

    public virtual DbSet<TblRequisitionRecordInfo> TblRequisitionRecordInfos { get; set; }

    public virtual DbSet<TblRequisitionSpecimen> TblRequisitionSpecimens { get; set; }

    public virtual DbSet<TblRequisitionStatus> TblRequisitionStatuses { get; set; }

    public virtual DbSet<TblRequisitionTest> TblRequisitionTests { get; set; }

    public virtual DbSet<TblRole> TblRoles { get; set; }

    public virtual DbSet<TblRoleClaim> TblRoleClaims { get; set; }

    public virtual DbSet<TblSection> TblSections { get; set; }

    public virtual DbSet<TblSectionControl> TblSectionControls { get; set; }

    public virtual DbSet<TblSheetTemplate> TblSheetTemplates { get; set; }

    public virtual DbSet<TblShipping> TblShippings { get; set; }

    public virtual DbSet<TblSpecimenType> TblSpecimenTypes { get; set; }

    public virtual DbSet<TblTempCompendiumPanelTestUpload> TblTempCompendiumPanelTestUploads { get; set; }

    public virtual DbSet<TblTempReportingRulesUpload> TblTempReportingRulesUploads { get; set; }

    public virtual DbSet<TblTestType> TblTestTypes { get; set; }

    public virtual DbSet<TblUploadFileDetail> TblUploadFileDetails { get; set; }

    public virtual DbSet<TblUserActivity> TblUserActivities { get; set; }

    public virtual DbSet<TblUserClaim> TblUserClaims { get; set; }

    public virtual DbSet<TblUserRole> TblUserRoles { get; set; }

    public virtual DbSet<TblUserViewRequisition> TblUserViewRequisitions { get; set; }

    public virtual DbSet<TblUserfavouriteMenu> TblUserfavouriteMenus { get; set; }

    public virtual DbSet<TblViewRequisitionColumn> TblViewRequisitionColumns { get; set; }

    public virtual DbSet<TblWorkFlowStatus> TblWorkFlowStatuses { get; set; }

    public virtual DbSet<Tbltempark> Tbltemparks { get; set; }

    public virtual DbSet<ToxConfirmationToxCompendium> ToxConfirmationToxCompendia { get; set; }

    public virtual DbSet<ToxInHouseToxCompendium> ToxInHouseToxCompendia { get; set; }

    public virtual DbSet<ToxPanel> ToxPanels { get; set; }

    public virtual DbSet<ToxPanelTest> ToxPanelTests { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=tmitprojectonescus.database.windows.net;Initial Catalog=TMIT-DemoLab-DB;Integrated Security=false;user=tmituser;password=WaterMark123$$;MultipleActiveResultSets=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BloodTestRangesForDemo>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("BloodTestRangesForDemo");

            entity.Property(e => e.Comment).IsUnicode(false);
            entity.Property(e => e.HighCritical).IsUnicode(false);
            entity.Property(e => e.HighRisk).IsUnicode(false);
            entity.Property(e => e.HighRiskValue).IsUnicode(false);
            entity.Property(e => e.IntermediateRangeA).IsUnicode(false);
            entity.Property(e => e.IntermediateRangeB).IsUnicode(false);
            entity.Property(e => e.LowCritical).IsUnicode(false);
            entity.Property(e => e.MaxAge).HasColumnType("decimal(18, 1)");
            entity.Property(e => e.MinAge).HasColumnType("decimal(18, 1)");
            entity.Property(e => e.ModifyBy).IsUnicode(false);
            entity.Property(e => e.Optimal).IsUnicode(false);
            entity.Property(e => e.Optimalvalue).IsUnicode(false);
            entity.Property(e => e.ReferenceValueType).IsUnicode(false);
            entity.Property(e => e.ResultFlag).IsUnicode(false);
            entity.Property(e => e.Sex).IsUnicode(false);
            entity.Property(e => e.TestCode).IsUnicode(false);
            entity.Property(e => e.TestName).IsUnicode(false);
        });

        modelBuilder.Entity<DynamicPanelId>(entity =>
        {
            entity.HasKey(e => e.PanelId);

            entity.Property(e => e.PanelCode).IsUnicode(false);
            entity.Property(e => e.PanelName).IsUnicode(false);
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<DynamicPanelsAssignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_DynamicPanelsAssignment1");

            entity.ToTable("DynamicPanelsAssignment");

            entity.Property(e => e.GroupId)
                .IsUnicode(false)
                .HasColumnName("GroupID");
            entity.Property(e => e.MainPanelName).IsUnicode(false);
            entity.Property(e => e.PanelCode).IsUnicode(false);
            entity.Property(e => e.PanelName).IsUnicode(false);
            entity.Property(e => e.PerformingLabs).IsUnicode(false);
            entity.Property(e => e.ResistanceClass).IsUnicode(false);
            entity.Property(e => e.TempCol).IsUnicode(false);
            entity.Property(e => e.TestCode).IsUnicode(false);
            entity.Property(e => e.TestName).IsUnicode(false);
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<InternalFkDefinitionStorage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Internal__3214EC277FEF1836");

            entity.ToTable("Internal_FK_Definition_Storage");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.FkCreationStatement)
                .IsRequired()
                .IsUnicode(false)
                .HasColumnName("FK_CreationStatement");
            entity.Property(e => e.FkDestructionStatement)
                .IsRequired()
                .IsUnicode(false)
                .HasColumnName("FK_DestructionStatement");
            entity.Property(e => e.FkName)
                .IsRequired()
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("FK_Name");
            entity.Property(e => e.TableTruncationStatement)
                .IsRequired()
                .IsUnicode(false)
                .HasColumnName("Table_TruncationStatement");
        });

        modelBuilder.Entity<PanelChildForDemo>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("PanelChildForDemo");

            entity.Property(e => e.ChildTestName).IsUnicode(false);
            entity.Property(e => e.PerformingLab).IsUnicode(false);
            entity.Property(e => e.TestName).IsUnicode(false);
        });

        modelBuilder.Entity<PanelForDemo>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("PanelForDemo");

            entity.Property(e => e.Cptcodes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CPTCodes");
            entity.Property(e => e.CreatedBy).IsUnicode(false);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.EdenPanelCode)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.IsMasterPanel).HasColumnName("isMasterPanel");
            entity.Property(e => e.LabReferenceCode).IsUnicode(false);
            entity.Property(e => e.PanelAbbrevation).IsUnicode(false);
            entity.Property(e => e.PanelDescription).IsUnicode(false);
            entity.Property(e => e.PanelGroupCode).IsUnicode(false);
            entity.Property(e => e.PanelName).IsUnicode(false);
            entity.Property(e => e.PanelType)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.PerformingLab).IsUnicode(false);
            entity.Property(e => e.ProdPanelId).HasColumnName("Prod_PanelId");
            entity.Property(e => e.ReqId)
                .IsUnicode(false)
                .HasColumnName("ReqID");
            entity.Property(e => e.RequistionType)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<PanelTestForDemo>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("PanelTestForDemo");

            entity.Property(e => e.AssociatedMedications).IsUnicode(false);
            entity.Property(e => e.BioReqDescription).IsUnicode(false);
            entity.Property(e => e.BioReqType).IsUnicode(false);
            entity.Property(e => e.Calculation).IsUnicode(false);
            entity.Property(e => e.CalculationOption).IsUnicode(false);
            entity.Property(e => e.CommonTestName).IsUnicode(false);
            entity.Property(e => e.CptcodeResultTest)
                .IsUnicode(false)
                .HasColumnName("CPTcodeResultTest");
            entity.Property(e => e.Cptcodes)
                .IsUnicode(false)
                .HasColumnName("CPTCodes");
            entity.Property(e => e.CreatedBy).IsUnicode(false);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.CuttOffValues).IsUnicode(false);
            entity.Property(e => e.DrugClassName).IsUnicode(false);
            entity.Property(e => e.EdenOrderTestCode)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EdenResultTestCode)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.GroupPerformingLab).IsUnicode(false);
            entity.Property(e => e.IntegrationType).IsUnicode(false);
            entity.Property(e => e.LabReferenceCode).IsUnicode(false);
            entity.Property(e => e.LabTestName).IsUnicode(false);
            entity.Property(e => e.Loinc)
                .IsUnicode(false)
                .HasColumnName("LOINC");
            entity.Property(e => e.OrderMethod).IsUnicode(false);
            entity.Property(e => e.OrderMethodOption).IsUnicode(false);
            entity.Property(e => e.PanelCode).IsUnicode(false);
            entity.Property(e => e.PanelGroupCode).IsUnicode(false);
            entity.Property(e => e.PanelType).IsUnicode(false);
            entity.Property(e => e.PerformingLab).IsUnicode(false);
            entity.Property(e => e.ProdPanelTestId).HasColumnName("Prod_PanelTestId");
            entity.Property(e => e.ReceivedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ReqId)
                .IsUnicode(false)
                .HasColumnName("ReqID");
            entity.Property(e => e.RequisitionType).IsUnicode(false);
            entity.Property(e => e.ResultCodeLoinc)
                .IsUnicode(false)
                .HasColumnName("ResultCodeLOINC");
            entity.Property(e => e.ResultMethod).IsUnicode(false);
            entity.Property(e => e.ResultMethodOption).IsUnicode(false);
            entity.Property(e => e.ResultReportName).IsUnicode(false);
            entity.Property(e => e.SendOrder).IsUnicode(false);
            entity.Property(e => e.SpecimentType).IsUnicode(false);
            entity.Property(e => e.SubPanel).IsUnicode(false);
            entity.Property(e => e.SystemTestName).IsUnicode(false);
            entity.Property(e => e.Tags).IsUnicode(false);
            entity.Property(e => e.TestComments).IsUnicode(false);
            entity.Property(e => e.TestType).IsUnicode(false);
            entity.Property(e => e.Units).IsUnicode(false);
            entity.Property(e => e.Uom)
                .IsUnicode(false)
                .HasColumnName("UOM");
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.UpperLimit).IsUnicode(false);
        });

        modelBuilder.Entity<PathDnagroupId>(entity =>
        {
            entity.ToTable("PathDNAGroupIDS");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.GroupDescription).IsUnicode(false);
            entity.Property(e => e.GroupId)
                .IsUnicode(false)
                .HasColumnName("GroupID");
            entity.Property(e => e.GroupName).IsUnicode(false);
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<PathDnalisassayDatum>(entity =>
        {
            entity.HasKey(e => e.AssayId);

            entity.ToTable("PathDNALISAssayData");

            entity.Property(e => e.AssayName).IsUnicode(false);
            entity.Property(e => e.AthenaCode).IsUnicode(false);
            entity.Property(e => e.IsCritical)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.IsReportable).IsUnicode(false);
            entity.Property(e => e.OrganismName).IsUnicode(false);
            entity.Property(e => e.OrganismType).IsUnicode(false);
            entity.Property(e => e.PanelId).HasColumnName("PanelID");
            entity.Property(e => e.PerformingLabs).IsUnicode(false);
            entity.Property(e => e.ReportingRule).IsUnicode(false);
            entity.Property(e => e.TestCode).IsUnicode(false);
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<PathDnalispanelMapping>(entity =>
        {
            entity.HasKey(e => e.PanelId).HasName("PK_PathDNALISPanelMapping_1");

            entity.ToTable("PathDNALISPanelMapping");

            entity.Property(e => e.DynamicPanelId).HasColumnName("DynamicPanelID");
            entity.Property(e => e.GroupId)
                .HasMaxLength(255)
                .HasColumnName("GroupID");
            entity.Property(e => e.Organism).HasMaxLength(255);
            entity.Property(e => e.PanelCode).HasMaxLength(255);
            entity.Property(e => e.PanelName).HasMaxLength(255);
            entity.Property(e => e.PerformingLabs).HasMaxLength(255);
            entity.Property(e => e.TestCode).HasMaxLength(255);
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<PathDnalisreportingRule>(entity =>
        {
            entity.HasKey(e => e.RulesId);

            entity.ToTable("PathDNALISReportingRules");

            entity.Property(e => e.AmpScore).IsUnicode(false);
            entity.Property(e => e.CqConf).IsUnicode(false);
            entity.Property(e => e.IsReportingRuleType)
                .HasMaxLength(200)
                .HasColumnName("isReportingRuleType");
            entity.Property(e => e.MaxCriticallyHigh).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MaxDetected).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MaxHigh).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MaxLow).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MaxMedium).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MaxPass).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MinCriticallyHigh).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MinDetected).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MinHigh).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MinLow).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MinMedium).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.MinPass).HasColumnType("decimal(18, 3)");
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<ProductHistory>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ProductHistory");

            entity.Property(e => e.CreatedBy).HasMaxLength(200);
            entity.Property(e => e.DeletedBy).HasMaxLength(200);
            entity.Property(e => e.GroupId).HasColumnName("GroupID");
            entity.Property(e => e.UpdatedBy).HasMaxLength(200);
        });

        modelBuilder.Entity<TblAutoNumberIdformat>(entity =>
        {
            entity.ToTable("tblAutoNumberIDFormat");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.IddateFormat).HasColumnName("IDDateFormat");
            entity.Property(e => e.Idname).HasColumnName("IDName");
            entity.Property(e => e.LabId).HasColumnName("LabID");
        });

        modelBuilder.Entity<TblBloodLisSettingsForDemo>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tblBlood_LIS_SettingsForDemo");

            entity.Property(e => e.Name).IsUnicode(false);
            entity.Property(e => e.Prefix).IsUnicode(false);
            entity.Property(e => e.Text).IsUnicode(false);
            entity.Property(e => e.Type).IsUnicode(false);
        });

        modelBuilder.Entity<TblComepndiumBloodPanelMappingImport>(entity =>
        {
            entity.ToTable("tblComepndiumBloodPanelMappingImport");

            entity.Property(e => e.OrderMethod).HasMaxLength(255);
            entity.Property(e => e.OrderMethodOption).HasMaxLength(255);
            entity.Property(e => e.PanelName).HasMaxLength(255);
            entity.Property(e => e.PanelType).HasMaxLength(255);
            entity.Property(e => e.PerformingLab).HasMaxLength(255);
            entity.Property(e => e.ResultMethod).HasMaxLength(255);
            entity.Property(e => e.ResultMethodOption).HasMaxLength(255);
            entity.Property(e => e.SpecimentType).HasMaxLength(255);
            entity.Property(e => e.TestName).HasMaxLength(255);
            entity.Property(e => e.TestType).HasMaxLength(255);
            entity.Property(e => e.Unit).HasMaxLength(255);
        });

        modelBuilder.Entity<TblCompendiumBloodGroupTestAssignmentImport>(entity =>
        {
            entity.ToTable("tblCompendiumBloodGroupTestAssignmentImport");

            entity.Property(e => e.ChildTestCode).HasMaxLength(255);
            entity.Property(e => e.ChildTestName).HasMaxLength(255);
            entity.Property(e => e.OrderMethod).HasMaxLength(255);
            entity.Property(e => e.OrderMethodOption).HasMaxLength(255);
            entity.Property(e => e.PerformingLab).HasMaxLength(255);
            entity.Property(e => e.ResultMethod).HasMaxLength(255);
            entity.Property(e => e.ResultMethodOption).HasMaxLength(255);
            entity.Property(e => e.SpecimentType).HasMaxLength(255);
            entity.Property(e => e.TestName).HasMaxLength(255);
            entity.Property(e => e.TestType).HasMaxLength(255);
            entity.Property(e => e.Unit).HasMaxLength(255);
        });

        modelBuilder.Entity<TblCompendiumBloodTestRangesImport>(entity =>
        {
            entity.ToTable("tblCompendiumBloodTestRangesImport");

            entity.Property(e => e.CriticalValueHigh).HasMaxLength(255);
            entity.Property(e => e.CriticalValueLow).HasMaxLength(255);
            entity.Property(e => e.HighFlag).HasMaxLength(255);
            entity.Property(e => e.InRangeFlag).HasMaxLength(255);
            entity.Property(e => e.LowFlag).HasMaxLength(255);
            entity.Property(e => e.ReferenceValueType).HasMaxLength(255);
            entity.Property(e => e.Sex).HasMaxLength(255);
            entity.Property(e => e.SpecimentType).HasMaxLength(255);
            entity.Property(e => e.TestName).HasMaxLength(255);
            entity.Property(e => e.Uint).HasMaxLength(255);
        });

        modelBuilder.Entity<TblCompendiumDependencyAndReflexTest>(entity =>
        {
            entity.ToTable("tblCompendiumDependencyAndReflexTests");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ChildTestAssignmentId).HasColumnName("ChildTestAssignmentID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time)");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.ParentTestAssignmentId).HasColumnName("ParentTestAssignmentID");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblCompendiumGroup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_tblCompinduimGroups");

            entity.ToTable("tblCompendiumGroups");

            entity.Property(e => e.Id)
                .HasComment("Auto Generated Number")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Data and Time of login user time zone");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Delete Date and Time of login user time zone");
            entity.Property(e => e.GroupName)
                .IsRequired()
                .HasComment("Group Name - Compendium Data");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)")
                .HasColumnName("isActive");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time of login user time zone");
        });

        modelBuilder.Entity<TblCompendiumGroupPanelsAssignment>(entity =>
        {
            entity.ToTable("tblCompendiumGroupPanelsAssignment");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.DisplayTypeId).HasColumnName("DisplayTypeID");
            entity.Property(e => e.GroupId).HasColumnName("GroupID");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.PanelId).HasColumnName("PanelID");
        });

        modelBuilder.Entity<TblCompendiumPanel>(entity =>
        {
            entity.ToTable("tblCompendiumPanels");

            entity.Property(e => e.Id)
                .HasComment("Auto Generated ID")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)")
                .HasColumnName("isActive");
            entity.Property(e => e.IsResistance).HasDefaultValueSql("((0))");
            entity.Property(e => e.PanelName)
                .IsRequired()
                .HasComment("Panel Name");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Panel Type ID (tblPanelType Table)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.Tmitcode).HasColumnName("TMITCode");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblCompendiumPanelAssignment>(entity =>
        {
            entity.ToTable("tblCompendiumPanelAssignments");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ChildPanelId).HasColumnName("ChildPanelID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time)");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.ParentPanelId).HasColumnName("ParentPanelID");
            entity.Property(e => e.ReferenceLabId).HasColumnName("ReferenceLabID");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblCompendiumPanelDepartmentAssignment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_tblCompendiumPanelDepartmentsAssignment");

            entity.ToTable("tblCompendiumPanelDepartmentAssignments");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Data and Time of login user time zone");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Delete Date and Time of login user time zone");
            entity.Property(e => e.DepartmentId).HasColumnName("DepartmentID");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)")
                .HasColumnName("isActive");
            entity.Property(e => e.PanelId).HasColumnName("PanelID");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time of login user time zone");
        });

        modelBuilder.Entity<TblCompendiumPanelTestAssignment>(entity =>
        {
            entity.ToTable("tblCompendiumPanelTestAssignments");

            entity.Property(e => e.Id)
                .HasComment("Auto Generated ID")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time)");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.PanelId).HasColumnName("PanelID");
            entity.Property(e => e.ReportingRuleId).HasColumnName("ReportingRuleID");
            entity.Property(e => e.TestConfigId)
                .HasComment("Test Name")
                .HasColumnName("TestConfigID");
            entity.Property(e => e.TestId)
                .HasComment("Test Name")
                .HasColumnName("TestID");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblCompendiumPanelType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Compendi__3214EC0713504447");

            entity.ToTable("tblCompendiumPanelType");

            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedDate).HasColumnType("datetime");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<TblCompendiumReportingRule>(entity =>
        {
            entity.ToTable("tblCompendiumReportingRules");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.AmpScore).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.CqConf).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Data and Time of login user time zone");
            entity.Property(e => e.CuttOffValue).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Delete Date and Time of login user time zone");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.MaxCriticalHigh).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MaxHigh).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MaxInter).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MaxLow).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MinCriticalHigh).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MinHigh).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MinInter).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MinLow).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time of login user time zone");
        });

        modelBuilder.Entity<TblCompendiumTest>(entity =>
        {
            entity.ToTable("tblCompendiumTests");

            entity.Property(e => e.Id)
                .HasComment("Auto Generated ID")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time)");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Requisition Type ID (tblRequisitionType Table)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.TestName)
                .IsRequired()
                .HasComment("Test Name");
            entity.Property(e => e.Tmitcode)
                .HasComment("TMIT Code (Internal Code)")
                .HasColumnName("TMITCode");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblCompendiumTestCalculation>(entity =>
        {
            entity.ToTable("tblCompendiumTestCalculations");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)")
                .HasColumnName("isActive");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblCompendiumTestConfiguration>(entity =>
        {
            entity.ToTable("tblCompendiumTestConfigurations");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CalcuationFormulaId).HasColumnName("CalcuationFormulaID");
            entity.Property(e => e.Cptcode).HasColumnName("CPTCode");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.GroupTestId).HasColumnName("GroupTestID");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.IsControl).HasDefaultValueSql("((1))");
            entity.Property(e => e.ReferenceLabId).HasColumnName("ReferenceLabID");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.SpecimenTypeId).HasColumnName("SpecimenTypeID");
            entity.Property(e => e.TestId).HasColumnName("TestID");
        });

        modelBuilder.Entity<TblCompenduimTestReportingRule>(entity =>
        {
            entity.ToTable("tblCompenduimTestReportingRules");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Data and Time of login user time zone");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Delete Date and Time of login user time zone");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.PanelTestAssignmentId).HasColumnName("PanelTestAssignmentID");
            entity.Property(e => e.ReportingRuleId).HasColumnName("ReportingRuleID");
            entity.Property(e => e.TestConfigId).HasColumnName("TestConfigID");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time of login user time zone");
        });

        modelBuilder.Entity<TblControl>(entity =>
        {
            entity.ToTable("tblControls");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ControlKey).IsRequired();
            entity.Property(e => e.ControlName).IsRequired();
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasColumnName("isActive");
            entity.Property(e => e.IsSystemRequired).HasColumnName("isSystemRequired");
        });

        modelBuilder.Entity<TblControlOption>(entity =>
        {
            entity.HasKey(e => e.OptionId);

            entity.ToTable("tblControlOptions");

            entity.Property(e => e.OptionId).HasColumnName("OptionID");
            entity.Property(e => e.ControlId).HasColumnName("ControlID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.IsVisible)
                .IsRequired()
                .HasDefaultValueSql("((1))");
        });

        modelBuilder.Entity<TblControlType>(entity =>
        {
            entity.HasKey(e => e.ControlId);

            entity.ToTable("tblControlType");

            entity.Property(e => e.ControlId)
                .ValueGeneratedNever()
                .HasColumnName("ControlID");
            entity.Property(e => e.ControlName).IsRequired();
            entity.Property(e => e.IsVisible)
                .IsRequired()
                .HasDefaultValueSql("((1))");
        });

        modelBuilder.Entity<TblDepartment>(entity =>
        {
            entity.HasKey(e => e.DeptId);

            entity.ToTable("tblDepartment");

            entity.Property(e => e.DeptId).HasColumnName("DeptID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(e => e.DeletedBy).HasMaxLength(200);
            entity.Property(e => e.DepartmentName).IsRequired();
            entity.Property(e => e.UpdatedBy).HasMaxLength(200);
        });

        modelBuilder.Entity<TblDrugAllergiesAssignment>(entity =>
        {
            entity.ToTable("tblDrugAllergiesAssignment");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.Daid)
                .IsRequired()
                .HasMaxLength(50)
                .HasColumnName("DAID");
            entity.Property(e => e.FacilityId).HasColumnName("FacilityID");
            entity.Property(e => e.IsStatus)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.LabType).HasMaxLength(50);
            entity.Property(e => e.PanelId).HasColumnName("PanelID");
            entity.Property(e => e.RefLabId).HasColumnName("RefLabID");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
        });

        modelBuilder.Entity<TblDynamicForm>(entity =>
        {
            entity.HasKey(e => e.Key).HasName("PK__tblDynam__C41E02883434566E");

            entity.ToTable("tblDynamicForms");

            entity.Property(e => e.Key)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<TblFacility>(entity =>
        {
            entity.HasKey(e => e.FacilityId).HasName("PK__tblFacil__5FB08A74FB2CAFF1");

            entity.ToTable("tblFacility");

            entity.Property(e => e.DeletedByUserId).HasMaxLength(300);
            entity.Property(e => e.IsSuspended).HasDefaultValueSql("((0))");
            entity.Property(e => e.State).IsRequired();
        });

        modelBuilder.Entity<TblFacilityCheckBoxOption>(entity =>
        {
            entity.HasKey(e => e.Key);

            entity.ToTable("tblFacilityCheckBoxOptions");
        });

        modelBuilder.Entity<TblFacilityFile>(entity =>
        {
            entity.HasKey(e => e.FileId);

            entity.ToTable("tblFacilityFiles");

            entity.Property(e => e.FileId).HasMaxLength(300);
            entity.Property(e => e.FileType)
                .IsRequired()
                .HasMaxLength(200)
                .HasDefaultValueSql("('Normal')");

            entity.HasOne(d => d.Facility).WithMany(p => p.TblFacilityFiles)
                .HasForeignKey(d => d.FacilityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblFacilityFiles_tblFacility");
        });

        modelBuilder.Entity<TblFacilityOption>(entity =>
        {
            entity.ToTable("tblFacilityOption");

            entity.Property(e => e.Id).HasComment("Auto Generatd ID/Number");
            entity.Property(e => e.FacilityId).HasComment("Facility ID");
            entity.Property(e => e.OptionId).HasComment("Option ID / Feature ID linked with Facility");
            entity.Property(e => e.OptionValue)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasComment("Option Value (Checked / Unchecked) ");

            entity.HasOne(d => d.Facility).WithMany(p => p.TblFacilityOptions)
                .HasForeignKey(d => d.FacilityId)
                .HasConstraintName("FK_tblFacilityOption_tblFacility");
        });

        modelBuilder.Entity<TblFacilityRefLabAssignment>(entity =>
        {
            entity.ToTable("tblFacilityRefLabAssignment");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.FacilityId)
                .HasComment("Facility ID (tblFacility Table)")
                .HasColumnName("FacilityID");
            entity.Property(e => e.IsActive)
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.LabAssignmentId).HasColumnName("LabAssignmentID");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");

            entity.HasOne(d => d.Facility).WithMany(p => p.TblFacilityRefLabAssignments)
                .HasForeignKey(d => d.FacilityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblFacilityRefLabAssignment_tblFacility");

            entity.HasOne(d => d.LabAssignment).WithMany(p => p.TblFacilityRefLabAssignments)
                .HasForeignKey(d => d.LabAssignmentId)
                .HasConstraintName("FK_tblFacilityRefLabAssignment_tblLabAssignment");
        });

        modelBuilder.Entity<TblFacilityUser>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.FacilityId }).HasName("PK__tblFacil__4273C4EB424A0693");

            entity.ToTable("tblFacilityUser");

            entity.Property(e => e.UserId).HasMaxLength(300);
            entity.Property(e => e.CreatedTime)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.MasterUserId)
                .HasMaxLength(300)
                .HasColumnName("MasterUserID");
            entity.Property(e => e.RefrenceLabId)
                .HasMaxLength(300)
                .HasColumnName("RefrenceLabID");
        });

        modelBuilder.Entity<TblFile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblFiles__3214EC079E9B09AF");

            entity.ToTable("tblFiles");

            entity.Property(e => e.Id)
                .HasMaxLength(300)
                .HasDefaultValueSql("(newid())");
            entity.Property(e => e.ChildId).HasColumnName("ChildID");
            entity.Property(e => e.ContentType).HasMaxLength(200);
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FilePath).HasMaxLength(350);
            entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.Length).HasMaxLength(250);
            entity.Property(e => e.ParentId).HasColumnName("ParentID");

            entity.HasOne(d => d.Facility).WithMany(p => p.TblFiles)
                .HasForeignKey(d => d.FacilityId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblFiles_tblFacility");
        });

        modelBuilder.Entity<TblIcd10assignment>(entity =>
        {
            entity.HasKey(e => e.Icd10assignment);

            entity.ToTable("tblICD10Assignment");

            entity.Property(e => e.Icd10assignment).HasColumnName("ICD10Assignment");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.FacilityId).HasColumnName("FacilityID");
            entity.Property(e => e.Icd10code).HasColumnName("ICD10Code");
            entity.Property(e => e.Icd10description).HasColumnName("ICD10Description");
            entity.Property(e => e.Icd10id).HasColumnName("ICD10ID");
            entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            entity.Property(e => e.LabType).HasMaxLength(50);
            entity.Property(e => e.PanelId).HasColumnName("PanelID");
            entity.Property(e => e.RefLabId).HasColumnName("RefLabID");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.Status)
                .IsRequired()
                .HasDefaultValueSql("((1))");
        });

        modelBuilder.Entity<TblInsuranceAssignment>(entity =>
        {
            entity.HasKey(e => e.InsuranceAssignmentId);

            entity.ToTable("tblInsuranceAssignment");

            entity.Property(e => e.InsuranceAssignmentId)
                .HasComment("Auto Generated ID")
                .HasColumnName("InsuranceAssignmentID");
            entity.Property(e => e.CreatedBy).HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.InsuranceId)
                .HasComment("Insurance ID (tblInsuranceSetup table)")
                .HasColumnName("InsuranceID");
            entity.Property(e => e.OptionId).HasColumnName("OptionID");
            entity.Property(e => e.ProviderCode).HasMaxLength(50);
            entity.Property(e => e.ProviderDisplayName).HasComment("Insurance Provider Display Name (Provider Name display on Report)");
            entity.Property(e => e.ProviderId)
                .HasComment("Insurance Provider ID")
                .HasColumnName("ProviderID");
            entity.Property(e => e.Status)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblInsuranceBilling>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tblInsuranceBilling");

            entity.Property(e => e.BillingId)
                .ValueGeneratedOnAdd()
                .HasComment("Auto Generated ID")
                .HasColumnName("BillingID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Date and Time");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.ExternalBillingKey).HasComment("External Billing Key (JSN)");
            entity.Property(e => e.ExternalCode).HasComment("External Code");
            entity.Property(e => e.ProviderId).HasColumnName("ProviderID");
            entity.Property(e => e.Tmitcode)
                .HasMaxLength(50)
                .HasComment("TMIT Code (Internal Code)")
                .HasColumnName("TMITCode");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblIntegrationKeyConfiguration>(entity =>
        {
            entity.ToTable("tblIntegrationKeyConfigurations");

            entity.Property(e => e.Id).HasColumnName("ID");
        });

        modelBuilder.Entity<TblLab>(entity =>
        {
            entity.HasKey(e => e.LabId).HasName("PK__Labs__EDBD68DA6B8ACC1A");

            entity.ToTable("tblLabs");

            entity.Property(e => e.Cliano).HasColumnName("CLIANo");
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.CreatedBy).HasMaxLength(200);
            entity.Property(e => e.Dbname)
                .HasMaxLength(300)
                .HasColumnName("DBName");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.IsDeleteAssignedInsurances).HasColumnName("isDeleteAssignedInsurances");
            entity.Property(e => e.IsDeleteAssignedReferenceLabs).HasColumnName("isDeleteAssignedReferenceLabs");
            entity.Property(e => e.IsDeleteFacilities).HasColumnName("isDeleteFacilities");
            entity.Property(e => e.IsDeleteIcd10assignment).HasColumnName("isDeleteICD10Assignment");
            entity.Property(e => e.IsDeleteInsuranceAssignment).HasColumnName("isDeleteInsuranceAssignment");
            entity.Property(e => e.IsDeletePatients).HasColumnName("isDeletePatients");
            entity.Property(e => e.IsDeleteUsers).HasColumnName("isDeleteUsers");
            entity.Property(e => e.LabUrl).HasMaxLength(200);
            entity.Property(e => e.MobileNumber).HasMaxLength(100);
            entity.Property(e => e.PatientPortalUrl).HasColumnName("PatientPortalURL");
            entity.Property(e => e.UpdatedBy).HasMaxLength(200);
        });

        modelBuilder.Entity<TblLabAssignment>(entity =>
        {
            entity.ToTable("tblLabAssignment");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(e => e.DeletedBy).HasMaxLength(200);
            entity.Property(e => e.InsuranceId).HasColumnName("InsuranceID");
            entity.Property(e => e.InsuranceOptionId).HasColumnName("InsuranceOptionID");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.ProfileName).IsRequired();
            entity.Property(e => e.RefLabId).HasColumnName("RefLabID");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.UpdatedBy).HasMaxLength(200);

            entity.HasOne(d => d.RefLab).WithMany(p => p.TblLabAssignments)
                .HasForeignKey(d => d.RefLabId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblLabAssignment_tblLabs");

            entity.HasOne(d => d.ReqType).WithMany(p => p.TblLabAssignments)
                .HasForeignKey(d => d.ReqTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblLabAssignment_tblLabRequisitionType");
        });

        modelBuilder.Entity<TblLabAssignmentGroup>(entity =>
        {
            entity.ToTable("tblLabAssignmentGroups");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.GroupId).HasColumnName("GroupID");
            entity.Property(e => e.LabAssignmentId).HasColumnName("LabAssignmentID");

            entity.HasOne(d => d.Group).WithMany(p => p.TblLabAssignmentGroups)
                .HasForeignKey(d => d.GroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblLabAssignmentGroups_tblCompendiumGroups");

            entity.HasOne(d => d.LabAssignment).WithMany(p => p.TblLabAssignmentGroups)
                .HasForeignKey(d => d.LabAssignmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblLabAssignmentGroups_tblLabAssignment");
        });

        modelBuilder.Entity<TblLabConfiguration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblLabCo__3214EC075D03DBCF");

            entity.ToTable("tblLabConfiguration");

            entity.Property(e => e.CssStyle).HasMaxLength(50);
            entity.Property(e => e.DisplayFieldName).HasMaxLength(250);
            entity.Property(e => e.DisplayType).HasMaxLength(250);
        });

        modelBuilder.Entity<TblLabControlOption>(entity =>
        {
            entity.ToTable("tblLabControlOptions");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ControlId).HasColumnName("ControlID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.IsDefaultSelected).HasColumnName("isDefaultSelected");
            entity.Property(e => e.IsVisible)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.OptionId).HasColumnName("OptionID");
        });

        modelBuilder.Entity<TblLabControlOptionDependency>(entity =>
        {
            entity.ToTable("tblLabControlOptionDependency");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ControlId).HasColumnName("ControlID");
            entity.Property(e => e.DependencyAction).IsRequired();
            entity.Property(e => e.DependentControlId).HasColumnName("DependentControlID");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.OptionId).HasColumnName("OptionID");
        });

        modelBuilder.Entity<TblLabControlPortalType>(entity =>
        {
            entity.ToTable("tblLabControlPortalTypes");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ControlId).HasColumnName("ControlID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.PortalTypeId).HasColumnName("PortalTypeID");

            entity.HasOne(d => d.Control).WithMany(p => p.TblLabControlPortalTypes)
                .HasForeignKey(d => d.ControlId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblLabControlPortalTypes_tblControls");
        });

        modelBuilder.Entity<TblLabFacInsAssignment>(entity =>
        {
            entity.ToTable("tblLabFacInsAssignment");

            entity.Property(e => e.Id)
                .HasComment("Auto Generated ID")
                .HasColumnName("ID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.FacilityId)
                .HasComment("Facility ID (tblFacility Table)")
                .HasColumnName("FacilityID");
            entity.Property(e => e.Gender).HasComment("Gender (Male, Female, Unknown, Intersex)");
            entity.Property(e => e.GroupId)
                .HasComment("Group ID (tblGroupSetup Table)")
                .HasColumnName("GroupID");
            entity.Property(e => e.InsuranceId)
                .HasComment("Insurance ID (tblInsuranceSetup Table)")
                .HasColumnName("InsuranceID");
            entity.Property(e => e.InsuranceOptionId).HasColumnName("InsuranceOptionID");
            entity.Property(e => e.IsDefault).HasDefaultValueSql("((0))");
            entity.Property(e => e.LabId)
                .HasComment("Reference Lab (tblLabs Table) - Inhouse or Reference")
                .HasColumnName("LabID");
            entity.Property(e => e.LabType)
                .HasMaxLength(50)
                .HasComment("Lab Type (Inhouse, Reference)");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Requisition Type ID (tblRequisitionType Table)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.Status)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");

            entity.HasOne(d => d.Facility).WithMany(p => p.TblLabFacInsAssignments)
                .HasForeignKey(d => d.FacilityId)
                .HasConstraintName("FK_tblLabFacInsAssignment_tblFacility");
        });

        modelBuilder.Entity<TblLabPageSection>(entity =>
        {
            entity.ToTable("tblLabPageSection");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.IsSelected).HasColumnName("isSelected");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.SectionId).HasColumnName("SectionID");
        });

        modelBuilder.Entity<TblLabRequisitionType>(entity =>
        {
            entity.HasKey(e => e.ReqTypeId).HasName("PK_tblRequisitionType");

            entity.ToTable("tblLabRequisitionType");

            entity.Property(e => e.ReqTypeId)
                .HasComment("Auto Generated ID")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.IsDeleted).HasComment("Status (Active, Inactive)");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.MasterRequisitionTypeId).HasColumnName("MasterRequisitionTypeID");
            entity.Property(e => e.RequisitionType)
                .HasMaxLength(50)
                .HasComment("Requisition Type");
            entity.Property(e => e.RequisitionTypeName).HasComment("Requisition Type Name like Infectious Disease, Blood, Tox etc.");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblLabRequisitionTypeWorkflowStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_tblRequisitionWorkflowStatues");

            entity.ToTable("tblLabRequisitionTypeWorkflowStatus");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.CurrentWorkFlowId).HasColumnName("CurrentWorkFlowID");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.NextWorkFlowIdforAdmin).HasColumnName("NextWorkFlowIDForAdmin");
            entity.Property(e => e.NextWorkFlowIdforPhysician).HasColumnName("NextWorkFlowIDForPhysician");
            entity.Property(e => e.PortalTypeId).HasColumnName("PortalTypeID");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");

            entity.HasOne(d => d.CurrentWorkFlow).WithMany(p => p.TblLabRequisitionTypeWorkflowStatusCurrentWorkFlows)
                .HasForeignKey(d => d.CurrentWorkFlowId)
                .HasConstraintName("FK_tblLabRequisitionTypeWorkflowStatues_tblWorkFlowStatuses");

            entity.HasOne(d => d.NextWorkFlowIdforAdminNavigation).WithMany(p => p.TblLabRequisitionTypeWorkflowStatusNextWorkFlowIdforAdminNavigations)
                .HasForeignKey(d => d.NextWorkFlowIdforAdmin)
                .HasConstraintName("FK_tblLabRequisitionTypeWorkflowStatues_tblWorkFlowStatuses1");

            entity.HasOne(d => d.NextWorkFlowIdforPhysicianNavigation).WithMany(p => p.TblLabRequisitionTypeWorkflowStatusNextWorkFlowIdforPhysicianNavigations)
                .HasForeignKey(d => d.NextWorkFlowIdforPhysician)
                .HasConstraintName("FK_tblLabRequisitionTypeWorkflowStatues_tblWorkFlowStatuses2");

            entity.HasOne(d => d.ReqType).WithMany(p => p.TblLabRequisitionTypeWorkflowStatuses)
                .HasForeignKey(d => d.ReqTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblLabRequisitionTypeWorkflowStatues_tblLabRequisitionType");
        });

        modelBuilder.Entity<TblLabSectionControl>(entity =>
        {
            entity.ToTable("tblLabSectionControls");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ControlId).HasColumnName("ControlID");
            entity.Property(e => e.ControlKey).IsRequired();
            entity.Property(e => e.ControlName).IsRequired();
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.IsSystemRequired).HasColumnName("isSystemRequired");
            entity.Property(e => e.IsVisible)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.PageId).HasColumnName("PageID");
            entity.Property(e => e.SectionId).HasColumnName("SectionID");
            entity.Property(e => e.TypeOfControl).IsRequired();
        });

        modelBuilder.Entity<TblLabSectionsControl>(entity =>
        {
            entity.ToTable("tblLabSectionsControls");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.ControlId).HasColumnName("ControlID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.DisplayName).IsRequired();
            entity.Property(e => e.IsRequired)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.LabId).HasColumnName("LabID");
        });

        modelBuilder.Entity<TblLisresultDatum>(entity =>
        {
            entity.ToTable("tblLISResultData");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Ampscore)
                .HasColumnType("decimal(18, 6)")
                .HasColumnName("AMPScore");
            entity.Property(e => e.AntibioticClass).HasMaxLength(50);
            entity.Property(e => e.CqConf).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Crtsd)
                .HasColumnType("decimal(18, 6)")
                .HasColumnName("CRTSD");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.PanedId).HasColumnName("PanedID");
            entity.Property(e => e.PharmdInterpretation).HasMaxLength(50);
            entity.Property(e => e.QuantFileId).HasColumnName("QuantFileID");
            entity.Property(e => e.RecordId).HasColumnName("RecordID");
            entity.Property(e => e.RequisitionId).HasColumnName("RequisitionID");
            entity.Property(e => e.RequisitionTypeId).HasColumnName("RequisitionTypeID");
            entity.Property(e => e.TestId).HasColumnName("TestID");
        });

        modelBuilder.Entity<TblLisstatus>(entity =>
        {
            entity.HasKey(e => e.LisstatusId);

            entity.ToTable("tblLISStatus");

            entity.Property(e => e.LisstatusId).HasColumnName("LISStatusID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(e => e.DeletedBy).HasMaxLength(200);
            entity.Property(e => e.LisstatusColor).HasColumnName("LISStatusColor");
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.UpdatedBy).HasMaxLength(200);
        });

        modelBuilder.Entity<TblLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblLogs__3214EC074A03E078");

            entity.ToTable("tblLogs");

            entity.Property(e => e.Id).HasMaxLength(300);
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.LogType).HasDefaultValueSql("((1))");
            entity.Property(e => e.Title).IsRequired();
            entity.Property(e => e.UserId).HasMaxLength(300);
        });

        modelBuilder.Entity<TblMarketPlaceIntegrationConfiguration>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_tblIntegrationConfiguration");

            entity.ToTable("tblMarketPlaceIntegrationConfiguration");

            entity.Property(e => e.Id)
                .HasMaxLength(300)
                .HasColumnName("ID");
            entity.Property(e => e.FacilityId).HasColumnName("FacilityID");
            entity.Property(e => e.MarketplaceId)
                .HasMaxLength(300)
                .HasColumnName("MarketplaceID");
            entity.Property(e => e.RequisitionId).HasColumnName("RequisitionID");
        });

        modelBuilder.Entity<TblMenu>(entity =>
        {
            entity.HasKey(e => e.MenuId).HasName("PK__tblMenus__C99ED230DD90F98A");

            entity.ToTable("tblMenus");

            entity.Property(e => e.IsVisible)
                .IsRequired()
                .HasDefaultValueSql("((1))");
        });

        modelBuilder.Entity<TblMenuSection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblMenuS__3214EC0728E787DC");

            entity.ToTable("tblMenuSections");

            entity.HasOne(d => d.Section).WithMany(p => p.TblMenuSections)
                .HasForeignKey(d => d.SectionId)
                .HasConstraintName("FK__tblMenuSe__Secti__5026DB83");
        });

        modelBuilder.Entity<TblModule>(entity =>
        {
            entity.HasKey(e => e.ModuleId);

            entity.ToTable("tblModule");

            entity.Property(e => e.ModuleId).ValueGeneratedNever();
            entity.Property(e => e.CreateBy).IsRequired();
        });

        modelBuilder.Entity<TblModuleDeniedControl>(entity =>
        {
            entity.HasKey(e => new { e.ModuleId, e.ControlId });

            entity.ToTable("tblModuleDeniedControls");

            entity.Property(e => e.CreateBy).IsRequired();

            entity.HasOne(d => d.Control).WithMany(p => p.TblModuleDeniedControls)
                .HasForeignKey(d => d.ControlId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblModuleDeniedControls_tblControls");
        });

        modelBuilder.Entity<TblModuleDeniedSection>(entity =>
        {
            entity.HasKey(e => new { e.ModuleId, e.SectionId });

            entity.ToTable("tblModuleDeniedSections");

            entity.Property(e => e.CreateBy).IsRequired();

            entity.HasOne(d => d.Section).WithMany(p => p.TblModuleDeniedSections)
                .HasForeignKey(d => d.SectionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblModuleDeniedSections_tblSections");
        });

        modelBuilder.Entity<TblModuleSection>(entity =>
        {
            entity.HasKey(e => new { e.SectionId, e.ModuleId });

            entity.ToTable("tblModuleSections");

            entity.HasOne(d => d.Section).WithMany(p => p.TblModuleSections)
                .HasForeignKey(d => d.SectionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblModuleSections_tblSections");
        });

        modelBuilder.Entity<TblPage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblPages__3214EC079013B5F4");

            entity.ToTable("tblPages");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.CreateBy).HasMaxLength(300);
        });

        modelBuilder.Entity<TblPanelTestSpecimenTypeAssignment>(entity =>
        {
            entity.ToTable("tblPanelTestSpecimenTypeAssignment");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.Isactive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.PanelId).HasColumnName("PanelID");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.SpecimenTypeId).HasColumnName("SpecimenTypeID");
            entity.Property(e => e.TestId).HasColumnName("TestID");
        });

        modelBuilder.Entity<TblPanelType>(entity =>
        {
            entity.HasKey(e => e.PanelTypeId);

            entity.ToTable("tblPanelType");

            entity.Property(e => e.PanelTypeId)
                .HasComment("Auto Generated ID")
                .HasColumnName("PanelTypeID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.PanelType)
                .IsRequired()
                .HasMaxLength(50)
                .HasComment("Panel Type");
            entity.Property(e => e.PanelTypeStatus)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblPatientAddInfo>(entity =>
        {
            entity.HasKey(e => e.PatientAddInfoId);

            entity.ToTable("tblPatientAddInfo");

            entity.Property(e => e.PatientAddInfoId)
                .HasComment("Auto Generated Number")
                .HasColumnName("PatientAddInfoID");
            entity.Property(e => e.Address1).HasComment("Address");
            entity.Property(e => e.Address2).HasComment("Address");
            entity.Property(e => e.City).HasComment("City");
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .HasComment("Country");
            entity.Property(e => e.County)
                .HasMaxLength(50)
                .HasComment("County");
            entity.Property(e => e.Email).HasComment("Email (Where he want to receive email for login / resulting/ queries)");
            entity.Property(e => e.FacilityId)
                .HasComment("Facility ID (Where he visited)")
                .HasColumnName("FacilityID");
            entity.Property(e => e.Height)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasComment("Current Height");
            entity.Property(e => e.LandPhone)
                .HasMaxLength(50)
                .HasComment("Land Phone Number");
            entity.Property(e => e.Mobile)
                .HasMaxLength(50)
                .HasComment("Mobile Number");
            entity.Property(e => e.PatientId)
                .HasComment("Patient ID (PatientBasicInfo Table)")
                .HasColumnName("PatientID");
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .HasComment("State / Province");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("User Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
            entity.Property(e => e.Weight)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasComment("Current Weight");
            entity.Property(e => e.ZipCode)
                .HasMaxLength(50)
                .HasComment("Zip Code");

            entity.HasOne(d => d.Facility).WithMany(p => p.TblPatientAddInfos)
                .HasForeignKey(d => d.FacilityId)
                .HasConstraintName("FK_tblPatientAddInfo_tblFacility");

            entity.HasOne(d => d.Patient).WithMany(p => p.TblPatientAddInfos)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblPatientAddInfo_tblPatientBasicInfo1");
        });

        modelBuilder.Entity<TblPatientAddrHistory>(entity =>
        {
            entity.HasKey(e => e.PatientAddrHistoryId);

            entity.ToTable("tblPatientAddrHistory");

            entity.Property(e => e.PatientAddrHistoryId)
                .HasComment("Auto Generated Number")
                .HasColumnName("PatientAddrHistoryID");
            entity.Property(e => e.Address1).HasComment("Address");
            entity.Property(e => e.Address2).HasComment("Address");
            entity.Property(e => e.City).HasComment("City");
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .HasComment("Country");
            entity.Property(e => e.County)
                .HasMaxLength(50)
                .HasComment("County");
            entity.Property(e => e.Email).HasComment("Email (Where he want to receive email for login / resulting/ queries)");
            entity.Property(e => e.FacilityId)
                .HasComment("Facility ID (Where he visited)")
                .HasColumnName("FacilityID");
            entity.Property(e => e.Height)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasComment("Current Height");
            entity.Property(e => e.LandPhone)
                .HasMaxLength(50)
                .HasComment("Land Phone Number");
            entity.Property(e => e.Mobile)
                .HasMaxLength(50)
                .HasComment("Mobile Number");
            entity.Property(e => e.PatientId)
                .HasComment("Patient ID (PatientBasicInfo Table)")
                .HasColumnName("PatientID");
            entity.Property(e => e.SequenceNo).HasComment("Auto Generated Next Sequence Number");
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .HasComment("State / Province");
            entity.Property(e => e.Weight)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasComment("Current Weight");
            entity.Property(e => e.ZipCode)
                .HasMaxLength(50)
                .HasComment("Zip Code");

            entity.HasOne(d => d.Facility).WithMany(p => p.TblPatientAddrHistories)
                .HasForeignKey(d => d.FacilityId)
                .HasConstraintName("FK_tblPatientAddrHistory_tblFacility");

            entity.HasOne(d => d.Patient).WithMany(p => p.TblPatientAddrHistories)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblPatientAddrHistory_tblPatientBasicInfo");
        });

        modelBuilder.Entity<TblPatientBasicInfo>(entity =>
        {
            entity.HasKey(e => e.PatientId);

            entity.ToTable("tblPatientBasicInfo");

            entity.Property(e => e.PatientId)
                .HasComment("Auto Generated ID")
                .HasColumnName("PatientID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("Login User ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.Dlidnumber)
                .HasMaxLength(50)
                .HasColumnName("DLIDNumber");
            entity.Property(e => e.Dob)
                .HasComment("Patient Date of Birth")
                .HasColumnType("date")
                .HasColumnName("DOB");
            entity.Property(e => e.Ethnicity)
                .HasMaxLength(50)
                .HasComment("Patient Ethnicity (Hispanic or Latino, Not Hispanic or Latino, Not Specified)");
            entity.Property(e => e.Fname)
                .IsRequired()
                .HasComment("Patient First Name")
                .HasColumnName("FName");
            entity.Property(e => e.Gender)
                .IsRequired()
                .HasMaxLength(50)
                .HasComment("Patient Gender (Male, Female, Intersex, Prefer not to answer, Unknown)");
            entity.Property(e => e.Lname)
                .IsRequired()
                .HasComment("Patient Last Name")
                .HasColumnName("LName");
            entity.Property(e => e.Mname)
                .HasComment("Patient Middle Name")
                .HasColumnName("MName");
            entity.Property(e => e.PassPortNumber)
                .HasMaxLength(50)
                .HasComment("Patient Valid Passport Number");
            entity.Property(e => e.PatientType).HasMaxLength(50);
            entity.Property(e => e.PatientUserId)
                .HasMaxLength(50)
                .HasComment("Patient Login UserID (Patient Portal)")
                .HasColumnName("PatientUserID");
            entity.Property(e => e.Race)
                .HasMaxLength(50)
                .HasComment("Patient Race (Asian, White, Black, American Indian / AK, Hawaiian/Pacific, Not Specified, Unknown, Other)");
            entity.Property(e => e.SocialSecurityNumber)
                .HasMaxLength(50)
                .HasComment("Patient Social Security Number");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login User ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblPatientInsurance>(entity =>
        {
            entity.HasKey(e => e.PatientInsuranceId);

            entity.ToTable("tblPatientInsurance");

            entity.Property(e => e.PatientInsuranceId)
                .HasComment("Auto Generated ID")
                .HasColumnName("PatientInsuranceID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("User Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Date and Time");
            entity.Property(e => e.GroupNumber)
                .HasMaxLength(50)
                .HasComment("Group Number");
            entity.Property(e => e.InsuranceId)
                .HasComment("Insurance ID (tblInsuranceSetup)")
                .HasColumnName("InsuranceID");
            entity.Property(e => e.InsurancePhoneNumbr).HasMaxLength(50);
            entity.Property(e => e.InsuranceProviderId)
                .HasComment("Insurance Provider ID (tblInsuranceProvider)")
                .HasColumnName("InsuranceProviderID");
            entity.Property(e => e.PatientId)
                .HasComment("Patient ID (tblPatientBasicInfo)")
                .HasColumnName("PatientID");
            entity.Property(e => e.PolicyId)
                .HasMaxLength(50)
                .HasComment("Policy ID")
                .HasColumnName("PolicyID");
            entity.Property(e => e.Sdob)
                .HasComment("Subscriber Date of Birth")
                .HasColumnType("date")
                .HasColumnName("SDOB");
            entity.Property(e => e.Sfname)
                .HasComment("Subscriber First Name")
                .HasColumnName("SFName");
            entity.Property(e => e.Slname)
                .HasComment("Subscriber Last Name")
                .HasColumnName("SLName");
            entity.Property(e => e.Srelation)
                .HasMaxLength(10)
                .IsFixedLength()
                .HasComment("Subscriber Relation (Relation with Subscriber) Like Spouse, Father, Son etc.")
                .HasColumnName("SRelation");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("User Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Date and Time");

            entity.HasOne(d => d.Patient).WithMany(p => p.TblPatientInsurances)
                .HasForeignKey(d => d.PatientId)
                .HasConstraintName("FK_tblPatientInsurance_tblPatientBasicInfo");
        });

        modelBuilder.Entity<TblPatientLoginUser>(entity =>
        {
            entity.HasKey(e => e.PatientLoginId);

            entity.ToTable("tblPatientLoginUser");

            entity.Property(e => e.PatientLoginId)
                .HasComment("Auto Generated ID")
                .HasColumnName("PatientLoginID");
            entity.Property(e => e.Email).HasComment("Patient Email (Receive email for username and password)");
            entity.Property(e => e.LoginPassword).HasComment("Login User Password");
            entity.Property(e => e.Mobile)
                .HasMaxLength(50)
                .HasComment("Patient Mobile Number (Receive SMS regarding login etc.)");
            entity.Property(e => e.PatientId)
                .HasComment("Patient ID (tblPatientAddInfo)")
                .HasColumnName("PatientID");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login User ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Updated Date and Time");
            entity.Property(e => e.UserName)
                .IsRequired()
                .HasMaxLength(50)
                .HasComment("Login User Name");

            entity.HasOne(d => d.Patient).WithMany(p => p.TblPatientLoginUsers)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblPatientLoginUser_tblPatientBasicInfo");
        });

        modelBuilder.Entity<TblPrinterSetup>(entity =>
        {
            entity.ToTable("tblPrinterSetup");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.LabId).HasColumnName("LabID");
        });

        modelBuilder.Entity<TblRequestToken>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.CreateDate }).HasName("PK__tblReque__1B69CDFFDD3EA812");

            entity.ToTable("tblRequestToken");

            entity.Property(e => e.UserId).HasMaxLength(300);
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsValid)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.Token).IsRequired();
        });

        modelBuilder.Entity<TblRequisition>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblRequi__3214EC079DB20BA2");

            entity.ToTable("tblRequisitions");

            entity.Property(e => e.Id)
                .HasMaxLength(300)
                .HasDefaultValueSql("(newid())");
            entity.Property(e => e.DeletedByUserId).HasMaxLength(300);
        });

        modelBuilder.Entity<TblRequisitionAddInfo>(entity =>
        {
            entity.HasKey(e => e.RequisitionAddInfoId);

            entity.ToTable("tblRequisitionAddInfo");

            entity.Property(e => e.RequisitionAddInfoId)
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("RequisitionAddInfoID");
            entity.Property(e => e.ControlId).HasColumnName("ControlID");
            entity.Property(e => e.KeyId)
                .HasMaxLength(50)
                .HasComment("Key ID (JSN)")
                .HasColumnName("KeyID");
            entity.Property(e => e.KeyValue).HasComment("Key Value (JSN)");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Requisition Type ID (tblRequisitionType / tblRequisitionGroupinfo Tables)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.RequisitionGroupId)
                .HasComment("Requisition Group ID (tblRequisitionGroupInfo Table)")
                .HasColumnName("RequisitionGroupID");
            entity.Property(e => e.RequisitionId)
                .HasComment("Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)")
                .HasColumnName("RequisitionID");
            entity.Property(e => e.SectionId).HasColumnName("SectionID");

            entity.HasOne(d => d.RequisitionGroup).WithMany(p => p.TblRequisitionAddInfos)
                .HasForeignKey(d => d.RequisitionGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblRequisitionAddInfo_tblRequisitionGroupInfo");
        });

        modelBuilder.Entity<TblRequisitionDrugAllergyCode>(entity =>
        {
            entity.HasKey(e => e.RequisitionDrugId);

            entity.ToTable("tblRequisitionDrugAllergyCodes");

            entity.Property(e => e.RequisitionDrugId).HasColumnName("RequisitionDrugID");
            entity.Property(e => e.DrugCode).HasMaxLength(50);
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.RequisitionGroupId).HasColumnName("RequisitionGroupID");
            entity.Property(e => e.RequisitionId).HasColumnName("RequisitionID");
        });

        modelBuilder.Entity<TblRequisitionFile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblRequi__3214EC078585E095");

            entity.ToTable("tblRequisitionFile");

            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedDate).HasColumnType("datetime");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<TblRequisitionIcd10code>(entity =>
        {
            entity.HasKey(e => e.RequisitionIcd10id);

            entity.ToTable("tblRequisitionICD10Codes");

            entity.Property(e => e.RequisitionIcd10id)
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("RequisitionICD10ID");
            entity.Property(e => e.Icd10code)
                .HasMaxLength(50)
                .HasComment("ICD10 Code")
                .HasColumnName("ICD10Code");
            entity.Property(e => e.Icd10description)
                .HasComment("Description of ICD10 Code")
                .HasColumnName("ICD10Description");
            entity.Property(e => e.Icd10type)
                .HasMaxLength(50)
                .HasComment("ICD10 Code Type")
                .HasColumnName("ICD10Type");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Requisition Type ID (tblRequisitionType / tblRequisitionGroupinfo Tables)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.RequisitionGroupId)
                .HasComment("Requisition Group ID (tblRequisitionGroupInfo Table)")
                .HasColumnName("RequisitionGroupID");
            entity.Property(e => e.RequisitionId)
                .HasComment("Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)")
                .HasColumnName("RequisitionID");

            entity.HasOne(d => d.RequisitionGroup).WithMany(p => p.TblRequisitionIcd10codes)
                .HasForeignKey(d => d.RequisitionGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblRequisitionICD10Codes_tblRequisitionGroupInfo");
        });

        modelBuilder.Entity<TblRequisitionMaster>(entity =>
        {
            entity.HasKey(e => e.RequisitionId);

            entity.ToTable("tblRequisitionMaster");

            entity.Property(e => e.RequisitionId)
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("RequisitionID");
            entity.Property(e => e.Address1).HasComment("Patient Present Address");
            entity.Property(e => e.Address2).HasComment("Patient Present Address");
            entity.Property(e => e.City).HasComment("City ID");
            entity.Property(e => e.CollectedBy).HasMaxLength(30);
            entity.Property(e => e.CollectorId)
                .HasComment("Collector ID (tblFacilityUser Table)")
                .HasColumnName("CollectorID");
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .HasComment("Country ID");
            entity.Property(e => e.County)
                .HasMaxLength(50)
                .HasComment("County");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(200)
                .HasComment("User Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DateReceived).HasColumnType("datetime");
            entity.Property(e => e.DateofCollection).HasComment("Specimen Collection Date");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("User Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Deleted Date and Time");
            entity.Property(e => e.Dob).HasColumnName("DOB");
            entity.Property(e => e.Email).HasComment("Patient Email Address");
            entity.Property(e => e.FacilityId)
                .HasComment("Facility ID (tblLabFacilityAssignment Table)")
                .HasColumnName("FacilityID");
            entity.Property(e => e.Gender)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            entity.Property(e => e.Mileage).HasMaxLength(300);
            entity.Property(e => e.Mobile)
                .HasMaxLength(50)
                .HasComment("Patient Mobile Number");
            entity.Property(e => e.OrderNumber)
                .HasMaxLength(50)
                .HasComment("Order Number");
            entity.Property(e => e.OrderType).HasMaxLength(30);
            entity.Property(e => e.PatientDlId).HasColumnName("Patient_DL_ID");
            entity.Property(e => e.PatientId)
                .HasComment("Patient ID (tblPatientBasicInfo & tblPatientAddInfo Table)")
                .HasColumnName("PatientID");
            entity.Property(e => e.PatientSignatureUrlpath).HasColumnName("PatientSignatureURLPath");
            entity.Property(e => e.Phone)
                .HasMaxLength(50)
                .HasComment("Patient Land Phone Number");
            entity.Property(e => e.PhysicianId)
                .HasComment("Physician ID (tblFacilityUser Table)")
                .HasColumnName("PhysicianID");
            entity.Property(e => e.PhysicianSignatureUrlpath).HasColumnName("PhysicianSignatureURLPath");
            entity.Property(e => e.RequisitionStatus).HasComment("Requisition Status Like Open, Pending, Rejected, Close etc.");
            entity.Property(e => e.StatOrder).HasMaxLength(10);
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .HasComment("State ID");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("User Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
            entity.Property(e => e.Weight).HasMaxLength(30);
            entity.Property(e => e.ZipCode)
                .HasMaxLength(50)
                .HasComment("Zip Code");
        });

        modelBuilder.Entity<TblRequisitionMedicalNecessity>(entity =>
        {
            entity.HasKey(e => e.ReqMedNecessityId);

            entity.ToTable("tblRequisitionMedicalNecessity");

            entity.Property(e => e.ReqMedNecessityId).HasColumnName("ReqMedNecessityID");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.RequisitionGroupId).HasColumnName("RequisitionGroupID");
            entity.Property(e => e.RequisitionId).HasColumnName("RequisitionID");
        });

        modelBuilder.Entity<TblRequisitionMedication>(entity =>
        {
            entity.HasKey(e => e.RequisitionMedId);

            entity.ToTable("tblRequisitionMedications");

            entity.Property(e => e.RequisitionMedId)
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("RequisitionMedID");
            entity.Property(e => e.Consideration)
                .HasMaxLength(50)
                .HasComment("Consideration");
            entity.Property(e => e.Dosage)
                .HasMaxLength(50)
                .HasComment("Dosage");
            entity.Property(e => e.DrugBankId)
                .HasMaxLength(50)
                .HasComment("Drug Bank ID")
                .HasColumnName("DrugBankID");
            entity.Property(e => e.MedicaltionClass)
                .HasMaxLength(50)
                .HasComment("Medication Class");
            entity.Property(e => e.MedicationName).HasComment("Medication Name");
            entity.Property(e => e.MedicationType)
                .HasMaxLength(50)
                .HasComment("Medication Type");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Requisition Type ID (tblRequisitionType / tblRequisitionGroupInfo Table)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.RequisitionGroupId)
                .HasComment("Requisition Group ID (tblRequisitionGroupInfo Table)")
                .HasColumnName("RequisitionGroupID");
            entity.Property(e => e.RequisitionId)
                .HasComment("Requisition ID (tblRequisitionMaster / tblRequisitionGroupInfo Tables)")
                .HasColumnName("RequisitionID");
            entity.Property(e => e.Route)
                .HasMaxLength(50)
                .HasComment("Route");

            entity.HasOne(d => d.RequisitionGroup).WithMany(p => p.TblRequisitionMedications)
                .HasForeignKey(d => d.RequisitionGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblRequisitionMedications_tblRequisitionGroupInfo");
        });

        modelBuilder.Entity<TblRequisitionPanel>(entity =>
        {
            entity.HasKey(e => e.RequisitionPanelId);

            entity.ToTable("tblRequisitionPanels");

            entity.Property(e => e.RequisitionPanelId)
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("RequisitionPanelID");
            entity.Property(e => e.GroupId).HasColumnName("GroupID");
            entity.Property(e => e.PanelId)
                .HasComment("Panel ID (tblPanelSetup / tblGPT_Assignment Tables)")
                .HasColumnName("PanelID");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Requisition Type ID (tblRequisitionType / tblRequisitionGroupInfo Tables)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.RequisitionGroupId)
                .HasComment("Requisition Group ID (tblRequisitionGroupInfo Table)")
                .HasColumnName("RequisitionGroupID");
            entity.Property(e => e.RequisitionId)
                .HasComment("Requisition ID (tblRequisitionMaster / tblRequisitionGroupInfo Tables)")
                .HasColumnName("RequisitionID");

            entity.HasOne(d => d.RequisitionGroup).WithMany(p => p.TblRequisitionPanels)
                .HasForeignKey(d => d.RequisitionGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblRequisitionPanels_tblRequisitionGroupInfo");
        });

        modelBuilder.Entity<TblRequisitionPatientInsurance>(entity =>
        {
            entity.HasKey(e => e.ReqPatInsId);

            entity.ToTable("tblRequisitionPatientInsurance");

            entity.Property(e => e.ReqPatInsId)
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("ReqPatInsID");
            entity.Property(e => e.AccidentDate).HasComment("Date of Accident");
            entity.Property(e => e.AccidentState).HasComment("State");
            entity.Property(e => e.AccidentType).HasComment("Type of Accident (Static Dropdown)");
            entity.Property(e => e.CreatedBy).HasComment("User Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy).HasComment("User Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Deleted Date and Time");
            entity.Property(e => e.InsuranceId)
                .HasComment("Insurance ID (tblInsuranceSetup / tblPatientInsurance Table)")
                .HasColumnName("InsuranceID");
            entity.Property(e => e.InsuranceProviderId).HasColumnName("InsuranceProviderID");
            entity.Property(e => e.PolicyId).HasColumnName("PolicyID");
            entity.Property(e => e.Relation)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.RequisitionId)
                .HasComment("Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)")
                .HasColumnName("RequisitionID");
            entity.Property(e => e.SubscriberDob).HasColumnName("SubscriberDOB");
            entity.Property(e => e.UpdatedBy).HasComment("User Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblRequisitionRecordInfo>(entity =>
        {
            entity.HasKey(e => e.RequisitionGroupId).HasName("PK__tblRequi__8A7C36E0914DD4D4");

            entity.ToTable("tblRequisitionRecordInfo");

            entity.Property(e => e.RequisitionGroupId)
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("RequisitionGroupID");
            entity.Property(e => e.AccessionNumber)
                .HasMaxLength(50)
                .HasComment("Accession Number (Manual or Auto depend on setup)");
            entity.Property(e => e.BillingDate)
                .HasComment("Billing Date")
                .HasColumnType("datetime");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("User Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DateReceived)
                .HasComment("Receive Date")
                .HasColumnType("datetime");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("User Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Deleted Date and Time");
            entity.Property(e => e.LastWorkFlowStatus)
                .HasMaxLength(50)
                .HasComment("Last Status of Requisition(Auto Update)");
            entity.Property(e => e.Lisstatus)
                .HasMaxLength(50)
                .HasComment("LIS Status (Auto Update)")
                .HasColumnName("LISStatus");
            entity.Property(e => e.PublishedDate).HasComment("Publish Date");
            entity.Property(e => e.RecordId)
                .HasMaxLength(50)
                .HasComment("Record ID")
                .HasColumnName("RecordID");
            entity.Property(e => e.RefLabId)
                .HasComment("Reference Lab ID (tblRefLabAssignment Table)")
                .HasColumnName("RefLabID");
            entity.Property(e => e.ReferenceId)
                .HasMaxLength(50)
                .HasComment("Reference ID")
                .HasColumnName("ReferenceID");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Requisition Type ID (tblRequisitionType Table)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.RequisitionId)
                .HasComment("Requisition ID (tblRequisitionMaster Table)")
                .HasColumnName("RequisitionID");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Updated By");
            entity.Property(e => e.UpdatedDate).HasComment("Current Updated Date and Time");
            entity.Property(e => e.ValidationDate).HasComment("Validation Date");
            entity.Property(e => e.WorkFlowStatus)
                .HasMaxLength(50)
                .HasComment("Requisition Status (Auto Update)");
        });

        modelBuilder.Entity<TblRequisitionSpecimen>(entity =>
        {
            entity.HasKey(e => e.RequisitionSpecimenId);

            entity.ToTable("tblRequisitionSpecimens");

            entity.Property(e => e.RequisitionSpecimenId)
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("RequisitionSpecimenID");
            entity.Property(e => e.PanelId)
                .HasComment("Panel ID (tblPanelSetup Table)")
                .HasColumnName("PanelID");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Requisition Type ID (tblRequisitionType  / tblRequisitionGroupinfo Tables)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.RequisitionGroupId)
                .HasComment("Requisition Group ID (tblRequisitionGroupInfo Table)")
                .HasColumnName("RequisitionGroupID");
            entity.Property(e => e.RequisitionId)
                .HasComment("Requisition ID (tblRequisitionMaster  / tblRequisitionGroupinfo Tables)")
                .HasColumnName("RequisitionID");
            entity.Property(e => e.SpecimenBarCode).HasComment("Specimen Bar Code");
            entity.Property(e => e.SpecimenTypeId)
                .HasComment("Specimen Type (tblSpecimenType Table)")
                .HasColumnName("SpecimenTypeID");

            entity.HasOne(d => d.RequisitionGroup).WithMany(p => p.TblRequisitionSpecimen)
                .HasForeignKey(d => d.RequisitionGroupId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblRequisitionSpecimens_tblRequisitionGroupInfo");
        });

        modelBuilder.Entity<TblRequisitionStatus>(entity =>
        {
            entity.HasKey(e => e.ReqStatusId);

            entity.ToTable("tblRequisitionStatus");

            entity.Property(e => e.ReqStatusId).HasColumnName("ReqStatusID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(e => e.DeletedBy).HasMaxLength(200);
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.UpdatedBy).HasMaxLength(200);
        });

        modelBuilder.Entity<TblRequisitionTest>(entity =>
        {
            entity.HasKey(e => e.RequisitionTestlId).HasName("PK_tblRequisitiontests");

            entity.ToTable("tblRequisitionTests");

            entity.Property(e => e.RequisitionTestlId)
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("RequisitionTestlID");
            entity.Property(e => e.PanelId)
                .HasComment("Panel ID (tblPanelSetup / tblGPT_Assignment Tables)")
                .HasColumnName("PanelID");
            entity.Property(e => e.ReqTypeId)
                .HasComment("Requisition Type ID (tblRequisitionType / tblRequisitionGroupInfo Tables)")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.RequisitionGroupId)
                .HasComment("Requisition Group ID (tblRequisitionGroupInfo Table)")
                .HasColumnName("RequisitionGroupID");
            entity.Property(e => e.RequisitionId)
                .HasComment("Requisition ID (tblRequisitionMaster / tblRequisitionGroupInfo Tables)")
                .HasColumnName("RequisitionID");
            entity.Property(e => e.TestId)
                .HasComment("Test ID (tblTestSetup / tblGPT_Assignment Tables)")
                .HasColumnName("TestID");
        });

        modelBuilder.Entity<TblRole>(entity =>
        {
            entity.ToTable("tblRole");

            entity.Property(e => e.CreateBy).IsRequired();
            entity.Property(e => e.Name).IsRequired();
        });

        modelBuilder.Entity<TblRoleClaim>(entity =>
        {
            entity.HasKey(e => new { e.RoleId, e.ClaimId });

            entity.ToTable("tblRoleClaims");

            entity.HasOne(d => d.Role).WithMany(p => p.TblRoleClaims)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblRoleClaims_tblRole");
        });

        modelBuilder.Entity<TblSection>(entity =>
        {
            entity.ToTable("tblSections");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
        });

        modelBuilder.Entity<TblSectionControl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblSecti__3214EC07FF69CB35");

            entity.ToTable("tblSectionControls");

            entity.HasOne(d => d.Control).WithMany(p => p.TblSectionControls)
                .HasForeignKey(d => d.ControlId)
                .HasConstraintName("FK__tblSectio__Contr__3118447E");

            entity.HasOne(d => d.Section).WithMany(p => p.TblSectionControls)
                .HasForeignKey(d => d.SectionId)
                .HasConstraintName("FK__tblSectio__Secti__4D4A6ED8");
        });

        modelBuilder.Entity<TblSheetTemplate>(entity =>
        {
            entity.ToTable("tblSheetTemplates");

            entity.Property(e => e.Id).HasColumnName("ID");
        });

        modelBuilder.Entity<TblShipping>(entity =>
        {
            entity.ToTable("tblShipping");

            entity.HasIndex(e => e.FacilityId, "IX_tblShipping").IsUnique();

            entity.HasOne(d => d.Facility).WithOne(p => p.TblShipping)
                .HasForeignKey<TblShipping>(d => d.FacilityId)
                .HasConstraintName("FK_tblShipping_tblFacility");
        });

        modelBuilder.Entity<TblSpecimenType>(entity =>
        {
            entity.HasKey(e => e.SpecimenTypeId);

            entity.ToTable("tblSpecimenType");

            entity.Property(e => e.SpecimenTypeId)
                .HasComment("Auto Generated ID")
                .HasColumnName("SpecimenTypeID");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.SpecimenPreFix)
                .HasMaxLength(10)
                .IsFixedLength();
            entity.Property(e => e.SpecimenStatus)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.SpecimenType)
                .IsRequired()
                .HasMaxLength(50)
                .HasComment("Specimen Type like Blood, Urine etc.");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblTempCompendiumPanelTestUpload>(entity =>
        {
            entity.ToTable("tblTempCompendiumPanelTestUpload");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.UploadStatus).IsRequired();
        });

        modelBuilder.Entity<TblTempReportingRulesUpload>(entity =>
        {
            entity.ToTable("tblTempReportingRulesUpload");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.AgeFrom).HasDefaultValueSql("((1))");
            entity.Property(e => e.AgeTo).HasDefaultValueSql("((999))");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.MaxCrticalHigh).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MaxHigh).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MaxLow).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MaxMedium).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MinCriticalHigh).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MinHigh).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MinLow).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.MinMedium).HasColumnType("decimal(18, 0)");
            entity.Property(e => e.UploadStatus).IsRequired();
        });

        modelBuilder.Entity<TblTestType>(entity =>
        {
            entity.HasKey(e => e.TestTypeId);

            entity.ToTable("tblTestType");

            entity.Property(e => e.TestTypeId)
                .HasComment("Auto Generated ID")
                .HasColumnName("TestTypeID");
            entity.Property(e => e.CreatedBy)
                .IsRequired()
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.TestType)
                .IsRequired()
                .HasMaxLength(50)
                .HasComment("Test Type like individual, group");
            entity.Property(e => e.TestTypeStatus)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });

        modelBuilder.Entity<TblUploadFileDetail>(entity =>
        {
            entity.ToTable("tblUploadFileDetail");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Csttime).HasColumnName("CSTTime");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.ProcessedDate).HasColumnType("datetime");
            entity.Property(e => e.ReceivedPath).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(100);
            entity.Property(e => e.UploadPageName).IsRequired();
            entity.Property(e => e.UploadedBy).HasMaxLength(200);
            entity.Property(e => e.UploadedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<TblUserActivity>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblUserA__3214EC27DB0D8E43");

            entity.ToTable("tblUserActivity");

            entity.Property(e => e.Id)
                .HasMaxLength(400)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ID");
            entity.Property(e => e.ActivityActionPage).HasMaxLength(500);
            entity.Property(e => e.CreateDate).HasColumnType("datetime");
            entity.Property(e => e.EventName).HasMaxLength(20);
            entity.Property(e => e.UserId)
                .IsRequired()
                .HasMaxLength(300);
        });

        modelBuilder.Entity<TblUserClaim>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.ClaimId });

            entity.ToTable("tblUserClaims");

            entity.Property(e => e.UserId).HasMaxLength(300);
        });

        modelBuilder.Entity<TblUserRole>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId });

            entity.ToTable("tblUserRole");

            entity.Property(e => e.UserId).HasMaxLength(300);

            entity.HasOne(d => d.Role).WithMany(p => p.TblUserRoles)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblUserRole_tblRole");
        });

        modelBuilder.Entity<TblUserViewRequisition>(entity =>
        {
            entity.ToTable("tblUserViewRequisition");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.ViewRequisitionId).HasColumnName("ViewRequisitionID");
        });

        modelBuilder.Entity<TblUserfavouriteMenu>(entity =>
        {
            entity.ToTable("tblUserfavouriteMenu");

            entity.Property(e => e.FavouriteMenuId).HasColumnName("favouriteMenuId");
            entity.Property(e => e.UserId).HasMaxLength(200);
        });

        modelBuilder.Entity<TblViewRequisitionColumn>(entity =>
        {
            entity.ToTable("tblViewRequisitionColumns");

            entity.Property(e => e.Id).HasColumnName("ID");
        });

        modelBuilder.Entity<TblWorkFlowStatus>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_WorkFlowStatuses");

            entity.ToTable("tblWorkFlowStatuses");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.WorkFlowstatus).IsRequired();
        });

        modelBuilder.Entity<Tbltempark>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tbltempark");

            entity.Property(e => e.Claimid).HasColumnName("claimid");
            entity.Property(e => e.Pageid).HasColumnName("pageid");
        });

        modelBuilder.Entity<ToxConfirmationToxCompendium>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ToxConfirmationToxCompendium");

            entity.Property(e => e.DrugClass)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.PanelName).HasMaxLength(255);
            entity.Property(e => e.PerformingLab).HasMaxLength(255);
            entity.Property(e => e.SpecimenType).HasMaxLength(255);
            entity.Property(e => e.TestCode).HasMaxLength(255);
            entity.Property(e => e.TestName).HasMaxLength(255);
            entity.Property(e => e.Unit).HasMaxLength(255);
        });

        modelBuilder.Entity<ToxInHouseToxCompendium>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ToxInHouseToxCompendium");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.PerformingLab).HasMaxLength(255);
            entity.Property(e => e.RefferenceRanges).HasMaxLength(255);
            entity.Property(e => e.SpecimenType).HasMaxLength(255);
            entity.Property(e => e.TestCode).HasMaxLength(255);
            entity.Property(e => e.TestName).HasMaxLength(255);
            entity.Property(e => e.TestonReq).HasMaxLength(255);
            entity.Property(e => e.ThresholdRanges).HasMaxLength(255);
            entity.Property(e => e.Units).HasMaxLength(255);
        });

        modelBuilder.Entity<ToxPanel>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ToxPanel");

            entity.Property(e => e.CompendiumPanelCode).IsUnicode(false);
            entity.Property(e => e.Cptcodes)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("CPTCodes");
            entity.Property(e => e.CreatedBy).IsUnicode(false);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.EdenPanelCode)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.IsMasterPanel).HasColumnName("isMasterPanel");
            entity.Property(e => e.LabReferenceCode).IsUnicode(false);
            entity.Property(e => e.PanelAbbrevation).IsUnicode(false);
            entity.Property(e => e.PanelDescription).IsUnicode(false);
            entity.Property(e => e.PanelGroupCode).IsUnicode(false);
            entity.Property(e => e.PanelName).IsUnicode(false);
            entity.Property(e => e.PanelType)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.PerformingLab).IsUnicode(false);
            entity.Property(e => e.ReqId)
                .IsUnicode(false)
                .HasColumnName("ReqID");
            entity.Property(e => e.RequistionType)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<ToxPanelTest>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ToxPanelTest");

            entity.Property(e => e.AssociatedMedications).IsUnicode(false);
            entity.Property(e => e.CommonTestName).IsUnicode(false);
            entity.Property(e => e.Cptcodes)
                .IsUnicode(false)
                .HasColumnName("CPTCodes");
            entity.Property(e => e.CreatedBy).IsUnicode(false);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.CuttOffValues).IsUnicode(false);
            entity.Property(e => e.DrugClassName).IsUnicode(false);
            entity.Property(e => e.EdenOrderTestCode)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EdenResultTestCode)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.IntegrationType).IsUnicode(false);
            entity.Property(e => e.LabReferenceCode).IsUnicode(false);
            entity.Property(e => e.LabTestName).IsUnicode(false);
            entity.Property(e => e.Loinc)
                .IsUnicode(false)
                .HasColumnName("LOINC");
            entity.Property(e => e.PanelCode).IsUnicode(false);
            entity.Property(e => e.PanelGroupCode).IsUnicode(false);
            entity.Property(e => e.PanelType).IsUnicode(false);
            entity.Property(e => e.PerformingLab).IsUnicode(false);
            entity.Property(e => e.ReceivedBy)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ReqId)
                .IsUnicode(false)
                .HasColumnName("ReqID");
            entity.Property(e => e.RequisitionType).IsUnicode(false);
            entity.Property(e => e.SpecimentType).IsUnicode(false);
            entity.Property(e => e.SubPanel).IsUnicode(false);
            entity.Property(e => e.SystemTestName).IsUnicode(false);
            entity.Property(e => e.Units).IsUnicode(false);
            entity.Property(e => e.UpdatedBy).IsUnicode(false);
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
            entity.Property(e => e.UpperLimit).IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
