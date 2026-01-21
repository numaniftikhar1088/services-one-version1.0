using Microsoft.EntityFrameworkCore;
using TrueMed.Sevices.MasterEntities;

namespace TrueMed.Business.MasterDBContext;

public partial class MasterDbContext : DbContext
{
    public virtual DbSet<TblApplicationLink> TblApplicationLinks { get; set; }
    public virtual DbSet<TblUserPermission> TblUserPermissions { get; set; }
    public virtual DbSet<TblClaim> TblClaims { get; set; }
    public virtual DbSet<TblControl> TblControls { get; set; }
    public virtual DbSet<TblControlOption> TblControlOptions { get; set; }
    public virtual DbSet<TblControlOptionDependency> TblControlOptionDependencies { get; set; }
    public virtual DbSet<TblControlType> TblControlTypes { get; set; }
    public virtual DbSet<TblDirectorInformation> TblDirectorInformations { get; set; }
    public virtual DbSet<TblDynamicForm> TblDynamicForms { get; set; }
    public virtual DbSet<TblFile> TblFiles { get; set; }
    public virtual DbSet<TblIcd10code> TblIcd10codes { get; set; }
    public virtual DbSet<TblIcdcodeForDemo> TblIcdcodeForDemos { get; set; }
    public virtual DbSet<TblInsuranceProvider> TblInsuranceProviders { get; set; }
    public virtual DbSet<TblInsuranceProviderType> TblInsuranceProviderTypes { get; set; }
    public virtual DbSet<TblInsuranceSetup> TblInsuranceSetups { get; set; }
    public virtual DbSet<TblLab> TblLabs { get; set; }
    public virtual DbSet<TblLabInsPanelNwtype> TblLabInsPanelNwtypes { get; set; }
    public virtual DbSet<TblLabUser> TblLabUsers { get; set; }
    public virtual DbSet<TblLog> TblLogs { get; set; }
    public virtual DbSet<TblMarketPlace> TblMarketPlaces { get; set; }
    public virtual DbSet<TblMasterRefLabAssignment> TblMasterRefLabAssignments { get; set; }
    public virtual DbSet<TblModule> TblModules { get; set; }
    public virtual DbSet<TblModuleSection> TblModuleSections { get; set; }
    public virtual DbSet<TblPage> TblPages { get; set; }
    public virtual DbSet<TblPageSection> TblPageSections { get; set; }
    public virtual DbSet<TblPanel> TblPanels { get; set; }
    public virtual DbSet<TblRefLabAssignment> TblRefLabAssignments { get; set; }
    public virtual DbSet<TblRequestToken> TblRequestTokens { get; set; }
    public virtual DbSet<TblRequisitionType> TblRequisitionTypes { get; set; }
    public virtual DbSet<TblSection> TblSections { get; set; }
    public virtual DbSet<TblSectionControl> TblSectionControls { get; set; }
    public virtual DbSet<TblUser> TblUsers { get; set; }
    public virtual DbSet<TblTest> TblTests { get; set; }
    public virtual DbSet<TblUserAdditionalInfo> TblUserAdditionalInfos { get; set; }
    public virtual DbSet<TblOptionLookup> TblOptionLookups { get; set; }
    public virtual DbSet<TblLabTestPanelAssignment> TblLabTestPanelAssignments { get; set; }
    public virtual DbSet<TblResetPasswordToken> TblResetPasswordTokens { get; set; }
    public virtual DbSet<TblDrugAllergy> TblDrugAllergies { get; set; }
    public virtual DbSet<TblCompendiumPanel> TblCompendiumPanels { get; set; }
    public virtual DbSet<TblCompendiumTest> TblCompendiumTests { get; set; }
    public virtual DbSet<TblRequisitionEncodedText> TblRequisitionEncodedTexts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:MasterDBConnectionString");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TblClaim>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblClaim__3214EC0799560693");

            entity.ToTable("tblClaims");

            entity.Property(e => e.Name).HasMaxLength(300);
        });

        modelBuilder.Entity<TblApplicationLink>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblAppli__3214EC0712DC314B");

            entity.ToTable("tblApplicationLinks");

            entity.Property(e => e.PermissionLink)
                .IsRequired()
                .HasMaxLength(350);
            entity.Property(e => e.PermissionName)
                .IsRequired()
                .HasMaxLength(150);

            entity.HasOne(d => d.Module).WithMany(p => p.TblApplicationLinks)
                .HasForeignKey(d => d.ModuleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblApplic__Modul__1D314762");

            entity.HasOne(d => d.Page).WithMany(p => p.TblApplicationLinks)
                .HasForeignKey(d => d.PageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblApplic__PageI__1C3D2329");
        });
        modelBuilder.Entity<TblUserPermission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblUserP__3214EC07C29E5C27");

            entity.ToTable("tblUserPermission");

            entity.Property(e => e.UserId)
                .IsRequired()
                .HasMaxLength(200);

            entity.HasOne(d => d.Permission).WithMany(p => p.TblUserPermissions)
                .HasForeignKey(d => d.PermissionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblUserPe__Permi__23DE44F1");

            entity.HasOne(d => d.User).WithMany(p => p.TblUserPermissions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tblUserPe__UserI__22EA20B8");
        });

        modelBuilder.Entity<TblControl>(entity =>
        {
            entity.ToTable("tblControls");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ControlKey)
                .IsRequired()
                .HasComment("Field/Column Name (Not Editable)");
            entity.Property(e => e.ControlName)
                .IsRequired()
                .HasComment("Field/Column Dispaly Name (Editable)");
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.DefaultValue).HasComment("Default Value, if any");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasColumnName("isActive");
            entity.Property(e => e.IsSystemRequired).HasColumnName("isSystemRequired");
            entity.Property(e => e.SortOrder).HasComment("Sorting Order of column on page");
            entity.Property(e => e.TypeOfControl).HasComment("Field/Column Type");
            entity.Property(e => e.TypeOfSection).HasComment("0 - General Section 1- Requisition Sections 3- Others");
        });

        modelBuilder.Entity<TblControlOption>(entity =>
        {
            entity.HasKey(e => e.OptionId).HasName("PK_tblControlOptions_1");

            entity.ToTable("tblControlOptions");

            entity.Property(e => e.OptionId).HasColumnName("OptionID");
            entity.Property(e => e.ControlId).HasColumnName("ControlID");
            entity.Property(e => e.IsDefaultSelected).HasColumnName("isDefaultSelected");
            entity.Property(e => e.IsVisible)
                .IsRequired()
                .HasDefaultValueSql("((1))");
        });
        modelBuilder.Entity<TblControlOptionDependency>(entity =>
        {
            entity.ToTable("tblControlOptionDependency");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ControlId).HasColumnName("ControlID");
            entity.Property(e => e.DependentControlId).HasColumnName("DependentControlID");
            entity.Property(e => e.OptionId).HasColumnName("OptionID");
        });


        modelBuilder.Entity<TblControlType>(entity =>
        {
            entity.HasKey(e => e.ControlId);

            entity.ToTable("tblControlType");

            entity.Property(e => e.ControlId)
                .ValueGeneratedNever()
                .HasColumnName("ControlID");
            entity.Property(e => e.IsVisible)
                .IsRequired()
                .HasDefaultValueSql("((1))");
        });

        modelBuilder.Entity<TblDirectorInformation>(entity =>
        {
            entity.ToTable("tblDirectorInformation");

            entity.Property(e => e.Address1).HasMaxLength(200);
            entity.Property(e => e.Address2).HasMaxLength(200);
            entity.Property(e => e.CapInfoNumber).HasMaxLength(250);
            entity.Property(e => e.City).HasMaxLength(200);
            entity.Property(e => e.EmailAddress).HasMaxLength(200);
            entity.Property(e => e.FirstName).HasMaxLength(200);
            entity.Property(e => e.LastName).HasMaxLength(200);
            entity.Property(e => e.MiddleName).HasMaxLength(200);
            entity.Property(e => e.Mobile).HasMaxLength(200);
            entity.Property(e => e.NoCapProvider).HasMaxLength(250);
            entity.Property(e => e.Phone).HasMaxLength(200);
            entity.Property(e => e.State).HasMaxLength(200);
            entity.Property(e => e.ZipCode).HasMaxLength(50);

            entity.HasOne(d => d.Lab).WithMany(p => p.TblDirectorInformations)
                .HasForeignKey(d => d.LabId)
                .HasConstraintName("FK_tblDirectorInformation_tblLabs");
        });

        modelBuilder.Entity<TblDynamicForm>(entity =>
        {
            entity.HasKey(e => e.Key).HasName("PK__tblDynam__C41E0288DE5F4B24");

            entity.ToTable("tblDynamicForms");

            entity.Property(e => e.Key)
                .HasMaxLength(300)
                .IsUnicode(false);
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
        });
        modelBuilder.Entity<TblFile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblFiles__3214EC079E9B09AF");

            entity.ToTable("tblFiles");

            entity.Property(e => e.Id)
                .HasMaxLength(300)
                .HasDefaultValueSql("(newid())");
            entity.Property(e => e.ContentType).HasMaxLength(200);
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.FilePath).HasMaxLength(350);
            entity.Property(e => e.Length).HasMaxLength(200);
            entity.Property(e => e.UserId).HasMaxLength(300);
        });

        modelBuilder.Entity<TblIcd10code>(entity =>
        {
            entity.HasKey(e => e.Icd10id);

            entity.ToTable("tblICD10Codes");

            entity.Property(e => e.Icd10id).HasColumnName("ICD10ID");
            entity.Property(e => e.Icd10code)
                .HasMaxLength(50)
                .HasColumnName("ICD10Code");
            entity.Property(e => e.Icd10status)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasColumnName("ICD10Status");
        });

        modelBuilder.Entity<TblIcdcodeForDemo>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tblICDCodeForDemo");

            entity.Property(e => e.ApprovedBy).IsUnicode(false);
            entity.Property(e => e.ApprovedDate).HasColumnType("datetime");
            entity.Property(e => e.BillingEntity).IsUnicode(false);
            entity.Property(e => e.Code)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CodeType).IsUnicode(false);
            entity.Property(e => e.DeletedBy).IsUnicode(false);
            entity.Property(e => e.DeletedDate).HasColumnType("datetime");
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.MediTechApproved).IsUnicode(false);
            entity.Property(e => e.RecordId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RejectedBy).IsUnicode(false);
            entity.Property(e => e.Rejecteddate).HasColumnType("datetime");
            entity.Property(e => e.RequisitionType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Status).IsUnicode(false);
        });

        modelBuilder.Entity<TblInsuranceProvider>(entity =>
        {
            entity.HasKey(e => e.InsuranceProviderId);

            entity.ToTable("tblInsuranceProvider");

            entity.Property(e => e.InsuranceProviderId)
                .HasComment("Auto Generated ID")
                .HasColumnName("InsuranceProviderID");
            entity.Property(e => e.CreatedBy).HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            entity.Property(e => e.LandPhone).HasMaxLength(50);
            entity.Property(e => e.ProviderCode).HasMaxLength(50);
            entity.Property(e => e.ProviderName).HasComment("Insurance Provider Name");
            entity.Property(e => e.ProviderStatus)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.State).HasMaxLength(50);
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
            entity.Property(e => e.ZipCode).HasMaxLength(50);
        });

        modelBuilder.Entity<TblInsuranceProviderType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblInsur__3214EC274F5BB7DB");

            entity.ToTable("tblInsuranceProviderType");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<TblInsuranceSetup>(entity =>
        {
            entity.HasKey(e => e.InsuranceId);

            entity.ToTable("tblInsuranceSetup");

            entity.Property(e => e.InsuranceId)
                .HasComment("Auto Generated ID")
                .HasColumnName("InsuranceID");
            entity.Property(e => e.CreatedBy).HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy).HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.InsuranceName).HasComment("Insurance Name (Client Bill, Bill Practice, Bill Insurance, Population Study, Self Pay, Commerical, Medicare, Medicaid, Worker's Comp DOI, None)");
            entity.Property(e => e.InsuranceStatus)
                .IsRequired()
                .HasDefaultValueSql("((1))")
                .HasComment("Status (Active, Inactive)");
            entity.Property(e => e.InsuranceType).HasComment("Insurance Type (Federal, Commerical)");
            entity.Property(e => e.IsDeleted).HasDefaultValueSql("((0))");
            entity.Property(e => e.UpdatedBy).HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
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
            entity.Property(e => e.Enter3DigitsLabCode)
                .HasMaxLength(3)
                .IsFixedLength();
            entity.Property(e => e.Enter3DigitsProgram)
                .HasMaxLength(3)
                .IsFixedLength();
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

        modelBuilder.Entity<TblLabInsPanelNwtype>(entity =>
        {
            entity.HasKey(e => e.Lipntid);

            entity.ToTable("tblLabInsPanelNWType");

            entity.Property(e => e.Lipntid).HasColumnName("LIPNTID");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedDate).HasColumnType("datetime");
            entity.Property(e => e.InsuranceId).HasColumnName("InsuranceID");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.NetworkTypeId).HasColumnName("NetworkTypeID");
            entity.Property(e => e.PanelId).HasColumnName("PanelID");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<TblLabUser>(entity =>
        {
            entity.HasKey(e => new { e.LabId, e.UserId }).HasName("PK_tblTenantUsers");

            entity
                .ToTable("tblLabUsers")
                .ToTable(tb => tb.IsTemporal(ttb =>
                {
                    ttb.UseHistoryTable("tblLabUsersHistory", "dbo");
                    ttb
                        .HasPeriodStart("PeriodStart")
                        .HasColumnName("PeriodStart");
                    ttb
                        .HasPeriodEnd("PeriodEnd")
                        .HasColumnName("PeriodEnd");
                }));

            entity.Property(e => e.UserId).HasMaxLength(200);
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.IsDefault).HasDefaultValueSql("((0))");

            entity.HasOne(d => d.Lab).WithMany(p => p.TblLabUsers)
                .HasForeignKey(d => d.LabId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblLabUsers_tblLab");

            entity.HasOne(d => d.User).WithMany(p => p.TblLabUsers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblTenantUsers_tblUser");
        });

        modelBuilder.Entity<TblLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblLogs__3214EC074A03E078");

            entity.ToTable("tblLogs");

            entity.Property(e => e.Id).HasMaxLength(300);
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.LogType).HasDefaultValueSql("((1))");
            entity.Property(e => e.UserId).HasMaxLength(300);
        });

        modelBuilder.Entity<TblMarketPlace>(entity =>
        {
            entity.ToTable("tblMarketPlace");

            entity.Property(e => e.Id)
                .HasMaxLength(300)
                .HasColumnName("ID");
        });

        modelBuilder.Entity<TblMasterRefLabAssignment>(entity =>
        {
            entity.HasKey(e => e.RefLabAssignmentId);

            entity.ToTable("tblMasterRefLabAssignment");

            entity.Property(e => e.RefLabAssignmentId)
                .ValueGeneratedNever()
                .HasComment("Auto Generated ID/Number")
                .HasColumnName("RefLab_AssignmentID");
            entity.Property(e => e.MasterLabId)
                .HasComment("Master / Parent Lab ID")
                .HasColumnName("MasterLabID");
            entity.Property(e => e.RefLabId)
                .HasComment("Reference Lab ID")
                .HasColumnName("RefLabID");
            entity.Property(e => e.Status).HasComment("Status (Active, Inactive)");
        });

        modelBuilder.Entity<TblModule>(entity =>
        {
            entity.ToTable("tblModules");

            entity.Property(e => e.OrderId).HasColumnName("OrderID");

            entity.HasMany(d => d.Pages).WithMany(p => p.Modules)
               .UsingEntity<Dictionary<string, object>>(
                   "TblModulePage",
                   r => r.HasOne<TblPage>().WithMany()
                       .HasForeignKey("PageId")
                       .OnDelete(DeleteBehavior.ClientSetNull)
                       .HasConstraintName("FK_tblModulePages_tblPages"),
                   l => l.HasOne<TblModule>().WithMany()
                       .HasForeignKey("ModuleId")
                       .OnDelete(DeleteBehavior.ClientSetNull)
                       .HasConstraintName("FK_tblModulePages_tblModules"),
                   j =>
                   {
                       j.HasKey("ModuleId", "PageId");
                       j.ToTable("tblModulePages");
                   });
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
            entity.HasKey(e => e.Id).HasName("PK__tblMenu__C99ED2301200842A");

            entity.ToTable("tblPages");

            entity.Property(e => e.ChildId).HasColumnName("ChildID");
            entity.Property(e => e.IsActive).HasDefaultValueSql("((1))");
            entity.Property(e => e.IsVisible)
                .IsRequired()
                .HasDefaultValueSql("((1))");

            entity.HasMany(d => d.Claims).WithMany(p => p.Pages)
                .UsingEntity<Dictionary<string, object>>(
                    "TblPageClaim",
                    r => r.HasOne<TblClaim>().WithMany()
                        .HasForeignKey("ClaimId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_tblPageClaims_tblClaims"),
                    l => l.HasOne<TblPage>().WithMany()
                        .HasForeignKey("PageId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_tblPageClaims_tblPages"),
                    j =>
                    {
                        j.HasKey("PageId", "ClaimId");
                        j.ToTable("tblPageClaims");
                    });
        });
        modelBuilder.Entity<TblPanel>(entity =>
        {
            entity.HasKey(e => e.PanelId);

            entity.ToTable("tblPanels");

            entity.Property(e => e.PanelId).HasColumnName("PanelID");
            entity.Property(e => e.CreatedBy).HasMaxLength(200);
            entity.Property(e => e.DeletedBy).HasMaxLength(200);
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.NetworkType).IsUnicode(false);
            entity.Property(e => e.Tmitcode)
                .HasMaxLength(50)
                .HasColumnName("TMITCode");
            entity.Property(e => e.UpdatedBy).HasMaxLength(200);
        });
        modelBuilder.Entity<TblPageSection>(entity =>
        {
            entity.HasKey(e => new { e.PageId, e.SectionId });

            entity.ToTable("tblPageSections");

            entity.HasOne(d => d.Claim).WithMany(p => p.TblPageSections)
                .HasForeignKey(d => d.ClaimId)
                .HasConstraintName("FK_tblPageSections_tblClaims");

            entity.HasOne(d => d.Page).WithMany(p => p.TblPageSections)
                .HasForeignKey(d => d.PageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblPageSections_tblPages");

            entity.HasOne(d => d.Section).WithMany(p => p.TblPageSections)
                .HasForeignKey(d => d.SectionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tblPageSections_tblSections");
        });

        modelBuilder.Entity<TblRefLabAssignment>(entity =>
        {
            entity.HasKey(e => new { e.RefLabId, e.LabId }).HasName("PK__tblRefLa__733E4FADFD657A71");

            entity.ToTable("tblRefLabAssignment");

            entity.Property(e => e.CreatedBy).HasMaxLength(200);
            entity.Property(e => e.Status).HasColumnName("STATUS");
            entity.Property(e => e.UpdateBy).HasMaxLength(200);
        });

        modelBuilder.Entity<TblRequestToken>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.CreateDate }).HasName("PK__tblReque__1B69CDFF1DD780D2");

            entity.ToTable("tblRequestToken");

            entity.Property(e => e.UserId).HasMaxLength(300);
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.IsValid)
                .IsRequired()
                .HasDefaultValueSql("((1))");
        });

        modelBuilder.Entity<TblRequisitionType>(entity =>
        {
            entity.HasKey(e => e.ReqTypeId);

            entity.ToTable("tblRequisitionType");

            entity.Property(e => e.ReqTypeId)
                .HasComment("Auto Generated ID")
                .HasColumnName("ReqTypeID");
            entity.Property(e => e.CreatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.CreatedDate).HasComment("Current Created Date and Time");
            entity.Property(e => e.DeletedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.DeletedDate).HasComment("Current Date and Time");
            entity.Property(e => e.IsDeleted).HasComment("Status (Active, Inactive)");
            entity.Property(e => e.ReqStatus)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.RequisitionType)
                .HasMaxLength(50)
                .HasComment("Requisition Type");
            entity.Property(e => e.RequisitionTypeName).HasComment("Requisition Type Name like Infectious Disease, Blood, Tox etc.");
            entity.Property(e => e.UpdatedBy)
                .HasMaxLength(200)
                .HasComment("Login ID");
            entity.Property(e => e.UpdatedDate).HasComment("Current Modify Date and Time");
        });
        modelBuilder.Entity<TblSection>(entity =>
        {
            entity.ToTable("tblSections");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ParentId).HasColumnName("ParentID");
        });

        modelBuilder.Entity<TblSectionControl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblSecti__3214EC073AB4FAD0");

            entity.ToTable("tblSectionControls");

            entity.HasOne(d => d.Control).WithMany(p => p.TblSectionControls)
                .HasForeignKey(d => d.ControlId)
                .HasConstraintName("FK__tblSectio__Contr__3118447E");

            entity.HasOne(d => d.Section).WithMany(p => p.TblSectionControls)
                .HasForeignKey(d => d.SectionId)
                .HasConstraintName("FK__tblSectio__Secti__30242045");
        });
        modelBuilder.Entity<TblTest>(entity =>
        {
            entity.HasKey(e => e.TestId);

            entity.ToTable("tblTests");

            entity.Property(e => e.TestId).HasColumnName("TestID");
            entity.Property(e => e.CreatedBy).HasMaxLength(200);
            entity.Property(e => e.DeletedBy).HasMaxLength(200);
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.NetworkType).IsUnicode(false);
            entity.Property(e => e.Tmitcode)
                .HasMaxLength(50)
                .HasColumnName("TMITCode");
            entity.Property(e => e.UpdatedBy).HasMaxLength(200);
        });
        modelBuilder.Entity<TblUser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblUser__3214EC07A7CB5367");

            entity.ToTable("tblUser");

            entity.Property(e => e.Id)
                .HasMaxLength(200)
                .HasColumnName("ID");
            entity.Property(e => e.Address1).HasMaxLength(200);
            entity.Property(e => e.Address2).HasMaxLength(200);
            entity.Property(e => e.City).HasMaxLength(200);
            entity.Property(e => e.CreateDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.DateOfBirth).HasColumnType("date");
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.FirstName).HasMaxLength(200);
            entity.Property(e => e.Gender).HasMaxLength(50);
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
            entity.Property(e => e.LastName).HasMaxLength(200);
            entity.Property(e => e.MiddleName).HasMaxLength(200);
            entity.Property(e => e.MobileNumber).HasMaxLength(200);
            entity.Property(e => e.PhoneNumber).HasMaxLength(200);
            entity.Property(e => e.State).HasMaxLength(200);
            entity.Property(e => e.Username).HasMaxLength(200);
            entity.Property(e => e.ZipCode).HasMaxLength(200);
        });

        modelBuilder.Entity<TblUserAdditionalInfo>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__tblUserA__1788CC4C7487147B");

            entity.ToTable("tblUserAdditionalInfo");

            entity.Property(e => e.UserId).HasMaxLength(200);
            entity.Property(e => e.Npi)
                .HasMaxLength(200)
                .HasColumnName("NPI");
            entity.Property(e => e.StateLicenseNo).HasMaxLength(200);
        });
        modelBuilder.Entity<TblOptionLookup>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblSyste__3214EC070D72212F");

            entity.ToTable("tblOptionLookup");

            entity.Property(e => e.IsActive).HasDefaultValueSql("((1))");
            entity.Property(e => e.UserType).HasMaxLength(30);
        });
        modelBuilder.Entity<TblLabTestPanelAssignment>(entity =>
        {
            entity.ToTable("tblLabTestPanelAssignment");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.DeletedDate).HasColumnType("datetime");
            entity.Property(e => e.LabId).HasColumnName("LabID");
            entity.Property(e => e.PanelId).HasColumnName("PanelID");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.TestId).HasColumnName("TestID");
            entity.Property(e => e.UpdatedDate).HasColumnType("datetime");

            entity.HasOne(d => d.Lab).WithMany(p => p.TblLabTestPanelAssignments)
                .HasForeignKey(d => d.LabId)
                .HasConstraintName("FK_tblLabTestPanelAssignment_tblLabs");

            entity.HasOne(d => d.ReqType).WithMany(p => p.TblLabTestPanelAssignments)
                .HasForeignKey(d => d.ReqTypeId)
                .HasConstraintName("FK_tblLabTestPanelAssignment_tblRequisitionType");
        });

        modelBuilder.Entity<TblResetPasswordToken>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblReset__3214EC07599C6D60");

            entity.ToTable("tblResetPasswordToken");

            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.ExpirationDate).HasColumnType("datetime");
        });
        modelBuilder.Entity<TblDrugAllergy>(entity =>
        {
            entity.ToTable("tblDrugAllergies");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Dacode)
                .HasMaxLength(50)
                .HasColumnName("DACode");
            entity.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValueSql("((1))");
        });
        modelBuilder.Entity<TblCompendiumPanel>(entity =>
        {
            entity.ToTable("tblCompendiumPanels");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.Tmitcode).HasColumnName("TMITCode");
        });

        modelBuilder.Entity<TblCompendiumTest>(entity =>
        {
            entity.ToTable("tblCompendiumTests");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.ReqTypeId).HasColumnName("ReqTypeID");
            entity.Property(e => e.Tmitcode).HasColumnName("TMITCode");
        });
        modelBuilder.Entity<TblRequisitionEncodedText>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__tblRequi__3214EC07306F68E5");

            entity.ToTable("tblRequisitionEncodedText");

            entity.Property(e => e.EncodedText).IsRequired();
            entity.Property(e => e.Key).IsRequired();
        });
        OnModelCreatingPartial(modelBuilder);

    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
