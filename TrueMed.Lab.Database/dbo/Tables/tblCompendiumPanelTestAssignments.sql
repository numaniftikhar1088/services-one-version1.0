CREATE TABLE [dbo].[tblCompendiumPanelTestAssignments] (
    [ID]              INT            IDENTITY (1, 1) NOT NULL,
    [PanelID]         INT            NULL,
    [TestConfigID]    INT            NULL,
    [TestID]          INT            NULL,
    [ReportingRuleID] INT            NULL,
    [IsActive]        BIT            CONSTRAINT [DF_Table1_TestStatus_1] DEFAULT ((1)) NOT NULL,
    [IsDeleted]       BIT            CONSTRAINT [DF_tblCompendiumPanelTestAssignments_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedBy]       NVARCHAR (MAX) NOT NULL,
    [CreatedDate]     DATETIME2 (7)  NOT NULL,
    [UpdatedBy]       NVARCHAR (MAX) NULL,
    [UpdatedDate]     DATETIME2 (7)  NULL,
    [DeletedBy]       NVARCHAR (MAX) NULL,
    [DeletedDate]     DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblCompendiumPanelTestAssignments] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'ID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Test Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'TestConfigID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Test Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'TestID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'IsActive';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelTestAssignments', @level2type = N'COLUMN', @level2name = N'DeletedDate';

