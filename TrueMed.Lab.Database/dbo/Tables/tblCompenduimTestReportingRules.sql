CREATE TABLE [dbo].[tblCompenduimTestReportingRules] (
    [ID]                    INT            IDENTITY (1, 1) NOT NULL,
    [TestConfigID]          INT            NULL,
    [ReportingRuleID]       INT            NULL,
    [PanelTestAssignmentID] INT            NULL,
    [IsActive]              BIT            CONSTRAINT [DF_tblCompenduimTestReportingRules_isActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]             BIT            CONSTRAINT [DF_tblCompenduimTestReportingRules_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedBy]             NVARCHAR (MAX) NOT NULL,
    [CreatedDate]           DATETIME2 (7)  NOT NULL,
    [UpdatedBy]             NVARCHAR (MAX) NULL,
    [UpdatedDate]           DATETIME2 (7)  NULL,
    [DeletedBy]             NVARCHAR (MAX) NULL,
    [DeletedDate]           DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblCompenduimTestReportingRules] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompenduimTestReportingRules', @level2type = N'COLUMN', @level2name = N'IsActive';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompenduimTestReportingRules', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Data and Time of login user time zone', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompenduimTestReportingRules', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompenduimTestReportingRules', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time of login user time zone', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompenduimTestReportingRules', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompenduimTestReportingRules', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Delete Date and Time of login user time zone', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompenduimTestReportingRules', @level2type = N'COLUMN', @level2name = N'DeletedDate';

