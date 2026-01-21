CREATE TABLE [dbo].[tblCompendiumPanels] (
    [ID]              INT            IDENTITY (1, 1) NOT NULL,
    [PanelName]       NVARCHAR (MAX) NOT NULL,
    [ReqTypeID]       INT            NULL,
    [TMITCode]        NVARCHAR (MAX) NULL,
    [Department]      NVARCHAR (MAX) NULL,
    [PanelColor]      NVARCHAR (MAX) NULL,
    [AntibioticClass] NVARCHAR (MAX) NULL,
    [IsResistance]    BIT            CONSTRAINT [DF_tblCompendiumPanels_IsResistance] DEFAULT ((0)) NULL,
    [isActive]        BIT            CONSTRAINT [DF_tblCompendiumPanels_isActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]       BIT            CONSTRAINT [DF_tblCompendiumPanels_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedBy]       NVARCHAR (MAX) NOT NULL,
    [CreatedDate]     DATETIME2 (7)  NOT NULL,
    [UpdatedBy]       NVARCHAR (MAX) NULL,
    [UpdatedDate]     DATETIME2 (7)  NULL,
    [DeletedBy]       NVARCHAR (MAX) NULL,
    [DeletedDate]     DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblCompendiumPanels] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'ID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Panel Name', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'PanelName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Panel Type ID (tblPanelType Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'isActive';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumPanels', @level2type = N'COLUMN', @level2name = N'DeletedDate';

