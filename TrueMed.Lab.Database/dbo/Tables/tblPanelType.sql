CREATE TABLE [dbo].[tblPanelType] (
    [PanelTypeID]     INT            IDENTITY (1, 1) NOT NULL,
    [PanelType]       NVARCHAR (50)  NOT NULL,
    [CreatedBy]       NVARCHAR (200) NOT NULL,
    [CreatedDate]     DATETIME2 (7)  NOT NULL,
    [UpdatedBy]       NVARCHAR (200) NULL,
    [UpdatedDate]     DATETIME2 (7)  NULL,
    [DeletedBy]       NVARCHAR (200) NULL,
    [DeletedDate]     DATETIME2 (7)  NULL,
    [PanelTypeStatus] BIT            CONSTRAINT [DF__tblPanelT__Panel__65370702] DEFAULT ((1)) NOT NULL,
    [IsDeleted]       BIT            CONSTRAINT [DF_tblPanelType_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblPanelType] PRIMARY KEY CLUSTERED ([PanelTypeID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPanelType', @level2type = N'COLUMN', @level2name = N'PanelTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Panel Type', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPanelType', @level2type = N'COLUMN', @level2name = N'PanelType';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPanelType', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPanelType', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPanelType', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPanelType', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPanelType', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPanelType', @level2type = N'COLUMN', @level2name = N'DeletedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblPanelType', @level2type = N'COLUMN', @level2name = N'PanelTypeStatus';

