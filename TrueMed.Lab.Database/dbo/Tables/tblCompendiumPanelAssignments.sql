CREATE TABLE [dbo].[tblCompendiumPanelAssignments] (
    [ID]                    INT            IDENTITY (1, 1) NOT NULL,
    [ParentPanelID]         INT            NULL,
    [ChildPanelID]          INT            NULL,
    [PanelDisplayName]      NVARCHAR (MAX) NULL,
    [OrderingMethod]        NVARCHAR (MAX) NULL,
    [RequsitionDispalyType] NVARCHAR (MAX) NULL,
    [ReferenceLabID]        INT            NULL,
    [OrderCode]             NVARCHAR (MAX) NULL,
    [SortOrder]             INT            NULL,
    [IsActive]              BIT            CONSTRAINT [DF_tblCompendiumPanelAssignments_isActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]             BIT            CONSTRAINT [DF_tblCompendiumPanelAssignments_IsDeleted] DEFAULT ((0)) NULL,
    [CreatedBy]             NVARCHAR (MAX) NOT NULL,
    [CreatedDate]           DATETIME2 (7)  NOT NULL,
    [UpdatedBy]             NVARCHAR (MAX) NULL,
    [UpdatedDate]           DATETIME2 (7)  NULL,
    [DeletedBy]             NVARCHAR (MAX) NULL,
    [DeletedDate]           DATETIME2 (7)  NULL,
    [PanelTypeId]           INT            NULL,
    CONSTRAINT [PK_tblCompendiumPanelAssignments] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelAssignments', @level2type = N'COLUMN', @level2name = N'IsActive';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelAssignments', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelAssignments', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelAssignments', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelAssignments', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelAssignments', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanelAssignments', @level2type = N'COLUMN', @level2name = N'DeletedDate';

