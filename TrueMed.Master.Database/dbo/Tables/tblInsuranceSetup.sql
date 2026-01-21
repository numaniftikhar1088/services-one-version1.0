CREATE TABLE [dbo].[tblInsuranceSetup] (
    [InsuranceID]     INT            IDENTITY (1, 1) NOT NULL,
    [InsuranceType]   NVARCHAR (MAX) NULL,
    [InsuranceName]   NVARCHAR (MAX) NULL,
    [InsuranceStatus] BIT            CONSTRAINT [DF_tblInsuranceSetup_InsuranceStatus] DEFAULT ((1)) NOT NULL,
    [CreatedBy]       NVARCHAR (MAX) NOT NULL,
    [CreatedDate]     DATETIME2 (7)  NOT NULL,
    [UpdatedBy]       NVARCHAR (MAX) NULL,
    [UpdatedDate]     DATETIME2 (7)  NULL,
    [DeletedBy]       NVARCHAR (MAX) NULL,
    [DeletedDate]     DATETIME2 (7)  NULL,
    [IsDeleted]       BIT            CONSTRAINT [DF_tblInsuranceSetup_IsDeleted] DEFAULT ((0)) NULL,
    CONSTRAINT [PK_tblInsuranceSetup] PRIMARY KEY CLUSTERED ([InsuranceID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'InsuranceID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance Type (Federal, Commerical)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'InsuranceType';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance Name (Client Bill, Bill Practice, Bill Insurance, Population Study, Self Pay, Commerical, Medicare, Medicaid, Worker''s Comp DOI, None)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'InsuranceName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'InsuranceStatus';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceSetup', @level2type = N'COLUMN', @level2name = N'DeletedDate';

