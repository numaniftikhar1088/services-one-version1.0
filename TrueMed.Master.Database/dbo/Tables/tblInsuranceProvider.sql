CREATE TABLE [dbo].[tblInsuranceProvider] (
    [InsuranceProviderID] INT            IDENTITY (1, 1) NOT NULL,
    [ProviderName]        NVARCHAR (MAX) NULL,
    [Address1]            NVARCHAR (MAX) NULL,
    [Address2]            NVARCHAR (MAX) NULL,
    [City]                NVARCHAR (MAX) NULL,
    [State]               NVARCHAR (50)  NULL,
    [ZipCode]             NVARCHAR (50)  NULL,
    [LandPhone]           NVARCHAR (50)  NULL,
    [ProviderCode]        NVARCHAR (50)  NULL,
    [ProviderStatus]      BIT            CONSTRAINT [DF__tblInsura__Provi__2AD55B43] DEFAULT ((1)) NOT NULL,
    [CreatedBy]           NVARCHAR (MAX) NOT NULL,
    [CreatedDate]         DATETIME2 (7)  NOT NULL,
    [UpdatedBy]           NVARCHAR (MAX) NULL,
    [UpdatedDate]         DATETIME2 (7)  NULL,
    [DeletedBy]           NVARCHAR (MAX) NULL,
    [DeletedDate]         DATETIME2 (7)  NULL,
    [IsDeleted]           BIT            CONSTRAINT [DF_tblInsuranceProvider_IsDeleted] DEFAULT ((0)) NULL,
    CONSTRAINT [PK_tblInsuranceProvider] PRIMARY KEY CLUSTERED ([InsuranceProviderID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceProvider', @level2type = N'COLUMN', @level2name = N'InsuranceProviderID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance Provider Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceProvider', @level2type = N'COLUMN', @level2name = N'ProviderName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceProvider', @level2type = N'COLUMN', @level2name = N'ProviderStatus';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceProvider', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceProvider', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceProvider', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceProvider', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceProvider', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblInsuranceProvider', @level2type = N'COLUMN', @level2name = N'DeletedDate';

