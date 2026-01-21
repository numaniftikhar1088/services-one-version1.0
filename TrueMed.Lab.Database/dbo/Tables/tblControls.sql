CREATE TABLE [dbo].[tblControls] (
    [ID]               INT            IDENTITY (1, 1) NOT NULL,
    [ControlKey]       NVARCHAR (MAX) NOT NULL,
    [ControlName]      NVARCHAR (MAX) NOT NULL,
    [TypeOfControl]    INT            NOT NULL,
    [DefaultValue]     NVARCHAR (MAX) NULL,
    [Options]          NVARCHAR (MAX) NULL,
    [SortOrder]        INT            NOT NULL,
    [isActive]         BIT            CONSTRAINT [DF_tblControls_isActive] DEFAULT ((1)) NOT NULL,
    [isSystemRequired] BIT            CONSTRAINT [DF_tblControls_isSystemRequired] DEFAULT ((0)) NOT NULL,
    [IsSystemControl]  BIT            CONSTRAINT [DF_tblControls_IsSystemControl] DEFAULT ((0)) NOT NULL,
    [CreatedBy]        NVARCHAR (MAX) NOT NULL,
    [CreatedDate]      DATETIME2 (7)  NOT NULL,
    [UpdatedBy]        NVARCHAR (MAX) NULL,
    [UpdatedDate]      DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblControls] PRIMARY KEY CLUSTERED ([ID] ASC)
);

