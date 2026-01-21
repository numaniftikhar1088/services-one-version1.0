CREATE TABLE [dbo].[tblTestType] (
    [TestTypeID]     INT            IDENTITY (1, 1) NOT NULL,
    [TestType]       NVARCHAR (50)  NOT NULL,
    [CreatedBy]      NVARCHAR (200) NOT NULL,
    [CreatedDate]    DATETIME2 (7)  NOT NULL,
    [UpdatedBy]      NVARCHAR (200) NULL,
    [UpdatedDate]    DATETIME2 (7)  NULL,
    [DeletedBy]      NVARCHAR (200) NULL,
    [DeletedDate]    DATETIME2 (7)  NULL,
    [TestTypeStatus] BIT            CONSTRAINT [DF_tblTestType_TestTypeStatus] DEFAULT ((1)) NOT NULL,
    [IsDeleted]      BIT            CONSTRAINT [DF_tblTestType_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblTestType] PRIMARY KEY CLUSTERED ([TestTypeID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblTestType', @level2type = N'COLUMN', @level2name = N'TestTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Test Type like individual, group', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblTestType', @level2type = N'COLUMN', @level2name = N'TestType';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblTestType', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblTestType', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblTestType', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblTestType', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblTestType', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblTestType', @level2type = N'COLUMN', @level2name = N'DeletedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblTestType', @level2type = N'COLUMN', @level2name = N'TestTypeStatus';

