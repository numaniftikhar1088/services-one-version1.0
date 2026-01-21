CREATE TABLE [dbo].[tblInsuranceAssignment] (
    [InsuranceAssignmentID] INT            IDENTITY (1, 1) NOT NULL,
    [ProviderID]            INT            NULL,
    [ProviderDisplayName]   NVARCHAR (MAX) NULL,
    [ProviderCode]          NVARCHAR (50)  NULL,
    [InsuranceID]           INT            NULL,
    [InsuranceType]         NVARCHAR (MAX) NULL,
    [OptionID]              INT            NULL,
    [Status]                BIT            CONSTRAINT [DF__tblInsura__Statu__314D4EA8] DEFAULT ((1)) NOT NULL,
    [CreatedBy]             NVARCHAR (MAX) NULL,
    [CreatedDate]           DATETIME2 (7)  NULL,
    [UpdatedBy]             NVARCHAR (MAX) NULL,
    [UpdatedDate]           DATETIME2 (7)  NULL,
    [DeletedBy]             NVARCHAR (MAX) NULL,
    [DeletedDate]           DATETIME2 (7)  NULL,
    [IsDeleted]             BIT            CONSTRAINT [DF_tblInsuranceAssignment_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblInsuranceAssignment] PRIMARY KEY CLUSTERED ([InsuranceAssignmentID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'InsuranceAssignmentID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance Provider ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'ProviderID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance Provider Display Name (Provider Name display on Report)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'ProviderDisplayName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance ID (tblInsuranceSetup table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'InsuranceID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'Status';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceAssignment', @level2type = N'COLUMN', @level2name = N'DeletedDate';

