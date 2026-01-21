CREATE TABLE [dbo].[tblControls] (
    [ID]                   INT            IDENTITY (1, 1) NOT NULL,
    [ControlKey]           NVARCHAR (MAX) NOT NULL,
    [ControlName]          NVARCHAR (MAX) NOT NULL,
    [TypeOfControl]        INT            NULL,
    [DefaultValue]         NVARCHAR (MAX) NULL,
    [Options]              NVARCHAR (MAX) NULL,
    [SortOrder]            INT            NOT NULL,
    [FormatMask]           NVARCHAR (MAX) NULL,
    [ColumnValidation]     NVARCHAR (MAX) NULL,
    [isActive]             BIT            CONSTRAINT [DF_tblControls_isActive] DEFAULT ((1)) NOT NULL,
    [isSystemRequired]     BIT            CONSTRAINT [DF_tblControls_isSystemRequired] DEFAULT ((0)) NOT NULL,
    [IsSystemControl]      BIT            CONSTRAINT [DF_tblControls_IsSystemControl] DEFAULT ((0)) NOT NULL,
    [OrderViewSortOrder]   INT            NULL,
    [OrderViewDisplayType] NVARCHAR (MAX) NULL,
    [CreatedBy]            NVARCHAR (MAX) NOT NULL,
    [CreatedDate]          DATETIME2 (7)  NOT NULL,
    [UpdatedBy]            NVARCHAR (MAX) NULL,
    [UpdatedDate]          DATETIME2 (7)  NULL,
    [TypeOfSection]        INT            NULL,
    [CssStyle]             NVARCHAR (MAX) NULL,
    [DisplayType]          NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblControls] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_tblControls_tblControls] FOREIGN KEY ([ID]) REFERENCES [dbo].[tblControls] ([ID])
);




GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Field/Column Name (Not Editable)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblControls', @level2type = N'COLUMN', @level2name = N'ControlKey';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Field/Column Dispaly Name (Editable)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblControls', @level2type = N'COLUMN', @level2name = N'ControlName';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Field/Column Type', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblControls', @level2type = N'COLUMN', @level2name = N'TypeOfControl';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Default Value, if any', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblControls', @level2type = N'COLUMN', @level2name = N'DefaultValue';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Sorting Order of column on page', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblControls', @level2type = N'COLUMN', @level2name = N'SortOrder';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'0 - General Section 1- Requisition Sections 3- Others', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblControls', @level2type = N'COLUMN', @level2name = N'TypeOfSection';

